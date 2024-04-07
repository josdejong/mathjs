import { nearlyEqual } from './number.js'

/**
 * Test whether two complex values are equal provided a given epsilon.
 * Does not use or change the global Complex.EPSILON setting
 * @param {Complex} x
 * @param {Complex} y
 * @param {number} relTol
 * @param {number} absTol
 * @returns {boolean}
 */
export function complexEquals (x, y, relTol, absTol) {
  return nearlyEqual(x.re, y.re, relTol, absTol) && nearlyEqual(x.im, y.im, relTol, absTol)
}
