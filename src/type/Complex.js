/**
 * @constructor math2.type.Complex
 *
 * @param {Number} [re]
 * @param {Number} [im]
 */
function Complex(re, im) {
    if (this.constructor != Complex) {
        throw new Error('Complex constructor must be called with the new operator');
    }

    /**
     * @type {Number}
     */
    this.re = re || 0;

    /**
     * @type {Number}
     */
    this.im = im || 0;
}

math2.type.Complex = Complex;

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
        str = format(this.re);
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
            str = format(this.im) + 'i';
        }
    }
    else {
        // complex value
        if (this.im > 0) {
            if (this.im == 1) {
                str = format(this.re) + ' + i';
            }
            else {
                str = format(this.re) + ' + ' + format(this.im) + 'i';
            }
        }
        else {
            if (this.im == -1) {
                str = format(this.re) + ' - i';
            }
            else {
                str = format(this.re) + ' - ' + format(Math.abs(this.im)) + 'i';
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

