/**
 * Compute the factorial of a value, factorial(x) or x!
 * @Param {Number | Array | Matrix | Range} x
 * @return {Number | Array | Matrix} res
 */
math.factorial = function factorial (x) {
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
        return util.map(x, math.factorial);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.factorial(x.valueOf());
    }

    throw newUnsupportedTypeError('factorial', x);
};
