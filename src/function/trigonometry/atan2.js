/**
 * Computes the principal value of the arc tangent of y/x in radians, atan2(y,x)
 * @param {Number | Complex} y
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function atan2(y, x) {
    if (isNumber(y)) {
        if (isNumber(x)) {
            return Math.atan2(y, x);
        }
        else if (x instanceof Complex) {
            return Math.atan2(y, x.re);
        }
    }
    else if (y instanceof Complex) {
        if (isNumber(x)) {
            return Math.atan2(y.re, x);
        }
        else if (x instanceof Complex) {
            return Math.atan2(y.re, x.re);
        }
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('atan2', y, x);
}

math.atan2 = atan2;

/**
 * Function documentation
 */
atan2.doc = {
    'name': 'atan2',
    'category': 'Trigonometry',
    'syntax': [
        'atan2(y, x)'
    ],
    'description':
        'Computes the principal value of the arc tangent of y/x in radians.',
    'examples': [
        'atan2(2, 2) / pi',
        'angle = 60 deg in rad',
        'x = cos(angle)',
        'y = sin(angle)',
        'atan2(y, x)'
    ],
    'seealso': [
        'sin',
        'cos',
        'tan'
    ]
};
