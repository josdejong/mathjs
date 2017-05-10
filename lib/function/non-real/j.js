'usestrict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Get the real part of a complex number.
   * For a complex number `a + bi`, the function returns `a`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.j(x)
   *
   * Examples:
   *
   *    var a = math.complex(2, 3);
   *    math.j(a);                      // returns number 0 
   *	
   *	var b = math.Quaternion(1,2,3,4);
   *
   *    math.j(b)   					// returns 3
   *
   * See also:
   *
   *    im, conj, abs, arg, re, k
   *
   * @param {number | BigNumber | Complex | Array | Matrix | Quaternion} x
   *            A complex number or array with complex numbers
   * @return {number | BigNumber | Array | Matrix} The real part of x
   */
  var j = typed('j', {
    'number | Complex': function (x) {
      return 0;
    },

    'BigNumber': function (x) {
      return type.BigNumber(0);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, j);
    },

    'Quaternion': function (x) {
      return x.j;
    }
  });

  j.toTex = {1: 'unfinished'};

  return j;
}

exports.name = 'j';
exports.factory = factory;