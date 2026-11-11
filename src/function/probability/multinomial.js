import { deepForEach } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'

const name = 'multinomial'
const dependencies = ['typed', 'add', 'multiply', 'combinations', 'isInteger', 'isNegative']

export const createMultinomial = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, multiply, combinations, isInteger, isNegative }) => {
  /**
   * Computes the number of ways of dividing a1 + a2 + ... + am distinct items
   * into m groups of sizes a1, a2, ..., am, where the order of the items
   * within each group does not matter. These numbers are known as the
   * multinomial coefficients, (a1 + a2 + ... + am)! / (a1! a2! ... am!).
   *
   * multinomial takes a single array of nonnegative integers, and throws a
   * TypeError if any entry is negative or not an integer. An entry of zero is
   * a group with no items, so it does not change the result.
   *
   * The multinomial coefficient equals the product of the binomial
   * coefficients combinations(a1 + ... + ai, ai) for i = 1, ..., m, which is
   * how it is computed here. The entries can be of any numeric type that
   * combinations() handles, written as Numeric below, and the result has the
   * type that combinations() returns for them.
   *
   * Syntax:
   *
   *     math.multinomial(a) // a is an array or matrix
   *
   * Examples:
   *
   *    math.multinomial([1, 2, 1]) // returns 12
   *    math.multinomial([2, 0, 1]) // returns 3
   *
   * See also:
   *
   *    combinations, factorial
   *
   * History:
   *
   *    v15.3  Allow zero inputs
   *    v1.7   Created
   *
   * @param {Numeric[] | Matrix} a    Nonnegative integer sizes of the groups
   * @return {Numeric}                Multinomial coefficient
   */
  return typed(name, {
    'Array | Matrix': function (a) {
      let sum = 0
      let result = 1

      // (a1 + ... + am)! / (a1! ... am!) is the product of the binomial
      // coefficients combinations(a1 + ... + ai, ai). Unlike dividing two
      // factorials, every step of that product is an exact integer.
      deepForEach(a, function (ai) {
        if (!isInteger(ai) || isNegative(ai)) {
          throw new TypeError(`Nonnegative integer value expected in function multinomial, but got ${ai}`)
        }
        sum = add(sum, ai)
        result = multiply(result, combinations(sum, ai))
      })

      return result
    }
  })
})
