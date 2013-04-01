/**
 * Divide two values. x / y or divide(x, y)
 * @param  {Number | Complex | Unit | Array | Matrix | Range} x
 * @param  {Number | Complex} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
function divide(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('divide', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            // number / number
            return x / y;
        }
        else if (y instanceof Complex) {
            // number / complex
            return divideComplex(new Complex(x, 0), y);
        }
    }

    if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex / number
            return divideComplex(x, new Complex(y, 0));
        }
        else if (y instanceof Complex) {
            // complex / complex
            return divideComplex(x, y);
        }
    }

    if (x instanceof Unit) {
        if (isNumber(y)) {
            var res = x.clone();
            res.value /= y;
            return res;
        }
    }

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
        if (y instanceof Array || y instanceof Matrix || y instanceof Range) {
            // TODO: implement matrix/matrix
        }
        else {
            // matrix / scalar
            return util.map2(x, y, divide);
        }
    }

    if (y instanceof Array || y instanceof Matrix || y instanceof Range) {
        // TODO: implement scalar/matrix
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive value
        return divide(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('divide', x, y);
}

/**
 * Divide two complex numbers. x / y or divide(x, y)
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex} res
 * @private
 */
function divideComplex (x, y) {
    var den = y.re * y.re + y.im * y.im;
    return new Complex(
        (x.re * y.re + x.im * y.im) / den,
        (x.im * y.re - x.re * y.im) / den
    );
}

math.divide = divide;

/**
 * Function documentation
 */
divide.doc = {
    'name': 'divide',
    'category': 'Operators',
    'syntax': [
        'x / y',
        'divide(x, y)'
    ],
    'description': 'Divide two values.',
    'examples': [
        '2 / 3',
        'ans * 3',
        '4.5 / 2',
        '3 + 4 / 2',
        '(3 + 4) / 2',
        '18 km / 4.5'
    ],
    'seealso': [
        'multiply'
    ]
};
