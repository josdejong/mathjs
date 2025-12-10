/** @param {number | bigint} i
 *  @param {number | bigint} n  [NB: same type as i]
 *  @returns {number | bigint} product of i to n
 */
export function product (i, n) {
  if (i <= 0) return i - i // always 0, for number or bigint
  // Which is faster: `const one = typeof i === 'number' ? 1 : 1n`, or:
  const one = i / i // always has the proper type
  if (n < i) return one
  if (n === i) return n

  const half = (n + i) >> one // divide (n + i) by 2 and truncate to integer
  return product(i, half) * product(half + one, n)
}
