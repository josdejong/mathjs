/**
 * Math2
 * An extended Math library for Javascript
 * https://github.com/josdejong/math2
 *
 * @version 0.0.2-SNAPSHOT
 * @date    2013-02-16
 *
 * @license
 * Copyright (C) 2013 Jos de Jong <wjosdejong@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

(function() {

/**
 * Define math2 namespace
 */
var math2 = {
    type: {},
    parser: {}
};

/**
 * CommonJS module exports
 */
if ((typeof module !== 'undefined') && (typeof module.exports !== 'undefined')) {
    module.exports = math2;
}
if (typeof exports !== 'undefined') {
    exports = math2;
}

/**
 * AMD module exports
 */
if (typeof(require) != 'undefined' && typeof(define) != 'undefined') {
    define(function () {
        return math2;
    });
}

/**
 * Browser exports
 */
if (typeof(window) != 'undefined') {
    window['math2'] = math2;
}


var PRECISION = 1E10;

/**
 * Convert a number to a formatted string representation
 * @param {Number} value            The value to be formatted
 * @param {Number} [digits]         number of digits
 * @return {String} formattedValue  The formatted value
 * @private
 */
var format = function (value, digits) {
    if (value === Infinity) {
        return 'Infinity';
    }
    else if (value === -Infinity) {
        return '-Infinity';
    }
    else if (value === NaN) {
        return 'NaN';
    }

    // TODO: what is a nice limit for non-scientific values?
    var abs = Math.abs(value);
    if ( (abs > 0.0001 && abs < 1000000) || abs == 0.0 ) {
        // round the func to a limited number of digits
        return String(round(value, digits));
    }
    else {
        // scientific notation
        var exp = Math.round(Math.log(abs) / Math.LN10);
        var v = value / (Math.pow(10.0, exp));
        return round(v, digits) + 'E' + exp;
    }
};

/**
 * round a number to the given number of digits, or to the default if
 * digits is not provided
 * @param {Number} value
 * @param {Number} [digits]
 * @return {Number} roundedValue
 * @private
 */
var round = function (value, digits) {
    digits = (digits != undefined) ? Math.pow(10, digits) : PRECISION;

    return Math.round(value * digits) / digits;
};

/**
 * Create a semi UUID
 * source: http://stackoverflow.com/a/105074/1262753
 * @return {String} uuid
 * @private
 */
var createUUID = function () {
    var S4 = function () {
        return Math.floor(
            Math.random() * 0x10000 /* 65536 */
        ).toString(16);
    };

    return (
        S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()
        );
};

// Internet Explorer 8 and older does not support Array.indexOf,
// so we define it here in that case
// http://soledadpenades.com/2007/05/17/arrayindexof-in-internet-explorer/
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj){
        for(var i = 0; i < this.length; i++){
            if(this[i] == obj){
                return i;
            }
        }
        return -1;
    };

    try {
        console.log("Warning: Ancient browser detected. Please update your browser");
    }
    catch (err) {
    }
}

// Internet Explorer 8 and older does not support Array.forEach,
// so we define it here in that case
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, scope) {
        for(var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope || this, this[i], i, this);
        }
    }
}

/**
 * @constructor math2.type.Complex
 *
 * @param {Number} [re]
 * @param {Number} [im]
 */
var Complex = math2.type.Complex = function(re, im) {

    // TODO: test if called via new Complex()

    /**
     * @type {Number}
     */
    this.re = re || 0;

    /**
     * @type {Number}
     */
    this.im = im || 0;
};

Complex.name = 'Complex';

/**
 * Create a copy of the complex value
 * @return {math2.type.Complex} copy
 */
Complex.prototype.copy = function () {
    return new math2.type.Complex(this.re, this.im);
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


/**
 * Generic type methods
 */

/**
 * Test whether x is a Number
 * @param {*} x
 * @return {Boolean} isNumber
 * @private
 */
function isNumber(x) {
    return (x instanceof Number) || (typeof x == 'number');
}

/**
 * Test whether x is a Complex
 * @param {*} x
 * @return {Boolean} isComplex
 * @private
 */
function isComplex(x) {
    return (x instanceof Complex);
}

/**
 * Math2 Constants
 */
math2.E         = Math.E;
math2.LN2       = Math.LN2;
math2.LN10      = Math.LN10;
math2.LOG2E     = Math.LOG2E;
math2.LOG10E    = Math.LOG10E;
math2.PI        = Math.PI;
math2.SQRT1_2   = Math.SQRT1_2;
math2.SQRT2     = Math.SQRT2;

math2.I         = new Complex(0, -1);

// lower case constants
math2.pi        = math2.PI;
math2.e         = math2.E;
math2.i         = math2.I;

/**
 * Helper methods for functions
 */

/**
 * Calculate the square root of a value
 * @param {Number | math2.type.Complex} x
 */
var sqrt = math2.sqrt = function (x) {
    if (isNumber(x)) {
        if (x >= 0) {
            return Math.sqrt(x);
        }
        else {
            return sqrt(new Complex(x, 0));
        }
    }

    if (isComplex(x)) {
        var r = Math.sqrt(x.re * x.re + x.im * x.im);
        if (x.im >= 0.0) {
            return new Complex(
                0.5 * Math.sqrt(2.0 * (r + x.re)),
                0.5 * Math.sqrt(2.0 * (r - x.re))
            );
        }
        else {
            return new Complex(
                0.5 * Math.sqrt(2.0 * (r + x.re)),
                -0.5 * Math.sqrt(2.0 * (r - x.re))
            );
        }
    }

    // TODO: matrix

    throw new Error('Function sqrt does not support a parameter of type "' +
        (x && x.name ? x.name : 'unknown') + '"');
};

/**
 * Function documentation
 */
sqrt.doc = {
    'name': 'sqrt',
    'category': 'Arithmetic',
    'syntax': [
        'sqrt(x)'
    ],
    'description':
        'Compute the square root value. ' +
            'If x = y * y, then y is the square root of x.',
    'examples': [
        'sqrt(25)',
        '5 * 5',
        'sqrt(-1)'
    ],
    'seealso': [
        'square',
        'multiply'
    ]
};


})();
