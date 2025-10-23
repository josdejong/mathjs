import assert from 'assert'
import { approxEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const factorial = math.factorial

describe('factorial', function () {
  it('should calculate the factorial of a number', function () {
    assert.strictEqual(factorial(0), 1)
    assert.strictEqual(factorial(1), 1)
    assert.strictEqual(factorial(2), 2)
    assert.strictEqual(factorial(3), 6)
    assert.strictEqual(factorial(4), 24)
    assert.strictEqual(factorial(5), 120)
    assert.ok(!Number.isFinite(factorial(Number.MAX_VALUE))) // shouldn't stall
    assert.ok(!Number.isFinite(factorial(Infinity)))
  })

  it('should calculate the factorial of a bignumber', function () {
    const bigmath = math.create({ number: 'BigNumber', precision: 5 })
    assert.deepStrictEqual(bigmath.factorial(bigmath.bignumber(0)), bigmath.bignumber(1))
    assert.deepStrictEqual(bigmath.factorial(bigmath.bignumber(Infinity)).toString(), 'Infinity')
    assert.deepStrictEqual(bigmath.factorial(bigmath.bignumber(11)), bigmath.bignumber(39917000))
    assert.deepStrictEqual(bigmath.factorial(bigmath.bignumber(22)), bigmath.bignumber(1.124e+21))
    assert.deepStrictEqual(bigmath.factorial(bigmath.bignumber(24)), bigmath.bignumber(6.2045e+23))
    assert.deepStrictEqual(bigmath.factorial(bigmath.bignumber(26)), bigmath.bignumber(4.0329e+26))

    const bigmath20 = bigmath.create({ precision: 20 })
    assert.deepStrictEqual(bigmath20.factorial(bigmath20.bignumber(5)), bigmath20.bignumber(120))
    assert.deepStrictEqual(bigmath20.factorial(bigmath20.bignumber(19)), bigmath20.bignumber(121645100408832000))
    assert.deepStrictEqual(bigmath20.factorial(bigmath20.bignumber(20)), bigmath20.bignumber(2432902008176640000))
    assert.deepStrictEqual(bigmath20.factorial(bigmath20.bignumber(21)), bigmath20.bignumber('51090942171709440000'))
    assert.deepStrictEqual(bigmath20.factorial(bigmath20.bignumber(25)), bigmath20.bignumber('1.5511210043330985984e+25'))
    assert.deepStrictEqual(bigmath20.factorial(bigmath20.bignumber(24)), bigmath20.bignumber('6.2044840173323943936e+23'))
    assert.deepStrictEqual(bigmath20.factorial(bigmath20.bignumber(22)), bigmath20.bignumber('1124000727777607680000'))
  })

  it('should calculate the factorial of a boolean', function () {
    assert.strictEqual(factorial(true), 1)
    assert.strictEqual(factorial(false), 1)
  })

  it('should calculate the factorial of each element in a matrix', function () {
    assert.deepStrictEqual(factorial(math.matrix([0, 1, 2, 3, 4, 5])), math.matrix([1, 1, 2, 6, 24, 120]))
  })

  it('should calculate the factorial of each element in an array', function () {
    assert.deepStrictEqual(factorial([0, 1, 2, 3, 4, 5]), [1, 1, 2, 6, 24, 120])
  })

  it('should calculate the factorial of a non-integer', function () {
    approxEqual(factorial(1.5), 1.32934038817914)
    approxEqual(factorial(7.5), 14034.40729348)
  })

  it('should throw error if called with negative number', function () {
    assert.throws(function () { factorial(-1) }, /Value must be non-negative/)
    assert.throws(function () { factorial(-1.5) }, /Value must be non-negative/)

    assert.throws(function () { factorial(math.bignumber(-1)) }, /Value must be non-negative/)
    assert.throws(function () { factorial(math.bignumber(-1.5)) }, /Value must be non-negative/)
    assert.throws(function () { factorial(math.bignumber(-Infinity)) }, /Value must be non-negative/)
  })

  it('should throw an error if called with non-integer bignumber', function () {
    assert.throws(function () { factorial(math.bignumber(1.5)) })
  })

  it('should throw en error if called with invalid number of arguments', function () {
    assert.throws(function () { factorial() })
    assert.throws(function () { factorial(1, 3) })
  })

  it('should throw en error if called with invalid type of argument', function () {
    assert.throws(function () { factorial(new Date()) })
    assert.throws(function () { factorial('a string') })
  })

  it('should LaTeX factorial', function () {
    const expression = math.parse('factorial(6)')
    assert.strictEqual(expression.toTex(), '\\left(6\\right)!')
  })
})
