'use strict';

var collection = require('../../type/collection');

function factory (type, config, load, typed) {
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
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
   *            A number or matrix for which to get the absolute value
   * @return {Number | BigNumber | Complex | Array | Matrix}
   *            Absolute value of `x`
   */
  var abs = typed('abs', {
    'number': Math.abs,

    'Complex': function (x) {
      // do not compute sqrt(re * re + im * im) since it will overflow with big numbers!
      var re = Math.abs(x.re);
      var im = Math.abs(x.im);
      if (re >= im) {
        var x = im / re;
        return re * Math.sqrt(1 + x * x);
      }
      var y = re / im;
      return im * Math.sqrt(1 + y * y);
    },

    'BigNumber': function (x) {
      return x.abs();
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, abs);
    }
  });

  return abs;
}

exports.type = 'function';
exports.name = 'abs';
exports.factory = factory;
