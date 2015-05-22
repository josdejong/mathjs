'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));

  /**
   * Inverse the sign of a value, apply a unary minus operation.
   *
   * For matrices, the function is evaluated element wise. Boolean values and
   * strings will be converted to a number. For complex numbers, both real and
   * complex value are inverted.
   *
   * Syntax:
   *
   *    math.unaryMinus(x)
   *
   * Examples:
   *
   *    math.unaryMinus(3.5);      // returns -3.5
   *    math.unaryMinus(-4.2);     // returns 4.2
   *
   * See also:
   *
   *    add, subtract, unaryPlus
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x Number to be inverted.
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Returns the value with inverted sign.
   */
  var unaryMinus = typed('unaryMinus', {
    'number': function (x) {
      return -x;
    },

    'Complex': function (x) {
      return new type.Complex(-x.re, -x.im);
    },

    'BigNumber': function (x) {
      return x.neg();
    },

    'Fraction': function (x) {
      var tmp = x.clone();
      tmp.s = -tmp.s;
      return tmp;
    },

    'Unit': function (x) {
      var res = x.clone();
      res.value = -x.value;
      return res;
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since unaryMinus(0) = 0
      return collection.deepMap(x, unaryMinus, true);
    }

    // TODO: add support for string
  });

  return unaryMinus;
}

exports.name = 'unaryMinus';
exports.factory = factory;
