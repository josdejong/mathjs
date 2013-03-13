/**
 * Check if value a is smaller or equal to b, a <= b
 * In case of complex numbers, the absolute values of a and b are compared.
 * @param  {Number | Complex | Unit | String | Array} x
 * @param  {Number | Complex | Unit | String | Array} y
 * @return {Boolean | Array} res
 */
function smallereq(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('smallereq', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x <= y;
        }
        else if (y instanceof Complex) {
            return x <= abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return abs(x) <= y;
        }
        else if (y instanceof Complex) {
            return abs(x) <= abs(y);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value <= y.value;
    }

    if (isString(x) || isString(y)) {
        return x <= y;
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, smallereq);
    }
    // TODO: implement matrix support

    throw newUnsupportedTypeError('smallereq', x, y);
}

math.smallereq = smallereq;

/**
 * Function documentation
 */
smallereq.doc = {
    'name': 'smallereq',
    'category': 'Operators',
    'syntax': [
        'x <= y',
        'smallereq(x, y)'
    ],
    'description':
        'Check if value x is smaller or equal to value y. ' +
            'Returns 1 if x is smaller than y, and 0 if not.',
    'examples': [
        '2 < 1+1',
        '2 <= 1+1',
        'a = 3.2',
        'b = 6-2.8',
        '(a < b)'
    ],
    'seealso': [
        'equal', 'unequal', 'larger', 'smaller', 'largereq'
    ]
};
