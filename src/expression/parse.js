import { factory } from '../utils/factory.js'
import { deepMap } from '../utils/collection.js'
import { parseStart, setDependencies as setNodeParsersDependencies } from './nodeParsers.js'
import { isAlpha, isValidLatinOrGreek, isValidMathSymbol, isWhitespace, isDecimalMark, isDigitDot, isDigit, isHexDigit } from './lexer.js'

const name = 'parse'
const dependencies = [
  'typed',
  'numeric',
  'config',
  'AccessorNode',
  'ArrayNode',
  'AssignmentNode',
  'BlockNode',
  'ConditionalNode',
  'ConstantNode',
  'FunctionAssignmentNode',
  'FunctionNode',
  'IndexNode',
  'ObjectNode',
  'OperatorNode',
  'ParenthesisNode',
  'RangeNode',
  'RelationalNode',
  'SymbolNode'
  // No longer directly needed: safeNumberType, hasOwnProperty, isAccessorNode etc.
  // Those are used within nodeParsers.js which imports them directly.
]

export const createParse = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  numeric,
  config,
  AccessorNode,
  ArrayNode,
  AssignmentNode,
  BlockNode,
  ConditionalNode,
  ConstantNode,
  FunctionAssignmentNode,
  FunctionNode,
  IndexNode,
  ObjectNode,
  OperatorNode,
  ParenthesisNode,
  RangeNode,
  RelationalNode,
  SymbolNode
  // Note: other utils like is.js, object.js, number.js are imported directly in nodeParsers.js
}) => {
  // Pass dependencies to the nodeParsers module
  setNodeParsersDependencies({
    numeric,
    config,
    AccessorNode,
    ArrayNode,
    AssignmentNode,
    BlockNode,
    ConditionalNode,
    ConstantNode,
    FunctionAssignmentNode,
    FunctionNode,
    IndexNode,
    ObjectNode,
    OperatorNode,
    ParenthesisNode,
    RangeNode,
    RelationalNode,
    SymbolNode
  })

  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.evaluate().
   *
   * Note the evaluating arbitrary expressions may involve security risks,
   * see [https://mathjs.org/docs/expressions/security.html](https://mathjs.org/docs/expressions/security.html) for more information.
   *
   * Syntax:
   *
   *     math.parse(expr)
   *     math.parse(expr, options)
   *     math.parse([expr1, expr2, expr3, ...])
   *     math.parse([expr1, expr2, expr3, ...], options)
   *
   * Example:
   *
   *     const node1 = math.parse('sqrt(3^2 + 4^2)')
   *     node1.compile().evaluate() // 5
   *
   *     let scope = {a:3, b:4}
   *     const node2 = math.parse('a * b') // 12
   *     const code2 = node2.compile()
   *     code2.evaluate(scope) // 12
   *     scope.a = 5
   *     code2.evaluate(scope) // 20
   *
   *     const nodes = math.parse(['a = 3', 'b = 4', 'a * b'])
   *     nodes[2].compile().evaluate() // 12
   *
   * See also:
   *
   *     evaluate, compile
   *
   * @param {string | string[] | Matrix} expr          Expression to be parsed
   * @param {{nodes: Object<string, Node>}} [options]  Available options:
   *                                                   - `nodes` a set of custom nodes
   * @return {Node | Node[]} node
   * @throws {Error}
   */
  const parse = typed(name, {
    string: function (expression) {
      return parseStart(expression, {})
    },
    'Array | Matrix': function (expressions) {
      return parseMultiple(expressions, {})
    },
    'string, Object': function (expression, options) {
      const extraNodes = options.nodes !== undefined ? options.nodes : {}
      return parseStart(expression, extraNodes)
    },
    'Array | Matrix, Object': parseMultiple
  })

  function parseMultiple (expressions, options = {}) {
    const extraNodes = options.nodes !== undefined ? options.nodes : {}

    // parse an array or matrix with expressions
    return deepMap(expressions, function (elem) {
      if (typeof elem !== 'string') throw new TypeError('String expected')
      return parseStart(elem, extraNodes)
    })
  }

  // Attach helper functions to the parse function
  parse.isAlpha = isAlpha
  parse.isValidLatinOrGreek = isValidLatinOrGreek
  parse.isValidMathSymbol = isValidMathSymbol
  parse.isWhitespace = isWhitespace
  parse.isDecimalMark = isDecimalMark
  parse.isDigitDot = isDigitDot
  parse.isDigit = isDigit
  parse.isHexDigit = isHexDigit

  // Now that we can parse, automatically convert strings to Nodes by parsing
  typed.addConversion({ from: 'string', to: 'Node', convert: parse })

  return parse
})
