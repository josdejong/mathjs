'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      collection = math.collection,

      number = util.number,
      isNumber = util.number.isNumber,
      isCollection = collection.isCollection;

  /**
   * Create a string or convert any object into a string.
   * Elements of Arrays and Matrices are processed element wise.
   *
   * Syntax:
   *
   *    math.string(value)
   *
   * Examples:
   *
   *    math.string(4.2);               // returns string '4.2'
   *    math.string(math.complex(3, 2); // returns string '3 + 2i'
   *
   *    var u = math.unit(5, 'km');
   *    math.string(u.to('m'));         // returns string '5000 m'
   *
   *    math.string([true, false]);     // returns ['true', 'false']
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, matrix, number, unit
   *
   * @param {* | Array | Matrix | null} [value]  A value to convert to a string
   * @return {String | Array | Matrix} The created string
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
