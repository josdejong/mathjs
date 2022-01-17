import math from '../../../../src/defaultInstance.js'
import approx from '../../../../tools/approx.js'

const derivativeNum = math.derivativeNum

describe('derivativeNum', function () {
  it('should return the value of the derivative at a specific value', function () {
    approx.equal(derivativeNum('2*x', 2), 2)
    approx.equal(derivativeNum('x^2', 2), 4)
    approx.equal(derivativeNum('cos(x)', 0), 0)
  })
})
