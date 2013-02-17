/**
 * Round a value towards zero, fix(x)
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function fix(x) {
    if (isNumber(x)) {
        return (value > 0) ? Math.floor(x) : Math.ceil(x);
    }

    if (x instanceof Complex) {
        new Complex(
            (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
            (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
        );
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('fix', x);
}

math.fix = fix;

/**
 * Function documentation
 */
fix.doc = {
    'name': 'fix',
    'category': 'Arithmetic',
    'syntax': [
        'fix(x)'
    ],
    'description':
        'Round a value towards zero.' +
            'If x is complex, both real and imaginary part are rounded ' +
            'towards zero.',
    'examples': [
        'fix(3.2)',
        'fix(3.8)',
        'fix(-4.2)',
        'fix(-4.8)'
    ],
    'seealso': ['ceil', 'floor', 'round']
};
