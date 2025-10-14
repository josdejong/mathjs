import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const finite = math.finite

describe('finite', function () {
  it('should check scalars for finiteness', function () {
    assert(finite(0))
    assert(finite(math.bignumber('0')))
    assert(finite(math.fraction(0)))
    assert(finite(math.evaluate('0 + 0i')))
    assert(finite(0n))
    assert(finite(math.unit('0 kB')))

    assert.strictEqual(finite(null), false)
    assert.strictEqual(finite(undefined), false)
    assert.strictEqual(finite(Infinity), false)
    assert.strictEqual(finite(math.bignumber(NaN)), false)
    assert.strictEqual(finite(math.unit(-Infinity, 'm')), false)
    assert.strictEqual(finite('Infinity'), false)
  })

  it('should check every element of an Array/Matrix is finite', function () {
    assert(finite([1n, 1, math.complex(1, 1)]))
    assert(finite(math.identity(3)))

    assert.strictEqual(finite([0, 0, NaN, 0]), false)
    const I = math.identity(4)
    I.set([2, 2], Infinity)
    assert.strictEqual(finite(I), false)
  })
})
