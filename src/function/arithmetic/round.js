/**
 * Round a value towards the nearest integer, round(x [, n])
 * @param {Number | Complex} x
 * @param {Number} [n] number of digits
 * @return {Number | Complex} res
 */
function round(x, n) {
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
            return util.round(x, n);
        }

        if (x instanceof Complex) {
            return new Complex (
                util.round(x.re, n),
                util.round(x.im, n)
            );
        }

        throw newUnsupportedTypeError('round', x, n);
    }

    // TODO: implement array support
    // TODO: implement matrix support

}


math.round = round;

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
