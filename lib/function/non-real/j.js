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
   *	var b = math.Quarternion(1,2,3,4);
   *
   *    math.j(b)   					// returns 3
   *
   * See also:
   *
   *    im, conj, abs, arg, re, k
   *
   * @param {number | BigNumber | Complex | Array | Matrix | Quarternion} x
   *            A complex number or array with complex numbers
   * @return {number | BigNumber | Array | Matrix} The real part of x
   */
  var re = typed('j', {
    'number | Complex': function (x) {
      return 0;
    },

    'BigNumber': function (x) {
      return type.BigNumber(0);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, re);
    },

    'Quarternion': function (x) {
      return x.j();
    }
  });

  re.toTex = {1: '\\Re\\left\\lbrace${args[0]}\\right\\rbrace'};

  return re;
}

exports.name = 're';
exports.factory = factory;