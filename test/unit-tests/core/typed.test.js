import assert from 'assert'
import math from '../../../src/defaultInstance.js'
import Decimal from 'decimal.js'
import { ObjectWrappingMap, PartitionedMap } from '../../../src/utils/map.js'
const math2 = math.create()

describe('typed', function () {
  it('should allow access to typed-function facilities', function () {
    const fn = math.typed({
      identifier: () => 'variable',
      string: () => 'expression'
    })
    assert.strictEqual(fn('a96b2'), 'variable')
    assert.strictEqual(fn('a96+b2'), 'expression')
    assert.throws(() => fn(47), TypeError)
  })

  // TODO: Move (most) of the type checks like isNumber, isComplex, to is.test.js

  it('should test whether a value is a number', function () {
    assert.strictEqual(math.isNumber(2), true)
    assert.strictEqual(math.isNumber('foo'), false)
    assert.strictEqual(math.isNumber('2'), false)
    assert.strictEqual(math.isNumber(), false)
  })

  it('should test whether a value is a complex number', function () {
    assert.strictEqual(math.isComplex(math.complex(2, 3)), true)
    assert.strictEqual(math.isComplex(math2.complex(2, 3)), true)
    assert.strictEqual(math.isComplex({ isComplex: true }), false)
    assert.strictEqual(math.isComplex(2), false)
    assert.strictEqual(math.isComplex(), false)
  })

  it('should test whether a value is a BigNumber', function () {
    assert.strictEqual(math.isBigNumber(math.bignumber(2)), true)
    assert.strictEqual(math.isBigNumber(math2.bignumber(2)), true)
    assert.strictEqual(math.isBigNumber({ isBigNumber: true }), false)
    assert.strictEqual(math.isBigNumber(2), false)
    assert.strictEqual(math.isBigNumber(), false)
  })

  it('should test whether a value is a bigint', function () {
    assert.strictEqual(math.isBigInt(2n), true)
    assert.strictEqual(math.isBigInt(BigInt(2)), true)
    assert.strictEqual(math.isBigInt(2), false)
    assert.strictEqual(math.isBigInt(null), false)
    assert.strictEqual(math.isBigInt(), false)
  })

  it('should recognize a Decimal as a BigNumber', function () {
    assert.strictEqual(math.isBigNumber(Decimal(2)), true)
    assert.strictEqual(math.isBigNumber(Decimal('2.6666666')), true)
    assert.strictEqual(math.isBigNumber(Decimal(1).add(2)), true)
  })

  it('should test whether a value is a Fraction', function () {
    assert.strictEqual(math.isFraction(math.fraction(2, 3)), true)
    assert.strictEqual(math.isFraction(math2.fraction(2, 3)), true)
    assert.strictEqual(math.isFraction({ isFraction: true }), false)
    assert.strictEqual(math.isFraction(2), false)
    assert.strictEqual(math.isFraction(), false)
  })

  it('should test whether a value is a Unit', function () {
    assert.strictEqual(math.isUnit(math.unit('5cm')), true)
    assert.strictEqual(math.isUnit(math2.unit('5cm')), true)
    assert.strictEqual(math.isUnit({ isUnit: true }), false)
    assert.strictEqual(math.isUnit(2), false)
    assert.strictEqual(math.isUnit(), false)
  })

  it('should test whether a value is a string', function () {
    assert.strictEqual(math.isString('hello'), true)
    assert.strictEqual(math.isString({}), false)
    assert.strictEqual(math.isString(2), false)
    assert.strictEqual(math.isString(), false)
  })

  it('should test whether a value is an Array', function () {
    assert.strictEqual(math.isArray([]), true)
    assert.strictEqual(math.isArray(math2.matrix()), false)
    assert.strictEqual(math.isArray(Object.create([])), false)
    assert.strictEqual(math.isArray(2), false)
    assert.strictEqual(math.isArray(), false)
  })

  it('should test whether a value is a Matrix', function () {
    assert.strictEqual(math.isMatrix(math.matrix()), true)
    assert.strictEqual(math.isMatrix(math.matrix([], 'sparse')), true)
    assert.strictEqual(math.isMatrix(math2.matrix()), true)
    assert.strictEqual(math.isMatrix({ isMatrix: true }), false)
    assert.strictEqual(math.isMatrix(2), false)
    assert.strictEqual(math.isMatrix(), false)
  })

  it('should test whether a value is a DenseMatrix', function () {
    assert.strictEqual(math.isDenseMatrix(math.matrix()), true)
    assert.strictEqual(math.isDenseMatrix(math.matrix([], 'sparse')), false)
    assert.strictEqual(math.isDenseMatrix(math2.matrix()), true)
    assert.strictEqual(math.isDenseMatrix({ isDenseMatrix: true }), false)
    assert.strictEqual(math.isDenseMatrix(2), false)
    assert.strictEqual(math.isDenseMatrix(), false)
  })

  it('should test whether a value is a SparseMatrix', function () {
    assert.strictEqual(math.isSparseMatrix(math.matrix()), false)
    assert.strictEqual(math.isSparseMatrix(math.matrix([], 'sparse')), true)
    assert.strictEqual(math.isSparseMatrix(math2.matrix([], 'sparse')), true)
    assert.strictEqual(math.isSparseMatrix({ isSparseMatrix: true }), false)
    assert.strictEqual(math.isSparseMatrix(2), false)
    assert.strictEqual(math.isSparseMatrix(), false)
  })

  it('should test whether a value is a Range', function () {
    assert.strictEqual(math.isRange(new math.Range()), true)
    assert.strictEqual(math.isRange(new math2.Range()), true)
    assert.strictEqual(math.isRange({ isRange: true }), false)
    assert.strictEqual(math.isRange(2), false)
    assert.strictEqual(math.isRange(), false)
  })

  it('should test whether a value is an Index', function () {
    assert.strictEqual(math.isIndex(new math.Index()), true)
    assert.strictEqual(math.isIndex(new math2.Index()), true)
    assert.strictEqual(math.isIndex({ isIndex: true }), false)
    assert.strictEqual(math.isIndex(2), false)
    assert.strictEqual(math.isIndex(), false)
  })

  it('should test whether a value is a boolean', function () {
    assert.strictEqual(math.isBoolean(true), true)
    assert.strictEqual(math.isBoolean(false), true)
    assert.strictEqual(math.isBoolean(2), false)
    assert.strictEqual(math.isBoolean(), false)
  })

  it('should test whether a value is a ResultSet', function () {
    assert.strictEqual(math.isResultSet(new math.ResultSet()), true)
    assert.strictEqual(math.isResultSet(new math2.ResultSet()), true)
    assert.strictEqual(math.isResultSet({ isResultSet: true }), false)
    assert.strictEqual(math.isResultSet(2), false)
    assert.strictEqual(math.isResultSet(), false)
  })

  it('should test whether a value is an Help', function () {
    assert.strictEqual(math.isHelp(new math.Help({ doc: [] })), true)
    assert.strictEqual(math.isHelp(new math2.Help({ doc: [] })), true)
    assert.strictEqual(math.isHelp({ isHelp: true }), false)
    assert.strictEqual(math.isHelp(2), false)
    assert.strictEqual(math.isHelp(), false)
  })

  it('should test whether a value is a function', function () {
    assert.strictEqual(math.isFunction(function () {}), true)
    assert.strictEqual(math.isFunction(2), false)
    assert.strictEqual(math.isFunction(), false)
  })

  it('should test whether a value is a Date', function () {
    assert.strictEqual(math.isDate(new Date()), true)
    assert.strictEqual(math.isDate(function () {}), false)
    assert.strictEqual(math.isDate(2), false)
    assert.strictEqual(math.isDate(), false)
  })

  it('should test whether a value is a RegExp', function () {
    assert.strictEqual(math.isRegExp(/test/), true)
    assert.strictEqual(math.isRegExp(function () {}), false)
    assert.strictEqual(math.isRegExp(2), false)
    assert.strictEqual(math.isRegExp(), false)
  })

  it('should test whether a value is null', function () {
    assert.strictEqual(math.isNull(null), true)
    assert.strictEqual(math.isNull(math.matrix()), false)
    assert.strictEqual(math.isNull(2), false)
    assert.strictEqual(math.isNull(), false)
  })

  it('should test whether a value is an object', function () {
    assert.strictEqual(math.isObject({}), true)
    assert.strictEqual(math.isObject({ a: 2 }), true)
    assert.strictEqual(math.isObject(Object.create({})), true)
    assert.strictEqual(math.isObject(null), false)
    assert.strictEqual(math.isObject([]), false)
    assert.strictEqual(math.isObject(), false)
    assert.strictEqual(math.isObject(undefined), false)
  })

  it('should test whether a value is a Map', function () {
    assert.strictEqual(math.isMap({}), false)
    assert.strictEqual(math.isMap(new Map()), true)
    assert.strictEqual(math.isMap(new ObjectWrappingMap({})), true)
    assert.strictEqual(math.isMap(new PartitionedMap(new Map(), new Map(), new Set(['x']))), true)
  })

  it('should test whether a value is a PartitionedMap', function () {
    assert.strictEqual(math.isPartitionedMap({}), false)
    assert.strictEqual(math.isPartitionedMap(new Map()), false)
    assert.strictEqual(math.isPartitionedMap(new ObjectWrappingMap({})), false)
    assert.strictEqual(math.isPartitionedMap(new PartitionedMap(new Map(), new Map(), new Set(['x']))), true)
  })

  it('should test whether a value is an ObjectWrappingMap', function () {
    assert.strictEqual(math.isObjectWrappingMap({}), false)
    assert.strictEqual(math.isObjectWrappingMap(new Map()), false)
    assert.strictEqual(math.isObjectWrappingMap(new ObjectWrappingMap({})), true)
    assert.strictEqual(math.isObjectWrappingMap(new PartitionedMap(new Map(), new Map(), new Set(['x']))), false)
  })

  it('should test whether a value is undefined', function () {
    assert.strictEqual(math.isUndefined(undefined), true)
    assert.strictEqual(math.isUndefined(math.matrix()), false)
    assert.strictEqual(math.isUndefined(2), false)
    assert.strictEqual(math.isUndefined(), true)
    assert.strictEqual(math.isUndefined(null), false)
  })

  it('should test whether a value is an OperatorNode', function () {
    assert.strictEqual(math.isOperatorNode(new math.OperatorNode('', '', [])), true)
    assert.strictEqual(math.isOperatorNode(new math2.OperatorNode('', '', [])), true)
    assert.strictEqual(math.isOperatorNode({ isOperatorNode: true }), false)
    assert.strictEqual(math.isOperatorNode(2), false)
    assert.strictEqual(math.isOperatorNode(), false)
  })

  it('should test whether a value is a ConstantNode', function () {
    assert.strictEqual(math.isConstantNode(new math.ConstantNode(2)), true)
    assert.strictEqual(math.isConstantNode(new math2.ConstantNode(2)), true)
    assert.strictEqual(math.isConstantNode({ isConstantNode: true }), false)
    assert.strictEqual(math.isConstantNode(2), false)
    assert.strictEqual(math.isConstantNode(), false)
  })

  it('should test whether a value is a SymbolNode', function () {
    assert.strictEqual(math.isSymbolNode(new math.SymbolNode('')), true)
    assert.strictEqual(math.isSymbolNode(new math2.SymbolNode('')), true)
    assert.strictEqual(math.isSymbolNode({ isSymbolNode: true }), false)
    assert.strictEqual(math.isSymbolNode(2), false)
    assert.strictEqual(math.isSymbolNode(), false)
  })

  it('should test whether a value is a ParenthesisNode', function () {
    assert.strictEqual(math.isParenthesisNode(new math.ParenthesisNode(new math.SymbolNode(''))), true)
    assert.strictEqual(math.isParenthesisNode(new math2.ParenthesisNode(new math2.SymbolNode(''))), true)
    assert.strictEqual(math.isParenthesisNode({ isParenthesisNode: true }), false)
    assert.strictEqual(math.isParenthesisNode(2), false)
    assert.strictEqual(math.isParenthesisNode(), false)
  })

  it('should test whether a value is a FunctionNode', function () {
    assert.strictEqual(math.isFunctionNode(new math.FunctionNode('', [])), true)
    assert.strictEqual(math.isFunctionNode(new math2.FunctionNode('', [])), true)
    assert.strictEqual(math.isFunctionNode({ isFunctionNode: true }), false)
    assert.strictEqual(math.isFunctionNode(2), false)
    assert.strictEqual(math.isFunctionNode(), false)
  })

  it('should test whether a value is a FunctionAssignmentNode', function () {
    assert.strictEqual(math.isFunctionAssignmentNode(new math.FunctionAssignmentNode('', [], new math.SymbolNode(''))), true)
    assert.strictEqual(math.isFunctionAssignmentNode(new math2.FunctionAssignmentNode('', [], new math2.SymbolNode(''))), true)
    assert.strictEqual(math.isFunctionAssignmentNode({ isFunctionAssignmentNode: true }), false)
    assert.strictEqual(math.isFunctionAssignmentNode(2), false)
    assert.strictEqual(math.isFunctionAssignmentNode(), false)
  })

  it('should test whether a value is an ArrayNode', function () {
    assert.strictEqual(math.isArrayNode(new math.ArrayNode([])), true)
    assert.strictEqual(math.isArrayNode(new math2.ArrayNode([])), true)
    assert.strictEqual(math.isArrayNode({ isArrayNode: true }), false)
    assert.strictEqual(math.isArrayNode(2), false)
    assert.strictEqual(math.isArrayNode(), false)
  })

  it('should test whether a value is an AssignmentNode', function () {
    const s = new math.SymbolNode('')
    const i = new math.IndexNode([])
    const v = new math.ConstantNode(2)

    assert.strictEqual(math.isAssignmentNode(new math.AssignmentNode(s, i, v)), true)
    assert.strictEqual(math.isAssignmentNode(new math2.AssignmentNode(s, i, v)), true)
    assert.strictEqual(math.isAssignmentNode({ isAssignmentNode: true }), false)
    assert.strictEqual(math.isAssignmentNode(2), false)
    assert.strictEqual(math.isAssignmentNode(), false)
  })

  it('should test whether a value is an AccessorNode', function () {
    const a = new math.SymbolNode('a')
    const index = new math.IndexNode([new math.ConstantNode('b')])

    assert.strictEqual(math.isAccessorNode(new math.AccessorNode(a, index)), true)
    assert.strictEqual(math.isAccessorNode(new math2.AccessorNode(a, index)), true)
    assert.strictEqual(math.isAccessorNode({ isAccessorNode: true }), false)
    assert.strictEqual(math.isAccessorNode(2), false)
    assert.strictEqual(math.isAccessorNode(), false)
  })

  it('should test whether a value is a BlockNode', function () {
    assert.strictEqual(math.isBlockNode(new math.BlockNode([])), true)
    assert.strictEqual(math.isBlockNode(new math2.BlockNode([])), true)
    assert.strictEqual(math.isBlockNode({ isBlockNode: true }), false)
    assert.strictEqual(math.isBlockNode(2), false)
    assert.strictEqual(math.isBlockNode(), false)
  })

  it('should test whether a value is a ObjectNode', function () {
    assert.strictEqual(math.isObjectNode(new math.ObjectNode({})), true)
    assert.strictEqual(math.isObjectNode(new math2.ObjectNode({})), true)
    assert.strictEqual(math.isObjectNode({ isObjectNode: true }), false)
    assert.strictEqual(math.isObjectNode(2), false)
    assert.strictEqual(math.isObjectNode(), false)
  })

  it('should test whether a value is a ConditionalNode', function () {
    const c = new math.SymbolNode('')
    const t = new math.ConstantNode(1)
    const f = new math.ConstantNode(2)

    assert.strictEqual(math.isConditionalNode(new math.ConditionalNode(c, t, f)), true)
    assert.strictEqual(math.isConditionalNode(new math2.ConditionalNode(c, t, f)), true)
    assert.strictEqual(math.isConditionalNode({ isConditionalNode: true }), false)
    assert.strictEqual(math.isConditionalNode(2), false)
    assert.strictEqual(math.isConditionalNode(), false)
  })

  it('should test whether a value is an IndexNode', function () {
    assert.strictEqual(math.isIndexNode(new math.IndexNode([])), true)
    assert.strictEqual(math.isIndexNode(new math2.IndexNode([])), true)
    assert.strictEqual(math.isIndexNode({ isIndexNode: true }), false)
    assert.strictEqual(math.isIndexNode(2), false)
    assert.strictEqual(math.isIndexNode(), false)
  })

  it('should test whether a value is a RangeNode', function () {
    const s = new math.ConstantNode(1)
    const e = new math.ConstantNode(10)

    assert.strictEqual(math.isRangeNode(new math.RangeNode(s, e)), true)
    assert.strictEqual(math.isRangeNode(new math2.RangeNode(s, e)), true)
    assert.strictEqual(math.isRangeNode({ isRangeNode: true }), false)
    assert.strictEqual(math.isRangeNode(2), false)
    assert.strictEqual(math.isRangeNode(), false)
  })

  it('should test whether a value is a RelationalNode', function () {
    const c = ''
    const p = new math.ConstantNode(1)

    assert.strictEqual(math.isRelationalNode(new math.RelationalNode([c], [p, p])), true)
    assert.strictEqual(math.isRelationalNode(new math2.RelationalNode([c], [p, p])), true)
    assert.strictEqual(math.isRelationalNode({ isRelationalNode: true }), false)
    assert.strictEqual(math.isRelationalNode(2), false)
    assert.strictEqual(math.isRelationalNode(), false)
  })

  it('should test whether a value is a Node', function () {
    assert.strictEqual(math.isNode(new math.ConstantNode(1)), true)
    assert.strictEqual(math.isNode(new math2.ConstantNode(1)), true)
    assert.strictEqual(math.isNode(new math.SymbolNode('a')), true)
    assert.strictEqual(math.isNode({ isNode: true }), false)
    assert.strictEqual(math.isNode(2), false)
    assert.strictEqual(math.isNode(), false)
  })

  it('should test whether a value is a chain', function () {
    assert.strictEqual(math.isChain(math.chain(2)), true)
    assert.strictEqual(math.isChain({ isChain: true }), false)
    assert.strictEqual(math.isChain(2), false)
    assert.strictEqual(math.isChain(), false)
  })

  it('should convert a bigint to number if possible', function () {
    const double = math.typed('double', {
      number: (x) => x + x
    })

    assert.strictEqual(double(2), 4)
    assert.strictEqual(double(2n), 4)
    assert.throws(() => double(12345678901234567890n), /value exceeds the max safe integer/)
  })

  it('should convert a bigint to BigNumber', function () {
    const double = math.typed('double', {
      BigNumber: (x) => x.plus(x)
    })

    assert.deepStrictEqual(double(math.bignumber(2)), math.bignumber(4))
    assert.deepStrictEqual(double(2n), math.bignumber(4))
    assert.deepStrictEqual(double(12345678901234567890n), math.bignumber('24691357802469135780'))
  })

  it('should convert a bigint to Fraction', function () {
    const double = math.typed('double', {
      Fraction: (x) => x.add(x)
    })

    assert.deepStrictEqual(double(math.fraction(2)), math.fraction(4))
    assert.deepStrictEqual(double(2n), math.fraction(4))
  })
})
