// test not
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const not = math.not
const FunctionNode = math.FunctionNode
const ConstantNode = math.ConstantNode
const SymbolNode = math.SymbolNode

describe('not', function () {
  it('should not numbers correctly', function () {
    assert.strictEqual(not(1), false)
    assert.strictEqual(not(-1), false)
    assert.strictEqual(not(1.23e+100), false)
    assert.strictEqual(not(-1.0e-100), false)
    assert.strictEqual(not(1.0e-100), false)
    assert.strictEqual(not(Infinity), false)
    assert.strictEqual(not(-Infinity), false)
    assert.strictEqual(not(0), true)
    assert.strictEqual(not(NaN), true)
  })

  it('should not a bigint', function () {
    assert.strictEqual(not(1n), false)
    assert.strictEqual(not(-1n), false)
    assert.strictEqual(not(0n), true)
  })

  it('should not complex numbers', function () {
    assert.strictEqual(not(complex(1, 1)), false)
    assert.strictEqual(not(complex(0, 1)), false)
    assert.strictEqual(not(complex(1, 0)), false)
    assert.strictEqual(not(complex(0, 0)), true)
    assert.strictEqual(not(complex()), true)
    assert.strictEqual(not(complex(0)), true)
    assert.strictEqual(not(complex(1)), false)
  })

  it('should not booleans', function () {
    assert.strictEqual(not(true), false)
    assert.strictEqual(not(false), true)
  })

  it('should not bignumbers', function () {
    assert.strictEqual(not(bignumber(1)), false)
    assert.strictEqual(not(bignumber(-1)), false)
    assert.strictEqual(not(bignumber(0)), true)
    assert.strictEqual(not(bignumber(NaN)), true)
    assert.strictEqual(not(bignumber('1e+10')), false)
    assert.strictEqual(not(bignumber('-1.0e-100')), false)
    assert.strictEqual(not(bignumber('1.0e-100')), false)
    assert.strictEqual(not(bignumber(Infinity)), false)
    assert.strictEqual(not(bignumber(-Infinity)), false)
  })

  it('should not units', function () {
    assert.strictEqual(not(unit('100cm')), false)
    assert.strictEqual(not(unit('0 inch')), true)
    assert.strictEqual(not(unit('1m')), false)
    assert.strictEqual(not(unit('m')), true)
    assert.strictEqual(not(unit('-10inch')), false)

    assert.strictEqual(not(unit(bignumber(1), 'm')), false)
    assert.strictEqual(not(unit(bignumber(0), 'm')), true)
  })

  it('should not arrays', function () {
    assert.deepStrictEqual(not([0, 10]), [true, false])
    assert.deepStrictEqual(not([]), [])
  })

  it('should not matrices', function () {
    assert.deepStrictEqual(not(matrix([0, 10])), matrix([true, false]))
    assert.deepStrictEqual(not(matrix([])), matrix([]))
  })

  it('should not null', function () {
    assert.strictEqual(not(null), true)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { not() }, /TypeError: Too few arguments/)
    assert.throws(function () { not(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type if arguments', function () {
    assert.throws(function () { not(new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { not({}) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX not', function () {
    const c = new ConstantNode(1)
    const node = new FunctionNode(new SymbolNode('not'), [c])
    assert.strictEqual(node.toTex(), '\\neg\\left(1\\right)')
  })
})
