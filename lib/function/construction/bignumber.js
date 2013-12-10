module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection,
      isNumber = util.number.isNumber,
      isString = util.string.isString,
      isBoolean = util['boolean'].isBoolean;

  // extend BigNumber with a function clone
  if (typeof BigNumber.prototype.clone !== 'function') {
    /**
     * Clone a bignumber
     * @return {BigNumber} clone
     */
    BigNumber.prototype.clone = function clone () {
      return new BigNumber(this);
    };
  }

  /**
   * Create a big number, which can store numbers with higher precision than
   * a JavaScript Number.
   * When value is a matrix, all elements will be converted to bignumber.
   *
   * @param {Number | String | Array | Matrix} [value]  Value for the big number,
   *                                                    0 by default.
   */
  math.bignumber = function bignumber(value) {
    if (arguments.length > 1) {
      throw new math.error.ArgumentsError('bignumber', arguments.length, 0, 1);
    }

    if ((value instanceof BigNumber) || isNumber(value) || isString(value)) {
      return new BigNumber(value);
    }

    if (isBoolean(value)) {
      return new BigNumber(+value);
    }

    if (isCollection(value)) {
      return collection.deepMap(value, bignumber);
    }

    if (arguments.length == 0) {
      return new BigNumber(0);
    }

    throw new math.error.UnsupportedTypeError('bignumber', value);
  };
};
