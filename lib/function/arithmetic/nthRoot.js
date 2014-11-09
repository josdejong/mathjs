'use strict';

module.exports = function (math) {
  var util = require('../../util/index');

  var BigNumber = math.type.BigNumber;
  var collection = require('../../type/collection');

  var isNumber = util.number.isNumber;
  var isBoolean = util['boolean'].isBoolean;
  var isCollection = collection.isCollection;

  /**
   * Calculate the nth root of a value.
   * The principal nth root of a positive real number A, is the positive real
   * solution of the equation
   *
   *     x^root = A
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *     math.nthRoot(a, root)
   *
   * Examples:
   *
   *     math.nthRoot(9, 2);    // returns 3, as 3^2 == 9
   *     math.sqrt(9);          // returns 3, as 3^2 == 9
   *     math.nthRoot(64, 3);   // returns 4, as 4^3 == 64
   *
   * See also:
   *
   *     sqrt, pow
   *
   * @param {Number | BigNumber | Boolean | Array | Matrix | null} a
   *              Value for which to calculate the nth root
   * @param {Number | BigNumber | Boolean | null} [root=2]    The root.
   * @return {Number | Complex | Array | Matrix} Returns the nth root of `a`
   */
  math.nthRoot = function nthRoot (a, root) {
    if (arguments.length != 1 && arguments.length != 2) {
      throw new math.error.ArgumentsError('nthRoot', arguments.length, 1, 2);
    }

    switch(arguments.length) {
      case 1:
        if (isNumber(a)) {
          return _nthRoot(a);
        }
        else if (a instanceof BigNumber) {
          return _nthRootBig(a);
        }
        else if (isCollection(a)) {
          return collection.deepMap(x, nthRoot);
        }

        if (isBoolean(a) || a === null) {
          return nthRoot(+a);
        }

        break;

      case 2:
        if (isNumber(a)) {
          if (isNumber(root)) {
            return _nthRoot(a, root);
          }
          else if (root instanceof BigNumber) {
            // try to convert to bignumber
            a = BigNumber.convert(a);

            if (a instanceof BigNumber) {
              return _nthRootBig(a, root);
            }
            else {
              // downgrade to number
              return _nthRoot(a, root.toNumber());
            }
          }
        }
        else if (a instanceof BigNumber) {
          // try to convert to bignumber
          if (isNumber(root)) {
            root = BigNumber.convert(root);
          }

          if (root instanceof BigNumber) {
            return _nthRootBig(a, root);
          }
          else {
            // downgrade to number
            return _nthRoot(a.toNumber(), root);
          }
        }
        else if (isCollection(a) && !isCollection(root)) {
          return collection.deepMap2(a, root, nthRoot);
        }

        if (isBoolean(a) || a === null) {
          return nthRoot(+a, root);
        }
        if (isBoolean(root) || root === null) {
          return nthRoot(a, +root);
        }

        break;

      default:
        throw new math.error.ArgumentsError('nthRoot', arguments.length, 1, 2);
    }

    if (isBoolean(x) || x === null) {
      return arguments.length == 2 ? nthRoot(+x, n) : nthRoot(+x);
    }


    throw new math.error.UnsupportedTypeError('nthRoot', math['typeof'](a), math['typeof'](root));
  };

  /**
   * Calculate the nth root of a, solve x^root == a
   * http://rosettacode.org/wiki/Nth_root#JavaScript
   * @param {number} a
   * @param {number} [root=2]
   * @private
   */
  function _nthRoot(a, root) {
    var _root = (root != undefined) ? root : 2;
    var inv = _root < 0;
    if (inv) _root = -_root;

    if (_root == 0) throw new Error('Root must be non-zero');
    if (a < 0 && (Math.abs(_root) % 2 != 1)) throw new Error('Root must be odd when a is negative.');

    // edge cases zero and infinity
    if (a == 0) return 0;
    if (!Number.isFinite(a)) {
      return inv ? 0 : a;
    }

    var epsilon = 1e-16;
    var x = 1; // Initial guess
    var i = 0;
    var iMax = 100;
    do {
      var delta = (a / Math.pow(x, _root - 1) - x) / _root;
      x = x + delta;
      i++;
    }
    while (Math.abs(delta) > epsilon && i < iMax);

    return inv ? 1 / x : x;
  }

  /**
   * Calculate the nth root of a for BigNumbers, solve x^root == a
   * http://rosettacode.org/wiki/Nth_root#JavaScript
   * @param {BigNumber} a
   * @param {BigNumber} [root=2]
   * @private
   */
  function _nthRootBig(a, root) {
    var _root = (root != undefined) ? root : new BigNumber(2);
    var zero = new BigNumber(0);
    var one = new BigNumber(1);
    var inv = _root.isNegative();
    if (inv) _root = _root.negated();

    if (_root.isZero()) throw new Error('Root must be non-zero');
    if (a.isNegative() && !_root.abs().mod(2).equals(1)) throw new Error('Root must be odd when a is negative.');

    // edge cases zero and infinity
    if (a.isZero()) return zero;
    if (!a.isFinite())
    {
      return inv ? zero : a;
    }

    var x = one; // Initial guess
    var i = 0;
    var iMax = 100;
    do {
      var xPrev = x;
      var delta = a.div(x.pow(_root.minus(1))).minus(x).div(_root);
      x = x.plus(delta);
      i++;
    }
    while (!x.equals(xPrev) && i < iMax);

    return inv ? one.div(x) : x;
  }
};
