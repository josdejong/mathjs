'use strict';

var BigNumber = require('../type/BigNumber');
var isNumber = require('./number').isNumber;
var digits = require('./number').digits;
var memoize = require('./function').memoize;

/**
 * Test whether value is a BigNumber
 * @param {*} value
 * @return {Boolean} isBigNumber
 */
exports.isBigNumber = function (value) {
  return (value instanceof BigNumber);
};


/************************************* 
 *             Constants             *
 *************************************/

/**
 * Calculate BigNumber e
 * @param {Number} precision
 * @returns {BigNumber} Returns e
 */
exports.e = memoize(function (precision) {
  var Big = BigNumber.constructor({precision: precision});

  return new Big(1).exp();
});

/**
 * Calculate BigNumber golden ratio, phi = (1+sqrt(5))/2
 * @param {Number} precision
 * @returns {BigNumber} Returns phi
 */
exports.phi = memoize(function (precision) {
  var Big = BigNumber.constructor({precision: precision});

  return new Big(1).plus(new Big(5).sqrt()).div(2);
});

/**
 * Calculate BigNumber pi.
 *
 * Uses Machin's formula: pi / 4 = 4 * arctan(1 / 5) - arctan(1 / 239)
 * http://milan.milanovic.org/math/english/pi/machin.html
 * @param {Number} precision
 * @returns {BigNumber} Returns pi
 */
exports.pi = memoize(function (precision) {
  // we calculate pi with a few decimal places extra to prevent round off issues
  var Big = BigNumber.constructor({precision: precision + 4});
  var pi4th = new Big(4).times(arctan_taylor(new Big(1).div(5)))
      .minus(arctan_taylor(new Big(1).div(239)));

  Big.config({precision: precision});

  // the final pi has the requested number of decimals
  return new Big(4).times(pi4th);
});

/**
 * Calculate BigNumber tau, tau = 2 * pi
 * @param {Number} precision
 * @returns {BigNumber} Returns tau
 */
exports.tau = memoize(function (precision) {
  // we calculate pi at a slightly higher precision than configured to prevent round off errors
  // when multiplying by two in the end

  var pi = exports.pi(precision + 2);

  var Big = BigNumber.constructor({precision: precision});

  return new Big(2).times(pi);
});


/*************************************
 *         Bitwise functions         *
 *************************************/

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

  var BigNumber = x.constructor;
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

  var BigNumber = x.constructor;
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

  var BigNumber = x.constructor;
  var prevPrec = BigNumber.precision;
  BigNumber.config({precision: 1E9});

  var x = x.plus(BigNumber.ONE);
  x.s = -x.s || null;

  BigNumber.config({precision: prevPrec});
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

  var BigNumber = x.constructor;
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

  var BigNumber = x.constructor;
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

  var BigNumber = x.constructor;
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

/* Applies bitwise function to numbers. */
function bitwise(x, y, func) {
  var BigNumber = x.constructor;

  var xBits, yBits;
  var xSign = +(x.s < 0);
  var ySign = +(y.s < 0);
  if (xSign) {
    xBits = decCoefficientToBinaryString(exports.not(x));
    for (var i = 0; i < xBits.length; ++i) {
      xBits[i] ^= 1;
    }
  } else {
    xBits = decCoefficientToBinaryString(x);
  }
  if (ySign) {
    yBits = decCoefficientToBinaryString(exports.not(y));
    for (var i = 0; i < yBits.length; ++i) {
      yBits[i] ^= 1;
    }
  } else {
    yBits = decCoefficientToBinaryString(y);
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
  var twoPower = BigNumber.ONE;
  var two = new BigNumber(2);

  var prevPrec = BigNumber.precision;
  BigNumber.config({precision: 1E9});

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

  BigNumber.config({precision: prevPrec});

  if (expFuncVal == 0) {
    outVal.s = -outVal.s;
  }
  return outVal;
}

/* Extracted from decimal.js, and edited to specialize. */
function decCoefficientToBinaryString(x) {
  // Convert to string
  var a = x.c;
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

  var xe = x.e;
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

  // Convert from base 10 (decimal) to base 2
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


/*************************************
 *      Trigonometric functions      *
 *************************************/

/**
 * Calculate the arccosine or arcsecant of x
 *
 * acos(x) = 2*atan(sqrt(1-x^2)/(1+x))
 *
 * asec(x) = acos(1/x)
 *
 * @param {BigNumber} x
 * @param {DecimalFactory} Big   current BigNumber constructor
 * @param {Boolean} reciprocal   is sec
 * @returns {BigNumber} arccosine or arcsecant of x
 */
exports.arccos_arcsec = function (x, Big, reciprocal) {
  var precision = Big.precision;
  if (reciprocal) {
    if (x.abs().lt(Big.ONE)) {
      throw new Error('asec() only has non-complex values for |x| >= 1.');
    }
  } else if (x.abs().gt(Big.ONE)) {
    throw new Error('acos() only has non-complex values for |x| <= 1.');
  }
  if (x.eq(-1)) {
    return exports.pi(precision);
  }

  Big.config({precision: precision + 4});

  if (reciprocal) {
    x = Big.ONE.div(x);
  }

  var acos = exports.arctan_arccot(Big.ONE.minus(x.times(x)).sqrt()
                                      .div(x.plus(Big.ONE)), Big).times(2);

  Big.config({precision: precision});
  return acos.toDP(precision - 1);
};

/**
 * Calculate the arcsine or arccosecant of x
 *
 * @param {BigNumber} x
 * @param {DecimalFactory} Big   current BigNumber constructor
 * @param {Boolean} reciprocal   is csc
 * @returns {BigNumber} arcsine or arccosecant of x
 */
exports.arcsin_arccsc = function (x, Big, reciprocal) {
  if (x.isNaN()) {
    return new Big(NaN);
  }

  var precision = Big.precision;
  var absX = x.abs();
  if (reciprocal) {
    if (absX.lt(Big.ONE)) {
      throw new Error('acsc() only has non-complex values for |x| >= 1.');
    }

    Big.config({precision: precision + 2});
    x = Big.ONE.div(x); 
    Big.config({precision: precision});

    absX = x.abs();
  } else if (absX.gt(Big.ONE)) {
    throw new Error('asin() only has non-complex values for |x| <= 1.');
  }

  // Get x below 0.58
  if (absX.gt(0.8)) {
    Big.config({precision: precision + 4});

    // arcsin(x) = sign(x)*(Pi/2 - arcsin(sqrt(1 - x^2)))
    var sign = x.s;
    var halfPi = exports.pi(precision + 4).div(2);
    x = halfPi.minus(exports.arcsin_arccsc(Big.ONE.minus(x.times(x)).sqrt(), Big));
    x.s = sign;

    x.constructor = Big;
    Big.config({precision: precision});
    return x.toDP(precision - 1);
  }
  var wasReduced = absX.gt(0.58);
  if (wasReduced) {
    Big.config({precision: precision + 8});

    // arcsin(x) = 2*arcsin(x / (sqrt(2)*sqrt(sqrt(1 - x^2) + 1)))
    x = x.div(new Big(2).sqrt().times(Big.ONE.minus(x.times(x)).sqrt()
          .plus(Big.ONE).sqrt()));

    Big.config({precision: precision});
  }

  // Avoid overhead of Newton's Method if feasible
  var ret = (precision <= 60 || ((x.dp() <= Math.log(precision)) && x.lt(0.05)))
    ? arcsin_taylor(x, precision)
    : arcsin_newton(x, Big);

  if (wasReduced) {
    return ret.times(2);
  }
  return ret;
};

/**
 * Calculate the arctangent or arccotangent of x
 *
 * @param {BigNumber} x
 * @param {DecimalFactory} Big   current BigNumber constructor
 * @param {Boolean} reciprocal   is cot
 * @returns {BigNumber} arctangent or arccotangent of x
 */
exports.arctan_arccot = function (x, Big, reciprocal) {
  if (x.isNaN()) {
    return new Big(NaN);
  }
  if ((!reciprocal && x.isZero()) || (reciprocal && !x.isFinite())) {
    return new Big(0);
  }

  var precision = Big.precision;
  if ((!reciprocal && !x.isFinite()) || (reciprocal && x.isZero())) {
    var halfPi = exports.pi(precision + 2).div(2).toDP(precision - 1);
    halfPi.constructor = Big;
    halfPi.s = x.s;

    return halfPi;
  }

  Big.config({precision: precision + 4});

  if (reciprocal) {
    x = Big.ONE.div(x);
  }

  var absX = x.abs();
  if (absX.lte(0.875)) {
    var ret = arctan_taylor(x);

    ret.constructor = Big;
    Big.config({precision: precision});
    return ret.toDP(Big.precision - 1);
  }
  if (absX.gte(1.143)) {
    // arctan(x) = sign(x)*((PI / 2) - arctan(1 / |x|))
    var halfPi = exports.pi(precision + 4).div(2);
    var ret = halfPi.minus(arctan_taylor(Big.ONE.div(absX)));
    ret.s = x.s;

    ret.constructor = Big;
    Big.config({precision: precision});
    return ret.toDP(Big.precision - 1);
  }

  // arctan(x) = arcsin(x / [sqrt(1 + x^2)])
  x = x.div(x.times(x).plus(1).sqrt());

  Big.config({precision: precision});
  return exports.arcsin_arccsc(x, Big);
};

/**
 * Calculate the arctangent of y, x
 *
 * @param {BigNumber} y
 * @param {BigNumber} x
 * @param {DecimalFactory} Big   current BigNumber constructor
 * @returns {BigNumber} arctangent of y, x
 */
exports.arctan2 = function (y, x, Big) {
  var precision = Big.precision;
  if (x.isZero()) {
    if (y.isZero()) {
      return new Big(NaN);
    }

    var halfPi = exports.pi(precision + 2).div(2).toDP(precision - 1);
    halfPi.constructor = Big;
    halfPi.s = y.s;

    return halfPi;
  }

  Big.config({precision: precision + 2});

  var ret = exports.arctan_arccot(y.div(x), Big, false);
  if (x.isNegative()) {
    var pi = exports.pi(precision + 2);
    ret = y.isNegative() ? ret.minus(pi) : ret.plus(pi);
  }

  ret.constructor = Big;
  Big.config({precision: precision});
  return ret.toDP(precision - 1);
};

/**
 * Calculate the hyperbolic arccosine, arcsine, arcsecant, or arccosecant of x
 *
 * acosh(x) = ln(x + sqrt(x^2 - 1))
 *
 * asinh(x) = ln(x + sqrt(x^2 + 1))
 *
 * asech(x) = acosh(1 / x)
 *
 * acsch(x) = asinh(1 / x)
 *
 * @param {BigNumber} x
 * @param {DecimalFactory} Big   current BigNumber constructor
 * @param {Boolean} mode         sine function if true, cosine function if false
 * @param {Boolean} reciprocal   is sec or csc
 * @returns {BigNumber} hyperbolic arccosine, arcsine, arcsecant, or arccosecant of x
 */
exports.acosh_asinh_asech_acsch = function (x, Big, mode, reciprocal) {
  if (x.isNaN()) {
    return new Big(NaN);
  }
  if (reciprocal && x.isZero()) {
    return new Big(Infinity);
  }
  if (!mode) {
    if (reciprocal) {
      if (x.isNegative() || x.gt(Big.ONE)) {
        throw new Error('asech() only has non-complex values for 0 <= x <= 1.');
      }
    } else if (x.lt(Big.ONE)) {
      throw new Error('acosh() only has non-complex values for x >= 1.');
    }
  }

  var precision = Big.precision;
  Big.config({precision: precision + 4});

  var y = new Big(x);
  y.constructor = Big;

  if (reciprocal) {
    y = Big.ONE.div(y);
  }

  var x2PlusOrMinus = (mode) ? y.times(y).plus(Big.ONE) : y.times(y).minus(Big.ONE);
  var ret = y.plus(x2PlusOrMinus.sqrt()).ln();

  Big.config({precision: precision});
  return new Big(ret.toPrecision(precision));
};

/**
 * Calculate the hyperbolic arctangent or arccotangent of x
 *
 * atanh(x) = ln((1 + x)/(1 - x)) / 2
 *
 * acoth(x) = atanh(1 / x)
 *
 * @param {BigNumber} x
 * @param {DecimalFactory} Big   current BigNumber constructor
 * @param {Boolean} reciprocal   is sec or csc
 * @returns {BigNumber} hyperbolic arctangent or arccotangent of x
 */
exports.atanh_acoth = function (x, Big, reciprocal) {
  if (x.isNaN()) {
    return new Big(NaN);
  }

  var absX = x.abs();
  if (absX.eq(Big.ONE)) {
    return new Big(x.isNegative() ? -Infinity : Infinity);
  }
  if (absX.gt(Big.ONE)) {
    if (!reciprocal) {
      throw new Error('atanh() only has non-complex values for |x| <= 1.');
    }
  } else if (reciprocal) {
    throw new Error('acoth() has complex values for |x| < 1.');
  }

  if (x.isZero()) {
    return new Big(0);
  }

  var precision = Big.precision;
  Big.config({precision: precision + 4});

  var y = new Big(x);
  y.constructor = Big;

  if (reciprocal) {
    y = Big.ONE.div(y);
  }
  var ret = Big.ONE.plus(y).div(Big.ONE.minus(y)).ln().div(2);

  Big.config({precision: precision});
  return new Big(ret.toPrecision(precision));
};

/**
 * Calculate the cosine/sine of x using the multiple angle identity:
 *
 * cos(4x) = 8[cos(x)^4 - cos(x)^2] + 1
 *
 * sin(5x) = 16sin(x)^5 - 20sin(x)^3 + 5sin(x)
 * http://www.tc.umn.edu/~ringx004/sidebar.html
 *
 * @param {BigNumber} x
 * @param {DecimalFactory} Big   current BigNumber constructor
 * @param {Number} mode          cosine function if 0, sine function if 1
 * @param {Boolean} reciprocal   is sec or csc
 * @returns {BigNumber} cosine, sine, secant, or cosecant of x
 */
exports.cos_sin_sec_csc = function (x, Big, mode, reciprocal) {
  if (x.isNaN() || !x.isFinite()) {
    return new Big(NaN);
  }
  var precision = Big.precision;

  // Avoid changing the original value
  var y = new Big(x);

  // sin(-x) == -sin(x), cos(-x) == cos(x)
  var isNeg = y.isNegative();
  if (isNeg) {
    y.s = -y.s;
  }

  // Apply ~log(precision) guard bits
  var precPlusGuardDigits = precision + (Math.log(precision) | 0) + 3;
  Big.config({precision: precPlusGuardDigits});

  y = reduceToPeriod(y, precPlusGuardDigits, mode);  // Make this destructive
  y[0].constructor = Big;
  if (y[1]) {
    y = y[0];
    if (reciprocal && y.isZero()) {
      y = new Big(Infinity);
    }

    Big.config({precision: precision});
    return y;
  }

  var ret;
  y = y[0];
  if (mode) {
    ret = cos_sin_taylor(y.div(3125), mode);
    Big.config({precision: Math.min(precPlusGuardDigits, precision + 15)});

    var five = new Big(5);
    var sixteen = new Big(16);
    var twenty = new Big(20);
    for (var i = 0; i < 5; ++i) {
      var ret2 = ret.times(ret);
      var ret3 = ret2.times(ret);
      var ret5 = ret3.times(ret2);
      ret = sixteen.times(ret5).minus(
              twenty.times(ret3)).plus(
                five.times(ret));
    }

    if (isNeg) {
      ret.s = -ret.s;
    }
  } else {
    var div_factor, loops;
    if (y.abs().lt(Big.ONE)) {
      div_factor = 64;
      loops = 3;
    } else {
      div_factor = 256;
      loops = 4;
    }

    ret = cos_sin_taylor(y.div(div_factor), mode);
    Big.config({precision: Math.min(precPlusGuardDigits, precision + 8)});

    var eight = new Big(8);
    for (; loops > 0; --loops) {
      var ret2 = ret.times(ret);
      var ret4 = ret2.times(ret2);
      ret = eight.times(ret4.minus(ret2)).plus(Big.ONE);
    }
  }

  if (reciprocal) {
    ret = (ret.e <= -precision)
      ? new Big(Infinity)
      : Big.ONE.div(ret);
  }

  Big.config({precision: precision});
  return ret.toDP(precision - 1);
};

/**
 * Calculate the tangent of x
 *
 * tan(x) = sin(x) / cos(x)
 *
 * cot(x) = cos(x) / sin(x)
 *
 * @param {BigNumber} x
 * @param {DecimalFactory} Big   current BigNumber constructor
 * @param {Boolean} reciprocal   is cot
 * @returns {BigNumber} tangent or cotangent of x
 */
exports.tan_cot = function (x, Big, reciprocal) {
  if (x.isNaN()) {
    return new Big(NaN);
  }

  var precision = Big.precision;
  var pi = exports.pi(precision + 2);
  var halfPi = pi.div(2).toDP(precision - 1);
  pi = pi.toDP(precision - 1);

  var y = reduceToPeriod(x, precision, 1)[0];
  if (y.abs().eq(pi)) {
    return new Big(Infinity);
  }

  Big.config({precision: precision + 4});
  var sin = exports.cos_sin_sec_csc(y, Big, 1, false);
  var cos = sinToCos(sin);

  sin = sin.toDP(precision);
  cos = cos.toDP(precision);

  // Make sure sign for cosine is correct
  if (y.eq(x)) {
    if (y.gt(halfPi)) {
      cos.s = -cos.s;
    }
  } else if (pi.minus(y.abs()).gt(halfPi)) {
    cos.s = -cos.s;
  }

  var tan = (reciprocal) ? cos.div(sin) : sin.div(cos);

  Big.config({precision: precision});
  return new Big(tan.toPrecision(precision));
};

/**
 * Calculate the hyperbolic sine, cosine, secant, or cosecant of x
 *
 * cosh(x) = (exp(x) + exp(-x)) / 2
 *         = (e^x + 1/e^x) / 2
 *
 * sinh(x) = (exp(x) - exp(-x)) / 2
 *         = (e^x - 1/e^x) / 2
 *
 * sech(x) = 2 / (exp(x) + exp(-x))
 *         = 2 / (e^x + 1/e^x)
 *
 * csch(x) = 2 / (exp(x) - exp(-x))
 *         = 2 / (e^x - 1/e^x)
 *
 * @param {BigNumber} x
 * @param {DecimalFactory} Big   current BigNumber constructor
 * @param {Boolean} mode         sinh function if true, cosh function if false
 * @param {Boolean} reciprocal   is sech or csch
 * @returns {BigNumber} hyperbolic cosine, sine, secant. or cosecant of x
 */
exports.cosh_sinh_csch_sech = function (x, Big, mode, reciprocal) {
  if (x.isNaN()) {
    return new Big(NaN);
  }
  if (!x.isFinite()) {
    if (reciprocal) {
      return new Big(0);
    }
    return new Big((mode) ? x : Infinity);
  }

  var precision = Big.precision;
  Big.config({precision: precision + 4});

  var y = new Big(x);
  y.constructor = Big;

  y = y.exp();
  y = (mode) ? y.minus(Big.ONE.div(y)) : y.plus(Big.ONE.div(y));
  y = (reciprocal) ? new Big(2).div(y) : y.div(2);

  Big.config({precision: precision});
  return new Big(y.toPrecision(precision));
};

/**
 * Calculate the hyperbolic tangent of x
 *
 * tanh(x) = (exp(x) + exp(-x)) / (exp(x) - exp(-x))
 *         = (exp(2x) - 1) / (exp(2x) + 1)
 *         = (e^x - 1/e^x) / (e^x + 1/e^x)
 *
 * coth(x) = (exp(x) - exp(-x)) / (exp(x) + exp(-x))
 *         = (exp(2x) + 1) / (exp(2x) - 1)
 *         = (e^x + 1/e^x) / (e^x - 1/e^x)
 *
 * @param {BigNumber} x
 * @param {DecimalFactory} Big   current BigNumber constructor
 * @param {Boolean} reciprocal   is coth
 * @returns {BigNumber} hyperbolic tangent or cotangent of x
 */
exports.tanh_coth = function (x, Big, reciprocal) {
  if (x.isNaN()) {
    return new Big(NaN);
  }
  if (!x.isFinite()) {
    return new Big(x.s);
  }

  var precision = Big.precision;
  Big.config({precision: precision + 4});

  var y = new Big(x);
  y.constructor = Big;

  var posExp = y.exp();
  var negExp = Big.ONE.div(posExp);
  var ret = posExp.minus(negExp);
  ret = (reciprocal) ? posExp.plus(negExp).div(ret) : ret.div(posExp.plus(negExp));

  Big.config({precision: precision});
  return ret.toDP(precision - 1);
};

/**
 * Calculate the arc sine of x using Newton's method
 *
 * f(x) = sin(x) = N  =>  f(x)  = sin(x) - N
 *                        f'(x) = cos(x)
 *
 * Thus we solve each step as follows:
 *     x_(i+1) = x_i - (sin(x_i) - N)/cos(x_i)
 *
 * @param {BigNumber} x
 * @param {DecimalFactory} Big   current BigNumber constructor
 * @returns {BigNumber} arc sine of x
 */
function arcsin_newton(x, Big) {
  var oldPrecision = Big.precision;

  // Calibration variables, adjusted from MAPM
  var tolerance = -(oldPrecision + 4);
  var maxp = oldPrecision + 8 - x.e;
  var localPrecision = 25 - x.e;
  var maxIter = Math.max(Math.log(oldPrecision + 2) * 1.442695 | 0 + 5, 5);
  Big.config({precision: localPrecision});

  var i = 0;
  var curr = new Big(Math.asin(x.toNumber()) + '');
  do {
    var tmp0 = exports.cos_sin_sec_csc(curr, Big, 1, false);
    var tmp1 = sinToCos(tmp0);
    if (!tmp0.isZero()) {
      tmp0.s = curr.s;
    }

    var tmp2 = tmp0.minus(x).div(tmp1);
    curr = curr.minus(tmp2);

    localPrecision = Math.min(2*localPrecision, maxp);
    Big.config({precision: localPrecision});
  } while ((2*tmp2.e >= tolerance) && !tmp2.isZero() && (++i <= maxIter))

  if (i == maxIter) {
    throw new Error('asin() failed to converge to the requested accuracy.' +
                    'Try with a higher precision.');
  }

  Big.config({precision: oldPrecision});
  return curr.toDP(oldPrecision - 1);
}

/**
 * Calculate the arc sine of x
 *
 * arcsin(x) = x + (1/2)*x^3/3 + (3/8)*x^5/5 + (15/48)*x^7/7 ...
 *           = x + (1/2)*x^2*x^1/3 + [(1*3)/(2*4)]*x^2*x^3/5 + [(1*3*5)/(2*4*6)]*x^2*x^5/7 ...
 *
 * @param {BigNumber} x
 * @param {Number} precision
 * @returns {BigNumber} arc sine of x
 */
function arcsin_taylor(x, precision) {
  var Big = x.constructor;
  Big.config({precision: precision + Math.log(precision) | 0 + 4});

  var one = new Big(1);
  var y = x;
  var yPrev = NaN;
  var x2 = x.times(x);
  var polyNum = x;
  var constNum = new Big(one);
  var constDen = new Big(one);

  var bigK = new Big(one); 
  for (var k = 3; !y.equals(yPrev); k += 2) {
    polyNum = polyNum.times(x2);

    constNum = constNum.times(bigK);
    constDen = constDen.times(bigK.plus(one));

    yPrev = y;
    bigK = new Big(k);
    y = y.plus(polyNum.times(constNum).div(bigK.times(constDen)));
  }

  Big.config({precision: precision});
  return y.toDP(precision - 1);
}

/**
 * Calculate the arc tangent of x using a Taylor expansion
 *
 * arctan(x) = x - x^3/3 + x^5/5 - x^7/7 + x^9/9 - ...
 *           = x - x^2*x^1/3 + x^2*x^3/5 - x^2*x^5/7 + x^2*x^7/9 - ...
 *
 * @param {BigNumber} x
 * @returns {BigNumber} arc tangent of x
 */
function arctan_taylor(x) {
  var y = x;
  var yPrev = NaN;
  var x2 = x.times(x);
  var num = x;
  var add = true;

  for (var k = 3; !y.equals(yPrev); k += 2) {
    num = num.times(x2);

    yPrev = y;
    add = !add;
    y = (add) ? y.plus(num.div(k)) : y.minus(num.div(k));
  }

  return y;
}

/**
 * Calculate the cosine or sine of x using Taylor Series.
 *
 * cos(x) = 1 - x^2/2! + x^4/4! - x^6/6! + x^8/8! - ...
 *        = 1 - 1*x^2/2! + x^2*x^2/4! - x^2*x^4/6! + x^2*x^6/8! - ...
 *
 * sin(x) = x - x^3/3! + x^5/5! - x^7/7! + x^9/9! - ...
 *        = x - x^2*x^1/3! + x^2*x^3/5! - x^2*x^5/7! + x^2*x^7/9! - ...
 *
 * @param {BigNumber} x     reduced argument
 * @param {Number} mode     sine function if 1, cosine function if 0
 * @returns {BigNumber} sine or cosine of x
 */
function cos_sin_taylor(x, mode) {
  var one = x.constructor.ONE;

  var y = x;
  var yPrev = NaN;
  var x2 = x.times(x);
  var num = (mode) ? y : y = one;
  var den = one;
  var add = true;

  for (var k = mode; !y.equals(yPrev); k += 2) {
    num = num.times(x2);
    den = den.times(k+1).times(k+2);

    yPrev = y;
    add = !add;
    y = (add) ? y.plus(num.div(den)) : y.minus(num.div(den));
  }

  return y;
}

/**
 * Reduce x within a period of pi (0, pi] with guard digits.
 *
 * @param {BigNumber} x
 * @param {Number} precision
 * @param {Number} mode
 * @returns {Array} [Reduced x, is tau multiple?]
 */
function reduceToPeriod(x, precision, mode) {
  var pi = exports.pi(precision + 2);
  var tau = exports.tau(precision);
  if (x.abs().lte(pi.toDP(x.dp()))) {
    return [x, false];
  }

  var Big = x.constructor;
  // Catch if input is tau multiple using pi's precision
  if (x.div(pi.toDP(x.dp())).toNumber() % 2 == 0) {
    return [new Big(mode ^ 1), true];
  }

  var y = x.mod(tau);

  // Catch if tau multiple with tau's precision
  if (y.toDP(x.dp(), 1).isZero()) {
    return [new Big(mode ^ 1), true];
  }

  if (y.gt(pi)) {
    if (mode) {
      // sin(x + pi) = -sin(x)
      y = y.minus(pi);
      y.s = -y.s;
    } else {
      // cos(x) = cos(tau - x)
      y = tau.minus(y);
    }
  }

  y.constructor = Big;
  return [y, false];
}

/**
 * Convert from sine to cosine
 *
 * |cos(x)| = sqrt(1 - sin(x)^2)
 *
 * @param {BigNumber} sine of x
 * @returns {BigNumber} sine as cosine
 */
function sinToCos(sinVal) {
  var Big = sinVal.constructor;
  var precision = Big.precision;
  Big.config({precision: precision + 2});

  var ret = Big.ONE.minus(sinVal.times(sinVal)).sqrt();

  Big.config({precision: precision});
  return ret.toDP(precision - 1);
}


/************************************
 *         Format functions         *
 ************************************/

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
