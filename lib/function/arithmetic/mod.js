module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      toNumber = util.number.toNumber,
      toBigNumber = util.number.toBigNumber,
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
    }

    if (x instanceof BigNumber) {
      if (isNumber(y)) {
        // try to convert to big number, if not possible, downgrade to Numbers
        y = toBigNumber(y);
        if (isNumber(y)) {
          return _mod(toNumber(x), y);
        }
      }

      if (y instanceof BigNumber) {
        return x.mod(y);
      }
    }
    if (y instanceof BigNumber) {
      if (isNumber(x)) {
        // try to convert to big number, if not possible, downgrade to Numbers
        x = toBigNumber(x);
        if (isNumber(x)) {
          return _mod(x, toNumber(y));
        }
      }

      if (x instanceof BigNumber) {
        return x.mod(y)
      }
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
