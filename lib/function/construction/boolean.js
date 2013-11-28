module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection,
      isNumber = util.number.isNumber,
      isString = util.string.isString;

  /**
   * Create a boolean or convert a string or number to a boolean.
   * In case of a number, true is returned for non-zero numbers, and false in
   * case of zero.
   * Strings can be 'true' or 'false', or can contain a number.
   * When value is a matrix, all elements will be converted to boolean.
   * @param {String | Number | Boolean | Array | Matrix} value
   * @return {Boolean | Array | Matrix} bool
   */
  math['boolean'] = function bool (value) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('boolean', arguments.length, 0, 1);
    }

    if (value === 'true' || value === true) {
      return true;
    }

    if (value === 'false' || value === false) {
      return false;
    }

    if (value instanceof Boolean) {
      return value ? true : false;
    }

    if (isNumber(value)) {
      return (value !== 0);
    }

    if (value instanceof BigNumber) {
      return !value.isZero();
    }

    if (isString(value)) {
      // try case insensitive
      var lcase = value.toLowerCase();
      if (lcase === 'true') {
        return true;
      }
      else if (lcase === 'false') {
        return false;
      }

      // test whether value is a valid number
      var num = Number(value);
      if (value != '' && !isNaN(num)) {
        return (num !== 0);
      }
    }

    if (isCollection(value)) {
      return collection.deepMap(value, bool);
    }

    throw new SyntaxError(value.toString() + ' is no valid boolean');
  };
};
