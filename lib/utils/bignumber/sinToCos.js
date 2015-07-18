/**
 * Convert from sine to cosine
 *
 * |cos(x)| = sqrt(1 - sin(x)^2)
 *
 * @param {BigNumber} value    Sine value of x
 * @returns {BigNumber} sine as cosine
 */
module.exports = function sinToCos(value) {
  var BigNumber = value.constructor;
  var precision = BigNumber.precision;
  BigNumber.config({precision: precision + 2});

  var ret = BigNumber.ONE.minus(value.times(value)).sqrt();

  BigNumber.config({precision: precision});
  return ret.toDP(precision - 1);
};
