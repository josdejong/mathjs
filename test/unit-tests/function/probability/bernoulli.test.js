import assert from 'assert'
import { approxEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const bernoulli = math.bernoulli

const EPSILON = 1e-14
const BEPSILON = 1e-50

describe('bernoulli', function () {
  it('should calculate number values of the Bernoulli numbers', function () {
    assert.strictEqual(bernoulli(0), 1)
    assert.strictEqual(bernoulli(1), -1 / 2)
    assert.strictEqual(bernoulli(2), 1 / 6)
    assert.strictEqual(bernoulli(3), 0)
    approxEqual(bernoulli(4), -1 / 30, EPSILON)
    approxEqual(bernoulli(22), 854513 / 138, EPSILON)
  })

  it('should calculate BigNumber values of the Bernoulli numbers', function () {
    const big = math.bignumber
    assert.deepStrictEqual(bernoulli(big(1)), big(-1 / 2))
    assert.deepStrictEqual(bernoulli(big(5)), big(0))
    approxEqual(
      bernoulli(big(30)),
      math.divide(big('8615841276005'), big(14322)),
      BEPSILON
    )
  })

  it('should calculate Fraction values of the Bernoulli numbers', function () {
    const frac = math.fraction
    assert.deepStrictEqual(bernoulli(frac(1)), frac(-1, 2))
    assert.deepStrictEqual(bernoulli(frac(7)), frac(0))
    assert.deepStrictEqual(
      bernoulli(frac(50)), frac(495057205241079648212477525n, 66n))
    assert.deepStrictEqual(
      bernoulli(68n),
      frac(-78773130858718728141909149208474606244347001n, 30n))
  })

  it('should throw on illegal index values', function () {
    assert.throws(() => bernoulli(-3), RangeError)
    assert.throws(() => bernoulli(1.5), RangeError)
    assert.throws(() => bernoulli(math.bignumber(6.28)), RangeError)
    assert.throws(() => bernoulli(math.fraction(5, 3)), RangeError)
    assert.throws(() => bernoulli(-2n), RangeError)
  })
})
