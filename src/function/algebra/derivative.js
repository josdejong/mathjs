import { isConstantNode, typeOf } from '../../utils/is.js'
import { factory } from '../../utils/factory.js'
import { safeNumberType } from '../../utils/number.js'

const name = 'derivative'
const dependencies = [
  'typed',
  'config',
  'parse',
  'simplify',
  'equal',
  'isZero',
  'numeric',
  'ConstantNode',
  'FunctionNode',
  'OperatorNode',
  'ParenthesisNode',
  'SymbolNode'
]

export const createDerivative = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  config,
  parse,
  simplify,
  equal,
  isZero,
  numeric,
  ConstantNode,
  FunctionNode,
  OperatorNode,
  ParenthesisNode,
  SymbolNode
}) => {
  /**
   * Takes the derivative of an expression expressed in parser Nodes.
   * The derivative will be taken over the supplied variable in the
   * second parameter. If there are multiple variables in the expression,
   * it will return a partial derivative.
   *
   * This uses rules of differentiation which can be found here:
   *
   * - [Differentiation rules (Wikipedia)](https://en.wikipedia.org/wiki/Differentiation_rules)
   *
   * Syntax:
   *
   *     math.derivative(expr, variable)
   *     math.derivative(expr, variable, options)
   *
   * Examples:
   *
   *     math.derivative('x^2', 'x')                     // Node '2 * x'
   *     math.derivative('x^2', 'x', {simplify: false})  // Node '2 * 1 * x ^ (2 - 1)'
   *     math.derivative('sin(2x)', 'x'))                // Node '2 * cos(2 * x)'
   *     math.derivative('2*x', 'x').evaluate()          // number 2
   *     math.derivative('x^2', 'x').evaluate({x: 4})    // number 8
   *     const f = math.parse('x^2')
   *     const x = math.parse('x')
   *     math.derivative(f, x)                           // Node {2 * x}
   *
   * See also:
   *
   *     simplify, parse, evaluate
   *
   * @param  {Node | string} expr           The expression to differentiate
   * @param  {SymbolNode | string} variable The variable over which to differentiate
   * @param  {{simplify: boolean}} [options]
   *                         There is one option available, `simplify`, which
   *                         is true by default. When false, output will not
   *                         be simplified.
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode}    The derivative of `expr`
   */
  function plainDerivative (expr, variable, options = { simplify: true }) {
    const cache = new Map()
    const variableName = variable.name
    function isConstCached (node) {
      const cached = cache.get(node)
      if (cached !== undefined) {
        return cached
      }
      const res = _isConst(isConstCached, node, variableName)
      cache.set(node, res)
      return res
    }

    const res = _derivative(expr, isConstCached)
    return options.simplify ? simplify(res) : res
  }

  function parseIdentifier (string) {
    const symbol = parse(string)
    if (!symbol.isSymbolNode) {
      throw new TypeError('Invalid variable. ' +
        `Cannot parse ${JSON.stringify(string)} into a variable in function derivative`)
    }
    return symbol
  }

  const derivative = typed(name, {
    'Node, SymbolNode': plainDerivative,
    'Node, SymbolNode, Object': plainDerivative,
    'Node, string': (node, symbol) => plainDerivative(node, parseIdentifier(symbol)),
    'Node, string, Object': (node, symbol, options) => plainDerivative(node, parseIdentifier(symbol), options)

    /* TODO: implement and test syntax with order of derivatives -> implement as an option {order: number}
    'Node, SymbolNode, ConstantNode': function (expr, variable, {order}) {
      let res = expr
      for (let i = 0; i < order; i++) {
        <create caching isConst>
        res = _derivative(res, isConst)
      }
      return res
    }
    */
  })

  derivative._simplify = true

  derivative.toTex = function (deriv) {
    return _derivTex.apply(null, deriv.args)
  }

  // FIXME: move the toTex method of derivative to latex.js. Difficulty is that it relies on parse.
  // NOTE: the optional "order" parameter here is currently unused
  const _derivTex = typed('_derivTex', {
    'Node, SymbolNode': function (expr, x) {
      if (isConstantNode(expr) && typeOf(expr.value) === 'string') {
        return _derivTex(parse(expr.value).toString(), x.toString(), 1)
      } else {
        return _derivTex(expr.toTex(), x.toString(), 1)
      }
    },
    'Node, ConstantNode': function (expr, x) {
      if (typeOf(x.value) === 'string') {
        return _derivTex(expr, parse(x.value))
      } else {
        throw new Error("The second parameter to 'derivative' is a non-string constant")
      }
    },
    'Node, SymbolNode, ConstantNode': function (expr, x, order) {
      return _derivTex(expr.toString(), x.name, order.value)
    },
    'string, string, number': function (expr, x, order) {
      let d
      if (order === 1) {
        d = '{d\\over d' + x + '}'
      } else {
        d = '{d^{' + order + '}\\over d' + x + '^{' + order + '}}'
      }
      return d + `\\left[${expr}\\right]`
    }
  })

  /**
   * Checks if a node is constants (e.g. 2 + 2).
   * Accepts (usually memoized) version of self as the first parameter for recursive calls.
   * Classification is done as follows:
   *
   *   1. ConstantNodes are constants.
   *   2. If there exists a SymbolNode, of which we are differentiating over,
   *      in the subtree it is not constant.
   *
   * @param  {function} isConst  Function that tells whether sub-expression is a constant
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @param  {string} varName     Variable that we are differentiating
   * @return {boolean}  if node is constant
   */
  const _isConst = typed('_isConst', {
    'function, ConstantNode, string': function () {
      return true
    },

    'function, SymbolNode, string': function (isConst, node, varName) {
      // Treat other variables like constants. For reasoning, see:
      //   https://en.wikipedia.org/wiki/Partial_derivative
      return node.name !== varName
    },

    'function, ParenthesisNode, string': function (isConst, node, varName) {
      return isConst(node.content, varName)
    },

    'function, FunctionAssignmentNode, string': function (isConst, node, varName) {
      if (!node.params.includes(varName)) {
        return true
      }
      return isConst(node.expr, varName)
    },

    'function, FunctionNode | OperatorNode, string': function (isConst, node, varName) {
      return node.args.every(arg => isConst(arg, varName))
    }
  })

  /**
   * Applies differentiation rules.
   *
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @param  {function} isConst  Function that tells if a node is constant
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode}    The derivative of `expr`
   */
  const _derivative = typed('_derivative', {
    'ConstantNode, function': function () {
      return createConstantNode(0)
    },

    'SymbolNode, function': function (node, isConst) {
      if (isConst(node)) {
        return createConstantNode(0)
      }
      return createConstantNode(1)
    },

    'ParenthesisNode, function': function (node, isConst) {
      return new ParenthesisNode(_derivative(node.content, isConst))
    },

    'FunctionAssignmentNode, function': function (node, isConst) {
      if (isConst(node)) {
        return createConstantNode(0)
      }
      return _derivative(node.expr, isConst)
    },

    'FunctionNode, function': function (node, isConst) {
      if (isConst(node)) {
        return createConstantNode(0)
      }

      const arg0 = node.args[0]
      let arg1

      let div = false // is output a fraction?
      let negative = false // is output negative?

      let funcDerivative
      switch (node.name) {
        case 'cbrt':
          // d/dx(cbrt(x)) = 1 / (3x^(2/3))
          div = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            createConstantNode(3),
            new OperatorNode('^', 'pow', [
              arg0,
              new OperatorNode('/', 'divide', [
                createConstantNode(2),
                createConstantNode(3)
              ])
            ])
          ])
          break
        case 'sqrt':
        case 'nthRoot':
          // d/dx(sqrt(x)) = 1 / (2*sqrt(x))
          if (node.args.length === 1) {
            div = true
            funcDerivative = new OperatorNode('*', 'multiply', [
              createConstantNode(2),
              new FunctionNode('sqrt', [arg0])
            ])
          } else if (node.args.length === 2) {
            // Rearrange from nthRoot(x, a) -> x^(1/a)
            arg1 = new OperatorNode('/', 'divide', [
              createConstantNode(1),
              node.args[1]
            ])

            return _derivative(new OperatorNode('^', 'pow', [arg0, arg1]), isConst)
          }
          break
        case 'log10':
          arg1 = createConstantNode(10)
          /* fall through! */
        case 'log':
          if (!arg1 && node.args.length === 1) {
            // d/dx(log(x)) = 1 / x
            funcDerivative = arg0.clone()
            div = true
          } else if ((node.args.length === 1 && arg1) ||
              (node.args.length === 2 && isConst(node.args[1]))) {
            // d/dx(log(x, c)) = 1 / (x*ln(c))
            funcDerivative = new OperatorNode('*', 'multiply', [
              arg0.clone(),
              new FunctionNode('log', [arg1 || node.args[1]])
            ])
            div = true
          } else if (node.args.length === 2) {
            // d/dx(log(f(x), g(x))) = d/dx(log(f(x)) / log(g(x)))
            return _derivative(new OperatorNode('/', 'divide', [
              new FunctionNode('log', [arg0]),
              new FunctionNode('log', [node.args[1]])
            ]), isConst)
          }
          break
        case 'pow':
          if (node.args.length === 2) {
            // Pass to pow operator node parser
            return _derivative(new OperatorNode('^', 'pow', [arg0, node.args[1]]), isConst)
          }
          break
        case 'exp':
          // d/dx(e^x) = e^x
          funcDerivative = new FunctionNode('exp', [arg0.clone()])
          break
        case 'sin':
          // d/dx(sin(x)) = cos(x)
          funcDerivative = new FunctionNode('cos', [arg0.clone()])
          break
        case 'cos':
          // d/dx(cos(x)) = -sin(x)
          funcDerivative = new OperatorNode('-', 'unaryMinus', [
            new FunctionNode('sin', [arg0.clone()])
          ])
          break
        case 'tan':
          // d/dx(tan(x)) = sec(x)^2
          funcDerivative = new OperatorNode('^', 'pow', [
            new FunctionNode('sec', [arg0.clone()]),
            createConstantNode(2)
          ])
          break
        case 'sec':
          // d/dx(sec(x)) = sec(x)tan(x)
          funcDerivative = new OperatorNode('*', 'multiply', [
            node,
            new FunctionNode('tan', [arg0.clone()])
          ])
          break
        case 'csc':
          // d/dx(csc(x)) = -csc(x)cot(x)
          negative = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            node,
            new FunctionNode('cot', [arg0.clone()])
          ])
          break
        case 'cot':
          // d/dx(cot(x)) = -csc(x)^2
          negative = true
          funcDerivative = new OperatorNode('^', 'pow', [
            new FunctionNode('csc', [arg0.clone()]),
            createConstantNode(2)
          ])
          break
        case 'asin':
          // d/dx(asin(x)) = 1 / sqrt(1 - x^2)
          div = true
          funcDerivative = new FunctionNode('sqrt', [
            new OperatorNode('-', 'subtract', [
              createConstantNode(1),
              new OperatorNode('^', 'pow', [
                arg0.clone(),
                createConstantNode(2)
              ])
            ])
          ])
          break
        case 'acos':
          // d/dx(acos(x)) = -1 / sqrt(1 - x^2)
          div = true
          negative = true
          funcDerivative = new FunctionNode('sqrt', [
            new OperatorNode('-', 'subtract', [
              createConstantNode(1),
              new OperatorNode('^', 'pow', [
                arg0.clone(),
                createConstantNode(2)
              ])
            ])
          ])
          break
        case 'atan':
          // d/dx(atan(x)) = 1 / (x^2 + 1)
          div = true
          funcDerivative = new OperatorNode('+', 'add', [
            new OperatorNode('^', 'pow', [
              arg0.clone(),
              createConstantNode(2)
            ]),
            createConstantNode(1)
          ])
          break
        case 'asec':
          // d/dx(asec(x)) = 1 / (|x|*sqrt(x^2 - 1))
          div = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            new FunctionNode('abs', [arg0.clone()]),
            new FunctionNode('sqrt', [
              new OperatorNode('-', 'subtract', [
                new OperatorNode('^', 'pow', [
                  arg0.clone(),
                  createConstantNode(2)
                ]),
                createConstantNode(1)
              ])
            ])
          ])
          break
        case 'acsc':
          // d/dx(acsc(x)) = -1 / (|x|*sqrt(x^2 - 1))
          div = true
          negative = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            new FunctionNode('abs', [arg0.clone()]),
            new FunctionNode('sqrt', [
              new OperatorNode('-', 'subtract', [
                new OperatorNode('^', 'pow', [
                  arg0.clone(),
                  createConstantNode(2)
                ]),
                createConstantNode(1)
              ])
            ])
          ])
          break
        case 'acot':
          // d/dx(acot(x)) = -1 / (x^2 + 1)
          div = true
          negative = true
          funcDerivative = new OperatorNode('+', 'add', [
            new OperatorNode('^', 'pow', [
              arg0.clone(),
              createConstantNode(2)
            ]),
            createConstantNode(1)
          ])
          break
        case 'sinh':
          // d/dx(sinh(x)) = cosh(x)
          funcDerivative = new FunctionNode('cosh', [arg0.clone()])
          break
        case 'cosh':
          // d/dx(cosh(x)) = sinh(x)
          funcDerivative = new FunctionNode('sinh', [arg0.clone()])
          break
        case 'tanh':
          // d/dx(tanh(x)) = sech(x)^2
          funcDerivative = new OperatorNode('^', 'pow', [
            new FunctionNode('sech', [arg0.clone()]),
            createConstantNode(2)
          ])
          break
        case 'sech':
          // d/dx(sech(x)) = -sech(x)tanh(x)
          negative = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            node,
            new FunctionNode('tanh', [arg0.clone()])
          ])
          break
        case 'csch':
          // d/dx(csch(x)) = -csch(x)coth(x)
          negative = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            node,
            new FunctionNode('coth', [arg0.clone()])
          ])
          break
        case 'coth':
          // d/dx(coth(x)) = -csch(x)^2
          negative = true
          funcDerivative = new OperatorNode('^', 'pow', [
            new FunctionNode('csch', [arg0.clone()]),
            createConstantNode(2)
          ])
          break
        case 'asinh':
          // d/dx(asinh(x)) = 1 / sqrt(x^2 + 1)
          div = true
          funcDerivative = new FunctionNode('sqrt', [
            new OperatorNode('+', 'add', [
              new OperatorNode('^', 'pow', [
                arg0.clone(),
                createConstantNode(2)
              ]),
              createConstantNode(1)
            ])
          ])
          break
        case 'acosh':
          // d/dx(acosh(x)) = 1 / sqrt(x^2 - 1); XXX potentially only for x >= 1 (the real spectrum)
          div = true
          funcDerivative = new FunctionNode('sqrt', [
            new OperatorNode('-', 'subtract', [
              new OperatorNode('^', 'pow', [
                arg0.clone(),
                createConstantNode(2)
              ]),
              createConstantNode(1)
            ])
          ])
          break
        case 'atanh':
          // d/dx(atanh(x)) = 1 / (1 - x^2)
          div = true
          funcDerivative = new OperatorNode('-', 'subtract', [
            createConstantNode(1),
            new OperatorNode('^', 'pow', [
              arg0.clone(),
              createConstantNode(2)
            ])
          ])
          break
        case 'asech':
          // d/dx(asech(x)) = -1 / (x*sqrt(1 - x^2))
          div = true
          negative = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            arg0.clone(),
            new FunctionNode('sqrt', [
              new OperatorNode('-', 'subtract', [
                createConstantNode(1),
                new OperatorNode('^', 'pow', [
                  arg0.clone(),
                  createConstantNode(2)
                ])
              ])
            ])
          ])
          break
        case 'acsch':
          // d/dx(acsch(x)) = -1 / (|x|*sqrt(x^2 + 1))
          div = true
          negative = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            new FunctionNode('abs', [arg0.clone()]),
            new FunctionNode('sqrt', [
              new OperatorNode('+', 'add', [
                new OperatorNode('^', 'pow', [
                  arg0.clone(),
                  createConstantNode(2)
                ]),
                createConstantNode(1)
              ])
            ])
          ])
          break
        case 'acoth':
          // d/dx(acoth(x)) = -1 / (1 - x^2)
          div = true
          negative = true
          funcDerivative = new OperatorNode('-', 'subtract', [
            createConstantNode(1),
            new OperatorNode('^', 'pow', [
              arg0.clone(),
              createConstantNode(2)
            ])
          ])
          break
        case 'abs':
          // d/dx(abs(x)) = abs(x)/x
          funcDerivative = new OperatorNode('/', 'divide', [
            new FunctionNode(new SymbolNode('abs'), [arg0.clone()]),
            arg0.clone()
          ])
          break
        case 'gamma': // Needs digamma function, d/dx(gamma(x)) = gamma(x)digamma(x)
        default:
          throw new Error('Cannot process function "' + node.name + '" in derivative: ' +
          'the function is not supported, undefined, or the number of arguments passed to it are not supported')
      }

      let op, func
      if (div) {
        op = '/'
        func = 'divide'
      } else {
        op = '*'
        func = 'multiply'
      }

      /* Apply chain rule to all functions:
         F(x)  = f(g(x))
         F'(x) = g'(x)*f'(g(x)) */
      let chainDerivative = _derivative(arg0, isConst)
      if (negative) {
        chainDerivative = new OperatorNode('-', 'unaryMinus', [chainDerivative])
      }
      return new OperatorNode(op, func, [chainDerivative, funcDerivative])
    },

    'OperatorNode, function': function (node, isConst) {
      if (isConst(node)) {
        return createConstantNode(0)
      }

      if (node.op === '+') {
        // d/dx(sum(f(x)) = sum(f'(x))
        return new OperatorNode(node.op, node.fn, node.args.map(function (arg) {
          return _derivative(arg, isConst)
        }))
      }

      if (node.op === '-') {
        // d/dx(+/-f(x)) = +/-f'(x)
        if (node.isUnary()) {
          return new OperatorNode(node.op, node.fn, [
            _derivative(node.args[0], isConst)
          ])
        }

        // Linearity of differentiation, d/dx(f(x) +/- g(x)) = f'(x) +/- g'(x)
        if (node.isBinary()) {
          return new OperatorNode(node.op, node.fn, [
            _derivative(node.args[0], isConst),
            _derivative(node.args[1], isConst)
          ])
        }
      }

      if (node.op === '*') {
        // d/dx(c*f(x)) = c*f'(x)
        const constantTerms = node.args.filter(function (arg) {
          return isConst(arg)
        })

        if (constantTerms.length > 0) {
          const nonConstantTerms = node.args.filter(function (arg) {
            return !isConst(arg)
          })

          const nonConstantNode = nonConstantTerms.length === 1
            ? nonConstantTerms[0]
            : new OperatorNode('*', 'multiply', nonConstantTerms)

          const newArgs = constantTerms.concat(_derivative(nonConstantNode, isConst))

          return new OperatorNode('*', 'multiply', newArgs)
        }

        // Product Rule, d/dx(f(x)*g(x)) = f'(x)*g(x) + f(x)*g'(x)
        return new OperatorNode('+', 'add', node.args.map(function (argOuter) {
          return new OperatorNode('*', 'multiply', node.args.map(function (argInner) {
            return (argInner === argOuter)
              ? _derivative(argInner, isConst)
              : argInner.clone()
          }))
        }))
      }

      if (node.op === '/' && node.isBinary()) {
        const arg0 = node.args[0]
        const arg1 = node.args[1]

        // d/dx(f(x) / c) = f'(x) / c
        if (isConst(arg1)) {
          return new OperatorNode('/', 'divide', [_derivative(arg0, isConst), arg1])
        }

        // Reciprocal Rule, d/dx(c / f(x)) = -c(f'(x)/f(x)^2)
        if (isConst(arg0)) {
          return new OperatorNode('*', 'multiply', [
            new OperatorNode('-', 'unaryMinus', [arg0]),
            new OperatorNode('/', 'divide', [
              _derivative(arg1, isConst),
              new OperatorNode('^', 'pow', [arg1.clone(), createConstantNode(2)])
            ])
          ])
        }

        // Quotient rule, d/dx(f(x) / g(x)) = (f'(x)g(x) - f(x)g'(x)) / g(x)^2
        return new OperatorNode('/', 'divide', [
          new OperatorNode('-', 'subtract', [
            new OperatorNode('*', 'multiply', [_derivative(arg0, isConst), arg1.clone()]),
            new OperatorNode('*', 'multiply', [arg0.clone(), _derivative(arg1, isConst)])
          ]),
          new OperatorNode('^', 'pow', [arg1.clone(), createConstantNode(2)])
        ])
      }

      if (node.op === '^' && node.isBinary()) {
        const arg0 = node.args[0]
        const arg1 = node.args[1]

        if (isConst(arg0)) {
          // If is secretly constant; 0^f(x) = 1 (in JS), 1^f(x) = 1
          if (isConstantNode(arg0) && (isZero(arg0.value) || equal(arg0.value, 1))) {
            return createConstantNode(0)
          }

          // d/dx(c^f(x)) = c^f(x)*ln(c)*f'(x)
          return new OperatorNode('*', 'multiply', [
            node,
            new OperatorNode('*', 'multiply', [
              new FunctionNode('log', [arg0.clone()]),
              _derivative(arg1.clone(), isConst)
            ])
          ])
        }

        if (isConst(arg1)) {
          if (isConstantNode(arg1)) {
            // If is secretly constant; f(x)^0 = 1 -> d/dx(1) = 0
            if (isZero(arg1.value)) {
              return createConstantNode(0)
            }
            // Ignore exponent; f(x)^1 = f(x)
            if (equal(arg1.value, 1)) {
              return _derivative(arg0, isConst)
            }
          }

          // Elementary Power Rule, d/dx(f(x)^c) = c*f'(x)*f(x)^(c-1)
          const powMinusOne = new OperatorNode('^', 'pow', [
            arg0.clone(),
            new OperatorNode('-', 'subtract', [
              arg1,
              createConstantNode(1)
            ])
          ])

          return new OperatorNode('*', 'multiply', [
            arg1.clone(),
            new OperatorNode('*', 'multiply', [
              _derivative(arg0, isConst),
              powMinusOne
            ])
          ])
        }

        // Functional Power Rule, d/dx(f^g) = f^g*[f'*(g/f) + g'ln(f)]
        return new OperatorNode('*', 'multiply', [
          new OperatorNode('^', 'pow', [arg0.clone(), arg1.clone()]),
          new OperatorNode('+', 'add', [
            new OperatorNode('*', 'multiply', [
              _derivative(arg0, isConst),
              new OperatorNode('/', 'divide', [arg1.clone(), arg0.clone()])
            ]),
            new OperatorNode('*', 'multiply', [
              _derivative(arg1, isConst),
              new FunctionNode('log', [arg0.clone()])
            ])
          ])
        ])
      }

      throw new Error('Cannot process operator "' + node.op + '" in derivative: ' +
        'the operator is not supported, undefined, or the number of arguments passed to it are not supported')
    }
  })

  /**
   * Helper function to create a constant node with a specific type
   * (number, BigNumber, Fraction)
   * @param {number} value
   * @param {string} [valueType]
   * @return {ConstantNode}
   */
  function createConstantNode (value, valueType) {
    return new ConstantNode(numeric(value, valueType || safeNumberType(String(value), config)))
  }

  return derivative
})
