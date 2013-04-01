/**
 * Calculate the square root of a value
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
function abs(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('abs', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.abs(x);
    }

    if (x instanceof Complex) {
        return Math.sqrt(x.re * x.re + x.im * x.im);
    }

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
        return util.map(x, abs);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return abs(x.valueOf());
    }

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
