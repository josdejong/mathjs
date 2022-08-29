import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
import Fraction from 'fraction.js'

describe('fraction', function () {
  it('should create a fraction', function () {
    equalFraction(math.fraction(1, 3), new Fraction(1, 3))
    equalFraction(math.fraction(0.3), new Fraction(0.3))
    equalFraction(math.fraction('1/3'), new Fraction(1, 3))
    equalFraction(math.fraction({ n: 1, d: 3 }), new Fraction(1, 3))
    equalFraction(math.fraction(null), new Fraction(0))
  })

  it('should fail to create a fraction in case of non-integer quotient', function () {
    assert.throws(() => math.fraction(4, 5.1), /Parameters must be integer/)
    assert.throws(() => math.fraction(62.8, 10), /Parameters must be integer/)
    assert.throws(() => math.fraction(Infinity, 3), /Parameters must be integer/)
  })

  it('should create a fraction from a quotient regardless of integrality', function () {
    equalFraction(math.divide(math.fraction(4), math.fraction(5.1)),
      math.fraction(40, 51))
  })

  it('should create a fraction from a BigNumber', function () {
    const b = math.bignumber(2).div(3)
    const f = math.fraction(b)
    equalFraction(f, new Fraction('0.6666666666666666666666666666666666666666666666666666666666666667'))
  })

  it('should clone a fraction', function () {
    const a = math.fraction(1, 3)
    const b = math.fraction(a)
    assert.strictEqual(a, b) // b === a as fractions are supposed to be immutable
  })

  it('should create a fraction for all elements in an array', function () {
    const arr = math.fraction([0.2, 0.25, 0.125])
    assert(Array.isArray(arr))
    assert.strictEqual(arr.length, 3)

    equalFraction(arr[0], new Fraction(1, 5))
    equalFraction(arr[1], new Fraction(1, 4))
    equalFraction(arr[2], new Fraction(1, 8))
  })

  it('should create a fraction for all elements in a Matrix', function () {
    const mat = math.fraction(math.matrix([0.2, 0.25, 0.125]))
    assert.strictEqual(math.isMatrix(mat), true)

    const arr = mat.toArray()
    equalFraction(arr[0], new Fraction(1, 5))
    equalFraction(arr[1], new Fraction(1, 4))
    equalFraction(arr[2], new Fraction(1, 8))
  })

  it('should throw an error in case of NaN or Infinity', function () {
    assert.throws(function () { math.fraction(Infinity) }, /Error: Infinity cannot be represented as a fraction/)
    assert.throws(function () { math.fraction(-Infinity) }, /Error: -Infinity cannot be represented as a fraction/)
    assert.throws(function () { math.fraction(NaN) }, /Error: NaN cannot be represented as a fraction/)
  })
})

function equalFraction (a, b) {
  const msg = a.toString() + ' !== ' + b.toString()
  assert.strictEqual(a.s, b.s, msg)
  assert.strictEqual(a.n, b.n, msg)
  assert.strictEqual(a.d, b.d, msg)
}
