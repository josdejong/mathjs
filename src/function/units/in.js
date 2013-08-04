/**
 * Change the unit of a value.
 *
 *     x in unit
 *     in(x, unit)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Unit | Array | Matrix} x
 * @param {Unit | Array | Matrix} unit
 * @return {Unit | Array | Matrix} res
 */
math['in'] = function unit_in(x, unit) {
  if (arguments.length != 2) {
    throw newArgumentsError('in', arguments.length, 2);
  }

  if (x instanceof Unit) {
    if (unit instanceof Unit || isString(unit)) {
      return x['in'](unit);
    }
  }

  // TODO: add support for string, in that case, convert to unit

  if (x instanceof Array || x instanceof Matrix ||
      unit instanceof Array || unit instanceof Matrix) {
    return util.map2(x, unit, math['in']);
  }

  if (x.valueOf() !== x || unit.valueOf() !== unit) {
    // fallback on the objects primitive value
    return math['in'](x.valueOf(), unit.valueOf());
  }

  throw newUnsupportedTypeError('in', x, unit);
};
