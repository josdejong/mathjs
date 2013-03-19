/**
 * Calculate the inverse tangent of a value, atan(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function atan(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('atan', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.atan(x);
    }

    if (x instanceof Complex) {
        // atan(z) = 1/2 * i * (ln(1-iz) - ln(1+iz))
        var re = x.re;
        var im = x.im;
        var den = re * re + (1.0 - im) * (1.0 - im);

        var temp1 = new Complex(
            (1.0 - im * im - re * re) / den,
            (-2.0 * re) / den
        );
        var temp2 = log(temp1);

        return new Complex(
            -0.5 * temp2.im,
            0.5 * temp2.re
        );
    }

    if (x instanceof Array) {
        return util.map(x, atan);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return atan(x.valueOf());
    }

    throw newUnsupportedTypeError('atan', x);
}

math.atan = atan;

/**
 * Function documentation
 */
atan.doc = {
    'name': 'atan',
    'category': 'Trigonometry',
    'syntax': [
        'atan(x)'
    ],
    'description': 'Compute the inverse tangent of a value in radians.',
    'examples': [
        'atan(0.5)',
        'atan(tan(2.3))'
    ],
    'seealso': [
        'tan',
        'acos',
        'asin'
    ]
};
