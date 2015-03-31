'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Calculate the exponent of a value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.exp(x)
   *
   * Examples:
   *
   *    math.exp(2);                  // returns Number 7.3890560989306495
   *    math.pow(math.e, 2);          // returns Number 7.3890560989306495
   *    math.log(math.exp(2));        // returns Number 2
   *
   *    math.exp([1, 2, 3]);
   *    // returns Array [
   *    //   2.718281828459045,
   *    //   7.3890560989306495,
   *    //   20.085536923187668
   *    // ]
   *
   * See also:
   *
   *    log, pow
   *
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  A number or matrix to exponentiate
   * @return {Number | BigNumber | Complex | Array | Matrix} Exponent of `x`
   */
  var exp = typed('exp', {
    'number': Math.exp,

    'Complex': function (x) {
      var r = Math.exp(x.re);
      return new type.Complex(
          r * Math.cos(x.im),
          r * Math.sin(x.im)
      );
    },

    'BigNumber': function (x) {
      return x.exp();
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, exp);
    }
  });

  return exp;
}

exports.name = 'exp';
exports.factory = factory;
