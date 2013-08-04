/**
 * Add two values
 *
 *     x + y
 *     add(x, y)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param  {Number | Complex | Unit | String | Array | Matrix} x
 * @param  {Number | Complex | Unit | String | Array | Matrix} y
 * @return {Number | Complex | Unit | String | Array | Matrix} res
 */
math.add = function add(x, y) {
  if (arguments.length != 2) {
    throw newArgumentsError('add', arguments.length, 2);
  }

  if (isNumber(x)) {
    if (isNumber(y)) {
      // number + number
      return x + y;
    }
    else if (y instanceof Complex) {
      // number + complex
      return Complex.create(
          x + y.re,
          y.im
      )
    }
  }
  else if (x instanceof Complex) {
    if (isNumber(y)) {
      // complex + number
      return Complex.create(
          x.re + y,
          x.im
      )
    }
    else if (y instanceof Complex) {
      // complex + complex
      return Complex.create(
          x.re + y.re,
          x.im + y.im
      );
    }
  }
  else if (x instanceof Unit) {
    if (y instanceof Unit) {
      if (!x.equalBase(y)) {
        throw new Error('Units do not match');
      }

      if (x.value == null) {
        throw new Error('Unit on left hand side of operator + has an undefined value');
      }

      if (y.value == null) {
        throw new Error('Unit on right hand side of operator + has an undefined value');
      }

      var res = x.clone();
      res.value += y.value;
      res.fixPrefix = false;
      return res;
    }
  }

  if (isString(x) || isString(y)) {
    return x + y;
  }

  if (Array.isArray(x) || x instanceof Matrix ||
      Array.isArray(y) || y instanceof Matrix) {
    return util.map2(x, y, math.add);
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive value
    return math.add(x.valueOf(), y.valueOf());
  }

  throw newUnsupportedTypeError('add', x, y);
};
