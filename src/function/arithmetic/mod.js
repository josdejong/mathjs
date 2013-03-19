/**
 * Calculates the modulus, the remainder of an integer division.
 * @param  {Number | Complex | Array} x
 * @param  {Number | Complex | Array} y
 * @return {Number | Array} res
 */
function mod(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('mod', arguments.length, 2);
    }

    // TODO: only handle integer values in mod?
    if (isNumber(x)) {
        if (isNumber(y)) {
            // number % number
            return x % y;
        }
        else if (y instanceof Complex && y.im == 0) {
            // number % complex
            return x % y.re;
        }
    }
    else if (x instanceof Complex && x.im == 0) {
        if (isNumber(y)) {
            // complex * number
            return x.re % y;
        }
        else if (y instanceof Complex && y.im == 0) {
            // complex * complex
            return x.re % y.re;
        }
    }


    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, mod);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return mod(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('mod', x, y);
}

math.mod = mod;

/**
 * Function documentation
 */
mod.doc = {
    'name': 'mod',
    'category': 'Operators',
    'syntax': [
        'x % y',
        'x mod y',
        'mod(x, y)'
    ],
    'description':
        'Calculates the modulus, the remainder of an integer division.',
    'examples': [
        '7 % 3',
        '11 % 2',
        '10 mod 4',
        'function isOdd(x) = x % 2',
        'isOdd(2)',
        'isOdd(3)'
    ],
    'seealso': []
};
