import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual.js'
import { nearlyEqual } from '../../utils/number.js'
import { factory } from '../../utils/factory.js'
import { complexEquals } from '../../utils/complex.js'
import { createCompareUnits } from './compareUnits.js'

const name = 'equalScalar'
const dependencies = ['typed', 'config']

export const createEqualScalar = /* #__PURE__ */ factory(name, dependencies, ({ typed, config }) => {
  const compareUnits = createCompareUnits({ typed })

  /**
   * Test whether two scalar values are nearly equal.
   *
   * @param  {number | BigNumber | bigint | Fraction | boolean | Complex | Unit} x   First value to compare
   * @param  {number | BigNumber | bigint | Fraction | boolean | Complex} y          Second value to compare
   * @return {boolean}                                                  Returns true when the compared values are equal, else returns false
   * @private
   */
  return typed(name, {

    'boolean, boolean': function (x, y) {
      return x === y
    },

    'number, number': function (x, y) {
      return nearlyEqual(x, y, config.relTol, config.absTol)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.eq(y) || bigNearlyEqual(x, y, config.relTol, config.absTol)
    },

    'bigint, bigint': function (x, y) {
      return x === y
    },

    'Fraction, Fraction': function (x, y) {
      return x.equals(y)
    },

    'Complex, Complex': function (x, y) {
      return complexEquals(x, y, config.relTol, config.absTol)
    }
  }, compareUnits)
})

export const createEqualScalarNumber = factory(name, ['typed', 'config'], ({ typed, config }) => {
  return typed(name, {
    'number, number': function (x, y) {
      return nearlyEqual(x, y, config.relTol, config.absTol)
    }
  })
})
