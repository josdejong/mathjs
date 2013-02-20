/**
 * Calculates the power of x to y, x^y
 * @param  {Number | Complex} x
 * @param  {Number | Complex} y
 * @return {Number | Complex} res
 */
function pow(x, y) {
    if (isNumber(x)) {
        if (isNumber(y)) {
            if (isInteger(y) || x >= 0) {
                // real value computation
                return Math.pow(x, y);
            }
            else {
                return powComplex(new Complex(x), new Complex(y));
            }
        }
        else if (y instanceof Complex) {
            return powComplex(new Complex(x), y);
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            return powComplex(x, new Complex(y));
        }
        else if (y instanceof Complex) {
            return powComplex(x, y);
        }
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('pow', x, y);
}

/**
 * Caculates the power of x to y, x^y, for two complex values.
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex} res
 * @private
 */
function powComplex (x, y) {
    // complex computation
    // x^y = exp(log(x)*y) = exp((abs(x)+i*arg(x))*y)
    var temp1 = log(x);
    var temp2 = multiply(temp1, y);
    return exp(temp2);
}

math.pow = pow;

/**
 * Function documentation
 */
pow.doc = {
    'name': 'pow',
    'category': 'Operators',
    'syntax': [
        'x ^ y',
        'pow(x, y)'
    ],
    'description':
        'Calculates the power of x to y, x^y.',
    'examples': [
        '2^3 = 8',
        '2*2*2',
        '1 + e ^ (pi * i)'
    ],
    'seealso': [
        'unequal', 'smaller', 'larger', 'smallereq', 'largereq'
    ]
};
