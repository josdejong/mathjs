/**
 * Compute the factorial of a value, factorial(x) or x!
 * @Param {Number | Array} x
 * @return {Number | Array} res
 */
function factorial (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('factorial', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (!isInteger(x)) {
            throw new TypeError('Function factorial can only handle integer values');
        }

        var value = x,
            res = value;
        value--;
        while (value > 1) {
            res *= value;
            value--;
        }

        if (res == 0) {
            res = 1;        // 0! is per definition 1
        }

        return res;
    }

    if (x instanceof Array) {
        return util.map(x, factorial);
    }
    // TODO: implement matrix support

    throw newUnsupportedTypeError('factorial', x);
}

math.factorial = factorial;

/**
 * Function documentation
 */
factorial.doc = {
    'name': 'factorial',
    'category': 'Probability',
    'syntax': [
        'x!',
        'factorial(x)'
    ],
    'description': 'Compute the factorial of a value',
    'examples': [
        '5!',
        '5*4*3*2*1',
        '3!'
    ],
    'seealso': []
};