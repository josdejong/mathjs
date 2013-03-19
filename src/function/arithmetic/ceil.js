/**
 * Round a value towards plus infinity, ceil(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function ceil(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('ceil', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.ceil(x);
    }

    if (x instanceof Complex) {
        return new Complex (
            Math.ceil(x.re),
            Math.ceil(x.im)
        );
    }

    if (x instanceof Array) {
        return util.map(x, ceil);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return ceil(x.valueOf());
    }

    throw newUnsupportedTypeError('ceil', x);
}

math.ceil = ceil;

/**
 * Function documentation
 */
ceil.doc = {
    'name': 'ceil',
    'category': 'Arithmetic',
    'syntax': [
        'ceil(x)'
    ],
    'description':
        'Round a value towards plus infinity.' +
            'If x is complex, both real and imaginary part are rounded ' +
            'towards plus infinity.',
    'examples': [
        'ceil(3.2)',
        'ceil(3.8)',
        'ceil(-4.2)'
    ],
    'seealso': ['floor', 'fix', 'round']
};
