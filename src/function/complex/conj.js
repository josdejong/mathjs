import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'

const name = 'conj'
const dependencies = ['typed']

export const createConj = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Compute the complex conjugate of a complex value.
   * If `x = a+bi`, the complex conjugate of `x` is `a - bi`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.conj(x)
   *
   * Examples:
   *
   *    math.conj(math.complex('2 + 3i'))  // returns Complex 2 - 3i
   *    math.conj(math.complex('2 - 3i'))  // returns Complex 2 + 3i
   *    math.conj(math.complex('-5.2i'))  // returns Complex 5.2i
   *
   * See also:
   *
   *    re, im, arg, abs
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x
   *            A complex number or array with complex numbers
   * @return {number | BigNumber | Complex | Array | Matrix}
   *            The complex conjugate of x
   */
  const conj = typed(name, {
    number: function (x) {
      return x
    },

    BigNumber: function (x) {
      return x
    },

    Complex: function (x) {
      return x.conjugate()
    },

    'Array | Matrix': function (x) {
      return deepMap(x, conj)
    }
  })

  return conj
})
