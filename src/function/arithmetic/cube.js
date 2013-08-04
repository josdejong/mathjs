/**
 * Compute the cube of a value
 *
 *     x .* x .* x
 *     cube(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.cube = function cube(x) {
  if (arguments.length != 1) {
    throw newArgumentsError('cube', arguments.length, 1);
  }

  if (isNumber(x)) {
    return x * x * x;
  }

  if (x instanceof Complex) {
    return math.multiply(math.multiply(x, x), x);
  }

  if (x instanceof Array || x instanceof Matrix) {
    return util.map(x, math.cube);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return math.cube(x.valueOf());
  }

  throw newUnsupportedTypeError('cube', x);
};
