/**
 * math.js
 * https://github.com/josdejong/mathjs
 *
 * Math.js is an extensive math library for JavaScript and Node.js,
 * It features real and complex numbers, units, matrices, a large set of
 * mathematical functions, and a flexible expression parser.
 *
 * @version 0.5.0-SNAPSHOT
 * @date    2013-04-05
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
    type: {},
    expr: {
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

// utility methods for strings, objects, and arrays
var util = (function () {
    var util = {};

    /**
     * Convert a number to a formatted string representation
     * @param {Number} value            The value to be formatted
     * @param {Number} [digits]         number of digits
     * @return {String} formattedValue  The formatted value
     */
    util.formatNumber = function formatNumber(value, digits) {
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
     * Recursively format an n-dimensional matrix
     * Example output: "[[1, 2], [3, 4]]"
     * @param {Array} array
     * @returns {String} str
     */
    util.formatArray = function formatArray (array) {
        if (array instanceof Array) {
            var str = '[';
            var len = array.length;
            for (var i = 0; i < len; i++) {
                if (i != 0) {
                    str += ', ';
                }
                str += util.formatArray(array[i]);
            }
            str += ']';
            return str;
        }
        else {
            return format(array);
        }
    };

    /**
     * Recursively format an n-dimensional array, output looks like
     * "[1, 2, 3]"
     * @param {Array} array
     * @returns {string} str
     */
    util.formatArray2d = function formatArray2d (array) {
        var str = '[';
        var s = util.size(array);

        if (s.length != 2) {
            throw new RangeError('Array must be two dimensional (size: ' +
                util.formatArray(s) + ')');
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
    };

    /**
     * Convert function arguments to an array. Arguments can have the following
     * signature:
     *     fn()
     *     fn(n)
     *     fn(m, n, p, ...)
     *     fn([m, n, p, ...])
     * @param {...Number | Array | Matrix} args
     * @returns {Array} array
     */
    util.argsToArray = function argsToArray(args) {
        var array;
        if (args.length == 0) {
            // fn()
            array = [];
        }
        else if (args.length == 1) {
            // fn(n)
            // fn([m, n, p, ...])
            array = args[0];
            if (array instanceof Matrix) {
                array = array.toVector();
            }
            if (array instanceof Range) {
                array = array.valueOf();
            }
            if (!(array instanceof Array)) {
                array = [array];
            }
        }
        else {
            // fn(m, n, p, ...)
            array = [];
            for (var i = 0; i < args.length; i++) {
                array[i] = args[i];
            }
        }
        return array;
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
     * Execute function fn element wise for each element in array.
     * Returns an array with the results
     * @param {Array | Matrix | Range} array
     * @param {function} fn
     * @return {Array | Matrix} res
     */
    util.map = function map(array, fn) {
        if (array instanceof Array || array instanceof Matrix || array instanceof Range) {
            return array.map(function (x) {
                return fn(x);
            });
        }
        else {
            throw new TypeError('Array expected');
        }
    };

    /**
     * Execute function fn element wise for each entry in two given arrays, or
     * for a (scalar) object and array pair. Returns an array with the results
     * @param {Array | Matrix | Range | Object} array1
     * @param {Array | Matrix | Range | Object} array2
     * @param {function} fn
     * @return {Array | Matrix} res
     */
    util.map2 = function map2(array1, array2, fn) {
        var res, len, i;

        // handle Matrix
        if (array1 instanceof Matrix || array2 instanceof Matrix) {
            return new Matrix(util.map2(array1.valueOf(), array2.valueOf(), fn));
        }

        // handle Range
        if (array1 instanceof Range || array2 instanceof Range) {
            // TODO: util.map2 does not utilize Range.map
            return new Matrix(util.map2(array1.valueOf(), array2.valueOf(), fn));
        }

        if (array1 instanceof Array) {
            if (array2 instanceof Array) {
                // fn(array, array)
                if (array1.length != array2.length) {
                    throw new RangeError('Dimension mismatch ' +
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


    /**
     * For each method for objects and arrays.
     * In case of an object, the method loops over all properties of the object.
     * In case of an array, the method loops over all indexes of the array.
     * @param {Object | Array} object   The object
     * @param {function} callback       Callback method, called for each item in
     *                                  the object or array with three parameters:
     *                                  callback(value, index, object)
     */
    util.forEach = function forEach (object, callback) {
        if (object instanceof Array) {
            object.forEach(callback);
        }
        else {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    callback(object[key], key, object);
                }
            }
        }
    };

    /**
     * Creates a new object with the results of calling a provided function on
     * every property in the object.
     * @param {Object} object           The object.
     * @param {function} callback       Mapping function
     * @return {Object | Array} mappedObject
     */
    util.mapObject = function mapObject (object, callback) {
        var m = {};
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                m[key] = callback(object[key]);
            }
        }
        return m;
    };

    /**
     * Deep test equality of all fields in two pairs of arrays or objects.
     * @param {Array | Object} a
     * @param {Array | Object} b
     * @returns {boolean}
     */
    util.deepEqual = function (a, b) {
        var prop, i, len;
        if (a instanceof Array) {
            if (!(b instanceof Array)) {
                return false;
            }

            for (i = 0, len = a.length; i < len; i++) {
                if (!util.deepEqual(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        else if (a instanceof Object) {
            if (b instanceof Array || !(b instanceof Object)) {
                return false;
            }

            for (prop in a) {
                if (a.hasOwnProperty(prop)) {
                    if (!util.deepEqual(a[prop], b[prop])) {
                        return false;
                    }
                }
            }
            for (prop in b) {
                if (b.hasOwnProperty(prop)) {
                    if (!util.deepEqual(a[prop], b[prop])) {
                        return false;
                    }
                }
            }
            return true;
        }
        else {
            return (a.valueOf() == b.valueOf());
        }
    };

    /**
     * Recursively calculate the size of a multi dimensional array.
     * @param {Array} x
     * @Return {Number[]} size
     * @throws RangeError
     */
    function _size(x) {
        if (x instanceof Array) {
            var sizeX = x.length;
            if (sizeX) {
                var size0 = size(x[0]);
                if (size0[0] == 0) {
                    return [0].concat(size0);
                }
                else {
                    return [sizeX].concat(size0);
                }
            }
            else {
                return [sizeX];
            }
        }
        else {
            return [];
        }
    }

    /**
     * Calculate the size of a multi dimensional array.
     * All elements in the array are checked for matching dimensions using the
     * method validate
     * @param {Array} x
     * @Return {Number[]} size
     * @throws RangeError
     */
    util.size = function size (x) {
        // calculate the size
        var s = _size(x);

        // verify the size
        util.validate(x, s);

        return s;
    };

    /**
     * Recursively validate whether each element in a multi dimensional array
     * has a size corresponding to the provided size array.
     * @param {Array} array    Array to be validated
     * @param {Number[]} size  Array with the size of each dimension
     * @param {Number} dim   Current dimension
     * @throws RangeError
     */
    function _validate(array, size, dim) {
        var i;
        var len = array.length;

        if (len != size[dim]) {
            throw new RangeError('Dimension mismatch (' + len + ' != ' + size[dim] + ')');
        }

        if (dim < size.length - 1) {
            // recursively validate each child array
            var dimNext = dim + 1;
            for (i = 0; i < len; i++) {
                var child = array[i];
                if (!(child instanceof Array)) {
                    throw new RangeError('Dimension mismatch ' +
                        '(' + (size.length - 1) + ' < ' + size.length + ')');
                }
                _validate(array[i], size, dimNext);
            }
        }
        else {
            // last dimension. none of the childs may be an array
            for (i = 0; i < len; i++) {
                if (array[i] instanceof Array) {
                    throw new RangeError('Dimension mismatch ' +
                        '(' + (size.length + 1) + ' > ' + size.length + ')');
                }
            }
        }
    }

    /**
     * Recursively validate whether each array in a multi dimensional array
     * is empty (zero size) and has the correct number dimensions.
     * @param {Array} array    Array to be validated
     * @param {Number[]} size  Array with the size of each dimension
     * @param {Number} dim   Current dimension
     * @throws RangeError
     */
    function _validateEmpty(array, size, dim) {
        if (dim < size.length - 1) {
            var child = array[0];
            if (array.length != 1 || !(child instanceof Array)) {
                throw new RangeError('Dimension mismatch ' + '(' + array.length + ' > 0)');
            }

            _validateEmpty(child, size, dim + 1);
        }
        else {
            // last dimension. test if empty
            if (array.length) {
                throw new RangeError('Dimension mismatch ' + '(' + array.length + ' > 0)');
            }
        }
    }

    /**
     * Validate whether each element in a multi dimensional array has
     * a size corresponding to the provided size array.
     * @param {Array} array    Array to be validated
     * @param {Number[]} size  Array with the size of each dimension
     * @throws RangeError
     */
    util.validate = function validate(array, size) {
        var isScalar = (size.length == 0);
        if (isScalar) {
            // scalar
            if (array instanceof Array) {
                throw new RangeError('Dimension mismatch (' + array.length + ' != 0)');
            }
            return;
        }

        var hasZeros = (size.indexOf(0) != -1);
        if (hasZeros) {
            // array where all dimensions are zero
            size.forEach(function (value) {
                if (value != 0) {
                    throw new RangeError('Invalid size, all dimensions must be ' +
                        'either zero or non-zero (size: ' + util.formatArray(size) + ')');
                }
            });

            _validateEmpty(array, size, 0);
        }
        else {
            _validate(array, size, 0);
        }
    };

    /**
     * Recursively resize a multi dimensional array
     * @param {Array} array         Array to be resized
     * @param {Number[]} size       Array with the size of each dimension
     * @param {Number} dim          Current dimension
     * @param {*} [defaultValue]    Value to be filled in in new entries,
     *                              0 by default.
     * @private
     */
    function _resize (array, size, dim, defaultValue) {
        if (!(array instanceof Array)) {
            throw new TypeError('Array expected');
        }

        var len = array.length,
            newLen = size[dim];

        if (len != newLen) {
            if(newLen > array.length) {
                // enlarge
                for (var i = array.length; i < newLen; i++) {
                    array[i] = defaultValue ? clone(defaultValue) : 0;
                }
            }
            else {
                // shrink
                array.length = size[dim];
            }
            len = array.length;
        }

        if (dim < size.length - 1) {
            // recursively validate each child array
            var dimNext = dim + 1;
            for (i = 0; i < len; i++) {
                child = array[i];
                if (!(child instanceof Array)) {
                    child = [child];
                    array[i] = child;
                }
                _resize(child, size, dimNext, defaultValue);
            }
        }
        else {
            // last dimension
            for (i = 0; i < len; i++) {
                var child = array[i];
                while (child instanceof Array) {
                    child = child[0];
                }
                array[i] = child;
            }
        }
    }

    /**
     * Resize a multi dimensional array
     * @param {Array} array         Array to be resized
     * @param {Number[]} size       Array with the size of each dimension
     * @param {*} [defaultValue]    Value to be filled in in new entries,
     *                              0 by default
     */
    util.resize = function resize(array, size, defaultValue) {
        // TODO: what to do with scalars, when size=[] ?

        // check the type of size
        if (!(size instanceof Array)) {
            throw new TypeError('Size must be an array (size is ' + math.typeof(size) + ')');
        }

        // check whether size contains positive integers
        size.forEach(function (value) {
            if (!isNumber(value) || !isInteger(value) || value < 0) {
                throw new TypeError('Invalid size, must contain positive integers ' +
                    '(size: ' + util.formatArray(size) + ')');
            }
        });

        var hasZeros = (size.indexOf(0) != -1);
        if (hasZeros) {
            // array where all dimensions are zero
            size.forEach(function (value) {
                if (value != 0) {
                    throw new RangeError('Invalid size, all dimensions must be ' +
                        'either zero or non-zero (size: ' + util.formatArray(size) + ')');
                }
            });
        }

        // recursively resize
        _resize(array, size, 0, defaultValue);
    };


    // Internet Explorer 8 and older does not support Array.indexOf,
    // so we define it here in that case.
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

    // Internet Explorer 8 and older does not support Array.forEach,
    // so we define it here in that case.
    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(fn, scope) {
            for(var i = 0, len = this.length; i < len; ++i) {
                fn.call(scope || this, this[i], i, this);
            }
        }
    }

    // Internet Explorer 8 and older does not support Array.map,
    // so we define it here in that case.
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

    // Internet Explorer 8 and older does not support Array.every,
    // so we define it here in that case.
    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/every
    if (!Array.prototype.every) {
        Array.prototype.every = function(fun /*, thisp */) {
            "use strict";

            if (this == null) {
                throw new TypeError();
            }

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun != "function") {
                throw new TypeError();
            }

            var thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                if (i in t && !fun.call(thisp, t[i], i, t)) {
                    return false;
                }
            }

            return true;
        };
    }

    // Internet Explorer 8 and older does not support Array.some,
    // so we define it here in that case.
    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/some
    if (!Array.prototype.some) {
        Array.prototype.some = function(fun /*, thisp */) {
            "use strict";

            if (this == null) {
                throw new TypeError();
            }

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun != "function") {
                throw new TypeError();
            }

            var thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(thisp, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    return util;
})();

/**
 * Utility functions for Booleans
 */


/**
 * Test whether value is a Boolean
 * @param {*} value
 * @return {Boolean} isBoolean
 */
function isBoolean(value) {
    return (value instanceof Boolean) || (typeof value == 'boolean');
}

/**
 * @constructor Complex
 *
 * A complex value can be constructed in the following ways:
 *     var a = new Complex();
 *     var b = new Complex(re, im);
 *     var c = Complex.parse(str);
 *
 * Example usage:
 *     var a = new Complex(3, -4);      // 3 - 4i
 *     a.re = 5;                        // a = 5 - 4i
 *     var i = a.im;                    // -4;
 *     var b = Complex.parse('2 + 6i'); // 2 + 6i
 *     var c = new Complex();           // 0 + 0i
 *     var d = math.add(a, b);          // 5 + 2i
 *
 * @param {Number} re       The real part of the complex value
 * @param {Number} [im]     The imaginary part of the complex value
 */
function Complex(re, im) {
    if (this.constructor != Complex) {
        throw new SyntaxError(
            'Complex constructor must be called with the new operator');
    }

    if ((re != null && !isNumber(re)) || (im != null && !isNumber(im))) {
        throw new TypeError(
            'Two numbers or a single string expected in Complex constructor');
    }

    this.re = re || 0;
    this.im = im || 0;
}

math.type.Complex = Complex;

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
    var strRe = util.formatNumber(this.re);
    var strIm = util.formatNumber(this.im);

    if (this.im == 0) {
        // real value
        str = strRe;
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
            str = strIm + 'i';
        }
    }
    else {
        // complex value
        if (this.im > 0) {
            if (this.im == 1) {
                str = strRe + ' + i';
            }
            else {
                str = strRe + ' + ' + strIm + 'i';
            }
        }
        else {
            if (this.im == -1) {
                str = strRe + ' - i';
            }
            else {
                str = strRe + ' - ' + util.formatNumber(Math.abs(this.im)) + 'i';
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
 * A Matrix is a wrapper around an Array. A matrix can hold a multi dimensional
 * array. A matrix can be constructed as:
 *     var matrix = new Matrix(data)
 *
 * Matrix contains the functions to resize, get and set values, get the size,
 * clone the matrix and to convert the matrix to a vector, array, or scalar.
 * Furthermore, one can iterate over the matrix using map and forEach.
 * The internal Array of the Matrix can be accessed using the method valueOf.
 *
 * Example usage:
 *     var matrix = new Matrix([[1, 2], [3, 4]);
 *     matix.size();              // [2, 2]
 *     matrix.resize([3, 2], 5);
 *     matrix.valueOf();          // [[1, 2], [3, 4], [5, 5]]
 *     matrix.get([2,1])         // 3
 *
 * @param {Array | Matrix | Range} [data]    A multi dimensional array
 */
function Matrix(data) {
    if (this.constructor != Matrix) {
        throw new SyntaxError(
            'Matrix constructor must be called with the new operator');
    }

    if (data instanceof Matrix || data instanceof Range) {
        // clone data from a Matrix or Range
        this._data = data.toArray();
    }
    else if (data instanceof Array) {
        // use array as is
        this._data = data;
    }
    else if (data != null) {
        // unsupported type
        throw new TypeError('Unsupported type of data (' + math.typeof(data) + ')');
    }
    else {
        // nothing provided
        this._data = [];
    }

    // verify the size of the array
    this._size = util.size(this._data);
}

math.type.Matrix = Matrix;

/**
 * Get a value or a submatrix of the matrix.
 * @param {Array | Matrix} index    One-based index
 */
Matrix.prototype.get = function (index) {
    var isScalar;
    if (index instanceof Matrix) {
        isScalar = index.isVector();
        index = index.valueOf();
    }
    else if (index instanceof Array) {
        isScalar = !index.some(function (i) {
            return (i.forEach); // an Array or Range
        });
    }
    else {
        throw new TypeError('Unsupported type of index ' + math.typeof(index));
    }

    if (index.length != this._size.length) {
        throw new RangeError('Dimension mismatch ' +
            '(' + index.length + ' != ' + this._size.length + ')');
    }

    if (isScalar) {
        // return a single value
        switch (index.length) {
            case 1:     return _get(this._data, index[0]);
            case 2:     return _get(_get(this._data, index[0]), index[1]);
            default:    return _getScalar(this._data, index);
        }
    }
    else {
        // return a submatrix
        switch (index.length) {
            case 1: return new Matrix(_getSubmatrix1D(this._data, index));
            case 2: return new Matrix(_getSubmatrix2D(this._data, index));
            default: return new Matrix(_getSubmatrix(this._data, index, 0));
        }
        // TODO: more efficient when creating an empty matrix and setting _data and _size manually
    }
};

/**
 * Test whether index is an integer number with index >= 1 and index <= max
 * @param {*} index       One-based index
 * @param {Number} [max]  One-based maximum value
 * @private
 */
function _validateIndex(index, max) {
    if (!isNumber(index) || !isInteger(index)) {
        throw new TypeError('Index must be an integer (value: ' + index + ')');
    }
    if (index < 1) {
        throw new RangeError('Index out of range (' + index + ' < 1)');
    }
    if (max && index > max) {
        throw new RangeError('Index out of range (' + index + ' > ' + max +  ')');
    }
}

/**
 * Get a single value from an array. The method tests whether:
 * - index is a non-negative integer
 * - index does not exceed the dimensions of array
 * @param {Array} array
 * @param {Number} index   One-based index
 * @return {*} value
 * @private
 */
function _get (array, index) {
    _validateIndex(index, array.length);
    return array[index - 1]; // one-based index
}

/**
 * Get a single value from the matrix. The value will be a copy of the original
 * value in the matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Number[]} index   One-based index
 * @return {*} scalar
 * @private
 */
function _getScalar (data, index) {
    index.forEach(function (i) {
        data = _get(data, i);
    });
    return clone(data);
}

/**
 * Get a submatrix of a one dimensional matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Array} index         One-based index
 * @return {Array} submatrix
 * @private
 */
function _getSubmatrix1D (data, index) {
    var current = index[0];
    if (current.map) {
        // array or Range
        return current.map(function (i) {
            return _get(data, i);
        });
    }
    else {
        // scalar
        return [
            _get(data, current)
        ];
    }
}

/**
 * Get a submatrix of a 2 dimensional matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Array} index         One-based index
 * @return {Array} submatrix
 * @private
 */
function _getSubmatrix2D (data, index) {
    var rows = index[0];
    var cols = index[1];

    if (rows.map) {
        if (cols.map) {
            return rows.map(function (row) {
                var child = _get(data, row);
                return cols.map(function (col) {
                    return _get(child, col);
                });
            });
        }
        else {
            return rows.map(function (row) {
                return [
                    _get(_get(data, row), cols)
                ];
            });
        }
    }
    else {
        if (cols.map) {
            var child = _get(data, rows);
            return [
                cols.map(function (col) {
                    return _get(child, col);
                })
            ]
        }
        else {
            return [
                [
                    _get(_get(data, rows), cols)
                ]
            ];
        }
    }
}

/**
 * Get a submatrix of a multi dimensional matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Array} index         One-based index
 * @param {number} dim
 * @return {Array} submatrix
 * @private
 */
function _getSubmatrix (data, index, dim) {
    var last = (dim == index.length - 1);
    var current = index[dim];
    var recurse = function (i) {
        var child = _get(data, i);
        return last ? child : _getSubmatrix(child, index, dim + 1);
    };

    if (current.map) {
        // array or Range
        return current.map(recurse);
    }
    else {
        // scalar
        return [
            recurse(current)
        ];
    }
}

/**
 * Replace a value or a submatrix in the matrix.
 * Indexes are one-based.
 * @param {Array | Range | Matrix} index        One-based index
 * @param {*} submatrix
 * @return {Matrix} itself
 */
Matrix.prototype.set = function (index, submatrix) {
    var isScalar;
    if (index instanceof Matrix) {
        isScalar = index.isVector();
        index = index.valueOf();
    }
    else if (index instanceof Array) {
        isScalar = !index.some(function (i) {
            return (i.forEach); // an Array or Range
        });
    }
    else {
        throw new TypeError('Unsupported type of index ' + math.typeof(index));
    }

    if (submatrix instanceof Matrix || submatrix instanceof Range) {
        submatrix = submatrix.valueOf();
    }

    if (index.length < this._size.length) {
        throw new RangeError('Dimension mismatch ' +
            '(' + index.length + ' != ' + this._size.length + ')');
    }

    if (isScalar) {
        // set a scalar
        // check whether submatrix is no matrix/array
        if (math.size(submatrix).length != 0) {
            throw new TypeError('Scalar value expected');
        }

        switch (index.length) {
            case 1:  _setScalar1D(this._data, this._size, index, submatrix); break;
            case 2:  _setScalar2D(this._data, this._size, index, submatrix); break;
            default: _setScalar(this._data, this._size, index, submatrix); break;
        }
    }
    else {
        // set a submatrix
        var size = this._size.concat();
        _setSubmatrix (this._data, size, index, 0, submatrix);
        if (!util.deepEqual(this._size, size)) {
            _init(this._data);
            this.resize(size);
        }
    }

    return this;
};

/**
 * Replace a single value in an array. The method tests whether index is a
 * non-negative integer
 * @param {Array} array
 * @param {Number} index   One-based index
 * @param {*} value
 * @private
 */
function _set (array, index, value) {
    _validateIndex(index);
    if (value instanceof Array) {
        throw new TypeError('Dimension mismatch, value expected instead of array');
    }
    array[index - 1] = value; // one-based index
}

/**
 * Replace a single value in a multi dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Number[]} index  One-based index
 * @param {*} value
 * @private
 */
function _setScalar (data, size, index, value) {
    var resized = false;
    if (index.length > size.length) {
        // dimension added
        resized = true;
    }

    for (var i = 0; i < index.length; i++) {
        var index_i = index[i];
        _validateIndex(index_i);
        if ((size[i] == null) || (index_i > size[i])) {
            size[i] = index_i;
            resized = true;
        }
    }

    if (resized) {
        util.resize(data, size, 0);
    }

    var len = size.length;
    index.forEach(function (v, i) {
        if (i < len - 1) {
            data = data[v - 1]; // one-based index
        }
        else {
            data[v - 1] = value; // one-based index
        }
    });
}

/**
 * Replace a single value in a one dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Number[]} index      One-based index
 * @param {*} value
 * @private
 */
function _setScalar1D (data, size, index, value) {
    var row = index[0];
    _validateIndex(row);

    if (row > size[0]) {
        util.resize(data, [row], 0);
    }

    data[row - 1] = value; // one-based index
}

/**
 * Replace a single value in a two dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Number[]} index  One-based index
 * @param {*} value
 * @private
 */
function _setScalar2D (data, size, index, value) {
    var row = index[0];
    var col = index[1];
    _validateIndex(row);
    _validateIndex(col);

    var resized = false;
    if (row > (size[0] || 0)) {
        size[0] = row;
        resized = true;
    }
    if (col > (size[1] || 0)) {
        size[1] = col;
        resized = true;
    }
    if (resized) {
        util.resize(data, size, 0);
    }

    data[row - 1][col - 1] = value; // one-based index
}

/**
 * Replace a submatrix of a multi dimensional matrix.
 * @param {Array} data
 * @param {Array} size
 * @param {Array} index     One-based index
 * @param {number} dim
 * @param {Array} submatrix
 * @private
 */
function _setSubmatrix (data, size, index, dim, submatrix) {
    var last = (dim == index.length - 1);
    var current = index[dim];
    var recurse = function (v, i) {
        if (last) {
            _set(data, v, submatrix[i]);
            if (data.length > (size[dim] || 0)) {
                size[dim] = data.length;
            }
        }
        else {
            var child = data[v - 1]; // one-based index
            if (!(child instanceof Array)) {
                data[v - 1] = child = [child]; // one-based index
                if (data.length > (size[dim] || 0)) {
                    size[dim] = data.length;
                }
            }
            _setSubmatrix(child, size, index, dim + 1, submatrix[i]);
        }
    };

    if (current.map) {
        // array or Range
        var len = (current.size && current.size() || current.length);
        if (len != submatrix.length) {
            throw new RangeError('Dimensions mismatch ' +
                '(' + len + ' != '+ submatrix.length + ')');
        }
        current.map(recurse);
    }
    else {
        // scalar
        recurse(current, 0)
    }
}

/**
 * Recursively initialize all undefined values in the array with zeros
 * @param array
 * @private
 */
function _init(array) {
    for (var i = 0, len = array.length; i < len; i++) {
        var value = array[i];
        if (value instanceof Array) {
            _init(value);
        }
        else if (value == undefined) {
            array[i] = 0;
        }
    }
}

/**
 * Resize the matrix
 * @param {Number[]} size
 * @param {*} [defaultValue]        Default value, filled in on new entries.
 *                                  If not provided, the vector will be filled
 *                                  with zeros.
 */
Matrix.prototype.resize = function (size, defaultValue) {
    util.resize(this._data, size, defaultValue);
    this._size = clone(size);
};

/**
 * Create a clone of the matrix
 * @return {Matrix} clone
 */
Matrix.prototype.clone = function () {
    var matrix = new Matrix();
    matrix._data = clone(this._data);
    matrix._size = clone(this._size);
    return matrix;
};

/**
 * Retrieve the size of the matrix.
 * The size of the matrix will be validated too
 * @returns {Number[]} size
 */
Matrix.prototype.size = function () {
    return this._size;
};

/**
 * Create a new matrix with the results of the callback function executed on
 * each entry of the matrix.
 * @param {function} callback   The callback method is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 * @return {Matrix} matrix
 */
Matrix.prototype.map = function (callback) {
    var me = this;
    var matrix = new Matrix();
    var index = [];
    var recurse = function (value, dim) {
        if (value instanceof Array) {
            return value.map(function (child, i) {
                index[dim] = i + 1; // one-based index
                return recurse(child, dim + 1);
            });
        }
        else {
            return callback(value, index, me);
        }
    };
    matrix._data = recurse(this._data, 0);
    matrix._size = clone(this._size);

    return matrix;
};

/**
 * Execute a callback method on each entry of the matrix.
 * @param {function} callback   The callback method is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 */
Matrix.prototype.forEach = function (callback) {
    var me = this;
    var index = [];
    var recurse = function (value, dim) {
        if (value instanceof Array) {
            value.forEach(function (child, i) {
                index[dim] = i + 1; // one-based index
                recurse(child, dim + 1);
            });
        }
        else {
            callback(value, index, me);
        }
    };
    recurse(this._data, 0);
};

/**
 * Create a scalar with a copy of the data of the Matrix
 * Will return null if the matrix does not consist of a scalar value
 * @return {* | null} scalar
 */
Matrix.prototype.toScalar = function () {
    var scalar = this._data;
    while (scalar instanceof Array && scalar.length == 1) {
        scalar = scalar[0];
    }

    if (scalar instanceof Array) {
        return null;
    }
    else {
        return clone(scalar);
    }
};

/**
 * Test whether the matrix is a scalar.
 * @return {boolean} isScalar
 */
Matrix.prototype.isScalar = function () {
    return this._size.every(function (s) {
        return (s <= 1);
    });
};

/**
 * Create a vector with a copy of the data of the Matrix
 * Returns null if the Matrix does not contain a vector
 *
 * A matrix is a vector when it has 0 or 1 dimensions, or has multiple
 * dimensions where maximum one of the dimensions has a size larger than 1.
 * return {Array | null} vector
 */
Matrix.prototype.toVector = function () {
    var count = 0;
    var dim = undefined;
    var index = [];
    this._size.forEach(function (length, i) {
        if (length > 1) {
            count++;
            dim = i;
        }
        index[i] = 0;
    });

    if (count == 0) {
        // scalar or empty
        var scalar = this.toScalar();
        if (scalar) {
            return [scalar];
        }
        else {
            return [];
        }
    }
    else if (count == 1) {
        // valid vector
        var vector = [];
        var recurse = function (data) {
            if (data instanceof Array) {
                data.forEach(recurse);
            }
            else {
                vector.push(data);
            }
        };
        recurse(this._data);
        return vector;
    }
    else {
        // count > 1, this is no vector
        return null;
    }
};

/**
 * Test if the matrix contains a vector.
 * A matrix is a vector when it has 0 or 1 dimensions, or has multiple
 * dimensions where maximum one of the dimensions has a size larger than 1.
 * return {boolean} isVector
 */
Matrix.prototype.isVector = function () {
    var count = 0;
    this._size.forEach(function (length) {
        if (length > 1) {
            count++;
        }
    });
    return (count <= 1);
};

/**
 * Create an Array with a copy of the data of the Matrix
 * @returns {Array} array
 */
Matrix.prototype.toArray = function () {
    return clone(this._data);
};

/**
 * Get the primitive value of the Matrix: a multidimensional array
 * @returns {Array} array
 */
Matrix.prototype.valueOf = function () {
    return this._data;
};

/**
 * Get a string representation of the matrix
 * @returns {String} str
 */
Matrix.prototype.toString = function () {
    return util.formatArray(this._data);
};

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
 * @constructor Range
 * Create a range. A range works similar to an Array, with functions like
 * forEach and map. However, a Range object is very cheap to create compared to
 * a large Array with indexes, as it stores only a start, step and end value of
 * the range.
 *
 * A range can be constructed as:
 *     var a = new Range(start, step, end);
 *
 * To get the result of the range:
 *     range.forEach(function (x) {
 *         console.log(x);
 *     });
 *     range.map(function (x) {
 *         return math.sin(x);
 *     });
 *     range.toArray();
 *
 * Example usage:
 *     var c = new Range(2, 1, 5);      // 2:1:5
 *     c.toArray();                     // [2, 3, 4, 5]
 *     var d = new Range(2, -1, -2);    // 2:-1:-2
 *     d.toArray();                     // [2, 1, 0, -1, -2]
 *
 * @param {Number} start
 * @param {Number} step
 * @param {Number} end
 */
function Range(start, step, end) {
    if (this.constructor != Range) {
        throw new SyntaxError(
            'Range constructor must be called with the new operator');
    }

    if (start != null && !isNumber(start)) {
        throw new TypeError('Parameter start must be a number');
    }
    if (end != null && !isNumber(end)) {
        throw new TypeError('Parameter end must be a number');
    }
    if (step != null && !isNumber(step)) {
        throw new TypeError('Parameter step must be a number');
    }

    this.start = (start != null) ? start : 0;
    this.end   = (end != null) ? end : 0;
    this.step  = (step != null) ? step : 1;
}

math.type.Range = Range;

/**
 * Parse a string into a range,
 * The string contains the start, optional step, and end, separated by a colon.
 * If the string does not contain a valid range, null is returned.
 * For example str='0:2:10'.
 * @param {String} str
 * @return {Range | null} range
 */
Range.parse = function (str) {
    if (!isString(str)) {
        return null;
    }

    var args = str.split(':');
    var nums = args.map(function (arg) {
        return Number(arg);
    });

    var invalid = nums.some(function (num) {
        return isNaN(num);
    });
    if(invalid) {
        return null;
    }

    switch (nums.length) {
        case 2: return new Range(nums[0], 1, nums[1]);
        case 3: return new Range(nums[0], nums[1], nums[2]);
        default: return null;
    }
};

/**
 * Create a clone of the range
 * @return {Range} clone
 */
Range.prototype.clone = function () {
    return new Range(this.start, this.step, this.end);
};

/**
 * Retrieve the size of the range.
 * @returns {Number[]} size
 */
Range.prototype.size = function () {
    var len = 0,
        start = Number(this.start),
        step = Number(this.step),
        end = Number(this.end),
        diff = end - start;

    if (sign(step) == sign(diff)) {
        len = Math.floor((diff) / step) + 1;
    }
    else if (diff == 0) {
        len = 1;
    }

    if (isNaN(len)) {
        len = 0;
    }
    return [len];
};

/**
 * Execute a callback function for each value in the range.
 * @param {function} callback   The callback method is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 */
Range.prototype.forEach = function (callback) {
    var x = Number(this.start);
    var step = Number(this.step);
    var end = Number(this.end);
    var i = 0;

    if (step > 0) {
        while (x <= end) {
            callback(x, i, this);
            x += step;
            i++;
        }
    }
    else if (step < 0) {
        while (x >= end) {
            callback(x, i, this);
            x += step;
            i++;
        }
    }
};

/**
 * Execute a callback function for each value in the Range, and return the
 * results as an array
 * @param {function} callback   The callback method is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 * @returns {Array} array
 */
Range.prototype.map = function (callback) {
    var array = [];
    this.forEach(function (value, index, obj) {
        array[index] = callback(value, index, obj);
    });
    return array;
};

/**
 * Create a Matrix with a copy of the Ranges data
 * @return {Matrix} matrix
 */
Range.prototype.toMatrix = function () {
    return new Matrix(this.toArray());
};

/**
 * Create an Array with a copy of the Ranges data
 * @returns {Array} array
 */
Range.prototype.toArray = function () {
    var array = [];
    this.forEach(function (value, index) {
        array[index] = value;
    });
    return array;
};

/**
 * Create an array with a copy of the Ranges data.
 * This method is equal to Range.toArray, and is available for compatibility
 * with Matrix.
 * @return {Array} vector
 */
Range.prototype.toVector = Range.prototype.toArray;

/**
 * Test if the range contains a vector. For a range, this is always the case
 * return {boolean} isVector
 */
Range.prototype.isVector = function () {
    return true;
};

/**
 * Create a scalar with a copy of the data of the Range
 * Will return null if the range does not consist of a scalar value
 * @return {* | null} scalar
 */
Range.prototype.toScalar = function () {
    var array = this.toArray();
    if (array.length == 1) {
        return array[0];
    }
    else {
        return null;
    }
};

/**
 * Test whether the matrix is a scalar.
 * @return {boolean} isScalar
 */
Range.prototype.isScalar = function () {
    return (this.size()[0] == 1);
};

/**
 * Get the primitive value of the Range, a one dimensional array
 * @returns {Array} array
 */
Range.prototype.valueOf = function () {
    // TODO: implement a caching mechanism for range.valueOf()
    return this.toArray();
};

/**
 * Get the string representation of the range, for example '2:5' or '0:0.2:10'
 * @returns {String} str
 */
Range.prototype.toString = function () {
    var str = format(Number(this.start));
    if (this.step != 1) {
        str += ':' + format(Number(this.step));
    }
    str += ':' + format(Number(this.end));
    return str;
};
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
 *     var b = new Unit(null, unit);
 *     var c = Unit.parse(str);
 *
 * Example usage:
 *     var a = new Unit(5, 'cm');               // 50 mm
 *     var b = Unit.parse('23 kg');             // 23 kg
 *     var c = math.in(a, new Unit(null, 'm');  // 0.05 m
 *
 * @param {Number} [value]  A value like 5.2
 * @param {String} [unit]   A unit like "cm" or "inch"
 */
function Unit(value, unit) {
    if (this.constructor != Unit) {
        throw new Error('Unit constructor must be called with the new operator');
    }

    if (value != null && !isNumber(value)) {
        throw new Error('First parameter in Unit constructor must be a number');
    }
    if (unit != null && !isString(unit)) {
        throw new Error('Second parameter in Unit constructor must be a string');
    }

    this.value = 1;
    this.unit = Unit.UNIT_NONE;
    this.prefix = Unit.PREFIX_NONE;  // link to a list with supported prefixes

    this.hasUnit = false;
    this.hasValue = false;
    this.fixPrefix = false;  // is set true by the method "x In unit"s

    if (unit != null) {
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
    }

    if (value != null) {
        this.value = this._normalize(value);
        this.hasValue = true;
    }
    else {
        this.value = this._normalize(1);
    }
}

math.type.Unit = Unit;

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
        return util.formatNumber(value) + ' ' + bestPrefix.name + this.unit.name;
    }
    else {
        value = this._unnormalize(this.value);
        return util.formatNumber(value) + ' ' + this.prefix.name + this.unit.name;
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} y
 * @return {Number | Complex | Unit | String | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
        y instanceof Array || y instanceof Matrix || y instanceof Range) {
        return util.map2(x, y, add);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return add(x.valueOf(), y.valueOf());
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param  {Number | Complex | Unit | Array | Matrix | Range} x
 * @param  {Number | Complex} y
 * @return {Number | Complex | Unit | Array | Matrix} res
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
            return _divideComplex(new Complex(x, 0), y);
        }
    }

    if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex / number
            return _divideComplex(x, new Complex(y, 0));
        }
        else if (y instanceof Complex) {
            // complex / complex
            return _divideComplex(x, y);
        }
    }

    if (x instanceof Unit) {
        if (isNumber(y)) {
            var res = x.clone();
            res.value /= y;
            return res;
        }
    }

    if (x instanceof Array || x instanceof Matrix) {
        if (y instanceof Array || y instanceof Matrix) {
            // TODO: implement matrix right division using pseudo inverse
            // http://www.mathworks.nl/help/matlab/ref/mrdivide.html
            // http://www.gnu.org/software/octave/doc/interpreter/Arithmetic-Ops.html
            // http://stackoverflow.com/questions/12263932/how-does-gnu-octave-matrix-division-work-getting-unexpected-behaviour
            return math.multiply(x, math.inv(y));
        }
        else {
            // matrix / scalar
            return util.map2(x, y, divide);
        }
    }

    if (y instanceof Array || y instanceof Matrix) {
        // TODO: implement matrix right division using pseudo inverse
        return math.multiply(x, math.inv(y));
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
function _divideComplex (x, y) {
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
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} y
 * @return {Boolean | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
        y instanceof Array || y instanceof Matrix || y instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
function fix(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('fix', arguments.length, 1);
    }

    if (isNumber(x)) {
        return (x > 0) ? Math.floor(x) : Math.ceil(x);
    }

    if (x instanceof Complex) {
        return new Complex(
            (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
            (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
        );
    }

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} y
 * @return {Boolean | Array | Matrix | Range} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
        y instanceof Array || y instanceof Matrix || y instanceof Range) {
        return util.map2(x, y, larger);
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
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} y
 * @return {Boolean | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
        y instanceof Array || y instanceof Matrix || y instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @param {Number | Complex} [base]
 * @return {Number | Complex | Array | Matrix} res
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

        if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param  {Number | Complex | Array | Matrix | Range} x
 * @param  {Number | Complex | Array | Matrix | Range} y
 * @return {Number | Array | Matrix} res
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


    if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
        y instanceof Array || y instanceof Matrix || y instanceof Range) {
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
 * @param  {Number | Complex | Unit | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | Array | Matrix | Range} y
 * @return {Number | Complex | Unit | Array | Matrix} res
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
            return _multiplyComplex (new Complex(x, 0), y);
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
            return _multiplyComplex (x, new Complex(y, 0));
        }
        else if (y instanceof Complex) {
            // complex * complex
            return _multiplyComplex (x, y);
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
            var sizeX = util.size(x);
            var sizeY = util.size(y);

            if (sizeX.length != 2) {
                throw new Error('Can only multiply a 2 dimensional matrix ' +
                        '(A has ' + sizeX.length + ' dimensions)');
            }
            if (sizeY.length != 2) {
                throw new Error('Can only multiply a 2 dimensional matrix ' +
                        '(B has ' + sizeY.length + ' dimensions)');
            }
            if (sizeX[1] != sizeY[0]) {
                throw new RangeError('Dimensions mismatch in multiplication. ' +
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
        else if (y instanceof Matrix) {
            return new Matrix(multiply(x.valueOf(), y.valueOf()));
        }
        else {
            // matrix * scalar
            return util.map2(x, y, multiply);
        }
    }
    else if (x instanceof Matrix) {
        return new Matrix(multiply(x.valueOf(), y.valueOf()));
    }

    if (y instanceof Array) {
        // scalar * matrix
        return util.map2(x, y, multiply);
    }
    else if (y instanceof Matrix) {
        return new Matrix(multiply(x.valueOf(), y.valueOf()));
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
function _multiplyComplex (x, y) {
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
 * @param  {Number | Complex | Array | Matrix | Range} x
 * @param  {Number | Complex} y
 * @return {Number | Complex | Array | Matrix} res
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
        var s = util.size(x);
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
            return identity(s[0]);
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
    else if (x instanceof Matrix) {
        return new Matrix(pow(x.valueOf(), y));
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

/**
 * Compute the sign of a value.
 * The sign of a value x is 1 when x>1, -1 when x<0, and 0 when x=0.
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} y
 * @return {Boolean | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
        y instanceof Array || y instanceof Matrix || y instanceof Range) {
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
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} y
 * @return {Boolean | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
        y instanceof Array || y instanceof Matrix || y instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param  {Number | Complex | Unit | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | Array | Matrix | Range} y
 * @return {Number | Complex | Unit | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
        y instanceof Array || y instanceof Matrix || y instanceof Range) {
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
 * @param  {Number | Complex | Unit | Array | Matrix | Range} x
 * @return {Number | Complex | Unit | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} y
 * @return {Boolean | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
        y instanceof Array || y instanceof Matrix || y instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Array | Matrix} im
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Array | Matrix} re
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * Create a complex value. Depending on the passed arguments, the function
 * will create and return a new math.type.Complex object.
 *
 * The method accepts the following arguments:
 *     complex()                           creates a complex value with zero
 *                                         as real and imaginary part.
 *     complex(re : number, im : string)   creates a complex value with provided
 *                                         values for real and imaginary part.
 *     complex(str : string)               parses a string into a complex value.
 *
 * Example usage:
 *     var a = math.complex(3, -4);     // 3 - 4i
 *     a.re = 5;                        // a = 5 - 4i
 *     var i = a.im;                    // -4;
 *     var b = math.complex('2 + 6i');  // 2 + 6i
 *     var c = math.complex();          // 0 + 0i
 *     var d = math.add(a, b);          // 5 + 2i
 *
 * @param {*} [args]
 * @return {Complex} value
 */
function complex(args) {
    switch (arguments.length) {
        case 0:
            // no parameters. Set re and im zero
            return new Complex(0, 0);
            break;

        case 1:
            // parse string into a complex number
            var str = arguments[0];
            if (!isString(str)) {
                throw new TypeError(
                    'Two numbers or a single string expected in function complex');
            }
            var c = Complex.parse(str);
            if (c) {
                return c;
            }
            else {
                throw new SyntaxError('String "' + str + '" is no valid complex number');
            }
            break;

        case 2:
            // re and im provided
            return new Complex(arguments[0], arguments[1]);
            break;

        default:
            throw newArgumentsError('complex', arguments.length, 0, 2);
    }
}

math.complex = complex;

/**
 * Create a matrix. The function creates a new math.type.Matrix object.
 *
 * The method accepts the following arguments:
 *     matrix()       creates an empty matrix
 *     matrix(data)   creates a matrix with initial data.
 *
 * Example usage:
 * Example usage:
 *     var m = matrix([[1, 2], [3, 4]);
 *     m.size();                        // [2, 2]
 *     m.resize([3, 2], 5);
 *     m.valueOf();                     // [[1, 2], [3, 4], [5, 5]]
 *     m.get([1, 0])                    // 3
 *
 * @param {Array | Matrix | Range} [data]    A multi dimensional array
 * @return {Matrix} matrix
 */
function matrix(data) {
    if (arguments.length > 1) {
        throw newArgumentsError('matrix', arguments.length, 0, 1);
    }

    return new Matrix(data);
}

math.matrix = matrix;

/**
 * Create a parser. The function creates a new math.expr.Parser object.
 *
 * Example usage:
 *    var parser = new math.parser();
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
 *
 * @return {math.expr.Parser} Parser
 */
function parser() {
    return new math.expr.Parser();
}

math.parser = parser;

/**
 * Create a range. The function creates a new math.type.Range object.
 *
 * A range works similar to an Array, with functions like
 * forEach and map. However, a Range object is very cheap to create compared to
 * a large Array with indexes, as it stores only a start, step and end value of
 * the range.
 *
 * The method accepts the following arguments
 *     range(str)                   Create a range from a string, where the
 *                                  string contains the start, optional step,
 *                                  and end, separated by a colon.
 *     range(start, end)            Create a range with start and end and a
 *                                  default step size of 1
 *     range(start, step, end)      Create a range with start, step, and end.
 *
 * Example usage:
 *     var c = math.range(2, 1, 5);     // 2:1:5
 *     c.toArray();                     // [2, 3, 4, 5]
 *     var d = math.range(2, -1, -2);   // 2:-1:-2
 *     d.forEach(function (value, index) {
 *         console.log(index, value);
 *     });
 *     var e = math.range('2:1:5');     // 2:1:5
 *
 * @param {...*} args
 * @return {Range} range
 */
function range(args) {
    switch (arguments.length) {
        case 1:
            // parse string into a range
            if (!isString(args)) {
                throw new TypeError(
                    'Two or three numbers or a single string expected in function range');
            }
            var r = Range.parse(args);
            if (r) {
                return r;
            }
            else {
                throw new SyntaxError('String "' + r + '" is no valid range');
            }
            break;

        case 2:
            // range(start, end)
            return new Range(arguments[0], null, arguments[1]);
            break;

        case 3:
            // range(start, step, end)
            return new Range(arguments[0], arguments[1], arguments[2]);
            break;

        default:
            throw newArgumentsError('range', arguments.length, 2, 3);
    }
}

math.range = range;

/**
 * Create a unit. Depending on the passed arguments, the function
 * will create and return a new math.type.Unit object.
 *
 * The method accepts the following arguments:
 *     unit(unit : string)
 *     unit(value : number, unit : string
 *
 * Example usage:
 *     var a = math.unit(5, 'cm');          // 50 mm
 *     var b = math.unit('23 kg');          // 23 kg
 *     var c = math.in(a, math.unit('m');   // 0.05 m
 *
 * @param {*} args
 * @return {Unit} value
 */
function unit(args) {
    switch(arguments.length) {
        case 1:
            // parse a string
            var str = arguments[0];
            if (!isString(str)) {
                throw new TypeError('A string or a number and string expected in function unit');
            }

            if (Unit.isUnit(str)) {
                return new Unit(null, str); // a pure unit
            }

            var u = Unit.parse(str);        // a unit with value, like '5cm'
            if (u) {
                return u;
            }

            throw new SyntaxError('String "' + str + '" is no valid unit');
            break;

        case 2:
            // a number and a unit
            return new Unit(arguments[0], arguments[1]);
            break;

        default:
            throw newArgumentsError('unit', arguments.length, 1, 2);
    }
}

math.unit = unit;

/**
 * Create a workspace. The function creates a new math.expr.Workspace object.
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
 *     var workspace = new math.workspace();
 *     var id0 = workspace.append('a = 3/4');
 *     var id1 = workspace.append('a + 2');
 *     console.log('a + 2 = ' + workspace.getResult(id1));
 *     workspace.replace('a=5/2', id0);
 *     console.log('a + 2 = ' + workspace.getResult(id1));
 *
 * @return {math.expr.Workspace} Workspace
 */
function workspace() {
    return new math.expr.Workspace();
}

math.workspace = workspace;

/**
 * @constructor det
 * Calculate the determinant of a matrix, det(x)
 * @param {Array | Matrix} x
 * @return {Number} determinant
 */
function det (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('det', arguments.length, 1);
    }

    var size = math.size(x);
    switch (size.length) {
        case 0:
            // scalar
            return math.clone(x);
            break;

        case 1:
            // vector
            if (size[0] == 1) {
                return math.clone(x.valueOf()[0]);
            }
            else {
                throw new RangeError('Matrix must be square ' +
                    '(size: ' + math.format(size) + ')');
            }
            break;

        case 2:
            // two dimensional array
            var rows = size[0];
            var cols = size[1];
            if (rows == cols) {
                return _det(x.valueOf(), rows, cols);
            }
            else {
                throw new RangeError('Matrix must be square ' +
                    '(size: ' + math.format(size) + ')');
            }
            break;

        default:
            // multi dimensional array
            throw new RangeError('Matrix must be two dimensional ' +
                '(size: ' + math.format(size) + ')');
    }
}

math.det = det;

/**
 * Calculate the determinant of a matrix
 * @param {Array[]} matrix  A square, two dimensional matrix
 * @param {Number} rows     Number of rows of the matrix (zero-based)
 * @param {Number} cols     Number of columns of the matrix (zero-based)
 * @returns {Number} det
 * @private
 */
function _det (matrix, rows, cols) {
    var multiply = math.multiply,
        subtract = math.subtract;

    // this is a square matrix
    if (rows == 1) {
        // this is a 1 x 1 matrix
        return matrix[0][0];
    }
    else if (rows == 2) {
        // this is a 2 x 2 matrix
        // the determinant of [a11,a12;a21,a22] is det = a11*a22-a21*a12
        return subtract(
            multiply(matrix[0][0], matrix[1][1]),
            multiply(matrix[1][0], matrix[0][1])
        );
    }
    else {
        // this is a matrix of 3 x 3 or larger
        var d = 0;
        for (var c = 0; c < cols; c++) {
            var minor = _minor(matrix, rows, cols, 0, c);
            //d += Math.pow(-1, 1 + c) * a(1, c) * _det(minor);
            d += multiply(
                multiply((c + 1) % 2 + (c + 1) % 2 - 1, matrix[0][c]),
                _det(minor, rows - 1, cols - 1)
            ); // faster than with pow()
        }
        return d;
    }
}

/**
 * Extract a minor from a matrix
 * @param {Array[]} matrix  A square, two dimensional matrix
 * @param {Number} rows     Number of rows of the matrix (zero-based)
 * @param {Number} cols     Number of columns of the matrix (zero-based)
 * @param {Number} row      Row number to be removed (zero-based)
 * @param {Number} col      Column number to be removed (zero-based)
 * @private
 */
function _minor(matrix, rows, cols, row, col) {
    var minor = [],
        minorRow;

    for (var r = 0; r < rows; r++) {
        if (r != row) {
            minorRow = minor[r - (r > row)] = [];
            for (var c = 0; c < cols; c++) {
                if (c != col) {
                    minorRow[c - (c > col)] = matrix[r][c];
                }
            }
        }
    }

    return minor;
}

/**
 * Function documentation
 */
det.doc = {
    'name': 'det',
    'category': 'Numerics',
    'syntax': [
        'det(x)'
    ],
    'description': 'Calculate the determinant of a matrix',
    'examples': [
        'det([1, 2; 3, 4])',
        'det([-2, 2, 3; -1, 1, 3; 2, 0, -1])'
    ],
    'seealso': [
        'diag', 'eye', 'inv', 'range', 'size', 'squeeze', 'transpose', 'zeros'
    ]
};
/**
 * Create a diagonal matrix or retrieve the diagonal of a matrix
 * diag(v)
 * diag(v, k)
 * diag(X)
 * diag(X, k)
 * @param {Number | Matrix | Array} x
 * @param {Number} [k]
 * @return {Matrix} matrix
 */
function diag (x, k) {
    var data, vector, i, iMax;

    if (arguments.length != 1 && arguments.length != 2) {
        throw newArgumentsError('diag', arguments.length, 1, 2);
    }

    if (k) {
        if (!isNumber(k) || !isInteger(k)) {
            throw new TypeError ('Second parameter in function diag must be an integer');
        }
    }
    else {
        k = 0;
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;

    // convert to matrix
    if (!(x instanceof Matrix) && !(x instanceof Range)) {
        x = new Matrix(x);
    }

    // get as array when the matrix is a vector
    var s;
    if (x.isVector()) {
        x = x.toVector();
        s = [x.length];
    }
    else {
        s = x.size();
    }

    switch (s.length) {
        case 1:
            // x is a vector. create diagonal matrix
            vector = x.valueOf();
            var matrix = new Matrix();
            matrix.resize([vector.length + kSub, vector.length + kSuper]);
            data = matrix.valueOf();
            iMax = vector.length;
            for (i = 0; i < iMax; i++) {
                data[i + kSub][i + kSuper] = clone(vector[i]);
            }
            return matrix;
        break;

        case 2:
            // x is a matrix get diagonal from matrix
            vector = [];
            data = x.valueOf();
            iMax = Math.min(s[0] - kSub, s[1] - kSuper);
            for (i = 0; i < iMax; i++) {
                vector[i] = clone(data[i + kSub][i + kSuper]);
            }
            return new Matrix(vector);
        break;

        default:
            throw new RangeError('Matrix for function diag must be 2 dimensional');
    }
}

math.diag = diag;

/**
 * Function documentation
 */
diag.doc = {
    'name': 'diag',
    'category': 'Matrix',
    'syntax': [
        'diag(x)',
        'diag(x, k)'
    ],
    'description': 'Create a diagonal matrix or retrieve the diagonal ' +
        'of a matrix. When x is a vector, a matrix with the vector values ' +
        'on the diagonal will be returned. When x is a matrix, ' +
        'a vector with the diagonal values of the matrix is returned.' +
        'When k is provided, the k-th diagonal will be ' +
        'filled in or retrieved, if k is positive, the values are placed ' +
        'on the super diagonal. When k is negative, the values are placed ' +
        'on the sub diagonal.',
    'examples': [
        'diag(1:4)',
        'diag(1:4, 1)',
        'a = [1, 2, 3; 4, 5, 6; 7, 8, 9]',
        'diag(a)'
    ],
    'seealso': [
        'det', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'transpose', 'zeros'
    ]
};
/**
 * Create an identity matrix with size m x n, eye(m [, n])
 * @param {...Number | Matrix | Array} size
 * @return {Matrix} matrix
 */
function eye (size) {
    var args = util.argsToArray(arguments);
    if (args.length == 0) {
        args = [1, 1];
    }
    else if (args.length == 1) {
        args[1] = args[0];
    }
    else if (args.length > 2) {
        throw newArgumentsError('eye', num, 0, 2);
    }

    var rows = args[0],
        cols = args[1];

    if (!isNumber(rows) || !isInteger(rows) || rows < 1) {
        throw new Error('Parameters in function eye must be positive integers');
    }
    if (cols) {
        if (!isNumber(cols) || !isInteger(cols) || cols < 1) {
            throw new Error('Parameters in function eye must be positive integers');
        }
    }

    // create and args the matrix
    var matrix = new Matrix();
    matrix.resize(args);

    // fill in ones on the diagonal
    var min = math.min(args);
    var data = matrix.valueOf();
    for (var d = 0; d < min; d++) {
        data[d][d] = 1;
    }

    return matrix;
}

math.eye = eye;

/**
 * Function documentation
 */
eye.doc = {
    'name': 'eye',
    'category': 'Numerics',
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
        'det', 'diag', 'inv', 'ones', 'range', 'size', 'squeeze', 'transpose', 'zeros'
    ]
};
/**
 * @constructor inv
 * Calculate the inverse of a matrix, inv(x)
 * @param {Array | Matrix} x
 * @return {Array | Matrix} inv
 */
function inv (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('inv', arguments.length, 1);
    }

    var size = math.size(x);
    switch (size.length) {
        case 0:
            // scalar
            return math.divide(1, x);
            break;

        case 1:
            // vector
            if (size[0] == 1) {
                if (x instanceof Matrix) {
                    return new Matrix([
                        math.divide(1, x.valueOf()[0])
                    ]);
                }
                else {
                    return [
                        math.divide(1, x[0])
                    ];
                }
            }
            else {
                throw new RangeError('Matrix must be square ' +
                    '(size: ' + math.format(size) + ')');
            }
            break;

        case 2:
            // two dimensional array
            var rows = size[0];
            var cols = size[1];
            if (rows == cols) {
                if (x instanceof Matrix) {
                    return new Matrix(
                        _inv(x.valueOf(), rows, cols)
                    );
                }
                else {
                    // return an Array
                    return _inv(x, rows, cols);
                }
            }
            else {
                throw new RangeError('Matrix must be square ' +
                    '(size: ' + math.format(size) + ')');
            }
            break;

        default:
            // multi dimensional array
            throw new RangeError('Matrix must be two dimensional ' +
                '(size: ' + math.format(size) + ')');
    }
}

math.inv = inv;

/**
 * Calculate the inverse of a square matrix
 * @param {Array[]} matrix  A square matrix
 * @param {Number} rows     Number of rows
 * @param {Number} cols     Number of columns, must equal rows
 * @return {Array[]} inv    Inverse matrix
 * @private
 */
function _inv (matrix, rows, cols){
    var r, s, f, value, temp,
        add = math.add,
        unaryminus = math.unaryminus,
        multiply = math.multiply,
        divide = math.divide;

    if (rows == 1) {
        // this is a 1 x 1 matrix
        value = matrix[0][0];
        if (value == 0) {
            throw Error('Cannot calculate inverse, determinant is zero');
        }
        return [[
            math.divide(1, value)
        ]];
    }
    else if (rows == 2) {
        // this is a 2 x 2 matrix
        var det = math.det(matrix);
        if (det == 0) {
            throw Error('Cannot calculate inverse, determinant is zero');
        }
        return [
            [
                divide(matrix[1][1], det),
                divide(unaryminus(matrix[0][1]), det)
            ],
            [
                divide(unaryminus(matrix[1][0]), det),
                divide(matrix[0][0], det)
            ]
        ];
    }
    else {
        // this is a matrix of 3 x 3 or larger
        // calculate inverse using gauss-jordan elimination
        //      http://en.wikipedia.org/wiki/Gaussian_elimination
        //      http://mathworld.wolfram.com/MatrixInverse.html
        //      http://math.uww.edu/~mcfarlat/inverse.htm

        // make a copy of the matrix (only the arrays, not of the elements)
        var A = matrix.concat();
        for (r = 0; r < rows; r++) {
            A[r] = A[r].concat();
        }

        // create an identity matrix which in the end will contain the
        // matrix inverse
        var B = math.eye(rows).valueOf();

        // loop over all columns, and perform row reductions
        for (var c = 0; c < cols; c++) {
            // element Acc should be non zero. if not, swap content
            // with one of the lower rows
            r = c;
            while (r < rows && A[r][c] == 0) {
                r++;
            }
            if (r == rows || A[r][c] == 0) {
                throw Error('Cannot calculate inverse, determinant is zero');
            }
            if (r != c) {
                temp = A[c]; A[c] = A[r]; A[r] = temp;
                temp = B[c]; B[c] = B[r]; B[r] = temp;
            }

            // eliminate non-zero values on the other rows at column c
            var Ac = A[c],
                Bc = B[c];
            for (r = 0; r < rows; r++) {
                var Ar = A[r],
                    Br = B[r];
                if(r != c) {
                    // eliminate value at column c and row r
                    if (Ar[c] != 0) {
                        f = divide(unaryminus(Ar[c]), Ac[c]);

                        // add (f * row c) to row r to eliminate the value
                        // at column c
                        for (s = c; s < cols; s++) {
                            Ar[s] = add(Ar[s], multiply(f, Ac[s]));
                        }
                        for (s = 0; s < cols; s++) {
                            Br[s] = add(Br[s], multiply(f, Bc[s]));
                        }
                    }
                }
                else {
                    // normalize value at Acc to 1,
                    // divide each value on row r with the value at Acc
                    f = Ac[c];
                    for (s = c; s < cols; s++) {
                        Ar[s] = divide(Ar[s], f);
                    }
                    for (s = 0; s < cols; s++) {
                        Br[s] = divide(Br[s], f);
                    }
                }
            }
        }
        return B;
    }
}

/**
 * Function documentation
 */
inv.doc = {
    'name': 'inv',
    'category': 'Numerics',
    'syntax': [
        'inv(x)'
    ],
    'description': 'Calculate the inverse of a matrix',
    'examples': [
        'inv([1, 2; 3, 4])',
        'inv(4)',
        '1 / 4'
    ],
    'seealso': [
        'det', 'diag', 'eye', 'ones', 'range', 'size', 'squeeze', 'transpose', 'zeros'
    ]
};
/**
 * @constructor ones
 * ones(n)
 * ones(m, n)
 * ones([m, n])
 * ones([m, n, p, ...])
 * returns a matrix filled with ones
 * @param {...Number | Array} size
 * @return {Matrix} matrix
 */
function ones (size) {
    var args = util.argsToArray(arguments);

    if (args.length == 0) {
        args = [1, 1];
    }
    else if (args.length == 1) {
        args[1] = args[0];
    }

    // create and size the matrix
    var matrix = new Matrix();
    var defaultValue = 1;
    matrix.resize(args, defaultValue);
    return matrix;
}

math.ones = ones;

/**
 * Function documentation
 */
ones.doc = {
    'name': 'ones',
    'category': 'Numerics',
    'syntax': [
        'ones(n)',
        'ones(m, n)',
        'ones(m, n, p, ...)',
        'ones([m, n])',
        'ones([m, n, p, ...])',
        'ones'
    ],
    'description': 'Create a matrix containing ones.',
    'examples': [
        'ones(3)',
        'ones(3, 5)',
        'ones([2,3]) * 4.5',
        'a = [1, 2, 3; 4, 5, 6]',
        'ones(size(a))'
    ],
    'seealso': [
        'det', 'diag', 'eye', 'inv', 'range', 'size', 'squeeze', 'transpose', 'zeros'
    ]
};
/**
 * Calculate the size of a matrix. size(x)
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
        return util.size(x);
    }

    if (x instanceof Matrix || x instanceof Range) {
        return x.size();
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
    'category': 'Numerics',
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
        'det', 'diag', 'eye', 'inv', 'ones', 'range', 'squeeze', 'transpose', 'zeros'
    ]
};
/**
 * Remove singleton dimensions from a matrix. squeeze(x)
 * @param {Matrix | Array} x
 * @return {Matrix | Array} res
 */
function squeeze (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('squeeze', arguments.length, 1);
    }

    if (x instanceof Matrix || x instanceof Range) {
        return _squeezeArray(x.toArray());
    }
    else if (x instanceof Array) {
        return _squeezeArray(clone(x));
    }
    else {
        // scalar
        return clone(x);
    }
}

math.squeeze = squeeze;

/**
 * Recursively squeeze a multi dimensional array
 * @param {Array} array
 * @return {Array} array
 * @private
 */
function _squeezeArray(array) {
    if (array.length == 1) {
        // squeeze this array
        return _squeezeArray(array[0]);
    }
    else {
        // process all childs
        for (var i = 0, len = array.length; i < len; i++) {
            var child = array[i];
            if (child instanceof Array) {
                array[i] = _squeezeArray(child);
            }
        }
        return array;
    }
}

/**
 * Function documentation
 */
squeeze.doc = {
    'name': 'squeeze',
    'category': 'Numerics',
    'syntax': [
        'squeeze(x)'
    ],
    'description': 'Remove singleton dimensions from a matrix.',
    'examples': [
        'a = zeros(1,3,2)',
        'size(squeeze(a))',
        'b = zeros(3,1,1)',
        'size(squeeze(b))'
    ],
    'seealso': [
        'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'transpose', 'zeros'
    ]
};
/**
 * @constructor transpose
 * Calculate the determinant of a matrix, transpose(x)
 * @param {Array | Matrix} x
 * @return {Array | Matrix} transpose
 */
function transpose (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('transpose', arguments.length, 1);
    }

    var size = math.size(x);
    switch (size.length) {
        case 0:
            // scalar
            return math.clone(x);
            break;

        case 1:
            // vector
            // TODO: is it logic to return a 1 dimensional vector itself as transpose?
            return math.clone(x);
            break;

        case 2:
            // two dimensional array
            var rows = size[1],  // index 1 is no error
                cols = size[0],  // index 0 is no error
                array = x.valueOf(),
                transposed = [],
                transposedRow,
                clone = math.clone;
            for (var r = 0; r < rows; r++) {
                transposedRow = transposed[r] = [];
                for (var c = 0; c < cols; c++) {
                    transposedRow[c] = clone(array[c][r]);
                }
            }
            if (cols == 0) {
                transposed[0] = [];
            }
            return transposed;
            break;

        default:
            // multi dimensional array
            throw new RangeError('Matrix must be two dimensional ' +
                '(size: ' + math.format(size) + ')');
    }
}

math.transpose = transpose;

/**
 * Function documentation
 */
transpose.doc = {
    'name': 'transpose',
    'category': 'Numerics',
    'syntax': [
        'transpose(x)'
    ],
    'description': 'Transpose a matrix',
    'examples': [
        'a = [1, 2, 3; 4, 5, 6]',
        'transpose(a)'
    ],
    'seealso': [
        'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'zeros'
    ]
};
/**
 * @constructor zeros
 * zeros(n)
 * zeros(m, n)
 * zeros([m, n])
 * zeros([m, n, p, ...])
 * returns a matrix filled with zeros
 * @param {...Number | Array} size
 * @return {Matrix} matrix
 */
function zeros (size) {
    var args = util.argsToArray(arguments);

    if (args.length == 0) {
        args = [1, 1];
    }
    else if (args.length == 1) {
        args[1] = args[0];
    }

    // create and size the matrix
    var matrix = new Matrix();
    matrix.resize(args);
    return matrix;
}

math.zeros = zeros;

/**
 * Function documentation
 */
zeros.doc = {
    'name': 'zeros',
    'category': 'Numerics',
    'syntax': [
        'zeros(n)',
        'zeros(m, n)',
        'zeros(m, n, p, ...)',
        'zeros([m, n])',
        'zeros([m, n, p, ...])',
        'zeros'
    ],
    'description': 'Create a matrix containing zeros.',
    'examples': [
        'zeros(3)',
        'zeros(3, 5)',
        'a = [1, 2, 3; 4, 5, 6]',
        'zeros(size(a))'
    ],
    'seealso': [
        'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'transpose'
    ]
};
/**
 * Compute the factorial of a value, factorial(x) or x!
 * @Param {Number | Array | Matrix | Range} x
 * @return {Number | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
        throw new Error('Function max requires one or more parameters (0 provided)');
    }

    if (args instanceof Array || args instanceof Matrix || args instanceof Range) {
        // max([a, b, c, d, ...]])
        if (arguments.length > 1) {
            throw Error('Wrong number of parameters (1 matrix or multiple scalars expected)');
        }

        var size = math.size(args);

        if (size.length == 1) {
            // vector
            if (args.length == 0) {
                throw new Error('Cannot calculate max of an empty vector');
            }

            return _max(args.valueOf());
        }
        else if (size.length == 2) {
            // 2 dimensional matrix
            if (size[0] == 0 || size[1] == 0) {
                throw new Error('Cannot calculate max of an empty matrix');
            }
            if (args instanceof Array) {
                return _max2(args, size[0], size[1]);
            }
            else if (args instanceof Matrix || args instanceof Range) {
                return new Matrix(_max2(args.valueOf(), size[0], size[1]));
            }
            else {
                throw newUnsupportedTypeError('max', args);
            }
        }
        else {
            // TODO: implement max for n-dimensional matrices
            throw new RangeError('Cannot calculate max for multi dimensional matrix');
        }
    }
    else {
        // max(a, b, c, d, ...)
        return _max(arguments);
    }
}

math.max = max;

/**
 * Calculate the max of a one dimensional array
 * @param {Array} array
 * @return {Number} max
 * @private
 */
function _max(array) {
    var larger = math.larger;
    var res = array[0];
    for (var i = 1, iMax = array.length; i < iMax; i++) {
        var value = array[i];
        if (larger(value, res)) {
            res = value;
        }
    }
    return res;
}

/**
 * Calculate the max of a two dimensional array
 * @param {Array} array
 * @param {Number} rows
 * @param {Number} cols
 * @return {Number[]} max
 * @private
 */
function _max2(array, rows, cols) {
    var larger = math.larger;
    var res = [];
    for (var c = 0; c < cols; c++) {
        var max = array[0][c];
        for (var r = 1; r < rows; r++) {
            var value = array[r][c];
            if (larger(value, max)) {
                max = value;
            }
        }
        res[c] = max;
    }
    return res;
}

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
        throw new Error('Function min requires one or more parameters (0 provided)');
    }

    if (args instanceof Array || args instanceof Matrix || args instanceof Range) {
        // min([a, b, c, d, ...]])
        if (arguments.length > 1) {
            throw Error('Wrong number of parameters (1 matrix or multiple scalars expected)');
        }

        var size = math.size(args);

        if (size.length == 1) {
            // vector
            if (args.length == 0) {
                throw new Error('Cannot calculate min of an empty vector');
            }

            return _min(args.valueOf());
        }
        else if (size.length == 2) {
            // 2 dimensional matrix
            if (size[0] == 0 || size[1] == 0) {
                throw new Error('Cannot calculate min of an empty matrix');
            }
            if (args instanceof Array) {
                return _min2(args, size[0], size[1]);
            }
            else if (args instanceof Matrix || args instanceof Range) {
                return new Matrix(_min2(args.valueOf(), size[0], size[1]));
            }
            else {
                throw newUnsupportedTypeError('min', args);
            }
        }
        else {
            // TODO: implement min for n-dimensional matrices
            throw new RangeError('Cannot calculate min for multi dimensional matrix');
        }
    }
    else {
        // min(a, b, c, d, ...)
        return _min(arguments);
    }
}

math.min = min;

/**
 * Calculate the min of a one dimensional array
 * @param {Array} array
 * @return {Number} min
 * @private
 */
function _min(array) {
    var smaller = math.smaller;
    var res = array[0];
    for (var i = 1, iMax = array.length; i < iMax; i++) {
        var value = array[i];
        if (smaller(value, res)) {
            res = value;
        }
    }
    return res;
}

/**
 * Calculate the min of a two dimensional array
 * @param {Array} array
 * @param {Number} rows
 * @param {Number} cols
 * @return {Number[]} min
 * @private
 */
function _min2(array, rows, cols) {
    var smaller = math.smaller;
    var res = [];
    for (var c = 0; c < cols; c++) {
        var min = array[0][c];
        for (var r = 1; r < rows; r++) {
            var value = array[r][c];
            if (smaller(value, min)) {
                min = value;
            }
        }
        res[c] = min;
    }
    return res;
}

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
        'min(2, 3, 4, 1)',
        'min(2.7, 7.1, -4.5, 2.0, 4.1)',
        'max(2.7, 7.1, -4.5, 2.0, 4.1)'
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Array | Matrix | Range} y
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (y instanceof Array || y instanceof Matrix || y instanceof Range ||
        x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Unit | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Unit | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Unit | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Unit | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Unit | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Number | Complex | Unit | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
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
 * @param {Unit | Array | Matrix | Range} x
 * @param {Unit | Array | Matrix} unit
 * @return {Unit | Array | Matrix} res
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

    if (x instanceof Array || x instanceof Matrix || x instanceof Range ||
        unit instanceof Array || unit instanceof Matrix || unit instanceof Range) {
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

    if (x == null) {
        // null or undefined
        return x;
    }

    if (typeof(x.clone) === 'function') {
        return x.clone();
    }

    if (isNumber(x) || isString(x) || isBoolean(x)) {
        return x;
    }

    if (x instanceof Array) {
        return x.map(function (value) {
            return clone(value);
        });
    }

    if (x instanceof Object) {
        return util.mapObject(x, clone);
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
 *     math.format(value)
 *     math.format(template, object)
 *
 * Example usage:
 *     math.format(2/7);                // '0.2857142857'
 *     math.format(new Complex(2, 3));  // '2 + 3i'
 *     math.format('Hello $name! The date is $date', {
 *         name: 'user',
 *         date: new Date().toISOString().substring(0, 10)
 *     });                              // 'hello user! The date is 2013-03-23'
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
            return util.formatNumber(value);
        }

        if (value instanceof Array) {
            return util.formatArray(value);
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
        var parser = math.parser();
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

math.expr.node.Node = Node;

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
 * @constructor Symbol
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

math.expr.node.Symbol = Symbol;

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
 * @constructor Constant
 * @param {*} value
 * @extends {Node}
 */
function Constant(value) {
    this.value = value;
}

Constant.prototype = new Node();

math.expr.node.Constant = Constant;

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
 * @constructor MatrixNode
 * Holds an n-dimensional array with nodes
 * @param {Array} nodes
 * @extends {Node}
 */
function MatrixNode(nodes) {
    this.nodes = nodes || [];
}

MatrixNode.prototype = new Node();

math.expr.node.MatrixNode = MatrixNode;

(function () {
    /**
     * Evaluate the array
     * @return {Matrix} results
     * @override
     */
    MatrixNode.prototype.eval = function() {
        // recursively evaluate the nodes in the array
        return new Matrix(evalArray(this.nodes));
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
    MatrixNode.prototype.toString = function() {
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
 * @constructor Block
 * Holds a set with nodes
 * @extends {Node}
 */
function Block() {
    this.params = [];
    this.visible = [];
}

Block.prototype = new Node();

math.expr.node.Block = Block;

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

math.expr.node.Assignment = Assignment;

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

        var prevResult = this.result();
        // TODO: check type of prevResult: Matrix, Array, String, other...
        if (!prevResult.set) {
            throw new TypeError('Cannot apply a subset to object of type ' +
                math.typeof(prevResult));

        }
        result = prevResult.set(paramResults, exprResult);

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
 * @constructor Arguments
 * invoke a list with parameters on the results of a node
 * @param {Node} object
 * @param {Node[]} params
 */
function Arguments (object, params) {
    this.object = object;
    this.params = params;
}

Arguments.prototype = new Node();

math.expr.node.Arguments = Arguments;

/**
 * Evaluate the parameters
 * @return {*} result
 */
Arguments.prototype.eval = function() {
    var object = this.object;
    if (object == undefined) {
        throw new Error ('Node undefined');
    }
    var objectRes = object.eval();

    // evaluate the parameters
    var params = this.params;
    var paramsRes = [];
    for (var i = 0, len = params.length; i < len; i++) {
        paramsRes[i] = params[i].eval();
    }

    // TODO: check type of objectRes
    if (!objectRes.get) {
        throw new TypeError('Cannot apply arguments to object of type ' +
            math.typeof(objectRes));
    }
    return objectRes.get(paramsRes);
};

/**
 * Get string representation
 * @return {String} str
 */
Arguments.prototype.toString = function() {
    // format the arguments like "(2, 4.2)"
    var str = this.object ? this.object.toString() : '';
    if (this.params) {
        str += '(' + this.params.join(', ') + ')';
    }
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

math.expr.node.FunctionAssignment = FunctionAssignment;

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

(function () {
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

    math.expr.Scope = Scope;

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
            var args, i;
            if (!symbol.value) {
                // try to resolve again
                symbol.value = scope.findDef(name);

                if (!symbol.value) {
                    throw new Error('Undefined symbol ' + name);
                }
            }
            if (typeof symbol.value === 'function') {
                return symbol.value.apply(null, arguments);
            }
            else if (symbol.value instanceof Matrix || symbol.value instanceof Range || symbol.value instanceof Array) {
                if (arguments.length) {
                    var matrix = (symbol.value instanceof Array) ? new Matrix(symbol.value) : symbol.value;
                    args = [];
                    for (i = 0; i < arguments.length; i++) {
                        args[i] = arguments[i];
                    }
                    return matrix.get(args);
                }
                else {
                    return symbol.value;
                }
            }
            // TODO: implement get subset for all types
            else {
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

})();

(function () {
    /**
     * @constructor math.expr.Parser
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
     *    var parser = new math.expr.Parser();
     *    // Note: there is a convenience method which can be used instead:
     *    // var parser = new math.parser();
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
    math.expr.Parser = function Parser() {
        if (this.constructor != Parser) {
            throw new SyntaxError(
                'Parser constructor must be called with the new operator');
        }

        this.scope = new math.expr.Scope();
    };

    /**
     * Parse an expression end return the parsed function node.
     * The node can be evaluated via node.eval()
     * @param {String} expression
     * @param {Scope} [scope]
     * @return {Node} node
     * @throws {Error}
     */
    math.expr.Parser.prototype.parse = function (expression, scope) {
        expr = expression || '';

        if (!scope) {
            this._newScope();
            scope = this.scope;
        }

        return parse_start(scope);
    };

    /**
     * Parse and evaluate the given expression
     * @param {String} expression   A string containing an expression, for example "2+3"
     * @return {*} result           The result, or undefined when the expression was
     *                              empty
     * @throws {Error}
     */
    math.expr.Parser.prototype.eval = function (expression) {
        var node = this.parse(expression);
        return node.eval();
    };

    /**
     * Get a variable (a function or variable) by name from the parsers scope.
     * Returns undefined when not found
     * @param {String} name
     * @return {* | undefined} value
     */
    math.expr.Parser.prototype.get = function (name) {
        this._newScope();
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
    math.expr.Parser.prototype.set = function (name, value) {
        this.scope.createDef(name, value);
    };

    /**
     * Create a new scope having the current scope as parent scope, to make current
     * scope immutable
     * @private
     */
    math.expr.Parser.prototype._newScope = function () {
        this.scope = new math.expr.Scope(this.scope);

        // TODO: smartly cleanup scopes which are not relevant anymore

    };

    /**
     * Clear the scope with variables and functions
     */
    math.expr.Parser.prototype.clear = function () {
        this.scope.clear();
    };

    // token types enumeration
    var TOKENTYPE = {
        NULL : 0,
        DELIMITER : 1,
        NUMBER : 2,
        SYMBOL : 3,
        UNKNOWN : 4
    };

    var expr = '';        // current expression
    var index = 0;        // current index in expr
    var c = '';           // current token character in expr
    var token = '';       // current token
    var token_type = TOKENTYPE.NULL; // type of the token
    // TODO: do not use this.token, but a local variable var token for better speed? -> getToken() must return token.

    /**
     * Get the next character from the expression.
     * The character is stored into the char t.
     * If the end of the expression is reached, the function puts an empty
     * string in t.
     * @private
     */
    function getChar() {
        index++;
        c = expr.charAt(index);
    }

    /**
     * Get the first character from the expression.
     * The character is stored into the char t.
     * If the end of the expression is reached, the function puts an empty
     * string in t.
     * @private
     */
    function getFirstChar() {
        index = 0;
        c = expr.charAt(0);
    }

    /**
     * Get next token in the current string expr.
     * Uses the Parser data expr, e, token, t, token_type and err
     * The token and token type are available at token_type and token
     * @private
     */
    function getToken() {
        token_type = TOKENTYPE.NULL;
        token = '';

        // skip over whitespaces
        while (c == ' ' || c == '\t') {  // space or tab
            getChar();
        }

        // skip comment
        if (c == '#') {
            while (c != '\n' && c != '') {
                getChar();
            }
        }

        // check for end of expression
        if (c == '') {
            // token is still empty
            token_type = TOKENTYPE.DELIMITER;
            return;
        }

        // check for minus, comma, parentheses, quotes, newline, semicolon
        if (c == '-' || c == ',' ||
            c == '(' || c == ')' ||
            c == '[' || c == ']' ||
            c == '\"' || c == '\n' ||
            c == ';' || c == ':') {
            token_type = TOKENTYPE.DELIMITER;
            token += c;
            getChar();
            return;
        }

        // check for operators (delimiters)
        if (isDelimiter(c)) {
            token_type = TOKENTYPE.DELIMITER;
            while (isDelimiter(c)) {
                token += c;
                getChar();
            }
            return;
        }

        // check for a number
        if (isDigitDot(c)) {
            token_type = TOKENTYPE.NUMBER;
            while (isDigitDot(c)) {
                token += c;
                getChar();
            }

            // check for scientific notation like "2.3e-4" or "1.23e50"
            if (c == 'E' || c == 'e') {
                token += c;
                getChar();

                if (c == '+' || c == '-') {
                    token += c;
                    getChar();
                }

                // Scientific notation MUST be followed by an exponent
                if (!isDigit(c)) {
                    // this is no legal number, exponent is missing.
                    token_type = TOKENTYPE.UNKNOWN;
                }

                while (isDigit(c)) {
                    token += c;
                    getChar();
                }
            }
            return;
        }

        // check for variables or functions
        if (isAlpha(c)) {
            token_type = TOKENTYPE.SYMBOL;

            while (isAlpha(c) || isDigit(c))
            {
                token += c;
                getChar();
            }
            return;
        }

        // something unknown is found, wrong characters -> a syntax error
        token_type = TOKENTYPE.UNKNOWN;
        while (c != '') {
            token += c;
            getChar();
        }
        throw createSyntaxError('Syntax error in part "' + token + '"');
    }

    /**
     * checks if the given char c is a delimiter
     * minus is not checked in this method (can be unary minus)
     * @param {String} c   a string with one character
     * @return {Boolean}
     * @private
     */
    function isDelimiter (c) {
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
    }

    /**
     * Check if a given name is valid
     * if not, an error is thrown
     * @param {String} name
     * @return {boolean} valid
     * @private
     */
    function isValidSymbolName (name) {
        for (var i = 0, iMax = name.length; i < iMax; i++) {
            var c = name.charAt(i);
            //var valid = (isAlpha(c) || (i > 0 && isDigit(c))); // TODO
            var valid = (isAlpha(c));
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
    function isAlpha (c) {
        return ((c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c == '_');
    }

    /**
     * checks if the given char c is a digit or dot
     * @param {String} c   a string with one character
     * @return {Boolean}
     * @private
     */
    function isDigitDot (c) {
        return ((c >= '0' && c <= '9') ||
            c == '.');
    }

    /**
     * checks if the given char c is a digit
     * @param {String} c   a string with one character
     * @return {Boolean}
     * @private
     */
    function isDigit (c) {
        return ((c >= '0' && c <= '9'));
    }

    /**
     * Start of the parse levels below, in order of precedence
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_start (scope) {
        // get the first character in expression
        getFirstChar();

        getToken();

        var node;
        if (token == '') {
            // empty expression
            node = new Constant(undefined);
        }
        else {
            node = parse_block(scope);
        }

        // check for garbage at the end of the expression
        // an expression ends with a empty character '' and token_type DELIMITER
        if (token != '') {
            if (token_type == TOKENTYPE.DELIMITER) {
                // user entered a not existing operator like "//"

                // TODO: give hints for aliases, for example with "<>" give as hint " did you mean != ?"
                throw createError('Unknown operator ' + token);
            }
            else {
                throw createSyntaxError('Unexpected part "' + token + '"');
            }
        }

        return node;
    }

    /**
     * Parse assignment of ans.
     * Ans is assigned when the expression itself is no variable or function
     * assignment
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_ans (scope) {
        var expression = parse_function_assignment(scope);

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
    }

    /**
     * Parse a block with expressions. Expressions can be separated by a newline
     * character '\n', or by a semicolon ';'. In case of a semicolon, no output
     * of the preceding line is returned.
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_block (scope) {
        var node, block, visible;

        if (token != '\n' && token != ';' && token != '') {
            node = parse_ans(scope);
        }

        while (token == '\n' || token == ';') {
            if (!block) {
                // initialize the block
                block = new Block();
                if (node) {
                    visible = (token != ';');
                    block.add(node, visible);
                }
            }

            getToken();
            if (token != '\n' && token != ';' && token != '') {
                node = parse_ans(scope);

                visible = (token != ';');
                block.add(node, visible);
            }
        }

        if (block) {
            return block;
        }

        if (!node) {
            node = parse_ans(scope);
        }

        return node;
    }

    /**
     * Parse a function assignment like "function f(a,b) = a*b"
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_function_assignment (scope) {
        // TODO: keyword 'function' must become a reserved keyword
        if (token_type == TOKENTYPE.SYMBOL && token == 'function') {
            // get function name
            getToken();
            if (token_type != TOKENTYPE.SYMBOL) {
                throw createSyntaxError('Function name expected');
            }
            var name = token;

            // get parenthesis open
            getToken();
            if (token != '(') {
                throw createSyntaxError('Opening parenthesis ( expected');
            }

            // get function variables
            var functionScope = scope.createNestedScope();
            var variableNames = [];
            var variables = [];
            while (true) {
                getToken();
                if (token_type == TOKENTYPE.SYMBOL) {
                    // store parameter
                    var variableName = token;
                    var variable = functionScope.createDef(variableName);
                    variableNames.push(variableName);
                    variables.push(variable);
                }
                else {
                    throw createSyntaxError('Variable name expected');
                }

                getToken();
                if (token == ',') {
                    // ok, nothing to do, read next variable
                }
                else if (token == ')') {
                    // end of variable list encountered. break loop
                    break;
                }
                else {
                    throw createSyntaxError('Comma , or closing parenthesis ) expected"');
                }
            }

            getToken();
            if (token != '=') {
                throw createSyntaxError('Equal sign = expected');
            }

            // parse the expression, with the correct function scope
            getToken();
            var expression = parse_range(functionScope);
            var result = scope.createDef(name);

            return  new FunctionAssignment(name, variableNames, variables,
                expression, result);
        }

        return parse_assignment(scope);
    }

    /**
     * Assignment of a variable, can be a variable like "a=2.3" or a updating an
     * existing variable like "matrix(2,3:5)=[6,7,8]"
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_assignment (scope) {
        var linkExisted = false;
        if (token_type == TOKENTYPE.SYMBOL) {
            linkExisted = scope.hasLink(token);
        }

        var node = parse_range(scope);

        // TODO: support chained assignments like "a = b = 2.3"
        if (token == '=') {
            if (!(node instanceof Symbol)) {
                throw createSyntaxError('Symbol expected at the left hand side ' +
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
            getToken();
            var expression = parse_range(scope);
            var link = node.hasParams() ? scope.createUpdate(name) : scope.createDef(name);
            return new Assignment(name, params, expression, link);
        }

        return node;
    }

    /**
     * parse range, "start:end" or "start:step:end"
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_range (scope) {
        var node = parse_conditions(scope);

        if (token == ':') {
            var params = [node];

            while (token == ':') {
                getToken();
                params.push(parse_conditions(scope));
            }

            if (params.length > 3) {
                throw new TypeError('Invalid range');
            }

            var name = 'range';
            var fn = range;
            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * conditions like and, or, in
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_conditions (scope) {
        var node = parse_bitwise_conditions(scope);

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
        while (operators[token] !== undefined) {
            // TODO: with all operators: only load one instance of the operator, use the scope
            var name = token;
            var fn = math[operators[name]];

            getToken();
            var params = [node, parse_bitwise_conditions(scope)];
            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * conditional operators and bitshift
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_bitwise_conditions (scope) {
        var node = parse_comparison(scope);

        /* TODO: implement bitwise conditions
         var operators = {
         '&' : 'bitwiseand',
         '|' : 'bitwiseor',
         // todo: bitwise xor?
         '<<': 'bitshiftleft',
         '>>': 'bitshiftright'
         };
         while (operators[token] !== undefined) {
         var name = token;
         var fn = math[operators[name]];

         getToken();
         var params = [node, parse_comparison()];
         node = new Symbol(name, fn, params);
         }
         */

        return node;
    }

    /**
     * comparison operators
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_comparison (scope) {
        var node = parse_addsubtract(scope);

        var operators = {
            '==': 'equal',
            '!=': 'unequal',
            '<': 'smaller',
            '>': 'larger',
            '<=': 'smallereq',
            '>=': 'largereq'
        };
        while (operators[token] !== undefined) {
            var name = token;
            var fn = math[operators[name]];

            getToken();
            var params = [node, parse_addsubtract(scope)];
            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * add or subtract
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_addsubtract (scope)  {
        var node = parse_multiplydivide(scope);

        var operators = {
            '+': 'add',
            '-': 'subtract'
        };
        while (operators[token] !== undefined) {
            var name = token;
            var fn = math[operators[name]];

            getToken();
            var params = [node, parse_multiplydivide(scope)];
            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * multiply, divide, modulus
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_multiplydivide (scope) {
        var node = parse_unaryminus(scope);

        var operators = {
            '*': 'multiply',
            '/': 'divide',
            '%': 'mod',
            'mod': 'mod'
        };
        while (operators[token] !== undefined) {
            var name = token;
            var fn = math[operators[name]];

            getToken();
            var params = [node, parse_unaryminus(scope)];
            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * Unary minus
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_unaryminus (scope) {
        if (token == '-') {
            var name = token;
            var fn = unaryminus;
            getToken();
            var params = [parse_pow(scope)];

            return new Symbol(name, fn, params);
        }

        return parse_pow(scope);
    }

    /**
     * power
     * Node: power operator is right associative
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_pow (scope) {
        var nodes = [
            parse_factorial(scope)
        ];

        // stack all operands of a chained power operator (like '2^3^3')
        while (token == '^') {
            getToken();
            nodes.push(parse_factorial(scope));
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
    }

    /**
     * Factorial
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_factorial (scope)  {
        var node = parse_plot(scope);

        while (token == '!') {
            var name = token;
            var fn = factorial;
            getToken();
            var params = [node];

            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * parse plot
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_plot (scope) {
        /* TODO: implement plot
         if (token_type == TOKENTYPE.SYMBOL &&
         token == 'plot') {
         getToken();

         // parse the parentheses and parameters of the plot
         // the parameters are something like: plot(sin(x), cos(x), x)
         var functions = [];
         if (token == '(') {
         var plotScope = scope.createNestedScope();

         getToken();
         functions.push(parse_range(plotScope));

         // parse a list with parameters
         while (token == ',') {
         getToken();
         functions.push(parse_range(plotScope));
         }

         if (token != ')') {
         throw createSyntaxError('Parenthesis ) missing');
         }
         getToken();
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

        return parse_symbol(scope);
    }

    /**
     * parse symbols: functions, variables, constants, units
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_symbol (scope) {
        if (token_type == TOKENTYPE.SYMBOL) {
            var name = token;

            getToken();

            var link = scope.createLink(name);
            // TODO: split applying arguments from symbol?
            var arguments = parse_arguments(scope);
            var symbol = new Symbol(name, link, arguments);

            /* TODO: parse arguments
            // parse arguments
            while (token == '(') {
                symbol = parse_arguments(scope, symbol);
            }
            */
            return symbol;
        }

        return parse_string(scope);
    }

    /**
     * parse arguments, enclosed in parenthesis
     * @param {Scope} scope
     * @return {Node[]} arguments
     * @private
     */
    function parse_arguments (scope) {
        var arguments = [];
        if (token == '(') {
            // TODO: in case of Plot, create a new scope.

            getToken();

            if (token != ')') {
                arguments.push(parse_range(scope));

                // parse a list with parameters
                while (token == ',') {
                    getToken();
                    arguments.push(parse_range(scope));
                }
            }

            if (token != ')') {
                throw createSyntaxError('Parenthesis ) missing');
            }
            getToken();
        }

        return arguments;
    }

    /**
     * parse a string.
     * A string is enclosed by double quotes
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_string (scope) {
        if (token == '"') {
            // string "..."
            var str = '';
            var tPrev = '';
            while (c != '' && (c != '\"' || tPrev == '\\')) { // also handle escape character
                str += c;
                tPrev = c;
                getChar();
            }

            getToken();
            if (token != '"') {
                throw createSyntaxError('End of string " missing');
            }
            getToken();

            var node = new Constant(str);

            /* TODO: parse arguments
            // parse arguments
            while (token == '(') {
                node = parse_arguments(scope, node);
            }
            */

            return node;
        }

        return parse_matrix(scope);
    }

    /**
     * parse the matrix
     * @param {Scope} scope
     * @return {Node} A MatrixNode
     * @private
     */
    function parse_matrix (scope) {
        if (token == '[') {
            // matrix [...]
            var array;

            // skip newlines
            getToken();
            while (token == '\n') {
                getToken();
            }

            // check if this is an empty matrix "[ ]"
            if (token != ']') {
                // this is a non-empty matrix
                var params = [];
                var r = 0, c = 0;

                params[0] = [parse_range(scope)];

                // the columns in the matrix are separated by commas, and the rows by dot-comma's
                while (token == ',' || token == ';') {
                    if (token == ',') {
                        c++;
                    }
                    else {
                        r++;
                        c = 0;
                        params[r] = [];
                    }

                    // skip newlines
                    getToken();
                    while (token == '\n') {
                        getToken();
                    }

                    params[r][c] = parse_range(scope);

                    // skip newlines
                    while (token == '\n') {
                        getToken();
                    }
                }

                var rows =  params.length;
                var cols = (params.length > 0) ? params[0].length : 0;

                // check if the number of columns matches in all rows
                for (r = 1; r < rows; r++) {
                    if (params[r].length != cols) {
                        throw createError('Number of columns must match ' +
                            '(' + params[r].length + ' != ' + cols + ')');
                    }
                }

                if (token != ']') {
                    throw createSyntaxError('End of matrix ] missing');
                }

                getToken();
                array = new MatrixNode(params);
            }
            else {
                // this is an empty matrix "[ ]"
                getToken();
                array = new MatrixNode([]);
            }

            /* TODO: parse arguments
            // parse arguments
            while (token == '(') {
                array = parse_arguments(scope, array);
            }
            */

            return array;
        }

        return parse_number(scope);
    }

    /**
     * parse a number
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_number (scope) {
        if (token_type == TOKENTYPE.NUMBER) {
            // this is a number
            var number;
            if (token == '.') {
                number = 0.0;
            } else {
                number = Number(token);
            }
            getToken();

            /* TODO: implicit multiplication?
             // TODO: how to calculate a=3; 2/2a ? is this (2/2)*a or 2/(2*a) ?
             // check for implicit multiplication
             if (token_type == TOKENTYPE.VARIABLE) {
             node = multiply(node, parse_pow());
             }
             //*/

            var value;
            if (token_type == TOKENTYPE.SYMBOL) {
                if (token == 'i' || token == 'I') {
                    value = new Complex(0, number);
                    getToken();
                    return new Constant(value);
                }

                if (Unit.isUnit(token)) {
                    value = new Unit(number, token);
                    getToken();
                    return new Constant(value);
                }

                throw createTypeError('Unknown unit "' + token + '"');
            }

            // just a regular number
            var node = new Constant(number);

            /* TODO: parse arguments
            // parse arguments
            while (token == '(') {
                node = parse_arguments(scope, node);
            }
            */

            return node;
        }

        return parse_parentheses(scope);
    }

    /**
     * parentheses
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_parentheses (scope) {
        // check if it is a parenthesized expression
        if (token == '(') {
            // parentheses (...)
            getToken();
            var node = parse_range(scope); // start again

            if (token != ')') {
                throw createSyntaxError('Parenthesis ) expected');
            }
            getToken();

            /* TODO: implicit multiplication?
             // TODO: how to calculate a=3; 2/2a ? is this (2/2)*a or 2/(2*a) ?
             // check for implicit multiplication
             if (token_type == TOKENTYPE.VARIABLE) {
             node = multiply(node, parse_pow());
             }
             //*/

            /* TODO: parse arguments
            // parse arguments
            while (token == '(') {
                node = parse_arguments(scope, node);
            }
            */

            return node;
        }

        return parse_end(scope);
    }

    /**
     * Evaluated when the expression is not yet ended but expected to end
     * @param {Scope} scope
     * @return {Node} res
     * @private
     */
    function parse_end (scope) {
        if (token == '') {
            // syntax error or unexpected end of expression
            throw createSyntaxError('Unexpected end of expression');
        } else {
            throw createSyntaxError('Value expected');
        }
    }

    /**
     * Shortcut for getting the current row value (one based)
     * Returns the line of the currently handled expression
     * @private
     */
    function row () {
        // TODO: also register row number during parsing
        return undefined;
    }

    /**
     * Shortcut for getting the current col value (one based)
     * Returns the column (position) where the last token starts
     * @private
     */
    function col () {
        return index - token.length + 1;
    }


    /**
     * Build up an error message
     * @param {String} message
     * @return {String} message with row and column information
     * @private
     */
    function createErrorMessage (message) {
        var row = row();
        var col = col();
        if (row === undefined) {
            if (col === undefined) {
                return message;
            } else {
                return message + ' (col ' + col + ')';
            }
        } else {
            return message + ' (ln ' + row + ', col ' + col + ')';
        }
    }

    /**
     * Create an error
     * @param {String} message
     * @return {SyntaxError} instantiated error
     * @private
     */
    function createSyntaxError (message) {
        return new SyntaxError(createErrorMessage(message));
    }

    /**
     * Create an error
     * @param {String} message
     * @return {TypeError} instantiated error
     * @private
     */
    function createTypeError(message) {
        return new TypeError(createErrorMessage(message));
    }

    /**
     * Create an error
     * @param {String} message
     * @return {Error} instantiated error
     * @private
     */
    function createError (message) {
        return new Error(createErrorMessage(message));
    }

})();

(function () {
    /**
     * @constructor math.expr.Workspace
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
     *     var workspace = new math.expr.Workspace();
     *     var id0 = workspace.append('a = 3/4');
     *     var id1 = workspace.append('a + 2');
     *     console.log('a + 2 = ' + workspace.getResult(id1));
     *     workspace.replace('a=5/2', id0);
     *     console.log('a + 2 = ' + workspace.getResult(id1));
     */
    function Workspace () {
        this.idMax = -1;
        this.updateSeq = 0;
        this.parser = new math.expr.Parser();
        this.scope = new math.expr.Scope();

        this.nodes = {};
        this.firstNode = undefined;
        this.lastNode = undefined;
    }

    math.expr.Workspace = Workspace;

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
        var scope = new math.expr.Scope(parentScope);
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
        var scope = new math.expr.Scope(previousScope);
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
/**
 * Backward compatibility stuff
 */
// TODO: remove error messages for deprecated methods (deprecated since version 0.5.0)
function deprecated(deprecated, replacement) {
    throw new Error(
        'Constructor "' + deprecated +'" has been replaced by ' +
        'constructor method "' + replacement + '" in math.js v0.5.0');
}
math.Complex = function () {
    deprecated('new math.Complex()', 'math.complex()');
};
math.Unit = function () {
    deprecated('new math.Unit()', 'math.unit()');
};
math.parser.Parser = function () {
    deprecated('new math.parser.Parser()', 'math.parser()');
};
math.parser.Workspace = function () {
    deprecated('new math.parser.Workspace()', 'math.workspace()');
};


})();
