/**
 * Calculate the absolute value of a value.
 *
 *     abs(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.abs = function abs(x) {
  if (arguments.length != 1) {
    throw newArgumentsError('abs', arguments.length, 1);
  }

  if (isNumber(x)) {
    return Math.abs(x);
  }

  if (x instanceof Complex) {
    return Math.sqrt(x.re * x.re + x.im * x.im);
  }

  if (Array.isArray(x) || x instanceof Matrix) {
    return util.map(x, math.abs);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return math.abs(x.valueOf());
  }

  throw newUnsupportedTypeError('abs', x);
};
