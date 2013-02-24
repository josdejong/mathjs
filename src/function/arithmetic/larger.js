/**
 * Check if value x is larger y, x > y
 * In case of complex numbers, the absolute values of a and b are compared.
 * @param  {Number | Complex | Unit | String} x
 * @param  {Number | Complex | Unit | String} y
 * @return {Boolean} res
 */
function larger(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('larger', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x > y;
        }
        else if (y instanceof Complex) {
            return x > abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return abs(x) > y;
        }
        else if (y instanceof Complex) {
            return abs(x) > abs(y);
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

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('larger', x, y);
}

math.larger = larger;

/**
 * Function documentation
 */
larger.doc = {
    'name': 'larger',
    'category': 'Operators',
    'syntax': [
        'x > y',
        'larger(x, y)'
    ],
    'description':
        'Check if value x is larger y. ' +
        'Returns 1 if x is larger than y, and 0 if not.',
    'examples': [
        '2 > 3',
        '5 > 2*2',
        'a = 3.3',
        'b = 6-2.8',
        '(a > b)',
        '(b < a)',
        '5 cm > 2 inch'
    ],
    'seealso': [
        'equal', 'unequal', 'smaller', 'smallereq', 'largereq'
    ]
};
