/**
 * Calculate the arc tangent of x using a Taylor expansion
 *
 * arctan(x) = x - x^3/3 + x^5/5 - x^7/7 + x^9/9 - ...
 *           = x - x^2*x^1/3 + x^2*x^3/5 - x^2*x^5/7 + x^2*x^7/9 - ...
 *
 * @param {BigNumber} x
 * @returns {BigNumber} arc tangent of x
 */
module.exports = function atan(x) {
  var y = x;
  var yPrev = NaN;
  var x2 = x.times(x);
  var num = x;
  var add = true;

  for (var k = 3; !y.equals(yPrev); k += 2) {
    num = num.times(x2);

    yPrev = y;
    add = !add;
    y = (add) ? y.plus(num.div(k)) : y.minus(num.div(k));
  }

  return y;
};
