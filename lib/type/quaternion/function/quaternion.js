'use strict';

var deepMap = require('../../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var latex = require('../../../utils/latex');

  /**
   * Create a Quaternion or convert a value to a Quaternion.
   *
   * Syntax:
   *
   *     math.quaternion()                           // creates a quaternion value q = 0 + 0i + 0j + 0k
   *
   *     math.quaternion({
   *           r : number, i : numbr,
   *           j: number, k: number                  // creates a quaternion value with provided from an object
   *     })
   *
   *     math.quaternion({r : number})
   *     math.quaternion({j : number})                // creates a quaternion value with provided components value
   *     math.quaternion({k : number})
   *
   *     math.quaternion(Complex)                     // creates a quaternion with the equivilent value of the complex number
   *                                                  // e.g. a + bi --> a + bi + 0j + 0k
   *
   *     math.quaternion(arg : string)               // parses a string into a quaternion value.

   *     math.quaternion({re: number, im: number})   // creates a quaternion value with provided
   *                                              // values for real an imaginary part.
   *     math.quaternion({r: number, phi: number})   // creates a quaternion value with provided
   *                                              // polar coordinates
   *
   * Examples:
   *
   *    var a = math.quaternion(3, -4, 12, 3);     // a = Quaternion 3 - 4i + 12j + 3k
   *    a.r = 5;                        // a = Quaternion 5 - 4i
   *    var i = a.im;                    // Number -4;
   *    var b = math.quaternion('2 + 6i - 5j -2k');  // Quaternion 2 + 6i - 5j -2k
   *    var c = math.quaternion();          // Quaternion 0 + 0i + 0j + 0k
   *    var d = math.add(a, b);          // Quaternion 5 - 2i + 7j + k
   *
   * See also:
   *
   *    complex, bignumber, boolean, index, matrix, number, string, unit
   *
   * @param {number | Bignumber, Complex, Quaternion, String, Object, Array, Matrix} [args]
   *            Arguments specifying the real and imaginary part of the complex number
   * @return {Quaternion, Matrix, Array} Returns a complex value
   */
  var quaternion = typed('quaternion', {
    '': function () {
      return new type.Quaternion(0,0,0,0);
    },

    'number': function (x) {
      return new type.Quaternion(x, 0, 0, 0);
    },

    'number, number': function (r, i) {
      return new type.Quaternion(r, i, 0, 0);
    },

    'number, number, number': function (r, i, j) {
      return new type.Quaternion(r, i, j, 0)
    },

    'number, number, number, number': function (r, i, j, k) {
      return new type.Quaternion(r, i, j, k);
    },

    'BigNumber': function (r) {
      return new type.Quaternion(r.toNumber(), 0, 0, 0);
    },

    'BigNumber, BigNumber': function (r, i) {
      return new type.Quaternion(r.toNumber(), i.toNumber(), 0, 0);
    },

    'BigNumber, BigNumber, BigNumber': function (r, i, j) {
      return new type.Quaternion(r.toNumber(), i.toNumber(), j.toNumber(), 0);
    },

    'BigNumber, BigNumber, BigNumber, BigNumber': function (r, i, j, k) {
      return type.Quaternion(r.toNumber(), i.toNumber(), j.toNumber(), k.toNumber());
    },

    'Complex': function (x) {
      return new type.Quaternion(x);
    },

    'Quaternion': function (q) {
      return q.clone();
    },

    'string': function (x) {
      return type.Quaternion(x);
    },

    'Object': function (x) {
      return type.Quaternion(x);
    },

    'Complex, Complex': function (x,y) {
      return type.Quaternion(x,y);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, quaternion);
    }
  });

  //todo impliment this and understnad all of math.parse
  quaternion.toTex = {
    0: 'unfinished'
  };

  return quaternion;
}

exports.name = 'quaternion';
exports.factory = factory;
