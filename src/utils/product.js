/** @param {number} i
 *  @param {number} n
 *  @returns {number} product of i to n
 */
export function product (i, n) {
  if (n < i) {
    return 1
  }

  if (n === i) {
    return n
  }

  const half = i + Math.floor((n - i) / 2)
  return product(i, half) * product(half + 1, n)
}
