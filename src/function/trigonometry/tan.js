/**
 * Calculate the tangent of a value, tan(x)
 * @param {Number | Complex | Unit} x
 * @return {Number | Complex} res
 */
function tan(x) {
    if (isNumber(x)) {
        return Math.tan(x);
    }

    if (isComplex(x)) {
        var den = Math.exp(-4.0 * x.im) +
            2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) +
            1.0;

        return new Complex(
             2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
            (1.0 - Math.exp(-4.0 * x.im)) / den
        );
    }

    if (isUnit(x)) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function tan is no angle');
        }
        return Math.tan(x.value);
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('tan', x);
}

math.tan = tan;

/**
 * Function documentation
 */
tan.doc = {
    'name': 'tan',
    'category': 'Trigonometry',
    'syntax': [
        'tan(x)'
    ],
    'description': 'Compute the tangent of x in radians.',
    'examples': [
        'tan(0.5)',
        'sin(0.5) / cos(0.5)',
        'tan(pi / 4)',
        'tan(45 deg)'
    ],
    'seealso': [
        'atan',
        'sin',
        'cos'
    ]
};
