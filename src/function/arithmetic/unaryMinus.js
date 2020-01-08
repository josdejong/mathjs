import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { unaryMinusNumber } from '../../plain/number'

const name = 'unaryMinus'
const dependencies = ['typed']

export const createUnaryMinus = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Inverse the sign of a value, apply a unary minus operation.
   *
   * For matrices, the function is evaluated element wise. Boolean values and
   * strings will be converted to a number. For complex numbers, both real and
   * complex value are inverted.
   *
   * Syntax:
   *
   *    math.unaryMinus(x)
   *
   * Examples:
   *
   *    math.unaryMinus(3.5)      // returns -3.5
   *    math.unaryMinus(-4.2)     // returns 4.2
   *
   * See also:
   *
   *    add, subtract, unaryPlus
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x Number to be inverted.
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Returns the value with inverted sign.
   */
  const unaryMinus = typed(name, {
    number: unaryMinusNumber,

    Complex: function (x) {
      return x.neg()
    },

    BigNumber: function (x) {
      return x.neg()
    },

    Fraction: function (x) {
      return x.neg()
    },

    Unit: function (x) {
      const res = x.clone()
      res.value = unaryMinus(x.value)
      return res
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since unaryMinus(0) = 0
      return deepMap(x, unaryMinus, true)
    }

    // TODO: add support for string
  })

  return unaryMinus
})
