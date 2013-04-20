/**
 * Round a value towards the nearest integer
 *
 *     round(x)
 *     round(x, n)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @param {Number | Array} [n] number of decimals (by default n=0)
 * @return {Number | Complex | Array | Matrix} res
 */
math.round = function round(x, n) {
    if (arguments.length != 1 && arguments.length != 2) {
        throw newArgumentsError('round', arguments.length, 1, 2);
    }

    if (n == undefined) {
        // round (x)
        if (isNumber(x)) {
            return Math.round(x);
        }

        if (x instanceof Complex) {
            return new Complex (
                Math.round(x.re),
                Math.round(x.im)
            );
        }

        if (x instanceof Array || x instanceof Matrix) {
            return util.map(x, math.round);
        }

        if (x.valueOf() !== x) {
            // fallback on the objects primitive value
            return math.round(x.valueOf());
        }

        throw newUnsupportedTypeError('round', x);
    }
    else {
        // round (x, n)
        if (!isNumber(n)) {
            throw new TypeError('Number of decimals in function round must be an integer');
        }
        if (n !== Math.round(n)) {
            throw new TypeError('Number of decimals in function round must be integer');
        }
        if (n < 0 || n > 9) {
            throw new Error ('Number of decimals in function round must be in te range of 0-9');
        }

        if (isNumber(x)) {
            return roundNumber(x, n);
        }

        if (x instanceof Complex) {
            return new Complex (
                roundNumber(x.re, n),
                roundNumber(x.im, n)
            );
        }

        if (x instanceof Array || x instanceof Matrix ||
            n instanceof Array || n instanceof Matrix) {
            return util.map2(x, n, math.round);
        }

        if (x.valueOf() !== x || n.valueOf() !== n) {
            // fallback on the objects primitive values
            return math.round(x.valueOf(), n.valueOf());
        }

        throw newUnsupportedTypeError('round', x, n);
    }
};

/**
 * round a number to the given number of decimals, or to zero if decimals is
 * not provided
 * @param {Number} value
 * @param {Number} [decimals]  number of decimals, between 0 and 15 (0 by default)
 * @return {Number} roundedValue
 */
function roundNumber (value, decimals) {
    if (decimals) {
        var p = Math.pow(10, decimals);
        return Math.round(value * p) / p;
    }
    else {
        return Math.round(value);
    }
}
