/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'

const digamma = math.digamma

describe.only('digamma', function () {
  it('should calculate the digamma of a real number', function () {
    approx.deepEqual(digamma(5), 1.5061176684318004727)
    approx.deepEqual(digamma(1), -0.5772156649015328606)
  })
})