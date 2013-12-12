module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      toNumber = util.number.toNumber,
      toBigNumber = util.number.toBigNumber,
      isBoolean = util['boolean'].isBoolean,
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
      throw new math.error.ArgumentsError('mod', arguments.length, 2);
    }

    // see http://functions.wolfram.com/IntegerFunctions/Mod/

    if (isNumber(x)) {
      if (isNumber(y)) {
        // number % number
        return _mod(x, y);
      }
    }

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = toBigNumber(y);
      }
      else if (isBoolean(y)) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return x.mod(y);
      }

      // downgrade to Number
      return mod(toNumber(x), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = toBigNumber(x);
      }
      else if (isBoolean(x)) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return x.mod(y)
      }

      // downgrade to Number
      return mod(x, toNumber(y));
    }

    // TODO: implement mod for complex values

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, mod);
    }

    if (isBoolean(x)) {
      return mod(+x, y);
    }
    if (isBoolean(y)) {
      return mod(x, +y);
    }

    throw new math.error.UnsupportedTypeError('mod', x, y);
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
