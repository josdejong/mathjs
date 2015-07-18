/**
 * Calculate the hyperbolic arccosine, arcsine, arcsecant, or arccosecant of x
 *
 * acosh(x) = ln(x + sqrt(x^2 - 1))
 *
 * asinh(x) = ln(x + sqrt(x^2 + 1))
 *
 * asech(x) = acosh(1 / x)
 *
 * acsch(x) = asinh(1 / x)
 *
 * @param {BigNumber} x
 * @param {function} BigNumber   BigNumber constructor
 * @param {boolean} mode         sine function if true, cosine function if false
 * @param {boolean} reciprocal   is sec or csc
 * @returns {BigNumber} hyperbolic arccosine, arcsine, arcsecant, or arccosecant of x
 */
module.exports = function acoshAsinhAsechAcsch(x, BigNumber, mode, reciprocal) {
  if (x.isNaN()) {
    return new BigNumber(NaN);
  }
  if (reciprocal && x.isZero()) {
    return new BigNumber(Infinity);
  }
  if (!mode) {
    if (reciprocal) {
      if (x.isNegative() || x.gt(BigNumber.ONE)) {
        throw new Error('asech() only has non-complex values for 0 <= x <= 1.');
      }
    } else if (x.lt(BigNumber.ONE)) {
      throw new Error('acosh() only has non-complex values for x >= 1.');
    }
  }

  var precision = BigNumber.precision;
  BigNumber.config({precision: precision + 4});

  var y = new BigNumber(x);
  y.constructor = BigNumber;

  if (reciprocal) {
    y = BigNumber.ONE.div(y);
  }

  var x2PlusOrMinus = (mode) ? y.times(y).plus(BigNumber.ONE) : y.times(y).minus(BigNumber.ONE);
  var ret = y.plus(x2PlusOrMinus.sqrt()).ln();

  BigNumber.config({precision: precision});
  return new BigNumber(ret.toPrecision(precision));
};
