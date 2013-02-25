/**
 * Calculate the logarithm of a value, log(x [, base])
 * base is optional. If not provided, the natural logarithm of x is calculated
 * logarithm for any base, like log(x, base)
 * @param {Number | Complex} x
 * @param {Number | Complex} [base]
 * @return {Number | Complex} res
 */
function log(x, base) {
    if (arguments.length != 1 && arguments.length != 2) {
        throw newArgumentsError('log', arguments.length, 1, 2);
    }

    if (base === undefined) {
        // calculate natural logarithm, log(x)
        if (isNumber(x)) {
            if (x >= 0) {
                return Math.log(x);
            }
            else {
                // negative value -> complex value computation
                return log(new Complex(x, 0));
            }
        }
        else if (x instanceof Complex) {
            return new Complex (
                Math.log(Math.sqrt(x.re * x.re + x.im * x.im)),
                Math.atan2(x.im, x.re)
            );
        }
    }
    else {
        // calculate logarithm for a specified base, log(x, base)
        return divide(log(x), log(base));
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('log', x, base);
}

math.log = log;

/**
 * Function documentation
 */
log.doc = {
    'name': 'log',
    'category': 'Arithmetic',
    'syntax': [
        'log(x)',
        'log(x, base)'
    ],
    'description': 'Compute the logarithm of a value. ' +
        'If no base is provided, the natural logarithm of x is calculated. ' +
        'If base if provided, the logarithm is calculated for the specified base. ' +
        'log(x, base) is defined as log(x) / log(base).',
    'examples': [
        'log(3.5)',
        'a = log(2.4)',
        'exp(a)',
        '10 ^ 3',
        'log(1000, 10)',
        'log(1000) / log(10)',
        'b = logb(1024, 2)',
        '2 ^ b'
    ],
    'seealso': [
        'exp',
        'log10'
    ]
};
