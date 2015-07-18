'use strict';

var BigNumber = require('decimal.js');
var isInteger = require('./number').isInteger;
var digits = require('./number').digits;
var memoize = require('./function').memoize;


/************************************* 
 *             Constants             *
 *************************************/

/**
 * Calculate BigNumber e
 * @param {number} precision
 * @returns {BigNumber} Returns e
 */
exports.e = memoize(function (precision) {
  var Big = BigNumber.constructor({precision: precision});

  return new Big(1).exp();
});

/**
 * Calculate BigNumber golden ratio, phi = (1+sqrt(5))/2
 * @param {number} precision
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
 * @param {number} precision
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
 * @param {number} precision
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
 * @param {boolean} reciprocal   is sec
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
 * @param {boolean} reciprocal   is csc
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
 * @param {boolean} reciprocal   is cot
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
 * @param {boolean} mode         sine function if true, cosine function if false
 * @param {boolean} reciprocal   is sec or csc
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
 * @param {boolean} reciprocal   is sec or csc
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
 * @param {number} mode          cosine function if 0, sine function if 1
 * @param {boolean} reciprocal   is sec or csc
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
 * @param {boolean} reciprocal   is cot
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
 * @param {boolean} mode         sinh function if true, cosh function if false
 * @param {boolean} reciprocal   is sech or csch
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
 * @param {boolean} reciprocal   is coth
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
 * @param {number} precision
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
 * @param {number} mode     sine function if 1, cosine function if 0
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
 * @param {number} precision
 * @param {number} mode
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
