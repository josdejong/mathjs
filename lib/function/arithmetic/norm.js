'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

    BigNumber = math.type.BigNumber,
    Complex = require('../../type/Complex'),
    Matrix = math.type.Matrix,

    isNumber = util.number.isNumber,
    isBoolean = util['boolean'].isBoolean,
    isComplex = Complex.isComplex,
    isArray = Array.isArray;

  /**
   * Calculate the norm of a number, vector or matrix.
   *
   * The second parameter p is optional. If not provided, it defaults to 2.
   *
   * Syntax:
   *
   *    math.norm(x)
   *    math.norm(x, p)
   *
   * Examples:
   *
   *    math.abs(-3.5);                         // returns 3.5
   *    math.norm(-3.5);                        // returns 3.5
   *
   *    math.norm(math.complex(3, -4));         // returns 5
   *
   *    math.norm([1, 2, -3], Infinity);        // returns 3
   *    math.norm([1, 2, -3], -Infinity);       // returns 1
   *
   *    math.norm([3, 4], 2);                   // returns 5
   *
   *    math.norm([[1, 2], [3, 4]], 1)          // returns 6
   *    math.norm([[1, 2], [3, 4]], 'inf');     // returns 7
   *    math.norm([[1, 2], [3, 4]], 'fro');     // returns 5.477225575051661
   *
   * See also:
   *
   *    abs
   *
   * @param  {Number | BigNumber | Complex | Boolean | Array | Matrix | null} x
   *            Value for which to calculate the norm
   * @param  {Number | String} [p=2]
   *            Vector space.
   *            Supported numbers include Infinity and -Infinity.
   *            Supported strings are: 'inf', '-inf', and 'fro' (The Frobenius norm)
   * @return {Number} the p-norm
   */
  math.norm = function norm(x, p) {
    if (arguments.length < 1 || arguments.length > 2) {
      throw new math.error.ArgumentsError('abs', arguments.length, 1, 2);
    }

    if (isNumber(x)) {
      // norm(x) = abs(x)
      return Math.abs(x);
    }

    if (isComplex(x)) {
      // do not compute sqrt(re * re + im * im) since it will overflow with big numbers!
      var re = Math.abs(x.re);
      var im = Math.abs(x.im);
      if (re >= im) {
        var i = im / re;
        return re * Math.sqrt(1 + i * i);
      }
      var j = re / im;
      return im * Math.sqrt(1 + j * j);
    }

    if (x instanceof BigNumber) {
      // norm(x) = abs(x)
      return x.abs();
    }

    if (isBoolean(x) || x === null) {
      // norm(x) = abs(x)
      return Math.abs(x);
    }

    if (isArray(x)) {
      // use matrix optimized operations
      return norm(math.matrix(x), p);
    }
    
    if (x instanceof Matrix) {
      // size
      var sizeX = x.size();
      // missing p
      if (p == null)
        p = 2;
      // check it is a Vector
      if (sizeX.length == 1) {
        // check p
        if (p === Number.POSITIVE_INFINITY || p === 'inf') {
          // norm(x, Infinity) = max(abs(x))
          var n;
          x.forEach(
            function (value) {
              var v = math.abs(value);
              if (!n || math.larger(v, n))
                n = v;
            },
            true);
          return n;
        }
        if (p === Number.NEGATIVE_INFINITY || p === '-inf') {
          // norm(x, -Infinity) = min(abs(x))
          var n;
          x.forEach(
            function (value) {
              var v = math.abs(value);
              if (!n || math.smaller(v, n))
                n = v;
            },
            true);
          return n;
        }
        if (p === 'fro')
            return norm(x);
        if (isNumber(p) && !isNaN(p)) {
          // check p != 0
          if (!math.equal(p, 0)) {
            // norm(x, p) = sum(abs(xi) ^ p) ^ 1/p
            var n = 0;
            x.forEach(
              function (value) {
                n = math.add(math.pow(math.abs(value), p), n);
              },
              true);
            return math.pow(n, 1 / p);
          }
          return Number.POSITIVE_INFINITY;
        }
        // invalid parameter value
        throw new Error('Unsupported parameter value');
      }
      else if (sizeX.length == 2) {
        // check p
        if (p == 1) {
          // norm(x) = the largest column sum
          var c = [];
          x.forEach(
            function (value, index) {
              var j = index[1];
              c[j] = math.add(c[j] || 0, math.abs(value));
            },
            true);
          return math.max(c);
        }
        if (p == Number.POSITIVE_INFINITY || p === 'inf') {
          // norm(x) = the largest row sum
          var r = [];
          x.forEach(
            function (value, index) {
              var i = index[0];
              r[i] = math.add(r[i] || 0, math.abs(value));
            },
            true);
          return math.max(r);
        }
        if (p === 'fro') {
          // norm(x) = sqrt(sum(diag(x'x)))
          return math.sqrt(x.transpose().multiply(x).trace());
        }
        if (p == 2) {
          // not implemented
          throw new Error('Unsupported parameter value, missing implementation of matrix singular value decomposition');
        }
        // invalid parameter value
        throw new Error('Unsupported parameter value');
      }
    }

    throw new math.error.UnsupportedTypeError('norm', x);
  };
};
