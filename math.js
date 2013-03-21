/**
 * math.js
 * https://github.com/josdejong/mathjs
 *
 * Math.js is an extensive math library for JavaScript and Node.js,
 * It features real and complex numbers, units, matrices, a large set of
 * mathematical functions, and a flexible expression parser.
 *
 * @version 0.5.0-SNAPSHOT
 * @date    2013-03-21
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
 * Define namespace
 */
var math = {
    parser: {
        node: {}
    },
    options: {
        precision: 10  // number of decimals in formatted output
    }
};

/**
 * CommonJS module exports
 */
if ((typeof module !== 'undefined') && (typeof module.exports !== 'undefined')) {
    module.exports = math;
}
if (typeof exports !== 'undefined') {
    exports = math;
}

/**
 * AMD module exports
 */
if (typeof(require) != 'undefined' && typeof(define) != 'undefined') {
    define(function () {
        return math;
    });
}

/**
 * Browser exports
 */
if (typeof(window) != 'undefined') {
    window['math'] = math;
}


var util = {};

/**
 * Convert a number to a formatted string representation
 * @param {Number} value            The value to be formatted
 * @param {Number} [digits]         number of digits
 * @return {String} formattedValue  The formatted value
 */
util.format = function format(value, digits) {
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
        return String(roundNumber(value, digits));
    }
    else {
        // scientific notation
        var exp = Math.round(Math.log(abs) / Math.LN10);
        var v = value / (Math.pow(10.0, exp));
        return roundNumber(v, digits) + 'E' + exp;
    }
};

/**
 * Create a semi UUID
 * source: http://stackoverflow.com/a/105074/1262753
 * @return {String} uuid
 */
util.randomUUID = function randomUUID() {
    var S4 = function () {
        return Math.floor(
            Math.random() * 0x10000 /* 65536 */
        ).toString(16);
    };

    return (
        S4() + S4() + '-' +
            S4() + '-' +
            S4() + '-' +
            S4() + '-' +
            S4() + S4() + S4()
        );
};

/**
 * Execute function fn element wise for each element in array. Returns an array
 * with the results
 * @param {Array} array
 * @param {function} fn
 * @return {Array} res
 */
util.map = function map(array, fn) {
    if (!array instanceof Array) {
        throw new TypeError('Array expected');
    }

    return array.map(function (x) {
        return fn(x);
    });
};

/**
 * Execute function fn element wise for each entry in two given arrays, or for
 * an object and array pair. Returns an array with the results
 * @param {Array | Object} array1
 * @param {Array | Object} array2
 * @param {function} fn
 * @return {Array} res
 */
util.map2 = function map2(array1, array2, fn) {
    var res, len, i;
    if (array1 instanceof Array) {
        if (array2 instanceof Array) {
            // fn(array, array)
            if (array1.length != array2.length) {
                throw new Error('Dimension mismatch ' +
                    '(' +  array1.length + ' != ' + array2.length + ')');
            }

            res = [];
            len = array1.length;
            for (i = 0; i < len; i++) {
                res[i] = fn(array1[i], array2[i]);
            }
        }
        else {
            // fn(array, object)
            res = [];
            len = array1.length;
            for (i = 0; i < len; i++) {
                res[i] = fn(array1[i], array2);
            }
        }
    }
    else {
        if (array2 instanceof Array) {
            // fn(object, array)
            res = [];
            len = array2.length;
            for (i = 0; i < len; i++) {
                res[i] = fn(array1, array2[i]);
            }
        }
        else {
            // fn(object, object)
            res = fn(array1, array2);
        }
    }

    return res;
};


util.object = {};


/**
 * For each method for objects. The method loops over all properties of the object.
 * @param {Object} object       The object
 * @param {function} callback   Callback method, called for each item in
 *                              the object or array with three parameters:
 *                              callback(value, index, object)
 */
util.object.forEach = function forEach (object, callback) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            callback(object[key], key, object);
        }
    }
};

/**
 * Creates a new object with the results of calling a provided function on
 * every property in the object.
 * @param {Object} object           The object
 * @param {function} fn             Mapping function
 * @return {Object} mappedObject
 */
util.object.map = function map (object, fn) {
    var m = {};
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            m[key] = fn(object[key]);
        }
    }
    return m;
};


util.array = {};

/**
 * Recursively get the size of an array.
 * The size is calculated from the first dimension.
 * The array is not checked for matching dimensions, that should be done using
 * util.array.validate or util.array.validatedSize
 * @param {Array} x
 * @Return {Number[]} size
 */
util.array.size = function size (x) {
    if (x instanceof Array) {
        var sizeX = x.length;
        if (sizeX) {
            var size0 = util.array.size(x[0]);
            return [sizeX].concat(size0);
        }
        else {
            return [sizeX];
        }
    }
    else {
        return [];
    }
};

/**
 * Verify whether each element in an n dimensional array has the correct size
 * @param {Array} array    Array to be validated
 * @param {Number[]} size  Array with dimensions
 * @param {Number} [dim]   Current dimension
 * @throw Error
 */
util.array.validate = function validate(array, size, dim) {
    if (size.length == 0) {
        // scalar
        if (array instanceof Array) {
            throw new Error('Dimension mismatch (' + array.length + ' != 0)');
        }
        return;
    }

    var i,
        len = array.length;
    if (!dim) {
        dim = 0;
    }

    if (len != size[dim]) {
        throw new Error('Dimension mismatch (' + len + ' != ' + size[dim] + ')');
    }

    if (dim < size.length - 1) {
        // recursively validate each child array
        var dimNext = dim + 1;
        for (i = 0; i < len; i++) {
            var child = array[i];
            if (!(child instanceof Array)) {
                throw new Error('Dimension mismatch ' +
                    '(' + (size.length - 1) + ' < ' + size.length + ')');
            }
            validate(array[i], size, dimNext);
        }
    }
    else {
        // last dimension. none of the childs may be an array
        for (i = 0; i < len; i++) {
            if (array[i] instanceof Array) {
                throw new Error('Dimension mismatch ' +
                    '(' + (size.length + 1) + ' > ' + size.length + ')');
            }
        }
    }

    return true;
};

/**
 * Recursively get the size of a multidimensional array.
 * The array is checked for matching dimensions.
 * @param {Array} x
 * @Return {Number[]} size
 */
util.array.validatedSize = function validatedSize(x) {
    var s = util.array.size(x);
    util.array.validate(x, s);
    return s;
};

// Internet Explorer 8 and older does not support Array.indexOf, so we define
// it here in that case.
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
}

// Internet Explorer 8 and older does not support Array.forEach, so we define
// it here in that case.
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, scope) {
        for(var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope || this, this[i], i, this);
        }
    }
}

// Internet Explorer 8 and older does not support Array.map, so we define it
// here in that case.
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map
// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
        // the standard built-in constructor with that name and len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while(k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[ k ];

                // ii. Let mappedValue be the result of calling the Call internal method of callback
                // with T as the this value and argument list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

                // For best browser support, use the following:
                A[ k ] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };
}

/**
 * @constructor Complex
 *
 * A complex value can be constructed in the following ways:
 *     var a = new Complex(re, im);
 *     var b = new Complex(str);
 *     var c = new Complex();
 *     var d = Complex.parse(str);
 *
 * The constructor new Complex(str) is equivalent with Complex.parse(str), but
 * the constructor will throw an error in case of an invalid string, whilst the
 * parse method will return null.
 *
 * Example usage:
 *     var a = new Complex(3, -4);    // 3 - 4i
 *     var b = new Complex('2 + 6i'); // 2 + 6i
 *     var c = new Complex();         // 0 + 0i
 *     var d = math.add(a, b);        // 5 + 2i
 *
 * @param {Number | String} re   A number with the real part of the complex
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
            var c = Complex.parse(re);
            if (c) {
                return c;
            }
            else {
                throw new SyntaxError('String "' + re + '" is no valid complex number');
            }
            break;

        case 0:
            // no parameters. Set re and im zero
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

// Complex parser methods in a closure
(function () {
    var text, index, c;

    function skipWhitespace() {
        while (c == ' ' || c == '\t') {
            next();
        }
    }

    function isDigitDot (c) {
        return ((c >= '0' && c <= '9') || c == '.');
    }

    function isDigit (c) {
        return ((c >= '0' && c <= '9'));
    }

    function next() {
        index++;
        c = text[index];
    }

    function revert(oldIndex) {
        index = oldIndex;
        c = text[index];
    }

    function parseNumber () {
        var number = '';
        var oldIndex = index;

        if (c == '+') {
            next();
        }
        else if (c == '-') {
            number += c;
            next();
        }

        if (!isDigitDot(c)) {
            // a + or - must be followed by a digit
            revert(oldIndex);
            return null;
        }

        // TODO only allow a single dot, and enforce at least one digit before or after the dot
        while (isDigitDot(c)) {
            number += c;
            next();
        }

        // check for scientific notation like "2.3e-4" or "1.23e50"
        if (c == 'E' || c == 'e') {
            number += c;
            next();

            if (c == '+' || c == '-') {
                number += c;
                next();
            }

            // Scientific notation MUST be followed by an exponent
            if (!isDigit(c)) {
                // this is no legal number, exponent is missing.
                revert(oldIndex);
                return null;
            }

            while (isDigit(c)) {
                number += c;
                next();
            }
        }

        return number;
    }

    function parseComplex () {
        // check for 'i', '-i', '+i'
        var cnext = text[index + 1];
        if (c == 'I' || c == 'i') {
            next();
            return '1';
        }
        else if ((c == '+' || c == '-') && (cnext == 'I' || cnext == 'i')) {
            var number = (c == '+') ? '1' : '-1';
            next();
            next();
            return number;
        }

        return null;
    }

    /**
     * Parse a complex number from a string. For example Complex.parse("2 + 3i")
     * will return a Complex value where re = 2, im = 3.
     * Returns null if provided string does not contain a valid complex number.
     * @param {String} str
     * @returns {Complex | null} complex
     */
    Complex.parse = function parse(str) {
        text = str;
        index = -1;
        c = '';

        if (!isString(text)) {
            return null;
        }

        next();
        skipWhitespace();
        var first = parseNumber();
        if (first) {
            if (c == 'I' || c == 'i') {
                // pure imaginary number
                next();
                skipWhitespace();
                if (c) {
                    // garbage at the end. not good.
                    return null;
                }

                return new Complex(0, Number(first));
            }
            else {
                // complex and real part
                skipWhitespace();
                var separator = c;
                if (separator != '+' && separator != '-') {
                    // pure real number
                    skipWhitespace();
                    if (c) {
                        // garbage at the end. not good.
                        return null;
                    }

                    return new Complex(Number(first), 0);
                }
                else {
                    // complex and real part
                    next();
                    skipWhitespace();
                    var second = parseNumber();
                    if (second) {
                        if (c != 'I' && c != 'i') {
                            // 'i' missing at the end of the complex number
                            return null;
                        }
                        next();
                    }
                    else {
                        second = parseComplex();
                        if (!second) {
                            // imaginary number missing after separator
                            return null;
                        }
                    }

                    if (separator == '-') {
                        if (second[0] == '-') {
                            second =  '+' + second.substring(1);
                        }
                        else {
                            second = '-' + second;
                        }
                    }

                    next();
                    skipWhitespace();
                    if (c) {
                        // garbage at the end. not good.
                        return null;
                    }

                    return new Complex(Number(first), Number(second));
                }
            }
        }
        else {
            // check for 'i', '-i', '+i'
            first = parseComplex();
            if (first) {
                skipWhitespace();
                if (c) {
                    // garbage at the end. not good.
                    return null;
                }

                return new Complex(0, Number(first));
            }
        }

        return null;
    };

})();

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
 * @return {Complex} clone
 */
Complex.prototype.clone = function () {
    return new Complex(this.re, this.im);
};

/**
 * Get string representation of the Complex value
 * @return {String} str
 */
Complex.prototype.toString = function () {
    var str = '';

    if (this.im == 0) {
        // real value
        str = util.format(this.re);
    }
    else if (this.re == 0) {
        // purely complex value
        if (this.im == 1) {
            str = 'i';
        }
        else if (this.im == -1) {
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


/**
 * @constructor Matrix
 *
 * TODO: document Matrix
 *
 * @param {Array} [data]    A multi dimensional array
 */
function Matrix(data) {
    if (this.constructor != Matrix) {
        throw new SyntaxError(
            'Matrix constructor must be called with the new operator');
    }

    this.data = data ? data.valueOf() : null;

    // verify the size of the array
    util.array.validatedSize(this.data);
}

math.Matrix = Matrix;

// TODO: implement method parse
// TODO: implement method get
// TODO: implement method set
// TODO: implement method resize

/**
 * Create a clone of the matrix
 * @return {Matrix} clone
 */
Matrix.prototype.clone = function () {
    var matrix = new Matrix();
    matrix.data = clone(this.data);
    return matrix;
};


/**
 * Retrieve the size of the matrix.
 * The size of the matrix will be validated too
 * @returns {Number[]} size
 */
Matrix.prototype.size = function () {
    return util.array.validatedSize(this.data);
};

/**
 * Get the scalar value of the matrix. Will return null if the matrix is no
 * scalar value
 * @return {* | null} scalar
 */
Matrix.prototype.toScalar = function () {
    var scalar = this.data;
    while (scalar instanceof Array && scalar.length == 1) {
        scalar = value[0];
    }

    if (scalar instanceof Array) {
        return null;
    }
    else {
        return scalar;
    }
};

/**
 * Test whether the matrix is a scalar.
 * @return {boolean} isScalar
 */
Matrix.prototype.isScalar = function () {
    var scalar = this.data;
    while (scalar instanceof Array && scalar.length == 1) {
        scalar = scalar[0];
    }
    return !(scalar instanceof Array);
};

/**
 * Get the matrix contents as vector.
 * A matrix is a vector when it has 0 or 1 dimensions, or has multiple
 * dimensions where maximum one of the dimensions has a size larger than 1.
 * Returns null if the Matrix is no vector
 * return {Vector} vector
 */
Matrix.prototype.toVector = function () {
    /* TODO: implement toVector
    var count = 0;
    var dim = undefined;
    var s = util.array.validatedSize(this.data);
    s.forEach(function (length, index) {
        if (length > 1) {
            count++;
            dim = index;
        }
    });
    if (count > 1) {
        return null;
    }

    /// TODO: clone the values
    */
    throw new Error('not yet implemented');
};

/**
 * Test if the matrix is a vector.
 * A matrix is a vector when it has 0 or 1 dimensions, or has multiple
 * dimensions where maximum one of the dimensions has a size larger than 1.
 * return {boolean} isVector
 */
Matrix.prototype.isVector = function () {
    var count = 0;
    var s = util.array.validatedSize(this.data);
    s.forEach(function (length) {
        if (length > 1) {
            count++;
        }
    });
    return (count <= 1);
};

/**
 * Get the matrix contents as an Array.
 * The returned Array is a clone of the original matrix data
 * @returns {Array} array
 */
Matrix.prototype.toArray = function () {
    return clone(this.data);
};

/**
 * Get the primitive value of the Matrix: a multidimensional array
 * @returns {Array} array
 */
Matrix.prototype.valueOf = function () {
    return this.data;
};

// TODO: implement Matrix.toString()

/**
 * Utility functions for Numbers
 */


/**
 * Test whether value is a Number
 * @param {*} value
 * @return {Boolean} isNumber
 */
function isNumber(value) {
    return (value instanceof Number) || (typeof value == 'number');
}

/**
 * Check if a number is integer
 * @param {Number} value
 * @return {Boolean} isInteger
 */
function isInteger(value) {
    return (value == Math.round(value));
}

/**
 * Utility functions for Strings
 */

/**
 * Test whether value is a String
 * @param {*} value
 * @return {Boolean} isString
 */
function isString(value) {
    return (value instanceof String) || (typeof value == 'string');
}

/**
 * @constructor Unit
 *
 * A unit can be constructed in the following ways:
 *     var a = new Unit(value, unit);
 *     var a = new Unit(null, unit);
 *     var b = new Unit(str);
 *     var d = Unit.parse(str);
 *
 * The constructor new Unit(str) is equivalent with Unit.parse(str), but
 * the constructor will throw an error in case of an invalid string, whilst the
 * parse method will return null.
 *
 * Example usage:
 *     var a = new Unit(5, 'cm');               // 50 mm
 *     var b = new Unit('23 kg');               // 23 kg
 *     var c = math.in(a, new Unit(null, 'm');  // 0.05 m
 *
 * @param {Number | String} [value] A value for the unit, like 5.2, or a string
 *                                  with a value and unit like "5.2cm"
 * @param {String} [unit]           A unit like "cm" or "inch"
 */
function Unit(value, unit) {
    if (this.constructor != Unit) {
        throw new Error('Unit constructor must be called with the new operator');
    }

    this.value = 1;
    this.unit = Unit.UNIT_NONE;
    this.prefix = Unit.PREFIX_NONE;  // link to a list with supported prefixes

    this.hasUnit = false;
    this.hasValue = false;
    this.fixPrefix = false;  // is set true by the method "x In unit"s

    var len = arguments.length;
    if (len == 0) {
        // no arguments
    }
    else if (len == 1) {
        // parse a string
        if (!isString(value)) {
            throw new TypeError('A string or a number and string expected in Unit constructor');
        }

        var u = Unit.parse(value);
        if (u) {
            return u;
        }
        else {
            throw new SyntaxError('String "' + value + '" is no valid unit');
        }
    }
    else if (len == 2) {
        // a number and a unit
        if (!isString(unit)) {
            throw new Error('Second parameter in Unit constructor must be a String');
        }

        // find the unit and prefix from the string
        var UNITS = Unit.UNITS;
        var found = false;
        for (var i = 0, iMax = UNITS.length; i < iMax; i++) {
            var UNIT = UNITS[i];

            if (Unit.endsWith(unit, UNIT.name) ) {
                var prefixLen = (unit.length - UNIT.name.length);
                var prefixName = unit.substring(0, prefixLen);
                var prefix = UNIT.prefixes[prefixName];
                if (prefix !== undefined) {
                    // store unit, prefix, and value
                    this.unit = UNIT;
                    this.prefix = prefix;
                    this.hasUnit = true;

                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            throw new Error('String "' + unit + '" is no unit');
        }

        if (value != null) {
            this.value = this._normalize(value);
            this.hasValue = true;
        }
        else {
            this.value = this._normalize(1);
        }
    }
    else {
        throw new Error('Too many parameters in Unit constructor, 1 or 2 expected');
    }
}

math.Unit = Unit;

(function() {
    var text, index, c;

    function skipWhitespace() {
        while (c == ' ' || c == '\t') {
            next();
        }
    }

    function isDigitDot (c) {
        return ((c >= '0' && c <= '9') || c == '.');
    }

    function isDigit (c) {
        return ((c >= '0' && c <= '9'));
    }

    function next() {
        index++;
        c = text[index];
    }

    function revert(oldIndex) {
        index = oldIndex;
        c = text[index];
    }

    function parseNumber () {
        var number = '';
        var oldIndex = index;

        if (c == '+') {
            next();
        }
        else if (c == '-') {
            number += c;
            next();
        }

        if (!isDigitDot(c)) {
            // a + or - must be followed by a digit
            revert(oldIndex);
            return null;
        }

        // TODO only allow a single dot, and enforce at least one digit before or after the dot
        while (isDigitDot(c)) {
            number += c;
            next();
        }

        // check for scientific notation like "2.3e-4" or "1.23e50"
        if (c == 'E' || c == 'e') {
            number += c;
            next();

            if (c == '+' || c == '-') {
                number += c;
                next();
            }

            // Scientific notation MUST be followed by an exponent
            if (!isDigit(c)) {
                // this is no legal number, exponent is missing.
                revert(oldIndex);
                return null;
            }

            while (isDigit(c)) {
                number += c;
                next();
            }
        }

        return number;
    }

    function parseUnit() {
        var unit = '';

        skipWhitespace();
        while (c && c != ' ' && c != '\t') {
            unit += c;
            next();
        }

        return unit || null;
    }

    /**
     * Parse a string into a unit. Returns null if the provided string does not
     * contain a valid unit.
     * @param {String} str        A string like "5.2 inch", "4e2 kg"
     * @return {Unit | null} unit
     */
    Unit.parse = function parse(str) {
        text = str;
        index = -1;
        c = '';

        if (!isString(text)) {
            return null;
        }

        next();
        skipWhitespace();
        var value = parseNumber();
        var unit;
        if (value) {
            unit = parseUnit();

            next();
            skipWhitespace();
            if (c) {
                // garbage at the end. not good.
                return null;
            }

            if (value && unit) {
                return new Unit(Number(value), unit);
            }
        }
        else {
            unit = parseUnit();

            next();
            skipWhitespace();
            if (c) {
                // garbage at the end. not good.
                return null;
            }

            return new Unit(null, unit)
        }

        return null;
    };

})();

/**
 * Test whether value is a Unit
 * @param {*} value
 * @return {Boolean} isUnit
 */
function isUnit(value) {
    return (value instanceof Unit);
}

/**
 * create a copy of this unit
 * @return {Unit} clone
 */
Unit.prototype.clone = function () {
    var clone = new Unit();

    for (var p in this) {
        if (this.hasOwnProperty(p)) {
            clone[p] = this[p];
        }
    }

    return clone;
};

/**
 * check if a text ends with a certain string
 * @param {String} text
 * @param {String} search
 */
// TODO: put the endsWith method in another
Unit.endsWith = function(text, search) {
    var start = text.length - search.length;
    var end = text.length;
    return (text.substring(start, end) === search);
};

/**
 * Normalize a value, based on its currently set unit
 * @param {Number} value
 * @return {Number} normalized value
 * @private
 */
Unit.prototype._normalize = function(value) {
    return (value + this.unit.offset) *
        this.unit.value * this.prefix.value;
};

/**
 * Unnormalize a value, based on its currently set unit
 * @param {Number} value
 * @param {Number} prefixValue    Optional prefixvalue to be used
 * @return {Number} unnormalized value
 * @private
 */
Unit.prototype._unnormalize = function (value, prefixValue) {
    if (prefixValue === undefined) {
        return value / this.unit.value / this.prefix.value -
            this.unit.offset;
    }
    else {
        return value / this.unit.value / prefixValue -
            this.unit.offset;
    }
};

/**
 * Test if the given expression is a unit
 * @param {String} unit   A unit with prefix, like "cm"
 * @return {Boolean}      true if the given string is a unit
 */
Unit.isUnit = function (unit) {
    var UNITS = Unit.UNITS;
    var num = UNITS.length;
    for (var i = 0; i < num; i++) {
        var UNIT = UNITS[i];

        if (Unit.endsWith(unit, UNIT.name) ) {
            var prefixLen = (unit.length - UNIT.name.length);
            if (prefixLen == 0) {
                return true;
            }

            var prefixName = unit.substring(0, prefixLen);
            var prefix = UNIT.prefixes[prefixName];
            if (prefix !== undefined) {
                return true;
            }
        }
    }

    return false;
};

/**
 * check if this unit has given base unit
 * @param {Unit.BASE_UNITS} base
 */
Unit.prototype.hasBase = function(base) {
    if (this.unit.base === undefined) {
        return (base === undefined);
    }
    return (this.unit.base === base);
};

/**
 * Check if this unit has a base equal to another base
 * @param {Unit} other
 * @return {Boolean} true if equal base
 */
Unit.prototype.equalBase = function(other) {
    return (this.unit.base === other.unit.base);
};

/**
 * Check if this unit equals another unit
 * @param {Unit} other
 * @return {Boolean} true if both units are equal
 */
Unit.prototype.equals = function(other) {
    return (this.equalBase(other) && this.value == other.value);
};

/**
 * Get string representation
 * @return {String}
 */
Unit.prototype.toString = function() {
    var value;
    if (!this.fixPrefix) {
        // find the best prefix value (resulting in the value of which
        // the absolute value of the log10 is closest to zero,
        // though with a little offset of 1.2 for nicer values: you get a
        // sequence 1mm 100mm 500mm 0.6m 1m 10m 100m 500m 0.6km 1km ...
        var absValue = Math.abs(this.value / this.unit.value);
        var bestPrefix = Unit.PREFIX_NONE;
        var bestDiff = Math.abs(
            Math.log(absValue / bestPrefix.value) / Math.LN10 - 1.2);

        var prefixes = this.unit.prefixes;
        for (var p in prefixes) {
            if (prefixes.hasOwnProperty(p)) {
                var prefix = prefixes[p];
                if (prefix.scientific) {
                    var diff = Math.abs(
                        Math.log(absValue / prefix.value) / Math.LN10 - 1.2);

                    if (diff < bestDiff) {
                        bestPrefix = prefix;
                        bestDiff = diff;
                    }
                }
            }
        }

        value = this._unnormalize(this.value, bestPrefix.value);
        return util.format(value) + ' ' + bestPrefix.name + this.unit.name;
    }
    else {
        value = this._unnormalize(this.value);
        return util.format(value) + ' ' + this.prefix.name + this.unit.name;
    }
};

Unit.PREFIXES = {
    'NONE': {
        '': {'name': '', 'value': 1, 'scientific': true}
    },
    'SHORT': {
        '': {'name': '', 'value': 1, 'scientific': true},

        'da': {'name': 'da', 'value': 1e1, 'scientific': false},
        'h': {'name': 'h', 'value': 1e2, 'scientific': false},
        'k': {'name': 'k', 'value': 1e3, 'scientific': true},
        'M': {'name': 'M', 'value': 1e6, 'scientific': true},
        'G': {'name': 'G', 'value': 1e9, 'scientific': true},
        'T': {'name': 'T', 'value': 1e12, 'scientific': true},
        'P': {'name': 'P', 'value': 1e15, 'scientific': true},
        'E': {'name': 'E', 'value': 1e18, 'scientific': true},
        'Z': {'name': 'Z', 'value': 1e21, 'scientific': true},
        'Y': {'name': 'Y', 'value': 1e24, 'scientific': true},

        'd': {'name': 'd', 'value': 1e-1, 'scientific': false},
        'c': {'name': 'c', 'value': 1e-2, 'scientific': false},
        'm': {'name': 'm', 'value': 1e-3, 'scientific': true},
        // 'µ': {'name': 'µ', 'value': 1e-6, 'scientific': true},
        'u': {'name': 'u', 'value': 1e-6, 'scientific': true},
        'n': {'name': 'n', 'value': 1e-9, 'scientific': true},
        'p': {'name': 'p', 'value': 1e-12, 'scientific': true},
        'f': {'name': 'f', 'value': 1e-15, 'scientific': true},
        'a': {'name': 'a', 'value': 1e-18, 'scientific': true},
        'z': {'name': 'z', 'value': 1e-21, 'scientific': true},
        'y': {'name': 'y', 'value': 1e-24, 'scientific': true}
    },
    'LONG': {
        '': {'name': '', 'value': 1, 'scientific': true},

        'deca': {'name': 'deca', 'value': 1e1, 'scientific': false},
        'hecto': {'name': 'hecto', 'value': 1e2, 'scientific': false},
        'kilo': {'name': 'kilo', 'value': 1e3, 'scientific': true},
        'mega': {'name': 'mega', 'value': 1e6, 'scientific': true},
        'giga': {'name': 'giga', 'value': 1e9, 'scientific': true},
        'tera': {'name': 'tera', 'value': 1e12, 'scientific': true},
        'peta': {'name': 'peta', 'value': 1e15, 'scientific': true},
        'exa': {'name': 'exa', 'value': 1e18, 'scientific': true},
        'zetta': {'name': 'zetta', 'value': 1e21, 'scientific': true},
        'yotta': {'name': 'yotta', 'value': 1e24, 'scientific': true},

        'deci': {'name': 'deci', 'value': 1e-1, 'scientific': false},
        'centi': {'name': 'centi', 'value': 1e-2, 'scientific': false},
        'milli': {'name': 'milli', 'value': 1e-3, 'scientific': true},
        'micro': {'name': 'micro', 'value': 1e-6, 'scientific': true},
        'nano': {'name': 'nano', 'value': 1e-9, 'scientific': true},
        'pico': {'name': 'pico', 'value': 1e-12, 'scientific': true},
        'femto': {'name': 'femto', 'value': 1e-15, 'scientific': true},
        'atto': {'name': 'atto', 'value': 1e-18, 'scientific': true},
        'zepto': {'name': 'zepto', 'value': 1e-21, 'scientific': true},
        'yocto': {'name': 'yocto', 'value': 1e-24, 'scientific': true}
    },
    'BINARY_SHORT': {
        '': {'name': '', 'value': 1, 'scientific': true},
        'k': {'name': 'k', 'value': 1024, 'scientific': true},
        'M': {'name': 'M', 'value': Math.pow(1024, 2), 'scientific': true},
        'G': {'name': 'G', 'value': Math.pow(1024, 3), 'scientific': true},
        'T': {'name': 'T', 'value': Math.pow(1024, 4), 'scientific': true},
        'P': {'name': 'P', 'value': Math.pow(1024, 5), 'scientific': true},
        'E': {'name': 'E', 'value': Math.pow(1024, 6), 'scientific': true},
        'Z': {'name': 'Z', 'value': Math.pow(1024, 7), 'scientific': true},
        'Y': {'name': 'Y', 'value': Math.pow(1024, 8), 'scientific': true},

        'Ki': {'name': 'Ki', 'value': 1024, 'scientific': true},
        'Mi': {'name': 'Mi', 'value': Math.pow(1024, 2), 'scientific': true},
        'Gi': {'name': 'Gi', 'value': Math.pow(1024, 3), 'scientific': true},
        'Ti': {'name': 'Ti', 'value': Math.pow(1024, 4), 'scientific': true},
        'Pi': {'name': 'Pi', 'value': Math.pow(1024, 5), 'scientific': true},
        'Ei': {'name': 'Ei', 'value': Math.pow(1024, 6), 'scientific': true},
        'Zi': {'name': 'Zi', 'value': Math.pow(1024, 7), 'scientific': true},
        'Yi': {'name': 'Yi', 'value': Math.pow(1024, 8), 'scientific': true}
    },
    'BINARY_LONG': {
        '': {'name': '', 'value': 1, 'scientific': true},
        'kilo': {'name': 'kilo', 'value': 1024, 'scientific': true},
        'mega': {'name': 'mega', 'value': Math.pow(1024, 2), 'scientific': true},
        'giga': {'name': 'giga', 'value': Math.pow(1024, 3), 'scientific': true},
        'tera': {'name': 'tera', 'value': Math.pow(1024, 4), 'scientific': true},
        'peta': {'name': 'peta', 'value': Math.pow(1024, 5), 'scientific': true},
        'exa': {'name': 'exa', 'value': Math.pow(1024, 6), 'scientific': true},
        'zetta': {'name': 'zetta', 'value': Math.pow(1024, 7), 'scientific': true},
        'yotta': {'name': 'yotta', 'value': Math.pow(1024, 8), 'scientific': true},

        'kibi': {'name': 'kibi', 'value': 1024, 'scientific': true},
        'mebi': {'name': 'mebi', 'value': Math.pow(1024, 2), 'scientific': true},
        'gibi': {'name': 'gibi', 'value': Math.pow(1024, 3), 'scientific': true},
        'tebi': {'name': 'tebi', 'value': Math.pow(1024, 4), 'scientific': true},
        'pebi': {'name': 'pebi', 'value': Math.pow(1024, 5), 'scientific': true},
        'exi': {'name': 'exi', 'value': Math.pow(1024, 6), 'scientific': true},
        'zebi': {'name': 'zebi', 'value': Math.pow(1024, 7), 'scientific': true},
        'yobi': {'name': 'yobi', 'value': Math.pow(1024, 8), 'scientific': true}
    }
};

Unit.PREFIX_NONE = {'name': '', 'value': 1, 'scientific': true};

Unit.BASE_UNITS = {
    'NONE': {},

    'LENGTH': {},               // meter
    'MASS': {},                 // kilogram
    'TIME': {},                 // second
    'CURRENT': {},              // ampere
    'TEMPERATURE': {},          // kelvin
    'LUMINOUS_INTENSITY': {},   // candela
    'AMOUNT_OF_SUBSTANCE': {},  // mole

    'FORCE': {},        // Newton
    'SURFACE': {},      // m2
    'VOLUME': {},       // m3
    'ANGLE': {},        // rad
    'BIT': {}           // bit (digital)
};

var BASE_UNITS = Unit.BASE_UNITS;
var PREFIXES = Unit.PREFIXES;

Unit.BASE_UNIT_NONE = {};

Unit.UNIT_NONE = {'name': '', 'base': Unit.BASE_UNIT_NONE, 'value': 1, 'offset': 0};

Unit.UNITS = [
    // length
    {'name': 'meter', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
    {'name': 'inch', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.0254, 'offset': 0},
    {'name': 'foot', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.3048, 'offset': 0},
    {'name': 'yard', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.9144, 'offset': 0},
    {'name': 'mile', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 1609.344, 'offset': 0},
    {'name': 'link', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.201168, 'offset': 0},
    {'name': 'rod', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 5.029210, 'offset': 0},
    {'name': 'chain', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 20.1168, 'offset': 0},
    {'name': 'angstrom', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 1e-10, 'offset': 0},

    {'name': 'm', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
    //{'name': 'in', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.0254, 'offset': 0}, not supported, In is an operator
    {'name': 'ft', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.3048, 'offset': 0},
    {'name': 'yd', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.9144, 'offset': 0},
    {'name': 'mi', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 1609.344, 'offset': 0},
    {'name': 'li', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.201168, 'offset': 0},
    {'name': 'rd', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 5.029210, 'offset': 0},
    {'name': 'ch', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 20.1168, 'offset': 0},
    {'name': 'mil', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.0000254, 'offset': 0}, // 1/1000 inch

    // Surface
    {'name': 'm2', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
    {'name': 'sqin', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 0.00064516, 'offset': 0}, // 645.16 mm2
    {'name': 'sqft', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 0.09290304, 'offset': 0}, // 0.09290304 m2
    {'name': 'sqyd', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 0.83612736, 'offset': 0}, // 0.83612736 m2
    {'name': 'sqmi', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 2589988.110336, 'offset': 0}, // 2.589988110336 km2
    {'name': 'sqrd', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 25.29295, 'offset': 0}, // 25.29295 m2
    {'name': 'sqch', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 404.6873, 'offset': 0}, // 404.6873 m2
    {'name': 'sqmil', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 6.4516e-10, 'offset': 0}, // 6.4516 * 10^-10 m2

    // Volume
    {'name': 'm3', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
    {'name': 'L', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.SHORT, 'value': 0.001, 'offset': 0}, // litre
    {'name': 'litre', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.LONG, 'value': 0.001, 'offset': 0},
    {'name': 'cuin', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 1.6387064e-5, 'offset': 0}, // 1.6387064e-5 m3
    {'name': 'cuft', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.028316846592, 'offset': 0}, // 28.316 846 592 L
    {'name': 'cuyd', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.764554857984, 'offset': 0}, // 764.554 857 984 L
    {'name': 'teaspoon', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.000005, 'offset': 0}, // 5 mL
    {'name': 'tablespoon', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.000015, 'offset': 0}, // 15 mL
    //{'name': 'cup', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.000240, 'offset': 0}, // 240 mL  // not possible, we have already another cup

    // Liquid volume
    {'name': 'minim', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.00000006161152, 'offset': 0}, // 0.06161152 mL
    {'name': 'fluiddram', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0000036966911, 'offset': 0},  // 3.696691 mL
    {'name': 'fluidounce', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.00002957353, 'offset': 0}, // 29.57353 mL
    {'name': 'gill', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0001182941, 'offset': 0}, // 118.2941 mL
    {'name': 'cup', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0002365882, 'offset': 0}, // 236.5882 mL
    {'name': 'pint', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0004731765, 'offset': 0}, // 473.1765 mL
    {'name': 'quart', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0009463529, 'offset': 0}, // 946.3529 mL
    {'name': 'gallon', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.003785412, 'offset': 0}, // 3.785412 L
    {'name': 'beerbarrel', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.1173478, 'offset': 0}, // 117.3478 L
    {'name': 'oilbarrel', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.1589873, 'offset': 0}, // 158.9873 L
    {'name': 'hogshead', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.2384810, 'offset': 0}, // 238.4810 L

    //{'name': 'min', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.00000006161152, 'offset': 0}, // 0.06161152 mL // min is already in use as minute
    {'name': 'fldr', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0000036966911, 'offset': 0},  // 3.696691 mL
    {'name': 'floz', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.00002957353, 'offset': 0}, // 29.57353 mL
    {'name': 'gi', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0001182941, 'offset': 0}, // 118.2941 mL
    {'name': 'cp', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0002365882, 'offset': 0}, // 236.5882 mL
    {'name': 'pt', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0004731765, 'offset': 0}, // 473.1765 mL
    {'name': 'qt', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0009463529, 'offset': 0}, // 946.3529 mL
    {'name': 'gal', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.003785412, 'offset': 0}, // 3.785412 L
    {'name': 'bbl', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.1173478, 'offset': 0}, // 117.3478 L
    {'name': 'obl', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.1589873, 'offset': 0}, // 158.9873 L
    //{'name': 'hogshead', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.2384810, 'offset': 0}, // 238.4810 L // TODO: hh?

    // Mass
    {'name': 'g', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.SHORT, 'value': 0.001, 'offset': 0},
    {'name': 'gram', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.LONG, 'value': 0.001, 'offset': 0},

    {'name': 'ton', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.SHORT, 'value': 907.18474, 'offset': 0},
    {'name': 'tonne', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.SHORT, 'value': 1000, 'offset': 0},

    {'name': 'grain', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 64.79891e-6, 'offset': 0},
    {'name': 'dram', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 1.7718451953125e-3, 'offset': 0},
    {'name': 'ounce', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 28.349523125e-3, 'offset': 0},
    {'name': 'poundmass', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 453.59237e-3, 'offset': 0},
    {'name': 'hundredweight', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 45.359237, 'offset': 0},
    {'name': 'stick', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 115e-3, 'offset': 0},

    {'name': 'gr', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 64.79891e-6, 'offset': 0},
    {'name': 'dr', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 1.7718451953125e-3, 'offset': 0},
    {'name': 'oz', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 28.349523125e-3, 'offset': 0},
    {'name': 'lbm', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 453.59237e-3, 'offset': 0},
    {'name': 'cwt', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 45.359237, 'offset': 0},

    // Time
    {'name': 's', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
    {'name': 'min', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 60, 'offset': 0},
    {'name': 'h', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 3600, 'offset': 0},
    {'name': 'seconds', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
    {'name': 'second', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
    {'name': 'sec', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
    {'name': 'minutes', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 60, 'offset': 0},
    {'name': 'minute', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 60, 'offset': 0},
    {'name': 'hours', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 3600, 'offset': 0},
    {'name': 'hour', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 3600, 'offset': 0},
    {'name': 'day', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 86400, 'offset': 0},
    {'name': 'days', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 86400, 'offset': 0},

    // Angles
    {'name': 'rad', 'base': BASE_UNITS.ANGLE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
    {'name': 'deg', 'base': BASE_UNITS.ANGLE, 'prefixes': PREFIXES.NONE, 'value': 0.017453292519943295769236907684888, 'offset': 0},  // deg = rad / (2*pi) * 360 = rad / 0.017453292519943295769236907684888
    {'name': 'grad', 'base': BASE_UNITS.ANGLE, 'prefixes': PREFIXES.NONE, 'value': 0.015707963267948966192313216916399, 'offset': 0}, // grad = rad / (2*pi) * 400  = rad / 0.015707963267948966192313216916399
    {'name': 'cycle', 'base': BASE_UNITS.ANGLE, 'prefixes': PREFIXES.NONE, 'value': 6.2831853071795864769252867665793, 'offset': 0},  // cycle = rad / (2*pi) = rad / 6.2831853071795864769252867665793

    // Electric current
    {'name': 'A', 'base': BASE_UNITS.CURRENT, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
    {'name': 'ampere', 'base': BASE_UNITS.CURRENT, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},

    // Temperature
    // K(C) = °C + 273.15
    // K(F) = (°F + 459.67) / 1.8
    // K(R) = °R / 1.8
    {'name': 'K', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
    {'name': 'degC', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 273.15},
    {'name': 'degF', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1/1.8, 'offset': 459.67},
    {'name': 'degR', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1/1.8, 'offset': 0},
    {'name': 'kelvin', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
    {'name': 'celsius', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 273.15},
    {'name': 'fahrenheit', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1/1.8, 'offset': 459.67},
    {'name': 'rankine', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1/1.8, 'offset': 0},

    // amount of substance
    {'name': 'mol', 'base': BASE_UNITS.AMOUNT_OF_SUBSTANCE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
    {'name': 'mole', 'base': BASE_UNITS.AMOUNT_OF_SUBSTANCE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},

    // luminous intensity
    {'name': 'cd', 'base': BASE_UNITS.LUMINOUS_INTENSITY, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
    {'name': 'candela', 'base': BASE_UNITS.LUMINOUS_INTENSITY, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
    // TODO: units STERADIAN
    //{'name': 'sr', 'base': BASE_UNITS.STERADIAN, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
    //{'name': 'steradian', 'base': BASE_UNITS.STERADIAN, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},

    // Force
    {'name': 'N', 'base': BASE_UNITS.FORCE, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
    {'name': 'newton', 'base': BASE_UNITS.FORCE, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
    {'name': 'lbf', 'base': BASE_UNITS.FORCE, 'prefixes': PREFIXES.NONE, 'value': 4.4482216152605, 'offset': 0},
    {'name': 'poundforce', 'base': BASE_UNITS.FORCE, 'prefixes': PREFIXES.NONE, 'value': 4.4482216152605, 'offset': 0},

    // Binary
    {'name': 'b', 'base': BASE_UNITS.BIT, 'prefixes': PREFIXES.BINARY_SHORT, 'value': 1, 'offset': 0},
    {'name': 'bits', 'base': BASE_UNITS.BIT, 'prefixes': PREFIXES.BINARY_LONG, 'value': 1, 'offset': 0},
    {'name': 'B', 'base': BASE_UNITS.BIT, 'prefixes': PREFIXES.BINARY_SHORT, 'value': 8, 'offset': 0},
    {'name': 'bytes', 'base': BASE_UNITS.BIT, 'prefixes': PREFIXES.BINARY_LONG, 'value': 8, 'offset': 0}
];

/**
 * @constructor Vector
 *
 * TODO: document Vector
 *
 * @param {Array} [data]    A one dimensional array
 */
function Vector(data) {
    if (this.constructor != Vector) {
        throw new SyntaxError(
            'Vector constructor must be called with the new operator');
    }

    this.data = data ? data.valueOf() : null;

    // verify the size of the array
    var s = util.array.size(this.data);
    util.array.validate(this.data, s);
    if (s.length > 1) {
        throw new Error('Vector can only contain one dimension (size: ' + format(s) + ')');
    }
}

math.Vector = Vector;

// TODO: implement method parse
// TODO: implement method resize

/**
 * get a value or a subset of the vector. Returns undefined when out of range
 * @param {Number | Number[]} index
 * @return {* | *[]} value
 */
Vector.prototype.get = function (index) {
    var me = this;
    index = index.valueOf();

    if (index instanceof Array) {
        return index.map(function (i) {
            return me.get(i);
        });
    }
    else {
        if (!isNumber(index) || !isInteger(index) || index < 0) {
            throw new TypeError('Positive integer expected as index in method get');
        }
        if (this.data instanceof Array) {
            return this.data[index];
        }
        else if (index == 0) {
            return this.data;
        }
        else {
            return undefined;
        }
    }
};

/**
 * Set a value or a set of value in the vector.
 * @param {Number | Number[]} index
 * @param {* | *[]} value
 */
Vector.prototype.set = function (index, value) {
    var me = this;
    index = index.valueOf();

    if (index instanceof Array) {
        if (value instanceof Array) {
            if (index.length != value.length) {
                throw new Error('Dimension mismatch (' + index.length+ ' != ' +
                    value.length + ')');
            }

            util.map2(index, value, function (i, v) {
                me.set(i, v);
            });
        }
        else {
            this.set(index, [value]);
        }
    }
    else {
        if (value instanceof Array) {
            this.set([index], value);
        }
        else {
            if (!(this.data instanceof Array)) {
                this.data = [this.data];
            }
            this.data[index] = value;
        }
    }
};

/**
 * Create a clone of the vector
 * @return {Vector} clone
 */
Vector.prototype.clone = function () {
    var vector = new Vector();
    vector.data = clone(this.data);
    return vector;
};

/**
 * Retrieve the size of the vector.
 * The size of the vector will be validated too
 * @returns {Number[]} size
 */
Vector.prototype.size = function () {
    return util.array.validatedSize(this.data);
};

/**
 * Get the scalar value of the vector. Will return null if the vector is no
 * scalar value
 * @return {* | null} scalar
 */
Vector.prototype.toScalar = function () {
    var value = this.data;
    while (value instanceof Array && value.length == 1) {
        value = value[0];
    }

    if (value instanceof Array) {
        return null;
    }
    else {
        return value;
    }
};

/**
 * Test whether the vector is a scalar.
 * @return {boolean} isScalar
 */
Vector.prototype.isScalar = function () {
    var value = this.data;
    while (value instanceof Array && value.length == 1) {
        value = value[0];
    }
    return !(value instanceof Array);
};

/**
 * Get the vector contents as an Array. The array will contain a clone of
 * the original vector data
 * @returns {Array} array
 */
Vector.prototype.toArray = function () {
    return clone(this.data);
};

/**
 * Get the primitive value of the Value: a one dimensional array
 * @returns {Array} array
 */
Vector.prototype.valueOf = function () {
    return this.data;
};

// TODO: implement Vector.toString()

/**
 * mathjs constants
 */
math.E          = Math.E;
math.LN2        = Math.LN2;
math.LN10       = Math.LN10;
math.LOG2E      = Math.LOG2E;
math.LOG10E     = Math.LOG10E;
math.PI         = Math.PI;
math.SQRT1_2    = Math.SQRT1_2;
math.SQRT2      = Math.SQRT2;

math.I          = new Complex(0, -1);

// lower case constants
math.pi        = math.PI;
math.e         = math.E;
math.i         = math.I;

/**
 * Helper methods for functions
 */

/**
 * Create a TypeError with message:
 *      'Function <fn> does not support a parameter of type <type>';
 * @param {String} name   Function name
 * @param {*} value1
 * @param {*} [value2]
 * @return {TypeError | Error} error
 */
function newUnsupportedTypeError(name, value1, value2) {
    var msg = undefined;
    if (arguments.length == 2) {
        var t = _typeof(value1);
        msg = 'Function ' + name + ' does not support a parameter of type ' + t;
    }
    else if (arguments.length > 2) {
        var types = [];
        for (var i = 1; i < arguments.length; i++) {
            types.push(_typeof(arguments[i]));
        }
        msg = 'Function ' + name + ' does not support a parameters of type ' + types.join(', ');
    }
    else {
        msg = 'Unsupported parameter in function ' + name;
    }

    return new TypeError(msg);
}

/**
 * Create a syntax error with the message:
 *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
 * @param {String} name   Function name
 * @param {Number} count  Actual argument count
 * @param {Number} min    Minimum required argument count
 * @param {Number} [max]  Maximum required argument count
 */
function newArgumentsError(name, count, min, max) {
    var msg = 'Wrong number of arguments in function ' + name +
        ' (' + count + ' provided, ' +
        min + ((max != undefined) ? ('-' + max) : '') + ' expected)';
    return new SyntaxError(msg);
}

/**
 * Calculate the square root of a value
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function abs(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('abs', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.abs(x);
    }

    if (x instanceof Complex) {
        return Math.sqrt(x.re * x.re + x.im * x.im);
    }

    if (x instanceof Array) {
        return util.map(x, abs);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return abs(x.valueOf());
    }

    throw newUnsupportedTypeError('abs', x);
}

math.abs = abs;

/**
 * Function documentation
 */
abs.doc = {
    'name': 'abs',
    'category': 'Arithmetic',
    'syntax': [
        'abs(x)'
    ],
    'description': 'Compute the absolute value.',
    'examples': [
        'abs(3.5)',
        'abs(-4.2)'
    ],
    'seealso': ['sign']
};

/**
 * Add two values. x + y or add(x, y)
 * @param  {Number | Complex | Unit | String | Array} x
 * @param  {Number | Complex | Unit | String | Array} y
 * @return {Number | Complex | Unit | String | Array} res
 */
function add(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('add', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            // number + number
            return x + y;
        }
        else if (y instanceof Complex) {
            // number + complex
            return new Complex(
                x + y.re,
                    y.im
            )
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex + number
            return new Complex(
                x.re + y,
                x.im
            )
        }
        else if (y instanceof Complex) {
            // complex + complex
            return new Complex(
                x.re + y.re,
                x.im + y.im
            );
        }
    }
    else if (x instanceof Unit) {
        if (y instanceof Unit) {
            if (!x.equalBase(y)) {
                throw new Error('Units do not match');
            }

            if (!x.hasValue) {
                throw new Error('Unit on left hand side of operator + has no value');
            }

            if (!y.hasValue) {
                throw new Error('Unit on right hand side of operator + has no value');
            }

            var res = x.clone();
            res.value += y.value;
            res.fixPrefix = false;
            return res;
        }
    }

    if (isString(x) || isString(y)) {
        return x + y;
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, add);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return add(x.valueOf());
    }

    throw newUnsupportedTypeError('add', x, y);
}

math.add = add;

/**
 * Function documentation
 */
add.doc = {
    'name': 'add',
    'category': 'Operators',
    'syntax': [
        'x + y',
        'add(x, y)'
    ],
    'description': 'Add two values.',
    'examples': [
        '2.1 + 3.6',
        'ans - 3.6',
        '3 + 2i',
        '"hello" + " world"',
        '3 cm + 2 inch'
    ],
    'seealso': [
        'subtract'
    ]
};

/**
 * Round a value towards plus infinity, ceil(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function ceil(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('ceil', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.ceil(x);
    }

    if (x instanceof Complex) {
        return new Complex (
            Math.ceil(x.re),
            Math.ceil(x.im)
        );
    }

    if (x instanceof Array) {
        return util.map(x, ceil);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return ceil(x.valueOf());
    }

    throw newUnsupportedTypeError('ceil', x);
}

math.ceil = ceil;

/**
 * Function documentation
 */
ceil.doc = {
    'name': 'ceil',
    'category': 'Arithmetic',
    'syntax': [
        'ceil(x)'
    ],
    'description':
        'Round a value towards plus infinity.' +
            'If x is complex, both real and imaginary part are rounded ' +
            'towards plus infinity.',
    'examples': [
        'ceil(3.2)',
        'ceil(3.8)',
        'ceil(-4.2)'
    ],
    'seealso': ['floor', 'fix', 'round']
};

/**
 * Compute the cube of a value, x * x * x.',
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function cube(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('cube', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x * x * x;
    }

    if (x instanceof Complex) {
        return multiply(multiply(x, x), x);
    }

    if (x instanceof Array) {
        return multiply(multiply(x, x), x);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return cube(x.valueOf());
    }

    throw newUnsupportedTypeError('cube', x);
}

math.cube = cube;

/**
 * Function documentation
 */
cube.doc = {
    'name': 'cube',
    'category': 'Arithmetic',
    'syntax': [
        'cube(x)'
    ],
    'description': 'Compute the cube of a value. ' +
        'The cube of x is x * x * x.',
    'examples': [
        'cube(2)',
        '2^3',
        '2 * 2 * 2'
    ],
    'seealso': [
        'multiply',
        'square',
        'pow'
    ]
};

/**
 * Divide two values. x / y or divide(x, y)
 * @param  {Number | Complex | Unit | Array} x
 * @param  {Number | Complex} y
 * @return {Number | Complex | Unit | Array} res
 */
function divide(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('divide', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            // number / number
            return x / y;
        }
        else if (y instanceof Complex) {
            // number / complex
            return divideComplex(new Complex(x, 0), y);
        }
    }

    if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex / number
            return divideComplex(x, new Complex(y, 0));
        }
        else if (y instanceof Complex) {
            // complex / complex
            return divideComplex(x, y);
        }
    }

    if (x instanceof Unit) {
        if (isNumber(y)) {
            var res = x.clone();
            res.value /= y;
            return res;
        }
    }

    if (x instanceof Array) {
        if (y instanceof Array) {
            // TODO: implement matrix/matrix
        }
        else {
            // matrix / scalar
            return util.map2(x, y, divide);
        }
    }

    if (y instanceof Array) {
        // TODO: implement scalar/matrix
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive value
        return divide(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('divide', x, y);
}

/**
 * Divide two complex numbers. x / y or divide(x, y)
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex} res
 * @private
 */
function divideComplex (x, y) {
    var den = y.re * y.re + y.im * y.im;
    return new Complex(
        (x.re * y.re + x.im * y.im) / den,
        (x.im * y.re - x.re * y.im) / den
    );
}

math.divide = divide;

/**
 * Function documentation
 */
divide.doc = {
    'name': 'divide',
    'category': 'Operators',
    'syntax': [
        'x / y',
        'divide(x, y)'
    ],
    'description': 'Divide two values.',
    'examples': [
        '2 / 3',
        'ans * 3',
        '4.5 / 2',
        '3 + 4 / 2',
        '(3 + 4) / 2',
        '18 km / 4.5'
    ],
    'seealso': [
        'multiply'
    ]
};

/**
 * Check if value x equals y, x == y
 * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
 * @param  {Number | Complex | Unit | String | Array} x
 * @param  {Number | Complex | Unit | String | Array} y
 * @return {Boolean | Array} res
 */
function equal(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('equal', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x == y;
        }
        else if (y instanceof Complex) {
            return (x == y.re) && (y.im == 0);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return (x.re == y) && (x.im == 0);
        }
        else if (y instanceof Complex) {
            return (x.re == y.re) && (x.im == y.im);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value == y.value;
    }

    if (isString(x) || isString(y)) {
        return x == y;
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, equal);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return equal(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('equal', x, y);
}

math.equal = equal;

/**
 * Function documentation
 */
equal.doc = {
    'name': 'equal',
    'category': 'Operators',
    'syntax': [
        'x == y',
        'equal(x, y)'
    ],
    'description':
        'Check equality of two values. ' +
            'Returns 1 if the values are equal, and 0 if not.',
    'examples': [
        '2+2 == 3',
        '2+2 == 4',
        'a = 3.2',
        'b = 6-2.8',
        'a == b',
        '50cm == 0.5m'
    ],
    'seealso': [
        'unequal', 'smaller', 'larger', 'smallereq', 'largereq'
    ]
};

/**
 * Calculate the exponent of a value, exp(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function exp (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('exp', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.exp(x);
    }
    if (x instanceof Complex) {
        var r = Math.exp(x.re);
        return new Complex(
            r * Math.cos(x.im),
            r * Math.sin(x.im)
        );
    }

    if (x instanceof Array) {
        return util.map(x, exp);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return exp(x.valueOf());
    }

    throw newUnsupportedTypeError('exp', x);
}

math.exp = exp;

/**
 * Function documentation
 */
exp.doc = {
    'name': 'exp',
    'category': 'Arithmetic',
    'syntax': [
        'exp(x)'
    ],
    'description': 'Calculate the exponent of a value.',
    'examples': [
        'exp(1.3)',
        'e ^ 1.3',
        'log(exp(1.3))',
        'x = 2.4',
        '(exp(i*x) == cos(x) + i*sin(x))   # Euler\'s formula'
    ],
    'seealso': [
        'square',
        'multiply',
        'log'
    ]
};
/**
 * Round a value towards zero, fix(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function fix(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('fix', arguments.length, 1);
    }

    if (isNumber(x)) {
        return (value > 0) ? Math.floor(x) : Math.ceil(x);
    }

    if (x instanceof Complex) {
        return new Complex(
            (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
            (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
        );
    }

    if (x instanceof Array) {
        return util.map(x, fix);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return fix(x.valueOf());
    }

    throw newUnsupportedTypeError('fix', x);
}

math.fix = fix;

/**
 * Function documentation
 */
fix.doc = {
    'name': 'fix',
    'category': 'Arithmetic',
    'syntax': [
        'fix(x)'
    ],
    'description':
        'Round a value towards zero.' +
            'If x is complex, both real and imaginary part are rounded ' +
            'towards zero.',
    'examples': [
        'fix(3.2)',
        'fix(3.8)',
        'fix(-4.2)',
        'fix(-4.8)'
    ],
    'seealso': ['ceil', 'floor', 'round']
};

/**
 * Round a value towards minus infinity, floor(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function floor(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('floor', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.floor(x);
    }

    if (x instanceof Complex) {
        return new Complex (
            Math.floor(x.re),
            Math.floor(x.im)
        );
    }

    if (x instanceof Array) {
        return util.map(x, floor);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return floor(x.valueOf());
    }

    throw newUnsupportedTypeError('floor', x);
}

math.floor = floor;

/**
 * Function documentation
 */
floor.doc = {
    'name': 'floor',
    'category': 'Arithmetic',
    'syntax': [
        'floor(x)'
    ],
    'description':
        'Round a value towards minus infinity.' +
            'If x is complex, both real and imaginary part are rounded ' +
            'towards minus infinity.',
    'examples': [
        'floor(3.2)',
        'floor(3.8)',
        'floor(-4.2)'
    ],
    'seealso': ['ceil', 'fix', 'round']
};

/**
 * Check if value x is larger y, x > y
 * In case of complex numbers, the absolute values of a and b are compared.
 * @param  {Number | Complex | Unit | String | Array} x
 * @param  {Number | Complex | Unit | String | Array} y
 * @return {Boolean | Array} res
 */
function larger(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('larger', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x > y;
        }
        else if (y instanceof Complex) {
            return x > abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return abs(x) > y;
        }
        else if (y instanceof Complex) {
            return abs(x) > abs(y);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value > y.value;
    }

    if (isString(x) || isString(y)) {
        return x > y;
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, equal);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return larger(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('larger', x, y);
}

math.larger = larger;

/**
 * Function documentation
 */
larger.doc = {
    'name': 'larger',
    'category': 'Operators',
    'syntax': [
        'x > y',
        'larger(x, y)'
    ],
    'description':
        'Check if value x is larger than y. ' +
        'Returns 1 if x is larger than y, and 0 if not.',
    'examples': [
        '2 > 3',
        '5 > 2*2',
        'a = 3.3',
        'b = 6-2.8',
        '(a > b)',
        '(b < a)',
        '5 cm > 2 inch'
    ],
    'seealso': [
        'equal', 'unequal', 'smaller', 'smallereq', 'largereq'
    ]
};

/**
 * Check if value x is larger or equal to y, x >= y
 * In case of complex numbers, the absolute values of a and b are compared.
 * @param  {Number | Complex | Unit | String | Array} x
 * @param  {Number | Complex | Unit | String | Array} y
 * @return {Boolean | Array} res
 */
function largereq(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('largereq', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x >= y;
        }
        else if (y instanceof Complex) {
            return x >= abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return abs(x) >= y;
        }
        else if (y instanceof Complex) {
            return abs(x) >= abs(y);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value >= y.value;
    }

    if (isString(x) || isString(y)) {
        return x >= y;
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, largereq);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return largereq(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('largereq', x, y);
}

math.largereq = largereq;

/**
 * Function documentation
 */
largereq.doc = {
    'name': 'largereq',
    'category': 'Operators',
    'syntax': [
        'x >= y',
        'largereq(x, y)'
    ],
    'description':
        'Check if value x is larger or equal to y. ' +
        'Returns 1 if x is larger or equal to y, and 0 if not.',
    'examples': [
        '2 > 1+1',
        '2 >= 1+1',
        'a = 3.2',
        'b = 6-2.8',
        '(a > b)'
    ],
    'seealso': [
        'equal', 'unequal', 'smallereq', 'smaller', 'largereq'
    ]
};

/**
 * Calculate the logarithm of a value, log(x [, base])
 * base is optional. If not provided, the natural logarithm of x is calculated
 * logarithm for any base, like log(x, base)
 * @param {Number | Complex | Array} x
 * @param {Number | Complex} [base]
 * @return {Number | Complex | Array} res
 */
function log(x, base) {
    if (arguments.length != 1 && arguments.length != 2) {
        throw newArgumentsError('log', arguments.length, 1, 2);
    }

    if (base === undefined) {
        // calculate natural logarithm, log(x)
        if (isNumber(x)) {
            if (x >= 0) {
                return Math.log(x);
            }
            else {
                // negative value -> complex value computation
                return log(new Complex(x, 0));
            }
        }

        if (x instanceof Complex) {
            return new Complex (
                Math.log(Math.sqrt(x.re * x.re + x.im * x.im)),
                Math.atan2(x.im, x.re)
            );
        }

        if (x instanceof Array) {
            return util.map(x, log);
        }
    }
    else {
        // calculate logarithm for a specified base, log(x, base)
        return divide(log(x), log(base));
    }

    if (x.valueOf() !== x || base.valueOf() !== base) {
        // fallback on the objects primitive values
        return log(x.valueOf(), base.valueOf());
    }

    throw newUnsupportedTypeError('log', x, base);
}

math.log = log;

/**
 * Function documentation
 */
log.doc = {
    'name': 'log',
    'category': 'Arithmetic',
    'syntax': [
        'log(x)',
        'log(x, base)'
    ],
    'description': 'Compute the logarithm of a value. ' +
        'If no base is provided, the natural logarithm of x is calculated. ' +
        'If base if provided, the logarithm is calculated for the specified base. ' +
        'log(x, base) is defined as log(x) / log(base).',
    'examples': [
        'log(3.5)',
        'a = log(2.4)',
        'exp(a)',
        '10 ^ 3',
        'log(1000, 10)',
        'log(1000) / log(10)',
        'b = logb(1024, 2)',
        '2 ^ b'
    ],
    'seealso': [
        'exp',
        'log10'
    ]
};

/**
 * Calculate the 10-base logarithm of a value, log10(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function log10(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('log10', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= 0) {
            return Math.log(x) / Math.LN10;
        }
        else {
            // negative value -> complex value computation
            return log10(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        return new Complex (
            Math.log(Math.sqrt(x.re * x.re + x.im * x.im)) / Math.LN10,
            Math.atan2(x.im, x.re) / Math.LN10
        );
    }

    if (x instanceof Array) {
        return util.map(x, log10);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return log10(x.valueOf());
    }

    throw newUnsupportedTypeError('log10', x);
}

math.log10 = log10;

/**
 * Function documentation
 */
log10.doc = {
    'name': 'log10',
    'category': 'Arithmetic',
    'syntax': [
        'log10(x)'
    ],
    'description': 'Compute the 10-base logarithm of a value.',
    'examples': [
        'log10(1000)',
        '10 ^ 3',
        'log10(0.01)',
        'log(1000) / log(10)',
        'log(1000, 10)'
    ],
    'seealso': [
        'exp',
        'log'
    ]
};

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

/**
 * Multiply two values. x + y or multiply(x, y)
 * @param  {Number | Complex | Unit | Array} x
 * @param  {Number | Complex | Unit | Array} y
 * @return {Number | Complex | Unit | Array} res
 */
function multiply(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('multiply', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            // number * number
            return x * y;
        }
        else if (y instanceof Complex) {
            // number * complex
            return multiplyComplex(new Complex(x, 0), y);
        }
        else if (y instanceof Unit) {
            res = y.clone();
            res.value *= x;
            return res;
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex * number
            return multiplyComplex(x, new Complex(y, 0));
        }
        else if (y instanceof Complex) {
            // complex * complex
            return multiplyComplex(x, y);
        }
    }
    else if (x instanceof Unit) {
        if (isNumber(y)) {
            res = x.clone();
            res.value *= y;
            return res;
        }
    }
    else if (x instanceof Array) {
        if (y instanceof Array) {
            // matrix * matrix
            var sizeX = util.array.validatedSize(x);
            var sizeY = util.array.validatedSize(y);

            if (sizeX.length != 2) {
                throw new Error('Can only multiply a 2 dimensional matrix ' +
                        '(A has ' + sizeX.length + ' dimensions)');
            }
            if (sizeY.length != 2) {
                throw new Error('Can only multiply a 2 dimensional matrix ' +
                        '(B has ' + sizeY.length + ' dimensions)');
            }
            if (sizeX[1] != sizeY[0]) {
                throw new Error('Dimensions mismatch in multiplication. ' +
                        'Columns of A must match rows of B ' +
                        '(A is ' + sizeX[0] + 'x' + sizeX[1] +
                        ', B is ' + sizeY[0] + 'x' + sizeY[1] + ', ' +
                        sizeY[1] + ' != ' + sizeY[0] + ')');
            }

            // TODO: performance of matrix multiplication can be improved
            var res = [];
            var rows = sizeX[0];
            var cols = sizeY[1];
            var num = sizeX[1];
            for (var r = 0; r < rows; r++) {
                res[r] = [];
                for (var c = 0; c < cols; c++) {
                    var result = null;
                    for (var n = 0; n < num; n++) {
                        var p = multiply(x[r][n], y[n][c]);
                        result = (result == null) ? p : add(result, p);
                    }
                    res[r][c] = result;
                }
            }

            return res;
        }
        else {
            // matrix * scalar
            return util.map2(x, y, multiply);
        }
    }

    if (y instanceof Array) {
        // scalar * matrix
        return util.map2(x, y, multiply);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return multiply(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('multiply', x, y);
}

/**
 * Multiply two complex numbers. x * y or multiply(x, y)
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex} res
 * @private
 */
function multiplyComplex (x, y) {
    return new Complex(
        x.re * y.re - x.im * y.im,
        x.re * y.im + x.im * y.re
    );
}

math.multiply = multiply;

/**
 * Function documentation
 */
multiply.doc = {
    'name': 'multiply',
    'category': 'Operators',
    'syntax': [
        'x * y',
        'multiply(x, y)'
    ],
    'description': 'multiply two values.',
    'examples': [
        '2.1 * 3.6',
        'ans / 3.6',
        '2 * 3 + 4',
        '2 * (3 + 4)',
        '3 * 2.1 km'
    ],
    'seealso': [
        'divide'
    ]
};

/**
 * Calculates the power of x to y, x^y
 * @param  {Number | Complex} x
 * @param  {Number | Complex} y
 * @return {Number | Complex} res
 */
function pow(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('pow', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            if (isInteger(y) || x >= 0) {
                // real value computation
                return Math.pow(x, y);
            }
            else {
                return powComplex(new Complex(x, 0), new Complex(y, 0));
            }
        }
        else if (y instanceof Complex) {
            return powComplex(new Complex(x, 0), y);
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            return powComplex(x, new Complex(y, 0));
        }
        else if (y instanceof Complex) {
            return powComplex(x, y);
        }
    }
    else if (x instanceof Array) {
        if (!isNumber(y) || !isInteger(y) || y < 0) {
            throw new TypeError('For A^b, b must be a positive integer ' +
                    '(value is ' + y + ')');
        }

        // verify that A is a 2 dimensional square matrix
        var s = util.array.validatedSize(x);
        if (s.length != 2) {
            throw new Error('For A^b, A must be 2 dimensional ' +
                    '(A has ' + s.length + ' dimensions)');
        }
        if (s[0] != s[1]) {
            throw new Error('For A^b, A must be square ' +
                    '(size is ' + s[0] + 'x' + s[1] + ')');
        }

        if (y == 0) {
            // return the identity matrix
            return eye(s[0]);
        }
        else {
            // value > 0
            var res = x;
            for (var i = 1; i < y; i++) {
                res = multiply(x, res);
            }
            return res;
        }
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return pow(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('pow', x, y);
}

/**
 * Caculates the power of x to y, x^y, for two complex numbers.
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex} res
 * @private
 */
function powComplex (x, y) {
    // complex computation
    // x^y = exp(log(x)*y) = exp((abs(x)+i*arg(x))*y)
    var temp1 = log(x);
    var temp2 = multiply(temp1, y);
    return exp(temp2);
}

math.pow = pow;

/**
 * Function documentation
 */
pow.doc = {
    'name': 'pow',
    'category': 'Operators',
    'syntax': [
        'x ^ y',
        'pow(x, y)'
    ],
    'description':
        'Calculates the power of x to y, x^y.',
    'examples': [
        '2^3 = 8',
        '2*2*2',
        '1 + e ^ (pi * i)'
    ],
    'seealso': [
        'unequal', 'smaller', 'larger', 'smallereq', 'largereq'
    ]
};

/**
 * Round a value towards the nearest integer, round(x [, n])
 * @param {Number | Complex | Array} x
 * @param {Number | Array} [n] number of digits
 * @return {Number | Complex | Array} res
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

        if (x instanceof Array) {
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

        if (x instanceof Array || n instanceof Array) {
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

/**
 * Compute the sign of a value.
 * The sign of a value x is 1 when x>1, -1 when x<0, and 0 when x=0.
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function sign(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('sign', arguments.length, 1);
    }

    if (isNumber(x)) {
        var sign;
        if (x > 0) {
            sign = 1;
        }
        else if (x < 0) {
            sign = -1;
        }
        else {
            sign = 0;
        }
        return sign;
    }

    if (x instanceof Complex) {
        var abs = Math.sqrt(x.re * x.re + x.im * x.im);
        return new Complex(x.re / abs, x.im / abs);
    }

    if (x instanceof Array) {
        return util.map(x, sign);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return sign(x.valueOf());
    }

    throw newUnsupportedTypeError('sign', x);
}

math.sign = sign;

/**
 * Function documentation
 */
sign.doc = {
    'name': 'sign',
    'category': 'Arithmetic',
    'syntax': [
        'sign(x)'
    ],
    'description':
        'Compute the sign of a value. ' +
            'The sign of a value x is 1 when x>1, -1 when x<0, and 0 when x=0.',
    'examples': [
        'sign(3.5)',
        'sign(-4.2)',
        'sign(0)'
    ],
    'seealso': [
        'abs'
    ]
};

/**
 * Check if value x is smaller y, x < y
 * In case of complex numbers, the absolute values of a and b are compared.
 * @param  {Number | Complex | Unit | String | Array} x
 * @param  {Number | Complex | Unit | String | Array} y
 * @return {Boolean | Array} res
 */
function smaller(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('smaller', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x < y;
        }
        else if (y instanceof Complex) {
            return x < abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return abs(x) < y;
        }
        else if (y instanceof Complex) {
            return abs(x) < abs(y);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value < y.value;
    }

    if (isString(x) || isString(y)) {
        return x < y;
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, smaller);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return smaller(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('smaller', x, y);
}

math.smaller = smaller;

/**
 * Function documentation
 */
smaller.doc = {
    'name': 'smaller',
    'category': 'Operators',
    'syntax': [
        'x < y',
        'smaller(x, y)'
    ],
    'description':
        'Check if value x is smaller than value y. ' +
            'Returns 1 if x is smaller than y, and 0 if not.',
    'examples': [
        '2 < 3',
        '5 < 2*2',
        'a = 3.3',
        'b = 6-2.8',
        '(a < b)',
        '5 cm < 2 inch'
    ],
    'seealso': [
        'equal', 'unequal', 'larger', 'smallereq', 'largereq'
    ]
};

/**
 * Check if value a is smaller or equal to b, a <= b
 * In case of complex numbers, the absolute values of a and b are compared.
 * @param  {Number | Complex | Unit | String | Array} x
 * @param  {Number | Complex | Unit | String | Array} y
 * @return {Boolean | Array} res
 */
function smallereq(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('smallereq', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x <= y;
        }
        else if (y instanceof Complex) {
            return x <= abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return abs(x) <= y;
        }
        else if (y instanceof Complex) {
            return abs(x) <= abs(y);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value <= y.value;
    }

    if (isString(x) || isString(y)) {
        return x <= y;
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, smallereq);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return smallereq(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('smallereq', x, y);
}

math.smallereq = smallereq;

/**
 * Function documentation
 */
smallereq.doc = {
    'name': 'smallereq',
    'category': 'Operators',
    'syntax': [
        'x <= y',
        'smallereq(x, y)'
    ],
    'description':
        'Check if value x is smaller or equal to value y. ' +
            'Returns 1 if x is smaller than y, and 0 if not.',
    'examples': [
        '2 < 1+1',
        '2 <= 1+1',
        'a = 3.2',
        'b = 6-2.8',
        '(a < b)'
    ],
    'seealso': [
        'equal', 'unequal', 'larger', 'smaller', 'largereq'
    ]
};

/**
 * Calculate the square root of a value
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function sqrt (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('sqrt', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= 0) {
            return Math.sqrt(x);
        }
        else {
            return sqrt(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
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

    if (x instanceof Array) {
        return util.map(x, sqrt);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return sqrt(x.valueOf());
    }

    throw newUnsupportedTypeError('sqrt', x);
}

math.sqrt = sqrt;

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

/**
 * Compute the square of a value, x * x
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function square(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('square', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x * x;
    }

    if (x instanceof Complex) {
        return multiply(x, x);
    }

    if (x instanceof Array) {
        return multiply(x, x);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return square(x.valueOf());
    }

    throw newUnsupportedTypeError('square', x);
}

math.square = square;

/**
 * Function documentation
 */
square.doc = {
    'name': 'square',
    'category': 'Arithmetic',
    'syntax': [
        'square(x)'
    ],
    'description':
        'Compute the square of a value. ' +
            'The square of x is x * x.',
    'examples': [
        'square(3)',
        'sqrt(9)',
        '3^2',
        '3 * 3'
    ],
    'seealso': [
        'multiply',
        'pow',
        'sqrt',
        'cube'
    ]
};

/**
 * Subtract two values. x - y or subtract(x, y)
 * @param  {Number | Complex | Unit | Array} x
 * @param  {Number | Complex | Unit | Array} y
 * @return {Number | Complex | Unit | Array} res
 */
function subtract(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('subtract', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            // number - number
            return x - y;
        }
        else if (y instanceof Complex) {
            // number - complex
            return new Complex (
                x - y.re,
                    y.im
            );
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex - number
            return new Complex (
                x.re - y,
                x.im
            )
        }
        else if (y instanceof Complex) {
            // complex - complex
            return new Complex (
                x.re - y.re,
                x.im - y.im
            )
        }
    }
    else if (x instanceof Unit) {
        if (y instanceof Unit) {
            if (!x.equalBase(y)) {
                throw new Error('Units do not match');
            }

            if (!x.hasValue) {
                throw new Error('Unit on left hand side of operator - has no value');
            }

            if (!y.hasValue) {
                throw new Error('Unit on right hand side of operator - has no value');
            }

            var res = x.clone();
            res.value -= y.value;
            res.fixPrefix = false;

            return res;
        }
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, subtract);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return subtract(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('subtract', x, y);
}

math.subtract = subtract;

/**
 * Function documentation
 */
subtract.doc = {
    'name': 'subtract',
    'category': 'Operators',
    'syntax': [
        'x - y',
        'subtract(x, y)'
    ],
    'description': 'subtract two values.',
    'examples': [
        '5.3 - 2',
        'ans + 2',
        '2/3 - 1/6',
        '2 * 3 - 3',
        '2.1 km - 500m'
    ],
    'seealso': [
        'add'
    ]
};
/**
 * Inverse the sign of a value. -x or unaryminus(x)
 * @param  {Number | Complex | Unit | Array} x
 * @return {Number | Complex | Unit | Array} res
 */
function unaryminus(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('unaryminus', arguments.length, 1);
    }

    if (isNumber(x)) {
        return -x;
    }
    else if (x instanceof Complex) {
        return new Complex(
            -x.re,
            -x.im
        );
    }
    else if (x instanceof Unit) {
        var res = x.clone();
        res.value = -x.value;
        return res;
    }

    if (x instanceof Array) {
        return util.map(x, unaryminus);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return unaryminus(x.valueOf());
    }

    throw newUnsupportedTypeError('unaryminus', x);
}

math.unaryminus = unaryminus;

/**
 * Function documentation
 */
unaryminus.doc = {
    'name': 'unaryminus',
    'category': 'Operators',
    'syntax': [
        '-x',
        'unaryminus(x)'
    ],
    'description':
        'Inverse the sign of a value.',
    'examples': [
        '-4.5',
        '-(-5.6)'
    ],
    'seealso': [
        'add', 'subtract'
    ]
};
/**
 * Check if value x unequals y, x != y
 * In case of complex numbers, x.re must unequal y.re, and x.im must unequal y.im
 * @param  {Number | Complex | Unit | String | Array} x
 * @param  {Number | Complex | Unit | String | Array} y
 * @return {Boolean | Array} res
 */
function unequal(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('unequal', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x == y;
        }
        else if (y instanceof Complex) {
            return (x == y.re) && (y.im == 0);
        }
    }

    if (x instanceof Complex) {
        if (isNumber(y)) {
            return (x.re == y) && (x.im == 0);
        }
        else if (y instanceof Complex) {
            return (x.re == y.re) && (x.im == y.im);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value == y.value;
    }

    if (isString(x) || isString(y)) {
        return x == y;
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(x, y, unequal);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return unequal(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('unequal', x, y);
}

math.unequal = unequal;

/**
 * Function documentation
 */
unequal.doc = {
    'name': 'unequal',
    'category': 'Operators',
    'syntax': [
        'x != y',
        'unequal(x, y)'
    ],
    'description':
        'Check unequality of two values. ' +
            'Returns 1 if the values are unequal, and 0 if they are equal.',
    'examples': [
        '2+2 != 3',
        '2+2 != 4',
        'a = 3.2',
        'b = 6-2.8',
        'a != b',
        '50cm != 0.5m',
        '5 cm != 2 inch'
    ],
    'seealso': [
        'equal', 'smaller', 'larger', 'smallereq', 'largereq'
    ]
};

/**
 * Compute the argument of a complex value.
 * If x = a+bi, the argument is computed as atan2(b, a).
 * @param {Number | Complex | Array} x
 * @return {Number | Array} res
 */
function arg(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('arg', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.atan2(0, x);
    }

    if (x instanceof Complex) {
        return Math.atan2(x.im, x.re);
    }

    if (x instanceof Array) {
        return util.map(x, arg);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return arg(x.valueOf());
    }

    throw newUnsupportedTypeError('arg', x);
}

math.arg = arg;

/**
 * Function documentation
 */
arg.doc = {
    'name': 'arg',
    'category': 'Complex',
    'syntax': [
        'arg(x)'
    ],
    'description':
        'Compute the argument of a complex value. ' +
            'If x = a+bi, the argument is computed as atan2(b, a).',
    'examples': [
        'arg(2 + 2i)',
        'atan2(3, 2)',
        'arg(2 - 3i)'
    ],
    'seealso': [
        're',
        'im',
        'conj',
        'abs'
    ]
};

/**
 * Compute the complex conjugate of a complex value.
 * If x = a+bi, the complex conjugate is a-bi.
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function conj(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('conj', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x;
    }

    if (x instanceof Complex) {
        return new Complex(x.re, -x.im);
    }

    if (x instanceof Array) {
        return util.map(x, conj);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return conj(x.valueOf());
    }

    throw newUnsupportedTypeError('conj', x);
}

math.conj = conj;

/**
 * Function documentation
 */
conj.doc = {
    'name': 'conj',
    'category': 'Complex',
    'syntax': [
        'conj(x)'
    ],
    'description':
        'Compute the complex conjugate of a complex value. ' +
            'If x = a+bi, the complex conjugate is a-bi.',
    'examples': [
        'conj(2 + 3i)',
        'conj(2 - 3i)',
        'conj(-5.2i)'
    ],
    'seealso': [
        're',
        'im',
        'abs',
        'arg'
    ]
};

/**
 * Get the imaginary part of a complex number.
 * @param {Number | Complex | Array} x
 * @return {Number | Array} im
 */
function im(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('im', arguments.length, 1);
    }

    if (isNumber(x)) {
        return 0;
    }

    if (x instanceof Complex) {
        return x.im;
    }

    if (x instanceof Array) {
        return util.map(x, im);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return im(x.valueOf());
    }

    throw newUnsupportedTypeError('im', x);
}

math.im = im;

/**
 * Function documentation
 */
im.doc = {
    'name': 'im',
    'category': 'Complex',
    'syntax': [
        'im(x)'
    ],
    'description': 'Get the imaginary part of a complex number.',
    'examples': [
        'im(2 + 3i)',
        're(2 + 3i)',
        'im(-5.2i)',
        'im(2.4)'
    ],
    'seealso': [
        're',
        'conj',
        'abs',
        'arg'
    ]
};

/**
 * Get the real part of a complex number.
 * @param {Number | Complex | Array} x
 * @return {Number | Array} re
 */
function re(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('re', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x;
    }

    if (x instanceof Complex) {
        return x.re;
    }

    if (x instanceof Array) {
        return util.map(x, re);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return re(x.valueOf());
    }

    throw newUnsupportedTypeError('re', x);
}

math.re = re;

/**
 * Function documentation
 */
re.doc = {
    'name': 're',
    'category': 'Complex',
    'syntax': [
        're(x)'
    ],
    'description': 'Get the real part of a complex number.',
    'examples': [
        're(2 + 3i)',
        'im(2 + 3i)',
        're(-5.2i)',
        're(2.4)'
    ],
    'seealso': [
        'im',
        'conj',
        'abs',
        'arg'
    ]
};

/**
 * Create an identity matrix with size m x n, eye(m [, n])
 * @param {Number} m
 * @param {Number} [n]
 * @return {Number | Array} res
 */
function eye (m, n) {
    var rows, cols;
    var num = arguments.length;
    if (num < 0 || num > 2) {
        throw newArgumentsError('eye', num, 0, 2);
    }

    if (num == 0) {
        return 1;
    }

    if (num == 1) {
        // TODO: support an array as first argument
        // TODO: support a matrix as first argument

        rows = m;
        cols = m;
    }
    else if (num == 2) {
        rows = m;
        cols = n;
    }

    if (!isNumber(rows) || !isInteger(rows) || rows < 1) {
        throw new Error('Parameters in function eye must be positive integers');
    }
    if (cols) {
        if (!isNumber(cols) || !isInteger(cols) || cols < 1) {
            throw new Error('Parameters in function eye must be positive integers');
        }
    }

    // TODO: use zeros(m, n) instead, then fill the diagonal with ones
    var res = [];
    for (var r = 0; r < rows; r++) {
        var row = [];
        for (var c = 0; c < cols; c++) {
            row[c] = 0;
        }
        res[r] = row;
    }

    // fill in ones on the diagonal
    var min = Math.min(rows, cols);
    for (var d = 0; d < min; d++) {
        res[d][d] = 1;
    }

    return res;
}

math.eye = eye;

/**
 * Function documentation
 */
eye.doc = {
    'name': 'eye',
    'category': 'Matrix',
    'syntax': [
        'eye(n)',
        'eye(m, n)',
        'eye([m, n])',
        'eye'
    ],
    'description': 'Returns the identity matrix with size m-by-n. ' +
        'The matrix has ones on the diagonal and zeros elsewhere.',
    'examples': [
        'eye(3)',
        'eye(3, 5)',
        'a = [1, 2, 3; 4, 5, 6]',
        'eye(size(a))'
    ],
    'seealso': [
        'diag', 'ones', 'range', 'size', 'transpose', 'zeros'
    ]
};
/**
 * Calculate the size of a vector, matrix, or scalar. size(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function size (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('size', arguments.length, 1);
    }

    if (isNumber(x) || x instanceof Complex || x instanceof Unit || x == null) {
        return [];
    }

    if (isString(x)) {
        return [x.length];
    }

    if (x instanceof Array) {
        return util.array.validatedSize(x);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return size(x.valueOf());
    }

    throw newUnsupportedTypeError('size', x);
}

math.size = size;

/**
 * Function documentation
 */
size.doc = {
    'name': 'size',
    'category': 'Matrix',
    'syntax': [
        'size(x)'
    ],
    'description': 'Calculate the size of a matrix.',
    'examples': [
        'size(2.3)',
        'size("hello world")',
        'a = [1, 2; 3, 4; 5, 6]',
        'size(a)',
        'size(1:6)'
    ],
    'seealso': [
        'diag', 'eye', 'ones', 'range', 'transpose', 'zeros'
    ]
};
/**
 * Compute the factorial of a value, factorial(x) or x!
 * @Param {Number | Array} x
 * @return {Number | Array} res
 */
function factorial (x) {
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

    if (x instanceof Array) {
        return util.map(x, factorial);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return factorial(x.valueOf());
    }

    throw newUnsupportedTypeError('factorial', x);
}

math.factorial = factorial;

/**
 * Function documentation
 */
factorial.doc = {
    'name': 'factorial',
    'category': 'Probability',
    'syntax': [
        'x!',
        'factorial(x)'
    ],
    'description': 'Compute the factorial of a value',
    'examples': [
        '5!',
        '5*4*3*2*1',
        '3!'
    ],
    'seealso': []
};
/**
 * Return a random number between 0 and 1
 * @return {Number} res
 */
function random () {
    if (arguments.length != 0) {
        throw newArgumentsError('random', arguments.length, 0);
    }

    // TODO: implement parameter min and max
    return Math.random();
}

math.random = random;

/**
 * Function documentation
 */
random.doc = {
    'name': 'random',
    'category': 'Probability',
    'syntax': [
        'random()'
    ],
    'description':
        'Return a random number between 0 and 1.',
    'examples': [
        'random()',
        '100 * random()'
    ],
    'seealso': []
};

/**
 * Compute the maximum value of a list of values, max(a, b, c, ...)
 * @param {... *} args  one or multiple arguments
 * @return {*} res
 */
function max(args) {
    if (arguments.length == 0) {
        throw new Error('Function sum requires one or more parameters (0 provided)');
    }

    if (arguments.length == 1 && (args.valueOf() instanceof Array)) {
        return max.apply(this, args.valueOf());
    }

    var res = arguments[0];
    for (var i = 1, iMax = arguments.length; i < iMax; i++) {
        var value = arguments[i];
        if (larger(value, res)) {
            res = value;
        }
    }

    return res;
}

math.max = max;

/**
 * Function documentation
 */
max.doc = {
    'name': 'max',
    'category': 'Statistics',
    'syntax': [
        'max(a, b, c, ...)'
    ],
    'description': 'Compute the maximum value of a list of values.',
    'examples': [
        'max(2, 3, 4, 1)',
        'max(2.7, 7.1, -4.5, 2.0, 4.1)',
        'min(2.7, 7.1, -4.5, 2.0, 4.1)'
    ],
    'seealso': [
        'sum',
        'prod',
        'avg',
        'var',
        'std',
        'min',
        'median'
    ]
};

/**
 * Compute the minimum value of a list of values, min(a, b, c, ...)
 * @param {... *} args  one or multiple arguments
 * @return {*} res
 */
function min(args) {
    if (arguments.length == 0) {
        throw new Error('Function sum requires one or more parameters (0 provided)');
    }

    if (arguments.length == 1 && (args.valueOf() instanceof Array)) {
        return min.apply(this, args.valueOf());
    }

    var res = arguments[0];
    for (var i = 1, iMax = arguments.length; i < iMax; i++) {
        var value = arguments[i];
        if (smaller(value, res)) {
            res = value;
        }
    }

    return res;
}

math.min = min;

/**
 * Function documentation
 */
min.doc = {
    'name': 'min',
    'category': 'Statistics',
    'syntax': [
        'min(a, b, c, ...)'
    ],
    'description': 'Compute the minimum value of a list of values.',
    'examples': [
        'max(2, 3, 4, 1)',
        'max(2.7, 7.1, -4.5, 2.0, 4.1)',
        'min(2.7, 7.1, -4.5, 2.0, 4.1)'
    ],
    'seealso': [
        'sum',
        'prod',
        'avg',
        'var',
        'std',
        'min',
        'median'
    ]
};

/**
 * Calculate the inverse cosine of a value, acos(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function acos(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('acos', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= -1 && x <= 1) {
            return Math.acos(x);
        }
        else {
            return acos(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        // acos(z) = 0.5*pi + i*log(iz + sqrt(1-z^2))
        var temp1 = new Complex(
            x.im * x.im - x.re * x.re + 1.0,
            -2.0 * x.re * x.im
        );
        var temp2 = sqrt(temp1);
        var temp3 = new Complex(
            temp2.re - x.im,
            temp2.im + x.re
        );
        var temp4 = log(temp3);

        // 0.5*pi = 1.5707963267948966192313216916398
        return new Complex(
            1.57079632679489661923 - temp4.im,
            temp4.re
        );
    }

    if (x instanceof Array) {
        return util.map(x, acos);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return acos(x.valueOf());
    }

    throw newUnsupportedTypeError('acos', x);
}

math.acos = acos;

/**
 * Function documentation
 */
acos.doc = {
    'name': 'acos',
    'category': 'Trigonometry',
    'syntax': [
        'acos(x)'
    ],
    'description': 'Compute the inverse cosine of a value in radians.',
    'examples': [
        'acos(0.5)',
        'acos(cos(2.3))'
    ],
    'seealso': [
        'cos',
        'acos',
        'asin'
    ]
};

/**
 * Calculate the inverse sine of a value, asin(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function asin(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('asin', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= -1 && x <= 1) {
            return Math.asin(x);
        }
        else {
            return asin(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        // asin(z) = -i*log(iz + sqrt(1-z^2))
        var re = x.re;
        var im = x.im;
        var temp1 = new Complex(
            im * im - re * re + 1.0,
            -2.0 * re * im
        );

        var temp2 = sqrt(temp1);
        var temp3 = new Complex(
            temp2.re - im,
            temp2.im + re
        );

        var temp4 = log(temp3);

        return new Complex(temp4.im, -temp4.re);
    }

    if (x instanceof Array) {
        return util.map(x, asin);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return asin(x.valueOf());
    }

    throw newUnsupportedTypeError('asin', x);
}

math.asin = asin;

/**
 * Function documentation
 */
asin.doc = {
    'name': 'asin',
    'category': 'Trigonometry',
    'syntax': [
        'asin(x)'
    ],
    'description': 'Compute the inverse sine of a value in radians.',
    'examples': [
        'asin(0.5)',
        'asin(sin(2.3))'
    ],
    'seealso': [
        'sin',
        'acos',
        'asin'
    ]
};

/**
 * Calculate the inverse tangent of a value, atan(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function atan(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('atan', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.atan(x);
    }

    if (x instanceof Complex) {
        // atan(z) = 1/2 * i * (ln(1-iz) - ln(1+iz))
        var re = x.re;
        var im = x.im;
        var den = re * re + (1.0 - im) * (1.0 - im);

        var temp1 = new Complex(
            (1.0 - im * im - re * re) / den,
            (-2.0 * re) / den
        );
        var temp2 = log(temp1);

        return new Complex(
            -0.5 * temp2.im,
            0.5 * temp2.re
        );
    }

    if (x instanceof Array) {
        return util.map(x, atan);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return atan(x.valueOf());
    }

    throw newUnsupportedTypeError('atan', x);
}

math.atan = atan;

/**
 * Function documentation
 */
atan.doc = {
    'name': 'atan',
    'category': 'Trigonometry',
    'syntax': [
        'atan(x)'
    ],
    'description': 'Compute the inverse tangent of a value in radians.',
    'examples': [
        'atan(0.5)',
        'atan(tan(2.3))'
    ],
    'seealso': [
        'tan',
        'acos',
        'asin'
    ]
};

/**
 * Computes the principal value of the arc tangent of y/x in radians, atan2(y,x)
 * @param {Number | Complex | Array} y
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function atan2(y, x) {
    if (arguments.length != 2) {
        throw newArgumentsError('atan2', arguments.length, 2);
    }

    if (isNumber(y)) {
        if (isNumber(x)) {
            return Math.atan2(y, x);
        }
        else if (x instanceof Complex) {
            return Math.atan2(y, x.re);
        }
    }
    else if (y instanceof Complex) {
        if (isNumber(x)) {
            return Math.atan2(y.re, x);
        }
        else if (x instanceof Complex) {
            return Math.atan2(y.re, x.re);
        }
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(y, x, atan2);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return atan2(y.valueOf(), x.valueOf());
    }

    throw newUnsupportedTypeError('atan2', y, x);
}

math.atan2 = atan2;

/**
 * Function documentation
 */
atan2.doc = {
    'name': 'atan2',
    'category': 'Trigonometry',
    'syntax': [
        'atan2(y, x)'
    ],
    'description':
        'Computes the principal value of the arc tangent of y/x in radians.',
    'examples': [
        'atan2(2, 2) / pi',
        'angle = 60 deg in rad',
        'x = cos(angle)',
        'y = sin(angle)',
        'atan2(y, x)'
    ],
    'seealso': [
        'sin',
        'cos',
        'tan'
    ]
};

/**
 * Calculate the cosine of a value, cos(x)
 * @param {Number | Complex | Unit | Array} x
 * @return {Number | Complex | Array} res
 */
function cos(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('cos', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.cos(x);
    }

    if (x instanceof Complex) {
        // cos(z) = (exp(iz) + exp(-iz)) / 2
        return new Complex(
            0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp(x.im)),
            0.5 * Math.sin(x.re) * (Math.exp(-x.im) - Math.exp(x.im))
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function cos is no angle');
        }
        return Math.cos(x.value);
    }

    if (x instanceof Array) {
        return util.map(x, cos);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return cos(x.valueOf());
    }

    throw newUnsupportedTypeError('cos', x);
}

math.cos = cos;

/**
 * Function documentation
 */
cos.doc = {
    'name': 'cos',
    'category': 'Trigonometry',
    'syntax': [
        'cos(x)'
    ],
    'description': 'Compute the cosine of x in radians.',
    'examples': [
        'cos(2)',
        'cos(pi / 4) ^ 2',
        'cos(180 deg)',
        'cos(60 deg)',
        'sin(0.2)^2 + cos(0.2)^2'
    ],
    'seealso': [
        'acos',
        'sin',
        'tan'
    ]
};

/**
 * Calculate the cotangent of a value, cot(x) = 1/tan(x)
 * @param {Number | Complex | Unit | Array} x
 * @return {Number | Complex | Array} res
 */
function cot(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('cot', arguments.length, 1);
    }

    if (isNumber(x)) {
        return 1 / Math.tan(x);
    }

    if (x instanceof Complex) {
        var den = Math.exp(-4.0 * x.im) -
            2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) + 1.0;

        return new Complex(
            2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
            (Math.exp(-4.0 * x.im) - 1.0) / den
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function cot is no angle');
        }
        return 1 / Math.tan(x.value);
    }

    if (x instanceof Array) {
        return util.map(x, cot);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return cot(x.valueOf());
    }

    throw newUnsupportedTypeError('cot', x);
}

math.cot = cot;

/**
 * Function documentation
 */
cot.doc = {
    'name': 'cot',
    'category': 'Trigonometry',
    'syntax': [
        'cot(x)'
    ],
    'description': 'Compute the cotangent of x in radians. ' +
        'Defined as 1/tan(x)',
    'examples': [
        'cot(2)',
        '1 / tan(2)'
    ],
    'seealso': [
        'sec',
        'csc',
        'tan'
    ]
};

/**
 * Calculate the cosecant of a value, csc(x) = 1/sin(x)
 * @param {Number | Complex | Unit | Array} x
 * @return {Number | Complex | Array} res
 */
function csc(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('csc', arguments.length, 1);
    }

    if (isNumber(x)) {
        return 1 / Math.sin(x);
    }

    if (x instanceof Complex) {
        // csc(z) = 1/sin(z) = (2i) / (exp(iz) - exp(-iz))
        var den = 0.25 * (Math.exp(-2.0 * x.im) + Math.exp(2.0 * x.im)) -
            0.5 * Math.cos(2.0 * x.re);

        return new Complex (
            0.5 * Math.sin(x.re) * (Math.exp(-x.im) + Math.exp(x.im)) / den,
            0.5 * Math.cos(x.re) * (Math.exp(-x.im) - Math.exp(x.im)) / den
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function csc is no angle');
        }
        return 1 / Math.sin(x.value);
    }

    if (x instanceof Array) {
        return util.map(x, csc);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return csc(x.valueOf());
    }

    throw newUnsupportedTypeError('csc', x);
}

math.csc = csc;

/**
 * Function documentation
 */
csc.doc = {
    'name': 'csc',
    'category': 'Trigonometry',
    'syntax': [
        'csc(x)'
    ],
    'description': 'Compute the cosecant of x in radians. ' +
        'Defined as 1/sin(x)',
    'examples': [
        'csc(2)',
        '1 / sin(2)'
    ],
    'seealso': [
        'sec',
        'cot',
        'sin'
    ]
};

/**
 * Calculate the secant of a value, sec(x) = 1/cos(x)
 * @param {Number | Complex | Unit | Array} x
 * @return {Number | Complex | Array} res
 */
function sec(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('sec', arguments.length, 1);
    }

    if (isNumber(x)) {
        return 1 / Math.cos(x);
    }

    if (x instanceof Complex) {
        // sec(z) = 1/cos(z) = 2 / (exp(iz) + exp(-iz))
        var den = 0.25 * (Math.exp(-2.0 * x.im) + Math.exp(2.0 * x.im)) +
            0.5 * Math.cos(2.0 * x.re);
        return new Complex(
            0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp( x.im)) / den,
            0.5 * Math.sin(x.re) * (Math.exp( x.im) - Math.exp(-x.im)) / den
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function sec is no angle');
        }
        return 1 / Math.cos(x.value);
    }

    if (x instanceof Array) {
        return util.map(x, sec);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return sec(x.valueOf());
    }

    throw newUnsupportedTypeError('sec', x);
}

math.sec = sec;

/**
 * Function documentation
 */
sec.doc = {
    'name': 'sec',
    'category': 'Trigonometry',
    'syntax': [
        'sec(x)'
    ],
    'description': 'Compute the secant of x in radians. ' +
        'Defined as 1/cos(x)',
    'examples': [
        'sec(2)',
        '1 / cos(2)'
    ],
    'seealso': [
        'cot',
        'csc',
        'cos'
    ]
};

/**
 * Calculate the sine of a value, sin(x)
 * @param {Number | Complex | Unit | Array} x
 * @return {Number | Complex | Array} res
 */
function sin(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('sin', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.sin(x);
    }

    if (x instanceof Complex) {
        return new Complex(
            0.5 * Math.sin(x.re) * (Math.exp(-x.im) + Math.exp( x.im)),
            0.5 * Math.cos(x.re) * (Math.exp( x.im) - Math.exp(-x.im))
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function cos is no angle');
        }
        return Math.sin(x.value);
    }

    if (x instanceof Array) {
        return util.map(x, sin);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return sin(x.valueOf());
    }

    throw newUnsupportedTypeError('sin', x);
}

math.sin = sin;

/**
 * Function documentation
 */
sin.doc = {
    'name': 'sin',
    'category': 'Trigonometry',
    'syntax': [
        'sin(x)'
    ],
    'description': 'Compute the sine of x in radians.',
    'examples': [
        'sin(2)',
        'sin(pi / 4) ^ 2',
        'sin(90 deg)',
        'sin(30 deg)',
        'sin(0.2)^2 + cos(0.2)^2'
    ],
    'seealso': [
        'asin',
        'cos',
        'tan'
    ]
};

/**
 * Calculate the tangent of a value, tan(x)
 * @param {Number | Complex | Unit | Array} x
 * @return {Number | Complex | Array} res
 */
function tan(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('tan', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.tan(x);
    }

    if (x instanceof Complex) {
        var den = Math.exp(-4.0 * x.im) +
            2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) +
            1.0;

        return new Complex(
             2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
            (1.0 - Math.exp(-4.0 * x.im)) / den
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function tan is no angle');
        }
        return Math.tan(x.value);
    }

    if (x instanceof Array) {
        return util.map(x, tan);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return tan(x.valueOf());
    }

    throw newUnsupportedTypeError('tan', x);
}

math.tan = tan;

/**
 * Function documentation
 */
tan.doc = {
    'name': 'tan',
    'category': 'Trigonometry',
    'syntax': [
        'tan(x)'
    ],
    'description': 'Compute the tangent of x in radians.',
    'examples': [
        'tan(0.5)',
        'sin(0.5) / cos(0.5)',
        'tan(pi / 4)',
        'tan(45 deg)'
    ],
    'seealso': [
        'atan',
        'sin',
        'cos'
    ]
};

/**
 * Change the unit of a value. x in unit or in(x, unit)
 * @param {Unit | Array} x
 * @param {Unit | Array} unit
 * @return {Unit | Array} res
 */
function unit_in(x, unit) {
    if (arguments.length != 2) {
        throw newArgumentsError('in', arguments.length, 2);
    }

    if (x instanceof Unit && unit instanceof Unit) {
        if (!x.equalBase(unit)) {
            throw new Error('Units do not match');
        }
        if (unit.hasValue) {
            throw new Error('Cannot convert to a unit with a value');
        }
        if (!unit.hasUnit) {
            throw new Error('Unit expected on the right hand side of function in');
        }

        var res = unit.clone();
        res.value = x.value;
        res.fixPrefix = true;

        return res;
    }

    if (x instanceof Array || unit instanceof Array) {
        return util.map2(x, unit, unit_in);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.in(x.valueOf());
    }

    throw newUnsupportedTypeError('in', x);
}

math.in = unit_in;

/**
 * Function documentation
 */
unit_in.doc ={
    'name': 'in',
    'category': 'Units',
    'syntax': [
        'x in unit',
        'in(x, unit)'
    ],
    'description': 'Change the unit of a value.',
    'examples': [
        '5 inch in cm',
        '3.2kg in g',
        '16 bytes in bits'
    ],
    'seealso': []
};

/**
 * Clone an object
 * @param {*} x
 * @return {*} clone
 */
function clone(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('clone', arguments.length, 1);
    }

    if (typeof(x.clone) === 'function') {
        return x.clone();
    }

    if (isNumber(x) || isString(x) || x === null) {
        return x;
    }

    if (x instanceof Array) {
        return x.map(function (value) {
            return clone(value);
        });
    }

    if (x instanceof Object) {
        return util.object.map(x, clone);
    }

    throw newUnsupportedTypeError('clone', x);
}

math.clone = clone;



/**
 * Function documentation
 */
clone.doc = {
    'name': 'clone',
    'category': 'Utils',
    'syntax': [
        'clone(x)'
    ],
    'description': 'Clone a variable. Creates a copy of primitive variables,' +
        'and a deep copy of matrices',
    'examples': [
        'clone(3.5)',
        'clone(2 - 4i)',
        'clone(45 deg)',
        'clone([1, 2; 3, 4])',
        'clone("hello world")'
    ],
    'seealso': []
};

/**
 * Format a value of any type into a string. Interpolate values into the string.
 * Usage:
 *     math.format(array);
 *     math.format('Hello $name! The date is $date', {name: 'user', date: new Date()});
 *
 * @param {String} template
 * @param {Object} values
 * @return {String} str
 */
function format(template, values) {
    var num = arguments.length;
    if (num != 1 && num != 2) {
        throw newArgumentsError('format', num, 1, 2);
    }

    if (num == 1) {
        // just format a value as string
        var value = arguments[0];
        if (isNumber(value)) {
            return util.format(value);
        }

        if (value instanceof Array) {
            return formatArray(value);
        }

        if (isString(value)) {
            return '"' + value + '"';
        }

        if (value instanceof Object) {
            return value.toString();
        }

        return String(value);
    }
    else {
        if (!isString(template)) {
            throw new TypeError('String expected as first parameter in function format');
        }
        if (!(values instanceof Object)) {
            throw new TypeError('Object expected as first parameter in function format');
        }

        // format values into a string
        return template.replace(/\$([\w\.]+)/g, function (original, key) {
                var keys = key.split('.');
                var value = values[keys.shift()];
                while (keys.length && value != undefined) {
                    var k = keys.shift();
                    value = k ? value[k] : value + '.';
                }
                return value != undefined ? value : original;
            }
        );
    }
}

math.format = format;

/**
 * Format a n-dimensional array
 * @param {Array} array
 * @returns {string} str
 */
function formatArray (array) {
    var str = '[';
    var s = util.array.validatedSize(array);

    if (s.length != 2) {
        return formatArrayN(array);
    }

    var rows = s[0];
    var cols = s[1];
    for (var r = 0; r < rows; r++) {
        if (r != 0) {
            str += '; ';
        }

        var row = array[r];
        for (var c = 0; c < cols; c++) {
            if (c != 0) {
                str += ', ';
            }
            var cell = row[c];
            if (cell != undefined) {
                str += format(cell);
            }
        }
    }
    str += ']';

    return str;
}

/**
 * Recursively format an n-dimensional matrix
 * @param {Array} array
 * @returns {String} str
 */
function formatArrayN (array) {
    if (array instanceof Array) {
        var str = '[';
        var len = array.length;
        for (var i = 0; i < len; i++) {
            if (i != 0) {
                str += ', ';
            }
            str += formatArrayN(array[i]);
        }
        str += ']';
        return str;
    }
    else {
        return format(array);
    }
}

/**
 * Function documentation
 */
format.doc = {
    'name': 'format',
    'category': 'Utils',
    'syntax': [
        'format(value)'
    ],
    'description': 'Format a value of any type as string.',
    'examples': [
        'format(2.3)',
        'format(3 - 4i)',
        'format([])'
    ],
    'seealso': []
};

/**
 * Display documentation on a function or data type
 * @param {function | string | Object} subject
 * @return {String} documentation
 */
function help(subject) {
    if (arguments.length != 1) {
        throw newArgumentsError('help', arguments.length, 1);
    }

    if (subject != undefined) {
        if (subject.doc) {
            return generateDoc(subject.doc);
        }
        else if (subject.constructor.doc) {
            return generateDoc(subject.constructor.doc);
        }
        else if (isString(subject)) {
            // search the subject in the methods
            var obj = math[subject];
            if (obj && obj.doc) {
                return generateDoc(obj.doc);
            }
        }
    }

    // TODO: generate documentation for constants, number and string

    if (subject instanceof Object && subject.name) {
        return 'No documentation found on subject "' + subject.name +'"';
    }
    else if (subject instanceof Object && subject.constructor.name) {
        return 'No documentation found on subject "' + subject.constructor.name +'"';
    }
    else {
        return 'No documentation found on subject "' + subject +'"';
    }
}

math.help = help;

/**
 * Generate readable documentation from a documentation object
 * @param {Object} doc
 * @return {String} readableDoc
 * @private
 */
function generateDoc (doc) {
    var desc = '';

    if (doc.name) {
        desc += 'NAME\n' + doc.name + '\n\n';
    }
    if (doc.category) {
        desc += 'CATEGORY\n' + doc.category + '\n\n';
    }
    if (doc.syntax) {
        desc += 'SYNTAX\n' + doc.syntax.join('\n') + '\n\n';
    }
    if (doc.examples) {
        var parser = new math.parser.Parser();
        desc += 'EXAMPLES\n';
        for (var i = 0; i < doc.examples.length; i++) {
            var expr = doc.examples[i];
            var res;
            try {
                res = parser.eval(expr);
            }
            catch (e) {
                res = e;
            }
            desc += expr + '\n';
            desc += '    ' + math.format(res) + '\n';
        }
        desc += '\n';
    }
    if (doc.seealso) {
        desc += 'SEE ALSO\n' + doc.seealso.join(', ') + '\n';
    }

    return desc;
}

/**
 * Function documentation
 */
help.doc = {
    'name': 'help',
    'category': 'Utils',
    'syntax': [
        'help(object)'
    ],
    'description': 'Display documentation on a function or data type.',
    'examples': [
        'help("sqrt")',
        'help("Complex")'
    ],
    'seealso': []
};

/**
 * Import functions from an object or a file
 * @param {function | String | Object} object
 * @param {boolean} [override]         If true, existing functions will be
 *                                     overwritten. False by default.
 */
// TODO: return status information
function _import(object, override) {
    var name;

    if (isString(object)) {
        // a string with a filename
        if (typeof (require) !== 'undefined') {
            // load the file using require
            var module = require(object);
            _import(module);
        }
        else {
            throw new Error('Cannot load file: require not available.');
        }
    }
    else if (isSupportedType(object)) {
        // a single function
        name = object.name;
        if (name) {
            if (override || math[name] === undefined) {
                math[name] = object;
            }
        }
        else {
            throw new Error('Cannot import an unnamed function');
        }
    }
    else if (object instanceof Object) {
        // a map with functions
        for (name in object) {
            if (object.hasOwnProperty(name)) {
                var value = object[name];
                if (isSupportedType(value)) {
                    if (override || math[name] === undefined) {
                        math[name] = value;
                    }
                }
                else {
                    _import(value);
                }
            }
        }
    }
}

math['import'] = _import;

/**
 * Check whether given object is a supported type
 * @param object
 * @return {Boolean}
 * @private
 */
function isSupportedType(object) {
    return (typeof object == 'function') ||
        isNumber(object) || isString(object) ||
        (object instanceof Complex) || (object instanceof Unit);
    // TODO: add boolean?
}

/**
 * Function documentation
 */
_import.doc = {
    'name': 'import',
    'category': 'Utils',
    'syntax': [
        'import(string)'
    ],
    'description': 'Import functions from a file.',
    'examples': [
        'import("numbers")',
        'import("./mylib.js")'
    ],
    'seealso': []
};

/**
 * Calculate the square root of a value
 * @param {*} x
 * @return {String} type  Lower case type, for example "number", "string",
 *                        "array".
 */
function _typeof(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('typeof', arguments.length, 1);
    }

    var type = typeof x;

    if (type == 'object') {
        if (x == null) {
            return 'null';
        }
        if (x.constructor) {
            for (var name in math) {
                if (math.hasOwnProperty(name)) {
                    if (x.constructor == math[name]) {
                        return name.toLowerCase();
                    }
                }
            }
            if (x.constructor.name) {
                return x.constructor.name.toLowerCase();
            }
        }
    }

    return type;
}

math['typeof'] = _typeof;

/**
 * Function documentation
 */
_typeof.doc = {
    'name': 'typeof',
    'category': 'Utils',
    'syntax': [
        'typeof(x)'
    ],
    'description': 'Get the type of a variable.',
    'examples': [
        'typeof(3.5)',
        'typeof(2 - 4i)',
        'typeof(45 deg)',
        'typeof("hello world")'
    ],
    'seealso': []
};

/**
 * Node
 */
function Node() {}

math.parser.node.Node = Node;

/**
 * Evaluate the node
 * @return {*} result
 */
Node.prototype.eval = function () {
    throw new Error('Cannot evaluate a Node interface');
};

/**
 * Get string representation
 * @return {String}
 */
Node.prototype.toString = function() {
    return '';
};

/**
 * @constructor math.parser.node.Symbol
 * A symbol can hold and evaluate a variable or function with parameters.
 * @param {String} [name]
 * @param {function} fn
 * @param {Node[]} params
 * @extends {Node}
 */
function Symbol(name, fn, params) {
    this.name = name;
    this.fn = fn;
    this.params = params;
}

Symbol.prototype = new Node();

math.parser.node.Symbol = Symbol;

/**
 * Check whether the Symbol has one or multiple parameters set.
 * @return {Boolean}
 */
Symbol.prototype.hasParams = function () {
    return (this.params != undefined && this.params.length > 0);
};

/**
 * Evaluate the symbol
 * @return {*} result
 * @override
 */
Symbol.prototype.eval = function() {
    var fn = this.fn;
    if (fn === undefined) {
        throw new Error('Undefined symbol ' + this.name);
    }

    // evaluate the parameters
    var results = this.params.map(function (param) {
        return param.eval();
    });

    // evaluate the function
    return fn.apply(this, results);
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
Symbol.prototype.toString = function() {
    // variable. format the symbol like "myvar"
    if (this.name && !this.params) {
        return this.name;
    }

    /* TODO: determine if the function is an operator
    // operator. format the operation like "(2 + 3)"
    if (this.fn && (this.fn instanceof mathnotepad.fn.Operator)) {
        if (this.params && this.params.length == 2) {
            return '(' +
                this.params[0].toString() + ' ' +
                this.name + ' ' +
                this.params[1].toString() + ')';
        }
    }
    */

    // function. format the operation like "f(2, 4.2)"
    var str = this.name;
    if (this.params && this.params.length) {
        str += '(' + this.params.join(', ') + ')';
    }
    return str;
};

/**
 * @constructor math.parser.node.Constant
 * @param {*} value
 * @extends {Node}
 */
function Constant(value) {
    this.value = value;
}

Constant.prototype = new Node();

math.parser.node.Constant = Constant;

/**
 * Evaluate the constant
 * @return {*} value
 */
Constant.prototype.eval = function () {
    return this.value;
};

/**
 * Get string representation
 * @return {String} str
 */
Constant.prototype.toString = function() {
    return this.value ? math.format(this.value) : '';
};

/**
 * @constructor math.parser.node.ArrayNode
 * Holds an n-dimensional array with nodes
 * @param {Array} nodes
 * @extends {Node}
 */
function ArrayNode(nodes) {
    this.nodes = nodes || [];
}

ArrayNode.prototype = new Node();

math.parser.node.ArrayNode = ArrayNode;

(function () {
    /**
     * Evaluate the array
     * @return {*[]} results
     * @override
     */
    ArrayNode.prototype.eval = function() {
        // recursively evaluate the nodes in the array
        return evalArray(this.nodes);
    };

    /**
     * Recursively evaluate an array with nodes
     * @param {Array} array
     * @returns {Array} results
     */
    function evalArray(array) {
        return array.map(function (child) {
            if (child instanceof Array) {
                // evaluate a nested array
                return evalArray(child);
            }
            else {
                // evaluate a node (end point)
                return child.eval();
            }
        })
    }

    /**
     * Get string representation
     * @return {String} str
     * @override
     */
    ArrayNode.prototype.toString = function() {
        return formatArray(this.nodes);
    };

    /**
     * Recursively evaluate an array with nodes
     * @param {Array} array
     * @returns {String} str
     */
    function formatArray(array) {
        if (array instanceof Array) {
            var str = '[';
            var len = array.length;
            for (var i = 0; i < len; i++) {
                if (i != 0) {
                    str += ', ';
                }
                str += formatArray(array[i]);
            }
            str += ']';
            return str;
        }
        else {
            return array.toString();
        }
    }

})();
/**
 * @constructor math.parser.node.Block
 * Holds a set with nodes
 * @extends {Node}
 */
function Block() {
    this.params = [];
    this.visible = [];
}

Block.prototype = new Node();

math.parser.node.Block = Block;

/**
 * Add a parameter
 * @param {Node} param
 * @param {Boolean} [visible]   true by default
 */
Block.prototype.add = function (param, visible) {
    var index = this.params.length;
    this.params[index] = param;
    this.visible[index] = (visible != undefined) ? visible : true;
};

/**
 * Evaluate the set
 * @return {*[]} results
 * @override
 */
Block.prototype.eval = function() {
    // evaluate the parameters
    var results = [];
    for (var i = 0, iMax = this.params.length; i < iMax; i++) {
        var result = this.params[i].eval();
        if (this.visible[i]) {
            results.push(result);
        }
    }

    return results;
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
Block.prototype.toString = function() {
    var strings = [];

    for (var i = 0, iMax = this.params.length; i < iMax; i++) {
        if (this.visible[i]) {
            strings.push('\n  ' + this.params[i].toString());
        }
    }

    return '[' + strings.join(',') + '\n]';
};

/**
 * @constructor mathnotepad.tree.Assignment
 * @param {String} name                 Symbol name
 * @param {Node[] | undefined} params   Zero or more parameters
 * @param {Node} expr                   The expression defining the symbol
 * @param {function} result             placeholder for the result
 */
function Assignment(name, params, expr, result) {
    this.name = name;
    this.params = params;
    this.expr = expr;
    this.result = result;
}

Assignment.prototype = new Node();

math.parser.node.Assignment = Assignment;

/**
 * Evaluate the assignment
 * @return {*} result
 */
Assignment.prototype.eval = function() {
    if (this.expr === undefined) {
        throw new Error('Undefined symbol ' + this.name);
    }

    var result;
    var params = this.params;

    if (params && params.length) {
        // change part of a matrix, for example "a=[]", "a(2,3)=4.5"
        var paramResults = [];
        this.params.forEach(function (param) {
            paramResults.push(param.eval());
        });

        var exprResult = this.expr.eval();

        // test if definition is currently undefined
        if (this.result.value == undefined) {
            throw new Error('Undefined symbol ' + this.name);
        }

        var prevResult = this.result.eval();
        result = prevResult.set(paramResults, exprResult); // TODO implement set subset

        this.result.value = result;
    }
    else {
        // variable definition, for example "a = 3/4"
        result = this.expr.eval();
        this.result.value = result;
    }

    return result;
};

/**
 * Get string representation
 * @return {String}
 */
Assignment.prototype.toString = function() {
    var str = '';

    str += this.name;
    if (this.params && this.params.length) {
        str += '(' + this.params.join(', ') + ')';
    }
    str += ' = ';
    str += this.expr.toString();

    return str;
};

/**
 * @constructor FunctionAssignment
 * assigns a custom defined function
 *
 * @param {String} name             Function name
 * @param {String[]} variableNames  Variable names
 * @param {function[]} variables    Links to the variables in a scope
 * @param {Node} expr               The function expression
 * @param {function} result         Link to store the result
 */
function FunctionAssignment(name, variableNames, variables, expr, result) {
    this.name = name;
    this.variables = variables;

    this.values = [];
    for (var i = 0, iMax = this.variables.length; i < iMax; i++) {
        this.values[i] = (function () {
            var value = function () {
                return value.value;
            };
            value.value = undefined;
            return value;
        })();
    }

    this.def = this.createFunction(name, variableNames, variables, expr);

    this.result = result;
}

FunctionAssignment.prototype = new Node();

math.parser.node.FunctionAssignment = FunctionAssignment;

/**
 * Create a function from the function assignment
 * @param {String} name             Function name
 * @param {String[]} variableNames  Variable names
 * @param {function[]} values       Zero or more functions
 * @param {Node} expr               The function expression
 *
 */
FunctionAssignment.prototype.createFunction = function (name, variableNames,
                                                        values, expr) {
    var fn = function () {
        // validate correct number of arguments
        var valuesNum = values ? values.length : 0;
        var argumentsNum = arguments ? arguments.length : 0;
        if (valuesNum != argumentsNum) {
            throw newArgumentsError(name, argumentsNum, valuesNum);
        }

        // fill in all parameter values
        if (valuesNum > 0) {
            for (var i = 0; i < valuesNum; i++){
                values[i].value = arguments[i];
            }
        }

        // evaluate the expression
        return expr.eval();
    };

    fn.toString = function() {
        return name + '(' + variableNames.join(', ') + ')';
    };

    return fn;
};

/**
 * Evaluate the function assignment
 * @return {function} result
 */
FunctionAssignment.prototype.eval = function() {
    // link the variables to the values of this function assignment
    var variables = this.variables,
        values = this.values;
    for (var i = 0, iMax = variables.length; i < iMax; i++) {
        variables[i].value = values[i];
    }

    // put the definition in the result
    this.result.value = this.def;

    // TODO: what to return? a neat "function y(x) defined"?
    return this.def;
};

/**
 * get string representation
 * @return {String} str
 */
FunctionAssignment.prototype.toString = function() {
    return this.def.toString();
};

/**
 * Scope
 * A scope stores functions.
 *
 * @constructor mathnotepad.Scope
 * @param {Scope} [parentScope]
 */
function Scope(parentScope) {
    this.parentScope = parentScope;
    this.nestedScopes = undefined;

    this.symbols = {}; // the actual symbols

    // the following objects are just used to test existence.
    this.defs = {};    // definitions by name (for example "a = [1, 2; 3, 4]")
    this.updates = {}; // updates by name     (for example "a(2, 1) = 5.2")
    this.links = {};   // links by name       (for example "2 * a")
}

math.parser.node.Scope = Scope;

// TODO: rethink the whole scoping solution again. Try to simplify

/**
 * Create a nested scope
 * The variables in a nested scope are not accessible from the parent scope
 * @return {Scope} nestedScope
 */
Scope.prototype.createNestedScope = function () {
    var nestedScope = new Scope(this);
    if (!this.nestedScopes) {
        this.nestedScopes = [];
    }
    this.nestedScopes.push(nestedScope);
    return nestedScope;
};

/**
 * Clear all symbols in this scope and its nested scopes
 * (parent scope will not be cleared)
 */
Scope.prototype.clear = function () {
    this.symbols = {};
    this.defs = {};
    this.links = {};
    this.updates = {};

    if (this.nestedScopes) {
        var nestedScopes = this.nestedScopes;
        for (var i = 0, iMax = nestedScopes.length; i < iMax; i++) {
            nestedScopes[i].clear();
        }
    }
};

/**
 * create a symbol
 * @param {String} name
 * @return {function} symbol
 * @private
 */
Scope.prototype.createSymbol = function (name) {
    var symbol = this.symbols[name];
    if (!symbol) {
        // get a link to the last definition
        var lastDef = this.findDef(name);

        // create a new symbol
        symbol = this.newSymbol(name, lastDef);
        this.symbols[name] = symbol;

    }
    return symbol;
};

/**
 * Create a new symbol
 * @param {String} name
 * @param {*} [value]
 * @return {function} symbol
 * @private
 */
Scope.prototype.newSymbol = function (name, value) {
    // create a new symbol
    var scope = this;
    var symbol = function () {
        if (!symbol.value) {
            // try to resolve again
            symbol.value = scope.findDef(name);

            if (!symbol.value) {
                throw new Error('Undefined symbol ' + name);
            }
        }
        if (typeof symbol.value == 'function') {
            return symbol.value.apply(null, arguments);
        }
        else {
            // TODO: implement subset for all types
            return symbol.value;
        }
    };

    symbol.value = value;

    symbol.toString = function () {
        return symbol.value ? symbol.value.toString() : '';
    };

    return symbol;
};

/**
 * create a link to a value.
 * @param {String} name
 * @return {function} symbol
 */
Scope.prototype.createLink = function (name) {
    var symbol = this.links[name];
    if (!symbol) {
        symbol = this.createSymbol(name);
        this.links[name] = symbol;
    }
    return symbol;
};

/**
 * Create a variable definition
 * Returns the created symbol
 * @param {String} name
 * @param {*} [value]
 * @return {function} symbol
 */
Scope.prototype.createDef = function (name, value) {
    var symbol = this.defs[name];
    if (!symbol) {
        symbol = this.createSymbol(name);
        this.defs[name] = symbol;
    }
    if (symbol && value != undefined) {
        symbol.value = value;
    }
    return symbol;
};

/**
 * Create a variable update definition
 * Returns the created symbol
 * @param {String} name
 * @return {function} symbol
 */
Scope.prototype.createUpdate = function (name) {
    var symbol = this.updates[name];
    if (!symbol) {
        symbol = this.createLink(name);
        this.updates[name] = symbol;
    }
    return symbol;
};

/**
 * get the link to a symbol definition or update.
 * If the symbol is not found in this scope, it will be looked up in its parent
 * scope.
 * @param {String} name
 * @return {function | undefined} symbol, or undefined when not found
 */
Scope.prototype.findDef = function (name) {
    var symbol;

    // check scope
    symbol = this.defs[name];
    if (symbol) {
        return symbol;
    }
    symbol = this.updates[name];
    if (symbol) {
        return symbol;
    }

    // check parent scope
    if (this.parentScope) {
        return this.parentScope.findDef(name);
    }
    else {
        // this is the root scope (has no parent)

        var newSymbol = this.newSymbol,
            symbols = this.symbols,
            defs = this.defs;

        /**
         * Store a symbol in the root scope
         * @param {String} name
         * @param {*} value
         * @return {function} symbol
         */
        function put(name, value) {
            var symbol = newSymbol(name, value);
            symbols[name] = symbol;
            defs[name] = symbol;
            return symbol;
        }

        // check constant (and load the constant)
        if (name == 'pi') {
            return put(name, math.PI);
        }
        if (name == 'e') {
            return put(name, math.E);
        }
        if (name == 'i') {
            return put(name, new Complex(0, 1));
        }

        // check function (and load the function), for example "sin" or "sqrt"
        // search in the mathnotepad.math namespace for this symbol
        var fn = math[name];
        if (fn) {
            return put(name, fn);
        }

        // Check if token is a unit
        // Note: we do not check the upper case name, units are case sensitive!
        if (Unit.isUnit(name)) {
            var unit = new Unit(null, name);
            return put(name, unit);
        }
    }

    return undefined;
};

/**
 * Remove a link to a symbol
 * @param {String} name
 */
Scope.prototype.removeLink = function (name) {
    delete this.links[name];
};

/**
 * Remove a definition of a symbol
 * @param {String} name
 */
Scope.prototype.removeDef = function (name) {
    delete this.defs[name];
};

/**
 * Remove an update definition of a symbol
 * @param {String} name
 */
Scope.prototype.removeUpdate = function (name) {
    delete this.updates[name];
};

/**
 * initialize the scope and its nested scopes
 *
 * All functions are linked to their previous definition
 * If there is no parentScope, or no definition of the func in the parent scope,
 * the link will be set undefined
 */
Scope.prototype.init = function () {
    var symbols = this.symbols;
    var parentScope = this.parentScope;

    for (var name in symbols) {
        if (symbols.hasOwnProperty(name)) {
            var symbol = symbols[name];
            symbol.value = (parentScope ? parentScope.findDef(name) : undefined);
        }
    }

    if (this.nestedScopes) {
        this.nestedScopes.forEach(function (nestedScope) {
            nestedScope.init();
        });
    }
};

/**
 * Check whether this scope or any of its nested scopes contain a link to a
 * symbol with given name
 * @param {String} name
 * @return {boolean} hasLink   True if a link with given name is found
 */
Scope.prototype.hasLink = function (name) {
    if (this.links[name]) {
        return true;
    }

    if (this.nestedScopes) {
        var nestedScopes = this.nestedScopes;
        for (var i = 0, iMax = nestedScopes.length; i < iMax; i++) {
            if (nestedScopes[i].hasLink(name)) {
                return true;
            }
        }
    }

    return false;
};

/**
 * Check whether this scope contains a definition of a symbol with given name
 * @param {String} name
 * @return {boolean} hasDef   True if a definition with given name is found
 */
Scope.prototype.hasDef = function (name) {
    return (this.defs[name] != undefined);
};

/**
 * Check whether this scope contains an update definition of a symbol with
 * given name
 * @param {String} name
 * @return {boolean} hasUpdate   True if an update definition with given name is found
 */
Scope.prototype.hasUpdate = function (name) {
    return (this.updates[name] != undefined);
};

/**
 * Retrieve all undefined symbols
 * @return {function[]} undefinedSymbols   All symbols which are undefined
 */
Scope.prototype.getUndefinedSymbols = function () {
    var symbols = this.symbols;
    var undefinedSymbols = [];
    for (var i in symbols) {
        if (symbols.hasOwnProperty(i)) {
            var symbol = symbols[i];
            if (symbol.value == undefined) {
                undefinedSymbols.push(symbol);
            }
        }
    }

    if (this.nestedScopes) {
        this.nestedScopes.forEach(function (nestedScope) {
            undefinedSymbols =
                undefinedSymbols.concat(nestedScope.getUndefinedSymbols());
        });
    }

    return undefinedSymbols;
};

/**
 * @constructor math.parser.Parser
 * Parser parses math expressions and evaluates them or returns a node tree.
 *
 * Methods:
 *    var result = parser.eval(expr);    // evaluate an expression
 *    var value = parser.get(name);      // retrieve a variable from the parser
 *    parser.set(name, value);           // set a variable in the parser
 *
 *    // it is possible to parse an expression into a node tree:
 *    var node = parser.parse(expr);     // parse an expression into a node tree
 *    var result = node.eval();          // evaluate a parsed node
 *
 * Example usage:
 *    var parser = new math.parser.Parser();
 *
 *    // evaluate expressions
 *    var a = parser.eval('sqrt(3^2 + 4^2)'); // 5
 *    var b = parser.eval('sqrt(-4)');        // 2i
 *    var c = parser.eval('2 inch in cm');    // 5.08 cm
 *    var d = parser.eval('cos(45 deg)');     // 0.7071067811865476
 *
 *    // define variables and functions
 *    parser.eval('x = 7 / 2');               // 3.5
 *    parser.eval('x + 3');                   // 6.5
 *    parser.eval('function f(x, y) = x^y');  // f(x, y)
 *    parser.eval('f(2, 3)');                 // 8
 *
 *    // get and set variables and functions
 *    var x = parser.get('x');                // 7
 *    var f = parser.get('f');                // function
 *    var g = f(3, 2);                        // 9
 *    parser.set('h', 500);
 *    var i = parser.eval('h / 2');           // 250
 *    parser.set('hello', function (name) {
 *        return 'hello, ' + name + '!';
 *    });
 *    parser.eval('hello("user")');           // "hello, user!"
 *
 *    // clear defined functions and variables
 *    parser.clear();
 */
function Parser() {
    if (this.constructor != Parser) {
        throw new SyntaxError(
            'Parser constructor must be called with the new operator');
    }

    // token types enumeration
    this.TOKENTYPE = {
        NULL : 0,
        DELIMITER : 1,
        NUMBER : 2,
        SYMBOL : 3,
        UNKNOWN : 4
    };

    this.expr = '';        // current expression
    this.index = 0;        // current index in expr
    this.c = '';           // current token character in expr
    this.token = '';       // current token
    this.token_type = this.TOKENTYPE.NULL; // type of the token
    // TODO: do not use this.token, but a local variable var token for better speed? -> getToken() must return token.

    this.scope = new Scope();
}

math.parser.Parser = Parser;

/**
 * Parse an expression end return the parsed function node.
 * The node can be evaluated via node.eval()
 * @param {String} expr
 * @param {Scope} [scope]
 * @return {Node} node
 * @throws {Error}
 */
Parser.prototype.parse = function (expr, scope) {
    this.expr = expr || '';

    if (!scope) {
        this.newScope();
        scope = this.scope;
    }

    return this.parse_start(scope);
};

/**
 * Parse and evaluate the given expression
 * @param {String} expr     A string containing an expression, for example "2+3"
 * @return {*} result       The result, or undefined when the expression was
 *                          empty
 * @throws {Error}
 */
Parser.prototype.eval = function (expr) {
    var node = this.parse(expr);
    return node.eval();
};

/**
 * Get a variable (a function or variable) by name from the parsers scope.
 * Returns undefined when not found
 * @param {String} name
 * @return {* | undefined} value
 */
Parser.prototype.get = function (name) {
    this.newScope();
    var symbol = this.scope.findDef(name);
    if (symbol) {
        return symbol.value;
    }
    return undefined;
};

/**
 * Set a symbol (a function or variable) by name from the parsers scope.
 * @param {String} name
 * @param {* | undefined} value
 */
Parser.prototype.set = function (name, value) {
    this.scope.createDef(name, value);
};

/**
 * Create a new scope having the current scope as parent scope, to make current
 * scope immutable
 * @private
 */
Parser.prototype.newScope = function () {
    this.scope = new Scope(this.scope);

    // TODO: smartly cleanup scopes which are not relevant anymore

};

/**
 * Clear the scope with variables and functions
 */
Parser.prototype.clear = function () {
    this.scope.clear();
};

/**
 * Get the next character from the expression.
 * The character is stored into the char t.
 * If the end of the expression is reached, the function puts an empty
 * string in t.
 * @private
 */
Parser.prototype.getChar = function () {
    this.index++;
    this.c = this.expr.charAt(this.index);
};

/**
 * Get the first character from the expression.
 * The character is stored into the char t.
 * If the end of the expression is reached, the function puts an empty
 * string in t.
 * @private
 */
Parser.prototype.getFirstChar = function () {
    this.index = 0;
    this.c = this.expr.charAt(0);
};

/**
 * Get next token in the current string expr.
 * Uses the Parser data expr, e, token, t, token_type and err
 * The token and token type are available at this.token_type and this.token
 * @private
 */
Parser.prototype.getToken = function () {
    this.token_type = this.TOKENTYPE.NULL;
    this.token = '';

    // skip over whitespaces
    while (this.c == ' ' || this.c == '\t') {  // space or tab
        this.getChar();
    }

    // skip comment
    if (this.c == '#') {
        while (this.c != '\n' && this.c != '') {
            this.getChar();
        }
    }

    // check for end of expression
    if (this.c == '') {
        // token is still empty
        this.token_type = this.TOKENTYPE.DELIMITER;
        return;
    }

    // check for minus, comma, parentheses, quotes, newline, semicolon
    if (this.c == '-' || this.c == ',' ||
        this.c == '(' || this.c == ')' ||
        this.c == '[' || this.c == ']' ||
        this.c == '\"' || this.c == '\n' ||
        this.c == ';' || this.c == ':') {
        this.token_type = this.TOKENTYPE.DELIMITER;
        this.token += this.c;
        this.getChar();
        return;
    }

    // check for operators (delimiters)
    if (this.isDelimiter(this.c)) {
        this.token_type = this.TOKENTYPE.DELIMITER;
        while (this.isDelimiter(this.c)) {
            this.token += this.c;
            this.getChar();
        }
        return;
    }

    // check for a number
    if (this.isDigitDot(this.c)) {
        this.token_type = this.TOKENTYPE.NUMBER;
        while (this.isDigitDot(this.c)) {
            this.token += this.c;
            this.getChar();
        }

        // check for scientific notation like "2.3e-4" or "1.23e50"
        if (this.c == 'E' || this.c == 'e') {
            this.token += this.c;
            this.getChar();

            if (this.c == '+' || this.c == '-') {
                this.token += this.c;
                this.getChar();
            }

            // Scientific notation MUST be followed by an exponent
            if (!this.isDigit(this.c)) {
                // this is no legal number, exponent is missing.
                this.token_type = this.TOKENTYPE.UNKNOWN;
            }

            while (this.isDigit(this.c)) {
                this.token += this.c;
                this.getChar();
            }
        }
        return;
    }

    // check for variables or functions
    if (this.isAlpha(this.c)) {
        this.token_type = this.TOKENTYPE.SYMBOL;

        while (this.isAlpha(this.c) || this.isDigit(this.c))
        {
            this.token += this.c;
            this.getChar();
        }
        return;
    }

    // something unknown is found, wrong characters -> a syntax error
    this.token_type = this.TOKENTYPE.UNKNOWN;
    while (this.c != '') {
        this.token += this.c;
        this.getChar();
    }
    throw this.createSyntaxError('Syntax error in part "' + this.token + '"');
};

/**
 * checks if the given char c is a delimiter
 * minus is not checked in this method (can be unary minus)
 * @param {String} c   a string with one character
 * @return {Boolean}
 * @private
 */
Parser.prototype.isDelimiter = function (c) {
    return c == '&' ||
        c == '|' ||
        c == '<' ||
        c == '>' ||
        c == '=' ||
        c == '+' ||
        c == '/' ||
        c == '*' ||
        c == '%' ||
        c == '^' ||
        c == ',' ||
        c == ';' ||
        c == '\n' ||
        c == '!';
};

/**
 * Check if a given name is valid
 * if not, an error is thrown
 * @param {String} name
 * @return {boolean} valid
 * @private
 */
Parser.prototype.isValidSymbolName = function (name) {
    for (var i = 0, iMax = name.length; i < iMax; i++) {
        var c = name.charAt(i);
        //var valid = (this.isAlpha(c) || (i > 0 && this.isDigit(c))); // TODO
        var valid = (this.isAlpha(c));
        if (!valid) {
            return false;
        }
    }

    return true;
};

/**
 * checks if the given char c is a letter (upper or lower case)
 * or underscore
 * @param {String} c   a string with one character
 * @return {Boolean}
 * @private
 */
Parser.prototype.isAlpha = function (c) {
    return ((c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        c == '_');
};

/**
 * checks if the given char c is a digit or dot
 * @param {String} c   a string with one character
 * @return {Boolean}
 * @private
 */
Parser.prototype.isDigitDot = function (c) {
    return ((c >= '0' && c <= '9') ||
        c == '.');
};

/**
 * checks if the given char c is a digit
 * @param {String} c   a string with one character
 * @return {Boolean}
 * @private
 */
Parser.prototype.isDigit = function (c) {
    return ((c >= '0' && c <= '9'));
};

/**
 * Start of the parse levels below, in order of precedence
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_start = function (scope) {
    // get the first character in expression
    this.getFirstChar();

    this.getToken();

    var node;
    if (this.token == '') {
        // empty expression
        node = new Constant(undefined);
    }
    else {
        node = this.parse_block(scope);
    }

    // check for garbage at the end of the expression
    // an expression ends with a empty character '' and token_type DELIMITER
    if (this.token != '') {
        if (this.token_type == this.TOKENTYPE.DELIMITER) {
            // user entered a not existing operator like "//"

            // TODO: give hints for aliases, for example with "<>" give as hint " did you mean != ?"
            throw this.createError('Unknown operator ' + this.token);
        }
        else {
            throw this.createSyntaxError('Unexpected part "' + this.token + '"');
        }
    }

    return node;
};


/**
 * Parse assignment of ans.
 * Ans is assigned when the expression itself is no variable or function
 * assignment
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_ans = function (scope) {
    var expression = this.parse_function_assignment(scope);

    // TODO: not so nice having to specify some special types here...
    if (!(expression instanceof Assignment)
        // !(expression instanceof FunctionAssignment) &&  // TODO
        // !(expression instanceof plot)                   // TODO
        ) {
        // create a variable definition for ans
        var name = 'ans';
        var params = undefined;
        var link = scope.createDef(name);
        return new Assignment(name, params, expression, link);
    }

    return expression;
};


/**
 * Parse a block with expressions. Expressions can be separated by a newline
 * character '\n', or by a semicolon ';'. In case of a semicolon, no output
 * of the preceding line is returned.
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_block = function (scope) {
    var node, block, visible;

    if (this.token != '\n' && this.token != ';' && this.token != '') {
        node = this.parse_ans(scope);
    }

    while (this.token == '\n' || this.token == ';') {
        if (!block) {
            // initialize the block
            block = new Block();
            if (node) {
                visible = (this.token != ';');
                block.add(node, visible);
            }
        }

        this.getToken();
        if (this.token != '\n' && this.token != ';' && this.token != '') {
            node = this.parse_ans(scope);

            visible = (this.token != ';');
            block.add(node, visible);
        }
    }

    if (block) {
        return block;
    }

    if (!node) {
        node = this.parse_ans(scope);
    }

    return node;
};

/**
 * Parse a function assignment like "function f(a,b) = a*b"
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_function_assignment = function (scope) {
    // TODO: keyword 'function' must become a reserved keyword
    if (this.token_type == this.TOKENTYPE.SYMBOL && this.token == 'function') {
        // get function name
        this.getToken();
        if (this.token_type != this.TOKENTYPE.SYMBOL) {
            throw this.createSyntaxError('Function name expected');
        }
        var name = this.token;

        // get parenthesis open
        this.getToken();
        if (this.token != '(') {
            throw this.createSyntaxError('Opening parenthesis ( expected');
        }

        // get function variables
        var functionScope = scope.createNestedScope();
        var variableNames = [];
        var variables = [];
        while (true) {
            this.getToken();
            if (this.token_type == this.TOKENTYPE.SYMBOL) {
                // store parameter
                var variableName = this.token;
                var variable = functionScope.createDef(variableName);
                variableNames.push(variableName);
                variables.push(variable);
            }
            else {
                throw this.createSyntaxError('Variable name expected');
            }

            this.getToken();
            if (this.token == ',') {
                // ok, nothing to do, read next variable
            }
            else if (this.token == ')') {
                // end of variable list encountered. break loop
                break;
            }
            else {
                throw this.createSyntaxError('Comma , or closing parenthesis ) expected"');
            }
        }

        this.getToken();
        if (this.token != '=') {
            throw this.createSyntaxError('Equal sign = expected');
        }

        // parse the expression, with the correct function scope
        this.getToken();
        var expression = this.parse_range(functionScope);
        var result = scope.createDef(name);

        return  new FunctionAssignment(name, variableNames, variables,
            expression, result);
    }

    return this.parse_assignment(scope);
};

/**
 * Assignment of a variable, can be a variable like "a=2.3" or a updating an
 * existing variable like "matrix(2,3:5)=[6,7,8]"
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_assignment = function (scope) {
    var linkExisted = false;
    if (this.token_type == this.TOKENTYPE.SYMBOL) {
        linkExisted = scope.hasLink(this.token);
    }

    var node = this.parse_range(scope);

    if (this.token == '=') {
        if (!(node instanceof Symbol)) {
            throw this.createSyntaxError('Symbol expected at the left hand side ' +
                'of assignment operator =');
        }
        var name = node.name;
        var params = node.params;

        if (!linkExisted) {
            // we parsed the assignment as if it where an expression instead,
            // therefore, a link was created to the symbol. This link must
            // be cleaned up again, and only if it wasn't existing before
            scope.removeLink(name);
        }

        // parse the expression, with the correct function scope
        this.getToken();
        var expression = this.parse_range(scope);
        var link = node.hasParams() ? scope.createUpdate(name) : scope.createDef(name);
        return new Assignment(name, params, expression, link);
    }

    return node;
};

/**
 * parse range, "start:end" or "start:step:end"
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_range = function (scope) {
    var node = this.parse_conditions(scope);

    /* TODO: implement range
    if (this.token == ':') {
        var params = [node];

        while (this.token == ':') {
            this.getToken();
            params.push(this.parse_conditions(scope));
        }

        var fn = range;
        var name = ':';
        node = new Symbol(name, fn, params);
    }
    */

    return node;
};

/**
 * conditions like and, or, in
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_conditions = function (scope) {
    var node = this.parse_bitwise_conditions(scope);

    // TODO: precedence of And above Or?
    var operators = {
        'in' : 'in'
        /* TODO: implement conditions
        'and' : 'and',
        '&&' : 'and',
        'or': 'or',
        '||': 'or',
        'xor': 'xor'
        */
    };
    while (operators[this.token] !== undefined) {
        // TODO: with all operators: only load one instance of the operator, use the scope
        var name = this.token;
        var fn = math[operators[name]];

        this.getToken();
        var params = [node, this.parse_bitwise_conditions(scope)];
        node = new Symbol(name, fn, params);
    }

    return node;
};

/**
 * conditional operators and bitshift
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_bitwise_conditions = function (scope) {
    var node = this.parse_comparison(scope);

    /* TODO: implement bitwise conditions
    var operators = {
        '&' : 'bitwiseand',
        '|' : 'bitwiseor',
        // todo: bitwise xor?
        '<<': 'bitshiftleft',
        '>>': 'bitshiftright'
    };
    while (operators[this.token] !== undefined) {
        var name = this.token;
        var fn = math[operators[name]];

        this.getToken();
        var params = [node, this.parse_comparison()];
        node = new Symbol(name, fn, params);
    }
    */

    return node;
};

/**
 * comparison operators
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_comparison = function (scope) {
    var node = this.parse_addsubtract(scope);

    var operators = {
        '==': 'equal',
        '!=': 'unequal',
        '<': 'smaller',
        '>': 'larger',
        '<=': 'smallereq',
        '>=': 'largereq'
    };
    while (operators[this.token] !== undefined) {
        var name = this.token;
        var fn = math[operators[name]];

        this.getToken();
        var params = [node, this.parse_addsubtract(scope)];
        node = new Symbol(name, fn, params);
    }

    return node;
};

/**
 * add or subtract
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_addsubtract = function (scope)  {
    var node = this.parse_multiplydivide(scope);

    var operators = {
        '+': 'add',
        '-': 'subtract'
    };
    while (operators[this.token] !== undefined) {
        var name = this.token;
        var fn = math[operators[name]];

        this.getToken();
        var params = [node, this.parse_multiplydivide(scope)];
        node = new Symbol(name, fn, params);
    }

    return node;
};


/**
 * multiply, divide, modulus
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_multiplydivide = function (scope) {
    var node = this.parse_pow(scope);

    var operators = {
        '*': 'multiply',
        '/': 'divide',
        '%': 'mod',
        'mod': 'mod'
    };
    while (operators[this.token] !== undefined) {
        var name = this.token;
        var fn = math[operators[name]];

        this.getToken();
        var params = [node, this.parse_pow(scope)];
        node = new Symbol(name, fn, params);
    }

    return node;
};

/**
 * power
 * Node: power operator is right associative
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_pow = function (scope) {
    var nodes = [
        this.parse_factorial(scope)
    ];

    // stack all operands of a chained power operator (like '2^3^3')
    while (this.token == '^') {
        this.getToken();
        nodes.push(this.parse_factorial(scope));
    }

    // evaluate the operands from right to left (right associative)
    var node = nodes.pop();
    while (nodes.length) {
        var leftNode = nodes.pop();
        var name = '^';
        var fn = pow;
        var params = [leftNode, node];
        node = new Symbol(name, fn, params);
    }

    return node;
};

/**
 * Factorial
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_factorial = function (scope)  {
    var node = this.parse_unaryminus(scope);

    while (this.token == '!') {
        var name = this.token;
        var fn = factorial;
        this.getToken();
        var params = [node];

        node = new Symbol(name, fn, params);
    }

    return node;
};

/**
 * Unary minus
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_unaryminus = function (scope) {
    if (this.token == '-') {
        var name = this.token;
        var fn = unaryminus;
        this.getToken();
        var params = [this.parse_plot(scope)];

        return new Symbol(name, fn, params);
    }

    return this.parse_plot(scope);
};

/**
 * parse plot
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_plot = function (scope) {
    /* TODO: implement plot
    if (this.token_type == this.TOKENTYPE.SYMBOL &&
        this.token == 'plot') {
        this.getToken();

        // parse the parentheses and parameters of the plot
        // the parameters are something like: plot(sin(x), cos(x), x)
        var functions = [];
        if (this.token == '(') {
            var plotScope = scope.createNestedScope();

            this.getToken();
            functions.push(this.parse_range(plotScope));

            // parse a list with parameters
            while (this.token == ',') {
                this.getToken();
                functions.push(this.parse_range(plotScope));
            }

            if (this.token != ')') {
                throw this.createSyntaxError('Parenthesis ) missing');
            }
            this.getToken();
        }

        // check what the variable of the functions is.
        var variable = undefined;
        var lastFunction = functions[functions.length - 1];
        if (lastFunction) {
            // if the last function is a variable, remove it from the functions list
            // and use its variable func
            var lastIsSymbol = (lastFunction instanceof Symbol &&
                !lastFunction.hasParams());
            if (lastIsSymbol) {
                functions.pop();
                variable = lastFunction.fn;
            }
        }
        return new plot(functions, variable, plotScope);
    }
    */

    return this.parse_symbol(scope);
};

/**
 * parse symbols: functions, variables, constants, units
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_symbol = function (scope) {
    if (this.token_type == this.TOKENTYPE.SYMBOL) {
        var name = this.token;

        this.getToken();

        var link = scope.createLink(name);
        var arguments = this.parse_arguments(scope); // TODO: not so nice to "misuse" creating a Function
        var symbol = new Symbol(name, link, arguments);

        /* TODO: parse arguments
        // parse arguments
        while (this.token == '(') {
            symbol = this.parse_arguments(scope, symbol);
        }
        */
        return symbol;
    }

    return this.parse_string(scope);
};

/**
 * parse symbol parameters
 * @param {Scope} scope
 * @return {Node[]} arguments
 * @private
 */
Parser.prototype.parse_arguments = function (scope) {
    var arguments = [];
    if (this.token == '(') {
        // TODO: in case of Plot, create a new scope.

        this.getToken();

        if (this.token != ')') {
            arguments.push(this.parse_range(scope));

            // parse a list with parameters
            while (this.token == ',') {
                this.getToken();
                arguments.push(this.parse_range(scope));
            }
        }

        if (this.token != ')') {
            throw this.createSyntaxError('Parenthesis ) missing');
        }
        this.getToken();
    }

    return arguments;
};

/**
 * parse a string.
 * A string is enclosed by double quotes
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_string = function (scope) {
    if (this.token == '"') {
        // string "..."
        var str = '';
        var tPrev = '';
        while (this.c != '' && (this.c != '\"' || tPrev == '\\')) { // also handle escape character
            str += this.c;
            tPrev = this.c;
            this.getChar();
        }

        this.getToken();
        if (this.token != '"') {
            throw this.createSyntaxError('End of string " missing');
        }
        this.getToken();

        var res = new Constant(str);

        /* TODO: implement string with arguments
        // parse arguments
        while (this.token == '(') {
            res = this.parse_arguments(scope, res);
        }
        */

        return res;
    }

    return this.parse_matrix(scope);
};

/**
 * parse the matrix
 * @param {Scope} scope
 * @return {Node} A MatrixNode
 * @private
 */
Parser.prototype.parse_matrix = function (scope) {
    if (this.token == '[') {
        // matrix [...]
        var array;

        // skip newlines
        this.getToken();
        while (this.token == '\n') {
            this.getToken();
        }

        // check if this is an empty matrix "[ ]"
        if (this.token != ']') {
            // this is a non-empty matrix
            var params = [];
            var r = 0, c = 0;

            params[0] = [this.parse_range(scope)];

            // the columns in the matrix are separated by commas, and the rows by dot-comma's
            while (this.token == ',' || this.token == ';') {
                if (this.token == ',') {
                    c++;
                }
                else {
                    r++;
                    c = 0;
                    params[r] = [];
                }

                // skip newlines
                this.getToken();
                while (this.token == '\n') {
                    this.getToken();
                }

                params[r][c] = this.parse_range(scope);

                // skip newlines
                while (this.token == '\n') {
                    this.getToken();
                }
            }

            var rows =  params.length;
            var cols = (params.length > 0) ? params[0].length : 0;

            // check if the number of columns matches in all rows
            for (r = 1; r < rows; r++) {
                if (params[r].length != cols) {
                    throw this.createError('Number of columns must match ' +
                            '(' + params[r].length + ' != ' + cols + ')');
                }
            }

            if (this.token != ']') {
                throw this.createSyntaxError('End of matrix ] missing');
            }

            this.getToken();
            array = new ArrayNode(params);
        }
        else {
            // this is an empty matrix "[ ]"
            this.getToken();
            array = new ArrayNode([]);
        }

        // parse arguments
        while (this.token == '(') {
            array = this.parse_arguments(scope, array);
        }

        return array;
    }

    return this.parse_number(scope);
};

/**
 * parse a number
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_number = function (scope) {
    if (this.token_type == this.TOKENTYPE.NUMBER) {
        // this is a number
        var number;
        if (this.token == '.') {
            number = 0.0;
        } else {
            number = Number(this.token);
        }
        this.getToken();

        /* TODO: implicit multiplication?
         // TODO: how to calculate a=3; 2/2a ? is this (2/2)*a or 2/(2*a) ?
         // check for implicit multiplication
         if (token_type == TOKENTYPE.VARIABLE) {
         node = multiply(node, parse_pow());
         }
         //*/

        var value;
        if (this.token_type == this.TOKENTYPE.SYMBOL) {
            if (this.token == 'i' || this.token == 'I') {
                value = new Complex(0, number);
                this.getToken();
                return new Constant(value);
            }

            if (Unit.isUnit(this.token)) {
                value = new Unit(number, this.token);
                this.getToken();
                return new Constant(value);
            }

            throw this.createTypeError('Unknown unit "' + this.token + '"');
        }

        // just a regular number
        var res = new Constant(number);

        /* TODO: implement number with arguments
        // parse arguments
        while (this.token == '(') {
            res = this.parse_arguments(scope, res);
        }
        */

        return res;
    }

    return this.parse_parentheses(scope);
};

/**
 * parentheses
 * @param {Scope} scope
 * @return {Node} res
 * @private
 */
Parser.prototype.parse_parentheses = function (scope) {
    // check if it is a parenthesized expression
    if (this.token == '(') {
        // parentheses (...)
        this.getToken();
        var res = this.parse_range(scope); // start again

        if (this.token != ')') {
            throw this.createSyntaxError('Parenthesis ) expected');
        }
        this.getToken();

        /* TODO: implicit multiplication?
         // TODO: how to calculate a=3; 2/2a ? is this (2/2)*a or 2/(2*a) ?
         // check for implicit multiplication
         if (token_type == TOKENTYPE.VARIABLE) {
         node = multiply(node, parse_pow());
         }
         //*/

        /* TODO: parse parentheses with arguments
        // parse arguments
        while (this.token == '(') {
            res = this.parse_arguments(scope, res);
        }
        */

        return res;
    }

    return this.parse_end(scope);
};

/**
 * Evaluated when the expression is not yet ended but expected to end
 * @param {Scope} scope
 * @return {Node} res
 * @private
 */
Parser.prototype.parse_end = function (scope) {
    if (this.token == '') {
        // syntax error or unexpected end of expression
        throw this.createSyntaxError('Unexpected end of expression');
    } else {
        throw this.createSyntaxError('Value expected');
    }
};

/**
 * Shortcut for getting the current row value (one based)
 * Returns the line of the currently handled expression
 * @private
 */
Parser.prototype.row = function () {
    // TODO: also register row number during parsing
    return undefined;
};

/**
 * Shortcut for getting the current col value (one based)
 * Returns the column (position) where the last token starts
 * @private
 */
Parser.prototype.col = function () {
    return this.index - this.token.length + 1;
};


/**
 * Build up an error message
 * @param {String} message
 * @return {String} message with row and column information
 * @private
 */
Parser.prototype.createErrorMessage = function(message) {
    var row = this.row();
    var col = this.col();
    if (row === undefined) {
        if (col === undefined) {
            return message;
        } else {
            return message + ' (col ' + col + ')';
        }
    } else {
        return message + ' (ln ' + row + ', col ' + col + ')';
    }
};

/**
 * Create an error
 * @param {String} message
 * @return {SyntaxError} instantiated error
 * @private
 */
Parser.prototype.createSyntaxError = function(message) {
    return new SyntaxError(this.createErrorMessage(message));
};

/**
 * Create an error
 * @param {String} message
 * @return {TypeError} instantiated error
 * @private
 */
Parser.prototype.createTypeError = function(message) {
    return new TypeError(this.createErrorMessage(message));
};

/**
 * Create an error
 * @param {String} message
 * @return {Error} instantiated error
 * @private
 */
Parser.prototype.createError = function(message) {
    return new Error(this.createErrorMessage(message));
};

/**
 * @constructor math.parser.Workspace
 *
 * Workspace manages a set of expressions. Expressions can be added, replace,
 * deleted, and inserted in the workspace. The workspace keeps track on the
 * dependencies between the expressions, and automatically updates results of
 * depending expressions when variables or function definitions are changed in
 * the workspace.
 *
 * Methods:
 *     var id = workspace.append(expr);
 *     var id = workspace.insertBefore(expr, beforeId);
 *     var id = workspace.insertAfter(expr, afterId);
 *     workspace.replace(expr, id);
 *     workspace.remove(id);
 *     workspace.clear();
 *     var expr   = workspace.getExpr(id);
 *     var result = workspace.getResult(id);
 *     var deps   = workspace.getDependencies(id);
 *     var changes = workspace.getChanges(updateSeq);
 *
 * Usage:
 *     var workspace = new math.parser.Workspace();
 *     var id0 = workspace.append('a = 3/4');
 *     var id1 = workspace.append('a + 2');
 *     console.log('a + 2 = ' + workspace.getResult(id1));
 *     workspace.replace('a=5/2', id0);
 *     console.log('a + 2 = ' + workspace.getResult(id1));
 */
function Workspace () {
    this.idMax = -1;
    this.updateSeq = 0;
    this.parser = new Parser();
    this.scope = new Scope();

    this.nodes = {};
    this.firstNode = undefined;
    this.lastNode = undefined;
}

math.parser.Workspace = Workspace;

/**
 * clear the workspace
 */
Workspace.prototype.clear = function () {
    this.nodes = {};
    this.firstNode = undefined;
    this.lastNode = undefined;
};

/**
 * append an expression to the workspace
 * @param {String}    expression
 * @return {Number}   id of the created node
 */
Workspace.prototype.append = function (expression) {
    // create the node
    var id = this._getNewId();
    var parentScope = this.lastNode ? this.lastNode.scope : this.scope;
    var scope = new Scope(parentScope);
    var node = new Workspace.Node({
        'id': id,
        'expression': expression,
        'parser': this.parser,
        'scope': scope,
        'nextNode': undefined,
        'previousNode': this.lastNode
    });
    this.nodes[id] = node;

    // link next and previous nodes
    if (!this.firstNode) {
        this.firstNode = node;
    }
    if (this.lastNode) {
        this.lastNode.nextNode = node;
    }
    this.lastNode = node;

    // update this node
    this._update([id]);

    return id;
};

/**
 * insert an expression before an existing expression
 * @param {String} expression   the new expression
 * @param {Number} beforeId     id of an existing expression
 * @return {Number} id          id of the created node
 */
Workspace.prototype.insertBefore = function (expression, beforeId) {
    var nextNode = this.nodes[beforeId];
    if (!nextNode) {
        throw 'Node with id "' + beforeId + '" not found';
    }

    var previousNode = nextNode.previousNode;

    // create the node
    var id = this._getNewId();
    var previousScope = previousNode ? previousNode.scope : this.scope;
    var scope = new Scope(previousScope);
    var node = new Workspace.Node({
        'id': id,
        'expression': expression,
        'parser': this.parser,
        'scope': scope,
        'nextNode': nextNode,
        'previousNode': previousNode
    });
    this.nodes[id] = node;

    // link next and previous nodes
    if (previousNode) {
        previousNode.nextNode = node;
    }
    else {
        this.firstNode = node;
    }
    nextNode.previousNode = node;

    // link to the new the scope
    nextNode.scope.parentScope = node.scope;

    // update this node and all dependent nodes
    var ids = this.getDependencies(id);
    if (ids.indexOf(id) == -1) {
        ids.unshift(id);
    }
    this._update(ids);

    return id;
};

/**
 * insert an expression after an existing expression
 * @param {String} expression   the new expression
 * @param {Number} afterId      id of an existing expression
 * @return {Number} id          id of the created expression
 */
Workspace.prototype.insertAfter = function (expression, afterId) {
    var previousNode = this.nodes[afterId];
    if (!previousNode) {
        throw 'Node with id "' + afterId + '" not found';
    }

    if (previousNode == this.lastNode) {
        return this.append(expression);
    }
    else {
        return this.insertBefore(afterId + 1, expression);
    }
};


/**
 * remove an expression. If the expression is not found, no action will
 * be taken.
 * @param {Number} id           id of an existing expression
 */
Workspace.prototype.remove = function (id) {
    var node = this.nodes[id];
    if (!node) {
        throw 'Node with id "' + id + '" not found';
    }

    // get the dependencies (needed to update them after deletion of this node)
    var dependentIds = this.getDependencies(id);

    // adjust links to previous and next nodes
    var previousNode = node.previousNode;
    var nextNode = node.nextNode;
    if (previousNode) {
        previousNode.nextNode = nextNode;
    }
    else {
        this.firstNode = nextNode;
    }
    if (nextNode) {
        nextNode.previousNode = previousNode;
    }
    else {
        this.lastNode = previousNode;
    }

    // re-link the scope
    var previousScope = previousNode ? previousNode.scope : this.scope;
    if (nextNode) {
        nextNode.scope.parentScope = previousScope;
    }

    // remove the node
    delete this.nodes[id];

    // update all dependent nodes
    this._update(dependentIds);
};


/**
 * replace an existing expression
 * @param {String} expression   the new expression
 * @param {Number} id           id of an existing expression
 */
Workspace.prototype.replace = function (expression, id) {
    var node = this.nodes[id];
    if (!node) {
        throw 'Node with id "' + id + '" not found';
    }

    // get the dependencies
    var dependentIds = [id];
    Workspace._merge(dependentIds, this.getDependencies(id));

    var previousNode = node.previousNode;
    var nextNode = node.nextNode;
    var previousScope = previousNode ? previousNode.scope : this.scope;

    // replace the expression
    node.setExpr(expression);

    // add the new dependencies
    Workspace._merge(dependentIds, this.getDependencies(id));

    // update all dependencies
    this._update(dependentIds);
};

/**
 * @constructor mathnotepad.Workspace.Node
 * @param {Object} params Object containing parameters:
 *                        {Number} id
 *                        {String} expression   An expression, for example "2+3"
 *                        {mathnotepad.Parser} parser
 *                        {mathnotepad.Scope} scope
 *                        {mathnotepad.Workspace.Node} nextNode
 *                        {mathnotepad.Workspace.Node} previousNode
 */
Workspace.Node = function (params) {
    this.id = params.id;
    this.parser = params.parser;
    this.scope = params.scope;
    this.nextNode = params.nextNode;
    this.previousNode = params.previousNode;
    // TODO: throw error when id, parser, or scope is not given

    this.updateSeq = 0;
    this.result = undefined;
    this.setExpr(params.expression);
};

/**
 * set the node's expression
 * @param {String} expression
 */
Workspace.Node.prototype.setExpr = function (expression) {
    this.expression = expression || '';
    this.scope.clear();
    this._parse();
};

/**
 * get the node's expression
 * @return {String} expression
 */
Workspace.Node.prototype.getExpr = function () {
    return this.expression;
};

/**
 * get the result of the nodes expression
 * @return {*} result
 */
Workspace.Node.prototype.getResult = function () {
    // TODO: automatically evaluate when not up to date?
    return this.result;
};

/**
 * parse the node's expression
 * @private
 */
Workspace.Node.prototype._parse = function () {
    try {
        this.fn = this.parser.parse(this.expression, this.scope);
    }
    catch (err) {
        var value = 'Error: ' + String(err.message || err);
        this.fn = new Constant(value);
    }
};

/**
 * Evaluate the node expression
 * @return {*} result
 */
Workspace.Node.prototype.eval = function () {
    try {
        this.scope.init();
        this.result = this.fn.eval();
    }
    catch (err) {
        this.scope.init();
        this.result = 'Error: ' + String(err.message || err);
    }
    return this.result;
};

/**
 * Merge array2 into array1, only adding distinct elements.
 * The elements are not sorted.
 * @param {Array} array1
 * @param {Array} array2
 * @private
 */
Workspace._merge = function (array1, array2) {
    for (var i = 0, iMax = array2.length; i < iMax; i++) {
        var elem = array2[i];
        if (array1.indexOf(elem) == -1) {
            array1.push(elem);
        }
    }
};

/**
 * Retrieve the id's of the nodes which are dependent on this node
 * @param {Number} id
 * @return {Number[]} id's of dependent nodes. The ids are not ordered
 */
Workspace.prototype.getDependencies = function (id) {
    var ids = [],
        name;

    var node = this.nodes[id];
    if (node) {
        // create a list with all symbol names defined/updated in this scope
        var defs = node.scope.defs;
        var updates = node.scope.updates;
        var symbolNames = [];
        for (name in defs) {
            if (defs.hasOwnProperty(name)) {
                symbolNames.push(name);
            }
        }
        for (name in updates) {
            if (updates.hasOwnProperty(name) && symbolNames.indexOf(name) == -1) {
                symbolNames.push(name);
            }
        }

        // loop through the nodes and retrieve the ids of nodes dependent on
        // these values. We start at current node
        var n = node.nextNode;
        while (n && symbolNames.length) {
            var scope = n.scope;
            // loop through each of the parameters and check if the scope
            // contains bindings to this parameter func
            var i = 0;
            while (i < symbolNames.length) {
                name = symbolNames[i];

                // check if this scope contains a link to the current symbol name
                if (scope.hasLink(name) || scope.hasUpdate(name)) {
                    if (ids.indexOf(n.id) == -1) {
                        ids.push(n.id);

                        // recursively check the dependencies of this id
                        var childIds = this.getDependencies(n.id);
                        Workspace._merge(ids, childIds);
                    }
                }

                // stop propagation of the current symbol name as soon as it is
                // redefined in one of the next scopes (not if it is updated)
                if (scope.hasDef(name)) {
                    symbolNames.splice(i, 1);
                    i--;
                }

                i++;
            }

            n = n.nextNode;
        }
    }

    return ids;
};

/**
 * Retrieve an expression, the original string
 * @param {Number} id    Id of the expression to be retrieved
 * @return {String}      The original expression as a string
 */
Workspace.prototype.getExpr = function (id) {
    var node = this.nodes[id];
    if (!node) {
        throw 'Node with id "' + id + '" not found';
    }

    return node.getExpr();
};


/**
 * get the result of and expression
 * @param {Number} id
 * @return {*} result
 */
Workspace.prototype.getResult = function (id) {
    var node = this.nodes[id];
    if (!node) {
        throw 'Node with id "' + id + '" not found';
    }

    return node.getResult();
};


/**
 * Update the results of an expression and all dependent expressions
 * @param {Number[]} ids    Ids of the expressions to be updated
 * @private
 */
Workspace.prototype._update = function (ids) {
    this.updateSeq++;
    var updateSeq = this.updateSeq;
    var nodes = this.nodes;

    for (var i = 0, iMax = ids.length; i < iMax; i++) {
        var id = ids[i];
        var node = nodes[id];
        if (node) {
            node.eval();
            //console.log('eval node=' + id + ' result=' + node.result.toString()); // TODO: cleanup
            node.updateSeq = updateSeq;
        }
        else {
            // TODO: throw error?
        }
    }
};

/**
 * Get all changes since an update sequence
 * @param {Number} updateSeq.    Optional. if not provided, all changes are
 *                               since the creation of the workspace are returned
 * @return {Object} ids    Object containing two parameters:
 *                         param {Number[]} ids         Array containing
 *                                                      the ids of the changed
 *                                                      expressions
 *                         param {Number} updateSeq     the current update
 *                                                      sequence
 */
Workspace.prototype.getChanges = function (updateSeq) {
    var changedIds = [];
    var node = this.firstNode;
    updateSeq = updateSeq || 0;
    while (node) {
        if (node.updateSeq > updateSeq) {
            changedIds.push(node.id);
        }
        node = node.nextNode;
    }
    return {
        'ids': changedIds,
        'updateSeq': this.updateSeq
    };
};

/**
 * Return a new, unique id for an expression
 * @return {Number} new id
 * @private
 */
Workspace.prototype._getNewId = function () {
    this.idMax++;
    return this.idMax;
};

/**
 * String representation of the Workspace
 * @return {String} description
 */
Workspace.prototype.toString = function () {
    return JSON.stringify(this.toJSON());
};

/**
 * JSON representation of the Workspace
 * @return {Object} description
 */
Workspace.prototype.toJSON = function () {
    var json = [];

    var node = this.firstNode;
    while (node) {
        var desc = {
            'id': node.id,
            'expression': node.expression,
            'dependencies': this.getDependencies(node.id)
        };

        try {
            desc.result = node.getResult();
        } catch (err) {
            desc.result = 'Error: ' + String(err.message || err);
        }

        json.push(desc);

        node = node.nextNode;
    }

    return json;
};


})();
