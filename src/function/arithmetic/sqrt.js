/**
 * Calculate the square root of a value
 * @param {Number | math2.type.Complex} x
 */
var sqrt = math2.sqrt = function (x) {
    if (isNumber(x)) {
        if (x >= 0) {
            return Math.sqrt(x);
        }
        else {
            return sqrt(new Complex(x, 0));
        }
    }

    if (isComplex(x)) {
        var r = Math.sqrt(x.re * x.re + x.im * x.im);
        if (x.im >= 0.0) {
            return new Complex(
                0.5 * Math.sqrt(2.0 * (r + x.re)),
                0.5 * Math.sqrt(2.0 * (r - x.re))
            );
        }
        else {
            return new Complex(
                0.5 * Math.sqrt(2.0 * (r + x.re)),
                -0.5 * Math.sqrt(2.0 * (r - x.re))
            );
        }
    }

    // TODO: matrix

    throw new Error('Function sqrt does not support a parameter of type "' +
        (x && x.name ? x.name : 'unknown') + '"');
};

/**
 * Function documentation
 */
sqrt.doc = {
    'name': 'sqrt',
    'category': 'Arithmetic',
    'syntax': [
        'sqrt(x)'
    ],
    'description':
        'Compute the square root value. ' +
            'If x = y * y, then y is the square root of x.',
    'examples': [
        'sqrt(25)',
        '5 * 5',
        'sqrt(-1)'
    ],
    'seealso': [
        'square',
        'multiply'
    ]
};
