'use strict';

module.exports = function(math, config) {

  var util = require('../../util/index'),
      isNumber = util.number.isNumber,
      collection = math.collection,
      isCollection = collection.isCollection;

  /**
   * Logarithm of the gamma function.
   * Based off of Tom Minka's lightspeed toolbox.
   *
   *
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

};
