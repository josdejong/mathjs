import { factory } from '../../utils/factory.js'
import { isInteger } from '../../utils/number.js'

const name = 'combinationsWithRep'
const dependencies = ['typed']

export const createCombinationsWithRep = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Compute the number of ways of picking `k` unordered outcomes from `n`
   * possibilities, allowing individual outcomes to be repeated more than once.
   *
   * CombinationsWithRep only takes integer arguments.
   * The following condition must be enforced: k <= n + k -1.
   *
   * Syntax:
   *
   *     math.combinationsWithRep(n, k)
   *
   * Examples:
   *
   *    math.combinationsWithRep(7, 5) // returns 462
   *
   * History:
   *
   *    v15.3   Compute the number path exactly with BigInt so results are exact
   *            whenever they are representable as a number
   *
   * See also:
   *
   *    combinations, permutations, factorial
   *
   * @param {number | BigNumber} n    Total number of objects in the set
   * @param {number | BigNumber} k    Number of objects in the subset
   * @return {number | BigNumber}     Number of possible combinations with replacement.
   */
  return typed(name, {
    'number, number': function (n, k) {
      if (!isInteger(n) || n < 0) {
        throw new TypeError('Positive integer value expected in function combinationsWithRep')
      }
      if (!isInteger(k) || k < 0) {
        throw new TypeError('Positive integer value expected in function combinationsWithRep')
      }
      if (n < 1) {
        throw new TypeError('k must be less than or equal to n + k - 1')
      }

      // combinationsWithRep(n, k) == combinations(n + k - 1, k).
      // Compute the binomial coefficient in exact integer arithmetic so the
      // result is exact whenever it fits in a double, instead of dividing two
      // large floating point products (e.g. combinationsWithRep(33, 12) used
      // to return 21090682613.000004 instead of 21090682613).
      const N = BigInt(n + k - 1)
      const K = BigInt(k)
      const kk = K < N - K ? K : N - K // C(N, K) == C(N, N - K)
      let result = 1n
      for (let i = 1n; i <= kk; i++) {
        result = result * (N - kk + i) / i
      }
      return Number(result)
    },

    'BigNumber, BigNumber': function (n, k) {
      const BigNumber = n.constructor
      let result, i
      const one = new BigNumber(1)
      const nMinusOne = n.minus(one)

      if (!isPositiveInteger(n) || !isPositiveInteger(k)) {
        throw new TypeError('Positive integer value expected in function combinationsWithRep')
      }
      if (n.lt(one)) {
        throw new TypeError('k must be less than or equal to n + k - 1 in function combinationsWithRep')
      }

      result = one
      if (k.lt(nMinusOne)) {
        for (i = one; i.lte(nMinusOne); i = i.plus(one)) {
          result = result.times(k.plus(i)).dividedBy(i)
        }
      } else {
        for (i = one; i.lte(k); i = i.plus(one)) {
          result = result.times(nMinusOne.plus(i)).dividedBy(i)
        }
      }

      return result
    }
  })
})

/**
 * Test whether BigNumber n is a positive integer
 * @param {BigNumber} n
 * @returns {boolean} isPositiveInteger
 */
function isPositiveInteger (n) {
  return n.isInteger() && n.gte(0)
}
