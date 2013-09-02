module.exports = function (math) {
  var util = require('../../util/index.js'),

      collection = require('../../type/collection.js'),

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
          return collection.map(value, string);
        }

        if (value === null) {
          return 'null';
        }

        return value.toString();

      default:
        throw new util.error.ArgumentsError('string', arguments.length, 0, 1);
    }
  };
};
