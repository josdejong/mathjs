/**
 * Calculate the size of a matrix or scalar
 *
 *     size(x)
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.size = function size (x) {
  if (arguments.length != 1) {
    throw newArgumentsError('size', arguments.length, 1);
  }

  if (isNumber(x) || x instanceof Complex || x instanceof Unit || x == null) {
    return [];
  }

  if (isString(x)) {
    return [x.length];
  }

  if (x instanceof Array) {
    return util.size(x);
  }

  if (x instanceof Matrix) {
    return new Matrix(x.size());
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return math.size(x.valueOf());
  }

  throw newUnsupportedTypeError('size', x);
};
