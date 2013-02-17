/**
 * Calculate the square root of a value
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function abs(x) {
    if (isNumber(x)) {
        return Math.abs(x);
    }

    if (isComplex(x)) {
        return Math.sqrt(x.re * x.re + x.im * x.im);
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('abs', x);
}

math.abs = abs;

/**
 * Function documentation
 */
abs.doc = {
    'name': 'abs',
    'category': 'Arithmetic',
    'syntax': [
        'abs(x)'
    ],
    'description': 'Compute the absolute value.',
    'examples': [
        'abs(3.5)',
        'abs(-4.2)'
    ],
    'seealso': ['sign']
};
