/**
 * Calculate the secant of a value, sec(x) = 1/cos(x)
 *
 *     sec(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.sec = function sec(x) {
  if (arguments.length != 1) {
    throw newArgumentsError('sec', arguments.length, 1);
  }

  if (isNumber(x)) {
    return 1 / Math.cos(x);
  }

  if (x instanceof Complex) {
    // sec(z) = 1/cos(z) = 2 / (exp(iz) + exp(-iz))
    var den = 0.25 * (Math.exp(-2.0 * x.im) + Math.exp(2.0 * x.im)) +
        0.5 * Math.cos(2.0 * x.re);
    return Complex.create(
        0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp( x.im)) / den,
        0.5 * Math.sin(x.re) * (Math.exp( x.im) - Math.exp(-x.im)) / den
    );
  }

  if (x instanceof Unit) {
    if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
      throw new TypeError ('Unit in function sec is no angle');
    }
    return 1 / Math.cos(x.value);
  }

  if (x instanceof Array || x instanceof Matrix) {
    return util.map(x, math.sec);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return math.sec(x.valueOf());
  }

  throw newUnsupportedTypeError('sec', x);
};
