/**
 * Calculate the arc sine of x
 *
 * arcsin(x) = x + (1/2)*x^3/3 + (3/8)*x^5/5 + (15/48)*x^7/7 ...
 *           = x + (1/2)*x^2*x^1/3 + [(1*3)/(2*4)]*x^2*x^3/5 + [(1*3*5)/(2*4*6)]*x^2*x^5/7 ...
 *
 * @param {BigNumber} x
 * @param {number} precision
 * @returns {BigNumber} arc sine of x
 */
module.exports = function asinTaylor(x, precision) {
  var BigNumber = x.constructor;
  BigNumber.config({precision: precision + Math.log(precision) | 0 + 4});

  var one = new BigNumber(1);
  var y = x;
  var yPrev = NaN;
  var x2 = x.times(x);
  var polyNum = x;
  var constNum = new BigNumber(one);
  var constDen = new BigNumber(one);

  var bigK = new BigNumber(one);
  for (var k = 3; !y.equals(yPrev); k += 2) {
    polyNum = polyNum.times(x2);

    constNum = constNum.times(bigK);
    constDen = constDen.times(bigK.plus(one));

    yPrev = y;
    bigK = new BigNumber(k);
    y = y.plus(polyNum.times(constNum).div(bigK.times(constDen)));
  }

  BigNumber.config({precision: precision});
  return y.toDP(precision - 1);
}
