import { factory } from '../../utils/factory'
import { multiplyNumber } from '../../plain/number'

const name = 'multiplyScalar'
const dependencies = ['typed']

export const createMultiplyScalar = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Multiply two scalar values, `x * y`.
   * This function is meant for internal use: it is used by the public function
   * `multiply`
   *
   * This function does not support collections (Array or Matrix).
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to multiply
   * @param  {number | BigNumber | Fraction | Complex} y          Second value to multiply
   * @return {number | BigNumber | Fraction | Complex | Unit}     Multiplication of `x` and `y`
   * @private
   */
  return typed('multiplyScalar', {

    'number, number': multiplyNumber,

    'Complex, Complex': function (x, y) {
      return x.mul(y)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.times(y)
    },

    'Fraction, Fraction': function (x, y) {
      return x.mul(y)
    },

    'number | Fraction | BigNumber | Complex, Unit': function (x, y) {
      const res = y.clone()
      res.value = (res.value === null) ? res._normalize(x) : this(res.value, x)
      return res
    },

    'Unit, number | Fraction | BigNumber | Complex': function (x, y) {
      const res = x.clone()
      res.value = (res.value === null) ? res._normalize(y) : this(res.value, y)
      return res
    },

    'Unit, Unit': function (x, y) {
      return x.multiply(y)
    }

  })
})
