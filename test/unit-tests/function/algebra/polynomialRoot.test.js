import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'

const complex = math.complex
const pRoot = math.polynomialRoot

describe('polynomialRoot', function () {
  it('should solve a linear equation with real or complex coefficients',
    function () {
      approxDeepEqual(pRoot(6, 3), [-2])
      approxDeepEqual(pRoot(complex(-3, 2), 2), [complex(1.5, -1)])
      approxDeepEqual(pRoot(complex(3, 1), complex(-1, -1)), [complex(2, -1)])
    })

  it('should solve a quadratic equation with a double root', function () {
    approxDeepEqual(pRoot(4, 4, 1), [-2])
    approxDeepEqual(pRoot(complex(0, 2), complex(2, 2), 1), [complex(-1, -1)])
  })

  it('should solve a quadratic with two distinct roots', function () {
    approxDeepEqual(pRoot(-3, 2, 1), [1, -3])
    approxDeepEqual(pRoot(-2, 0, 1), [math.sqrt(2), -math.sqrt(2)])
    approxDeepEqual(
      pRoot(4, 2, 1), [complex(-1, math.sqrt(3)), complex(-1, -math.sqrt(3))])
    approxDeepEqual(
      pRoot(complex(3, 1), -3, 1), [complex(2, -1), complex(1, 1)])
  })

  it('should solve a cubic with a triple root', function () {
    approxDeepEqual(pRoot(8, 12, 6, 1), [-2])
    approxDeepEqual(
      pRoot(complex(-2, 11), complex(9, -12), complex(-6, 3), 1),
      [complex(2, -1)])
  })

  it('should solve a cubic with one simple and one double root', function () {
    approxDeepEqual(pRoot(4, 0, -3, 1), [-1, 2])
    approxDeepEqual(
      pRoot(complex(9, 9), complex(15, 6), complex(7, 1), 1),
      [complex(-1, -1), -3])
    approxDeepEqual(
      pRoot(complex(0, 6), complex(6, 8), complex(5, 2), 1),
      [-3, complex(-1, -1)])
    approxDeepEqual(
      pRoot(complex(2, 6), complex(8, 6), complex(5, 1), 1),
      [complex(-3, 1), complex(-1, -1)])
  })

  it('should solve a cubic with three distinct roots', function () {
    approxDeepEqual(pRoot(6, 11, 6, 1), [-3, -1, -2])
    approxDeepEqual(
      pRoot(-1, -2, 0, 1), [-1, (1 + math.sqrt(5)) / 2, (1 - math.sqrt(5)) / 2])
    approxDeepEqual(pRoot(1, 1, 1, 1), [-1, complex(0, -1), complex(0, 1)])
    approxDeepEqual(
      pRoot(complex(0, -10), complex(8, 12), complex(-6, -3), 1),
      [complex(1, 1), complex(3, 1), complex(2, 1)])
  })
})
