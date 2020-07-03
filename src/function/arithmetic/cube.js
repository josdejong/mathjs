import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { cubeNumber } from '../../plain/number'

const name = 'cube'
const dependencies = ['typed']

export const createCube = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Compute the cube of a value, `x * x * x`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cube(x)
   *
   * Examples:
   *
   *    math.cube(2)            // returns number 8
   *    math.pow(2, 3)          // returns number 8
   *    math.cube(4)            // returns number 64
   *    4 * 4 * 4               // returns number 64
   *
   *    math.cube([1, 2, 3, 4]) // returns Array [1, 8, 27, 64]
   *
   * See also:
   *
   *    multiply, square, pow, cbrt
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} x  Number for which to calculate the cube
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} Cube of x
   */
  return typed(name, {
    number: cubeNumber,

    Complex: function (x) {
      return x.mul(x).mul(x) // Is faster than pow(x, 3)
    },

    BigNumber: function (x) {
      return x.times(x).times(x)
    },

    Fraction: function (x) {
      return x.pow(3) // Is faster than mul()mul()mul()
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since cube(0) = 0
      return deepMap(x, this, true)
    },

    Unit: function (x) {
      return x.pow(3)
    }
  })
})
