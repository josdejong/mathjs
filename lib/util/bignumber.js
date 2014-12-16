'use strict';

var BigNumber = require('decimal.js');
var isNumber = require('./number').isNumber;
var digits = require('./number').digits;

/**
 * Test whether value is a BigNumber
 * @param {*} value
 * @return {Boolean} isBigNumber
 */
exports.isBigNumber = function (value) {
  return (value instanceof BigNumber);
};


/* BigNumber constants. */


/**
 * Calculate BigNumber e
 * @param {Number} precision
 * @returns {BigNumber} Returns e
 */
exports.e = function (precision) {
  var Big = BigNumber.constructor({precision: precision});

  return new Big(1).exp();
};

/**
 * Calculate BigNumber golden ratio, phi = (1+sqrt(5))/2
 * @param {Number} precision
 * @returns {BigNumber} Returns phi
 */
exports.phi = function (precision) {
  var Big = BigNumber.constructor({precision: precision});

  return new Big(1).plus(new Big(5).sqrt()).div(2);
};

/**
 * Calculate the arc tangent of x
 *
 * arctan(x) = x - x^3/3 + x^5/5 - x^7/7 + x^9/9 - ...
 *           = x - x^2*x^1/3 + x^2*x^3/5 - x^2*x^5/7 + x^2*x^7/9 - ...
 *
 * @param {BigNumber} x
 * @returns {BigNumber} arc tangent of x
 */
exports.arctan = function (x) {
  var y = x;
  var yPrev = NaN;
  var x2 = x.times(x);
  var num = x;
  var sign = -1;

  for (var k = 3; !y.equals(yPrev); k += 2) {
    num = num.times(x2);

    yPrev = y;
    y = (sign > 0) ? y.plus(num.div(k)) : y.minus(num.div(k));
    sign = -sign;
  }

  return y;
};

/**
 * Calculate BigNumber pi.
 *
 * Uses Machin's formula: pi / 4 = 4 * arctan(1 / 5) - arctan(1 / 239)
 * http://milan.milanovic.org/math/english/pi/machin.html
 * @param {Number} precision
 * @returns {BigNumber} Returns pi
 */
exports.pi = function (precision) {
  // we calculate pi with a few decimal places extra to prevent round off issues
  var Big = BigNumber.constructor({precision: precision + 4});
  var pi4th = new Big(4).times(exports.arctan(new Big(1).div(5)))
      .minus(exports.arctan(new Big(1).div(239)));

  Big.config({precision: precision});

  // the final pi has the requested number of decimals
  return new Big(4).times(pi4th);
};

/**
 * Calculate BigNumber tau, tau = 2 * pi
 * @param {Number} precision
 * @returns {BigNumber} Returns tau
 */
exports.tau = function (precision) {
  // we calculate pi at a slightly higher precision than configured to prevent round off errors
  // when multiplying by two in the end

  var pi = exports.pi(precision + 2);

  var Big = BigNumber.constructor({precision: precision});

  return new Big(2).times(pi);
};


/* BigNumber functions. */


/*
 * Special Cases:
 *   N &  n =  N
 *   n &  0 =  0
 *   n & -1 =  n
 *   n &  n =  n
 *   I &  I =  I
 *  -I & -I = -I
 *   I & -I =  0
 *   I &  n =  n
 *   I & -n =  I
 *  -I &  n =  0
 *  -I & -n = -I
 *
 * @param {BigNumber} value
 * @param {BigNumber} value
 * @return {BigNumber} Result of `x` & `y`, is fully precise
 *
 */
exports.and = function(x, y) {
  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
    throw new Error('Parameters in function bitAnd must be integer numbers');
  }

  var BigNumber = x['constructor'];
  if (x.isNaN() || y.isNaN()) {
    return new BigNumber(NaN);
  }

  if (x.isZero() || y.eq(-1) || x.eq(y)) {
    return x;
  }
  if (y.isZero() || x.eq(-1)) {
    return y;
  }

  if (!x.isFinite() || !y.isFinite()) {
    if (!x.isFinite() && !y.isFinite()) {
      if (x.isNegative() == y.isNegtive()) {
        return x;
      }
      return new BigNumber(0);
    }
    if (!x.isFinite()) {
      if (y.isNegative()) {
        return x;
      }
      if (x.isNegative()) {
        return new BigNumber(0);
      }
      return y;
    }
    if (!y.isFinite()) {
      if (x.isNegative()) {
        return y;
      }
      if (y.isNegative()) {
        return new BigNumber(0);
      }
      return x;
    }
  }
  return bitwise(x, y, function (a, b) { return a & b });
};

/*
 * Special Cases:
 *  n << -n = N
 *  n <<  N = N
 *  N <<  n = N
 *  n <<  0 = n
 *  0 <<  n = 0
 *  I <<  I = N
 *  I <<  n = I
 *  n <<  I = I
 *
 * @param {BigNumber} value
 * @param {BigNumber} value
 * @return {BigNumber} Result of `x` << `y`
 *
 */
exports.leftShift = function (x, y) {
  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
    throw new Error('Parameters in function leftShift must be integer numbers');
  }

  var BigNumber = x['constructor'];
  if (x.isNaN() || y.isNaN() || (y.isNegative() && !y.isZero())) {
    return new BigNumber(NaN);
  }
  if (x.isZero() || y.isZero()) {
    return x;
  }
  if (!x.isFinite() && !y.isFinite()) {
    return new BigNumber(NaN);
  }

  // Math.pow(2, y) is fully precise for y < 55, and fast
  if (y.lt(55)) {
    return x.times(Math.pow(2, y.toNumber()) + '');
  }
  return x.times(new BigNumber(2).pow(y));
};

/*
 * @param {BigNumber} value
 * @return {BigNumber} Result of ~`x`, fully precise
 *
 */
exports.not = function (x) {
  if (x.isFinite() && !x.isInteger()) {
    throw new Error('Parameter in function bitNot must be integer numbers');
  }

  var BigNumber = x['constructor'];
  var prevPrec = BigNumber['precision'];
  BigNumber['precision'] = 1E9;

  var x = x.plus(BigNumber['ONE']);
  x['s'] = -x['s'] || null;

  BigNumber['precision'] = prevPrec;
  return x;
};

/*
 * Special Cases:
 *   N |  n =  N
 *   n |  0 =  n
 *   n | -1 = -1
 *   n |  n =  n
 *   I |  I =  I
 *  -I | -I = -I
 *   I | -n = -1
 *   I | -I = -1
 *   I |  n =  I
 *  -I |  n = -I
 *  -I | -n = -n
 *
 * @param {BigNumber} value
 * @param {BigNumber} value
 * @return {BigNumber} Result of `x` | `y`, fully precise
 *
 */
exports.or = function (x, y) {
  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
    throw new Error('Parameters in function bitOr must be integer numbers');
  }

  var BigNumber = x['constructor'];
  if (x.isNaN() || y.isNaN()) {
    return new BigNumber(NaN);
  }

  var negOne = new BigNumber(-1);
  if (x.isZero() || y.eq(negOne) || x.eq(y)) {
    return y;
  }
  if (y.isZero() || x.eq(negOne)) {
    return x;
  }

  if (!x.isFinite() || !y.isFinite()) {
    if ((!x.isFinite() && !x.isNegative() && y.isNegative()) ||
           (x.isNegative() && !y.isNegative() && !y.isFinite())) {
        return negOne;
    }
    if (x.isNegative() && y.isNegative()) {
        return x.isFinite() ? x : y;
    }
    return x.isFinite() ? y : x;
  }
  return bitwise(x, y, function (a, b) { return a | b });
};

/*
 * Special Cases:
 *   n >> -n =  N
 *   n >>  N =  N
 *   N >>  n =  N
 *   I >>  I =  N
 *   n >>  0 =  n
 *   I >>  n =  I
 *  -I >>  n = -I
 *  -I >>  I = -I
 *   n >>  I =  I
 *  -n >>  I = -1
 *   0 >>  n =  0
 *
 * @param {BigNumber} value
 * @param {BigNumber} value
 * @return {BigNumber} Result of `x` >> `y`
 *
 */
exports.rightShift = function (x, y) {
  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
    throw new Error('Parameters in function rightArithShift must be integer numbers');
  }

  var BigNumber = x['constructor'];
  if (x.isNaN() || y.isNaN() || (y.isNegative() && !y.isZero())) {
    return new BigNumber(NaN);
  }
  if (x.isZero() || y.isZero()) {
    return x;
  }
  if (!y.isFinite()) {
    if (x.isNegative()) {
      return new BigNumber(-1);
    }
    if (!x.isFinite()) {
      return new BigNumber(NaN);
    }
    return new BigNumber(0);
  }

  // Math.pow(2, y) is fully precise for y < 55, and fast
  if (y.lt(55)) {
    return x.div(Math.pow(2, y.toNumber()) + '').floor();
  }
  return x.div(new BigNumber(2).pow(y)).floor();
};

/*
 * Special Cases:
 *   N ^  n =  N
 *   n ^  0 =  n
 *   n ^  n =  0
 *   n ^ -1 = ~n
 *   I ^  n =  I
 *   I ^ -n = -I
 *   I ^ -I = -1
 *  -I ^  n = -I
 *  -I ^ -n =  I
 *
 * @param {BigNumber} value
 * @param {BigNumber} value
 * @return {BigNumber} Result of `x` ^ `y`, fully precise
 *
 */
exports.xor = function (x, y) {
  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
    throw new Error('Parameters in function bitXor must be integer numbers');
  }

  var BigNumber = x['constructor'];
  if (x.isNaN() || y.isNaN()) {
    return new BigNumber(NaN);
  }
  if (x.isZero()) {
    return y;
  }
  if (y.isZero()) {
    return x;
  }

  if (x.eq(y)) {
    return new BigNumber(0);
  }

  var negOne = new BigNumber(-1);
  if (x.eq(negOne)) {
    return exports.not(y);
  }
  if (y.eq(negOne)) {
    return exports.not(x);
  }

  if (!x.isFinite() || !y.isFinite()) {
    if (!x.isFinite() && !y.isFinite()) {
      return negOne;
    }
    return new BigNumber(x.isNegative() == y.isNegative()
      ?  Infinity
      : -Infinity);
  }
  return bitwise(x, y, function (a, b) { return a ^ b });
};


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
 *    {Number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {String} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'exponential'    Always use exponential notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lower` and `upper` bounds, and uses
 *                                          exponential notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                     {Number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'exponential' and
 *                                          'auto', `precision` defines the total
 *                                          number of significant digits returned
 *                                          and is undefined by default.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point, and is 0 by default.
 *                     {Object} exponential An object containing two parameters,
 *                                          {Number} lower and {Number} upper,
 *                                          used by notation 'auto' to determine
 *                                          when to return exponential notation.
 *                                          Default values are `lower=1e-3` and
 *                                          `upper=1e5`.
 *                                          Only applicable for notation `auto`.
 *    {Function} fn    A custom formatting function. Can be used to override the
 *                     built-in notations. Function `fn` is called with `value` as
 *                     parameter and must return a string. Is useful for example to
 *                     format all values inside a matrix in a particular way.
 *
 * Examples:
 *
 *    format(6.4);                                        // '6.4'
 *    format(1240000);                                    // '1.24e6'
 *    format(1/3);                                        // '0.3333333333333333'
 *    format(1/3, 3);                                     // '0.333'
 *    format(21385, 2);                                   // '21000'
 *    format(12.071, {notation: 'fixed'});                // '12'
 *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
 *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
 *
 * @param {BigNumber} value
 * @param {Object | Function | Number} [options]
 * @return {String} str The formatted value
 */
exports.format = function(value, options) {
  if (typeof options === 'function') {
    // handle format(value, fn)
    return options(value);
  }

  // handle special cases
  if (!value.isFinite()) {
    return value.isNaN() ? 'NaN' : (value.gt(0) ? 'Infinity' : '-Infinity');
  }

  // default values for options
  var notation = 'auto';
  var precision = undefined;

  if (options !== undefined) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation;
    }

    // determine precision from options
    if (isNumber(options)) {
      precision = options;
    }
    else if (options.precision) {
      precision = options.precision;
    }
  }

  // handle the various notations
  switch (notation) {
    case 'fixed':
      return exports.toFixed(value, precision);

    case 'exponential':
      return exports.toExponential(value, precision);

    case 'auto':
      // determine lower and upper bound for exponential notation.
        // TODO: implement support for upper and lower to be BigNumbers themselves
      var lower = 1e-3;
      var upper = 1e5;
      if (options && options.exponential) {
        if (options.exponential.lower !== undefined) {
          lower = options.exponential.lower;
        }
        if (options.exponential.upper !== undefined) {
          upper = options.exponential.upper;
        }
      }

      // adjust the configuration of the BigNumber constructor (yeah, this is quite tricky...)
      var oldConfig = {
        toExpNeg: value.constructor.toExpNeg,
        toExpPos: value.constructor.toExpPos
      };

      value.constructor.config({
        toExpNeg: Math.round(Math.log(lower) / Math.LN10),
        toExpPos: Math.round(Math.log(upper) / Math.LN10)
      });

      // handle special case zero
      if (value.isZero()) return '0';

      // determine whether or not to output exponential notation
      var str;
      var abs = value.abs();
      if (abs.gte(lower) && abs.lt(upper)) {
        // normal number notation
        str = value.toSignificantDigits(precision).toFixed();
      }
      else {
        // exponential notation
        str = exports.toExponential(value, precision);
      }

      // remove trailing zeros after the decimal point
      return str.replace(/((\.\d*?)(0+))($|e)/, function () {
        var digits = arguments[2];
        var e = arguments[4];
        return (digits !== '.') ? digits + e : e;
      });

    default:
      throw new Error('Unknown notation "' + notation + '". ' +
          'Choose "auto", "exponential", or "fixed".');
  }
};

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {BigNumber} value
 * @param {Number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */
exports.toExponential = function(value, precision) {
  if (precision !== undefined) {
    return value.toExponential(precision - 1); // Note the offset of one
  }
  else {
    return value.toExponential();
  }
};

/**
 * Format a number with fixed notation.
 * @param {BigNumber} value
 * @param {Number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
exports.toFixed = function(value, precision) {
  return value.toFixed(precision || 0);
  // Note: the (precision || 0) is needed as the toFixed of BigNumber has an
  // undefined default precision instead of 0.
};


/* Private functions. */


function bitwise(x, y, func) {
  var BigNumber = x['constructor'];

  var xBits, yBits;
  var xSign = +(x['s'] < 0);
  var ySign = +(y['s'] < 0);
  if (xSign) {
    xBits = decToBinary(coefficientToString(exports.not(x)));
    for (var i = 0; i < xBits.length; ++i) {
      xBits[i] ^= 1;
    }
  } else {
    xBits = decToBinary(coefficientToString(x));
  }
  if (ySign) {
    yBits = decToBinary(coefficientToString(exports.not(y)));
    for (var i = 0; i < yBits.length; ++i) {
      yBits[i] ^= 1;
    }
  } else {
    yBits = decToBinary(coefficientToString(y));
  }

  var minBits, maxBits, minSign;
  if (xBits.length <= yBits.length) {
    minBits = xBits;
    maxBits = yBits;
    minSign = xSign;
  } else {
    minBits = yBits;
    maxBits = xBits;
    minSign = ySign;
  }

  var shortLen = minBits.length;
  var longLen = maxBits.length;
  var expFuncVal = func(xSign, ySign) ^ 1;
  var outVal = new BigNumber(expFuncVal ^ 1);
  var twoPower = BigNumber['ONE'];
  var two = new BigNumber(2);

  var prevPrec = BigNumber['precision'];
  BigNumber['precision'] = 1E9;

  while (shortLen > 0) {
    if (func(minBits[--shortLen], maxBits[--longLen]) == expFuncVal) {
      outVal = outVal.plus(twoPower);
    }
    twoPower = twoPower.times(two);
  }
  while (longLen > 0) {
    if (func(minSign, maxBits[--longLen]) == expFuncVal) {
      outVal = outVal.plus(twoPower);
    }
    twoPower = twoPower.times(two);
  }

  BigNumber['precision'] = prevPrec;

  if (expFuncVal == 0) {
    outVal['s'] = -outVal['s'];
  }
  return outVal;
}


/* Private functions extracted from decimal.js, and edited to specialize. */


function coefficientToString(x) {
  var a = x['c'];
  var r = a[0] + '';

  for (var i = 1; i < a.length; ++i) {
    var s = a[i] + '';
    for (var z = 7 - s.length; z--; ) {
      s = '0' + s;
    }

    r += s;
  }

  var j;
  for (j = r.length - 1; r.charAt(j) == '0'; --j);

  var xe = x['e'];
  var str = r.slice(0, j + 1 || 1);
  var strL = str.length;
  if (xe > 0) {
    if (++xe > strL) {
      // Append zeros.
      for (xe -= strL; xe--; str += '0');
    } else if (xe < strL) {
      str = str.slice(0, xe) + '.' + str.slice(xe);
    }
  }
  return str;
}

function decToBinary(str) {
  var arr = [0];
  for (var i = 0; i < str.length; ) {
    for (var arrL = arr.length; arrL--; arr[arrL] *= 10);

    arr[0] += str.charAt(i++) << 0;  // convert to int
    for (var j = 0; j < arr.length; ++j) {
      if (arr[j] > 1) {
        if (arr[j + 1] == null) {
          arr[j + 1] = 0;
        }

        arr[j + 1] += arr[j] >> 1;
        arr[j] &= 1;
      }
    }
  }

  return arr.reverse();
}
