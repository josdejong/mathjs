/**
 * Check if value x is larger or equal to y, x >= y
 * In case of complex numbers, the absolute values of a and b are compared.
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} y
 * @return {Boolean | Array | Matrix} res
 */
function largereq(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('largereq', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x >= y;
        }
        else if (y instanceof Complex) {
            return x >= abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return abs(x) >= y;
        }
        else if (y instanceof Complex) {
            return abs(x) >= abs(y);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value >= y.value;
    }

    if (isString(x) || isString(y)) {
        return x >= y;
    }

    if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
        y instanceof Array || y instanceof Matrix || y instanceof Range) {
        return util.map2(x, y, largereq);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return largereq(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('largereq', x, y);
}

math.largereq = largereq;

/**
 * Function documentation
 */
largereq.doc = {
    'name': 'largereq',
    'category': 'Operators',
    'syntax': [
        'x >= y',
        'largereq(x, y)'
    ],
    'description':
        'Check if value x is larger or equal to y. ' +
        'Returns 1 if x is larger or equal to y, and 0 if not.',
    'examples': [
        '2 > 1+1',
        '2 >= 1+1',
        'a = 3.2',
        'b = 6-2.8',
        '(a > b)'
    ],
    'seealso': [
        'equal', 'unequal', 'smallereq', 'smaller', 'largereq'
    ]
};
