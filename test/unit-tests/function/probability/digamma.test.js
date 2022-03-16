/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'

const digamma = math.digamma

describe('digamma', function () {
  it('should calculate the digamma of a real number', function () {
    approx.deepEqual(digamma(5), 1.5061176684318004727)
    approx.deepEqual(digamma(1), -0.5772156649015328606)
    approx.deepEqual(digamma(2), 0.42278433509846713)
    approx.deepEqual(digamma(3), 0.9227843350984671)
  })
  it('should calculate the gamma of a complex number', function() {
    approx.deepEqual(digamma(math.i), math.complex(0.09465032062247697727,
      2.0766740474685811))
    approx.deepEqual(digamma(math.complex(0.5, 0.5)), math.complex(-0.8681073626454773139, 1.4406595199775145926589))
  })

  it('should calculate the gamma of each element in a matrix', function () {
    assert.deepEqual(digamma(math.matrix([1, 2, 3])), math.matrix([-0.57721566490153286, 0.42278433509846713, 0.9227843350984671]))
  })

  it('should calculate the gamma of each element in an array', function () {
    assert.deepEqual(digamma([1, 2, 3]), [-0.57721566490153286, 0.42278433509846713, 0.9227843350984671])
  })

  it('should throw en error if called with invalid number of arguments', function () {
    assert.throws(function () { digamma() })
    assert.throws(function () { digamma(1, 3) })
  })

  it('should throw en error if called with invalid type of argument', function () {
    assert.throws(function () { digamma(new Date()) })
    assert.throws(function () { digamma('a string') })
  })

  it('should LaTeX digamma', function () {
    const expression = math.parse('digamma(2.5)')
    assert.strictEqual(expression.toTex(), '\\Digamma\\left(2.5\\right)')
  })
})