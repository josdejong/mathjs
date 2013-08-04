/**
 * Calculates the modulus, the remainder of an integer division.
 *
 *     x % y
 *     mod(x, y)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param  {Number | Complex | Array | Matrix} x
 * @param  {Number | Complex | Array | Matrix} y
 * @return {Number | Array | Matrix} res
 */
math.mod = function mod(x, y) {
  if (arguments.length != 2) {
    throw newArgumentsError('mod', arguments.length, 2);
  }

  // see http://functions.wolfram.com/IntegerFunctions/Mod/

  if (isNumber(x) && isNumber(y)) {
    // number % number
    return _mod(x, y);
  }

  // TODO: implement mod for complex values

  if (Array.isArray(x) || x instanceof Matrix ||
      Array.isArray(y) || y instanceof Matrix) {
    return util.map2(x, y, math.mod);
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive values
    return math.mod(x.valueOf(), y.valueOf());
  }

  throw newUnsupportedTypeError('mod', x, y);
};

/**
 * Calculate the modulus of two numbers
 * @param {Number} x
 * @param {Number} y
 * @returns {number} res
 * @private
 */
function _mod(x, y) {
  if (y > 0) {
    if (x > 0) {
      return x % y;
    }
    else if (x == 0) {
      return 0;
    }
    else { // x < 0
      return x - y * Math.floor(x / y);
    }
  }
  else if (y == 0) {
    return x;
  }
  else { // y < 0
    // TODO: implement mod for a negative divisor
    throw new Error('Cannot calculate mod for a negative divisor');
  }
}