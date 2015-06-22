'use strict';

var isInteger = require('../../util/number').isInteger;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));
  var multiply   = load(require('../arithmetic/multiply'));
  var pow        = load(require('../arithmetic/pow'));

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
   * @param {number | Array | Matrix} n   A real or complex number
   * @return {number | Array | Matrix}    The gamma of `n`
   */
  var gamma = typed('gamma', {
    'number': function (n) {
      var t, x;

      if (isInteger(n)) {
        if (n <= 0) {
          return isFinite(n) ? Infinity : NaN;
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
        return Math.PI / (Math.sin(Math.PI * n) * gamma(1-n));
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
    },

    'Complex': function (n) {
      var t, x;

      if (n.im == 0) {
        return gamma(n.re);
      }

      n = new type.Complex(n.re - 1, n.im);
      x = new type.Complex(p[0], 0);
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

      t = new type.Complex(n.re + g + 0.5, n.im);
      var twoPiSqrt = Math.sqrt(2*Math.PI);

      n.re += 0.5;
      var result = pow(t, n);
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

      return multiply(multiply(result, t), x);
    },

    'BigNumber': function (n) {
      if (n.isInteger()) {
        return (n.isNegative() || n.isZero())
            ? new type.BigNumber(Infinity)
            : bigFactorial(n.minus(1));
      }

      if (!n.isFinite()) {
        return new type.BigNumber(n.isNegative() ? NaN : Infinity);
      }

      throw new Error('Integer BigNumber expected');
    },

    'Array | Matrix': function (n) {
      return collection.deepMap(n, gamma);
    }
  });

  /**
   * Calculate factorial for a BigNumber
   * @param {BigNumber} n
   * @returns {BigNumber} Returns the factorial of n
   */
  function bigFactorial(n) {
    var value, res, preciseFacs;

    var num = n.toNumber();   // should definitely be below Number.MAX_VALUE
    if (num < smallBigFacs.length) {
      return new type.BigNumber(smallBigFacs[num]).toSD(config.precision);
    }

    // be wary of round-off errors
    var precision = config.precision + (Math.log(num) | 0);
    var Big = type.BigNumber.constructor({precision: precision});

    // adjust n do align with the precision specific tables
    num -= smallBigFacs.length;
    if (preciseFacs = bigBigFacs[precision]) {
      if (preciseFacs[num]) {
        return new type.BigNumber(preciseFacs[num].toPrecision(config.precision));
      }
      res = preciseFacs[preciseFacs.length-1];
    } else {
      preciseFacs = bigBigFacs[precision] = [];
      res = new Big(smallBigFacs[smallBigFacs.length-1])
          .toSD(precision);
    }

    var one = new Big(1);
    value = new Big(preciseFacs.length + smallBigFacs.length);
    for (var i = preciseFacs.length; i < num; ++i) {
      preciseFacs[i] = res = res.times(value);
      value = value.plus(one);
    }

    preciseFacs[num] = res.times(value);
    return new type.BigNumber(preciseFacs[num].toPrecision(config.precision));
  }

  gamma.toTex = '\\Gamma\\left(${args[0]}\\right)';

  return gamma;
}

// TODO: comment on the variables g and p

var g = 4.7421875;

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

// 21! >= values for each precision
var bigBigFacs = [];

// 0-20! values
var smallBigFacs = [
  1,
  1,
  2,
  6,
  24,
  120,
  720,
  5040,
  40320,
  362880,
  3628800,
  39916800,
  479001600,
  6227020800,
  87178291200,
  1307674368000,
  20922789888000,
  355687428096000,
  6402373705728000,
  121645100408832000,
  2432902008176640000
];

exports.name = 'gamma';
exports.factory = factory;
