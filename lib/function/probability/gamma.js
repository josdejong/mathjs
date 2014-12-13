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
   * Compute the gamma function of a value using Lanczos approximation.
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
   *    math.gamma(-0.5);    // returns 2.2181595437577
   *    math.gamma(math.i);  // returns -0.15494982830181 - 0.49801566811836i
   *
   * See also:
   *
   *    combinations, factorial, permutations
   *
   * @param {Number | BigNumber | Array | Matrix | Boolean | null} n   An integer number
   * @return {Number | BigNumber | Array | Matrix}    The gamma of `n`
   */
  math.gamma = function gamma (n) {
    var g = 7;
    var t, x, prev, result, ltHalf;
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
        return math.factorial(n-1);
      }

      ltHalf = n < 0.5;
      if (ltHalf) {
        prev = n;
        n = 1 - n;
      }

      --n;

      x = p[0];
      for (var i = 1; i < g + 2; ++i) {
        x += p[i] / (n+i);
      }

      t = n + g + 0.5;
      result = Math.sqrt(2*Math.PI) * Math.pow(t, n+0.5) * Math.exp(-t) * x;
      if (!ltHalf) {
        return result;
      }
      return Math.PI / (Math.sin(Math.PI * prev)*result)
    }

    if (isComplex(n)) {
      if (n.im == 0) {
        return gamma(n.re);
      }

      ltHalf = n.re < 0.5;
      if (ltHalf) {
        prev = new Complex(n.re, n.im);
        n = new Complex((1 - n.re) - 1, -n.im);
      } else {
        n = new Complex(n.re - 1, n.im);
      }

      x = new Complex(p[0], 0);
      for (var i = 1; i < g + 2; ++i) {
        var real = n.re + i;                                // x += p[i]/(n+i)
        var den = real * real + n.im * n.im;
        if (den != 0) {
          x.re += p[i] * real / den;
          x.im += -(p[i] * n.im) / den;
        } else {
          x.re = p[i] < 0
            ? -Infinity
            : Infinity;
        }
      }

      t = new Complex(n.re + g + 0.5, n.im);
      var twoPiSqrt = Math.sqrt(2*Math.PI);

      n.re += 0.5;
      var result = math.pow(t, n);
      if (result.im == 0) {                                 // sqrt(2*PI)*result
        result.re *= twoPiSqrt;
      } else if (result.re == 0) {
        result.im *= twoPiSqrt;
      } else {
        result.re *= twoPiSqrt;
        result.im *= twoPiSqrt;
      }

      var r = Math.exp(-t.re);                              // exp(-t)
      t.re = r * Math.cos(-t.im);
      t.im = r * Math.sin(-t.im);

      result = math.multiply(math.multiply(result, t), x);
      if (!ltHalf) {
        return result;
      }

      if (prev.im == 0) {                                   // PI * prev
        prev.re *= Math.PI;
      } else if (prev.re == 0) {
        prev.im *= Math.PI;
      } else {
        prev.re *= Math.PI;
        prev.im *= Math.PI;
      }

      var tmpRe = prev.re;                                  // sin(prev)
      prev.re = Math.sin(tmpRe) * math.cosh(-prev.im);
      prev.im = Math.cos(tmpRe) * math.sinh( prev.im);

      result = math.multiply(prev, result);

      var den = result.re*result.re + result.im*result.im;  // PI / result
      if (den != 0) {
        result.re = result.re * Math.PI / den;
        result.im = -(Math.PI * result.im) / den;
      } else {
        result.re = Infinity;
        result.im = 0;
      }
      return result;
    }

    if (n instanceof BigNumber) {
      if (n.isInteger()) {
        if (n.isNegative() || n.isZero()) {
          return new BigNumber(Infinity);
        }
        return math.factorial(n.minus(1));
      }

      if (!n.isFinite()) {
        return new BigNumber(n.isNegative()
          ? NaN
          : n
        );
      }

      //var pi = math.create({ number: 'bignumber', precision: config.precision }).pi;
      var pi = new BigNumber(Math.PI + '');
      var one = new BigNumber(1);

      /*ltHalf = n.lt(0.5);
      if (ltHalf) {
        prev = n;
        n = one.minus(n);
      }*/

      n = n.minus(one);

      x = bigP[0];
      var a = new BigNumber(one);
      for (var i = 1; i < g + 2; ++i) {
        x = x.plus(bigP[i].div(n.plus(a)));
        a = a.plus(one);
      }

      t = n.plus(g + 0.5);
      result = pi.times(2).sqrt().times(
                 t.pow(n.plus(0.5)).times(t.neg().exp().times(x)));
      //if (!ltHalf) {
      return result;
      //}
      //return pi.divide(pi.times(prev).sin().times(result));
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
     0.99999999999980993,
     676.5203681218851,
    -1259.1392167224028,
     771.32342877765313,
    -176.61502916214059,
     12.507343278686905,
    -0.13857109526572012,
     9.9843695780195716e-6,
     1.5056327351493116e-7
  ];

  var bigP = [
    new BigNumber('0.99999999999980993'),
    new BigNumber('676.5203681218851'),
    new BigNumber('-1259.1392167224028'),
    new BigNumber('771.32342877765313'),
    new BigNumber('-176.61502916214059'),
    new BigNumber('12.507343278686905'),
    new BigNumber('-0.13857109526572012'),
    new BigNumber('9.9843695780195716e-6'),
    new BigNumber('1.5056327351493116e-7')
  ];
};
