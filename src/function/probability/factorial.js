/**
 * Compute the factorial of a value
 *
 *     x!
 *     factorial(x)
 *
 * Factorial only supports an integer value as argument.
 * For matrices, the function is evaluated element wise.
 *
 * @Param {Number | Array | Matrix} x
 * @return {Number | Array | Matrix} res
 */
math.factorial = function factorial (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('factorial', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (!isInteger(x) || x < 0) {
            throw new TypeError('Positive integer value expected in function factorial');
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

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.factorial);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.factorial(x.valueOf());
    }

    throw newUnsupportedTypeError('factorial', x);
};
