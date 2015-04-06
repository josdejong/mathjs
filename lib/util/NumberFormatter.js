'use strict';

/**
 * Format a number using methods toPrecision, toFixed, toExponential.
 * @param {number | string} value
 * @constructor
 */
function NumberFormatter (value) {
  // parse the input value
  var match = String(value).toLowerCase().match(/^0*?(-?)(\d+\.?\d*)(e([+-]?\d+))?$/);
  if (!match) {
    throw new SyntaxError('Invalid number');
  }

  var sign         = match[1];
  var coefficients = match[2];
  var exponent     = parseFloat(match[4] || '0');

  var dot = coefficients.indexOf('.');
  exponent += (dot !== -1) ? (dot - 1) : (coefficients.length - 1);

  this.sign = sign;
  this.coefficients = coefficients
      .replace('.', '')  // remove the dot (must be removed before removing leading zeros)
      .replace(/^0*/, function (zeros) {
        // remove leading zeros, add their count to the exponent
        exponent -= zeros.length;
        return '';
      })
      .replace(/0*$/, '') // remove trailing zeros
      .split('');

  if (this.coefficients.length === 0) {
    this.coefficients.push(0);
    exponent++;
  }

  this.exponent = exponent;
}

/**
 * Format a number with fixed notation.
 * @param {Number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
NumberFormatter.prototype.toFixed = function (precision) {
  if (precision) {
    var dot = this.exponent > 0 ? this.exponent : 0;
    var all = init(-this.exponent, 0).concat(this.coefficients);
    var coefficients = round(all, dot + precision + 1);
    coefficients.splice(dot + 1, 0, '.');

    return this.sign + coefficients.join('');
  }
  else {
    // TODO: make the || '0' redundant
    return this.sign + round(this.coefficients, this.exponent + 1).join('') || '0';
  }
};

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {Number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 */
NumberFormatter.prototype.toExponential = function (precision) {
  var coefficients = precision
      ? round(this.coefficients, precision)
      : this.coefficients.slice(0);

  var first = coefficients.shift();
  return this.sign +
      first +
      (coefficients.length > 0 ? ('.' + coefficients.join('')) : '') +
      'e' + (this.exponent >= 0 ? '+' : '') + this.exponent;
};

/**
 * Format a number with a certain precision
 * @param {Number} [precision=undefined] Optional number of digits.
 * @param {{lower: number | undefined, upper: number | undefined}} [options]
 *                                       By default:
 *                                         lower = 1e-3 (excl)
 *                                         upper = 1e+5 (incl)
 * @return {string}
 */
NumberFormatter.prototype.toPrecision = function(precision, options) {
  // determine lower and upper bound for exponential notation.
  var lower = (options && options.lower !== undefined) ? options.lower : 1e-3;
  var upper = (options && options.upper !== undefined) ? options.upper : 1e+5;

  var abs = Math.abs(Math.pow(10, this.exponent));
  if (abs < lower || abs >= upper) {
    // exponential notation
    return this.toExponential(precision);
  }
  else {
    var all = init(-this.exponent, 0).concat(this.coefficients);

    var coefficients = precision
        ? round(all, precision + (this.exponent < 0 ? -this.exponent : 0))
        : all;

    // append trailing zeros
    var trailing = init(this.exponent - coefficients.length + 1, 0);
    coefficients = coefficients.concat(trailing);

    var dot = this.exponent > 0 ? this.exponent : 0;
    if (dot < coefficients.length - 1) {
      coefficients.splice(dot + 1, 0, '.');
    }

    return this.sign + coefficients.join('');
  }
};

/**
 * Round an array with coefficients. For example:
 *
 *   round([2,3,4,5,6], 2) returns '23'
 *   round([2,3,4,5,6], 4) returns '2346'
 *   round([2,3], 4) returns '2300'
 *
 * @param {number[]} coefficients
 * @param {number} count
 * @return {number[]} Returns array with rounded coefficients
 */
function round(coefficients, count) {
  // TODO: simplify this method, write in a more compact way
  var rounded = coefficients.slice(0, count);
  if (coefficients[count] >= 5) {
    if (count === 0) {
      rounded.unshift(0);
      count++;
    }
    rounded[count - 1]++;

    var i = count - 1;
    while (i > 0) {
      if (rounded[i] === 10) {
        rounded[i] = 0;

        if (i === 0) {
          rounded.unshift(0);
          i++;
        }
        rounded[i - 1]++;
      }
      i--;
    }
  }

  return rounded.concat(init(count - rounded.length, 0));
}

/**
 * Initialize an array with a certain length and initialize with values.
 * @param {number} length
 * @param {number} value
 * @return {Array}
 */
function init(length, value) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(value);
  }
  return arr;
}

module.exports = NumberFormatter;
