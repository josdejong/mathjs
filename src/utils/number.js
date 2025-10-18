import { isBigNumber, isNumber, isObject } from './is.js'

/**
 * @typedef {{sign: '+' | '-' | '', coefficients: number[], exponent: number}} SplitValue
 */

/**
 * Check if a number is integer
 * @param {number | boolean} value
 * @return {boolean} isInteger
 */
export function isInteger (value) {
  if (typeof value === 'boolean') {
    return true
  }

  return Number.isFinite(value)
    ? (value === Math.round(value))
    : false
}

/**
 * Ensure the number type is compatible with the provided value.
 * If not, return 'number' instead.
 *
 * For example:
 *
 *     safeNumberType('2.3', { number: 'bigint', numberFallback: 'number' })
 *
 * will return 'number' and not 'bigint' because trying to create a bigint with
 * value 2.3 would throw an exception.
 *
 * @param {string} numberStr
 * @param {{
 *   number: 'number' | 'BigNumber' | 'bigint' | 'Fraction'
 *   numberFallback: 'number' | 'BigNumber'
 * }} config
 * @returns {'number' | 'BigNumber' | 'bigint' | 'Fraction'}
 */
export function safeNumberType (numberStr, config) {
  if (config.number === 'bigint') {
    try {
      BigInt(numberStr)
    } catch {
      return config.numberFallback
    }
  }

  return config.number
}

/**
 * Calculate the sign of a number
 * @param {number} x
 * @returns {number}
 */
export const sign = Math.sign || function (x) {
  if (x > 0) {
    return 1
  } else if (x < 0) {
    return -1
  } else {
    return 0
  }
}

/**
 * Calculate the base-2 logarithm of a number
 * @param {number} x
 * @returns {number}
 */
export const log2 = Math.log2 || function log2 (x) {
  return Math.log(x) / Math.LN2
}

/**
 * Calculate the base-10 logarithm of a number
 * @param {number} x
 * @returns {number}
 */
export const log10 = Math.log10 || function log10 (x) {
  return Math.log(x) / Math.LN10
}

/**
 * Calculate the natural logarithm of a number + 1
 * @param {number} x
 * @returns {number}
 */
export const log1p = Math.log1p || function (x) {
  return Math.log(x + 1)
}

/**
 * Calculate cubic root for a number
 *
 * Code from es6-shim.js:
 *   https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js#L1564-L1577
 *
 * @param {number} x
 * @returns {number} Returns the cubic root of x
 */
export const cbrt = Math.cbrt || function cbrt (x) {
  if (x === 0) {
    return x
  }

  const negate = x < 0
  let result
  if (negate) {
    x = -x
  }

  if (Number.isFinite(x)) {
    result = Math.exp(Math.log(x) / 3)
    // from https://en.wikipedia.org/wiki/Cube_root#Numerical_methods
    result = (x / (result * result) + (2 * result)) / 3
  } else {
    result = x
  }

  return negate ? -result : result
}

/**
 * Calculates exponentiation minus 1
 * @param {number} x
 * @return {number} res
 */
export const expm1 = Math.expm1 || function expm1 (x) {
  return (x >= 2e-4 || x <= -2e-4)
    ? Math.exp(x) - 1
    : x + x * x / 2 + x * x * x / 6
}

/**
 * Formats a number in a given base
 * @param {number} n
 * @param {number} base
 * @param {number} size
 * @returns {string}
 */
function formatNumberToBase (n, base, size) {
  const prefixes = { 2: '0b', 8: '0o', 16: '0x' }
  const prefix = prefixes[base]
  let suffix = ''
  if (size) {
    if (size < 1) {
      throw new Error('size must be in greater than 0')
    }
    if (!isInteger(size)) {
      throw new Error('size must be an integer')
    }
    if (n > 2 ** (size - 1) - 1 || n < -(2 ** (size - 1))) {
      throw new Error(`Value must be in range [-2^${size - 1}, 2^${size - 1}-1]`)
    }
    if (!isInteger(n)) {
      throw new Error('Value must be an integer')
    }
    if (n < 0) {
      n = n + 2 ** size
    }
    suffix = `i${size}`
  }
  let sign = ''
  if (n < 0) {
    n = -n
    sign = '-'
  }
  return `${sign}${prefix}${n.toString(base)}${suffix}`
}

/**
 * Convert a number to a formatted string representation.
 *
 * Syntax:
 *
 *    format(value)
 *    format(value, options)
 *    format(value, precision)
 *    format(value, fn)
 *
 * Where:
 *
 *    {number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {string} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'exponential'    Always use exponential notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'engineering'    Always use engineering notation.
 *                                          For example '123.4e+0' and '14.0e+6'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lowerExp` and `upperExp` bounds, and
 *                                          uses exponential notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                         'bin', 'oct, or
 *                         'hex'            Format the number using binary, octal,
 *                                          or hexadecimal notation.
 *                                          For example '0b1101' and '0x10fe'.
 *                     {number} wordSize    The word size in bits to use for formatting
 *                                          in binary, octal, or hexadecimal notation.
 *                                          To be used only with 'bin', 'oct', or 'hex'
 *                                          values for 'notation' option. When this option
 *                                          is defined the value is formatted as a signed
 *                                          twos complement integer of the given word size
 *                                          and the size suffix is appended to the output.
 *                                          For example
 *                                          format(-1, {notation: 'hex', wordSize: 8}) === '0xffi8'.
 *                                          Default value is undefined.
 *                     {number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'exponential',
 *                                          'engineering', and 'auto',
 *                                          `precision` defines the total
 *                                          number of significant digits returned.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point.
 *                                          `precision` is undefined by default,
 *                                          not rounding any digits.
 *                     {number} lowerExp    Exponent determining the lower boundary
 *                                          for formatting a value with an exponent
 *                                          when `notation='auto`.
 *                                          Default value is `-3`.
 *                     {number} upperExp    Exponent determining the upper boundary
 *                                          for formatting a value with an exponent
 *                                          when `notation='auto`.
 *                                          Default value is `5`.
 *    {Function} fn    A custom formatting function. Can be used to override the
 *                     built-in notations. Function `fn` is called with `value` as
 *                     parameter and must return a string. Is useful for example to
 *                     format all values inside a matrix in a particular way.
 *
 * Examples:
 *
 *    format(6.4)                                        // '6.4'
 *    format(1240000)                                    // '1.24e6'
 *    format(1/3)                                        // '0.3333333333333333'
 *    format(1/3, 3)                                     // '0.333'
 *    format(21385, 2)                                   // '21000'
 *    format(12.071, {notation: 'fixed'})                // '12'
 *    format(2.3,    {notation: 'fixed', precision: 2})  // '2.30'
 *    format(52.8,   {notation: 'exponential'})          // '5.28e+1'
 *    format(12345678, {notation: 'engineering'})        // '12.345678e+6'
 *
 * @param {number} value
 * @param {Object | Function | number} [options]
 * @return {string} str The formatted value
 */
export function format (value, options) {
  if (typeof options === 'function') {
    // handle format(value, fn)
    return options(value)
  }

  // handle special cases
  if (value === Infinity) {
    return 'Infinity'
  } else if (value === -Infinity) {
    return '-Infinity'
  } else if (isNaN(value)) {
    return 'NaN'
  }

  const { notation, precision, wordSize } = normalizeFormatOptions(options)

  // handle the various notations
  switch (notation) {
    case 'fixed':
      return toFixed(value, precision)

    case 'exponential':
      return toExponential(value, precision)

    case 'engineering':
      return toEngineering(value, precision)

    case 'bin':
      return formatNumberToBase(value, 2, wordSize)

    case 'oct':
      return formatNumberToBase(value, 8, wordSize)

    case 'hex':
      return formatNumberToBase(value, 16, wordSize)

    case 'auto':
      // remove trailing zeros after the decimal point
      return toPrecision(value, precision, options)
        .replace(/((\.\d*?)(0+))($|e)/, function () {
          const digits = arguments[2]
          const e = arguments[4]
          return (digits !== '.') ? digits + e : e
        })

    default:
      throw new Error('Unknown notation "' + notation + '". ' +
        'Choose "auto", "exponential", "fixed", "bin", "oct", or "hex.')
  }
}

/**
 * Normalize format options into an object:
 *   {
 *     notation: string,
 *     precision: number | undefined,
 *     wordSize: number | undefined
 *   }
 */
export function normalizeFormatOptions (options) {
  // default values for options
  let notation = 'auto'
  let precision
  let wordSize

  if (options !== undefined) {
    if (isNumber(options)) {
      precision = options
    } else if (isBigNumber(options)) {
      precision = options.toNumber()
    } else if (isObject(options)) {
      if (options.precision !== undefined) {
        precision = _toNumberOrThrow(options.precision, () => {
          throw new Error('Option "precision" must be a number or BigNumber')
        })
      }

      if (options.wordSize !== undefined) {
        wordSize = _toNumberOrThrow(options.wordSize, () => {
          throw new Error('Option "wordSize" must be a number or BigNumber')
        })
      }

      if (options.notation) {
        notation = options.notation
      }
    } else {
      throw new Error('Unsupported type of options, number, BigNumber, or object expected')
    }
  }

  return { notation, precision, wordSize }
}

/**
 * Split a number into sign, coefficients, and exponent
 * @param {number | string} value
 * @return {SplitValue}
 *              Returns an object containing sign, coefficients, and exponent
 */
export function splitNumber (value) {
  // parse the input value
  const match = String(value).toLowerCase().match(/^(-?)(\d+\.?\d*)(e([+-]?\d+))?$/)
  if (!match) {
    throw new SyntaxError('Invalid number ' + value)
  }

  const sign = match[1]
  const digits = match[2]
  let exponent = parseFloat(match[4] || '0')

  const dot = digits.indexOf('.')
  exponent += (dot !== -1) ? (dot - 1) : (digits.length - 1)

  const coefficients = digits
    .replace('.', '') // remove the dot (must be removed before removing leading zeros)
    .replace(/^0*/, function (zeros) {
      // remove leading zeros, add their count to the exponent
      exponent -= zeros.length
      return ''
    })
    .replace(/0*$/, '') // remove trailing zeros
    .split('')
    .map(function (d) {
      return parseInt(d)
    })

  if (coefficients.length === 0) {
    coefficients.push(0)
    exponent++
  }

  return { sign, coefficients, exponent }
}

/**
 * Format a number in engineering notation. Like '1.23e+6', '2.3e+0', '3.500e-3'
 * @param {number | string} value
 * @param {number} [precision]        Optional number of significant figures to return.
 */
export function toEngineering (value, precision) {
  if (isNaN(value) || !Number.isFinite(value)) {
    return String(value)
  }

  const split = splitNumber(value)
  const rounded = roundDigits(split, precision)

  const e = rounded.exponent
  const c = rounded.coefficients

  // find nearest lower multiple of 3 for exponent
  const newExp = e % 3 === 0 ? e : (e < 0 ? (e - 3) - (e % 3) : e - (e % 3))

  if (isNumber(precision)) {
    // add zeroes to give correct sig figs
    while (precision > c.length || (e - newExp) + 1 > c.length) {
      c.push(0)
    }
  } else {
    // concatenate coefficients with necessary zeros
    // add zeros if necessary (for example: 1e+8 -> 100e+6)
    const missingZeros = Math.abs(e - newExp) - (c.length - 1)
    for (let i = 0; i < missingZeros; i++) {
      c.push(0)
    }
  }

  // find difference in exponents
  let expDiff = Math.abs(e - newExp)
  let decimalIdx = 1

  // push decimal index over by expDiff times
  while (expDiff > 0) {
    decimalIdx++
    expDiff--
  }

  // if all coefficient values are zero after the decimal point and precision is unset, don't add a decimal value.
  // otherwise concat with the rest of the coefficients
  const decimals = c.slice(decimalIdx).join('')
  const decimalVal = ((isNumber(precision) && decimals.length) || decimals.match(/[1-9]/)) ? ('.' + decimals) : ''

  const str = c.slice(0, decimalIdx).join('') +
    decimalVal +
    'e' + (e >= 0 ? '+' : '') + newExp.toString()
  return rounded.sign + str
}

/**
 * Format a number with fixed notation.
 * @param {number | string} value
 * @param {number} [precision=undefined]  Optional number of decimals after the
 *                                        decimal point. null by default.
 */
export function toFixed (value, precision) {
  if (isNaN(value) || !Number.isFinite(value)) {
    return String(value)
  }

  const splitValue = splitNumber(value)
  const rounded = (typeof precision === 'number')
    ? roundDigits(splitValue, splitValue.exponent + 1 + precision)
    : splitValue
  let c = rounded.coefficients
  let p = rounded.exponent + 1 // exponent may have changed

  // append zeros if needed
  const pp = p + (precision || 0)
  if (c.length < pp) {
    c = c.concat(zeros(pp - c.length))
  }

  // prepend zeros if needed
  if (p < 0) {
    c = zeros(-p + 1).concat(c)
    p = 1
  }

  // insert a dot if needed
  if (p < c.length) {
    c.splice(p, 0, (p === 0) ? '0.' : '.')
  }

  return rounded.sign + c.join('')
}

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {number | string} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 */
export function toExponential (value, precision) {
  if (isNaN(value) || !Number.isFinite(Number(value))) {
    return String(value)
  }

  // round if needed, else create a clone
  const split = splitNumber(value)
  const rounded = precision ? roundDigits(split, precision) : split
  let c = rounded.coefficients
  const e = rounded.exponent

  // append zeros if needed
  if (c.length < precision) {
    c = c.concat(zeros(precision - c.length))
  }

  // format as `C.CCCe+EEE` or `C.CCCe-EEE`
  const first = c.shift()
  return rounded.sign + first + (c.length > 0 ? ('.' + c.join('')) : '') +
    'e' + (e >= 0 ? '+' : '') + e
}

/**
 * Format a number with a certain precision
 * @param {number | string} value
 * @param {number} [precision=undefined] Optional number of digits.
 * @param {{lowerExp: number | undefined, upperExp: number | undefined}} [options]
 *                                       By default:
 *                                         lowerExp = -3 (incl)
 *                                         upper = +5 (excl)
 * @return {string}
 */
export function toPrecision (value, precision, options) {
  if (isNaN(value) || !Number.isFinite(value)) {
    return String(value)
  }

  // determine lower and upper bound for exponential notation.
  const lowerExp = _toNumberOrDefault(options?.lowerExp, -3)
  const upperExp = _toNumberOrDefault(options?.upperExp, 5)

  const split = splitNumber(value)
  const rounded = precision ? roundDigits(split, precision) : split
  if (rounded.exponent < lowerExp || rounded.exponent >= upperExp) {
    // exponential notation
    return toExponential(value, precision)
  } else {
    let c = rounded.coefficients
    const e = rounded.exponent

    // append trailing zeros
    if (c.length < precision) {
      c = c.concat(zeros(precision - c.length))
    }

    // append trailing zeros
    // TODO: simplify the next statement
    c = c.concat(zeros(e - c.length + 1 +
      (c.length < precision ? precision - c.length : 0)))

    // prepend zeros
    c = zeros(-e).concat(c)

    const dot = e > 0 ? e : 0
    if (dot < c.length - 1) {
      c.splice(dot + 1, 0, '.')
    }

    return rounded.sign + c.join('')
  }
}

/**
 * Round the number of digits of a number *
 * @param {SplitValue} split       A value split with .splitNumber(value)
 * @param {number} precision  A positive integer
 * @return {SplitValue}
 *              Returns an object containing sign, coefficients, and exponent
 *              with rounded digits
 */
export function roundDigits (split, precision) {
  // create a clone
  const rounded = {
    sign: split.sign,
    coefficients: split.coefficients,
    exponent: split.exponent
  }
  const c = rounded.coefficients

  // prepend zeros if needed
  while (precision <= 0) {
    c.unshift(0)
    rounded.exponent++
    precision++
  }

  if (c.length > precision) {
    const removed = c.splice(precision, c.length - precision)

    if (removed[0] >= 5) {
      let i = precision - 1
      c[i]++
      while (c[i] === 10) {
        c.pop()
        if (i === 0) {
          c.unshift(0)
          rounded.exponent++
          i++
        }
        i--
        c[i]++
      }
    }
  }

  return rounded
}

/**
 * Create an array filled with zeros.
 * @param {number} length
 * @return {Array}
 */
function zeros (length) {
  const arr = []
  for (let i = 0; i < length; i++) {
    arr.push(0)
  }
  return arr
}

/**
 * Count the number of significant digits of a number.
 *
 * For example:
 *   2.34 returns 3
 *   0.0034 returns 2
 *   120.5e+30 returns 4
 *
 * @param {number} value
 * @return {number} digits   Number of significant digits
 */
export function digits (value) {
  return value
    .toExponential()
    .replace(/e.*$/, '') // remove exponential notation
    .replace(/^0\.?0*|\./, '') // remove decimal point and leading zeros
    .length
}

/**
 * Compares two floating point numbers.
 * @param {number} a - First value to compare
 * @param {number} b - Second value to compare
 * @param {number} [relTol=1e-09] - The relative tolerance, indicating the maximum allowed difference relative to the larger absolute value. Must be greater than 0.
 * @param {number} [absTol=1e-12] - The minimum absolute tolerance, useful for comparisons near zero. Must be at least 0.
 * @return {boolean} whether the two numbers are nearly equal
 *
 * @throws {Error} If `relTol` is less than or equal to 0.
 * @throws {Error} If `absTol` is less than 0.
 *
 * @example
 * nearlyEqual(1.000000001, 1.0, 1e-8);            // true
 * nearlyEqual(1.000000002, 1.0, 0);            // false
 * nearlyEqual(1.0, 1.009, undefined, 0.01);       // true
 * nearlyEqual(0.000000001, 0.0, undefined, 1e-8); // true
 */
export function nearlyEqual (a, b, relTol = 1e-8, absTol = 0) {
  if (relTol <= 0) {
    throw new Error('Relative tolerance must be greater than 0')
  }

  if (absTol < 0) {
    throw new Error('Absolute tolerance must be at least 0')
  }

  // NaN
  if (isNaN(a) || isNaN(b)) {
    return false
  }

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return a === b
  }

  if (a === b) {
    return true
  }

  // abs(a-b) <= max(rel_tol * max(abs(a), abs(b)), abs_tol)
  return Math.abs(a - b) <= Math.max(relTol * Math.max(Math.abs(a), Math.abs(b)), absTol)
}

/**
 * Calculate the hyperbolic arccos of a number
 * @param {number} x
 * @return {number}
 */
export const acosh = Math.acosh || function (x) {
  return Math.log(Math.sqrt(x * x - 1) + x)
}

export const asinh = Math.asinh || function (x) {
  return Math.log(Math.sqrt(x * x + 1) + x)
}

/**
 * Calculate the hyperbolic arctangent of a number
 * @param {number} x
 * @return {number}
 */
export const atanh = Math.atanh || function (x) {
  return Math.log((1 + x) / (1 - x)) / 2
}

/**
 * Calculate the hyperbolic cosine of a number
 * @param {number} x
 * @returns {number}
 */
export const cosh = Math.cosh || function (x) {
  return (Math.exp(x) + Math.exp(-x)) / 2
}

/**
 * Calculate the hyperbolic sine of a number
 * @param {number} x
 * @returns {number}
 */
export const sinh = Math.sinh || function (x) {
  return (Math.exp(x) - Math.exp(-x)) / 2
}

/**
 * Calculate the hyperbolic tangent of a number
 * @param {number} x
 * @returns {number}
 */
export const tanh = Math.tanh || function (x) {
  const e = Math.exp(2 * x)
  return (e - 1) / (e + 1)
}

/**
 * Returns a value with the magnitude of x and the sign of y.
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
export function copysign (x, y) {
  const signx = x > 0 ? true : x < 0 ? false : 1 / x === Infinity
  const signy = y > 0 ? true : y < 0 ? false : 1 / y === Infinity
  return signx ^ signy ? -x : x
}

function _toNumberOrThrow (value, onError) {
  if (isNumber(value)) {
    return value
  } else if (isBigNumber(value)) {
    return value.toNumber()
  } else {
    onError()
  }
}

function _toNumberOrDefault (value, defaultValue) {
  if (isNumber(value)) {
    return value
  } else if (isBigNumber(value)) {
    return value.toNumber()
  } else {
    return defaultValue
  }
}
