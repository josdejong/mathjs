'use strict';

var isArray = Array.isArray;

function factory (type, config, load, typed) {
  
  var lup = load(require('../decomposition/lup'));
  var matrix = load(require('../../construction/matrix'));
  
  /**
   * Solves the linear system A * x = b.
   *
   * Syntax:
   *
   *    var x = math.lusolve(matrix, b)  // returns column vector with the solution to the linear system A * x = b
   *
   *    var x = math.lusolve(lup, b)     // returns column vector with the solution to the linear system A * x = b, lup = math.lup(A)
   *
   * Examples:
   *
   *    var m = [[1, 0, 0, 0], [0, 2, 0, 0], [0, 0, 3, 0], [0, 0, 0, 4]];
   *
   *    var x = math.lusolve(m, [-1, -1, -1, -1]);        // x = [-1, -0.5, -1/3, -0.25]
   *
   *    var f = math.lup(m);
   *    var x1 = math.lusolve(f, [-1, -1, -1, -1]);        // x1 = [-1, -0.5, -1/3, -0.25]
   *    var x2 = math.lusolve(f, [1, 2, 1, -1]);           // x2 = [1, 1, 1/3, -0.25]
   *
   * See also:
   *
   *    lup
   *
   * @param {Matrix | Array | Object} a      Invertible Matrix or the Matrix LUP decomposition
   * @param {Matrix | Array} b               Column Vector
   *
   * @return {Matrix | Array}       Column vector with the solution to the linear system A * x = b
   */
  var lusolve = typed('lusolve', {
    'Array, Array | Matrix': function (a, b) {
      // convert a to matrix
      a = matrix(a);
      // matrix lup decomposition
      var d = a.lup();
      // solve
      var x = _lusolve(d.L, d.U, d.P, b);
      // convert result to array
      return x.valueOf();
    },
    'Matrix, Array | Matrix': function (a, b) {
      // matrix lup decomposition
      var d = a.lup();
      // solve
      return _lusolve(d.L, d.U, d.P, b);
    },
    'Object, Array | Matrix': function (d, b) {
      // solve
      return _lusolve(d.L, d.U, d.P, b);
    }
  });
  
  var _toMatrix = function (a) {
    // check it is a matrix
    if (a instanceof type.Matrix)
      return a;
    // check array
    if (isArray(a))
      return matrix(a);
    // throw
    throw new TypeError('Invalid Matrix LUP decomposition');
  };
  
  var _lusolve = function (l, u, p, b) {
    // verify L, U, P
    l = _toMatrix(l);
    u = _toMatrix(u);
    p = _toMatrix(p);
    // modify column vector applying permutations
    b = p.multiply(b);
    // use forward substitution to resolve L * y = b
    var y = l.forwardSubstitution(b);
    // use backward substitution to resolve U * x = y
    return u.backwardSubstitution(y);
  };

  return lusolve;
}

exports.name = 'lusolve';
exports.factory = factory;
