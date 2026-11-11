import { factory } from '../../utils/factory.js'
import { DimensionError } from '../../error/DimensionError.js'

const name = 'multinomial'
const dependencies = ['typed', 'add', 'multiply', 'combinations', 'isInteger', 'isNegative', 'size']

export const createMultinomial = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, multiply, combinations, isInteger, isNegative, size }) => {
  function nonnegativeInteger (ai) {
    if (!isInteger(ai) || isNegative(ai)) {
      throw new TypeError(`Nonnegative integer value expected in function multinomial, but got ${ai}`)
    }
    return ai
  }

  /**
   * Computes the number of ways of dividing a1 + a2 + ... + an distinct items
   * into n groups of sizes a1, a2, ..., an, where the order of the items
   * within each group does not matter. These numbers are known as the
   * multinomial coefficients, (a1 + a2 + ... + an)! / (a1! a2! ... an!).
   *
   * multinomial takes a single one-dimensional array or Matrix, and throws an
   * error if any entry is negative or not an integer. A zero entry corresponds
   * to a group with no items, so it does not change the result.
   *
   * The multinomial coefficient equals the product of the binomial
   * coefficients combinations(a1 + ... + ai, ai) for i = 1, ..., n, which is
   * how it is computed here. The entries can be of any numeric type that
   * combinations() handles, written as Numeric below, and the result has the
   * type that combinations() returns for them.
   *
   * Syntax:
   *
   *     math.multinomial(a) // a is a one-dimensional array or matrix
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
   *    v15.3  Allow zero inputs; throw on input of more than one dimension
   *    v1.7   Created
   *
   * @param {Numeric[] | Matrix} a    Nonnegative integer sizes of the groups
   * @return {Numeric}                Multinomial coefficient
   */
  return typed(name, {
    'Array | Matrix': function (a) {
      const dimensions = size(a)
      if (dimensions.length !== 1) {
        throw new DimensionError(dimensions.length, 1)
      }

      // like combinations(0, 0), the empty product is 1
      if (dimensions[0] === 0) {
        return 1
      }
      const entries = a.valueOf()

      // (a1 + ... + an)! / (a1! ... an!) is the product of the binomial
      // coefficients combinations(a1 + ... + ai, ai). Unlike dividing two
      // factorials, every step of that product is an exact integer. The
      // product starts from combinations(a1, a1) rather than the number 1,
      // so it keeps the type of the entries.
      let sum = nonnegativeInteger(entries[0])
      let result = combinations(sum, sum)
      for (let i = 1; i < entries.length; i++) {
        const ai = nonnegativeInteger(entries[i])
        sum = add(sum, ai)
        result = multiply(result, combinations(sum, ai))
      }
      return result
    }
  })
})
