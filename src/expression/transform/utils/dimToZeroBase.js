import { isNumber, isBigNumber } from '../../../utils/is.js'
/**
 * Change last argument dim from one-based to zero-based.
 */
export function dimToZeroBase (dim) {
  if (isNumber(dim)) {
    return dim - 1
  } else if (isBigNumber(dim)) {
    return dim.minus(1)
  } else {
    return dim
  }
}

export function isNumberOrBigNumber (n) {
  return isNumber(n) || isBigNumber(n)
}
