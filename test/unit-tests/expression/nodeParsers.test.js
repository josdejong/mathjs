import assert from 'assert'
import { parseStart, setDependencies } from '../../../src/expression/nodeParsers.js'
import { initialState, openParams, closeParams } from '../../../src/expression/parserState.js'
import { TOKENTYPE } from '../../../src/expression/lexer.js'
import * as isFunctions from '../../../src/utils/is.js'
import { hasOwnProperty } from '../../../src/utils/object.js'
import { safeNumberType } from '../../../src/utils/number.js'
import { createSyntaxError, createError } from '../../../src/expression/error.js'

// Mock Node Constructors
const mockNodes = {
  AccessorNode: function (...args) { this.name = 'AccessorNode'; this.args = args; },
  ArrayNode: function (...args) { this.name = 'ArrayNode'; this.args = args; },
  AssignmentNode: function (...args) { this.name = 'AssignmentNode'; this.args = args; },
  BlockNode: function (...args) { this.name = 'BlockNode'; this.args = args; },
  ConditionalNode: function (...args) { this.name = 'ConditionalNode'; this.args = args; },
  ConstantNode: function (...args) { this.name = 'ConstantNode'; this.args = args; },
  FunctionAssignmentNode: function (...args) { this.name = 'FunctionAssignmentNode'; this.args = args; },
  FunctionNode: function (...args) { this.name = 'FunctionNode'; this.args = args; },
  IndexNode: function (...args) { this.name = 'IndexNode'; this.args = args; },
  ObjectNode: function (...args) { this.name = 'ObjectNode'; this.args = args; },
  OperatorNode: function (...args) { this.name = 'OperatorNode'; this.args = args; },
  ParenthesisNode: function (...args) { this.name = 'ParenthesisNode'; this.args = args; },
  RangeNode: function (...args) { this.name = 'RangeNode'; this.args = args; },
  RelationalNode: function (...args) { this.name = 'RelationalNode'; this.args = args; },
  SymbolNode: function (...args) { this.name = 'SymbolNode'; this.args = args; }
}

Object.values(mockNodes).forEach(MockNode => {
  MockNode.prototype.isNode = true
  if (MockNode.name === 'ConstantNode') MockNode.prototype.isConstantNode = true
  if (MockNode.name === 'SymbolNode') MockNode.prototype.isSymbolNode = true
  if (MockNode.name === 'OperatorNode') MockNode.prototype.isOperatorNode = true
  if (MockNode.name === 'ParenthesisNode') MockNode.prototype.isParenthesisNode = true
  // Add other is*Node properties to prototypes if a test fails due to it.
  // For example, for parseAssignment testing isAccessorNode:
  if (MockNode.name === 'AccessorNode') MockNode.prototype.isAccessorNode = true;

})

// Mock numeric and config
const mockNumeric = (val) => parseFloat(val) // Simple mock
const mockConfig = { number: 'number' }      // Simple mock

// Mock Lexer
let tokenQueue = []
const mockLexer = {
  getToken: (state) => {
    if (tokenQueue.length === 0) {
      // Default to end-of-expression token if queue is empty and not explicitly set
      state.token = ''
      state.tokenType = TOKENTYPE.DELIMITER
      return
    }
    const nextToken = tokenQueue.shift()
    state.token = nextToken.token
    state.tokenType = nextToken.tokenType
    state.index += (nextToken.token || '').length // Simplistic index update
  },
  getTokenSkipNewline: (state) => { // Simplified: assumes no newlines to skip for these tests
    mockLexer.getToken(state)
  }
}

describe('nodeParsers.js', () => {
  beforeEach(() => {
    tokenQueue = [] // Reset token queue for each test

    // Call setDependencies with all required mocks and real functions
    setDependencies({
      // Mocked dependencies
      ...mockNodes,
      numeric: mockNumeric,
      config: mockConfig,
      getToken: mockLexer.getToken,
      getTokenSkipNewline: mockLexer.getTokenSkipNewline,

      // Real utility functions
      ...isFunctions,
      hasOwnProperty,
      safeNumberType,

      // Real error functions
      createSyntaxError,
      createError,

      // Real parserState functions
      initialState,
      openParams,
      closeParams,

      // Constants from lexer (simplified where possible)
      TOKENTYPE,
      DELIMITERS: { // Minimal set for basic tests, expand as needed
        '': true, // End of expression
        '+': true,
        '-': true,
        '*': true,
        '/': true,
        '(': true,
        ')': true,
        '[': true,
        ']': true,
        ',': true,
        '.': true,
        ';': true,
        ':': true,
        '=': true
      },
      NAMED_DELIMITERS: { 'mod': true, 'to': true, 'in': true, 'and': true, 'xor': true, 'or': true, 'not': true },
      CONSTANTS: { true: true, false: false, null: null, undefined }, // Using global undefined
      NUMERIC_CONSTANTS: ['NaN', 'Infinity'],
      ESCAPE_CHARACTERS: { '\\"': '"', '\\\\': '\\', '\\n': '\n' } // Minimal
    })
  })

  it('should parse a simple number (testing parseNumber indirectly)', () => {
    tokenQueue = [
      { token: '123', tokenType: TOKENTYPE.NUMBER },
      { token: '', tokenType: TOKENTYPE.DELIMITER } // End of expression
    ]
    const result = parseStart('123', {})
    assert.ok(result instanceof mockNodes.ConstantNode, 'Result should be a ConstantNode')
    assert.deepStrictEqual(result.args, [123])
  })

  it('should parse a symbol (testing parseSymbol indirectly)', () => {
    tokenQueue = [
      { token: 'x', tokenType: TOKENTYPE.SYMBOL },
      { token: '', tokenType: TOKENTYPE.DELIMITER }
    ]
    const result = parseStart('x', {})
    assert.ok(result instanceof mockNodes.SymbolNode, 'Result should be a SymbolNode')
    assert.deepStrictEqual(result.args, ['x'])
  })

  it('should parse "true" as a constant (testing parseSymbol indirectly)', () => {
    tokenQueue = [
      { token: 'true', tokenType: TOKENTYPE.SYMBOL }, // Lexer identifies it as symbol first
      { token: '', tokenType: TOKENTYPE.DELIMITER }
    ]
    const result = parseStart('true', {})
    assert.ok(result instanceof mockNodes.ConstantNode, 'Result should be a ConstantNode for "true"')
    assert.deepStrictEqual(result.args, [true])
  })

  it('should parse unary minus (testing parseUnary indirectly)', () => {
    tokenQueue = [
      { token: '-', tokenType: TOKENTYPE.DELIMITER },
      { token: '5', tokenType: TOKENTYPE.NUMBER },
      { token: '', tokenType: TOKENTYPE.DELIMITER }
    ]
    const result = parseStart('-5', {})
    assert.ok(result instanceof mockNodes.OperatorNode, 'Result should be an OperatorNode')
    assert.strictEqual(result.args[0], '-')
    assert.strictEqual(result.args[1], 'unaryMinus')
    assert.ok(result.args[2][0] instanceof mockNodes.ConstantNode)
    assert.deepStrictEqual(result.args[2][0].args, [5])
  })

  it('should parse addition (testing parseAddSubtract indirectly)', () => {
    tokenQueue = [
      { token: '1', tokenType: TOKENTYPE.NUMBER },
      { token: '+', tokenType: TOKENTYPE.DELIMITER },
      { token: '2', tokenType: TOKENTYPE.NUMBER },
      { token: '', tokenType: TOKENTYPE.DELIMITER }
    ]
    const result = parseStart('1+2', {})
    assert.ok(result instanceof mockNodes.OperatorNode, 'Result should be an OperatorNode for addition')
    assert.strictEqual(result.args[0], '+')
    assert.strictEqual(result.args[1], 'add')
    assert.ok(result.args[2][0] instanceof mockNodes.ConstantNode)
    assert.deepStrictEqual(result.args[2][0].args, [1])
    assert.ok(result.args[2][1] instanceof mockNodes.ConstantNode)
    assert.deepStrictEqual(result.args[2][1].args, [2])
  })

  it('should parse parentheses (testing parseParentheses indirectly)', () => {
    tokenQueue = [
      { token: '(', tokenType: TOKENTYPE.DELIMITER },
      { token: '1', tokenType: TOKENTYPE.NUMBER },
      { token: ')', tokenType: TOKENTYPE.DELIMITER },
      { token: '', tokenType: TOKENTYPE.DELIMITER }
    ]
    const result = parseStart('(1)', {})
    assert.ok(result instanceof mockNodes.ParenthesisNode, 'Result should be a ParenthesisNode')
    assert.ok(result.args[0] instanceof mockNodes.ConstantNode)
    assert.deepStrictEqual(result.args[0].args, [1])
  })
})
