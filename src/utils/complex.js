import { nearlyEqual } from './number.js'

/**
 * Test whether two complex values are equal provided a given relTol and absTol.
 * Does not use or change the global Complex.EPSILON setting
 * @param {Complex} x - The first complex number for comparison.
 * @param {Complex} y - The second complex number for comparison.
 * @param {number} relTol - The relative tolerance for comparison.
 * @param {number} absTol - The absolute tolerance for comparison.
 * @returns {boolean} - Returns true if the two complex numbers are equal within the given tolerances, otherwise returns false.
 */
export function complexEquals (x, y, relTol, absTol) {
  return nearlyEqual(x.re, y.re, relTol, absTol) && nearlyEqual(x.im, y.im, relTol, absTol)
}
