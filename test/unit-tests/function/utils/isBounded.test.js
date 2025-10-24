import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const isBounded = math.isBounded

describe('isBounded', function () {
  it('should check scalars for boundednesss', function () {
    assert(isBounded(0))
    assert(isBounded(math.bignumber('0')))
    assert(isBounded(math.fraction(0)))
    assert(isBounded(math.evaluate('0 + 0i')))
    assert(isBounded(0n))
    assert(isBounded(math.unit('0 kB')))

    assert.strictEqual(isBounded(null), false)
    assert.strictEqual(isBounded(undefined), false)
    assert.strictEqual(isBounded(Infinity), false)
    assert.strictEqual(isBounded(math.bignumber(NaN)), false)
    assert.strictEqual(isBounded(math.unit(-Infinity, 'm')), false)
    assert.strictEqual(isBounded('Infinity'), false)
  })

  it('should check every element of an Array/Matrix is bounded', function () {
    assert(isBounded([1n, 1, math.complex(1, 1)]))
    assert(isBounded(math.identity(3)))

    assert.strictEqual(isBounded([0, 0, NaN, 0]), false)
    const I = math.identity(4)
    I.set([2, 2], Infinity)
    assert.strictEqual(isBounded(I), false)
  })
})
