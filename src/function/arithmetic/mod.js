import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual.js'
import { nearlyEqual } from '../../utils/number.js'
import { factory } from '../../utils/factory.js'
import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo05xSfSf } from '../../type/matrix/utils/matAlgo05xSfSf.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
// import { modNumber } from '../../plain/number/index.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'mod'
const dependencies = [
  'typed',
  'config',
  'round',
  'matrix',
  'equalScalar',
  'DenseMatrix',
  'concat'
]

export const createMod = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, round, matrix, equalScalar, DenseMatrix, concat }) => {
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
   * @param  {number | BigNumber | Fraction | Array | Matrix} x Dividend
   * @param  {number | BigNumber | Fraction | Array | Matrix} y Divisor
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the remainder of `x` divided by `y`.
   */
  return typed(
    name,
    {
      'number, number': _modNumber,

      'BigNumber, BigNumber': function (x, y) {
        if (y.isNeg()) {
          throw new Error('Cannot calculate mod for a negative divisor')
        } else if (y.isZero()) {
          return x
        }
        const div = x.div(y)
        if (bigNearlyEqual(div, round(div), config.epsilon)) {
          const result = x.sub(y.mul(round(div)))
          return bigNearlyEqual(result, round(result), config.epsilon)
            ? round(result)
            : result
        } else {
          return x.sub(y.mul(div.floor()))
        }
      },

      'Fraction, Fraction': function (x, y) {
        if (y.compare(0) < 0) {
          throw new Error('Cannot calculate mod for a negative divisor')
        }
        // Workaround suggested in Fraction.js library to calculate correct modulo for negative dividend
        return x.compare(0) >= 0 ? x.mod(y) : x.mod(y).add(y).mod(y)
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
    if (y > 0) {
      // We don't use JavaScript's % operator here as this doesn't work
      // correctly for x < 0 and x === 0
      // see https://en.wikipedia.org/wiki/Modulo_operation

      // To ensure precision with float approximation
      // fails for y > 1e24
      const div = x / y
      if (nearlyEqual(div, round(div), config.epsilon)) {
        const result = x - y * round(div)
        return nearlyEqual(result, round(Math.abs(result)), config.epsilon)
          ? round(Math.abs(result))
          : result
      } else { // then Math.floor is precise
        return x - y * Math.floor(x / y)
      }
    } else if (y === 0) {
      return x
    } else { // y < 0
      // TODO: implement mod for a negative divisor
      throw new Error('Cannot calculate mod for a negative divisor')
    }
  }
})
