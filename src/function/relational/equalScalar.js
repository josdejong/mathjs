'use strict'

import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual'
import { nearlyEqual } from '../../utils/number'
import { factory } from '../../utils/factory'
import { complexEquals } from '../../utils/complex'

const name = 'equalScalar'
const dependencies = ['typed', 'config.epsilon']

export const createEqualScalar = /* #__PURE__ */ factory(name, dependencies, ({ typed, config: { epsilon } }) => {
  /**
   * Test whether two scalar values are nearly equal.
   *
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit} x   First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Complex} y          Second value to compare
   * @return {boolean}                                                  Returns true when the compared values are equal, else returns false
   * @private
   */
  const equalScalar = typed(name, {

    'boolean, boolean': function (x, y) {
      return x === y
    },

    'number, number': function (x, y) {
      return x === y || nearlyEqual(x, y, epsilon)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.eq(y) || bigNearlyEqual(x, y, epsilon)
    },

    'Fraction, Fraction': function (x, y) {
      return x.equals(y)
    },

    'Complex, Complex': function (x, y) {
      return complexEquals(x, y, epsilon)
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base')
      }
      return equalScalar(x.value, y.value)
    }
  })

  return equalScalar
})
