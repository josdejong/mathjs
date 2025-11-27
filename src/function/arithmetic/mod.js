import { factory } from '../../utils/factory.js'
import { createFloor } from './floor.js'
import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo05xSfSf } from '../../type/matrix/utils/matAlgo05xSfSf.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'mod'
const dependencies = [
  'typed',
  'config',
  'round',
  'matrix',
  'equalScalar',
  'zeros',
  'DenseMatrix',
  'concat',
  'Complex'
]

export const createMod = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, round, matrix, equalScalar, zeros, DenseMatrix, concat, Complex }) => {
  const floor = createFloor({ typed, config, round, matrix, equalScalar, zeros, DenseMatrix })
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo05xSfSf = createMatAlgo05xSfSf({ typed, equalScalar })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix, concat })

  /**
   * Calculates the modulus, the remainder of an integer division.
   *
   * For matrices, the function is evaluated element wise.
   *
   * The modulus is defined as:
   *
   *     x - y * floor(x / y)
   *
   * For complex numbers, the function implements Gaussian integer division.
   * Given complex numbers w and z, it finds the Gaussian integer q (complex number
   * with integer real and imaginary parts) such that the norm of (w - z*q) is minimized.
   *
   * See https://en.wikipedia.org/wiki/Modulo_operation.
   *
   * Syntax:
   *
   *    math.mod(x, y)
   *
   * Examples:
   *
   *    math.mod(8, 3)                // returns 2
   *    math.mod(11, 2)               // returns 1
   *    math.mod(math.complex(5, 3), math.complex(2, 1))  // returns complex remainder
   *
   *    function isOdd(x) {
   *      return math.mod(x, 2) != 0
   *    }
   *
   *    isOdd(2)                      // returns false
   *    isOdd(3)                      // returns true
   *
   * See also:
   *
   *    divide
   *
   * @param  {number | BigNumber | bigint | Fraction | Complex | Array | Matrix} x Dividend
   * @param  {number | BigNumber | bigint | Fraction | Complex | Array | Matrix} y Divisor
   * @return {number | BigNumber | bigint | Fraction | Complex | Array | Matrix} Returns the remainder of `x` divided by `y`.
   */
  return typed(
    name,
    {
      'number, number': _modNumber,

      'Complex, Complex': function (x, y) {
        return _modComplex(x, y)
      },

      'BigNumber, BigNumber': function (x, y) {
        return y.isZero() ? x : x.sub(y.mul(floor(x.div(y))))
      },

      'bigint, bigint': function (x, y) {
        if (y === 0n) {
          return x
        }

        if (x < 0) {
          const m = x % y
          return m === 0n ? m : m + y
        }

        return x % y
      },

      'Fraction, Fraction': function (x, y) {
        return y.equals(0) ? x : x.sub(y.mul(floor(x.div(y))))
      }
    },
    matrixAlgorithmSuite({
      SS: matAlgo05xSfSf,
      DS: matAlgo03xDSf,
      SD: matAlgo02xDS0,
      Ss: matAlgo11xS0s,
      sS: matAlgo12xSfs
    })
  )

  /**
 * Calculate the modulus of two numbers
 * @param {number} x
 * @param {number} y
 * @returns {number} res
 * @private
 */
  function _modNumber (x, y) {
    // We don't use JavaScript's % operator here as this doesn't work
    // correctly for x < 0 and x === 0
    // see https://en.wikipedia.org/wiki/Modulo_operation

    // We use mathjs floor to handle errors associated with
    // precision float approximation
    return (y === 0) ? x : x - y * floor(x / y)
  }

  /**
   * Calculate the modulus of two complex numbers using Gaussian integer division
   * @param {Complex} x dividend
   * @param {Complex} y divisor
   * @returns {Complex} remainder
   * @private
   */
  function _modComplex (x, y) {
    // Handle division by zero
    if (y.re === 0 && y.im === 0) {
      return x
    }

    // Calculate the exact quotient x/y
    const quotient = x.div(y)

    // Round to the nearest Gaussian integer
    const roundedQuotient = _roundToNearestGaussianInteger(quotient)

    // Calculate remainder: r = x - y * q
    const remainder = x.sub(y.mul(roundedQuotient))

    return remainder
  }

  /**
   * Round a complex number to the nearest Gaussian integer (complex number with integer real and imaginary parts)
   * If there are ties, choose the one that results in the quotient with smallest norm
   * @param {Complex} z complex number to round
   * @returns {Complex} nearest Gaussian integer
   * @private
   */
  function _roundToNearestGaussianInteger (z) {
    const re = z.re
    const im = z.im

    // Get the four candidate Gaussian integers (floor and ceil for both parts)
    const floorRe = Math.floor(re)
    const ceilRe = Math.ceil(re)
    const floorIm = Math.floor(im)
    const ceilIm = Math.ceil(im)

    const candidates = [
      new Complex(floorRe, floorIm),
      new Complex(floorRe, ceilIm),
      new Complex(ceilRe, floorIm),
      new Complex(ceilRe, ceilIm)
    ]

    // Find the candidate with minimum distance to z
    let bestCandidate = candidates[0]
    let minDistance = _complexDistanceSquared(z, candidates[0])

    for (let i = 1; i < candidates.length; i++) {
      const distance = _complexDistanceSquared(z, candidates[i])
      if (distance < minDistance ||
          (distance === minDistance && _complexNormSquared(candidates[i]) < _complexNormSquared(bestCandidate))) {
        minDistance = distance
        bestCandidate = candidates[i]
      }
    }

    return bestCandidate
  }

  /**
   * Calculate the squared distance between two complex numbers
   * @param {Complex} a first complex number
   * @param {Complex} b second complex number
   * @returns {number} squared distance
   * @private
   */
  function _complexDistanceSquared (a, b) {
    const deltaRe = a.re - b.re
    const deltaIm = a.im - b.im
    return deltaRe * deltaRe + deltaIm * deltaIm
  }

  /**
   * Calculate the squared norm (modulus squared) of a complex number
   * @param {Complex} z complex number
   * @returns {number} squared norm
   * @private
   */
  function _complexNormSquared (z) {
    return z.re * z.re + z.im * z.im
  }
})
