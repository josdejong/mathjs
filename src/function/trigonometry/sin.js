/**
 * Calculate the sine of a value, sin(x)
 * @param {Number | Complex | Unit | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
function sin(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('sin', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.sin(x);
    }

    if (x instanceof Complex) {
        return new Complex(
            0.5 * Math.sin(x.re) * (Math.exp(-x.im) + Math.exp( x.im)),
            0.5 * Math.cos(x.re) * (Math.exp( x.im) - Math.exp(-x.im))
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function cos is no angle');
        }
        return Math.sin(x.value);
    }

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
        return util.map(x, sin);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return sin(x.valueOf());
    }

    throw newUnsupportedTypeError('sin', x);
}

math.sin = sin;

/**
 * Function documentation
 */
sin.doc = {
    'name': 'sin',
    'category': 'Trigonometry',
    'syntax': [
        'sin(x)'
    ],
    'description': 'Compute the sine of x in radians.',
    'examples': [
        'sin(2)',
        'sin(pi / 4) ^ 2',
        'sin(90 deg)',
        'sin(30 deg)',
        'sin(0.2)^2 + cos(0.2)^2'
    ],
    'seealso': [
        'asin',
        'cos',
        'tan'
    ]
};
