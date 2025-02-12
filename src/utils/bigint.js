/**
 * Build a bigint logarithm function from a number logarithm,
 * still returning a number. The idea is that 15 hexadecimal digits
 * (60 bits) saturates the mantissa of the log, and each additional hex
 * digit effectively just adds the log of 16 to the resulting value. So
 * convert the most significant 15 hex digits to a number and take its
 * log, and then add the log of 16 for each additional hex digit that
 * was in the bigint.
 * For negative numbers (complex logarithms), following the bignum
 * implementation, it just downgrades to number and uses the complex result.
 * @param {number} log16  the log of 16
 * @param {(number) -> number} numberLog  the logarithm function for numbers
 * @param {ConfigurationObject} config  the mathjs configuration
 * @param {(number) -> Complex} cplx  the associated Complex log
 * @returns {(bigint) -> number}   the corresponding logarithm for bigints
 */
export function promoteLogarithm (log16, numberLog, config, cplx) {
  return function (b) {
    if (b > 0 || config.predictable) {
      if (b <= 0) return NaN
      const s = b.toString(16)
      const s15 = s.substring(0, 15)
      return log16 * (s.length - s15.length) + numberLog(Number('0x' + s15))
    }
    return cplx(b.toNumber())
  }
}
