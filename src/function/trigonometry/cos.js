/**
 * Calculate the cosine of a value, cos(x)
 * @param {Number | Complex | Unit | Array} x
 * @return {Number | Complex | Array} res
 */
function cos(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('cos', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.cos(x);
    }

    if (x instanceof Complex) {
        // cos(z) = (exp(iz) + exp(-iz)) / 2
        return new Complex(
            0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp(x.im)),
            0.5 * Math.sin(x.re) * (Math.exp(-x.im) - Math.exp(x.im))
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function cos is no angle');
        }
        return Math.cos(x.value);
    }

    if (x instanceof Array) {
        return util.map(x, cos);
    }
    // TODO: implement matrix support

    throw newUnsupportedTypeError('cos', x);
}

math.cos = cos;

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
