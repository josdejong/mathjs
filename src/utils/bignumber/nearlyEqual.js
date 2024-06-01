/**
 * Compares two BigNumbers.
 * @param {BigNumber} a - First value to compare
 * @param {BigNumber} b - Second value to compare
 * @param {number} [relTol=1e-09] - The relative tolerance, indicating the maximum allowed difference relative to the larger absolute value. Must be greater than 0.
 * @param {number} [absTol=0] - The minimum absolute tolerance, useful for comparisons near zero. Must be at least 0.
 * @returns {boolean} whether the two numbers are nearly equal
 * @throws {Error} If `relTol` is less than or equal to 0.
 * @throws {Error} If `absTol` is less than 0.
 *
 * @example
 * nearlyEqual(1.000000001, 1.0, 1e-9);            // true
 * nearlyEqual(1.000000002, 1.0, 0);            // false
 * nearlyEqual(1.0, 1.009, undefined, 0.02);       // true
 * nearlyEqual(0.000000001, 0.0, undefined, 1e-8); // true
 */
export function nearlyEqual (a, b, relTol = 1e-9, absTol = 0) {
  if (relTol <= 0) {
    throw new Error('Relative tolerance must be greater than 0')
  }

  if (absTol < 0) {
    throw new Error('Absolute tolerance must be at least 0')
  }
  // NaN
  if (a.isNaN() || b.isNaN()) {
    return false
  }

  if (!a.isFinite() || !b.isFinite()) {
    return a.eq(b)
  }
  // use "==" operator, handles infinities
  if (a.eq(b)) {
    return true
  }
  // abs(a-b) <= max(relTol * max(abs(a), abs(b)), absTol)
  return a.minus(b).abs().lte(a.constructor.max(a.constructor.max(a.abs(), b.abs()).mul(relTol), absTol))
}
