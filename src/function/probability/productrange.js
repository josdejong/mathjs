
function product (i, n) {
  let half
  if (n < i) {
    return 1
  }
  if (n === i) {
    return n
  }
  half = ((n + i) / 2) | 0
  return product(i, half) * product(half + 1, n)
}

module.exports = product
