// test typeof
const assert = require('assert')
const math = require('../../../src/main')
const Index = math.type.Index
const Range = math.type.Range
const Help = math.type.Help
const Unit = math.type.Unit
const Complex = math.type.Complex
const Fraction = math.type.Fraction

describe('typeof', function () {
  it('should return number type for a number', function () {
    assert.strictEqual(math.typeof(2), 'number')
    assert.strictEqual(math.typeof(Number(2)), 'number')
    assert.strictEqual(math.typeof(Number(2.3)), 'number')
    assert.strictEqual(math.typeof(NaN), 'number')
  })

  it('should return bignumber type for a bignumber', function () {
    assert.strictEqual(math.typeof(math.bignumber(0.1)), 'BigNumber')
    assert.strictEqual(math.typeof(new math.type.BigNumber('0.2')), 'BigNumber')
  })

  it('should return string type for a string', function () {
    assert.strictEqual(math.typeof('hello there'), 'string')
    assert.strictEqual(math.typeof(String('hello there')), 'string')
  })

  it('should return complex type for a complex number', function () {
    assert.strictEqual(math.typeof(new Complex(2, 3)), 'Complex')
    assert.strictEqual(math.typeof(math.complex(2, 3)), 'Complex')
  })

  it('should return complex type for a fraction', function () {
    assert.strictEqual(math.typeof(new Fraction(2, 3)), 'Fraction')
    assert.strictEqual(math.typeof(math.fraction(2, 3)), 'Fraction')
  })

  it('should return array type for an array', function () {
    assert.strictEqual(math.typeof([1, 2, 3]), 'Array')
  })

  it('should return array type for an array', function () {
    assert.strictEqual(math.typeof([1, 2, 3]), 'Array')
  })

  it('should return matrix type for a matrix', function () {
    assert.strictEqual(math.typeof(math.matrix()), 'Matrix')
    assert.strictEqual(math.typeof(math.matrix()), 'Matrix')
  })

  it('should return unit type for a unit', function () {
    assert.strictEqual(math.typeof(new Unit(5, 'cm')), 'Unit')
    assert.strictEqual(math.typeof(math.unit('5cm')), 'Unit')
  })

  it('should return boolean type for a boolean', function () {
    assert.strictEqual(math.typeof(true), 'boolean')
    assert.strictEqual(math.typeof(false), 'boolean')
    assert.strictEqual(math.typeof(Boolean(true)), 'boolean')
  })

  it('should return null type for null', function () {
    assert.strictEqual(math.typeof(null), 'null')
  })

  it('should return undefined type for undefined', function () {
    assert.strictEqual(math.typeof(undefined), 'undefined')
  })

  it('should return date type for a Date', function () {
    assert.strictEqual(math.typeof(new Date()), 'Date')
  })

  it('should return the type of a regexp', function () {
    assert.strictEqual(math.typeof(/regexp/), 'RegExp')
  })

  it('should return function type for a function', function () {
    function f1 () {}
    assert.strictEqual(math.typeof(f1), 'Function')
  })

  it('should return function type for a chain', function () {
    assert.strictEqual(math.typeof(math.chain(3)), 'Chain')
  })

  it('should return function type for a ResultSet', function () {
    assert.strictEqual(math.typeof(math.eval('a=2\nb=3')), 'ResultSet')
    assert.strictEqual(math.typeof(new math.type.ResultSet([2, 3])), 'ResultSet')
  })

  it('should return function type for nodes', function () {
    const constantNode = new math.expression.node.ConstantNode(2)
    const symbolNode = new math.expression.node.SymbolNode('x')
    const indexNode = new math.expression.node.IndexNode([])

    assert.strictEqual(math.typeof(new math.expression.node.AccessorNode(symbolNode, indexNode)), 'AccessorNode')
    assert.strictEqual(math.typeof(new math.expression.node.ArrayNode([])), 'ArrayNode')
    assert.strictEqual(math.typeof(new math.expression.node.AssignmentNode(symbolNode, constantNode)), 'AssignmentNode')
    assert.strictEqual(math.typeof(new math.expression.node.BlockNode([])), 'BlockNode')
    assert.strictEqual(math.typeof(new math.expression.node.ConditionalNode(symbolNode, constantNode, constantNode)), 'ConditionalNode')
    assert.strictEqual(math.typeof(constantNode), 'ConstantNode')
    assert.strictEqual(math.typeof(new math.expression.node.FunctionAssignmentNode('f', [], constantNode)), 'FunctionAssignmentNode')
    assert.strictEqual(math.typeof(new math.expression.node.FunctionNode('f', [])), 'FunctionNode')
    assert.strictEqual(math.typeof(indexNode), 'IndexNode')
    assert.strictEqual(math.typeof(new math.expression.node.ObjectNode({})), 'ObjectNode')
    assert.strictEqual(math.typeof(new math.expression.node.ParenthesisNode(constantNode)), 'ParenthesisNode')
    assert.strictEqual(math.typeof(new math.expression.node.RangeNode(constantNode, constantNode)), 'RangeNode')
    assert.strictEqual(math.typeof(symbolNode), 'SymbolNode')
  })

  it('should return function type for an index', function () {
    assert.strictEqual(math.typeof(new Index([0, 10])), 'Index')
  })

  it('should return function type for a range', function () {
    assert.strictEqual(math.typeof(new Range(0, 10)), 'Range')
  })

  it('should return function type for a help object', function () {
    assert.strictEqual(math.typeof(new Help({}, {})), 'Help')
  })

  it('should return object type for an object', function () {
    assert.strictEqual(math.typeof({}), 'Object')
  })

  it('should throw an error if called with a wrong number of arguments', function () {
    assert.throws(function () { math.typeof() })
    assert.throws(function () { math.typeof(1, 2) })
  })

  it('should LaTeX typeof', function () {
    const expression = math.parse('typeof(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{typeof}\\left(1\\right)')
  })

  it('should throw an error in case of wrong number of arguments', function () {
    assert.throws(function () { math.typeof() }, /Too few arguments in function _typeof/)
    assert.throws(function () { math.typeof(1, 2, 3) }, /Too many arguments in function _typeof/)
  })
})
