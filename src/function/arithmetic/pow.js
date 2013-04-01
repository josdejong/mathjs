/**
 * Calculates the power of x to y, x^y
 * @param  {Number | Complex | Array | Matrix | Range} x
 * @param  {Number | Complex} y
 * @return {Number | Complex | Array | Matrix} res
 */
function pow(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('pow', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            if (isInteger(y) || x >= 0) {
                // real value computation
                return Math.pow(x, y);
            }
            else {
                return powComplex(new Complex(x, 0), new Complex(y, 0));
            }
        }
        else if (y instanceof Complex) {
            return powComplex(new Complex(x, 0), y);
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            return powComplex(x, new Complex(y, 0));
        }
        else if (y instanceof Complex) {
            return powComplex(x, y);
        }
    }
    else if (x instanceof Array) {
        if (!isNumber(y) || !isInteger(y) || y < 0) {
            throw new TypeError('For A^b, b must be a positive integer ' +
                    '(value is ' + y + ')');
        }
        // verify that A is a 2 dimensional square matrix
        var s = util.size(x);
        if (s.length != 2) {
            throw new Error('For A^b, A must be 2 dimensional ' +
                    '(A has ' + s.length + ' dimensions)');
        }
        if (s[0] != s[1]) {
            throw new Error('For A^b, A must be square ' +
                    '(size is ' + s[0] + 'x' + s[1] + ')');
        }

        if (y == 0) {
            // return the identity matrix
            return identity(s[0]);
        }
        else {
            // value > 0
            var res = x;
            for (var i = 1; i < y; i++) {
                res = multiply(x, res);
            }
            return res;
        }
    }
    else if (x instanceof Matrix) {
        return new Matrix(pow(x.valueOf(), y));
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return pow(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('pow', x, y);
}

/**
 * Caculates the power of x to y, x^y, for two complex numbers.
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
