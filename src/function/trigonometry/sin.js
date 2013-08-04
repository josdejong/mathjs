/**
 * Calculate the sine of a value
 *
 *     sin(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/Sine.html
 */
math.sin = function sin(x) {
  if (arguments.length != 1) {
    throw newArgumentsError('sin', arguments.length, 1);
  }

  if (isNumber(x)) {
    return Math.sin(x);
  }

  if (x instanceof Complex) {
    return Complex.create(
        0.5 * Math.sin(x.re) * (Math.exp(-x.im) + Math.exp( x.im)),
        0.5 * Math.cos(x.re) * (Math.exp( x.im) - Math.exp(-x.im))
    );
  }

  if (x instanceof Unit) {
    if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
      throw new TypeError ('Unit in function cos is no angle');
    }
    return Math.sin(x.value);
  }

  if (x instanceof Array || x instanceof Matrix) {
    return util.map(x, math.sin);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return math.sin(x.valueOf());
  }

  throw newUnsupportedTypeError('sin', x);
};
