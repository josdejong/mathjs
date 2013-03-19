/**
 * Compute the square of a value, x * x
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function square(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('square', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x * x;
    }

    if (x instanceof Complex) {
        return multiply(x, x);
    }

    if (x instanceof Array) {
        return multiply(x, x);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return square(x.valueOf());
    }

    throw newUnsupportedTypeError('square', x);
}

math.square = square;

/**
 * Function documentation
 */
square.doc = {
    'name': 'square',
    'category': 'Arithmetic',
    'syntax': [
        'square(x)'
    ],
    'description':
        'Compute the square of a value. ' +
            'The square of x is x * x.',
    'examples': [
        'square(3)',
        'sqrt(9)',
        '3^2',
        '3 * 3'
    ],
    'seealso': [
        'multiply',
        'pow',
        'sqrt',
        'cube'
    ]
};
