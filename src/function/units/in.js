/**
 * Change the unit of a value. x in unit or in(x, unit)
 * @param {Unit | Array | Matrix | Range} x
 * @param {Unit | Array | Matrix} unit
 * @return {Unit | Array | Matrix} res
 */
math['in'] = function unit_in(x, unit) {
    if (arguments.length != 2) {
        throw newArgumentsError('in', arguments.length, 2);
    }

    if (x instanceof Unit) {
        if (unit instanceof Unit || isString(unit)) {
            return x.in(unit);
        }
    }

    if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
        unit instanceof Array || unit instanceof Matrix || unit instanceof Range) {
        return util.map2(x, unit, math['in']);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math['in'](x.valueOf());
    }

    throw newUnsupportedTypeError('in', x, unit);
};
