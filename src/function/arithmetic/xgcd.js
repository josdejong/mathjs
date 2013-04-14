/**
 * Calculate the extended greatest common divisor for two or
 * more values.
 *
 *     xgcd(a, b)
 *
 * @param {Number} args    two integer numbers
 * @return {Array}         an array containing 3 integers [div, m, n]
 *                         where div = gcd(a, b) and a*m + b*n = div
 *
 * @see http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
 */
math.xgcd = function xgcd(args) {

    var a = arguments[0],
        b = arguments[1];

    if (arguments.length == 2) {

        // two arguments
        if (isNumber(a) && isNumber(b)) {

            if (!isInteger(a) || !isInteger(b)) {
                throw new Error('Parameters in function xgcd must be integer numbers');
            }

            if(b == 0) {
                return [a, 1, 0];
            }

            var tmp = xgcd(b, a % b),
                div = tmp[0],
                x = tmp[1],
                y = tmp[2];

            return [div, y, x - y * Math.floor(a / b)];
        }

        throw newUnsupportedTypeError('xgcd', a, b);
    }

    // zero or one argument
    throw new SyntaxError('Function xgcd expects two arguments');
};
