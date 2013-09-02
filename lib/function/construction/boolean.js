module.exports = function (math) {
  var util = require('../../util/index.js'),

      collection = require('../../type/collection.js'),

      isCollection = collection.isCollection,
      isNumber = util.number.isNumber,
      isString = util.string.isString;

  /**
   * Create a boolean or convert a string or number to a boolean.
   * In case of a number, true is returned for non-zero numbers, and false in
   * case of zero.
   * Strings can be 'true' or 'false', or can contain a number.
   * @param {String | Number | Boolean | Array | Matrix} value
   * @return {Boolean | Array | Matrix} bool
   */
  math['boolean'] = function bool (value) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('boolean', arguments.length, 0, 1);
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
      return collection.map(value, bool);
    }

    throw new SyntaxError(value.toString() + ' is no valid boolean');
  };
};
