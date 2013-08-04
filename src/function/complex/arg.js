/**
 * Compute the argument of a complex value.
 * If x = a + bi, the argument is computed as atan2(b, a).
 *
 *     arg(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Array | Matrix} res
 */
math.arg = function arg(x) {
  if (arguments.length != 1) {
    throw newArgumentsError('arg', arguments.length, 1);
  }

  if (isNumber(x)) {
    return Math.atan2(0, x);
  }

  if (x instanceof Complex) {
    return Math.atan2(x.im, x.re);
  }

  if (Array.isArray(x) || x instanceof Matrix) {
    return util.map(x, math.arg);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return math.arg(x.valueOf());
  }

  // handle other types just as non-complex values
  return math.atan2(0, x);
};
