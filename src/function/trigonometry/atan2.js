/**
 * Computes the principal value of the arc tangent of y/x in radians
 *
 *     atan2(y, x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} y
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/InverseTangent.html
 */
math.atan2 = function atan2(y, x) {
  if (arguments.length != 2) {
    throw newArgumentsError('atan2', arguments.length, 2);
  }

  if (isNumber(y)) {
    if (isNumber(x)) {
      return Math.atan2(y, x);
    }
    /* TODO: support for complex computation of atan2
     else if (x instanceof Complex) {
     return Math.atan2(y.re, x.re);
     }
     */
  }
  else if (y instanceof Complex) {
    if (isNumber(x)) {
      return Math.atan2(y.re, x);
    }
    /* TODO: support for complex computation of atan2
     else if (x instanceof Complex) {
     return Math.atan2(y.re, x.re);
     }
     */
  }

  if (Array.isArray(y) || y instanceof Matrix ||
      Array.isArray(x) || x instanceof Matrix) {
    return util.map2(y, x, math.atan2);
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive values
    return math.atan2(y.valueOf(), x.valueOf());
  }

  throw newUnsupportedTypeError('atan2', y, x);
};
