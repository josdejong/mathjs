import { isParenthesisNode } from '../../utils/is.js'
import { isConstantNode, isVariableNode, isNumericNode, isConstantExpression } from './simplify/wildcards.js'
import { factory } from '../../utils/factory.js'
import { createUtil } from './simplify/util.js'
import { hasOwnProperty } from '../../utils/object.js'
import { createEmptyMap, createMap } from '../../utils/map.js'

const name = 'simplify'
const dependencies = [
  'typed',
  'parse',
  'equal',
  'resolve',
  'simplifyConstant',
  'simplifyCore',
  'AccessorNode',
  'ArrayNode',
  'ConstantNode',
  'FunctionNode',
  'IndexNode',
  'ObjectNode',
  'OperatorNode',
  'ParenthesisNode',
  'SymbolNode',
  'replacer'
]

export const createSimplify = /* #__PURE__ */ factory(name, dependencies, (
  {
    typed,
    parse,
    equal,
    resolve,
    simplifyConstant,
    simplifyCore,
    AccessorNode,
    ArrayNode,
    ConstantNode,
    FunctionNode,
    IndexNode,
    ObjectNode,
    OperatorNode,
    ParenthesisNode,
    SymbolNode,
    replacer
  }
) => {
  const { hasProperty, isCommutative, isAssociative, mergeContext, flatten, unflattenr, unflattenl, createMakeNodeFunction, defaultContext, realContext, positiveContext } =
    createUtil({ FunctionNode, OperatorNode, SymbolNode })

  /**
   * Simplify an expression tree.
   *
   * A list of rules are applied to an expression, repeating over the list until
   * no further changes are made.
   * It's possible to pass a custom set of rules to the function as second
   * argument. A rule can be specified as an object, string, or function:
   *
   *     const rules = [
   *       { l: 'n1*n3 + n2*n3', r: '(n1+n2)*n3' },
   *       'n1*n3 + n2*n3 -> (n1+n2)*n3',
   *       function (node) {
   *         // ... return a new node or return the node unchanged
   *         return node
   *       }
   *     ]
   *
   * String and object rules consist of a left and right pattern. The left is
   * used to match against the expression and the right determines what matches
   * are replaced with. The main difference between a pattern and a normal
   * expression is that variables starting with the following characters are
   * interpreted as wildcards:
   *
   * - 'n' - Matches any node [Node]
   * - 'c' - Matches a constant literal (5 or 3.2) [ConstantNode]
   * - 'cl' - Matches a constant literal; same as c [ConstantNode]
   * - 'cd' - Matches a decimal literal (5 or -3.2) [ConstantNode or unaryMinus wrapping a ConstantNode]
   * - 'ce' - Matches a constant expression (-5 or √3) [Expressions consisting of only ConstantNodes, functions, and operators]
   * - 'v' - Matches a variable; anything not matched by c (-5 or x) [Node that is not a ConstantNode]
   * - 'vl' - Matches a variable literal (x or y) [SymbolNode]
   * - 'vd' - Matches a non-decimal expression; anything not matched by cd (x or √3) [Node that is not a ConstantNode or unaryMinus that is wrapping a ConstantNode]
   * - 've' - Matches a variable expression; anything not matched by ce (x or 2x) [Expressions that contain a SymbolNode or other non-constant term]
   *
   * The default list of rules is exposed on the function as `simplify.rules`
   * and can be used as a basis to built a set of custom rules. Note that since
   * the `simplifyCore` function is in the default list of rules, by default
   * simplify will convert any function calls in the expression that have
   * operator equivalents to their operator forms.
   *
   * To specify a rule as a string, separate the left and right pattern by '->'
   * When specifying a rule as an object, the following keys are meaningful:
   * - l - the left pattern
   * - r - the right pattern
   * - s - in lieu of l and r, the string form that is broken at -> to give them
   * - repeat - whether to repeat this rule until the expression stabilizes
   * - assuming - gives a context object, as in the 'context' option to
   *     simplify. Every property in the context object must match the current
   *     context in order, or else the rule will not be applied.
   * - imposeContext - gives a context object, as in the 'context' option to
   *     simplify. Any settings specified will override the incoming context
   *     for all matches of this rule.
   *
   * For more details on the theory, see:
   *
   * - [Strategies for simplifying math expressions (Stackoverflow)](https://stackoverflow.com/questions/7540227/strategies-for-simplifying-math-expressions)
   * - [Symbolic computation - Simplification (Wikipedia)](https://en.wikipedia.org/wiki/Symbolic_computation#Simplification)
   *
   *  An optional `options` argument can be passed as last argument of `simplify`.
   *  Currently available options (defaults in parentheses):
   *  - `consoleDebug` (false): whether to write the expression being simplified
   *    and any changes to it, along with the rule responsible, to console
   *  - `context` (simplify.defaultContext): an object giving properties of
   *    each operator, which determine what simplifications are allowed. The
   *    currently meaningful properties are commutative, associative,
   *    total (whether the operation is defined for all arguments), and
   *    trivial (whether the operation applied to a single argument leaves
   *    that argument unchanged). The default context is very permissive and
   *    allows almost all simplifications. Only properties differing from
   *    the default need to be specified; the default context is used as a
   *    fallback. Additional contexts `simplify.realContext` and
   *    `simplify.positiveContext` are supplied to cause simplify to perform
   *    just simplifications guaranteed to preserve all values of the expression
   *    assuming all variables and subexpressions are real numbers or
   *    positive real numbers, respectively. (Note that these are in some cases
   *    more restrictive than the default context; for example, the default
   *    context will allow `x/x` to simplify to 1, whereas
   *    `simplify.realContext` will not, as `0/0` is not equal to 1.)
   *  - `exactFractions` (true): whether to try to convert all constants to
   *    exact rational numbers.
   *  - `fractionsLimit` (10000): when `exactFractions` is true, constants will
   *    be expressed as fractions only when both numerator and denominator
   *    are smaller than `fractionsLimit`.
   *
   * Syntax:
   *
   *     math.simplify(expr)
   *     math.simplify(expr, rules)
   *     math.simplify(expr, rules)
   *     math.simplify(expr, rules, scope)
   *     math.simplify(expr, rules, scope, options)
   *     math.simplify(expr, scope)
   *     math.simplify(expr, scope, options)
   *
   * Examples:
   *
   *     math.simplify('2 * 1 * x ^ (2 - 1)')      // Node "2 * x"
   *     math.simplify('2 * 3 * x', {x: 4})        // Node "24"
   *     const f = math.parse('2 * 1 * x ^ (2 - 1)')
   *     math.simplify(f)                          // Node "2 * x"
   *     math.simplify('0.4 * x', {}, {exactFractions: true})  // Node "x * 2 / 5"
   *     math.simplify('0.4 * x', {}, {exactFractions: false}) // Node "0.4 * x"
   *
   * See also:
   *
   *     simplifyCore, derivative, evaluate, parse, rationalize, resolve
   *
   * @param {Node | string} expr
   *            The expression to be simplified
   * @param {SimplifyRule[]} [rules]
   *            Optional list with custom rules
   * @param {Object} [scope] Optional scope with variables
   * @param {SimplifyOptions} [options] Optional configuration settings
   * @return {Node} Returns the simplified form of `expr`
   */
  typed.addConversion({ from: 'Object', to: 'Map', convert: createMap })
  const simplify = typed('simplify', {
    Node: _simplify,
    'Node, Map': (expr, scope) => _simplify(expr, false, scope),
    'Node, Map, Object':
      (expr, scope, options) => _simplify(expr, false, scope, options),
    'Node, Array': _simplify,
    'Node, Array, Map': _simplify,
    'Node, Array, Map, Object': _simplify
  })
  typed.removeConversion({ from: 'Object', to: 'Map', convert: createMap })

  simplify.defaultContext = defaultContext
  simplify.realContext = realContext
  simplify.positiveContext = positiveContext

  function removeParens (node) {
    return node.transform(function (node) {
      return isParenthesisNode(node)
        ? removeParens(node.content)
        : node
    })
  }

  // All constants that are allowed in rules
  const SUPPORTED_CONSTANTS = {
    true: true,
    false: true,
    e: true,
    i: true,
    Infinity: true,
    LN2: true,
    LN10: true,
    LOG2E: true,
    LOG10E: true,
    NaN: true,
    phi: true,
    pi: true,
    SQRT1_2: true,
    SQRT2: true,
    tau: true
    // null: false,
    // undefined: false,
    // version: false,
  }

  // Array of strings, used to build the ruleSet.
  // Each l (left side) and r (right side) are parsed by
  // the expression parser into a node tree.
  // Left hand sides are matched to subtrees within the
  // expression to be parsed and replaced with the right
  // hand side.
  // TODO: Add support for constraints on constants (either in the form of a '=' expression or a callback [callback allows things like comparing symbols alphabetically])
  // To evaluate lhs constants for rhs constants, use: { l: 'c1+c2', r: 'c3', evaluate: 'c3 = c1 + c2' }. Multiple assignments are separated by ';' in block format.
  // It is possible to get into an infinite loop with conflicting rules
  simplify.rules = [
    simplifyCore,
    // { l: 'n+0', r: 'n' },     // simplifyCore
    // { l: 'n^0', r: '1' },     // simplifyCore
    // { l: '0*n', r: '0' },     // simplifyCore
    // { l: 'n/n', r: '1'},      // simplifyCore
    // { l: 'n^1', r: 'n' },     // simplifyCore
    // { l: '+n1', r:'n1' },     // simplifyCore
    // { l: 'n--n1', r:'n+n1' }, // simplifyCore
    { l: 'log(e)', r: '1' },

    // temporary rules
    // Note initially we tend constants to the right because like-term
    // collection prefers the left, and we would rather collect nonconstants
    {
      s: 'n-n1 -> n+-n1', // temporarily replace 'subtract' so we can further flatten the 'add' operator
      assuming: { subtract: { total: true } }
    },
    {
      s: 'n-n -> 0', // partial alternative when we can't always subtract
      assuming: { subtract: { total: false } }
    },
    {
      s: '-(cl*v) -> v * (-cl)', // make non-constant terms positive
      assuming: { multiply: { commutative: true }, subtract: { total: true } }
    },
    {
      s: '-(cl*v) -> (-cl) * v', // non-commutative version, part 1
      assuming: { multiply: { commutative: false }, subtract: { total: true } }
    },
    {
      s: '-(v*cl) -> v * (-cl)', // non-commutative version, part 2
      assuming: { multiply: { commutative: false }, subtract: { total: true } }
    },
    { l: '-(n1/n2)', r: '-n1/n2' },
    { l: '-v', r: 'v * (-1)' }, // finish making non-constant terms positive
    { l: '(n1 + n2)*(-1)', r: 'n1*(-1) + n2*(-1)', repeat: true }, // expand negations to achieve as much sign cancellation as possible
    { l: 'n/n1^n2', r: 'n*n1^-n2' }, // temporarily replace 'divide' so we can further flatten the 'multiply' operator
    { l: 'n/n1', r: 'n*n1^-1' },
    {
      s: '(n1*n2)^n3 -> n1^n3 * n2^n3',
      assuming: { multiply: { commutative: true } }
    },
    {
      s: '(n1*n2)^(-1) -> n2^(-1) * n1^(-1)',
      assuming: { multiply: { commutative: false } }
    },

    // expand nested exponentiation
    {
      s: '(n ^ n1) ^ n2 -> n ^ (n1 * n2)',
      assuming: { divide: { total: true } } // 1/(1/n) = n needs 1/n to exist
    },

    // collect like factors; into a sum, only do this for nonconstants
    { l: ' vd   * ( vd   * n1 + n2)', r: 'vd^2       * n1 +  vd   * n2' },
    {
      s: ' vd   * (vd^n4 * n1 + n2)   ->  vd^(1+n4)  * n1 +  vd   * n2',
      assuming: { divide: { total: true } } // v*1/v = v^(1+-1) needs 1/v
    },
    {
      s: 'vd^n3 * ( vd   * n1 + n2)   ->  vd^(n3+1)  * n1 + vd^n3 * n2',
      assuming: { divide: { total: true } }
    },
    {
      s: 'vd^n3 * (vd^n4 * n1 + n2)   ->  vd^(n3+n4) * n1 + vd^n3 * n2',
      assuming: { divide: { total: true } }
    },
    { l: 'n*n', r: 'n^2' },
    {
      s: 'n * n^n1 -> n^(n1+1)',
      assuming: { divide: { total: true } } // n*1/n = n^(-1+1) needs 1/n
    },
    {
      s: 'n^n1 * n^n2 -> n^(n1+n2)',
      assuming: { divide: { total: true } } // ditto for n^2*1/n^2
    },

    // Unfortunately, to deal with more complicated cancellations, it
    // becomes necessary to simplify constants twice per pass. It's not
    // terribly expensive compared to matching rules, so this should not
    // pose a performance problem.
    simplifyConstant, // First: before collecting like terms

    // collect like terms
    {
      s: 'n+n -> 2*n',
      assuming: { add: { total: true } } // 2 = 1 + 1 needs to exist
    },
    { l: 'n+-n', r: '0' },
    { l: 'vd*n + vd', r: 'vd*(n+1)' }, // NOTE: leftmost position is special:
    { l: 'n3*n1 + n3*n2', r: 'n3*(n1+n2)' }, // All sub-monomials tried there.
    { l: 'n3^(-n4)*n1 +   n3  * n2', r: 'n3^(-n4)*(n1 + n3^(n4+1) *n2)' },
    { l: 'n3^(-n4)*n1 + n3^n5 * n2', r: 'n3^(-n4)*(n1 + n3^(n4+n5)*n2)' },
    // noncommutative additional cases (term collection & factoring)
    {
      s: 'n*vd + vd -> (n+1)*vd',
      assuming: { multiply: { commutative: false } }
    },
    {
      s: 'vd + n*vd -> (1+n)*vd',
      assuming: { multiply: { commutative: false } }
    },
    {
      s: 'n1*n3 + n2*n3 -> (n1+n2)*n3',
      assuming: { multiply: { commutative: false } }
    },
    {
      s: 'n^n1 * n -> n^(n1+1)',
      assuming: { divide: { total: true }, multiply: { commutative: false } }
    },
    {
      s: 'n1*n3^(-n4) + n2 * n3    -> (n1 + n2*n3^(n4 +  1))*n3^(-n4)',
      assuming: { multiply: { commutative: false } }
    },
    {
      s: 'n1*n3^(-n4) + n2 * n3^n5 -> (n1 + n2*n3^(n4 + n5))*n3^(-n4)',
      assuming: { multiply: { commutative: false } }
    },
    { l: 'n*cd + cd', r: '(n+1)*cd' },
    {
      s: 'cd*n + cd -> cd*(n+1)',
      assuming: { multiply: { commutative: false } }
    },
    {
      s: 'cd + cd*n -> cd*(1+n)',
      assuming: { multiply: { commutative: false } }
    },
    simplifyConstant, // Second: before returning expressions to "standard form"

    // make factors positive (and undo 'make non-constant terms positive')
    {
      s: '(-n)*n1 -> -(n*n1)',
      assuming: { subtract: { total: true } }
    },
    {
      s: 'n1*(-n) -> -(n1*n)', // in case * non-commutative
      assuming: { subtract: { total: true }, multiply: { commutative: false } }
    },

    // final ordering of constants
    {
      s: 'ce+ve -> ve+ce',
      assuming: { add: { commutative: true } },
      imposeContext: { add: { commutative: false } }
    },
    {
      s: 'vd*cd -> cd*vd',
      assuming: { multiply: { commutative: true } },
      imposeContext: { multiply: { commutative: false } }
    },

    // undo temporary rules
    // { l: '(-1) * n', r: '-n' }, // #811 added test which proved this is redundant
    { l: 'n+-n1', r: 'n-n1' }, // undo replace 'subtract'
    { l: 'n+-(n1)', r: 'n-(n1)' },
    {
      s: 'n*(n1^-1) -> n/n1', // undo replace 'divide'; for * commutative
      assuming: { multiply: { commutative: true } } // o.w. / not conventional
    },
    {
      s: 'n*n1^-n2 -> n/n1^n2',
      assuming: { multiply: { commutative: true } } // o.w. / not conventional
    },
    {
      s: 'n^-1 -> 1/n',
      assuming: { multiply: { commutative: true } } // o.w. / not conventional
    },
    { l: 'n^1', r: 'n' }, // can be produced by power cancellation
    {
      s: 'n*(n1/n2) -> (n*n1)/n2', // '*' before '/'
      assuming: { multiply: { associative: true } }
    },
    {
      s: 'n-(n1+n2) -> n-n1-n2', // '-' before '+'
      assuming: { addition: { associative: true, commutative: true } }
    },
    // { l: '(n1/n2)/n3', r: 'n1/(n2*n3)' },
    // { l: '(n*n1)/(n*n2)', r: 'n1/n2' },

    // simplifyConstant can leave an extra factor of 1, which can always
    // be eliminated, since the identity always commutes
    { l: '1*n', r: 'n', imposeContext: { multiply: { commutative: true } } },

    {
      s: 'n1/(n2/n3) -> (n1*n3)/n2',
      assuming: { multiply: { associative: true } }
    },

    { l: 'n1/(-n2)', r: '-n1/n2' }

  ]

  /**
   * Takes any rule object as allowed by the specification in simplify
   * and puts it in a standard form used by applyRule
   */
  function _canonicalizeRule (ruleObject, context) {
    const newRule = {}
    if (ruleObject.s) {
      const lr = ruleObject.s.split('->')
      if (lr.length === 2) {
        newRule.l = lr[0]
        newRule.r = lr[1]
      } else {
        throw SyntaxError('Could not parse rule: ' + ruleObject.s)
      }
    } else {
      newRule.l = ruleObject.l
      newRule.r = ruleObject.r
    }
    newRule.l = removeParens(parse(newRule.l))
    newRule.r = removeParens(parse(newRule.r))
    for (const prop of ['imposeContext', 'repeat', 'assuming']) {
      if (prop in ruleObject) {
        newRule[prop] = ruleObject[prop]
      }
    }
    if (ruleObject.evaluate) {
      newRule.evaluate = parse(ruleObject.evaluate)
    }

    if (isAssociative(newRule.l, context)) {
      const nonCommutative = !isCommutative(newRule.l, context)
      let leftExpandsym
      // Gen. the LHS placeholder used in this NC-context specific expansion rules
      if (nonCommutative) leftExpandsym = _getExpandPlaceholderSymbol()

      const makeNode = createMakeNodeFunction(newRule.l)
      const expandsym = _getExpandPlaceholderSymbol()
      newRule.expanded = {}
      newRule.expanded.l = makeNode([newRule.l, expandsym])
      // Push the expandsym into the deepest possible branch.
      // This helps to match the newRule against nodes returned from getSplits() later on.
      flatten(newRule.expanded.l, context)
      unflattenr(newRule.expanded.l, context)
      newRule.expanded.r = makeNode([newRule.r, expandsym])

      // In and for a non-commutative context, attempting with yet additional expansion rules makes
      // way for more matches cases of multi-arg expressions; such that associative rules (such as
      // 'n*n -> n^2') can be applied to exprs. such as 'a * b * b' and 'a * b * b * a'.
      if (nonCommutative) {
        // 'Non-commutative' 1: LHS (placeholder) only
        newRule.expandedNC1 = {}
        newRule.expandedNC1.l = makeNode([leftExpandsym, newRule.l])
        newRule.expandedNC1.r = makeNode([leftExpandsym, newRule.r])
        // 'Non-commutative' 2: farmost LHS and RHS placeholders
        newRule.expandedNC2 = {}
        newRule.expandedNC2.l = makeNode([leftExpandsym, newRule.expanded.l])
        newRule.expandedNC2.r = makeNode([leftExpandsym, newRule.expanded.r])
      }
    }

    return newRule
  }

  /**
   * Parse the string array of rules into nodes
   *
   * Example syntax for rules:
   *
   * Position constants to the left in a product:
   * { l: 'n1 * c1', r: 'c1 * n1' }
   * n1 is any Node, and c1 is a ConstantNode.
   *
   * Apply difference of squares formula:
   * { l: '(n1 - n2) * (n1 + n2)', r: 'n1^2 - n2^2' }
   * n1, n2 mean any Node.
   *
   * Short hand notation:
   * 'n1 * c1 -> c1 * n1'
   */
  function _buildRules (rules, context) {
    // Array of rules to be used to simplify expressions
    const ruleSet = []
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      let newRule
      const ruleType = typeof rule
      switch (ruleType) {
        case 'string':
          rule = { s: rule }
        /* falls through */
        case 'object':
          newRule = _canonicalizeRule(rule, context)
          break
        case 'function':
          newRule = rule
          break
        default:
          throw TypeError('Unsupported type of rule: ' + ruleType)
      }
      // console.log('Adding rule: ' + rules[i])
      // console.log(newRule)
      ruleSet.push(newRule)
    }
    return ruleSet
  }

  let _lastsym = 0
  function _getExpandPlaceholderSymbol () {
    return new SymbolNode('_p' + _lastsym++)
  }

  function _simplify (expr, rules, scope = createEmptyMap(), options = {}) {
    const debug = options.consoleDebug
    rules = _buildRules(rules || simplify.rules, options.context)
    let res = resolve(expr, scope)
    res = removeParens(res)
    const visited = {}
    let str = res.toString({ parenthesis: 'all' })
    while (!visited[str]) {
      visited[str] = true
      _lastsym = 0 // counter for placeholder symbols
      let laststr = str
      if (debug) console.log('Working on: ', str)
      for (let i = 0; i < rules.length; i++) {
        let rulestr = ''
        if (typeof rules[i] === 'function') {
          res = rules[i](res, options)
          if (debug) rulestr = rules[i].name
        } else {
          flatten(res, options.context)
          res = applyRule(res, rules[i], options.context)
          if (debug) {
            rulestr = `${rules[i].l.toString()} -> ${rules[i].r.toString()}`
          }
        }
        if (debug) {
          const newstr = res.toString({ parenthesis: 'all' })
          if (newstr !== laststr) {
            console.log('Applying', rulestr, 'produced', newstr)
            laststr = newstr
          }
        }
        /* Use left-heavy binary tree internally,
         * since custom rule functions may expect it
         */
        unflattenl(res, options.context)
      }
      str = res.toString({ parenthesis: 'all' })
    }
    return res
  }

  function mapRule (nodes, rule, context) {
    let resNodes = nodes
    if (nodes) {
      for (let i = 0; i < nodes.length; ++i) {
        const newNode = applyRule(nodes[i], rule, context)
        if (newNode !== nodes[i]) {
          if (resNodes === nodes) {
            resNodes = nodes.slice()
          }
          resNodes[i] = newNode
        }
      }
    }
    return resNodes
  }

  /**
   * Returns a simplfied form of node, or the original node if no simplification was possible.
   *
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @param  {Object | Function} rule
   * @param  {Object} context -- information about assumed properties of operators
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} The simplified form of `expr`, or the original node if no simplification was possible.
   */
  function applyRule (node, rule, context) {
    //    console.log('Entering applyRule("', rule.l.toString({parenthesis:'all'}), '->', rule.r.toString({parenthesis:'all'}), '",', node.toString({parenthesis:'all'}),')')

    // check that the assumptions for this rule are satisfied by the current
    // context:
    if (rule.assuming) {
      for (const symbol in rule.assuming) {
        for (const property in rule.assuming[symbol]) {
          if (hasProperty(symbol, property, context) !==
              rule.assuming[symbol][property]) {
            return node
          }
        }
      }
    }

    const mergedContext = mergeContext(rule.imposeContext, context)

    // Do not clone node unless we find a match
    let res = node

    // First replace our child nodes with their simplified versions
    // If a child could not be simplified, applying the rule to it
    // will have no effect since the node is returned unchanged
    if (res instanceof OperatorNode || res instanceof FunctionNode) {
      const newArgs = mapRule(res.args, rule, context)
      if (newArgs !== res.args) {
        res = res.clone()
        res.args = newArgs
      }
    } else if (res instanceof ParenthesisNode) {
      if (res.content) {
        const newContent = applyRule(res.content, rule, context)
        if (newContent !== res.content) {
          res = new ParenthesisNode(newContent)
        }
      }
    } else if (res instanceof ArrayNode) {
      const newItems = mapRule(res.items, rule, context)
      if (newItems !== res.items) {
        res = new ArrayNode(newItems)
      }
    } else if (res instanceof AccessorNode) {
      let newObj = res.object
      if (res.object) {
        newObj = applyRule(res.object, rule, context)
      }
      let newIndex = res.index
      if (res.index) {
        newIndex = applyRule(res.index, rule, context)
      }
      if (newObj !== res.object || newIndex !== res.index) {
        res = new AccessorNode(newObj, newIndex)
      }
    } else if (res instanceof IndexNode) {
      const newDims = mapRule(res.dimensions, rule, context)
      if (newDims !== res.dimensions) {
        res = new IndexNode(newDims)
      }
    } else if (res instanceof ObjectNode) {
      let changed = false
      const newProps = {}
      for (const prop in res.properties) {
        newProps[prop] = applyRule(res.properties[prop], rule, context)
        if (newProps[prop] !== res.properties[prop]) {
          changed = true
        }
      }
      if (changed) {
        res = new ObjectNode(newProps)
      }
    }

    // Try to match a rule against this node
    let repl = rule.r
    let matches = _ruleMatch(rule.l, res, mergedContext)[0]

    // If the rule is associative operator, we can try matching it while allowing additional terms.
    // This allows us to match rules like 'n+n' to the expression '(1+x)+x' or even 'x+1+x' if the operator is commutative.
    if (!matches && rule.expanded) {
      repl = rule.expanded.r
      matches = _ruleMatch(rule.expanded.l, res, mergedContext)[0]
    }
    // Additional, non-commutative context expansion-rules
    if (!matches && rule.expandedNC1) {
      repl = rule.expandedNC1.r
      matches = _ruleMatch(rule.expandedNC1.l, res, mergedContext)[0]
      if (!matches) { // Existence of NC1 implies NC2
        repl = rule.expandedNC2.r
        matches = _ruleMatch(rule.expandedNC2.l, res, mergedContext)[0]
      }
    }

    if (matches) {
      // const before = res.toString({parenthesis: 'all'})

      // Create a new node by cloning the rhs of the matched rule
      // we keep any implicit multiplication state if relevant
      const implicit = res.implicit
      res = repl.clone()
      if (implicit && 'implicit' in repl) {
        res.implicit = true
      }

      // Replace placeholders with their respective nodes without traversing deeper into the replaced nodes
      res = res.transform(function (node) {
        if (node.isSymbolNode && hasOwnProperty(matches.placeholders, node.name)) {
          return matches.placeholders[node.name].clone()
        } else {
          return node
        }
      })

      // const after = res.toString({parenthesis: 'all'})
      // console.log('Simplified ' + before + ' to ' + after)
    }

    if (rule.repeat && res !== node) {
      res = applyRule(res, rule, context)
    }

    return res
  }

  /**
   * Get (binary) combinations of a flattened binary node
   * e.g. +(node1, node2, node3) -> [
   *        +(node1,  +(node2, node3)),
   *        +(node2,  +(node1, node3)),
   *        +(node3,  +(node1, node2))]
   *
   */
  function getSplits (node, context) {
    const res = []
    let right, rightArgs
    const makeNode = createMakeNodeFunction(node)
    if (isCommutative(node, context)) {
      for (let i = 0; i < node.args.length; i++) {
        rightArgs = node.args.slice(0)
        rightArgs.splice(i, 1)
        right = (rightArgs.length === 1) ? rightArgs[0] : makeNode(rightArgs)
        res.push(makeNode([node.args[i], right]))
      }
    } else {
      // Keep order, but try all parenthesizations
      for (let i = 1; i < node.args.length; i++) {
        let left = node.args[0]
        if (i > 1) {
          left = makeNode(node.args.slice(0, i))
        }
        rightArgs = node.args.slice(i)
        right = (rightArgs.length === 1) ? rightArgs[0] : makeNode(rightArgs)
        res.push(makeNode([left, right]))
      }
    }
    return res
  }

  /**
   * Returns the set union of two match-placeholders or null if there is a conflict.
   */
  function mergeMatch (match1, match2) {
    const res = { placeholders: {} }

    // Some matches may not have placeholders; this is OK
    if (!match1.placeholders && !match2.placeholders) {
      return res
    } else if (!match1.placeholders) {
      return match2
    } else if (!match2.placeholders) {
      return match1
    }

    // Placeholders with the same key must match exactly
    for (const key in match1.placeholders) {
      if (hasOwnProperty(match1.placeholders, key)) {
        res.placeholders[key] = match1.placeholders[key]

        if (hasOwnProperty(match2.placeholders, key)) {
          if (!_exactMatch(match1.placeholders[key], match2.placeholders[key])) {
            return null
          }
        }
      }
    }

    for (const key in match2.placeholders) {
      if (hasOwnProperty(match2.placeholders, key)) {
        res.placeholders[key] = match2.placeholders[key]
      }
    }

    return res
  }

  /**
   * Combine two lists of matches by applying mergeMatch to the cartesian product of two lists of matches.
   * Each list represents matches found in one child of a node.
   */
  function combineChildMatches (list1, list2) {
    const res = []

    if (list1.length === 0 || list2.length === 0) {
      return res
    }

    let merged
    for (let i1 = 0; i1 < list1.length; i1++) {
      for (let i2 = 0; i2 < list2.length; i2++) {
        merged = mergeMatch(list1[i1], list2[i2])
        if (merged) {
          res.push(merged)
        }
      }
    }
    return res
  }

  /**
   * Combine multiple lists of matches by applying mergeMatch to the cartesian product of two lists of matches.
   * Each list represents matches found in one child of a node.
   * Returns a list of unique matches.
   */
  function mergeChildMatches (childMatches) {
    if (childMatches.length === 0) {
      return childMatches
    }

    const sets = childMatches.reduce(combineChildMatches)
    const uniqueSets = []
    const unique = {}
    for (let i = 0; i < sets.length; i++) {
      const s = JSON.stringify(sets[i], replacer)
      if (!unique[s]) {
        unique[s] = true
        uniqueSets.push(sets[i])
      }
    }
    return uniqueSets
  }

  /**
   * Determines whether node matches rule.
   *
   * @param {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} rule
   * @param {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @param {Object} context -- provides assumed properties of operators
   * @param {Boolean} isSplit -- whether we are in process of splitting an
   *                    n-ary operator node into possible binary combinations.
   *                    Defaults to false.
   * @return {Object} Information about the match, if it exists.
   */
  function _ruleMatch (rule, node, context, isSplit) {
    //    console.log('Entering _ruleMatch(' + JSON.stringify(rule) + ', ' + JSON.stringify(node) + ')')
    //    console.log('rule = ' + rule)
    //    console.log('node = ' + node)

    //    console.log('Entering _ruleMatch(', rule.toString({parenthesis:'all'}), ', ', node.toString({parenthesis:'all'}), ', ', context, ')')
    let res = [{ placeholders: {} }]

    if ((rule instanceof OperatorNode && node instanceof OperatorNode) ||
      (rule instanceof FunctionNode && node instanceof FunctionNode)) {
      // If the rule is an OperatorNode or a FunctionNode, then node must match exactly
      if (rule instanceof OperatorNode) {
        if (rule.op !== node.op || rule.fn !== node.fn) {
          return []
        }
      } else if (rule instanceof FunctionNode) {
        if (rule.name !== node.name) {
          return []
        }
      }

      // rule and node match. Search the children of rule and node.
      if ((node.args.length === 1 && rule.args.length === 1) ||
          (!isAssociative(node, context) &&
           node.args.length === rule.args.length) ||
          isSplit) {
        // Expect non-associative operators to match exactly,
        // except in any order if operator is commutative
        let childMatches = []
        for (let i = 0; i < rule.args.length; i++) {
          const childMatch = _ruleMatch(rule.args[i], node.args[i], context)
          if (childMatch.length === 0) {
            // Child did not match, so stop searching immediately
            break
          }
          // The child matched, so add the information returned from the child to our result
          childMatches.push(childMatch)
        }
        if (childMatches.length !== rule.args.length) {
          if (!isCommutative(node, context) || // exact match in order needed
              rule.args.length === 1) { // nothing to commute
            return []
          }
          if (rule.args.length > 2) {
            /* Need to generate all permutations and try them.
             * It's a bit complicated, and unlikely to come up since there
             * are very few ternary or higher operators. So punt for now.
             */
            throw new Error('permuting >2 commutative non-associative rule arguments not yet implemented')
          }
          /* Exactly two arguments, try them reversed */
          const leftMatch = _ruleMatch(rule.args[0], node.args[1], context)
          if (leftMatch.length === 0) {
            return []
          }
          const rightMatch = _ruleMatch(rule.args[1], node.args[0], context)
          if (rightMatch.length === 0) {
            return []
          }
          childMatches = [leftMatch, rightMatch]
        }
        res = mergeChildMatches(childMatches)
      } else if (node.args.length >= 2 && rule.args.length === 2) { // node is flattened, rule is not
        // Associative operators/functions can be split in different ways so we check if the rule
        // matches for each of them and return their union.
        const splits = getSplits(node, context)
        let splitMatches = []
        for (let i = 0; i < splits.length; i++) {
          const matchSet = _ruleMatch(rule, splits[i], context, true) // recursing at the same tree depth here
          splitMatches = splitMatches.concat(matchSet)
        }
        return splitMatches
      } else if (rule.args.length > 2) {
        throw Error('Unexpected non-binary associative function: ' + rule.toString())
      } else {
        // Incorrect number of arguments in rule and node, so no match
        return []
      }
    } else if (rule instanceof SymbolNode) {
      // If the rule is a SymbolNode, then it carries a special meaning
      // according to the first one or two characters of the symbol node name.
      // These meanings are expalined in the documentation for simplify()
      if (rule.name.length === 0) {
        throw new Error('Symbol in rule has 0 length...!?')
      }
      if (SUPPORTED_CONSTANTS[rule.name]) {
        // built-in constant must match exactly
        if (rule.name !== node.name) {
          return []
        }
      } else {
        // wildcards are composed of up to two alphabetic or underscore characters
        switch (rule.name[1] >= 'a' && rule.name[1] <= 'z' ? rule.name.substring(0, 2) : rule.name[0]) {
          case 'n':
          case '_p':
            // rule matches _anything_, so assign this node to the rule.name placeholder
            // Assign node to the rule.name placeholder.
            // Our parent will check for matches among placeholders.
            res[0].placeholders[rule.name] = node
            break
          case 'c':
          case 'cl':
            // rule matches a ConstantNode
            if (isConstantNode(node)) {
              res[0].placeholders[rule.name] = node
            } else {
              // mis-match: rule does not encompass current node
              return []
            }
            break
          case 'v':
            // rule matches anything other than a ConstantNode
            if (!isConstantNode(node)) {
              res[0].placeholders[rule.name] = node
            } else {
              // mis-match: rule does not encompass current node
              return []
            }
            break
          case 'vl':
            // rule matches VariableNode
            if (isVariableNode(node)) {
              res[0].placeholders[rule.name] = node
            } else {
              // mis-match: rule does not encompass current node
              return []
            }
            break
          case 'cd':
            // rule matches a ConstantNode or unaryMinus-wrapped ConstantNode
            if (isNumericNode(node)) {
              res[0].placeholders[rule.name] = node
            } else {
              // mis-match: rule does not encompass current node
              return []
            }
            break
          case 'vd':
            // rule matches anything other than a ConstantNode or unaryMinus-wrapped ConstantNode
            if (!isNumericNode(node)) {
              res[0].placeholders[rule.name] = node
            } else {
              // mis-match: rule does not encompass current node
              return []
            }
            break
          case 'ce':
            // rule matches expressions that have a constant value
            if (isConstantExpression(node)) {
              res[0].placeholders[rule.name] = node
            } else {
              // mis-match: rule does not encompass current node
              return []
            }
            break
          case 've':
            // rule matches expressions that do not have a constant value
            if (!isConstantExpression(node)) {
              res[0].placeholders[rule.name] = node
            } else {
              // mis-match: rule does not encompass current node
              return []
            }
            break
          default:
            throw new Error('Invalid symbol in rule: ' + rule.name)
        }
      }
    } else if (rule instanceof ConstantNode) {
      // Literal constant must match exactly
      if (!equal(rule.value, node.value)) {
        return []
      }
    } else {
      // Some other node was encountered which we aren't prepared for, so no match
      return []
    }

    // It's a match!

    // console.log('_ruleMatch(' + rule.toString() + ', ' + node.toString() + ') found a match')
    return res
  }

  /**
   * Determines whether p and q (and all their children nodes) are identical.
   *
   * @param {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} p
   * @param {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} q
   * @return {Object} Information about the match, if it exists.
   */
  function _exactMatch (p, q) {
    if (p instanceof ConstantNode && q instanceof ConstantNode) {
      if (!equal(p.value, q.value)) {
        return false
      }
    } else if (p instanceof SymbolNode && q instanceof SymbolNode) {
      if (p.name !== q.name) {
        return false
      }
    } else if ((p instanceof OperatorNode && q instanceof OperatorNode) ||
        (p instanceof FunctionNode && q instanceof FunctionNode)) {
      if (p instanceof OperatorNode) {
        if (p.op !== q.op || p.fn !== q.fn) {
          return false
        }
      } else if (p instanceof FunctionNode) {
        if (p.name !== q.name) {
          return false
        }
      }

      if (p.args.length !== q.args.length) {
        return false
      }

      for (let i = 0; i < p.args.length; i++) {
        if (!_exactMatch(p.args[i], q.args[i])) {
          return false
        }
      }
    } else {
      return false
    }

    return true
  }

  return simplify
})
