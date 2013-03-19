/**
 * Subtract two values. x - y or subtract(x, y)
 * @param  {Number | Complex | Unit | Array} x
 * @param  {Number | Complex | Unit | Array} y
 * @return {Number | Complex | Unit | Array} res
 */
function subtract(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('subtract', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            // number - number
            return x - y;
        }
        else if (y instanceof Complex) {
            // number - complex
            return new Complex (
                x - y.re,
                    y.im
            );
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex - number
            return new Complex (
                x.re - y,
                x.im
            )
        }
        else if (y instanceof Complex) {
            // complex - complex
            return new Complex (
                x.re - y.re,
                x.im - y.im
            )
        }
    }
    else if (x instanceof Unit) {
        if (y instanceof Unit) {
            if (!x.equalBase(y)) {
                throw new Error('Units do not match');
            }

            if (!x.hasValue) {
                throw new Error('Unit on left hand side of operator - has no value');
            }

            if (!y.hasValue) {
                throw new Error('Unit on right hand side of operator - has no value');
            }

            var res = x.copy();
            res.value -= y.value;
            res.fixPrefix = false;

            return res;
        }
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, subtract);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return subtract(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('subtract', x, y);
}

math.subtract = subtract;

/**
 * Function documentation
 */
subtract.doc = {
    'name': 'subtract',
    'category': 'Operators',
    'syntax': [
        'x - y',
        'subtract(x, y)'
    ],
    'description': 'subtract two values.',
    'examples': [
        '5.3 - 2',
        'ans + 2',
        '2/3 - 1/6',
        '2 * 3 - 3',
        '2.1 km - 500m'
    ],
    'seealso': [
        'add'
    ]
};