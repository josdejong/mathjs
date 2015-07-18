'use strict';

var util = require('../util/index'),
    Unit = require('./Unit'),
    number = util.number,

    isNumber = util.number.isNumber,
    isUnit = Unit.isUnit,
    isString = util.string.isString;

/**
 * @constructor Complex
 *
 * A complex value can be constructed in the following ways:
 *     var a = new Complex();
 *     var b = new Complex(re, im);
 *     var c = Complex.parse(str);
 *
 * Example usage:
 *     var a = new Complex(3, -4);      // 3 - 4i
 *     a.re = 5;                        // a = 5 - 4i
 *     var i = a.im;                    // -4;
 *     var b = Complex.parse('2 + 6i'); // 2 + 6i
 *     var c = new Complex();           // 0 + 0i
 *     var d = math.add(a, b);          // 5 + 2i
 *
 * @param {Number} re       The real part of the complex value
 * @param {Number} [im]     The imaginary part of the complex value
 */
function Complex(re, im) {
  if (!(this instanceof Complex)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  switch (arguments.length) {
    case 0:
      this.re = 0;
      this.im = 0;
      break;

    case 1:
      var arg = arguments[0];
      if (typeof arg === 'object') {
        if('re' in arg && 'im' in arg) {
          var construct = new Complex(arg.re, arg.im); // pass on input validation
          this.re = construct.re;
          this.im = construct.im;
          break;
        } else if ('r' in arg && 'phi' in arg) {
          var construct = Complex.fromPolar(arg.r, arg.phi);
          this.re = construct.re;
          this.im = construct.im;
          break;
        }
      }
      throw new SyntaxError('Object with the re and im or r and phi properties expected.');

    case 2:
      if (!isNumber(re) || !isNumber(im)) {
        throw new TypeError('Two numbers expected in Complex constructor');
      }
      this.re = re;
      this.im = im;
      break;

    default:
      throw new SyntaxError('One, two or three arguments expected in Complex constructor');
  }
}

/**
 * Test whether value is a Complex value
 * @param {*} value
 * @return {Boolean} isComplex
 */
Complex.isComplex = function (value) {
  return (value instanceof Complex);
};

// private variables and functions for the parser
var text, index, c;

function skipWhitespace() {
  while (c == ' ' || c == '\t') {
    next();
  }
}

function isDigitDot (c) {
  return ((c >= '0' && c <= '9') || c == '.');
}

function isDigit (c) {
  return ((c >= '0' && c <= '9'));
}

function next() {
  index++;
  c = text.charAt(index);
}

function revert(oldIndex) {
  index = oldIndex;
  c = text.charAt(index);
}

function parseNumber () {
  var number = '';
  var oldIndex;
  oldIndex = index;

  if (c == '+') {
    next();
  }
  else if (c == '-') {
    number += c;
    next();
  }

  if (!isDigitDot(c)) {
    // a + or - must be followed by a digit
    revert(oldIndex);
    return null;
  }

  // get number, can have a single dot
  if (c == '.') {
    number += c;
    next();
    if (!isDigit(c)) {
      // this is no legal number, it is just a dot
      revert(oldIndex);
      return null;
    }
  }
  else {
    while (isDigit(c)) {
      number += c;
      next();
    }
    if (c == '.') {
      number += c;
      next();
    }
  }
  while (isDigit(c)) {
    number += c;
    next();
  }

  // check for exponential notation like "2.3e-4" or "1.23e50"
  if (c == 'E' || c == 'e') {
    number += c;
    next();

    if (c == '+' || c == '-') {
      number += c;
      next();
    }

    // Scientific notation MUST be followed by an exponent
    if (!isDigit(c)) {
      // this is no legal number, exponent is missing.
      revert(oldIndex);
      return null;
    }

    while (isDigit(c)) {
      number += c;
      next();
    }
  }

  return number;
}

function parseComplex () {
  // check for 'i', '-i', '+i'
  var cnext = text.charAt(index + 1);
  if (c == 'I' || c == 'i') {
    next();
    return '1';
  }
  else if ((c == '+' || c == '-') && (cnext == 'I' || cnext == 'i')) {
    var number = (c == '+') ? '1' : '-1';
    next();
    next();
    return number;
  }

  return null;
}

/**
 * Parse a complex number from a string. For example Complex.parse("2 + 3i")
 * will return a Complex value where re = 2, im = 3.
 * Returns null if provided string does not contain a valid complex number.
 * @param {String} str
 * @returns {Complex | null} complex
 */
Complex.parse = function (str) {
  text = str;
  index = -1;
  c = '';

  if (!isString(text)) {
    return null;
  }

  next();
  skipWhitespace();
  var first = parseNumber();
  if (first) {
    if (c == 'I' || c == 'i') {
      // pure imaginary number
      next();
      skipWhitespace();
      if (c) {
        // garbage at the end. not good.
        return null;
      }

      return new Complex(0, Number(first));
    }
    else {
      // complex and real part
      skipWhitespace();
      var separator = c;
      if (separator != '+' && separator != '-') {
        // pure real number
        skipWhitespace();
        if (c) {
          // garbage at the end. not good.
          return null;
        }

        return new Complex(Number(first), 0);
      }
      else {
        // complex and real part
        next();
        skipWhitespace();
        var second = parseNumber();
        if (second) {
          if (c != 'I' && c != 'i') {
            // 'i' missing at the end of the complex number
            return null;
          }
          next();
        }
        else {
          second = parseComplex();
          if (!second) {
            // imaginary number missing after separator
            return null;
          }
        }

        if (separator == '-') {
          if (second[0] == '-') {
            second =  '+' + second.substring(1);
          }
          else {
            second = '-' + second;
          }
        }

        next();
        skipWhitespace();
        if (c) {
          // garbage at the end. not good.
          return null;
        }

        return new Complex(Number(first), Number(second));
      }
    }
  }
  else {
    // check for 'i', '-i', '+i'
    first = parseComplex();
    if (first) {
      skipWhitespace();
      if (c) {
        // garbage at the end. not good.
        return null;
      }

      return new Complex(0, Number(first));
    }
  }

  return null;
};

/**
 * Create a complex number from polar coordinates
 *
 * Usage:
 *
 *     Complex.fromPolar(r: Number, phi: Number) : Complex
 *     Complex.fromPolar({r: Number, phi: Number}) : Complex
 *
 * @param {*} args...
 * @return {Complex}
 */
Complex.fromPolar = function (args) {
  switch (arguments.length) {
    case 1:
      var arg = arguments[0];
      if(typeof arg === 'object') {
        return Complex.fromPolar(arg.r, arg.phi);
      }
      throw new TypeError('Input has to be an object with r and phi keys.');

    case 2:
      var r = arguments[0],
        phi = arguments[1];
      if(isNumber(r)) {
        if (isUnit(phi) && phi.hasBase(Unit.BASE_UNITS.ANGLE)) {
          // convert unit to a number in radians
          phi = phi.toNumber('rad');
        }

        if(isNumber(phi)) {
          return new Complex(r * Math.cos(phi), r * Math.sin(phi));
        }

        throw new TypeError('Phi is not a number nor an angle unit.');
      } else {
        throw new TypeError('Radius r is not a number.');
      }

    default:
      throw new SyntaxError('Wrong number of arguments in function fromPolar');
  }
};

/*
 * Return the value of the complex number in polar notation
 * The angle phi will be set in the interval of [-pi, pi].
 * @return {{r: number, phi: number}} Returns and object with properties r and phi.
 */
Complex.prototype.toPolar = function() {
  return {
    r: Math.sqrt(this.re * this.re + this.im * this.im),
    phi: Math.atan2(this.im, this.re)
  };
};

/**
 * Create a copy of the complex value
 * @return {Complex} clone
 */
Complex.prototype.clone = function () {
  return new Complex(this.re, this.im);
};

/**
 * Test whether this complex number equals an other complex value.
 * Two complex numbers are equal when both their real and imaginary parts
 * are equal.
 * @param {Complex} other
 * @return {boolean} isEqual
 */
Complex.prototype.equals = function (other) {
  return (this.re === other.re) && (this.im === other.im);
};

/**
 * Get a string representation of the complex number,
 * with optional formatting options.
 * @param {Object | Number | Function} [options]  Formatting options. See
 *                                                lib/util/number:format for a
 *                                                description of the available
 *                                                options.
 * @return {String} str
 */
Complex.prototype.format = function (options) {
  var str = '';
  var im = this.im;
  var re = this.re;
  var strRe = number.format(this.re, options);
  var strIm = number.format(this.im, options);

  // round either re or im when smaller than the configured precision
  var precision = isNumber(options) ? options : options ? options.precision : null;
  if (precision !== null) {
    var epsilon = Math.pow(10, -precision);
    if (Math.abs(re / im) < epsilon) {re = 0;}
    if (Math.abs(im / re) < epsilon) {im = 0;}
  }

  if (im == 0) {
    // real value
    str = strRe;
  }
  else if (re == 0) {
    // purely complex value
    if (im == 1) {
      str = 'i';
    }
    else if (im == -1) {
      str = '-i';
    }
    else {
      str = strIm + 'i';
    }
  }
  else {
    // complex value
    if (im > 0) {
      if (im == 1) {
        str = strRe + ' + i';
      }
      else {
        str = strRe + ' + ' + strIm + 'i';
      }
    }
    else {
      if (im == -1) {
        str = strRe + ' - i';
      }
      else {
        str = strRe + ' - ' + strIm.substring(1) + 'i';
      }
    }
  }

  return str;
};

/**
 * Get a string representation of the complex number.
 * @return {String} str
 */
Complex.prototype.toString = function () {
  return this.format();
};

/**
 * Get a JSON representation of the complex number
 * @returns {Object} Returns a JSON object structured as:
 *                   `{"mathjs": "Complex", "re": 2, "im": 3}`
 */
Complex.prototype.toJSON = function () {
  return {
    mathjs: 'Complex',
    re: this.re,
    im: this.im
  };
};

/**
 * Create a Complex number from a JSON object
 * @param {Object} json  A JSON Object structured as
 *                       {"mathjs": "Complex", "re": 2, "im": 3}
 *                       All properties are optional, default values
 *                       for `re` and `im` are 0.
 * @return {Complex} Returns a new Complex number
 */
Complex.fromJSON = function (json) {
  return new Complex(json);
};

/**
 * Returns a string representation of the complex number.
 * @return {String} str
 */
Complex.prototype.valueOf = Complex.prototype.toString;

// exports
module.exports = Complex;
