/**
 * Round a value towards zero, fix(x)
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
function fix(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('fix', arguments.length, 1);
    }

    if (isNumber(x)) {
        return (x > 0) ? Math.floor(x) : Math.ceil(x);
    }

    if (x instanceof Complex) {
        return new Complex(
            (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
            (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
        );
    }

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
        return util.map(x, fix);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return fix(x.valueOf());
    }

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
