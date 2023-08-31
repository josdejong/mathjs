import { isInteger } from '../../utils/number.js'
import { factory } from '../../utils/factory.js'
import { createMod } from './mod.js'
import { createMatAlgo01xDSid } from '../../type/matrix/utils/matAlgo01xDSid.js'
import { createMatAlgo04xSidSid } from '../../type/matrix/utils/matAlgo04xSidSid.js'
import { createMatAlgo10xSids } from '../../type/matrix/utils/matAlgo10xSids.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { ArgumentsError } from '../../error/ArgumentsError.js'

const name = 'gcd'
const dependencies = [
  'typed',
  'config',
  'round',
  'matrix',
  'equalScalar',
  'zeros',
  'BigNumber',
  'DenseMatrix',
  'concat'
]

const gcdTypes = 'number | BigNumber | Fraction | Matrix | Array'
const gcdManyTypesSignature = `${gcdTypes}, ${gcdTypes}, ...${gcdTypes}`

function is1d (array) {
  return !array.some(element => Array.isArray(element))
}

export const createGcd = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, config, round, equalScalar, zeros, BigNumber, DenseMatrix, concat }) => {
  const mod = createMod({ typed, config, round, matrix, equalScalar, zeros, DenseMatrix, concat })
  const matAlgo01xDSid = createMatAlgo01xDSid({ typed })
  const matAlgo04xSidSid = createMatAlgo04xSidSid({ typed, equalScalar })
  const matAlgo10xSids = createMatAlgo10xSids({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix, concat })

  /**
   * Calculate the greatest common divisor for two or more values or arrays.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.gcd(a, b)
   *    math.gcd(a, b, c, ...)
   *
   * Examples:
   *
   *    math.gcd(8, 12)              // returns 4
   *    math.gcd(-4, 6)              // returns 2
   *    math.gcd(25, 15, -10)        // returns 5
   *
   *    math.gcd([8, -4], [12, 6])   // returns [4, 2]
   *
   * See also:
   *
   *    lcm, xgcd
   *
   * @param {... number | BigNumber | Fraction | Array | Matrix} args  Two or more integer numbers
   * @return {number | BigNumber | Fraction | Array | Matrix}                           The greatest common divisor
   */
  return typed(
    name,
    {
      'number, number': _gcdNumber,
      'BigNumber, BigNumber': _gcdBigNumber,
      'Fraction, Fraction': (x, y) => x.gcd(y)
    },
    matrixAlgorithmSuite({
      SS: matAlgo04xSidSid,
      DS: matAlgo01xDSid,
      Ss: matAlgo10xSids
    }),
    {
      [gcdManyTypesSignature]: typed.referToSelf(self => (a, b, args) => {
        let res = self(a, b)
        for (let i = 0; i < args.length; i++) {
          res = self(res, args[i])
        }
        return res
      }),
      Array: typed.referToSelf(self => (array) => {
        if (array.length === 1 && Array.isArray(array[0]) && is1d(array[0])) {
          return self(...array[0])
        }
        if (is1d(array)) {
          return self(...array)
        }
        throw new ArgumentsError('gcd() supports only 1d matrices!')
      }),
      Matrix: typed.referToSelf(self => (matrix) => {
        return self(matrix.toArray())
      })
    }
  )

  /**
 * Calculate gcd for numbers
 * @param {number} a
 * @param {number} b
 * @returns {number} Returns the greatest common denominator of a and b
 * @private
 */
  function _gcdNumber (a, b) {
    if (!isInteger(a) || !isInteger(b)) {
      throw new Error('Parameters in function gcd must be integer numbers')
    }

    // https://en.wikipedia.org/wiki/Euclidean_algorithm
    let r
    while (b !== 0) {
      r = mod(a, b)
      a = b
      b = r
    }
    return (a < 0) ? -a : a
  }

  /**
   * Calculate gcd for BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns greatest common denominator of a and b
   * @private
   */
  function _gcdBigNumber (a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function gcd must be integer numbers')
    }

    // https://en.wikipedia.org/wiki/Euclidean_algorithm
    const zero = new BigNumber(0)
    while (!b.isZero()) {
      const r = mod(a, b)
      a = b
      b = r
    }
    return a.lt(zero) ? a.neg() : a
  }
})
