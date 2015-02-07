'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      isCollection = collection.isCollection;

  /**
   * Compute the gamma function of a value using Lanczos approximation for
   * small values, and an extended Stirling approximation for large values.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.gamma(n)
   *
   * Examples:
   *
   *    math.gamma(5);       // returns 24
   *    math.gamma(-0.5);    // returns -3.5449077018110335
   *    math.gamma(math.i);  // returns -0.15494982830180973 - 0.49801566811835596i
   *
   * See also:
   *
   *    combinations, factorial, permutations
   *
   * @param {Number | Array | Matrix | Boolean | null} n   An integer number
   * @return {Number | Array | Matrix}    The gamma of `n`
   */
  math.gamma = function gamma (n) {
    var t, x;
    var g = 4.7421875;

    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('gamma', arguments.length, 1);
    }

    if (isNumber(n)) {
      if (isInteger(n)) {
        if (n <= 0) {
          return isFinite(n)
            ? Infinity
            : NaN;
        }

        if (n > 171) {
          return Infinity;                  // Will overflow
        }

        var value = n - 2;
        var res = n - 1;
        while (value > 1) {
          res *= value;
          value--;
        }

        if (res == 0) {
          res = 1;                          // 0! is per definition 1
        }

        return res;
      }

      if (n < 0.5) {
        return Math.PI / (Math.sin(Math.PI*n) * gamma(1-n));
      }

      if (n >= 171.35) {
        return Infinity;                    // will overflow
      }

      if (n > 85.0) {                       // Extended Stirling Approx
        var twoN = n*n;
        var threeN = twoN*n;
        var fourN = threeN*n;
        var fiveN = fourN*n;
        return Math.sqrt(2*Math.PI/n) * Math.pow((n/Math.E), n) *
          (1 + 1/(12*n) + 1/(288*twoN) - 139/(51840*threeN) -
           571/(2488320*fourN) + 163879/(209018880*fiveN) +
           5246819/(75246796800*fiveN*n));
      }

      --n;
      x = p[0];
      for (var i = 1; i < p.length; ++i) {
        x += p[i] / (n+i);
      }

      t = n + g + 0.5;
      return Math.sqrt(2*Math.PI) * Math.pow(t, n+0.5) * Math.exp(-t) * x;
    }

    if (isComplex(n)) {
      if (n.im == 0) {
        return gamma(n.re);
      }

      n = new Complex(n.re - 1, n.im);
      x = new Complex(p[0], 0);
      for (var i = 1; i < p.length; ++i) {
        var real = n.re + i;                // x += p[i]/(n+i)
        var den = real*real + n.im*n.im;
        if (den != 0) {
          x.re += p[i] * real / den;
          x.im += -(p[i] * n.im) / den;
        } else {
          x.re = p[i] < 0
            ? -Infinity
            :  Infinity;
        }
      }

      t = new Complex(n.re + g + 0.5, n.im);
      var twoPiSqrt = Math.sqrt(2*Math.PI);

      n.re += 0.5;
      var result = math.pow(t, n);
      if (result.im == 0) {                 // sqrt(2*PI)*result
        result.re *= twoPiSqrt;
      } else if (result.re == 0) {
        result.im *= twoPiSqrt;
      } else {
        result.re *= twoPiSqrt;
        result.im *= twoPiSqrt;
      }

      var r = Math.exp(-t.re);              // exp(-t)
      t.re = r * Math.cos(-t.im);
      t.im = r * Math.sin(-t.im);

      return math.multiply(math.multiply(result, t), x);
    }

    if (n instanceof BigNumber) {
      if (n.isInteger()) {
        return n.isNegative() || n.isZero()
          ? new BigNumber(Infinity)
          : math.factorial(n.minus(1));
      }

      if (!n.isFinite()) {
        return new BigNumber(n.isNegative()
          ? NaN
          : Infinity);
      }
    }

    if (isBoolean(n) || n === null) {
      return n
        ? 1
        : Infinity;
    }

    if (isCollection(n)) {
      return collection.deepMap(n, gamma);
    }

    throw new math.error.UnsupportedTypeError('gamma', math['typeof'](n));
  };

  var p = [
     0.99999999999999709182,
     57.156235665862923517,
    -59.597960355475491248,
     14.136097974741747174,
    -0.49191381609762019978,
     0.33994649984811888699e-4,
     0.46523628927048575665e-4,
    -0.98374475304879564677e-4,
     0.15808870322491248884e-3,
    -0.21026444172410488319e-3,
     0.21743961811521264320e-3,
    -0.16431810653676389022e-3,
     0.84418223983852743293e-4,
    -0.26190838401581408670e-4,
     0.36899182659531622704e-5
  ];

};
