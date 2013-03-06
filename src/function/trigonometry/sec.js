/**
 * Calculate the secant of a value, sec(x) = 1/cos(x)
 * @param {Number | Complex | Unit} x
 * @return {Number | Complex} res
 */
function sec(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('sec', arguments.length, 1);
    }

    if (isNumber(x)) {
        return 1 / Math.cos(x);
    }

    if (x instanceof Complex) {
        // sec(z) = 1/cos(z) = 2 / (exp(iz) + exp(-iz))
        var den = 0.25 * (Math.exp(-2.0 * x.im) + Math.exp(2.0 * x.im)) +
            0.5 * Math.cos(2.0 * x.re);
        return new Complex(
            0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp( x.im)) / den,
            0.5 * Math.sin(x.re) * (Math.exp( x.im) - Math.exp(-x.im)) / den
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function sec is no angle');
        }
        return 1 / Math.cos(x.value);
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('sec', x);
}

math.sec = sec;

/**
 * Function documentation
 */
sec.doc = {
    'name': 'sec',
    'category': 'Trigonometry',
    'syntax': [
        'sec(x)'
    ],
    'description': 'Compute the secant of x in radians. ' +
        'Defined as 1/cos(x)',
    'examples': [
        'sec(2)',
        '1 / cos(2)'
    ],
    'seealso': [
        'cot',
        'csc',
        'cos'
    ]
};
