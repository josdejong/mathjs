/**
 * Calculate the natural logarithm of a value, log(x)
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function log(x) {
    if (isNumber(x)) {
        if (x >= 0) {
            return Math.log(x);
        }
        else {
            // negative value -> complex value computation
            return log(new Complex(x, 0));
        }
    }

    if (isComplex(x)) {
        return new Complex (
            Math.log(Math.sqrt(x.re * x.re + x.im * x.im)),
            Math.atan2(x.im, x.re)
        );
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('log', x);
}

math.log = log;

/**
 * Function documentation
 */
log.doc = {
    'name': 'log',
    'category': 'Arithmetic',
    'syntax': [
        'log(x)'
    ],
    'description': 'Compute the natural logarithm of a value.',
    'examples': [
        'log(3.5)',
        'a = log(2.4)',
        'exp(a)',
        'log(1000) / log(10)'
    ],
    'seealso': [
        'exp',
        'logb',
        'log10'
    ]
};
