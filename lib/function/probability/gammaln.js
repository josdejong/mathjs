'use strict';

module.exports = function(math, config) {

  var util = require('../../util/index'),
      isNumber = util.number.isNumber,
      collection = math.collection,
      isCollection = collection.isCollection;

  /**
   * Logarithm of the gamma function for real, positive numbers.
   * Based off of Tom Minka's lightspeed toolbox.
   *
   * For matrices, the function works elementwise.
   *
   * Syntax:
   *
   *    math.gammaln(x)
   *
   * Examples:
   *
   *    math.gammaln(3);     // returns 0.82769459232343701
   *    math.gammaln(0.)     // returns Infinity
   *    math.gammaln(-0.5);  // returns NaN
   *
   * See also:
   *
   *    gamma
   *
   * @param {Number | Array | Matrix} x  A real number > 0.
   * @return {Number | Array | Matrix}  The logarathim of `gamma(x)`.
   */
  math.gammaln = function gammaln(x) {

      if (arguments.length != 1) {
          throw new math.error.ArgumentsError('gammaln', arguments.length, 1);
      }

      if(isNumber(x)) {
        if(x < 0) return NaN;
        if(x == 0) return Infinity;
        if(!isFinite(x)) return x;

        var lnSqrt2PI = 0.91893853320467274178;
        var gamma_series = [76.18009172947146,
                            -86.50532032941677,
                            24.01409824083091,
                            -1.231739572450155,
                            0.1208650973866179e-2,
                            -0.5395239384953e-5];
        var denom;
        var x1;
        var series;

        // Lanczos method
        denom = x+1;
        x1 = x + 5.5;
        series = 1.000000000190015;
        for(var i = 0; i < 6; i++) {
          series += gamma_series[i] / denom;
          denom += 1.0;
        }
        return( lnSqrt2PI + (x+0.5)*Math.log(x1) - x1 + Math.log(series/x) );
      }

      if(isCollection(x)) {
          return collection.deepMap(x, gammaln);
      }

      throw new math.error.UnsupportedTypeError('gammaln', math['typeof'](x));

  };

  /**
   * Logarithm of the multivariate Gamma function, defined as
   * Gamma_d(x) = pi^(d*(d-1)/4)*prod_{i=1..d} Gamma(x + (1-i)/2)
   * Based off of Tom Minka's lightspeed toolbox.
   * http://en.wikipedia.org/wiki/Multivariate_gamma_function
   */
  math.gammaln2 = function gammaln2(x, d) {
    if (arguments.length != 2) {
        throw new math.error.ArgumentsError('gammaln', arguments.length, 2);
    }
    var lnPI = 1.14472988584940;
    var r = d*(d-1)/4.*lnPI;
    for(var i = 0; i < d; i++) r += gammaln(x - 0.5*i);
    return r;
  };

};
