/**
 * Calculate the cotangent of a value, cot(x) = 1/tan(x)
 * @param {Number | Complex | Unit | Array} x
 * @return {Number | Complex | Array} res
 */
function cot(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('cot', arguments.length, 1);
    }

    if (isNumber(x)) {
        return 1 / Math.tan(x);
    }

    if (x instanceof Complex) {
        var den = Math.exp(-4.0 * x.im) -
            2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) + 1.0;

        return new Complex(
            2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
            (Math.exp(-4.0 * x.im) - 1.0) / den
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function cot is no angle');
        }
        return 1 / Math.tan(x.value);
    }

    if (x instanceof Array) {
        return util.map(x, cot);
    }
    // TODO: implement matrix support

    throw newUnsupportedTypeError('cot', x);
}

math.cot = cot;

/**
 * Function documentation
 */
cot.doc = {
    'name': 'cot',
    'category': 'Trigonometry',
    'syntax': [
        'cot(x)'
    ],
    'description': 'Compute the cotangent of x in radians. ' +
        'Defined as 1/tan(x)',
    'examples': [
        'cot(2)',
        '1 / tan(2)'
    ],
    'seealso': [
        'sec',
        'csc',
        'tan'
    ]
};
