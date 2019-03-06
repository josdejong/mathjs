import { isInteger } from '../../utils/number'
import { product } from '../../utils/product'

export function combinationsNumber (n, k) {
  let prodrange, nMinusk

  if (!isInteger(n) || n < 0) {
    throw new TypeError('Positive integer value expected in function combinations')
  }
  if (!isInteger(k) || k < 0) {
    throw new TypeError('Positive integer value expected in function combinations')
  }
  if (k > n) {
    throw new TypeError('k must be less than or equal to n')
  }

  nMinusk = n - k

  if (k < nMinusk) {
    prodrange = product(nMinusk + 1, n)
    return prodrange / product(1, k)
  }
  prodrange = product(k + 1, n)
  return prodrange / product(1, nMinusk)
}
combinationsNumber.signature = 'number, number'
