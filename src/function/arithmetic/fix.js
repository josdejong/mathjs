import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'

const name = 'fix'
const dependencies = ['typed', 'Complex', 'matrix', 'ceil', 'floor']

export const createFix = /* #__PURE__ */ factory(name, dependencies, ({ typed, Complex, matrix, ceil, floor }) => {
  const algorithm14 = createAlgorithm14({ typed })
  /**
   * Round a value towards zero.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.fix(x)
   *
   * Examples:
   *
   *    math.fix(3.2)                // returns number 3
   *    math.fix(3.8)                // returns number 3
   *    math.fix(-4.2)               // returns number -4
   *    math.fix(-4.7)               // returns number -4
   *
   *    math.fix(3.12, 1)                // returns number 3.1
   *    math.fix(3.18, 1)                // returns number 3.1
   *    math.fix(-4.12, 1)               // returns number -4.1
   *    math.fix(-4.17, 1)               // returns number -4.1
   *
   *    const c = math.complex(3.22, -2.78)
   *    math.fix(c)                  // returns Complex 3 - 2i
   *    math.fix(c, 1)               // returns Complex 3.2 - 2.7i
   *
   *    math.fix([3.2, 3.8, -4.7])      // returns Array [3, 3, -4]
   *    math.fix([3.2, 3.8, -4.7], 1)   // returns Array [3.2, 3.8, -4.7]
   *
   * See also:
   *
   *    ceil, floor, round
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x    Number to be rounded
   * @param  {number | BigNumber | Array} [n=0]                             Number of decimals
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix}     Rounded value
   */
  return typed('fix', {
    number: function (x) {
      return (x > 0) ? floor(x) : ceil(x)
    },

    'number, number | BigNumber': function (x, n) {
      return (x > 0) ? floor(x, n) : ceil(x, n)
    },

    Complex: function (x) {
      return new Complex(
        (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
        (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
      )
    },

    'Complex, number | BigNumber': function (x, n) {
      return new Complex(
        (x.re > 0) ? floor(x.re, n) : ceil(x.re, n),
        (x.im > 0) ? floor(x.im, n) : ceil(x.im, n)
      )
    },

    BigNumber: function (x) {
      return x.isNegative() ? ceil(x) : floor(x)
    },

    'BigNumber, number | BigNumber': function (x, n) {
      return x.isNegative() ? ceil(x, n) : floor(x, n)
    },

    Fraction: function (x) {
      return x.s < 0 ? x.ceil() : x.floor()
    },

    'Fraction, number | BigNumber': function (x, n) {
      return x.s < 0 ? x.ceil(n) : x.floor(n)
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since fix(0) = 0
      return deepMap(x, this, true)
    },

    'Array | Matrix, number | BigNumber': function (x, n) {
      // deep map collection, skip zeros since fix(0) = 0
      return deepMap(x, i => this(i, n), true)
    },

    'number | Complex | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, this, true).valueOf()
    }
  })
})
