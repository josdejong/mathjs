'use strict';

var util = require('../../util/index');

var BigNumber = require('decimal.js');
var Complex = require('../../type/Complex');
var Matrix = require('../../type/Matrix');
var Unit = require('../../type/Unit');
var collection = require('../../type/collection');

var toBigNumber = util.bignumber.toBigNumber;
var isBoolean = util['boolean'].isBoolean;
var isNumber = util.number.isNumber;
var isString = util.string.isString;
var isComplex = Complex.isComplex;
var isUnit = Unit.isUnit;
var isCollection = collection.isCollection;

/**
 * Add two values, `x + y`.
 * For matrices, the function is evaluated element wise.
 *
 * Syntax:
 *
 *    math.add(x, y)
 *
 * Examples:
 *
 *    math.add(2, 3);               // returns Number 5
 *
 *    var a = math.complex(2, 3);
 *    var b = math.complex(-4, 1);
 *    math.add(a, b);               // returns Complex -2 + 4i
 *
 *    math.add([1, 2, 3], 4);       // returns Array [5, 6, 7]
 *
 *    var c = math.unit('5 cm');
 *    var d = math.unit('2.1 mm');
 *    math.add(c, d);               // returns Unit 52.1 mm
 *
 * See also:
 *
 *    subtract
 *
 * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null} x First value to add
 * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null} y Second value to add
 * @return {Number | BigNumber | Complex | Unit | String | Array | Matrix} Sum of `x` and `y`
 */
// TODO: replace add with a typed-function
module.exports = function add(x, y) {
  if (arguments.length != 2) {
    throw new TypeError('Too ' + (arguments.length > 2 ? 'many' : 'few') +
      ' arguments (expected: 2, actual: ' + arguments.length + ')');
  }

  if (isNumber(x)) {
    if (isNumber(y)) {
      // number + number
      return x + y;
    }
    else if (isComplex(y)) {
      // number + complex
      return new Complex(
          x + y.re,
          y.im
      )
    }
  }

  if (isComplex(x)) {
    if (isComplex(y)) {
      // complex + complex
      return new Complex(
          x.re + y.re,
          x.im + y.im
      );
    }
    else if (isNumber(y)) {
      // complex + number
      return new Complex(
          x.re + y,
          x.im
      )
    }
  }

  if (isUnit(x)) {
    if (isUnit(y)) {
      if (x.value == null) {
        throw new Error('Parameter x contains a unit with undefined value');
      }

      if (y.value == null) {
        throw new Error('Parameter y contains a unit with undefined value');
      }

      if (!x.equalBase(y)) {
        throw new Error('Units do not match');
      }

      var res = x.clone();
      res.value += y.value;
      res.fixPrefix = false;
      return res;
    }
  }

  if (x instanceof BigNumber) {
    // try to convert to big number
    if (isNumber(y)) {
      y = toBigNumber(y, x.constructor);
    }
    else if (isBoolean(y) || y === null) {
      y = new BigNumber(y ? 1 : 0);
    }

    if (y instanceof BigNumber) {
      return x.plus(y);
    }

    // downgrade to Number
    return add(x.toNumber(), y);
  }
  if (y instanceof BigNumber) {
    // try to convert to big number
    if (isNumber(x)) {
      x = toBigNumber(x, y.constructor);
    }
    else if (isBoolean(x) || x === null) {
      x = new BigNumber(x ? 1 : 0);
    }

    if (x instanceof BigNumber) {
      return x.plus(y)
    }

    // downgrade to Number
    return add(x, y.toNumber());
  }

  if (isCollection(x) || isCollection(y)) {
    return collection.deepMap2(x, y, add);
  }

  if (isString(x) || isString(y)) {
    return x + y;
  }

  if (isBoolean(x) || x === null) {
    return add(+x, y);
  }
  if (isBoolean(y) || y === null) {
    return add(x, +y);
  }

  throw new TypeError('Unexpected type of argument in function add'); // TODO better error
};
