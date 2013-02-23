/**
 * Multiply two values. x + y or multiply(x, y)
 * @param  {Number | Complex | Unit} x
 * @param  {Number | Complex | Unit} y
 * @return {Number | Complex | Unit} res
 */
function multiply(x, y) {
    var res;

    if (arguments.length != 2) {
        throw newArgumentsError('multiply', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            // number * number
            return x * y;
        }
        else if (y instanceof Complex) {
            // number * complex
            return multiplyComplex(new Complex(x, 0), y);
        }
        else if (y instanceof Unit) {
            res = y.copy();
            res.value *= x;
            return res;
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex * number
            return multiplyComplex(x, new Complex(y, 0));
        }
        else if (y instanceof Complex) {
            // complex * complex
            return multiplyComplex(x, y);
        }
    }
    else if (x instanceof Unit) {
        if (isNumber(y)) {
            res = x.copy();
            res.value *= y;
            return res;
        }
    }

    // TODO: implement array support
    // TODO: implement matrix support

    throw newUnsupportedTypeError('multiply', x, y);
}

/**
 * Multiply two complex values. x * y or multiply(x, y)
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex} res
 * @private
 */
function multiplyComplex (x, y) {
    return new Complex(
        x.re * y.re - x.im * y.im,
        x.re * y.im + x.im * y.re
    );
}

math.multiply = multiply;

/**
 * Function documentation
 */
multiply.doc = {
    'name': 'multiply',
    'category': 'Operators',
    'syntax': [
        'x * y',
        'multiply(x, y)'
    ],
    'description': 'multiply two values.',
    'examples': [
        '2.1 * 3.6',
        'ans / 3.6',
        '2 * 3 + 4',
        '2 * (3 + 4)',
        '3 * 2.1 km'
    ],
    'seealso': [
        'divide'
    ]
};
