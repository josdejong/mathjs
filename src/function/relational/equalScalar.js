import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual'
import { nearlyEqual } from '../../utils/number'
import { factory } from '../../utils/factory'
import { complexEquals } from '../../utils/complex'

const name = 'equalScalar'
const dependencies = ['typed', 'config']

export const createEqualScalar = /* #__PURE__ */ factory(name, dependencies, ({ typed, config }) => {
  /**
   * Test whether two scalar values are nearly equal.
   *
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit} x   First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Complex} y          Second value to compare
   * @return {boolean}                                                  Returns true when the compared values are equal, else returns false
   * @private
   */
  return typed(name, {

    'boolean, boolean': function (x, y) {
      return x === y
    },

    'number, number': function (x, y) {
      return nearlyEqual(x, y, config.epsilon)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.eq(y) || bigNearlyEqual(x, y, config.epsilon)
    },

    'Fraction, Fraction': function (x, y) {
      return x.equals(y)
    },

    'Complex, Complex': function (x, y) {
      return complexEquals(x, y, config.epsilon)
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base')
      }
      return this(x.value, y.value)
    }
  })
})

export const createEqualScalarNumber = factory(name, ['typed', 'config'], ({ typed, config }) => {
  return typed(name, {
    'number, number': function (x, y) {
      return nearlyEqual(x, y, config.epsilon)
    }
  })
})
