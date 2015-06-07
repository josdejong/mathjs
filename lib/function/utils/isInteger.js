'use strict';

var number = require('../../util/number');

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));

  /**
   * Test whether a value is an integer number.
   * The function handles `number`, `BigNumber`, and `Fraction` as numeric values,
   * for these types it will determine whether the value is integer. For
   * all other types, the function returns false.
   *
   * Syntax:
   *
   *     math.isInteger(x)
   *
   * Examples:
   *
   *    math.isInteger(2);                     // returns true
   *    math.isInteger(0);                     // returns true
   *    math.isInteger(0.5);                   // returns false
   *    math.isInteger(math.bignumber(500));   // returns true
   *    math.isInteger(math.fraction(4));      // returns true
   *    math.isInteger(math.complex('2 - 4i'); // returns false
   *    math.isInteger('3');                   // returns false
   *
   * @param {*} x       Value to be tested
   * @return {boolean}  Returns true when `x` contains a numeric, integer value.
   *                    Throws an error in case of an unknown data type.
   */
  var isInteger = typed('isInteger', {
    'number': number.isInteger, // TODO: what to do with isInteger(add(0.1, 0.2))  ?

    'BigNumber': function (x) {
      return x.isInt();
    },

    'Fraction': function (x) {
      return x.d === 1 && isFinite(x.n);
    },

    'Complex | Unit | string': function () {
      return false;
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, isInteger);
    }
  });

  return isInteger;
}

exports.name = 'isInteger';
exports.factory = factory;
