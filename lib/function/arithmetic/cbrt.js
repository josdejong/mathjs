'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var unaryMinus = load(require('./unaryMinus'));
  var isNegative = load(require('../utils/isNegative'));
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
   *    math.cbrt(27);                  // returns 3
   *    math.cube(3);                   // returns 27
   *    math.cbrt(-64);                 // returns -4
   *    math.cbrt(math.unit('27 m^3')); // returns Unit 3 m
   *    math.cbrt([27, 64, 125]);       // returns [3, 4, 5]
   *
   *    var x = math.complex('8i');
   *    math.cbrt(x);                   // returns Complex 1.7320508075689 + i
   *    math.cbrt(x, true);             // returns Matrix [
   *                                    //    1.7320508075689 + i
   *                                    //   -1.7320508075689 + i
   *                                    //   -2i
   *                                    // ]
   *
   * See also:
   *
   *    square, sqrt, cube
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x
   *            Value for which to calculate the cubic root.
   * @param {boolean} [allRoots]  Optional, false by default. Only applicable
   *            when `x` is a number or complex number. If true, all complex
   *            roots are returned, if false (default) the principal root is
   *            returned.
   * @return {number | BigNumber | Complex | Unit | Array | Matrix}
   *            Returns the cubic root of `x`
   */
  var cbrt = typed('cbrt', {
    'number': _cbrtNumber,
    // note: signature 'number, boolean' is also supported,
    //       created by typed as it knows how to convert number to Complex

    'Complex': _cbrtComplex,

    'Complex, boolean': _cbrtComplex,

    'BigNumber': _cbrtBigNumber,

    'Unit': _cbrtUnit,

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since cbrt(0) = 0
      return deepMap(x, cbrt, true);
    }
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

    if (isFinite(x)) {
      result = Math.exp(Math.log(x) / 3);
      // from http://en.wikipedia.org/wiki/Cube_root#Numerical_methods
      result = (x / (result * result) + (2 * result)) / 3;
    } else {
      result = x;
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

  /**
   * Calculate the cubic root for a Unit
   * @param {Unit} x
   * @return {Unit} Returns the cubic root of x
   * @private
   */
  function _cbrtUnit(x) {
    if(x.value && x.value.isComplex) {
      var result = x.clone();
      result.value = 1.0;
      result = result.pow(1.0/3);           // Compute the units
      result.value = _cbrtComplex(x.value); // Compute the value
      return result;
    }
    else {
      var negate = isNegative(x.value);
      if (negate) {
        x.value = unaryMinus(x.value);
      }

      // TODO: create a helper function for this
      var third;
      if (x.value && x.value.isBigNumber) {
        third = new type.BigNumber(1).div(3);
      }
      else if (x.value && x.value.isFraction) {
        third = new type.Fraction(1, 3);
      }
      else {
        third = 1/3;
      }

      var result = x.pow(third);

      if (negate) {
        result.value = unaryMinus(result.value);
      }

      return result;
    }
  }

  cbrt.toTex = '\\sqrt[3]{${args[0]}}';

  return cbrt;
}

exports.name = 'cbrt';
exports.factory = factory;
