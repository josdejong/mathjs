import { isInteger } from '../../utils/number'
import { product } from '../../utils/product'
import { factory } from '../../utils/factory'

const name = 'permutations'
const dependencies = ['typed', 'factorial']

export const createPermutations = /* #__PURE__ */ factory(name, dependencies, ({ typed, factorial }) => {
  /**
   * Compute the number of ways of obtaining an ordered subset of `k` elements
   * from a set of `n` elements.
   *
   * Permutations only takes integer arguments.
   * The following condition must be enforced: k <= n.
   *
   * Syntax:
   *
   *     math.permutations(n)
   *     math.permutations(n, k)
   *
   * Examples:
   *
   *    math.permutations(5)     // 120
   *    math.permutations(5, 3)  // 60
   *
   * See also:
   *
   *    combinations, factorial
   *
   * @param {number | BigNumber} n   The number of objects in total
   * @param {number | BigNumber} [k] The number of objects in the subset
   * @return {number | BigNumber}    The number of permutations
   */
  return typed(name, {
    'number | BigNumber': factorial,
    'number, number': function (n, k) {
      if (!isInteger(n) || n < 0) {
        throw new TypeError('Positive integer value expected in function permutations')
      }
      if (!isInteger(k) || k < 0) {
        throw new TypeError('Positive integer value expected in function permutations')
      }
      if (k > n) {
        throw new TypeError('second argument k must be less than or equal to first argument n')
      }
      // Permute n objects, k at a time
      return product((n - k) + 1, n)
    },

    'BigNumber, BigNumber': function (n, k) {
      let result, i

      if (!isPositiveInteger(n) || !isPositiveInteger(k)) {
        throw new TypeError('Positive integer value expected in function permutations')
      }
      if (k.gt(n)) {
        throw new TypeError('second argument k must be less than or equal to first argument n')
      }

      const one = n.mul(0).add(1)
      result = one
      for (i = n.minus(k).plus(1); i.lte(n); i = i.plus(1)) {
        result = result.times(i)
      }

      return result
    }

    // TODO: implement support for collection in permutations
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
