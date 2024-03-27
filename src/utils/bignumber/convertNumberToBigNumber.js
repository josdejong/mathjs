import { digits } from '../number.js'

/**
 * Convert a number into a BigNumber when it is safe to do so: only when the number
 * is has max 15 digits, since a JS number can only represent about ~16 digits.
 * This function will correct round-off errors introduced by the JS floating-point
 * operations. For example, it will change 0.1+0.2 = 0.30000000000000004 into 0.3.
 *
 * The function throws an Error when the number cannot be converted safely into a BigNumber.
 *
 * @param {number} x
 * @param {function} BigNumber The bignumber constructor
 * @returns {BigNumber}
 */
export function convertNumberToBigNumber (x, BigNumber) {
  const d = digits(x)
  if (d.length <= 15) {
    return new BigNumber(x)
  }

  // recognize round-off errors like 0.1 + 0.2 = 0.30000000000000004, which should be 0.3
  // we test whether the first 15 digits end with at least 6 zeros, and a non-zero last digit
  // note that a number can optionally end with an exponent
  const xStr = x.toString()
  const matchTrailingZeros = xStr.match(/(?<start>.+)(?<zeros>0{6,}[1-9][0-9]*)(?<end>$|[+-eE])/)
  if (matchTrailingZeros) {
    const { start, end } = matchTrailingZeros.groups
    return new BigNumber(start + end)
  }

  // recognize round-off errors like 40 - 38.6 = 1.3999999999999986, which should be 1.4
  // we test whether the first 15 digits end with at least 6 nines, and a non-nine and non-zero last digit
  // note that a number can optionally end with an exponent
  const matchTrailingNines = xStr.match(/(?<start>.+)(?<digitBeforeNines>[0-8])(?<nines>9{6,}[1-8][0-9]*)(?<end>$|[+-eE])/)
  if (matchTrailingNines) {
    const { start, digitBeforeNines, end } = matchTrailingNines.groups
    return new BigNumber(start + String(parseInt(digitBeforeNines) + 1) + end)
  }

  throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' +
    '(value: ' + x + '). ' +
    'Use function bignumber(x) to convert to BigNumber.')
}
