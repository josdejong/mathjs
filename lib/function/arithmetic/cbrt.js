'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));
  var complexMultiply = typed.find(load(require('./multiplyScalar')), ['Complex,Complex']);
  var complexExp      = typed.find(load(require('./exp')), ['Complex']);

  /**
   * Calculate the cubic root of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cbrt(x)
   *
   * Examples:
   *
   *    math.cbrt(27);              // returns 3
   *    math.cube(3);               // returns 27
   *    math.cbrt(-64);             // returns -4
   *    math.cbrt([27, 64, 125]);   // returns [3, 4, 5]
   *
   *    var x = math.complex('8i');
   *    math.cbrt(x);               // returns Complex 1.7320508075689 + i
   *    math.cbrt(x, true);         // returns Matrix [
   *                                //    1.7320508075689 + i
   *                                //   -1.7320508075689 + i
   *                                //   -2i
   *                                // ]
   *
   * See also:
   *
   *    square, sqrt, cube
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x
   *            Value for which to calculate the cubic root.
   * @param {boolean} [allRoots]  Optional, false by default. Only applicable
   *            for complex valued `x`. If true, all complex roots are returned,
   *            if false (default) the principal root is returned.
   * @return {number | BigNumber | Complex | Array | Matrix}
   *            Returns the cubic root of `x`
   */
  var cbrt = typed('cbrt', {
    'number': _cbrtNumber,
    // TODO: implement 'number, boolean' to return all roots

    'Complex': _cbrtComplex,

    'Complex, boolean': _cbrtComplex,

    'BigNumber': _cbrtBigNumber,
    // TODO: implement 'BigNumber, boolean' to return all roots

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since sqrt(0) = 0
      return deepMap(x, cbrt, true);
    }

    // TODO: implement support for Units

  });

  /**
   * Calculate cbrt for a number
   *
   * Code from es6-shim.js:
   *   https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js#L1564-L1577
   *
   * @param {number} x
   * @returns {number | Complex} Returns the cubic root of x
   * @private
   */
  function _cbrtNumber(x) {
    if (x === 0) {
      return x;
    }

    var negate = x < 0;
    var result;
    if (negate) {
      x = -x;
    }

    if (x === Infinity) {
      result = Infinity;
    } else {
      result = Math.exp(Math.log(x) / 3);
      // from http://en.wikipedia.org/wiki/Cube_root#Numerical_methods
      result = (x / (result * result) + (2 * result)) / 3;
    }

    return negate ? -result : result;
  }

  /**
   * Calculate the cubic root for a complex number
   * @param {Complex} x
   * @param {boolean} [allRoots]   If true, the function will return an array
   *                               with all three roots. If false or undefined,
   *                               the principal root is returned.
   * @returns {Complex | Array.<Complex> | Matrix.<Complex>} Returns the cubic root(s) of x
   * @private
   */
  function _cbrtComplex(x, allRoots) {
    // https://www.wikiwand.com/en/Cube_root#/Complex_numbers
    var polar = x.toPolar();

    // principal root:
    var principal = complexMultiply(
        new type.Complex(_cbrtNumber(polar.r), 0),
        complexExp(new type.Complex(0, polar.phi / 3))
    );

    if (allRoots) {
      var all = [
          principal,
          complexMultiply(
            new type.Complex(_cbrtNumber(polar.r), 0),
            complexExp(new type.Complex(0, polar.phi / 3 + Math.PI * 2 / 3))
          ),
          complexMultiply(
            new type.Complex(_cbrtNumber(polar.r), 0),
            complexExp(new type.Complex(0, polar.phi / 3 - Math.PI * 2 / 3))
          )
      ];

      return (config.matrix === 'array') ? all : matrix(all);
    }
    else {
      return principal;
    }
  }

  /**
   * Calculate the cubic root for a BigNumber
   * @param {BigNumber} x
   * @returns {BigNumber} Returns the cubic root of x
   * @private
   */
  function _cbrtBigNumber(x) {
    if (x.isZero()) {
      return x;
    }

    var negate = x.isNegative();
    var result;
    if (negate) {
      x = x.neg();
    }

    if (!x.isFinite()) {
      result = Infinity;
    } else {
      // from http://en.wikipedia.org/wiki/Cube_root#Numerical_methods
      result = x.ln().div(3).exp();
      result = x.div(result.times(result)).plus(result.times(2)).div(3);
    }

    return negate ? result.neg() : result;
  }

  cbrt.toTex = '\\sqrt[3]{${args[0]}}';

  return cbrt;
}

exports.name = 'cbrt';
exports.factory = factory;
