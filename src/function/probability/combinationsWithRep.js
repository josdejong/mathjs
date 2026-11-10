import { factory } from '../../utils/factory.js'

const name = 'combinationsWithRep'
const dependencies = ['typed', 'combinations']

export const createCombinationsWithRep = /* #__PURE__ */ factory(name, dependencies, ({ typed, combinations }) => {
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
   *    v15.3   Forward the call to combinations(n + k - 1, k), preserving
   *            the types of the arguments
   *
   * See also:
   *
   *    combinations, permutations, factorial
   *
   * @param {number | BigNumber | bigint} n    Total number of objects in the set
   * @param {number | BigNumber | bigint} k    Number of objects in the subset
   * @return {number | BigNumber | bigint}     Number of possible combinations with replacement.
   */
  return typed(name, {
    // combinationsWithRep(n, k) == combinations(n + k - 1, k), so the entire
    // function just forwards to combinations, preserving the types of the
    // arguments: whatever combinations returns for those types is the correct
    // result type for combinationsWithRep. Bigint arguments are forwarded as
    // bigints as well and will work as soon as combinations() supports them.
    'number, number': function (n, k) {
      return combinations(n + k - 1, k)
    },

    'BigNumber, BigNumber': function (n, k) {
      return combinations(n.plus(k).minus(1), k)
    },

    'bigint, bigint': function (n, k) {
      return combinations(n + k - 1n, k)
    }
  })
})
