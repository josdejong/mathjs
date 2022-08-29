// test sqrt
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const mathPredictable = math.create({ predictable: true })
const sqrt = math.sqrt
const bignumber = math.bignumber

describe('sqrt', function () {
  it('should return the square root of a boolean', function () {
    assert.strictEqual(sqrt(true), 1)
    assert.strictEqual(sqrt(false), 0)
  })

  it('should return the square root of a positive number', function () {
    assert.strictEqual(sqrt(0), 0)
    assert.strictEqual(sqrt(1), 1)
    assert.strictEqual(sqrt(4), 2)
    assert.strictEqual(sqrt(9), 3)
    assert.strictEqual(sqrt(16), 4)
    assert.strictEqual(sqrt(25), 5)
  })

  it('should return the square root of a negative number', function () {
    assert.deepStrictEqual(sqrt(-4), math.complex(0, 2))
    assert.deepStrictEqual(sqrt(-16), math.complex(0, 4))
  })

  it('should return the square root of a negative number when predictable:true', function () {
    assert.strictEqual(mathPredictable.sqrt(4), 2)
    assert(typeof mathPredictable.sqrt(-4), 'number')
    assert(isNaN(mathPredictable.sqrt(-4)))
  })

  it('should return the square root of a positive bignumber', function () {
    assert.deepStrictEqual(sqrt(bignumber(0)), bignumber(0))
    assert.deepStrictEqual(sqrt(bignumber(1)), bignumber(1))
    assert.deepStrictEqual(sqrt(bignumber(4)), bignumber(2))
    assert.deepStrictEqual(sqrt(bignumber(9)), bignumber(3))
    assert.deepStrictEqual(sqrt(bignumber(16)), bignumber(4))
    assert.deepStrictEqual(sqrt(bignumber(25)), bignumber(5))

    // validate whether we are really working at high precision
    const bigmath = math.create({ precision: 100 })
    assert.deepStrictEqual(bigmath.sqrt(bigmath.bignumber(2)), bigmath.bignumber('1.414213562373095048801688724209698078569671875376948073176679737990732478462107038850387534327641573'))
  })

  it('should return the square root of a negative bignumber', function () {
    assert.deepStrictEqual(sqrt(bignumber(-4)), math.complex(0, 2))
  })

  it('should return the square root of a negative bignumber when predictable:true', function () {
    assert.deepStrictEqual(mathPredictable.sqrt(bignumber(4)), bignumber(2))
    assert.ok(mathPredictable.sqrt(bignumber(-4)).isNaN())
  })

  it('should return the square root of a complex number', function () {
    assert.deepStrictEqual(sqrt(math.complex(3, -4)), math.complex(2, -1))
    assert.deepStrictEqual(sqrt(math.complex(1e10, 1e-10)), math.complex(1e5, 5e-16))
  })

  it('should return the square root of a unit', function () {
    assert.strictEqual(sqrt(math.unit('25 m^2/s^2')).toString(), '5 m / s')
    assert.strictEqual(sqrt(math.unit('4 kg')).toString(), '2 kg^0.5')
  })

  it('should return a Unit with a Complex value when computing the square root of a negative unit', function () {
    // Update this when support for complex units is added
    // assert.strictEqual(sqrt(math.unit('-25 m^2/s^2')).toString(), 'NaN m / s')
    assert.strictEqual(math.format(sqrt(math.unit('-25 m^2/s^2')), 14), '(5i) m / s')
  })

  it('should return NaN if input is NaN', function () {
    assert(isNaN(sqrt(NaN)))
  })

  it('should throw an error when used with a string', function () {
    assert.throws(function () {
      sqrt('a string')
    })
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => sqrt([4, 9, 16, 25]), TypeError)
    assert.deepStrictEqual(math.map([4, 9, 16, 25], sqrt), [2, 3, 4, 5])
    assert.deepStrictEqual(math.map([[4, 9], [16, 25]], sqrt), [[2, 3], [4, 5]])
    assert.deepStrictEqual(math.map(math.matrix([[4, 9], [16, 25]]), sqrt), math.matrix([[2, 3], [4, 5]]))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { sqrt() }, /TypeError: Too few arguments/)
    assert.throws(function () { sqrt(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { sqrt(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX sqrt', function () {
    const expression = math.parse('sqrt(2)')
    assert.strictEqual(expression.toTex(), '\\sqrt{2}')
  })
})
