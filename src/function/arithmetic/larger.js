/**
 * Check if value x is larger y, x > y
 * In case of complex numbers, the absolute values of a and b are compared.
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} y
 * @return {Boolean | Array | Matrix | Range} res
 */
math.larger = function larger(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('larger', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x > y;
        }
        else if (y instanceof Complex) {
            return x > math.abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return math.abs(x) > y;
        }
        else if (y instanceof Complex) {
            return math.abs(x) > math.abs(y);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value > y.value;
    }

    if (isString(x) || isString(y)) {
        return x > y;
    }

    if (x instanceof Array || x instanceof Matrix ||
        y instanceof Array || y instanceof Matrix) {
        return util.map2(x, y, math.larger);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.larger(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('larger', x, y);
};
