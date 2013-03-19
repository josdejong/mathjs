/**
 * Add two values. x + y or add(x, y)
 * @param  {Number | Complex | Unit | String | Array} x
 * @param  {Number | Complex | Unit | String | Array} y
 * @return {Number | Complex | Unit | String | Array} res
 */
function add(x, y) {
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
            return new Complex(
                x + y.re,
                    y.im
            )
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex + number
            return new Complex(
                x.re + y,
                x.im
            )
        }
        else if (y instanceof Complex) {
            // complex + complex
            return new Complex(
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

            if (!x.hasValue) {
                throw new Error('Unit on left hand side of operator + has no value');
            }

            if (!y.hasValue) {
                throw new Error('Unit on right hand side of operator + has no value');
            }

            var res = x.copy();
            res.value += y.value;
            res.fixPrefix = false;
            return res;
        }
    }

    if (isString(x) || isString(y)) {
        return x + y;
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, add);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return add(x.valueOf());
    }

    throw newUnsupportedTypeError('add', x, y);
}

math.add = add;

/**
 * Function documentation
 */
add.doc = {
    'name': 'add',
    'category': 'Operators',
    'syntax': [
        'x + y',
        'add(x, y)'
    ],
    'description': 'Add two values.',
    'examples': [
        '2.1 + 3.6',
        'ans - 3.6',
        '3 + 2i',
        '"hello" + " world"',
        '3 cm + 2 inch'
    ],
    'seealso': [
        'subtract'
    ]
};
