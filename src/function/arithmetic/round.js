/**
 * Round a value towards the nearest integer, round(x [, n])
 * @param {Number | Complex | Array | Matrix | Range} x
 * @param {Number | Array} [n] number of digits
 * @return {Number | Complex | Array | Matrix} res
 */
function round(x, n) {
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

        if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
            util.map(x, round);
        }

        if (x.valueOf() !== x) {
            // fallback on the objects primitive value
            return round(x.valueOf());
        }

        throw newUnsupportedTypeError('round', x);
    }
    else {
        // round (x, n)
        if (!isNumber(n)) {
            throw new TypeError('Number of digits in function round must be an integer');
        }
        if (n !== Math.round(n)) {
            throw new TypeError('Number of digits in function round must be integer');
        }
        if (n < 0 || n > 9) {
            throw new Error ('Number of digits in function round must be in te range of 0-9');
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

        if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
            n instanceof Array || n instanceof Matrix || n instanceof Range) {
            return util.map2(x, n, round);
        }

        if (x.valueOf() !== x || n.valueOf() !== n) {
            // fallback on the objects primitive values
            return larger(x.valueOf(), n.valueOf());
        }

        throw newUnsupportedTypeError('round', x, n);
    }
}

math.round = round;

/**
 * round a number to the given number of digits, or to the default if
 * digits is not provided
 * @param {Number} value
 * @param {Number} [digits]  number of digits, between 0 and 15
 * @return {Number} roundedValue
 */
function roundNumber (value, digits) {
    var p = Math.pow(10, (digits != undefined) ? digits : math.options.precision);
    return Math.round(value * p) / p;
}

/**
 * Function documentation
 */
round.doc = {
    'name': 'round',
    'category': 'Arithmetic',
    'syntax': [
        'round(x)',
        'round(x, n)'
    ],
    'description':
        'round a value towards the nearest integer.' +
            'If x is complex, both real and imaginary part are rounded ' +
            'towards the nearest integer. ' +
            'When n is specified, the value is rounded to n decimals.',
    'examples': [
        'round(3.2)',
        'round(3.8)',
        'round(-4.2)',
        'round(-4.8)',
        'round(pi, 3)',
        'round(123.45678, 2)'
    ],
    'seealso': ['ceil', 'floor', 'fix']
};
