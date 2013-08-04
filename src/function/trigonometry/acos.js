/**
 * Calculate the inverse cosine of a value
 *
 *     acos(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/InverseCosine.html
 */
math.acos = function acos(x) {
  if (arguments.length != 1) {
    throw newArgumentsError('acos', arguments.length, 1);
  }

  if (isNumber(x)) {
    if (x >= -1 && x <= 1) {
      return Math.acos(x);
    }
    else {
      return math.acos(new Complex(x, 0));
    }
  }

  if (x instanceof Complex) {
    // acos(z) = 0.5*pi + i*log(iz + sqrt(1-z^2))
    var temp1 = Complex.create(
        x.im * x.im - x.re * x.re + 1.0,
        -2.0 * x.re * x.im
    );
    var temp2 = math.sqrt(temp1);
    var temp3;
    if (temp2 instanceof Complex) {
      temp3 = Complex.create(
          temp2.re - x.im,
          temp2.im + x.re
      )
    }
    else {
      temp3 = Complex.create(
          temp2 - x.im,
          x.re
      )
    }
    var temp4 = math.log(temp3);

    // 0.5*pi = 1.5707963267948966192313216916398
    if (temp4 instanceof Complex) {
      return Complex.create(
          1.57079632679489661923 - temp4.im,
          temp4.re
      );
    }
    else {
      return new Complex(
          1.57079632679489661923,
          temp4
      );
    }
  }

  if (Array.isArray(x) || x instanceof Matrix) {
    return util.map(x, math.acos);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return math.acos(x.valueOf());
  }

  throw newUnsupportedTypeError('acos', x);
};
