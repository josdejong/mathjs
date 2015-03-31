'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

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
   *     math.nthRoot(a)
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
  var nthRoot = typed('nthRoot', {
    'number': function (x) {
      return _nthRoot(x, 2);
    },
    'number, number': _nthRoot,

    'BigNumber': function (x) {
      return _bigNthRoot(x, new type.BigNumber(2));
    },
    'BigNumber, BigNumber': _bigNthRoot,

    'Array | Matrix': function (x) {
      return collection.deepMap(x, nthRoot);
    },

    'Array | Matrix, any': function (x, root) {
      return collection.deepMap2(x, root, nthRoot);
    },

    'any, Array | Matrix': function (x, root) {
      return collection.deepMap2(x, root, nthRoot);
    }
  });

  return nthRoot;

  /**
   * Calculate the nth root of a for BigNumbers, solve x^root == a
   * http://rosettacode.org/wiki/Nth_root#JavaScript
   * @param {BigNumber} a
   * @param {BigNumber} root
   * @private
   */
  function _bigNthRoot(a, root) {
    var zero = new type.BigNumber(0);
    var one = new type.BigNumber(1);
    var inv = root.isNegative();
    if (inv) root = root.negated();

    if (root.isZero()) throw new Error('Root must be non-zero');
    if (a.isNegative() && !root.abs().mod(2).equals(1)) throw new Error('Root must be odd when a is negative.');

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
      var delta = a.div(x.pow(root.minus(1))).minus(x).div(root);
      x = x.plus(delta);
      i++;
    }
    while (!x.equals(xPrev) && i < iMax);

    return inv ? one.div(x) : x;
  }
}

/**
 * Calculate the nth root of a, solve x^root == a
 * http://rosettacode.org/wiki/Nth_root#JavaScript
 * @param {number} a
 * @param {number} root
 * @private
 */
function _nthRoot(a, root) {
  var inv = root < 0;
  if (inv) root = -root;

  if (root === 0) throw new Error('Root must be non-zero');
  if (a < 0 && (Math.abs(root) % 2 != 1)) throw new Error('Root must be odd when a is negative.');

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
    var delta = (a / Math.pow(x, root - 1) - x) / root;
    x = x + delta;
    i++;
  }
  while (Math.abs(delta) > epsilon && i < iMax);

  return inv ? 1 / x : x;
}

exports.name = 'nthRoot';
exports.factory = factory;
