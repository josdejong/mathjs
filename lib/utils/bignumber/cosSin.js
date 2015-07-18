/**
 * Calculate the cosine or sine of x using Taylor Series.
 *
 * cos(x) = 1 - x^2/2! + x^4/4! - x^6/6! + x^8/8! - ...
 *        = 1 - 1*x^2/2! + x^2*x^2/4! - x^2*x^4/6! + x^2*x^6/8! - ...
 *
 * sin(x) = x - x^3/3! + x^5/5! - x^7/7! + x^9/9! - ...
 *        = x - x^2*x^1/3! + x^2*x^3/5! - x^2*x^5/7! + x^2*x^7/9! - ...
 *
 * @param {BigNumber} x     reduced argument
 * @param {number} mode     sine function if 1, cosine function if 0
 * @returns {BigNumber} sine or cosine of x
 */
module.exports = function cosSin(x, mode) {
  var one = x.constructor.ONE;

  var y = x;
  var yPrev = NaN;
  var x2 = x.times(x);
  var num = (mode) ? y : y = one;
  var den = one;
  var add = true;

  for (var k = mode; !y.equals(yPrev); k += 2) {
    num = num.times(x2);
    den = den.times(k+1).times(k+2);

    yPrev = y;
    add = !add;
    y = (add) ? y.plus(num.div(den)) : y.minus(num.div(den));
  }

  return y;
};
