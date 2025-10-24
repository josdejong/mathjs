import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const isFinite = math.isFinite

describe('isFinite', function () {
  it('should check scalars for finiteness', function () {
    assert(isFinite(0))
    assert(isFinite(math.bignumber('0')))
    assert(isFinite(math.fraction(0)))
    assert(isFinite(math.evaluate('0 + 0i')))
    assert(isFinite(0n))
    assert(isFinite(math.unit('0 kB')))

    assert.strictEqual(isFinite(null), false)
    assert.strictEqual(isFinite(undefined), false)
    assert.strictEqual(isFinite(Infinity), false)
    assert.strictEqual(isFinite(math.bignumber(NaN)), false)
    assert.strictEqual(isFinite(math.unit(-Infinity, 'm')), false)
    assert.strictEqual(isFinite('Infinity'), false)
  })

  it('should test finiteness of an Array/Matrix elementwise', function () {
    assert.deepStrictEqual(
      isFinite([1n, 1, math.complex(1, 1)]), [true, true, true])
    assert.deepStrictEqual(
      isFinite(math.identity(3)),
      math.matrix(
        [[true, true, true], [true, true, true], [true, true, true]]))

    assert.deepStrictEqual(
      isFinite([0, 0, NaN, 0]), [true, true, false, true])
    const I = math.identity(2)
    I.set([1, 1], Infinity)
    assert.deepStrictEqual(
      isFinite(I), math.matrix([[true, true], [true, false]]))
  })
})
