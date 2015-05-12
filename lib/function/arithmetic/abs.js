'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));

  /**
   * Calculate the absolute value of a number. For matrices, the function is
   * evaluated element wise.
   *
   * Syntax:
   *
   *    math.abs(x)
   *
   * Examples:
   *
   *    math.abs(3.5);                // returns Number 3.5
   *    math.abs(-4.2);               // returns Number 4.2
   *
   *    math.abs([3, -5, -1, 0, 2]);  // returns Array [3, 5, 1, 0, 2]
   *
   * See also:
   *
   *    sign
   *
   * @param  {Number | BigNumber | Fraction | Boolean | Complex | Array | Matrix | null} x
   *            A number or matrix for which to get the absolute value
   * @return {Number | BigNumber | Fraction | Complex | Array | Matrix}
   *            Absolute value of `x`
   */
  var abs = typed('abs', {
    'number': Math.abs,

    'Complex': function (x) {
      var re = Math.abs(x.re);
      var im = Math.abs(x.im);
      if (re < 1000 && im < 1000) {
        return Math.sqrt(re * re + im * im);
      }
      else {
        // prevent overflow for large numbers
        if (re >= im) {
          var i = im / re;
          return re * Math.sqrt(1 + i * i);
        }
        else {
          var j = re / im;
          return im * Math.sqrt(1 + j * j);
        }
      }
    },

    'BigNumber': function (x) {
      return x.abs();
    },

    'Fraction': function (x) {
      return x.abs();
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since abs(0) = 0
      return collection.deepMap(x, abs, true);
    }
  });

  return abs;
}

exports.name = 'abs';
exports.factory = factory;
