/**
 * Calculate the cosine of a value, cos(x)
 * @param {Number | Complex | Unit} x
 * @return {Number | Complex} res
 */
function cos(x) {
    if (isNumber(x)) {
        return Math.cos(x);
    }

    if (isComplex(x)) {
        // cos(z) = (exp(iz) + exp(-iz)) / 2
        return new Complex(
            0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp(x.im)),
            0.5 * Math.sin(x.re) * (Math.exp(-x.im) - Math.exp(x.im))
        );
    }

    if (isUnit(x)) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function cos is no angle');
        }
        return Math.cos(x.value);
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('cos', x);
}

math2.cos = cos;

/**
 * Function documentation
 */
cos.doc = {
    'name': 'cos',
    'category': 'Trigonometry',
    'syntax': [
        'cos(x)'
    ],
    'description': 'Compute the cosine of x in radians.',
    'examples': [
        'cos(2)',
        'cos(pi / 4) ^ 2',
        'cos(180 deg)',
        'cos(60 deg)',
        'sin(0.2)^2 + cos(0.2)^2'
    ],
    'seealso': [
        'acos',
        'sin',
        'tan'
    ]
};
