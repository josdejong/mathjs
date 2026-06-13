import { factory } from '../../utils/factory.js'
import { addNumber } from '../../plain/number/index.js'
import { createUnitScalarHandler } from './unitArithmeticHelper.js'

const name = 'addScalar'
const dependencies = ['typed']

export const createAddScalar = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Add two scalar values, `x + y`.
   * This function is meant for internal use: it is used by the public function
   * `add`
   *
   * This function does not support collections (Array or Matrix).
   *
   * @param  {number | BigNumber | bigint | Fraction | Complex | Unit} x   First value to add
   * @param  {number | BigNumber | bigint | Fraction | Complex} y          Second value to add
   * @return {number | BigNumber | bigint | Fraction | Complex | Unit}     Sum of `x` and `y`
   * @private
   */
  return typed(name, {

    'number, number': addNumber,

    'Complex, Complex': function (x, y) {
      return x.add(y)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.plus(y)
    },

    'bigint, bigint': function (x, y) {
      return x + y
    },

    'Fraction, Fraction': function (x, y) {
      return x.add(y)
    },

    'Unit, Unit': typed.referToSelf(self => createUnitScalarHandler(self, typed))
  })
})
