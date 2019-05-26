import { mapObject } from './object'
import { isNumber } from './is'

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

  return isFinite(value)
    ? (value === Math.round(value))
    : false
  // Note: we use ==, not ===, as we can have Booleans as well
}

/**
 * Calculate the sign of a number
 * @param {number} x
 * @returns {number}
 */
export const sign = /* #__PURE__ */ Math.sign || function (x) {
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
export const log2 = /* #__PURE__ */ Math.log2 || function log2 (x) {
  return Math.log(x) / Math.LN2
}

/**
 * Calculate the base-10 logarithm of a number
 * @param {number} x
 * @returns {number}
 */
export const log10 = /* #__PURE__ */ Math.log10 || function log10 (x) {
  return Math.log(x) / Math.LN10
}

/**
 * Calculate the natural logarithm of a number + 1
 * @param {number} x
 * @returns {number}
 */
export const log1p = /* #__PURE__ */ Math.log1p || function (x) {
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
export const cbrt = /* #__PURE__ */ Math.cbrt || function cbrt (x) {
  if (x === 0) {
    return x
  }

  const negate = x < 0
  let result
  if (negate) {
    x = -x
  }

  if (isFinite(x)) {
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
export const expm1 = /* #__PURE__ */ Math.expm1 || function expm1 (x) {
  return (x >= 2e-4 || x <= -2e-4)
    ? Math.exp(x) - 1
    : x + x * x / 2 + x * x * x / 6
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

  // default values for options
  let notation = 'auto'
  let precision

  if (options) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation
    }

    // determine precision from options
    if (isNumber(options)) {
      precision = options
    } else if (isNumber(options.precision)) {
      precision = options.precision
    }
  }

  // handle the various notations
  switch (notation) {
    case 'fixed':
      return toFixed(value, precision)

    case 'exponential':
      return toExponential(value, precision)

    case 'engineering':
      return toEngineering(value, precision)

    case 'auto':
      // TODO: clean up some day. Deprecated since: 2018-01-24
      // @deprecated upper and lower are replaced with upperExp and lowerExp since v4.0.0
      if (options && options.exponential && (options.exponential.lower !== undefined || options.exponential.upper !== undefined)) {
        const fixedOptions = mapObject(options, function (x) { return x })
        fixedOptions.exponential = undefined
        if (options.exponential.lower !== undefined) {
          fixedOptions.lowerExp = Math.round(Math.log(options.exponential.lower) / Math.LN10)
        }
        if (options.exponential.upper !== undefined) {
          fixedOptions.upperExp = Math.round(Math.log(options.exponential.upper) / Math.LN10)
        }

        console.warn('Deprecation warning: Formatting options exponential.lower and exponential.upper ' +
            '(minimum and maximum value) ' +
            'are replaced with exponential.lowerExp and exponential.upperExp ' +
            '(minimum and maximum exponent) since version 4.0.0. ' +
            'Replace ' + JSON.stringify(options) + ' with ' + JSON.stringify(fixedOptions))

        return toPrecision(value, precision, fixedOptions)
      }

      // remove trailing zeros after the decimal point
      return toPrecision(value, precision, options && options)
        .replace(/((\.\d*?)(0+))($|e)/, function () {
          const digits = arguments[2]
          const e = arguments[4]
          return (digits !== '.') ? digits + e : e
        })

    default:
      throw new Error('Unknown notation "' + notation + '". ' +
          'Choose "auto", "exponential", or "fixed".')
  }
}

/**
 * Split a number into sign, coefficients, and exponent
 * @param {number | string} value
 * @return {SplitValue}
 *              Returns an object containing sign, coefficients, and exponent
 */
export function splitNumber (value) {
  // parse the input value
  const match = String(value).toLowerCase().match(/^0*?(-?)(\d+\.?\d*)(e([+-]?\d+))?$/)
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

  return {
    sign: sign,
    coefficients: coefficients,
    exponent: exponent
  }
}

/**
 * Format a number in engineering notation. Like '1.23e+6', '2.3e+0', '3.500e-3'
 * @param {number | string} value
 * @param {number} [precision]        Optional number of significant figures to return.
 */
export function toEngineering (value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value)
  }

  const rounded = roundDigits(splitNumber(value), precision)

  const e = rounded.exponent
  let c = rounded.coefficients

  // find nearest lower multiple of 3 for exponent
  const newExp = e % 3 === 0 ? e : (e < 0 ? (e - 3) - (e % 3) : e - (e % 3))

  if (isNumber(precision)) {
    // add zeroes to give correct sig figs
    while (precision > c.length || (e - newExp) + 1 > c.length) {
      c.push(0)
    }
  } else {
    // concatenate coefficients with necessary zeros
    const significandsDiff = e >= 0 ? e : Math.abs(newExp)

    // add zeros if necessary (for ex: 1e+8)
    while (c.length - 1 < significandsDiff) {
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
  if (isNaN(value) || !isFinite(value)) {
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
  if (isNaN(value) || !isFinite(value)) {
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
  if (isNaN(value) || !isFinite(value)) {
    return String(value)
  }

  // determine lower and upper bound for exponential notation.
  const lowerExp = (options && options.lowerExp !== undefined) ? options.lowerExp : -3
  const upperExp = (options && options.upperExp !== undefined) ? options.upperExp : 5

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
 * Minimum number added to one that makes the result different than one
 */
export const DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16

/**
 * Compares two floating point numbers.
 * @param {number} x          First value to compare
 * @param {number} y          Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
*/
export function nearlyEqual (x, y, epsilon) {
  // if epsilon is null or undefined, test whether x and y are exactly equal
  if (epsilon === null || epsilon === undefined) {
    return x === y
  }

  if (x === y) {
    return true
  }

  // NaN
  if (isNaN(x) || isNaN(y)) {
    return false
  }

  // at this point x and y should be finite
  if (isFinite(x) && isFinite(y)) {
    // check numbers are very close, needed when comparing numbers near zero
    const diff = Math.abs(x - y)
    if (diff < DBL_EPSILON) {
      return true
    } else {
      // use relative error
      return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon
    }
  }

  // Infinite and Number or negative Infinite and positive Infinite cases
  return false
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
