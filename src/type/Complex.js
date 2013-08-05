var options = require('../options.js'),
    number = require('./../util/number.js'),
    types = require('./../util/types.js'),
    string = require('./../util/string.js');

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
    throw new SyntaxError(
        'Complex constructor must be called with the new operator');
  }

  switch (arguments.length) {
    case 0:
      this.re = 0;
      this.im = 0;
      break;

    case 2:
      if (!number.isNumber(re) || !number.isNumber(im)) {
        throw new TypeError(
            'Two numbers expected in Complex constructor');
      }
      this.re = re;
      this.im = im;
      break;

    default:
      if (arguments.length != 0 && arguments.length != 2) {
        throw new SyntaxError(
            'Two or zero arguments expected in Complex constructor');
      }
      break;
  }
}

module.exports = Complex;

/**
 * Test whether value is a Complex value
 * @param {*} value
 * @return {Boolean} isComplex
 */
Complex.isComplex = exports.isComplex = function isComplex(value) {
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

  // check for scientific notation like "2.3e-4" or "1.23e50"
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
 * Create a complex number from a provided real and imaginary number.
 * When the imaginary part is zero, a real number is returned instead of
 * a complex number. For example:
 *     Complex.create(2, 3);        // returns a Complex(2, 3)
 *     Complex.create(2, 0);        // returns a Number 2
 *
 * @param {Number} re
 * @param {Number} im
 * @return {Complex | Number} value
 */
Complex.create = exports.create = function create (re, im) {
  if (im == 0) {
    return re;
  }
  else {
    return new Complex(re, im);
  }
};

/**
 * Parse a complex number from a string. For example Complex.parse("2 + 3i")
 * will return a Complex value where re = 2, im = 3.
 * Returns null if provided string does not contain a valid complex number.
 * @param {String} str
 * @returns {Complex | null} complex
 */
Complex.parse = exports.parse = function parse(str) {
  text = str;
  index = -1;
  c = '';

  if (!string.isString(text)) {
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
 * Create a copy of the complex value
 * @return {Complex} clone
 */
Complex.prototype.clone = function () {
  return new Complex(this.re, this.im);
};

/**
 * Get string representation of the Complex value
 * @return {String} str
 */
Complex.prototype.toString = function () {
  var str = '';
  var strRe = number.format(this.re, options.precision);
  var strIm = number.format(this.im, options.precision);

  if (this.im == 0) {
    // real value
    str = strRe;
  }
  else if (this.re == 0) {
    // purely complex value
    if (this.im == 1) {
      str = 'i';
    }
    else if (this.im == -1) {
      str = '-i';
    }
    else {
      str = strIm + 'i';
    }
  }
  else {
    // complex value
    if (this.im > 0) {
      if (this.im == 1) {
        str = strRe + ' + i';
      }
      else {
        str = strRe + ' + ' + strIm + 'i';
      }
    }
    else {
      if (this.im == -1) {
        str = strRe + ' - i';
      }
      else {
        str = strRe + ' - ' +
            number.format(Math.abs(this.im), options.precision) + 'i';
      }
    }
  }

  return str;
};

types.addType('complex', Complex);
