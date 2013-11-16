module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isNumBool = util.number.isNumBool,
      isBoolean = util.boolean.isBoolean,
      isCollection = collection.isCollection;

  /**
   * Calculates the modulus, the remainder of an integer division.
   *
   *     x % y
   *     mod(x, y)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | BigNumber | Boolean | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Array | Matrix} y
   * @return {Number | BigNumber | Array | Matrix} res
   */
  math.mod = function mod(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('mod', arguments.length, 2);
    }

    // see http://functions.wolfram.com/IntegerFunctions/Mod/

    if (isNumber(x)) {
      if (isNumber(y)) {
        // number % number
        return _mod(x, y);
      }
      else if (isBoolean(y)) {
        // number % boolean
        return _mod(x, Number(y));
      }
    }
    else if (isBoolean(x)) {
      if (isNumber(y)) {
        // boolean % number
        return _mod(Number(x), y);
      }
      else if (isBoolean(y)) {
        // boolean % boolean
        return _mod(Number(x), Number(y));
      }
    }

    if (x instanceof BigNumber) {
      if (y instanceof BigNumber || isNumber(y)) {
        return x.mod(parseFloat(y.valueOf()));
      }
      else if (isBoolean(y)) {
        return x.mod(Number(y));
      }
    }
    else if (y instanceof BigNumber) {
      if (isNumber(x)) {
        return new BigNumber(x).mod(parseFloat(y.valueOf()));
      }
      else if (isBoolean(x)) {
        return new BigNumber(Number(x)).mod(parseFloat(y.valueOf()));
      }
    }

    // TODO: implement mod for complex values

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, mod);
    }

    throw new util.error.UnsupportedTypeError('mod', x, y);
  };

  /**
   * Calculate the modulus of two numbers
   * @param {Number} x
   * @param {Number} y
   * @returns {number} res
   * @private
   */
  function _mod(x, y) {
    if (y > 0) {
      if (x > 0) {
        return x % y;
      }
      else if (x == 0) {
        return 0;
      }
      else { // x < 0
        return x - y * Math.floor(x / y);
      }
    }
    else if (y == 0) {
      return x;
    }
    else { // y < 0
      // TODO: implement mod for a negative divisor
      throw new Error('Cannot calculate mod for a negative divisor');
    }
  }
};
