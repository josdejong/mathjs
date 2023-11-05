import { isBigNumber, isComplex, isUnit } from '../../../utils/is.js'

/**
 * Test the truthiness of a scalar condition
 * @param {number, boolean, BigNumber, Complex, Unit} condition
 * @returns {boolean} Returns the truthiness of the condition
 */
export function testCondition (condition) {
  if (typeof condition === 'number' ||
      typeof condition === 'boolean') {
    return !!condition
  }
  if (condition === null || condition === undefined) {
    return false
  }
  if (isBigNumber(condition)) {
    return !condition.isZero()
  }

  if (isComplex(condition)) {
    return !!((condition.re || condition.im))
  }

  if (isUnit(condition)) {
    return !!condition.value
  }

  if (condition === null || condition === undefined) {
    return false
  }
}
