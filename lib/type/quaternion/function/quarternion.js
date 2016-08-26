'use strict';

var deepMap = require('../../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var latex = require('../../../utils/latex');

  /**
   * Create a complex value or convert a value to a complex value.
   *
   * Syntax:
   *
   *     math.complex()                           // creates a complex value with zero
   *                                              // as real and imaginary part.
   *     math.complex(re : number, im : string)   // creates a complex value with provided
   *                                              // values for real and imaginary part.
   *     math.complex(re : number)                // creates a complex value with provided
   *                                              // real value and zero imaginary part.
   *     math.complex(complex : Complex)          // clones the provided complex value.
   *     math.complex(arg : string)               // parses a string into a complex value.
   *     math.complex(array : Array)              // converts the elements of the array
   *                                              // or matrix element wise into a
   *                                              // complex value.
   *     math.complex({re: number, im: number})   // creates a complex value with provided
   *                                              // values for real an imaginary part.
   *     math.complex({r: number, phi: number})   // creates a complex value with provided
   *                                              // polar coordinates
   *
   * Examples:
   *
   *    var a = math.complex(3, -4);     // a = Complex 3 - 4i
   *    a.re = 5;                        // a = Complex 5 - 4i
   *    var i = a.im;                    // Number -4;
   *    var b = math.complex('2 + 6i');  // Complex 2 + 6i
   *    var c = math.complex();          // Complex 0 + 0i
   *    var d = math.add(a, b);          // Complex 5 + 2i
   *
   * See also:
   *
   *    bignumber, boolean, index, matrix, number, string, unit
   *
   * @param {* | Array | Matrix} [args]
   *            Arguments specifying the real and imaginary part of the complex number
   * @return {Complex | Array | Matrix} Returns a complex value
   */
  var quarternion = typed('quarternion', {
    '': function () {
      return new type.Quarternion(0,0,0,0);
    },

    'number': function (x) {
      return new type.Quarternion(x, 0, 0, 0);
    },

    'number, number': function (r, i) {
      return new type.Quarternion(r, i, 0, 0);
    },

    'number, number, number': function (r, i, j) {
      return new type.Quarternion(r, i, j, 0)
    },

    'number, number, number, number': function (r, i, j, k) {
      return new type.Quarternion(r, i, j, k);
    },

    'BigNumber': function (r) {
      return new type.Quarternion(r.toNumber(), 0, 0, 0);
    },

    'BigNumber, BigNumber': function (r, i) {
      return new type.Quarternion(r.toNumber(), i.toNumber(), 0, 0);
    },

    'BigNumber, BigNumber, BigNumber': function (r, i, j) {
      return new type.Quarternion(r.toNumber(), i.toNumber(), j.toNumber(), 0);
    },

    'BigNumber, BigNumber, BigNumber, BigNumber': function (r, i, j, k) {
      return type.Quarternion(r.toNumber(), i.toNumber(), j.toNumber(), k.toNumber());
    },

    'Complex': function (x) {
      return new type.Quarternion(x);
    },

    'Quarternion': function (q) {
      return q.clone();
    },

    'string': function (x) {
      return type.Quarternion(x); // for example '2 + 3i'
    },

    'Object': function (x) {
      return type.Quarternion(x);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, quarternion);
    }
  });

  quarternion.toTex = {
    0: 'unfinished'
  };

  return quarternion;
}

exports.name = 'quarternion';
exports.factory = factory;
