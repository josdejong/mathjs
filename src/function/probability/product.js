/** @param {integer} i
 *  @param {integer} n
 *  @returns : product of i to n
 */
function product (i, n) {
  let half
  if (n < i) {
    return 1
  }
  if (n === i) {
    return n
  }
  half = (n + i) >> 1 // divide (n + i) by 2 and truncate to integer
  return product(i, half) * product(half + 1, n)
}

module.exports = product
