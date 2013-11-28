module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection,
      toNumber = util.number.toNumber;

  /**
   * Create a number or convert a string to a number.
   * When value is a matrix, all elements will be converted to number.
   * @param {String | Number | Boolean | Array | Matrix} [value]
   * @return {Number | Array | Matrix} num
   */
  math.number = function number (value) {
    switch (arguments.length) {
      case 0:
        return 0;

      case 1:
        if (isCollection(value)) {
          return collection.deepMap(value, number);
        }

        if (value instanceof BigNumber) {
          return toNumber(value);
        }

        var num = Number(value);
        if (isNaN(num)) {
          num = Number(value.valueOf());
        }
        if (isNaN(num)) {
          throw new SyntaxError(value.toString() + ' is no valid number');
        }
        return num;
      default:
        throw new math.error.ArgumentsError('number', arguments.length, 0, 1);
    }
  };
};
