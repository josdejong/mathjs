/**
 * Check if value x equals y, x == y
 * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
 * @param  {Number | Complex | Unit | String | Array} x
 * @param  {Number | Complex | Unit | String | Array} y
 * @return {Boolean | Array} res
 */
function equal(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('equal', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x == y;
        }
        else if (y instanceof Complex) {
            return (x == y.re) && (y.im == 0);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return (x.re == y) && (x.im == 0);
        }
        else if (y instanceof Complex) {
            return (x.re == y.re) && (x.im == y.im);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value == y.value;
    }

    if (isString(x) || isString(y)) {
        return x == y;
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, equal);
    }
    // TODO: implement matrix support

    throw newUnsupportedTypeError('equal', x, y);
}

math.equal = equal;

/**
 * Function documentation
 */
equal.doc = {
    'name': 'equal',
    'category': 'Operators',
    'syntax': [
        'x == y',
        'equal(x, y)'
    ],
    'description':
        'Check equality of two values. ' +
            'Returns 1 if the values are equal, and 0 if not.',
    'examples': [
        '2+2 == 3',
        '2+2 == 4',
        'a = 3.2',
        'b = 6-2.8',
        'a == b',
        '50cm == 0.5m'
    ],
    'seealso': [
        'unequal', 'smaller', 'larger', 'smallereq', 'largereq'
    ]
};
