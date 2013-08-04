/**
 * Multiply two values element wise.
 *
 *     x .* y
 *     emultiply(x, y)
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex | Unit | Array | Matrix} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.emultiply = function emultiply(x, y) {
  if (arguments.length != 2) {
    throw newArgumentsError('emultiply', arguments.length, 2);
  }

  return util.deepMap2(x, y, math.multiply);
};
