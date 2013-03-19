/**
 * Calculate the tangent of a value, tan(x)
 * @param {Number | Complex | Unit | Array} x
 * @return {Number | Complex | Array} res
 */
function tan(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('tan', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.tan(x);
    }

    if (x instanceof Complex) {
        var den = Math.exp(-4.0 * x.im) +
            2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) +
            1.0;

        return new Complex(
             2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
            (1.0 - Math.exp(-4.0 * x.im)) / den
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function tan is no angle');
        }
        return Math.tan(x.value);
    }

    if (x instanceof Array) {
        return util.map(x, tan);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return tan(x.valueOf());
    }

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
