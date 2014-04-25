module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
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
        y = BigNumber.convert(y);
      }
      else if (isBoolean(y)) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return y.isZero() ? x : x.mod(y);
      }

      // downgrade x to Number
      return mod(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = BigNumber.convert(x);
      }
      else if (isBoolean(x)) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return y.isZero() ? x : x.mod(y);
      }

      // downgrade y to Number
      return mod(x, y.toNumber());
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

    throw new math.error.UnsupportedTypeError('mod', math['typeof'](x), math['typeof'](y));
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
      // We don't use JavaScript's % operator here as this doesn't work
      // correctly for x < 0 and x == 0
      // see http://en.wikipedia.org/wiki/Modulo_operation
      return x - y * Math.floor(x / y);
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
