import { factory } from '../../utils/factory.js'
import { multiplyNumber } from '../../plain/number/index.js'

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
   * @param  {number | BigNumber | bigint | Fraction | Complex | Unit} x   First value to multiply
   * @param  {number | BigNumber | bigint | Fraction | Complex} y          Second value to multiply
   * @return {number | BigNumber | bigint | Fraction | Complex | Unit}     Multiplication of `x` and `y`
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

    'bigint, bigint': function (x, y) {
      return x * y
    },

    'Fraction, Fraction': function (x, y) {
      return x.mul(y)
    },

    'number | Fraction | BigNumber | Complex, Unit': (x, y) => y.multiply(x),

    'Unit, number | Fraction | BigNumber | Complex | Unit': (x, y) => x.multiply(y)
  })
})
