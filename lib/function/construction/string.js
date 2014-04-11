module.exports = function (math) {
  var util = require('../../util/index'),

      collection = require('../../type/collection'),

      number = util.number,
      isNumber = util.number.isNumber,
      isCollection = collection.isCollection;

  /**
   * Create a string or convert any object into a string.
   * Elements of Arrays and Matrices are processed element wise
   * @param {* | Array | Matrix} [value]
   * @return {String | Array | Matrix} str
   */
  math.string = function string (value) {
    switch (arguments.length) {
      case 0:
        return '';

      case 1:
        if (isNumber(value)) {
          return number.format(value);
        }

        if (isCollection(value)) {
          return collection.deepMap(value, string);
        }

        if (value === null) {
          return 'null';
        }

        return value.toString();

      default:
        throw new math.error.ArgumentsError('string', arguments.length, 0, 1);
    }
  };
};
