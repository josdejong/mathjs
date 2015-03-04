'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      // take the BigNumber instance the provided math.js instance
      BigNumber = math.type.BigNumber,
      collection = math.collection,

      isCollection = collection.isCollection,
      isNumber = util.number.isNumber,
      isString = util.string.isString,
      isBoolean = util['boolean'].isBoolean;

  /**
   * Create a BigNumber, which can store numbers with arbitrary precision.
   * When a matrix is provided, all elements will be converted to BigNumber.
   *
   * Syntax:
   *
   *    math.bignumber(x)
   *
   * Examples:
   *
   *    0.1 + 0.2;                                  // returns Number 0.30000000000000004
   *    math.bignumber(0.1) + math.bignumber(0.2);  // returns BigNumber 0.3
   *
   *
   *    7.2e500;                                    // returns Number Infinity
   *    math.bignumber('7.2e500');                  // returns BigNumber 7.2e500
   *
   * See also:
   *
   *    boolean, complex, index, matrix, string, unit
   *
   * @param {Number | String | Array | Matrix | Boolean | null} [value]  Value for the big number,
   *                                                    0 by default.
   * @returns {BigNumber} The created bignumber
   */
  math.bignumber = function bignumber(value) {
    if (arguments.length > 1) {
      throw new math.error.ArgumentsError('bignumber', arguments.length, 0, 1);
    }

    if ((value instanceof BigNumber) || isNumber(value) || isString(value)) {
      return new BigNumber(value);
    }

    if (isBoolean(value) || value === null) {
      return new BigNumber(+value);
    }

    if (isCollection(value)) {
      return collection.deepMap(value, bignumber);
    }

    if (arguments.length == 0) {
      return new BigNumber(0);
    }

    throw new math.error.UnsupportedTypeError('bignumber', math['typeof'](value));
  };
};
