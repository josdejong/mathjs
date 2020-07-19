import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { squareNumber } from '../../plain/number'

const name = 'square'
const dependencies = ['typed']

export const createSquare = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Compute the square of a value, `x * x`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.square(x)
   *
   * Examples:
   *
   *    math.square(2)           // returns number 4
   *    math.square(3)           // returns number 9
   *    math.pow(3, 2)           // returns number 9
   *    math.multiply(3, 3)      // returns number 9
   *
   *    math.square([1, 2, 3, 4])  // returns Array [1, 4, 9, 16]
   *
   * See also:
   *
   *    multiply, cube, sqrt, pow
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} x
   *            Number for which to calculate the square
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix | Unit}
   *            Squared value
   */
  return typed(name, {
    number: squareNumber,

    Complex: function (x) {
      return x.mul(x)
    },

    BigNumber: function (x) {
      return x.times(x)
    },

    Fraction: function (x) {
      return x.mul(x)
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since square(0) = 0
      return deepMap(x, this, true)
    },

    Unit: function (x) {
      return x.pow(2)
    }
  })
})
