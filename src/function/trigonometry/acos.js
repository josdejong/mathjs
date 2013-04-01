/**
 * Calculate the inverse cosine of a value, acos(x)
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
function acos(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('acos', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= -1 && x <= 1) {
            return Math.acos(x);
        }
        else {
            return acos(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        // acos(z) = 0.5*pi + i*log(iz + sqrt(1-z^2))
        var temp1 = new Complex(
            x.im * x.im - x.re * x.re + 1.0,
            -2.0 * x.re * x.im
        );
        var temp2 = sqrt(temp1);
        var temp3 = new Complex(
            temp2.re - x.im,
            temp2.im + x.re
        );
        var temp4 = log(temp3);

        // 0.5*pi = 1.5707963267948966192313216916398
        return new Complex(
            1.57079632679489661923 - temp4.im,
            temp4.re
        );
    }

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
        return util.map(x, acos);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return acos(x.valueOf());
    }

    throw newUnsupportedTypeError('acos', x);
}

math.acos = acos;

/**
 * Function documentation
 */
acos.doc = {
    'name': 'acos',
    'category': 'Trigonometry',
    'syntax': [
        'acos(x)'
    ],
    'description': 'Compute the inverse cosine of a value in radians.',
    'examples': [
        'acos(0.5)',
        'acos(cos(2.3))'
    ],
    'seealso': [
        'cos',
        'acos',
        'asin'
    ]
};
