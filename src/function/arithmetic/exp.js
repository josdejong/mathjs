/**
 * Calculate the exponent of a value, exp(x)
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function exp (x) {
    if (isNumber(x)) {
        return Math.exp(x);
    }
    if (x instanceof Complex) {
        var r = Math.exp(x.re);
        return new Complex(
            r * Math.cos(x.im),
            r * Math.sin(x.im)
        );
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('exp', x);
}

math.exp = exp;

/**
 * Function documentation
 */
exp.doc = {
    'name': 'exp',
    'category': 'Arithmetic',
    'syntax': [
        'exp(x)'
    ],
    'description': 'Calculate the exponent of a value.',
    'examples': [
        'exp(1.3)',
        'e ^ 1.3',
        'log(exp(1.3))',
        'x = 2.4',
        '(exp(i*x) == cos(x) + i*sin(x))   # Euler\'s formula'
    ],
    'seealso': [
        'square',
        'multiply',
        'log'
    ]
};