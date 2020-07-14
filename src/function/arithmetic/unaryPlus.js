import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { unaryPlusNumber } from '../../plain/number'

const name = 'unaryPlus'
const dependencies = ['typed', 'config', 'BigNumber']

export const createUnaryPlus = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, BigNumber }) => {
  /**
   * Unary plus operation.
   * Boolean values and strings will be converted to a number, numeric values will be returned as is.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.unaryPlus(x)
   *
   * Examples:
   *
   *    math.unaryPlus(3.5)      // returns 3.5
   *    math.unaryPlus(1)     // returns 1
   *
   * See also:
   *
   *    unaryMinus, add, subtract
   *
   * @param  {number | BigNumber | Fraction | string | Complex | Unit | Array | Matrix} x
   *            Input value
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}
   *            Returns the input value when numeric, converts to a number when input is non-numeric.
   */
  return typed(name, {
    number: unaryPlusNumber,

    Complex: function (x) {
      return x // complex numbers are immutable
    },

    BigNumber: function (x) {
      return x // bignumbers are immutable
    },

    Fraction: function (x) {
      return x // fractions are immutable
    },

    Unit: function (x) {
      return x.clone()
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since unaryPlus(0) = 0
      return deepMap(x, this, true)
    },

    'boolean | string': function (x) {
      // convert to a number or bignumber
      return (config.number === 'BigNumber') ? new BigNumber(+x) : +x
    }
  })
})
