import { factory } from '../../utils/factory.js'
import { isInteger } from '../../utils/number.js'
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
  'DenseMatrix'
]

export const createMod = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, round, matrix, equalScalar, zeros, DenseMatrix }) => {
  const floor = createFloor({ typed, config, round, matrix, equalScalar, zeros, DenseMatrix })
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo05xSfSf = createMatAlgo05xSfSf({ typed, equalScalar })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

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
   *    isOdd(2)                      // returns false...
   *    isOdd(3)                      // returns true
   *
   * See also:
   *
   *    divide
   *
   * History:
   *
   *    v15.3   Prefer bigint output if possible for mixed number/bigint input
   *    v13     Handle bigints
   *    v12.1   Support negative divisors for BigNumber and Fraction
   *    v11.6   Support matrix broadcasting
   *    v2      Handle Fractions
   *    v0.2    Created
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
        if (y.isZero()) {
          return x
        }
        if (x.isInteger() && y.isInteger()) {
          return _modBigNumberInteger(x, y)
        }
        return x.sub(y.mul(floor(x.div(y))))
      },

      'bigint, bigint': _modBigint,
      'number, bigint': function (n, b) {
        // prefer bigint when number is an integer
        if (isInteger(n)) return _modBigint(BigInt(n), b)
        return _modNumber(n, Number(b))
      },
      'bigint, number': function (b, n) {
        if (isInteger(n)) return _modBigint(b, BigInt(n))
        return _modNumber(Number(b), n)
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

    if (y === 0) {
      return x
    }

    // Integers have no round-off for the tolerant floor below to absorb, and
    // it would round a quotient like 1.999999999999 up to 2, giving a negative
    // remainder. JavaScript's % is exact for integers, so use it there.
    if (isInteger(x) && isInteger(y)) {
      const m = x % y
      if (m === 0) {
        return 0
      }
      return ((m < 0) === (y < 0)) ? m : m + y
    }

    // We use mathjs floor to handle errors associated with
    // precision float approximation
    return x - y * floor(x / y)
  }

  /**
   * Calculate the modulus of two integer BigNumbers exactly, with the sign of
   * the divisor
   * @param {BigNumber} x
   * @param {BigNumber} y
   * @returns {BigNumber} res
   * @private
   */
  function _modBigNumberInteger (x, y) {
    const m = x.mod(y)
    if (m.isZero()) {
      return m.abs()
    }
    return (m.isNegative() === y.isNegative()) ? m : m.add(y)
  }

  function _modBigint (x, y) {
    if (y === 0n) {
      return x
    }

    const m = x % y
    // Ensure result m is always in desired range: 0 ≤ m < y for y positive,
    // y < m ≤ 0 for y negative:
    return m !== 0n && (m < 0n) !== (y < 0n) ? m + y : m
  }
})
