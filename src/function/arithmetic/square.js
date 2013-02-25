/**
 * Compute the square of a value, x * x
 * @param {Number | Complex} x
 * @return {Number | Complex} res
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

    // TODO: implement array support
    // TODO: implement matrix support

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
