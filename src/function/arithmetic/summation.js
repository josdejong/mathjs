import { isInteger } from '../../utils/number.js'
import { factory } from '../../utils/factory.js'

const name = 'summation'
const dependencies = ['typed', 'numeric']

export const createSummation = /* #__PURE__ */ factory(name, dependencies, ({ typed, numeric }) => {
  /**
    * Takes two integer values start, and end, and a functrion.
    * Calculates the summation of the function over the start to end range.
    *
    * Syntax:
    *
    *   math.summation(start, end, func))
    *
    * Examples:
    *
    *   // Summation of squares from 1 to 5: 1^2 + 2^2 + 3^2 + 4^2 + 5^2
    *   math.sum(1, 5, x => x ** 2)       // returns 55
    *
    * This function does not support collections (Array or Matrix).
    *
    * @param  {number} start                                       Start
    * @param  {number} end                                         Denominator
    * @param  {function} func                                      f(n)
    * @return {number | BigNumber | Fraction}                      Sum of f(n) for n from [start, end]
    */
  return typed(name, {
    'number, number, function': function (start, end, func) {
      if (!isInteger(start) || !isInteger(end)) {
        throw new Error('For summations, start and end must be integers')
      }
      if (start > end) {
        throw new Error('For summations, start must be greater than, or equal to end')
      }

      let sum = 0
      for (let i = start; i <= end; i++) {
        sum += func(i)
      }

      return sum
    }
  })
})
