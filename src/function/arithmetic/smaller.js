/**
 * Check if value x is smaller y
 *
 *     x < y
 *     smaller(x, y)
 *
 * For matrices, the function is evaluated element wise.
 * In case of complex numbers, the absolute values of a and b are compared.
 *
 * @param  {Number | Complex | Unit | String | Array | Matrix} x
 * @param  {Number | Complex | Unit | String | Array | Matrix} y
 * @return {Boolean | Array | Matrix} res
 */
math.smaller = function smaller(x, y) {
  if (arguments.length != 2) {
    throw newArgumentsError('smaller', arguments.length, 2);
  }

  if (isNumber(x)) {
    if (isNumber(y)) {
      return x < y;
    }
    else if (y instanceof Complex) {
      return x < math.abs(y);
    }
  }
  if (x instanceof Complex) {
    if (isNumber(y)) {
      return math.abs(x) < y;
    }
    else if (y instanceof Complex) {
      return math.abs(x) < math.abs(y);
    }
  }

  if ((x instanceof Unit) && (y instanceof Unit)) {
    if (!x.equalBase(y)) {
      throw new Error('Cannot compare units with different base');
    }
    return x.value < y.value;
  }

  if (isString(x) || isString(y)) {
    return x < y;
  }

  if (Array.isArray(x) || x instanceof Matrix ||
      Array.isArray(y) || y instanceof Matrix) {
    return util.map2(x, y, math.smaller);
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive values
    return math.smaller(x.valueOf(), y.valueOf());
  }

  throw newUnsupportedTypeError('smaller', x, y);
};
