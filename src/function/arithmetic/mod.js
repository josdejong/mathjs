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
  'concat'
]

export const createMod = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, round, matrix, equalScalar, zeros, DenseMatrix, concat }) => {
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
   * @param  {number | BigNumber | bigint | Fraction | Array | Matrix} x Dividend
   * @param  {number | BigNumber | bigint | Fraction | Array | Matrix} y Divisor
   * @return {number | BigNumber | bigint | Fraction | Array | Matrix} Returns the remainder of `x` divided by `y`.
   */
  return typed(
    name,
    {
      'number, number': _modNumber,

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
})
