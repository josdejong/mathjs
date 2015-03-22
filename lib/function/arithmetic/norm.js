'use strict';

var collection = require('../../type/collection');
var size = require('../../../lib/util/array').size;

function factory (type, config, load, typed) {
  var abs       = load(require('../arithmetic/abs'));
  var add       = load(require('../arithmetic/add'));
  var multiply  = load(require('../arithmetic/multiply'));
  var pow       = load(require('../arithmetic/pow'));
  var sqrt      = load(require('../arithmetic/sqrt'));
  var equal     = load(require('../relational/equal'));
  var larger    = load(require('../relational/larger'));
  var smaller   = load(require('../relational/smaller'));
  var max       = load(require('../statistics/max'));
  var sum       = load(require('../statistics/sum'));
  var diag      = load(require('../matrix/diag'));
  var transpose = load(require('../matrix/transpose'));

  var complexAbs = abs.signatures['Complex'];

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
   * @param  {Number | BigNumber | String} [p=2]
   *            Vector space.
   *            Supported numbers include Infinity and -Infinity.
   *            Supported strings are: 'inf', '-inf', and 'fro' (The Frobenius norm)
   * @return {Number | BigNumber} the p-norm
   */
  var norm = typed('norm', {
    'number': Math.abs,

    'Complex': complexAbs,

    'BigNumber': function (x) {
      return x.abs();
    },

    'Array | Matrix': function (x) {
      return _norm(x.valueOf(), 2);
    },

    'number | Complex | BigNumber, number | BigNumber | string': function (x, p) {
      return norm(x);
    },

    'Array | Matrix, number | BigNumber | string': function (x, p) {
      return _norm(x.valueOf(), p.valueOf());
    }
  });

  /**
   * Calculate the norm for an array
   * @param {Array} x
   * @param {number | string} p
   * @returns {number} Returns the norm
   * @private
   */
  function _norm (x, p) {
    // size
    var sizeX = size(x);

    // check if it is a vector
    if (sizeX.length == 1) {
      // check p
      if (p === Number.POSITIVE_INFINITY || p === 'inf') {
        // norm(x, Infinity) = max(abs(x))
        var n;
        for (var i = 0; i < x.length; i++) {
          var v = abs(x[i]);
          if (!n || larger(v, n)) {
            n = v;
          }
        }
        return n;
      }
      else if (p === Number.NEGATIVE_INFINITY || p === '-inf') {
        // norm(x, -Infinity) = min(abs(x))
        var n;
        for (var i = 0; i < x.length; i++) {
          var v = abs(x[i]);
          if (!n || smaller(v, n)) {
            n = v;
          }
        }
        return n;
      }
      else if (p === 'fro') {
        return norm(x);
      }
      else if (typeof p === 'number' && !isNaN(p)) {
        // check p != 0
        if (!equal(p, 0)) {
          // norm(x, p) = sum(abs(xi) ^ p) ^ 1/p
          var n = 0;
          for (var i = 0; i < x.length; i++) {
            n = add(pow(abs(x[i]), p), n);
          }
          return pow(n, 1 / p);
        }
        return Number.POSITIVE_INFINITY;
      }
      else {
        // invalid parameter value
        throw new Error('Unsupported parameter value');
      }
    }
    else if (sizeX.length == 2) {
      // check p
      if (p === 1) {
        // norm(x) = the largest column sum
        var c = [];
        // loop rows
        for (var i = 0; i < x.length; i++) {
          var r = x[i];
          // loop columns
          for (var j = 0; j < r.length; j++) {
            c[j] = add(c[j] || 0, abs(r[j]));
          }
        }
        return max(c); // TODO: improve performance by immediately calculating the max in the for loops
      }
      else if (p === Number.POSITIVE_INFINITY || p === 'inf') {
        // norm(x) = the largest row sum
        var n = 0;
        // loop rows
        for (var i = 0; i < x.length; i++) {
          var rs = 0;
          var r = x[i];
          // loop columns
          for (var j = 0; j < r.length; j++) {
            rs = add(rs, abs(r[j]));
          }
          if (larger(rs, n)) {
            n = rs;
          }
        }
        return n;
      }
      else if (p === 'fro') {
        // norm(x) = sqrt(sum(diag(x'x)))
        return sqrt(sum(diag(multiply(transpose(x), x))));
      }
      else if (p == 2) {
        // not implemented
        throw new Error('Unsupported parameter value, missing implementation of matrix singular value decomposition');
      }
      else {
        // invalid parameter value
        throw new Error('Unsupported parameter value');
      }
    }
  }

  return norm;
}

exports.type = 'function';
exports.name = 'norm';
exports.factory = factory;
