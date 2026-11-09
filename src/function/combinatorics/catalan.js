import { factory } from '../../utils/factory.js'

const name = 'catalan'
const dependencies = [
  'typed',
  'addScalar',
  'divideScalar',
  'multiplyScalar',
  'combinations',
  'isNegative',
  'isInteger'
]

export const createCatalan = /* #__PURE__ */ factory(name, dependencies, (
  {
    typed,
    addScalar,
    divideScalar,
    multiplyScalar,
    combinations,
    isNegative,
    isInteger
  }
) => {
  /**
   * The Catalan Numbers enumerate combinatorial structures of many different types.
   * catalan only takes integer arguments.
   * The following condition must be enforced: n >= 0
   *
   * Syntax:
   *
   *   math.catalan(n)
   *
   * Examples:
   *
   *    math.catalan(3) // returns 5
   *    math.catalan(8) // returns 1430
   *
   * History:
   *
   *    v15.3   Compute the number path exactly with BigInt so results are exact
   *            whenever they are representable as a number
   *    v0.14   Created
   *
   * See also:
   *
   *    bellNumbers
   *
   * @param {Number | BigNumber} n    nth Catalan number
   * @return {Number | BigNumber}     Cn(n)
   */
  return typed(name, {
    'number': function (n) {
      if (!isInteger(n) || isNegative(n)) {
        throw new TypeError('Non-negative integer value expected in function catalan')
      }

      // Compute the recurrence C(0) = 1, C(i+1) = C(i) * 2 * (2i + 1) / (i + 2)
      // in exact integer arithmetic. Every step divides exactly, so the result
      // is exact whenever it fits in a double, instead of inheriting the
      // rounding of the intermediate binomial coefficient C(2n, n).
      let c = 1n
      for (let i = 0n; i < BigInt(n); i++) {
        c = c * 2n * (2n * i + 1n) / (i + 2n)
      }
      return Number(c)
    },

    'BigNumber': function (n) {
      if (!isInteger(n) || isNegative(n)) {
        throw new TypeError('Non-negative integer value expected in function catalan')
      }

      return divideScalar(combinations(multiplyScalar(n, 2), n), addScalar(n, 1))
    }
  })
})
