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
      .split('')
      .map(function (d) {
        return parseInt(d);
      });

  if (this.coefficients.length === 0) {
    this.coefficients.push(0);
    exponent++;
  }

  this.exponent = exponent;
}


/**
 * Format a number with engineering notation.
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
NumberFormatter.prototype.toEngineering = function(precision) {
  var rounded = this.roundDigits(precision);

  var e = rounded.exponent;
  var c = rounded.coefficients;

  // find nearest lower multiple of 3 for exponent
  var newExp = e % 3 === 0 ? e : (e < 0 ? (e - 3) - (e % 3) : e - (e % 3));

  // concatenate coefficients with necessary zeros
  var significandsDiff = e >= 0 ? e : Math.abs(newExp);

  // add zeros if necessary (for ex: 1e+8)
  if (c.length - 1 < significandsDiff) c = c.concat(zeros(significandsDiff - (c.length - 1)));

  // find difference in exponents
  var expDiff = Math.abs(e - newExp);

  var decimalIdx = 1;
  var str = '';

  // push decimal index over by expDiff times
  while (--expDiff >= 0) decimalIdx++;

  // if all coefficient values are zero after the decimal point, don't add a decimal value. 
  // otherwise concat with the rest of the coefficients
  var decimals = c.slice(decimalIdx).join('');
  var decimalVal = decimals.match(/[1-9]/) ? ('.' + decimals) : '';

  str = c.slice(0, decimalIdx).join('') + decimalVal;

  str += 'e' + (e >= 0 ? '+' : '') + newExp.toString();
  return rounded.sign + str;
}

/**
 * Format a number with fixed notation.
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
NumberFormatter.prototype.toFixed = function (precision) {
  var rounded = this.roundDigits(this.exponent + 1 + (precision || 0));
  var c = rounded.coefficients;
  var p = rounded.exponent + 1; // exponent may have changed

  // append zeros if needed
  var pp = p + (precision || 0);
  if (c.length < pp) {
    c = c.concat(zeros(pp - c.length));
  }

  // prepend zeros if needed
  if (p < 0) {
    c = zeros(-p + 1).concat(c);
    p = 1;
  }

  // insert a dot if needed
  if (precision) {
    c.splice(p, 0, (p === 0) ? '0.' : '.');
  }

  return this.sign + c.join('');
};

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 */
NumberFormatter.prototype.toExponential = function (precision) {
  // round if needed, else create a clone
  var rounded = precision ? this.roundDigits(precision) : this.clone();
  var c = rounded.coefficients;
  var e = rounded.exponent;

  // append zeros if needed
  if (c.length < precision) {
    c = c.concat(zeros(precision - c.length));
  }

  // format as `C.CCCe+EEE` or `C.CCCe-EEE`
  var first = c.shift();
  return this.sign + first + (c.length > 0 ? ('.' + c.join('')) : '') +
      'e' + (e >= 0 ? '+' : '') + e;
};

/**
 * Format a number with a certain precision
 * @param {number} [precision=undefined] Optional number of digits.
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
    var rounded = precision ? this.roundDigits(precision) : this.clone();
    var c = rounded.coefficients;
    var e = rounded.exponent;

    // append trailing zeros
    if (c.length < precision) {
      c = c.concat(zeros(precision - c.length));
    }

    // append trailing zeros
    // TODO: simplify the next statement
    c = c.concat(zeros(e - c.length + 1 +
        (c.length < precision ? precision - c.length : 0)));

    // prepend zeros
    c = zeros(-e).concat(c);

    var dot = e > 0 ? e : 0;
    if (dot < c.length - 1) {
      c.splice(dot + 1, 0, '.');
    }

    return this.sign + c.join('');
  }
};

/**
 * Crete a clone of the NumberFormatter
 * @return {NumberFormatter} Returns a clone of the NumberFormatter
 */
NumberFormatter.prototype.clone = function () {
  var clone = new NumberFormatter('0');
  clone.sign = this.sign;
  clone.coefficients = this.coefficients.slice(0);
  clone.exponent = this.exponent;
  return clone;
};

/**
 * Round the number of digits of a number *
 * @param {number} precision  A positive integer
 * @return {NumberFormatter}  Returns a new NumberFormatter with the rounded
 *                            digits
 */
NumberFormatter.prototype.roundDigits = function (precision) {
  var rounded = this.clone();
  var c = rounded.coefficients;

  // prepend zeros if needed
  while (precision <= 0) {
    c.unshift(0);
    rounded.exponent++;
    precision++;
  }

  if (c.length > precision) {
    var removed = c.splice(precision, c.length - precision);

    if (removed[0] >= 5) {
      var i = precision - 1;
      c[i]++;
      while (c[i] === 10) {
        c.pop();
        if (i === 0) {
          c.unshift(0);
          rounded.exponent++;
          i++;
        }
        i--;
        c[i]++;
      }
    }
  }

  return rounded;
};

/**
 * Create an array filled with zeros.
 * @param {number} length
 * @return {Array}
 */
function zeros(length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(0);
  }
  return arr;
}

module.exports = NumberFormatter;
