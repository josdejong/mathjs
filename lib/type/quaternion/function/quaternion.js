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
   *           r : number, i : number,
   *           j: number, k: number                  // creates a quaternion value with provided from an object
   *     })
   *
   *     math.quaternion({r : number})
   *     math.quaternion({j : number})               // creates a quaternion value with provided components value
   *     math.quaternion({k : number})
   *
   *     math.quaternion(Complex)                    // creates a quaternion with the equivilent value of the complex number
   *                                                 // e.g. a + bi --> a + bi + 0j + 0k
   *
   *     math.quaternion(Complex, Complex)           // another way to represent quaternions is:
   *                                                 // (a + bi) + (c + di)j = a + bi + cj + dk
   *                                                 // this is 2 complex numbers 1 multipled by j
   *
   *
   *     math.quaternion(string)                     // parses a string into a quaternion value.
   *
   *     math.quaternion({re: number, im: number})   // creates a quaternion value with provided
   *                                                 // values for real an imaginary part.
   *     math.quaternion({r: number, phi: number})   // creates a quaternion value with provided
   *                                                 // polar coordinates
   *     math.quaterion({r: number, i: number})
   *
   *     var array = [[1,-2,-3,-4],[2,1,-4,3],[3,2,1,-4],[4,-3,2,1]]
   *     var matrix = math.matrix(array)
   *     var q = math.quaternion(array)               // creates a quaternion equal to q = 1 + 2i + 3j + 4k
   *     var p = math.quaternion(matrix)              // for this to be possible the lead diagonal of the matrix must all be the same
   *     p === q // true                              // and each element must be the negative of its reflection in the lead diagonal
   *                                                  // this can be writen as: M + M(T) = 2 * tr(M)
   *                                                  // the sum of the matrix and its transpoce must be twice the trace of the matrix
   *                                                  // for the matrix to be able to be writen as a quaternion
   *
   *
   * Examples:
   *
   *    var a = math.quaternion(3, -4, 12, 3);       // a = Quaternion 3 - 4i + 12j + 3k
   *    a.r = 5;                                     // a = Quaternion 5 - 4i + 12j + 3k
   *    var b = a.i;                                 // Number -4;
   *    var c = math.quaternion('2 + 6i - 5j -2k');  // Quaternion 2 + 6i - 5j -2k
   *    var d = math.quaternion();                   // Quaternion 0 + 0i + 0j + 0k
   *    var e = math.quaternion(5 + 2i, 7 + i);      // Quaternion 5 + 2i + 7j + k
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
      return new type.Quaternion(x);
    },

    'Object': function (x) {
      return new type.Quaternion(x);
    },

    'Complex, Complex': function (x,y) {
      return new type.Quaternion(x,y);
    },

    'Array | Matrix': function (x) {
      return new type.Quaternion(x);
    },

    'number, number, Object' : function (x,y,z) {
      return new type.Quaternion(x,y,z);
    }
  });

  quaternion.toTex = {
    0: 'unfinished'
  };

  return quaternion;
}

exports.name = 'quaternion';
exports.factory = factory;
