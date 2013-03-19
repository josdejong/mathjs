/**
 * Compute the sign of a value.
 * The sign of a value x is 1 when x>1, -1 when x<0, and 0 when x=0.
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function sign(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('sign', arguments.length, 1);
    }

    if (isNumber(x)) {
        var sign;
        if (x > 0) {
            sign = 1;
        }
        else if (x < 0) {
            sign = -1;
        }
        else {
            sign = 0;
        }
        return sign;
    }

    if (x instanceof Complex) {
        var abs = Math.sqrt(x.re * x.re + x.im * x.im);
        return new Complex(x.re / abs, x.im / abs);
    }

    if (x instanceof Array) {
        return util.map(x, sign);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return sign(x.valueOf());
    }

    throw newUnsupportedTypeError('sign', x);
}

math.sign = sign;

/**
 * Function documentation
 */
sign.doc = {
    'name': 'sign',
    'category': 'Arithmetic',
    'syntax': [
        'sign(x)'
    ],
    'description':
        'Compute the sign of a value. ' +
            'The sign of a value x is 1 when x>1, -1 when x<0, and 0 when x=0.',
    'examples': [
        'sign(3.5)',
        'sign(-4.2)',
        'sign(0)'
    ],
    'seealso': [
        'abs'
    ]
};
