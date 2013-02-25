/**
 * @constructor Complex
 *
 * A complex value can be constructed in three ways:
 *     var a = new Complex(re, im);
 *     var b = new Complex(str);
 *     var c = new Complex();
 *
 * Example usage:
 *     var a = new Complex(3, -4);    // 3 - 4i
 *     var b = new Complex('2 + 6i'); // 2 + 6i
 *     var c = new Complex();         // 0 + 0i
 *     var d = math.add(a, b);        // 5 + 2i
 *
 * @param {Number | String} re    A number with the real part of the complex
 *                               value, or a string containing a complex number
 * @param {Number} [im]          The imaginary part of the complex value
 */
function Complex(re, im) {
    if (this.constructor != Complex) {
        throw new SyntaxError(
            'Complex constructor must be called with the new operator');
    }

    switch (arguments.length) {
        case 2:
            // re and im numbers provided
            if (!isNumber(re) || !isNumber(im)) {
                throw new TypeError(
                    'Two numbers or a single string expected in Complex constructor');
            }
            this.re = re;
            this.im = im;
            break;

        case 1:
            // parse string into a complex number
            if (!isString(re)) {
                throw new TypeError(
                    'Two numbers or a single string expected in Complex constructor');
            }

            // TODO: replace by some nice regexp?
            // TODO: also support a pattern like "-2.5e+3 - 7.6e-5i"
            var parts = [],
                part;
            var separator = '+';
            var index = re.lastIndexOf(separator);
            if (index == -1) {
                separator = '-';
                index = re.lastIndexOf(separator);
            }

            if (index != -1) {
                part = trim(re.substring(0, index));
                if (part) {
                    parts.push(part);
                }
                part = trim(re.substring(index + 1));
                if (part) {
                    parts.push(separator + part);
                }
            }
            else {
                part = trim(re);
                if (part) {
                    parts.push(part);
                }
            }

            var ok = false;
            switch (parts.length) {
                case 1:
                    part = parts[0];
                    if (part[part.length - 1].toUpperCase() == 'I') {
                        // complex number
                        this.re = 0;
                        this.im = Number(part.substring(0, part.length - 1));
                        ok = !isNaN(this.im);
                    }
                    else {
                        // real number
                        this.re = Number(part);
                        this.im = 0;
                        ok = !isNaN(this.re);
                    }
                    break;

                case 2:
                    part = parts[0];
                    this.re = Number(parts[0]);
                    this.im = Number(parts[1].substring(0, parts[1].length - 1));
                    ok = !isNaN(this.re) && !isNaN(this.im) &&
                        (parts[1][parts[1].length - 1].toUpperCase() == 'I');
                    break;
            }

            // TODO: allow '+3-2'

            if (!ok) {
                throw new SyntaxError('Invalid value "' + re + '"');
            }

            break;

        case 0:
            // nul values
            this.re = 0;
            this.im = 0;
            break;

        default:
            throw new SyntaxError(
                'Wrong number of arguments in Complex constructor ' +
                    '(' + arguments.length + ' provided, 0, 1, or 2 expected)');
    }
}

math.Complex = Complex;

/**
 * Trim a string
 * http://stackoverflow.com/a/498995/1262753
 * @param str
 * @return {*|void}
 */
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

/**
 * Test whether value is a Complex value
 * @param {*} value
 * @return {Boolean} isComplex
 */
function isComplex(value) {
    return (value instanceof Complex);
}

/**
 * Create a copy of the complex value
 * @return {Complex} copy
 */
Complex.prototype.copy = function () {
    return new Complex(this.re, this.im);
};

/**
 * Get string representation of the Complex value
 * @return {String} str
 */
Complex.prototype.toString = function () {
    var str = '';

    if (this.im === 0) {
        // real value
        str = util.format(this.re);
    }
    else if (this.re === 0) {
        // purely complex value
        if (this.im === 1) {
            str = 'i';
        }
        else if (this.im === -1) {
            str = '-i';
        }
        else {
            str = util.format(this.im) + 'i';
        }
    }
    else {
        // complex value
        if (this.im > 0) {
            if (this.im == 1) {
                str = util.format(this.re) + ' + i';
            }
            else {
                str = util.format(this.re) + ' + ' + util.format(this.im) + 'i';
            }
        }
        else {
            if (this.im == -1) {
                str = util.format(this.re) + ' - i';
            }
            else {
                str = util.format(this.re) + ' - ' + util.format(Math.abs(this.im)) + 'i';
            }
        }
    }

    return str;
};

/**
 * Type documentation
 */
Complex.doc = {
    'name': 'Complex',
    'category': 'type',
    'syntax': [
        'a + bi',
        'a + b * i'
    ],
    'description':
        'A complex value a + bi, ' +
            'where a is the real part and b is the complex part, ' +
            'and i is the imaginary number defined as sqrt(-1).',
    'examples': [
        '2 + 3i',
        'sqrt(-4)',
        '(1.2 -5i) * 2'
    ],
    'seealso': [
        'abs',
        'arg',
        'conj',
        'im',
        're'
    ]
};

