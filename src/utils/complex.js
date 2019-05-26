import { nearlyEqual } from './number'

/**
 * Test whether two complex values are equal provided a given epsilon.
 * Does not use or change the global Complex.EPSILON setting
 * @param {Complex} x
 * @param {Complex} y
 * @param {number} epsilon
 * @returns {boolean}
 */
export function complexEquals (x, y, epsilon) {
  return nearlyEqual(x.re, y.re, epsilon) && nearlyEqual(x.im, y.im, epsilon)
}
