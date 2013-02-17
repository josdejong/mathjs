/**
 * Calculate the inverse sine of a value, asin(x)
 * @param {Number | Complex} x
 * @return {Number | Complex} res
 */
function asin(x) {
    if (isNumber(x)) {
        if (x >= -1 && x <= 1) {
            return Math.asin(x);
        }
        else {
            return asin(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        // asin(z) = -i*log(iz + sqrt(1-z^2))
        var re = x.re;
        var im = x.im;
        var temp1 = new Complex(
            im * im - re * re + 1.0,
            -2.0 * re * im
        );

        var temp2 = sqrt(temp1);
        var temp3 = new Complex(
            temp2.re - im,
            temp2.im + re
        );

        var temp4 = log(temp3);

        return new Complex(temp4.im, -temp4.re);
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('asin', x);
}

math.asin = asin;

/**
 * Function documentation
 */
asin.doc = {
    'name': 'asin',
    'category': 'Trigonometry',
    'syntax': [
        'asin(x)'
    ],
    'description': 'Compute the inverse sine of a value in radians.',
    'examples': [
        'asin(0.5)',
        'asin(sin(2.3))'
    ],
    'seealso': [
        'sin',
        'acos',
        'asin'
    ]
};
