'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Unit = require('../../type/Unit'),
      collection = math.collection,

      isCollection = collection.isCollection,
      isString = util.string.isString;

  /**
   * Create a unit. Depending on the passed arguments, the function
   * will create and return a new math.type.Unit object.
   * When a matrix is provided, all elements will be converted to units.
   *
   * Syntax:
   *
   *     math.unit(unit : string)
   *     math.unit(value : number, unit : string)
   *
   * Examples:
   *
   *    var a = math.unit(5, 'cm');    // returns Unit 50 mm
   *    var b = math.unit('23 kg');    // returns Unit 23 kg
   *    a.to('m');                     // returns Unit 0.05 m
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, matrix, number, string
   *
   * @param {* | Array | Matrix} args   A number and unit.
   * @return {Unit | Array | Matrix}    The created unit
   */
  math.unit = function unit(args) {
    switch(arguments.length) {
      case 1:
        // parse a string
        var arg = arguments[0];

        if (arg instanceof Unit) {
          // create a clone of the unit
          return arg.clone();
        }

        if (isString(arg)) {
          if (Unit.isValuelessUnit(arg)) {
            return new Unit(null, arg); // a pure unit
          }

          var u = Unit.parse(arg);        // a unit with value, like '5cm'
          if (u) {
            return u;
          }

          throw new SyntaxError('String "' + arg + '" is no valid unit');
        }

        if (isCollection(args)) {
          return collection.deepMap(args, unit);
        }

        throw new TypeError('A string or a number and string expected in function unit');

      case 2:
        // a number and a unit

        if (arguments[0] instanceof BigNumber) {
          // convert value to number
          return new Unit(arguments[0].toNumber(), arguments[1]);
        }
        else {
          return new Unit(arguments[0], arguments[1]);
        }

      default:
        throw new math.error.ArgumentsError('unit', arguments.length, 1, 2);
    }
  };
};
