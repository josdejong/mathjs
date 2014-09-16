'use strict';

module.exports = function (math) {
  var util = require('../../util/index');

  var BigNumber = math.type.BigNumber;
  var Unit = math.type.Unit;
  var collection = require('../../type/collection');

  var isCollection = collection.isCollection;
  var isNumber = util.number.isNumber;
  var isBoolean = util['boolean'].isBoolean;
  var isString = util.string.isString;

  /**
   * Create a number or convert a string, boolean, or unit to a number.
   * When value is a matrix, all elements will be converted to number.
   *
   * Syntax:
   *
   *    math.number(value)
   *    math.number(unit, valuelessUnit)
   *
   * Examples:
   *
   *    math.number(2);                         // returns number 2
   *    math.number('7.2');                     // returns number 7.2
   *    math.number(true);                      // returns number 1
   *    math.number([true, false, true, true]); // returns [1, 0, 1, 1]
   *    math.number(math.unit('52cm'), 'm');    // returns 0.52
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, matrix, string, unit
   *
   * @param {String | Number | Boolean | Array | Matrix | Unit | null} [value]  Value to be converted
   * @param {Unit | string} [valuelessUnit] A valueless unit, used to convert a unit to a number
   * @return {Number | Array | Matrix} The created number
   */
  math.number = function number (value, valuelessUnit) {
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

        if (isBoolean(value) || value === null) {
          return +value;
        }

        if (isNumber(value)) {
          return value;
        }

        if (value instanceof Unit) {
          throw new Error('Second argument with valueless unit expected');
        }

        throw new math.error.UnsupportedTypeError('number', math['typeof'](value));

      case 2:
        if (value instanceof Unit && isString(valuelessUnit) || valuelessUnit instanceof Unit) {
          return value.toNumber(valuelessUnit);
        }

        throw new math.error.UnsupportedTypeError('number', math['typeof'](value), math['typeof'](valuelessUnit));


      default:
        throw new math.error.ArgumentsError('number', arguments.length, 0, 1);
    }
  };
};
