module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      collection = require('../../type/collection'),

      isCollection = collection.isCollection,
      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isString = util.string.isString;

  /**
   * Create a number or convert a string to a number.
   * When value is a matrix, all elements will be converted to number.
   *
   * Syntax:
   *
   *    math.number(value)
   *
   * Examples:
   *
   *    math.number(2);                         // returns number 2
   *    math.number('7.2');                     // returns number 7.2
   *    math.number(true);                      // returns number 1
   *    math.number([true, false, true, true]); // returns [1, 0, 1, 1]
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, matrix, string, unit
   *
   * @param {String | Number | Boolean | Array | Matrix} [value]  Value to be converted
   * @return {Number | Array | Matrix} The created number
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
          return value.toNumber();
        }

        if (isString(value)) {
          var num = Number(value);
          if (isNaN(num)) {
            num = Number(value.valueOf());
          }
          if (isNaN(num)) {
            throw new SyntaxError(value.toString() + ' is no valid number');
          }
          return num;
        }

        if (isBoolean(value)) {
          return value + 0;
        }

        if (isNumber(value)) {
          return value;
        }

        throw new math.error.UnsupportedTypeError('number', math['typeof'](value));

      default:
        throw new math.error.ArgumentsError('number', arguments.length, 0, 1);
    }
  };
};
