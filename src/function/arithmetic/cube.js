/**
 * Compute the cube of a value, x * x * x.',
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function cube(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('cube', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x * x * x;
    }

    if (x instanceof Complex) {
        return multiply(multiply(x, x), x);
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('cube', x);
}

math.cube = cube;

/**
 * Function documentation
 */
cube.doc = {
    'name': 'cube',
    'category': 'Arithmetic',
    'syntax': [
        'cube(x)'
    ],
    'description': 'Compute the cube of a value. ' +
        'The cube of x is x * x * x.',
    'examples': [
        'cube(2)',
        '2^3',
        '2 * 2 * 2'
    ],
    'seealso': [
        'multiply',
        'square',
        'pow'
    ]
};
