/**
 * Calculate the 10-base logarithm of a value, log10(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function log10(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('log10', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= 0) {
            return Math.log(x) / Math.LN10;
        }
        else {
            // negative value -> complex value computation
            return log10(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        return new Complex (
            Math.log(Math.sqrt(x.re * x.re + x.im * x.im)) / Math.LN10,
            Math.atan2(x.im, x.re) / Math.LN10
        );
    }

    if (x instanceof Array) {
        return util.map(x, log10);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return log10(x.valueOf());
    }

    throw newUnsupportedTypeError('log10', x);
}

math.log10 = log10;

/**
 * Function documentation
 */
log10.doc = {
    'name': 'log10',
    'category': 'Arithmetic',
    'syntax': [
        'log10(x)'
    ],
    'description': 'Compute the 10-base logarithm of a value.',
    'examples': [
        'log10(1000)',
        '10 ^ 3',
        'log10(0.01)',
        'log(1000) / log(10)',
        'log(1000, 10)'
    ],
    'seealso': [
        'exp',
        'log'
    ]
};
