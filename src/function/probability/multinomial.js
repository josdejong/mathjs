import { deepForEach } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'

const name = 'multinomial'
const dependencies = ['typed', 'add', 'multiply', 'combinations', 'isInteger', 'isPositive']

export const createMultinomial = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, multiply, combinations, isInteger, isPositive }) => {
  /**
   * Multinomial Coefficients compute the number of ways of picking a1, a2, ..., ai unordered outcomes from `n` possibilities.
   *
   * multinomial takes one array of integers as an argument.
   * The following condition must be enforced: every ai <= 0
   *
   * Syntax:
   *
   *     math.multinomial(a) // a is an array type
   *
   * Examples:
   *
   *    math.multinomial([1,2,1]) // returns 12
   *
   * See also:
   *
   *    combinations, factorial
   *
   * @param {number[] | BigNumber[]} a    Integer numbers of objects in the subset
   * @return {Number | BigNumber}         Multinomial coefficient.
   */
  return typed(name, {
    'Array | Matrix': function (a) {
      let sum = 0
      let result = 1

      // (a1 + ... + an)! / (a1! ... an!) is the product of the binomial
      // coefficients combinations(a1 + ... + ai, ai). Unlike dividing two
      // factorials, every step of that product is an exact integer.
      deepForEach(a, function (ai) {
        if (!isInteger(ai) || !isPositive(ai)) {
          throw new TypeError('Positive integer value expected in function multinomial')
        }
        sum = add(sum, ai)
        result = multiply(result, combinations(sum, ai))
      })

      return result
    }
  })
})
