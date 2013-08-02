/**
 * math.js
 * https://github.com/josdejong/mathjs
 *
 * Math.js is an extensive math library for JavaScript and Node.js,
 * It features real and complex numbers, units, matrices, a large set of
 * mathematical functions, and a flexible expression parser.
 *
 * @version 0.11.2-SNAPSHOT
 * @date    2013-08-02
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

// TODO: put "use strict"; here (but right now webstorms inspector starts
// complaining on this issue: http://youtrack.jetbrains.com/issue/WEB-7485)

/**
 * Define namespace
 */
var math = {
    type: {},
    expr: {
        node: {
            handlers: {}
        }
    },
    docs: {},
    options: {
        precision: 5  // number of digits in formatted output
    }
};

// utility methods for strings, objects, and arrays
var util = (function () {
    var util = {};

    /**
     * Convert a number to a formatted string representation.
     * @param {Number} value            The value to be formatted
     * @param {Number} [precision]      number of digits in formatted output
     * @return {String} formattedValue  The formatted value
     */
    util.formatNumber = function formatNumber(value, precision) {
        if (value === Infinity) {
            return 'Infinity';
        }
        else if (value === -Infinity) {
            return '-Infinity';
        }
        else if (isNaN(value)) {
            return 'NaN';
        }

        // TODO: what is a nice limit for non-scientific values?
        var abs = Math.abs(value);
        if ( (abs > 0.001 && abs < 100000) || abs == 0.0 ) {
            // round the value to a limited number of precision
            return util.toPrecision(value, precision);
        }
        else {
            // scientific notation
            var exp = Math.round(Math.log(abs) / Math.LN10);
            var v = value / (Math.pow(10.0, exp));
            return util.toPrecision(v, precision) + 'e' + exp;
        }
    };

    /**
     * Round a value to a maximum number of precision. Trailing zeros will be
     * removed.
     * @param {Number} value
     * @param {Number} [precision]  Number of digits in formatted output
     * @returns {string} str
     */
    util.toPrecision = function toPrecision (value, precision) {
        return value.toPrecision(precision).replace(_trailingZeros, function (a, b, c) {
            return a.substring(0, a.length - (b.length ? 0 : 1) - c.length);
        });
    };

    /** @private */
    var _trailingZeros = /\.(\d*?)(0+)$/g;

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
            return math.format(array);
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
                    str += math.format(cell);
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
     * Check if a text ends with a certain string.
     * @param {String} text
     * @param {String} search
     */
    util.endsWith = function endsWith(text, search) {
        var start = text.length - search.length;
        var end = text.length;
        return (text.substring(start, end) === search);
    };

    /**
     * Extend object a with the properties of object b
     * @param {Object} a
     * @param {Object} b
     * @return {Object} a
     */
    util.extend = function extend (a, b) {
        for (var prop in b) {
            if (b.hasOwnProperty(prop)) {
                a[prop] = b[prop];
            }
        }
        return a;
    };

    /**
     * Deep extend an object a with the properties of object b
     * @param {Object} a
     * @param {Object} b
     * @returns {Object}
     */
    util.deepExtend = function deepExtend (a, b) {
        for (var prop in b) {
            if (b.hasOwnProperty(prop)) {
                if (b[prop] && b[prop].constructor === Object) {
                    if (a[prop] === undefined) {
                        a[prop] = {};
                    }
                    if (a[prop].constructor === Object) {
                        deepExtend(a[prop], b[prop]);
                    }
                    else {
                        a[prop] = b[prop];
                    }
                } else {
                    a[prop] = b[prop];
                }
            }
        }
        return a;
    };

    /**
     * Create a semi UUID
     * b: http://stackoverflow.com/a/105074/1262753
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

    // TODO: write the map, deepMap, map2, and deepMap2 functions in a more concise way

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
     * Execute function fn element wise for each element in array and any nested
     * array
     * Returns an array with the results
     * @param {Array | Matrix | Range} array
     * @param {function} fn
     * @return {Array | Matrix} res
     */
    util.deepMap = function map(array, fn) {
        if (array instanceof Array || array instanceof Matrix || array instanceof Range) {
            return array.map(function (x) {
                return map(x, fn);
            });
        }
        else {
            return fn(array);
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
            return util.map2(array1.valueOf(), array2.valueOf(), fn);
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
     * Execute function fn element wise for each entry in two given arrays,
     * and for any nested array. Objects can also be scalar objects.
     * Returns an array with the results.
     * @param {Array | Matrix | Range | Object} array1
     * @param {Array | Matrix | Range | Object} array2
     * @param {function} fn
     * @return {Array | Matrix} res
     */
    util.deepMap2 = function map2(array1, array2, fn) {
        var res, len, i;

        // handle Matrix
        if (array1 instanceof Matrix || array2 instanceof Matrix) {
            return new Matrix(map2(array1.valueOf(), array2.valueOf(), fn));
        }

        // handle Range
        if (array1 instanceof Range || array2 instanceof Range) {
            // TODO: util.deepMap2 does not utilize Range.map
            return map2(array1.valueOf(), array2.valueOf(), fn);
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
                    res[i] = map2(array1[i], array2[i], fn);
                }
            }
            else {
                // fn(array, object)
                res = [];
                len = array1.length;
                for (i = 0; i < len; i++) {
                    res[i] = map2(array1[i], array2, fn);
                }
            }
        }
        else {
            if (array2 instanceof Array) {
                // fn(object, array)
                res = [];
                len = array2.length;
                for (i = 0; i < len; i++) {
                    res[i] = map2(array1, array2[i], fn);
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
     * every prop in the object.
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
    util.deepEqual = function deepEqual (a, b) {
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
                var size0 = _size(x[0]);
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
     * Test whether index is an integer number with index >= 0 and index < length
     * @param {*} index         Zero-based index
     * @param {Number} [length] Length of the array
     */
    util.validateIndex = function validateIndex (index, length) {
        if (!isNumber(index) || !isInteger(index)) {
            throw new TypeError('Index must be an integer (value: ' + index + ')');
        }
        if (index < 0) {
            throw new RangeError('Index out of range (' + index + ' < 0)');
        }
        if (length !== undefined && index >= length) {
            throw new RangeError('Index out of range (' + index + ' >= ' + length +  ')');
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
                    array[i] = defaultValue ? math.clone(defaultValue) : 0;
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
            throw new TypeError('Size must be an array (size is ' + math['typeof'](size) + ')');
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
    if (!(this instanceof Complex)) {
        throw new SyntaxError(
            'Complex constructor must be called with the new operator');
    }

    switch (arguments.length) {
        case 0:
            this.re = 0;
            this.im = 0;
            break;

        case 2:
            if (!isNumber(re) || !isNumber(im)) {
                throw new TypeError(
                    'Two numbers expected in Complex constructor');
            }
            this.re = re;
            this.im = im;
            break;

        default:
            if (arguments.length != 0 && arguments.length != 2) {
                throw new SyntaxError(
                    'Two or zero arguments expected in Complex constructor');
            }
            break;
    }
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
        c = text.charAt(index);
    }

    function revert(oldIndex) {
        index = oldIndex;
        c = text.charAt(index);
    }

    function parseNumber () {
        var number = '';
        var oldIndex;
        oldIndex = index;

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

        // get number, can have a single dot
        if (c == '.') {
            number += c;
            next();
            if (!isDigit(c)) {
                // this is no legal number, it is just a dot
                revert(oldIndex);
                return null;
            }
        }
        else {
            while (isDigit(c)) {
                number += c;
                next();
            }
            if (c == '.') {
                number += c;
                next();
            }
        }
        while (isDigit(c)) {
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
        var cnext = text.charAt(index + 1);
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
     * Create a complex number from a provided real and imaginary number.
     * When the imaginary part is zero, a real number is returned instead of
     * a complex number. For example:
     *     Complex.create(2, 3);        // returns a Complex(2, 3)
     *     Complex.create(2, 0);        // returns a Number 2
     *
     * @param {Number} re
     * @param {Number} im
     * @return {Complex | Number} value
     */
    Complex.create = function (re, im) {
        if (im == 0) {
            return re;
        }
        else {
            return new Complex(re, im);
        }
    };

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
    var strRe = util.formatNumber(this.re, math.options.precision);
    var strIm = util.formatNumber(this.im, math.options.precision);

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
                str = strRe + ' - ' +
                    util.formatNumber(Math.abs(this.im), math.options.precision) + 'i';
            }
        }
    }

    return str;
};


/**
 * Documentation object
 * @param {Object} doc  Object containing properties:
 *                      {String} name
 *                      {String} category
 *                      {String[]} syntax
 *                      {String[]} examples
 *                      {String[]} seealso
 * @constructor
 */
function Help (doc) {
    if (doc) {
        util.extend(this, doc);
    }
}

math.type.Help = Help;

/**
 * Generate readable description from a Help object
 * @return {String} readableDoc
 * @private
 */
Help.prototype.toString = function () {
    var desc = '\n';

    if (this.name) {
        desc += 'Name: ' + this.name + '\n\n';
    }
    if (this.category) {
        desc += 'Category: ' + this.category + '\n\n';
    }
    if (this.syntax) {
        desc += 'Syntax:\n    ' + this.syntax.join('\n    ') + '\n\n';
    }
    if (this.examples) {
        var parser = math.parser();
        desc += 'Examples:\n';
        for (var i = 0; i < this.examples.length; i++) {
            var expr = this.examples[i];
            var res;
            try {
                res = parser.eval(expr);
            }
            catch (e) {
                res = e;
            }
            desc += '    ' + expr + '\n';
            if (res && !(res instanceof Help)) {
                desc += '        ' + math.format(res) + '\n';
            }
        }
        desc += '\n';
    }
    if (this.seealso) {
        desc += 'See also: ' + this.seealso.join(', ') + '\n';
    }


    return desc;
};

// TODO: implement a toHTML function in Help

/**
 * Export the help object to JSON
 */
Help.prototype.toJSON = function () {
    return util.extend({}, this);
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
 *     matrix.get([1,2])          // 3 (indexes are zero-based)
 *
 * @param {Array | Matrix} [data]    A multi dimensional array
 */
function Matrix(data) {
    if (!(this instanceof Matrix)) {
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
        throw new TypeError('Unsupported type of data (' + math['typeof'](data) + ')');
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
 * @param {Array | Matrix} index    Zero-based index
 */
Matrix.prototype.get = function (index) {
    var isScalar;
    if (index instanceof Matrix) {
        // index is scalar when size==[n] or size==[1,1,...]
        isScalar = (index.size().length == 1) || !index.size().some(function (i) {
            return (i != 0);
        });
        index = index.valueOf();
    }
    else if (index instanceof Array) {
        isScalar = !index.some(function (elem) {
            var size = math.size(elem);
            return (size.length != 0) && (size != [0]);
        });
    }
    else {
        throw new TypeError('Invalid index');
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
 * Get a single value from an array. The method tests whether:
 * - index is a non-negative integer
 * - index does not exceed the dimensions of array
 * @param {Array} array
 * @param {Number} index   Zero-based index
 * @return {*} value
 * @private
 */
function _get (array, index) {
    util.validateIndex(index, array.length);
    return array[index]; // zero-based index
}

/**
 * Get a single value from the matrix. The value will be a copy of the original
 * value in the matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Number[]} index   Zero-based index
 * @return {*} scalar
 * @private
 */
function _getScalar (data, index) {
    index.forEach(function (i) {
        data = _get(data, i);
    });
    return math.clone(data);
}

/**
 * Get a submatrix of a zero dimensional matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Array} index         Zero-based index
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
 * @param {Array} index         Zero-based index
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
 * @param {Array} index         Zero-based index
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
 * Indexes are zero-based.
 * @param {Array | Matrix} index        zero-based index
 * @param {*} submatrix
 * @return {Matrix} itself
 */
Matrix.prototype.set = function (index, submatrix) {
    var isScalar;
    if (index instanceof Matrix) {
        // index is scalar when size==[n] or size==[0,0,...]
        isScalar = (index.size().length == 1) || !index.size().some(function (i) {
            return (i != 0);
        });
        index = index.valueOf();
    }
    else if (index instanceof Array) {
        isScalar = !index.some(function (elem) {
            var size = math.size(elem);
            return (size.length != 0) && (size != [0]);
        });
    }
    else {
        throw new TypeError('Invalid index');
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
        if (math.size(submatrix).valueOf().length != 0) {
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
 * @param {Number} index   Zero-based index
 * @param {*} value
 * @private
 */
function _set (array, index, value) {
    util.validateIndex(index);
    if (value instanceof Array) {
        throw new TypeError('Dimension mismatch, value expected instead of array');
    }
    array[index] = value; // zero-based index
}

/**
 * Replace a single value in a multi dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Number[]} index  Zero-based index
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
        util.validateIndex(index_i);
        if ((size[i] == null) || (index_i + 1 > size[i])) {
            size[i] = index_i + 1; // size is index + 1 as index is zero-based
            resized = true;
        }
    }

    if (resized) {
        util.resize(data, size, 0);
    }

    var len = size.length;
    index.forEach(function (v, i) {
        if (i < len - 1) {
            data = data[v]; // zero-based index
        }
        else {
            data[v] = value; // zero-based index
        }
    });
}

/**
 * Replace a single value in a zero dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Number[]} index      zero-based index
 * @param {*} value
 * @private
 */
function _setScalar1D (data, size, index, value) {
    var row = index[0];
    util.validateIndex(row);
    if (row + 1 > size[0]) {
        util.resize(data, [row + 1], 0); // size is index + 1 as index is zero-based
        size[0] = row + 1;
    }
    data[row] = value; // zero-based index
}

/**
 * Replace a single value in a two dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Number[]} index  zero-based index
 * @param {*} value
 * @private
 */
function _setScalar2D (data, size, index, value) {
    var row = index[0];
    var col = index[1];
    util.validateIndex(row);
    util.validateIndex(col);

    var resized = false;
    if (row + 1 > (size[0] || 0)) {
        size[0] = row + 1;   // size is index + 1 as index is zero-based
        resized = true;
    }
    if (col + 1 > (size[1] || 0)) {
        size[1] = col + 1;   // size is index + 1 as index is zero-based
        resized = true;
    }
    if (resized) {
        util.resize(data, size, 0);
    }

    data[row][col] = value; // zero-based index
}

/**
 * Replace a submatrix of a multi dimensional matrix.
 * @param {Array} data
 * @param {Array} size
 * @param {Array} index     zero-based index
 * @param {number} dim
 * @param {Array} submatrix
 * @private
 */
function _setSubmatrix (data, size, index, dim, submatrix) {
    var last = (dim == index.length - 1);
    var current = index[dim];
    var recurse = function (dataIndex, subIndex) {
        if (last) {
            _set(data, dataIndex, submatrix[subIndex]);
            if (dataIndex + 1 > (size[dim] || 0)) {
                size[dim] = dataIndex + 1;
            }
        }
        else {
            var child = data[dataIndex]; // zero-based index
            if (!(child instanceof Array)) {
                data[dataIndex] = child = [child]; // zero-based index
            }
            if (dataIndex + 1 > (size[dim] || 0)) {
                size[dim] = dataIndex + 1;
            }
            _setSubmatrix(child, size, index, dim + 1, submatrix[subIndex]);
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
 *                                  If not provided, the matrix will be filled
 *                                  with zeros.
 */
Matrix.prototype.resize = function (size, defaultValue) {
    util.resize(this._data, size, defaultValue);
    this._size = math.clone(size);
};

/**
 * Create a clone of the matrix
 * @return {Matrix} clone
 */
Matrix.prototype.clone = function () {
    var matrix = new Matrix();
    matrix._data = math.clone(this._data);
    matrix._size = math.clone(this._size);
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
                index[dim] = i; // zero-based index
                return recurse(child, dim + 1);
            });
        }
        else {
            return callback(value, index, me);
        }
    };
    matrix._data = recurse(this._data, 0);
    matrix._size = math.clone(this._size);

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
                index[dim] = i; // zero-based index
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
        return math.clone(scalar);
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
    return math.clone(this._data);
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
    return math.format(this._data);
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
    if (!(this instanceof Range)) {
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

    if (math.sign(step) == math.sign(diff)) {
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
    var str = math.format(Number(this.start));
    if (this.step != 1) {
        str += ':' + math.format(Number(this.step));
    }
    str += ':' + math.format(Number(this.end));
    return str;
};

/**
 * @constructor math.type.Selector
 * Wrap any value in a Selector, allowing to perform chained operations on
 * the value.
 *
 * All methods available in the math.js library can be called upon the selector,
 * and then will be evaluated with the value itself as first argument.
 * The selector can be closed by executing selector.done(), which will return
 * the final value.
 *
 * The Selector has a number of special functions:
 * - done()     Finalize the chained operation and return the selectors value.
 * - valueOf()  The same as done()
 * - toString() Executes math.format() onto the selectors value, returning
 *              a string representation of the value.
 * - get(...)   Get a subset of the selectors value. Useful for example for
 *              matrices and arrays.
 * - set(...)   Replace a subset of the selectors value. Useful for example for
 *              matrices and arrays.
 *
 * @param {*} [value]
 */
math.type.Selector = function Selector (value) {
    if (!(this instanceof math.type.Selector)) {
        throw new SyntaxError(
            'Selector constructor must be called with the new operator');
    }

    if (value instanceof math.type.Selector) {
        this.value = value.value;
    }
    else {
        this.value = value;
    }
};

math.type.Selector.prototype = {
    /**
     * Close the selector. Returns the final value.
     * Does the same as method valueOf()
     * @returns {*} value
     */
    done: function () {
        return this.value;
    },

    /**
     * Get a submatrix or subselection from current value.
     * Only applicable when the current value has a method get.
     */
    get: function (index) {
        var value = this.value;
        if (!value) {
            throw Error('Selector value is undefined');
        }

        return new math.type.Selector(math.subset(value, index));
    },

    /**
     * Set a submatrix or subselection on current value.
     * Only applicable when the current value has a method set.
     */
    set: function (index, replacement) {
        var value = this.value;
        if (!value) {
            throw Error('Selector value is undefined');
        }

        return new math.type.Selector(math.subset(value, index, replacement));
    },

    /**
     * Close the selector. Returns the final value.
     * Does the same as method done()
     * @returns {*} value
     */
    valueOf: function () {
        return this.value;
    },

    /**
     * Get the string representation of the value in the selector
     * @returns {String}
     */
    toString: function () {
        return math.format(this.value);
    }
};

/**
 * Create a proxy method for the selector
 * @param {String} name
 * @param {*} value       The value or function to be proxied
 */
function createSelectorProxy(name, value) {
    var Selector = math.type.Selector;
    var slice = Array.prototype.slice;
    if (typeof value === 'function') {
        // a function
        Selector.prototype[name] = function () {
            var args = [this.value].concat(slice.call(arguments, 0));
            return new Selector(value.apply(this, args));
        }
    }
    else {
        // a constant
        Selector.prototype[name] = new Selector(value);
    }
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
    if (!(this instanceof Unit)) {
        throw new Error('Unit constructor must be called with the new operator');
    }

    if (value != null && !isNumber(value)) {
        throw new TypeError('First parameter in Unit constructor must be a number');
    }
    if (unit != null && !isString(unit)) {
        throw new TypeError('Second parameter in Unit constructor must be a string');
    }

    if (unit != null) {
        // find the unit and prefix from the string
        var res = _findUnit(unit);
        if (!res) {
            throw new SyntaxError('String "' + unit + '" is no unit');
        }
        this.unit = res.unit;
        this.prefix = res.prefix;
    }
    else {
        this.unit = Unit.UNIT_NONE;
        this.prefix = Unit.PREFIX_NONE;  // link to a list with supported prefixes
    }

    if (value != null) {
        this.value = this._normalize(value);
        this.fixPrefix = false;  // is set true by the methods Unit.in and math.in
    }
    else {
        this.value = null;
        this.fixPrefix = true;
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
        c = text.charAt(index);
    }

    function revert(oldIndex) {
        index = oldIndex;
        c = text.charAt(index);
    }

    function parseNumber () {
        var number = '';
        var oldIndex;
        oldIndex = index;

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

        // get number, can have a single dot
        if (c == '.') {
            number += c;
            next();
            if (!isDigit(c)) {
                // this is no legal number, it is just a dot
                revert(oldIndex);
                return null;
            }
        }
        else {
            while (isDigit(c)) {
                number += c;
                next();
            }
            if (c == '.') {
                number += c;
                next();
            }
        }
        while (isDigit(c)) {
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
 * Test whether value is of type Unit
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
 * @param {Number} [prefixValue]    Optional prefix value to be used
 * @return {Number} unnormalized value
 * @private
 */
Unit.prototype._unnormalize = function (value, prefixValue) {
    if (prefixValue == undefined) {
        return value / this.unit.value / this.prefix.value -
            this.unit.offset;
    }
    else {
        return value / this.unit.value / prefixValue -
            this.unit.offset;
    }
};

/**
 * Find a unit from a string
 * @param {String} str              A string like 'cm' or 'inch'
 * @returns {Object | null} result  When found, an object with fields unit and
 *                                  prefix is returned. Else, null is returned.
 * @private
 */
function _findUnit(str) {
    var UNITS = Unit.UNITS;
    for (var i = 0, iMax = UNITS.length; i < iMax; i++) {
        var UNIT = UNITS[i];

        if (util.endsWith(str, UNIT.name) ) {
            var prefixLen = (str.length - UNIT.name.length);
            var prefixName = str.substring(0, prefixLen);
            var prefix = UNIT.prefixes[prefixName];
            if (prefix !== undefined) {
                // store unit, prefix, and value
                return {
                    unit: UNIT,
                    prefix: prefix
                };
            }
        }
    }

    return null;
}

/**
 * Test if the given expression is a unit.
 * The unit can have a prefix but cannot have a value.
 * @param {String} unit   A plain unit without value. Can have prefix, like "cm"
 * @return {Boolean}      true if the given string is a unit
 */
Unit.isPlainUnit = function (unit) {
    return (_findUnit(unit) != null);
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
 * Create a clone of this unit with a representation
 * @param {String | Unit} plainUnit   A plain unit, without value. Can have prefix, like "cm"
 * @returns {Unit} unit having fixed, specified unit
 */
Unit.prototype['in'] = function (plainUnit) {
    var other;
    if (isString(plainUnit)) {
        other = new Unit(null, plainUnit);

        if (!this.equalBase(other)) {
            throw new Error('Units do not match');
        }

        other.value = this.value;
        return other;
    }
    else if (plainUnit instanceof Unit) {
        if (!this.equalBase(plainUnit)) {
            throw new Error('Units do not match');
        }
        if (plainUnit.value != null) {
            throw new Error('Cannot convert to a unit with a value');
        }
        if (plainUnit.unit == null) {
            throw new Error('Unit expected on the right hand side of function in');
        }

        other = plainUnit.clone();
        other.value = this.value;
        other.fixPrefix = true;
        return other;
    }
    else {
        throw new Error('String or Unit expected as parameter');
    }
};

/**
 * Return the value of the unit when represented with given plain unit
 * @param {String | Unit} plainUnit    For example 'cm' or 'inch'
 * @return {Number} value
 */
Unit.prototype.toNumber = function (plainUnit) {
    var other = this['in'](plainUnit);
    var prefix = this.fixPrefix ? other._bestPrefix() : other.prefix;
    return other._unnormalize(other.value, prefix.value);
};

/**
 * Get string representation
 * @return {String}
 */
Unit.prototype.toString = function() {
    var value, str;
    if (!this.fixPrefix) {
        var bestPrefix = this._bestPrefix();
        value = this._unnormalize(this.value, bestPrefix.value);
        str = (this.value != null) ? util.formatNumber(value, math.options.precision) + ' ' : '';
        str += bestPrefix.name + this.unit.name;
    }
    else {
        value = this._unnormalize(this.value);
        str = (this.value != null) ? util.formatNumber(value, math.options.precision) + ' ' : '';
        str += this.prefix.name + this.unit.name;
    }
    return str;
};

/**
 * Calculate the best prefix using current value.
 * @returns {Object} prefix
 * @private
 */
Unit.prototype._bestPrefix = function () {
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

    return bestPrefix;
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
math.pi         = Math.PI;
math.e          = Math.E;
math.tau        = Math.PI * 2;
math.i          = new Complex(0, 1);

math['Infinity']= Infinity;
math['NaN']     = NaN;
math['true']    = true;
math['false']   = false;

// uppercase constants (for compatibility with built-in Math)
math.E          = Math.E;
math.LN2        = Math.LN2;
math.LN10       = Math.LN10;
math.LOG2E      = Math.LOG2E;
math.LOG10E     = Math.LOG10E;
math.PI         = Math.PI;
math.SQRT1_2    = Math.SQRT1_2;
math.SQRT2      = Math.SQRT2;

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
        var t = math['typeof'](value1);
        msg = 'Function ' + name + '(' + t + ') not supported';
    }
    else if (arguments.length > 2) {
        var types = [];
        for (var i = 1; i < arguments.length; i++) {
            types.push(math['typeof'](arguments[i]));
        }
        msg = 'Function ' + name + '(' + types.join(', ') + ') not supported';
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
 * Find any node in the node tree matching given filter. For example, to
 * find all nodes of type SymbolNode having name 'x':
 *
 *     var results = Node.find({
 *         type: SymbolNode,
 *         properties: {
 *             name: 'x'
 *         }
 *     });
 *
 * @param {Object} filter       Available parameters:
 *                                  {Function} type
 *                                  {Object<String, String>} properties
 * @return {Node[]} nodes       An array with nodes matching given filter criteria
 */
Node.prototype.find = function (filter) {
    return this.match(filter) ? [this] : [];
};

/**
 * Test if this object matches given filter
 * @param {Object} filter       Available parameters:
 *                              {Function} type
 *                              {Object<String, String>} properties
 * @return {Boolean} matches    True if there is a match
 */
Node.prototype.match = function (filter) {
    var match = true;

    if (filter) {
        if (filter.type && !(this instanceof filter.type)) {
            match = false;
        }
        if (match && filter.properties) {
            for (var prop in filter.properties) {
                if (filter.properties.hasOwnProperty(prop)) {
                    if (this[prop] != filter.properties[prop]) {
                        match = false;
                        break;
                    }
                }
            }
        }
    }

    return match;
};

/**
 * Get string representation
 * @return {String}
 */
Node.prototype.toString = function() {
    return '';
};

/**
 * @constructor ConstantNode
 * @param {*} value
 * @extends {Node}
 */
function ConstantNode(value) {
    this.value = value;
}

ConstantNode.prototype = new Node();

math.expr.node.ConstantNode = ConstantNode;

/**
 * Evaluate the constant (just return it)
 * @return {*} value
 */
ConstantNode.prototype.eval = function () {
    return this.value;
};

/**
 * Get string representation
 * @return {String} str
 */
ConstantNode.prototype.toString = function() {
    return math.format(this.value);
};

/**
 * @constructor OperatorNode
 * An operator with two arguments, like 2+3
 * @param {String} name     Function name, for example '+'
 * @param {function} fn     Function, for example math.add
 * @param {Node[]} params   Parameters
 */
function OperatorNode (name, fn, params) {
    this.name = name;
    this.fn = fn;
    this.params = params;
}

OperatorNode.prototype = new Node();

math.expr.node.OperatorNode = OperatorNode;

/**
 * Evaluate the parameters
 * @return {*} result
 */
OperatorNode.prototype.eval = function() {
    return this.fn.apply(this, this.params.map(function (param) {
        return param.eval();
    }));
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
OperatorNode.prototype.find = function (filter) {
    var nodes = [];

    // check itself
    if (this.match(filter)) {
        nodes.push(this);
    }

    // search in parameters
    var params = this.params;
    if (params) {
        for (var i = 0, len = params.length; i < len; i++) {
            nodes = nodes.concat(params[i].find(filter));
        }
    }

    return nodes;
};

/**
 * Get string representation
 * @return {String} str
 */
OperatorNode.prototype.toString = function() {
    var params = this.params;

    // special case: unary minus
    if (this.fn === math.unary) {
        return '-' + params[0].toString();
    }

    switch (params.length) {
        case 1: // for example '5!'
            return params[0].toString() + this.name;

        case 2: // for example '2+3'
            var lhs = params[0].toString();
            if (params[0] instanceof OperatorNode) {
                lhs = '(' + lhs + ')';
            }
            var rhs = params[1].toString();
            if (params[1] instanceof OperatorNode) {
                rhs = '(' + rhs + ')';
            }
            return lhs + ' ' + this.name + ' ' + rhs;

        default: // this should occur. format as a function call
            return this.name + '(' + this.params.join(', ') + ')';
    }
};

/**
 * @constructor SymbolNode
 * A symbol node can hold and resolve a symbol
 * @param {String} name
 * @param {math.expr.Scope} scope
 * @extends {Node}
 */
function SymbolNode(name, scope) {
    this.name = name;
    this.scope = scope;
}

SymbolNode.prototype = new Node();

math.expr.node.SymbolNode = SymbolNode;

/**
 * Evaluate the symbol. Throws an error when the symbol is undefined.
 * @return {*} result
 * @override
 */
SymbolNode.prototype.eval = function() {
    // return the value of the symbol
    var value = this.scope.get(this.name);

    if (value === undefined) {
        throw new Error('Undefined symbol ' + this.name);
    }

    return value;
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
SymbolNode.prototype.toString = function() {
    return this.name;
};

/**
 * @constructor ParamsNode
 * invoke a list with parameters on the results of a node
 * @param {Node} object
 * @param {Node[]} params
 * @param {Scope[]} paramScopes     A scope for every parameter, where the
 *                                  index variable 'end' can be defined.
 */
function ParamsNode (object, params, paramScopes) {
    this.object = object;
    this.params = params;
    this.paramScopes = paramScopes;

    // check whether any of the params expressions uses the context symbol 'end'
    this.hasContextParams = false;
    if (params) {
        var filter = {
            type: math.type.SymbolNode,
            properties: {
                name: 'end'
            }
        };

        for (var i = 0, len = params.length; i < len; i++) {
            if (params[i].find(filter).length > 0) {
                this.hasContextParams = true;
                break;
            }
        }
    }
}

ParamsNode.prototype = new Node();

math.expr.node.ParamsNode = ParamsNode;

/**
 * Evaluate the parameters
 * @return {*} result
 */
ParamsNode.prototype.eval = function() {
    var i, len;

    // evaluate the object
    var object = this.object;
    if (object == undefined) {
        throw new Error ('Node undefined');
    }
    var obj = object.eval();

    // evaluate the values of context parameter 'end' when needed
    if (this.hasContextParams) {
        var paramScopes = this.paramScopes,
            size;
        if (obj.size) {
            size = obj.size(); // matrix
        }
        else if (obj.length !== undefined) {
            size = [obj.length];  // string
        }
        else {
            size = [];  // scalar
        }

        if (paramScopes && size) {
            for (i = 0, len = this.params.length; i < len; i++) {
                var paramScope = paramScopes[i];
                if (paramScope) {
                    paramScope.set('end', size[i] - 1); // zero-based end
                }
            }
        }
    }

    // evaluate the parameters
    var params = this.params,
        results = [];
    for (i = 0, len = this.params.length; i < len; i++) {
        results[i] = params[i].eval();
    }

    if (typeof obj === 'function') {
        // invoke a function with the parameters
        return obj.apply(this, results);
    }
    else {
        // get a subset of the object
        return math.subset(obj, results);
    }
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
ParamsNode.prototype.find = function (filter) {
    var nodes = [];

    // check itself
    if (this.match(filter)) {
        nodes.push(this);
    }

    // search object
    if (this.object) {
        nodes = nodes.concat(this.object.find(filter));
    }

    // search in parameters
    var params = this.params;
    if (params) {
        for (var i = 0, len = params.length; i < len; i++) {
            nodes = nodes.concat(params[i].find(filter));
        }
    }

    return nodes;
};

/**
 * Get string representation
 * @return {String} str
 */
ParamsNode.prototype.toString = function() {
    // format the parameters like "(2, 4.2)"
    var str = this.object ? this.object.toString() : '';
    if (this.params) {
        str += '(' + this.params.join(', ') + ')';
    }
    return str;
};

/**
 * @constructor MatrixNode
 * Holds an 2-dimensional array with nodes
 * @param {Array[]} nodes    2 dimensional array with nodes
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
        // evaluate all nodes in the 2d array, and merge the results into a matrix
        var nodes = this.nodes,
            results = [],
            mergeNeeded = false;

        for (var r = 0, rows = nodes.length; r < rows; r++) {
            var nodes_r = nodes[r];
            var results_r = [];
            for (var c = 0, cols = nodes_r.length; c < cols; c++) {
                var results_rc = nodes_r[c].eval();
                if (results_rc instanceof Matrix ||
                    results_rc instanceof Range ||
                    results_rc instanceof Array) {
                    mergeNeeded = true;
                }
                results_r[c] = results_rc;
            }
            results[r] = results_r;
        }

        if (mergeNeeded) {
            results = merge(results);
        }

        return new Matrix(results);
    };

    /**
     * Find all nodes matching given filter
     * @param {Object} filter  See Node.find for a description of the filter options
     * @returns {Node[]} nodes
     */
    MatrixNode.prototype.find = function (filter) {
        var results = [];

        // check itself
        if (this.match(filter)) {
            results.push(this);
        }

        // search in all nodes
        var nodes = this.nodes;
        for (var r = 0, rows = nodes.length; r < rows; r++) {
            var nodes_r = nodes[r];
            for (var c = 0, cols = nodes_r.length; c < cols; c++) {
                results = results.concat(nodes_r[c].find(filter));
            }
        }

        return results;
    };

    /**
     * Merge nested Matrices in a two dimensional Array.
     * @param {Array} array    Two-dimensional array containing Matrices
     * @return {Array} merged  The merged array (two-dimensional)
     */
    function merge (array) {
        var merged = [];
        var rows = array.length;
        for (var r = 0; r < rows; r++) {
            var array_r = array[r];
            var cols = array_r.length;
            var submatrix = null;
            var submatrixRows = null;
            for (var c = 0; c < cols; c++) {
                var entry = math.clone(array_r[c]);
                var size;
                if (entry instanceof Matrix) {
                    // get the data from the matrix
                    size = entry.size();
                    entry = entry.valueOf();
                    if (size.length == 1) {
                        entry = [entry];
                        size = [1, size[0]];
                    }
                    else if (size.length > 2) {
                        throw new Error('Cannot merge a multi dimensional matrix');
                    }
                }
                else if (entry instanceof Range) {
                    // change range into an 1xn matrix
                    entry = [entry.valueOf()];
                    size = [1, entry[0].length];
                }
                else if (entry instanceof Array) {
                    // change array into a 1xn matrix
                    size = [1, entry.length];
                    entry = [entry];
                }
                else {
                    // change scalar into a 1x1 matrix
                    size = [1, 1];
                    entry = [[entry]];
                }

                // check the height of this row
                if (submatrix == null) {
                    // first entry
                    submatrix = entry;
                    submatrixRows = size[0];
                }
                else if (size[0] == submatrixRows) {
                    // merge
                    for (var s = 0; s < submatrixRows; s++) {
                        submatrix[s] = submatrix[s].concat(entry[s]);
                    }
                }
                else {
                    // no good...
                    throw new Error('Dimension mismatch ' +
                        '(' + size[0] + ' != ' + submatrixRows + ')');
                }
            }

            // merge the submatrix
            merged = merged.concat(submatrix);
        }

        return merged;
    }

    /**
     * Get string representation
     * @return {String} str
     * @override
     */
    MatrixNode.prototype.toString = function() {
        return util.formatArray(this.nodes);
    };
})();
/**
 * @constructor BlockNode
 * Holds a set with nodes
 * @extends {Node}
 */
function BlockNode() {
    this.params = [];
    this.visible = [];
}

BlockNode.prototype = new Node();

math.expr.node.BlockNode = BlockNode;

/**
 * Add a parameter
 * @param {Node} param
 * @param {Boolean} [visible]   true by default
 */
BlockNode.prototype.add = function (param, visible) {
    var index = this.params.length;
    this.params[index] = param;
    this.visible[index] = (visible != undefined) ? visible : true;
};

/**
 * Evaluate the set
 * @return {*[]} results
 * @override
 */
BlockNode.prototype.eval = function() {
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
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
BlockNode.prototype.find = function (filter) {
    var nodes = [];

    // check itself
    if (this.match(filter)) {
        nodes.push(this);
    }

    // search in parameters
    var params = this.params;
    if (params) {
        for (var i = 0, len = params.length; i < len; i++) {
            nodes = nodes.concat(params[i].find(filter));
        }
    }

    return nodes;
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
BlockNode.prototype.toString = function() {
    var strings = [];

    for (var i = 0, iMax = this.params.length; i < iMax; i++) {
        if (this.visible[i]) {
            strings.push('\n  ' + this.params[i].toString());
        }
    }

    return '[' + strings.join(',') + '\n]';
};

/**
 * @constructor AssignmentNode
 * Define a symbol, like "a = 3.2"
 *
 * @param {String} name                 Symbol name
 * @param {Node} expr                   The expression defining the symbol
 * @param {math.expr.Scope} scope       Scope to store the result
 */
function AssignmentNode(name, expr, scope) {
    this.name = name;
    this.expr = expr;
    this.scope = scope;
}

AssignmentNode.prototype = new Node();

math.expr.node.AssignmentNode = AssignmentNode;

/**
 * Evaluate the assignment
 * @return {*} result
 */
AssignmentNode.prototype.eval = function() {
    if (this.expr === undefined) {
        throw new Error('Undefined symbol ' + this.name);
    }

    var result = this.expr.eval();
    this.scope.set(this.name, result);

    return result;
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
AssignmentNode.prototype.find = function (filter) {
    var nodes = [];

    // check itself
    if (this.match(filter)) {
        nodes.push(this);
    }

    // search in expression
    if (this.expr) {
        nodes = nodes.concat(this.expr.find(filter));
    }

    return nodes;
};

/**
 * Get string representation
 * @return {String}
 */
AssignmentNode.prototype.toString = function() {
    return this.name + ' = ' + this.expr.toString();
};

/**
 * @constructor UpdateNode
 * Update a symbol value, like a(2,3) = 4.5
 *
 * @param {String} name                 Symbol name
 * @param {Node[] | undefined} params   One or more parameters
 * @param {Scope[]}  paramScopes        A scope for every parameter, where the
 *                                      index variable 'end' can be defined.
 * @param {Node} expr                   The expression defining the symbol
 * @param {math.expr.Scope} scope       Scope to store the result
 */
function UpdateNode(name, params, paramScopes, expr, scope) {
    this.name = name;
    this.params = params;
    this.paramScopes = paramScopes;
    this.expr = expr;
    this.scope = scope;

    // check whether any of the params expressions uses the context symbol 'end'
    this.hasContextParams = false;
    var filter = {
        type: math.type.SymbolNode,
        properties: {
            name: 'end'
        }
    };
    for (var i = 0, len = params.length; i < len; i++) {
        if (params[i].find(filter).length > 0) {
            this.hasContextParams = true;
            break;
        }
    }
}

UpdateNode.prototype = new Node();

math.expr.node.UpdateNode = UpdateNode;

/**
 * Evaluate the assignment
 * @return {*} result
 */
UpdateNode.prototype.eval = function() {
    if (this.expr === undefined) {
        throw new Error('Undefined symbol ' + this.name);
    }

    var result;
    var params = this.params;

    // test if definition is currently undefined
    var prevResult = this.scope.get(this.name);
    if (prevResult == undefined) {
        throw new Error('Undefined symbol ' + this.name);
    }

    // evaluate the values of context parameter 'end' when needed
    if (this.hasContextParams) {
        var paramScopes = this.paramScopes,
            size;
        if (prevResult.size) {
            size = prevResult.size(); // matrix
        }
        else if (prevResult.length !== undefined) {
            size = [prevResult.length];  // string
        }
        else {
            size = [];  // scalar
        }

        if (paramScopes && size) {
            for (var i = 0, len = this.params.length; i < len; i++) {
                var paramScope = paramScopes[i];
                if (paramScope) {
                    paramScope.set('end', size[i] - 1);
                }
            }
        }
    }

    // change part of a matrix, for example "a=[]", "a(2,3)=4.5"
    var paramResults = [];
    this.params.forEach(function (param) {
        paramResults.push(param.eval());
    });

    var exprResult = this.expr.eval();

    // replace subset
    result = math.subset(prevResult, paramResults, exprResult);

    this.scope.set(this.name, result);

    return result;
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
UpdateNode.prototype.find = function (filter) {
    var nodes = [];

    // check itself
    if (this.match(filter)) {
        nodes.push(this);
    }

    // search in parameters
    var params = this.params;
    if (params) {
        for (var i = 0, len = params.length; i < len; i++) {
            nodes = nodes.concat(params[i].find(filter));
        }
    }

    // search in expression
    if (this.expr) {
        nodes = nodes.concat(this.expr.find(filter));
    }

    return nodes;
};

/**
 * Get string representation
 * @return {String}
 */
UpdateNode.prototype.toString = function() {
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
 * @constructor FunctionNode
 * Function assignment
 *
 * @param {String} name                     Function name
 * @param {String[]} variables              Variable names
 * @param {Node} expr                       The function expression
 * @param {math.expr.Scope} functionScope   Scope in which to write variable
 *                                          values
 * @param {math.expr.Scope} scope           Scope to store the resulting
 *                                          function assignment
 */
function FunctionNode(name, variables, expr, functionScope, scope) {
    this.name = name;
    this.variables = variables;
    this.expr = expr;
    this.scope = scope;

    // create function
    this.fn = function () {
        var num = variables ? variables.length : 0;

        // validate correct number of arguments
        if (arguments.length != num) {
            throw newArgumentsError(name, arguments.length, num);
        }

        // fill in the provided arguments in the functionScope variables
        for (var i = 0; i < num; i++) {
            functionScope.set(variables[i], arguments[i]);
        }

        // evaluate the expression
        return expr.eval();
    };

    this.fn.toString = function() {
        // TODO: what to return as toString?
        return name + '(' + variables.join(', ') + ')';
        //return name + '(' + variableNames.join(', ') + ') = ' + expr.toString();
    };
}

FunctionNode.prototype = new Node();

math.expr.node.FunctionNode = FunctionNode;

/**
 * Evaluate the function assignment
 * @return {function} fn
 */
FunctionNode.prototype.eval = function() {
    // put the definition in the scope
    this.scope.set(this.name, this.fn);

    return this.fn;
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
FunctionNode.prototype.find = function (filter) {
    var nodes = [];

    // check itself
    if (this.match(filter)) {
        nodes.push(this);
    }

    // search in expression
    if (this.expr) {
        nodes = nodes.concat(this.expr.find(filter));
    }

    return nodes;
};

/**
 * get string representation
 * @return {String} str
 */
FunctionNode.prototype.toString = function() {
    return this.fn.toString();
};


/**
 * Scope
 * A scope stores values of symbols: variables and functions.
 *
 * Syntax:
 *     var scope = new math.expr.Scope();
 *     var scope = new math.expr.Scope(parentScope);
 *     var scope = new math.expr.Scope(symbols);
 *     var scope = new math.expr.Scope(parentScope, symbols);
 *
 * Where:
 *     {math.expr.Scope} parentScope    Scope will be linked to a parent scope,
 *                                      which is traversed when resolving
 *                                      symbols.
 *     {Object} symbols                 A custom object that will be used to
 *                                      resolve and store variables.
 *
 * @constructor math.expr.Scope
 * @param {...} [args]
 */
math.expr.Scope = function Scope(args) {
    /** @type {math.expr.Scope} */
    this.parentScope = null;
    // TODO: rename parentScope to previousScope, add a nextScope, change Scope to a linked list node

    /** @type {math.expr.Scope[]} */
    this.subScopes = null;
    // TODO: rename subScopes to childScopes (or childNodes?)

    /** @type {Object.<String, *>} */
    this.symbols = {};  // variables and functions

    /** @type {Object.<String, Object>} */
    this.cache = {};    // cache, referring to the scope.symbols object where
                        // a variable was last found

    // read first argument (can be parentScope or symbols map)
    if (arguments.length > 0) {
        var arg0 = arguments[0];
        if (arg0 instanceof math.expr.Scope) {
            this.parentScope = arg0;
        }
        else if (arg0 instanceof Object) {
            this.symbols = arg0;
        }
    }

    // read second argument (can be symbols map)
    if (arguments.length > 1) {
        var arg1 = arguments[1];
        if (arg1 instanceof Object) {
            this.symbols = arg1;
        }
    }
};

math.expr.Scope.prototype = {
    /**
     * Create a sub scope
     * The variables in a sub scope are not accessible from the parent scope
     * @return {math.expr.Scope} subScope
     */
    createSubScope: function () {
        var subScope = new math.expr.Scope(this);
        if (!this.subScopes) {
            this.subScopes = [];
        }
        this.subScopes.push(subScope);
        return subScope;
    },

    /**
     * Get a symbol value by name.
     * Returns undefined if the symbol is not found in this scope or any of
     * its parent scopes.
     * @param {String} name
     * @returns {* | undefined} value
     */
    get: function (name) {
        var value;

        // check itself
        value = this.symbols[name];
        if (value !== undefined) {
            return value;
        }

        // read from cache
        var symbols = this.cache[name];
        if (symbols) {
            return symbols[name];
        }

        // check parent scope
        var parent = this.parentScope;
        while (parent) {
            value = parent.symbols[name];
            if (value !== undefined) {
                this.cache[name] = parent.symbols;
                return value;
            }
            parent = parent.parentScope;
        }

        // check math namespace
        value = math[name];
        if (value !== undefined) {
            this.cache[name] = math;
            return value;
        }

        // check if name is a unit
        if (Unit.isPlainUnit(name)) {
            value = new Unit(null, name);
            this.cache[name] = {};
            this.cache[name][name] = value;
            return value;
        }

        return undefined;
    },

    /**
     * Test whether this scope contains a symbol (will not check parent scopes)
     * @param {String} name
     * @return {Boolean} hasSymbol
     */
    has: function (name) {
        return (this.symbols[name] !== undefined);
    },

    /**
     * Set a symbol value
     * @param {String} name
     * @param {*} value
     * @return {*} value
     */
    set: function (name, value) {
        return this.symbols[name] = value;
    },

    /**
     * Remove a symbol by name
     * @param {String} name
     */
    remove: function(name) {
        delete this.symbols[name];
    },

    /**
     * Clear all symbols in this scope, its sub scopes, and clear the cache.
     * Parent scopes will not be cleared.
     */
    clear: function () {
        var symbols = this.symbols;
        for (var name in symbols) {
            if (symbols.hasOwnProperty(name)) {
                delete symbols[name];
            }
        }

        if (this.subScopes) {
            var subScopes = this.subScopes;
            for (var i = 0, iMax = subScopes.length; i < iMax; i++) {
                subScopes[i].clear();
            }
        }

        this.clearCache();
    },

    /**
     * Clear cached links to symbols in other scopes
     */
    clearCache: function () {
        this.cache = {};
    }
};


/**
 * @constructor math.expr.Parser
 * Parser contains methods to evaluate or parse expressions, and has a number
 * of convenience methods to get, set, and remove variables from memory. Parser
 * keeps a scope containing variables in memory, which is used for all
 * evaluations.
 *
 * Methods:
 *    var result = parser.eval(expr);    // evaluate an expression
 *    var value = parser.get(name);      // retrieve a variable from the parser
 *    parser.set(name, value);           // set a variable in the parser
 *    parser.remove(name);               // clear a variable from the
 *                                       // parsers scope
 *    parser.clear();                    // clear the parsers scope
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
 *    parser.eval('sqrt(3^2 + 4^2)');         // 5
 *    parser.eval('sqrt(-4)');                // 2i
 *    parser.eval('2 inch in cm');            // 5.08 cm
 *    parser.eval('cos(45 deg)');             // 0.7071067811865476
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
    if (!(this instanceof math.expr.Parser)) {
        throw new SyntaxError(
            'Parser constructor must be called with the new operator');
    }

    this.scope = new math.expr.Scope();
};

/**
 * Parse an expression end return the parsed function node.
 * The node can be evaluated via node.eval()
 * @param {String} expr
 * @return {Node} node
 * @throws {Error}
 */
math.expr.Parser.prototype.parse = function (expr) {
    return math.parse(expr, this.scope);
};

/**
 * Parse and evaluate the given expression
 * @param {String} expr   A string containing an expression, for example "2+3"
 * @return {*} result     The result, or undefined when the expression was empty
 * @throws {Error}
 */
math.expr.Parser.prototype.eval = function (expr) {
    var node = math.parse(expr, this.scope);
    return node.eval();
};

/**
 * Get a variable (a function or variable) by name from the parsers scope.
 * Returns undefined when not found
 * @param {String} name
 * @return {* | undefined} value
 */
math.expr.Parser.prototype.get = function (name) {
    return this.scope.get(name);
};

/**
 * Set a symbol (a function or variable) by name from the parsers scope.
 * @param {String} name
 * @param {* | undefined} value
 */
math.expr.Parser.prototype.set = function (name, value) {
    this.scope.set(name, value);
};

/**
 * Remove a variable from the parsers scope
 * @param {String} name
 */
math.expr.Parser.prototype.remove = function (name) {
    this.scope.remove(name);
};

/**
 * Clear the scope with variables and functions
 */
math.expr.Parser.prototype.clear = function () {
    this.scope.clear();
};

/**
 * Calculate the absolute value of a value.
 *
 *     abs(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.abs = function abs(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('abs', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.abs(x);
    }

    if (x instanceof Complex) {
        return Math.sqrt(x.re * x.re + x.im * x.im);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.abs);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.abs(x.valueOf());
    }

    throw newUnsupportedTypeError('abs', x);
};

/**
 * Add two values
 *
 *     x + y
 *     add(x, y)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param  {Number | Complex | Unit | String | Array | Matrix} x
 * @param  {Number | Complex | Unit | String | Array | Matrix} y
 * @return {Number | Complex | Unit | String | Array | Matrix} res
 */
math.add = function add(x, y) {
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
            return Complex.create(
                x + y.re,
                    y.im
            )
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex + number
            return Complex.create(
                x.re + y,
                x.im
            )
        }
        else if (y instanceof Complex) {
            // complex + complex
            return Complex.create(
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

            if (x.value == null) {
                throw new Error('Unit on left hand side of operator + has an undefined value');
            }

            if (y.value == null) {
                throw new Error('Unit on right hand side of operator + has an undefined value');
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

    if (x instanceof Array || x instanceof Matrix ||
        y instanceof Array || y instanceof Matrix) {
        return util.map2(x, y, math.add);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive value
        return math.add(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('add', x, y);
};

/**
 * Round a value towards plus infinity
 *
 *     ceil(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.ceil = function ceil(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('ceil', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.ceil(x);
    }

    if (x instanceof Complex) {
        return Complex.create (
            Math.ceil(x.re),
            Math.ceil(x.im)
        );
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.ceil);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.ceil(x.valueOf());
    }

    throw newUnsupportedTypeError('ceil', x);
};

/**
 * Compute the cube of a value
 *
 *     x .* x .* x
 *     cube(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.cube = function cube(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('cube', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x * x * x;
    }

    if (x instanceof Complex) {
        return math.multiply(math.multiply(x, x), x);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.cube);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.cube(x.valueOf());
    }

    throw newUnsupportedTypeError('cube', x);
};

/**
 * Divide two values.
 *
 *     x / y
 *     divide(x, y)
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.divide = function divide(x, y) {
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
            return util.map2(x, y, math.divide);
        }
    }

    if (y instanceof Array || y instanceof Matrix) {
        // TODO: implement matrix right division using pseudo inverse
        return math.multiply(x, math.inv(y));
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive value
        return math.divide(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('divide', x, y);
};

/**
 * Divide two complex numbers. x / y or divide(x, y)
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex} res
 * @private
 */
function _divideComplex (x, y) {
    var den = y.re * y.re + y.im * y.im;
    if (den != 0) {
        return Complex.create(
            (x.re * y.re + x.im * y.im) / den,
            (x.im * y.re - x.re * y.im) / den
        );
    }
    else {
        // both y.re and y.im are zero
        return Complex.create(
            (x.re != 0) ? (x.re / 0) : 0,
            (x.im != 0) ? (x.im / 0) : 0
        );
    }
}

/**
 * Divide two values element wise.
 *
 *     x ./ y
 *     edivide(x, y)
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex | Unit | Array | Matrix} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.edivide = function edivide(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('edivide', arguments.length, 2);
    }

    return util.deepMap2(x, y, math.divide);
};

/**
 * Multiply two values element wise.
 *
 *     x .* y
 *     emultiply(x, y)
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex | Unit | Array | Matrix} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.emultiply = function emultiply(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('emultiply', arguments.length, 2);
    }

    return util.deepMap2(x, y, math.multiply);
};

/**
 * Calculates the power of x to y element wise
 *
 *     x .^ y
 *     epow(x, y)
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex | Unit | Array | Matrix} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.epow = function epow(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('epow', arguments.length, 2);
    }

    return util.deepMap2(x, y, math.pow);
};

/**
 * Check if value x equals y,
 *
 *     x == y
 *     equal(x, y)
 *
 * For matrices, the function is evaluated element wise.
 * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
 *
 * @param  {Number | Complex | Unit | String | Array | Matrix} x
 * @param  {Number | Complex | Unit | String | Array | Matrix} y
 * @return {Boolean | Array | Matrix} res
 */
math.equal = function equal(x, y) {
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

    if (x instanceof Array || x instanceof Matrix ||
        y instanceof Array || y instanceof Matrix) {
        return util.map2(x, y, math.equal);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return equal(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('equal', x, y);
};

/**
 * Calculate the exponent of a value
 *
 *     exp(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.exp = function exp (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('exp', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.exp(x);
    }
    if (x instanceof Complex) {
        var r = Math.exp(x.re);
        return Complex.create(
            r * Math.cos(x.im),
            r * Math.sin(x.im)
        );
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.exp);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.exp(x.valueOf());
    }

    throw newUnsupportedTypeError('exp', x);
};

/**
 * Round a value towards zero
 *
 *     fix(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.fix = function fix(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('fix', arguments.length, 1);
    }

    if (isNumber(x)) {
        return (x > 0) ? Math.floor(x) : Math.ceil(x);
    }

    if (x instanceof Complex) {
        return Complex.create(
            (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
            (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
        );
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.fix);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.fix(x.valueOf());
    }

    throw newUnsupportedTypeError('fix', x);
};

/**
 * Round a value towards minus infinity
 *
 *     floor(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.floor = function floor(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('floor', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.floor(x);
    }

    if (x instanceof Complex) {
        return Complex.create (
            Math.floor(x.re),
            Math.floor(x.im)
        );
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.floor);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.floor(x.valueOf());
    }

    throw newUnsupportedTypeError('floor', x);
};

/**
 * Calculate the greatest common divisor for two or more values or arrays.
 *
 *     gcd(a, b)
 *     gcd(a, b, c, ...)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {... Number | Array | Matrix} args    two or more integer numbers
 * @return {Number | Array | Matrix} greatest common divisor
 */
math.gcd = function gcd(args) {
    var a = arguments[0],
        b = arguments[1],
        t;

    if (arguments.length == 2) {
        // two arguments
        if (isNumber(a) && isNumber(b)) {
            if (!isInteger(a) || !isInteger(b)) {
                throw new Error('Parameters in function gcd must be integer numbers');
            }

            // http://en.wikipedia.org/wiki/Euclidean_algorithm
            while (b != 0) {
                t = b;
                b = a % t;
                a = t;
            }
            return Math.abs(a);
        }

        // evaluate gcd element wise
        if (a instanceof Array || a instanceof Matrix ||
            b instanceof Array || b instanceof Matrix) {
            return util.map2(a, b, math.gcd);
        }

        if (a.valueOf() !== a || b.valueOf() !== b) {
            // fallback on the objects primitive value
            return math.gcd(a.valueOf(), b.valueOf());
        }

        throw newUnsupportedTypeError('gcd', a, b);
    }

    if (arguments.length > 2) {
        // multiple arguments. Evaluate them iteratively
        for (var i = 1; i < arguments.length; i++) {
            a = math.gcd(a, arguments[i]);
        }
        return a;
    }

    // zero or one argument
    throw new SyntaxError('Function gcd expects two or more arguments');
};

/**
 * Check if value x is larger y
 *
 *    x > y
 *    larger(x, y)
 *
 * For matrices, the function is evaluated element wise.
 * In case of complex numbers, the absolute values of a and b are compared.
 *
 * @param  {Number | Complex | Unit | String | Array | Matrix} x
 * @param  {Number | Complex | Unit | String | Array | Matrix} y
 * @return {Boolean | Array | Matrix} res
 */
math.larger = function larger(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('larger', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x > y;
        }
        else if (y instanceof Complex) {
            return x > math.abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return math.abs(x) > y;
        }
        else if (y instanceof Complex) {
            return math.abs(x) > math.abs(y);
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

    if (x instanceof Array || x instanceof Matrix ||
        y instanceof Array || y instanceof Matrix) {
        return util.map2(x, y, math.larger);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.larger(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('larger', x, y);
};

/**
 * Check if value x is larger or equal to y
 *
 *     x >= y
 *     largereq(x, y)
 *
 * For matrices, the function is evaluated element wise.
 * In case of complex numbers, the absolute values of a and b are compared.
 *
 * @param  {Number | Complex | Unit | String | Array | Matrix} x
 * @param  {Number | Complex | Unit | String | Array | Matrix} y
 * @return {Boolean | Array | Matrix} res
 */
math.largereq = function largereq(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('largereq', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x >= y;
        }
        else if (y instanceof Complex) {
            return x >= math.abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return math.abs(x) >= y;
        }
        else if (y instanceof Complex) {
            return math.abs(x) >= math.abs(y);
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

    if (x instanceof Array || x instanceof Matrix ||
        y instanceof Array || y instanceof Matrix) {
        return util.map2(x, y, math.largereq);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.largereq(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('largereq', x, y);
};

/**
 * Calculate the least common multiple for two or more values or arrays.
 *
 *     lcm(a, b)
 *     lcm(a, b, c, ...)
 *
 * lcm is defined as:
 *     lcm(a, b) = abs(a * b) / gcd(a, b)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {... Number | Array | Matrix} args    two or more integer numbers
 * @return {Number | Array | Matrix} least common multiple
 */
math.lcm = function lcm(args) {
    var a = arguments[0],
        b = arguments[1],
        t;

    if (arguments.length == 2) {
        // two arguments
        if (isNumber(a) && isNumber(b)) {
            if (!isInteger(a) || !isInteger(b)) {
                throw new Error('Parameters in function lcm must be integer numbers');
            }

            // http://en.wikipedia.org/wiki/Euclidean_algorithm
            // evaluate gcd here inline to reduce overhead
            var prod = a * b;
            while (b != 0) {
                t = b;
                b = a % t;
                a = t;
            }
            return Math.abs(prod / a);
        }

        // evaluate lcm element wise
        if (a instanceof Array || a instanceof Matrix ||
            b instanceof Array || b instanceof Matrix) {
            return util.map2(a, b, math.lcm);
        }

        if (a.valueOf() !== a || b.valueOf() !== b) {
            // fallback on the objects primitive value
            return math.lcm(a.valueOf(), b.valueOf());
        }

        throw newUnsupportedTypeError('lcm', a, b);
    }

    if (arguments.length > 2) {
        // multiple arguments. Evaluate them iteratively
        for (var i = 1; i < arguments.length; i++) {
            a = math.lcm(a, arguments[i]);
        }
        return a;
    }

    // zero or one argument
    throw new SyntaxError('Function lcm expects two or more arguments');
};

/**
 * Calculate the logarithm of a value
 *
 *     log(x)
 *     log(x, base)
 *
 * base is optional. If not provided, the natural logarithm of x is calculated.
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @param {Number | Complex} [base]
 * @return {Number | Complex | Array | Matrix} res
 */
math.log = function log(x, base) {
    if (arguments.length == 1) {
        // calculate natural logarithm, log(x)
        if (isNumber(x)) {
            if (x >= 0) {
                return Math.log(x);
            }
            else {
                // negative value -> complex value computation
                return math.log(new Complex(x, 0));
            }
        }

        if (x instanceof Complex) {
            return Complex.create (
                Math.log(Math.sqrt(x.re * x.re + x.im * x.im)),
                Math.atan2(x.im, x.re)
            );
        }

        if (x instanceof Array || x instanceof Matrix) {
            return util.map(x, math.log);
        }

        if (x.valueOf() !== x) {
            // fallback on the objects primitive values
            return math.log(x.valueOf());
        }

        throw newUnsupportedTypeError('log', x);
    }
    else if (arguments.length == 2) {
        // calculate logarithm for a specified base, log(x, base)
        return math.divide(math.log(x), math.log(base));
    }
    else {
        throw newArgumentsError('log', arguments.length, 1, 2);
    }
};

/**
 * Calculate the 10-base logarithm of a value
 *
 *     log10(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.log10 = function log10(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('log10', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= 0) {
            return Math.log(x) / Math.LN10;
        }
        else {
            // negative value -> complex value computation
            return math.log10(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        return Complex.create (
            Math.log(Math.sqrt(x.re * x.re + x.im * x.im)) / Math.LN10,
            Math.atan2(x.im, x.re) / Math.LN10
        );
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.log10);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.log10(x.valueOf());
    }

    throw newUnsupportedTypeError('log10', x);
};

/**
 * Calculates the modulus, the remainder of an integer division.
 *
 *     x % y
 *     mod(x, y)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param  {Number | Complex | Array | Matrix} x
 * @param  {Number | Complex | Array | Matrix} y
 * @return {Number | Array | Matrix} res
 */
math.mod = function mod(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('mod', arguments.length, 2);
    }

    // see http://functions.wolfram.com/IntegerFunctions/Mod/

    if (isNumber(x) && isNumber(y)) {
        // number % number
        return _mod(x, y);
    }

    // TODO: implement mod for complex values

    if (x instanceof Array || x instanceof Matrix ||
        y instanceof Array || y instanceof Matrix) {
        return util.map2(x, y, math.mod);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.mod(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('mod', x, y);
};

/**
 * Calculate the modulus of two numbers
 * @param {Number} x
 * @param {Number} y
 * @returns {number} res
 * @private
 */
function _mod(x, y) {
    if (y > 0) {
        if (x > 0) {
            return x % y;
        }
        else if (x == 0) {
            return 0;
        }
        else { // x < 0
            return x - y * Math.floor(x / y);
        }
    }
    else if (y == 0) {
        return x;
    }
    else { // y < 0
        // TODO: implement mod for a negative divisor
        throw new Error('Cannot calculate mod for a negative divisor');
    }
}
/**
 * Multiply two values.
 *
 *     x * y
 *     multiply(x, y)
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex | Unit | Array | Matrix} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.multiply = function multiply(x, y) {
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
            var res = [],
                rows = sizeX[0],
                cols = sizeY[1],
                num = sizeX[1],
                multiply = math.multiply,
                add = math.add;
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
            return new Matrix(math.multiply(x.valueOf(), y.valueOf()));
        }
        else {
            // matrix * scalar
            return util.map2(x, y, math.multiply);
        }
    }
    else if (x instanceof Matrix) {
        return new Matrix(math.multiply(x.valueOf(), y.valueOf()));
    }

    if (y instanceof Array) {
        // scalar * matrix
        return util.map2(x, y, math.multiply);
    }
    else if (y instanceof Matrix) {
        return new Matrix(math.multiply(x.valueOf(), y.valueOf()));
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.multiply(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('multiply', x, y);
};

/**
 * Multiply two complex numbers. x * y or multiply(x, y)
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex | Number} res
 * @private
 */
function _multiplyComplex (x, y) {
    // Note: we test whether x or y are pure real or pure complex,
    // to prevent unnecessary NaN values. For example, Infinity*i should
    // result in Infinity*i, and not in NaN+Infinity*i

    if (x.im == 0) {
        // x is pure real
        if (y.im == 0) {
            // y is pure real
            return x.re * y.re;
        }
        else if (y.re == 0) {
            // y is pure complex
            return new Complex(
                0,
                x.re * y.im
            );
        }
        else {
            // y has a real and complex part
            return new Complex(
                x.re * y.re,
                x.re * y.im
            );
        }
    }
    else if (x.re == 0) {
        // x is pure complex
        if (y.im == 0) {
            // y is pure real
            return new Complex(
                0,
                x.im * y.re
            );
        }
        else if (y.re == 0) {
            // y is pure complex
            return -x.im * y.im;
        }
        else {
            // y has a real and complex part
            return new Complex(
                -x.im * y.im,
                 x.im * y.re
            );
        }
    }
    else {
        // x has a real and complex part
        if (y.im == 0) {
            // y is pure real
            return new Complex(
                x.re * y.re,
                x.im * y.re
            );
        }
        else if (y.re == 0) {
            // y is pure complex
            return new Complex(
                -x.im * y.im,
                 x.re * y.im
            );
        }
        else {
            // y has a real and complex part
            return new Complex(
                x.re * y.re - x.im * y.im,
                x.re * y.im + x.im * y.re
            );
        }
    }
}

/**
 * Calculates the power of x to y
 *
 *     x ^ y
 *     pow(x, y)
 *
 * @param  {Number | Complex | Array | Matrix} x
 * @param  {Number | Complex} y
 * @return {Number | Complex | Array | Matrix} res
 */
math.pow = function pow(x, y) {
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
            return math.eye(s[0]);
        }
        else {
            // value > 0
            var res = x;
            for (var i = 1; i < y; i++) {
                res = math.multiply(x, res);
            }
            return res;
        }
    }
    else if (x instanceof Matrix) {
        return new Matrix(math.pow(x.valueOf(), y));
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.pow(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('pow', x, y);
};

/**
 * Calculates the power of x to y, x^y, for two complex numbers.
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex} res
 * @private
 */
function powComplex (x, y) {
    // complex computation
    // x^y = exp(log(x)*y) = exp((abs(x)+i*arg(x))*y)
    var temp1 = math.log(x);
    var temp2 = math.multiply(temp1, y);
    return math.exp(temp2);
}

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
            return Complex.create (
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
            return Complex.create (
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

/**
 * Compute the sign of a value.
 *
 *     sign(x)
 *
 * The sign of a value x is 1 when x > 1, -1 when x < 0, and 0 when x == 0
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.sign = function sign(x) {
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
        return Complex.create(x.re / abs, x.im / abs);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.sign);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.sign(x.valueOf());
    }

    throw newUnsupportedTypeError('sign', x);
};

/**
 * Check if value x is smaller y
 *
 *     x < y
 *     smaller(x, y)
 *
 * For matrices, the function is evaluated element wise.
 * In case of complex numbers, the absolute values of a and b are compared.
 *
 * @param  {Number | Complex | Unit | String | Array | Matrix} x
 * @param  {Number | Complex | Unit | String | Array | Matrix} y
 * @return {Boolean | Array | Matrix} res
 */
math.smaller = function smaller(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('smaller', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x < y;
        }
        else if (y instanceof Complex) {
            return x < math.abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return math.abs(x) < y;
        }
        else if (y instanceof Complex) {
            return math.abs(x) < math.abs(y);
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

    if (x instanceof Array || x instanceof Matrix ||
        y instanceof Array || y instanceof Matrix) {
        return util.map2(x, y, math.smaller);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.smaller(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('smaller', x, y);
};

/**
 * Check if value a is smaller or equal to b
 *
 *     a <= b
 *     smallereq(a, b)
 *
 * For matrices, the function is evaluated element wise.
 * In case of complex numbers, the absolute values of a and b are compared.
 *
 * @param  {Number | Complex | Unit | String | Array | Matrix} x
 * @param  {Number | Complex | Unit | String | Array | Matrix} y
 * @return {Boolean | Array | Matrix} res
 */
math.smallereq = function smallereq(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('smallereq', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x <= y;
        }
        else if (y instanceof Complex) {
            return x <= math.abs(y);
        }
    }
    if (x instanceof Complex) {
        if (isNumber(y)) {
            return math.abs(x) <= y;
        }
        else if (y instanceof Complex) {
            return math.abs(x) <= math.abs(y);
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

    if (x instanceof Array || x instanceof Matrix ||
        y instanceof Array || y instanceof Matrix) {
        return util.map2(x, y, math.smallereq);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.smallereq(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('smallereq', x, y);
};

/**
 * Calculate the square root of a value
 *
 *     sqrt(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.sqrt = function sqrt (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('sqrt', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= 0) {
            return Math.sqrt(x);
        }
        else {
            return math.sqrt(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        var r = Math.sqrt(x.re * x.re + x.im * x.im);
        if (x.im >= 0) {
            return Complex.create(
                0.5 * Math.sqrt(2.0 * (r + x.re)),
                0.5 * Math.sqrt(2.0 * (r - x.re))
            );
        }
        else {
            return Complex.create(
                0.5 * Math.sqrt(2.0 * (r + x.re)),
                -0.5 * Math.sqrt(2.0 * (r - x.re))
            );
        }
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.sqrt);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.sqrt(x.valueOf());
    }

    throw newUnsupportedTypeError('sqrt', x);
};

/**
 * Compute the square of a value
 *
 *     x .* x
 *     square(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.square = function square(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('square', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x * x;
    }

    if (x instanceof Complex) {
        return math.multiply(x, x);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.square);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.square(x.valueOf());
    }

    throw newUnsupportedTypeError('square', x);
};

/**
 * Subtract two values
 *
 *     x - y
 *     subtract(x, y)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex | Unit | Array | Matrix} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.subtract = function subtract(x, y) {
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
            return Complex.create (
                x - y.re,
                  - y.im
            );
        }
    }
    else if (x instanceof Complex) {
        if (isNumber(y)) {
            // complex - number
            return Complex.create (
                x.re - y,
                x.im
            )
        }
        else if (y instanceof Complex) {
            // complex - complex
            return Complex.create (
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

            if (x.value == null) {
                throw new Error('Unit on left hand side of operator - has an undefined value');
            }

            if (y.value == null) {
                throw new Error('Unit on right hand side of operator - has an undefined value');
            }

            var res = x.clone();
            res.value -= y.value;
            res.fixPrefix = false;

            return res;
        }
    }

    if (x instanceof Array || x instanceof Matrix ||
        y instanceof Array || y instanceof Matrix) {
        return util.map2(x, y, math.subtract);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.subtract(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('subtract', x, y);
};

/**
 * Inverse the sign of a value.
 *
 *     -x
 *     unary(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.unary = function unary(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('unary', arguments.length, 1);
    }

    if (isNumber(x)) {
        return -x;
    }
    else if (x instanceof Complex) {
        return Complex.create(
            -x.re,
            -x.im
        );
    }
    else if (x instanceof Unit) {
        var res = x.clone();
        res.value = -x.value;
        return res;
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.unary);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.unary(x.valueOf());
    }

    throw newUnsupportedTypeError('unary', x);
};

// TODO: deprecated since version  0.10.0, cleanup some day
math.unaryminus = function unaryminus(x) {
    throw new Error('Function unaryminus is deprecated, use unary instead');
};

/**
 * Check if value x unequals y, x != y
 * In case of complex numbers, x.re must unequal y.re, or x.im must unequal y.im
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} y
 * @return {Boolean | Array | Matrix} res
 */
math.unequal = function unequal(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('unequal', arguments.length, 2);
    }

    if (isNumber(x)) {
        if (isNumber(y)) {
            return x != y;
        }
        else if (y instanceof Complex) {
            return (x != y.re) || (y.im != 0);
        }
    }

    if (x instanceof Complex) {
        if (isNumber(y)) {
            return (x.re != y) || (x.im != 0);
        }
        else if (y instanceof Complex) {
            return (x.re != y.re) || (x.im != y.im);
        }
    }

    if ((x instanceof Unit) && (y instanceof Unit)) {
        if (!x.equalBase(y)) {
            throw new Error('Cannot compare units with different base');
        }
        return x.value != y.value;
    }

    if (isString(x) || isString(y)) {
        return x != y;
    }

    if (x instanceof Array || x instanceof Matrix ||
        y instanceof Array || y instanceof Matrix) {
        return util.map2(x, y, math.unequal);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.unequal(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('unequal', x, y);
};

/**
 * Calculate the extended greatest common divisor for two values.
 *
 *     xgcd(a, b)
 *
 * @param {Number} a       An integer number
 * @param {Number} b       An integer number
 * @return {Array}         An array containing 3 integers [div, m, n]
 *                         where div = gcd(a, b) and a*m + b*n = div
 *
 * @see http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
 */
math.xgcd = function xgcd(a, b) {
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

/**
 * Compute the argument of a complex value.
 * If x = a + bi, the argument is computed as atan2(b, a).
 *
 *     arg(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Array | Matrix} res
 */
math.arg = function arg(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('arg', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.atan2(0, x);
    }

    if (x instanceof Complex) {
        return Math.atan2(x.im, x.re);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.arg);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.arg(x.valueOf());
    }

    // handle other types just as non-complex values
    return math.atan2(0, x);
};

/**
 * Compute the complex conjugate of a complex value.
 * If x = a+bi, the complex conjugate is a-bi.
 *
 *     conj(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.conj = function conj(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('conj', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x;
    }

    if (x instanceof Complex) {
        return Complex.create(x.re, -x.im);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.conj);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.conj(x.valueOf());
    }

    // return a clone of the value for non-complex values
    return clone(x);
};

/**
 * Get the imaginary part of a complex number.
 *
 *     im(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Array | Matrix} im
 */
math.im = function im(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('im', arguments.length, 1);
    }

    if (isNumber(x)) {
        return 0;
    }

    if (x instanceof Complex) {
        return x.im;
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.im);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.im(x.valueOf());
    }

    // return 0 for all non-complex values
    return 0;
};

/**
 * Get the real part of a complex number.
 *
 *     re(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Array | Matrix} re
 */
math.re = function re(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('re', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x;
    }

    if (x instanceof Complex) {
        return x.re;
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.re);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.re(x.valueOf());
    }

    // return a clone of the value itself for all non-complex values
    return math.clone(x);
};

/**
 * Create a boolean or convert a string or number to a boolean.
 * In case of a number, true is returned for non-zero numbers, and false in
 * case of zero.
 * Strings can be 'true' or 'false', or can contain a number.
 * @param {String | Number | Boolean} value
 * @return {Boolean} bool
 */
math['boolean'] = function (value) {
    if (arguments.length != 1) {
        throw newArgumentsError('boolean', arguments.length, 0, 1);
    }

    if (value === 'true' || value === true) {
        return true;
    }
    else if (value === 'false' || value === false) {
        return false;
    }
    else if (isNumber(value)) {
        return (value !== 0);
    }
    else if (isString(value)) {
        // try case insensitive
        var lcase = value.toLowerCase();
        if (lcase === 'true') {
            return true;
        }
        else if (lcase === 'false') {
            return false;
        }

        // try whether a number
        var num = Number(value);
        if (value != '' && !isNaN(num)) {
            return (num !== 0);
        }
    }

    throw new SyntaxError(value.toString() + ' is no valid boolean');
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
 *     complex(arg : string)               parses a string into a complex value.
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
math.complex = function complex(args) {
    switch (arguments.length) {
        case 0:
            // no parameters. Set re and im zero
            return new Complex(0, 0);
            break;

        case 1:
            // parse string into a complex number
            var arg = arguments[0];
            if (arg instanceof Complex) {
                // create a clone
                return arg.clone();
            }
            else if (isString(arg)) {
                var c = Complex.parse(arg);
                if (c) {
                    return c;
                }
                else {
                    throw new SyntaxError('String "' + arg + '" is no valid complex number');
                }
            }
            else {
                throw new TypeError(
                    'Two numbers or a single string expected in function complex');
            }
            break;

        case 2:
            // re and im provided
            return new Complex(arguments[0], arguments[1]);
            break;

        default:
            throw newArgumentsError('complex', arguments.length, 0, 2);
    }
};

/**
 * Create a matrix. The function creates a new math.type.Matrix object.
 *
 * The method accepts the following arguments:
 *     matrix()       creates an empty matrix
 *     matrix(data)   creates a matrix with initial data.
 *
 * Example usage:
 *     var m = matrix([[1, 2], [3, 4]);
 *     m.size();                        // [2, 2]
 *     m.resize([3, 2], 5);
 *     m.valueOf();                     // [[1, 2], [3, 4], [5, 5]]
 *     m.get([1, 0])                    // 3
 *
 * @param {Array | Matrix} [data]    A multi dimensional array
 * @return {Matrix} matrix
 */
math.matrix = function matrix(data) {
    if (arguments.length > 1) {
        throw newArgumentsError('matrix', arguments.length, 0, 1);
    }

    return new Matrix(data);
};

/**
 * Create a number or convert a string to a number
 * @param {String | Number | Boolean} [value]
 * @return {Number} num
 */
math.number = function (value) {
    switch (arguments.length) {
        case 0:
            return 0;
        case 1:
            var num = Number(value);
            if (isNaN(num)) {
                num = Number(value.valueOf());
            }
            if (isNaN(num)) {
                throw new SyntaxError(value.toString() + ' is no valid number');
            }
            return num;
        default:
            throw newArgumentsError('number', arguments.length, 0, 1);
    }
};

/**
 * Create a parser. The function creates a new math.expr.Parser object.
 *
 *    parser()
 *
 * Example usage:
 *     var parser = new math.parser();
 *
 *     // evaluate expressions
 *     var a = parser.eval('sqrt(3^2 + 4^2)'); // 5
 *     var b = parser.eval('sqrt(-4)');        // 2i
 *     var c = parser.eval('2 inch in cm');    // 5.08 cm
 *     var d = parser.eval('cos(45 deg)');     // 0.7071067811865476
 *
 *     // define variables and functions
 *     parser.eval('x = 7 / 2');               // 3.5
 *     parser.eval('x + 3');                   // 6.5
 *     parser.eval('function f(x, y) = x^y');  // f(x, y)
 *     parser.eval('f(2, 3)');                 // 8
 *
 *     // get and set variables and functions
 *     var x = parser.get('x');                // 7
 *     var f = parser.get('f');                // function
 *     var g = f(3, 2);                        // 9
 *     parser.set('h', 500);
 *     var i = parser.eval('h / 2');           // 250
 *     parser.set('hello', function (name) {
 *         return 'hello, ' + name + '!';
 *     });
 *     parser.eval('hello("user")');           // "hello, user!"
 *
 *     // clear defined functions and variables
 *     parser.clear();
 *
 * @return {math.expr.Parser} Parser
 */
math.parser = function parser() {
    return new math.expr.Parser();
};

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
math.range = function range(args) {
    switch (arguments.length) {
        case 1:
            // parse string into a range
            if (args instanceof Range) {
                // create a clone
                return args.clone();
            }
            else if (isString(args)) {
                var r = Range.parse(args);
                if (r) {
                    return r;
                }
                else {
                    throw new SyntaxError('String "' + r + '" is no valid range');
                }
            }
            else {
                throw new TypeError(
                    'Two or three numbers or a single string expected in function range');
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
};

/**
 * Create a string or convert any object into a string
 * @param {*} [value]
 * @return {String} str
 */
math.string = function (value) {
    switch (arguments.length) {
        case 0:
            return '';

        case 1:
            return _toString(value);

        default:
            throw newArgumentsError('string', arguments.length, 0, 1);
    }
};

/**
 * Recursive toString function
 * @param {*} value  Value can be anything: number, string, array, Matrix, ...
 * @returns {String} str
 * @private
 */
function _toString(value) {
    if (value instanceof Array || value instanceof Matrix || value instanceof Range) {
        var array = value.valueOf();

        var str = '[';
        var len = array.length;
        for (var i = 0; i < len; i++) {
            if (i != 0) {
                str += ', ';
            }
            str += _toString(array[i]);
        }
        str += ']';
        return str;
    }
    else if (isNumber(value)) {
        return util.formatNumber(value); // no digits specified
    }
    else {
        return value.toString();
    }
}
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
math.unit = function unit(args) {
    switch(arguments.length) {
        case 1:
            // parse a string
            var arg = arguments[0];
            if (arg instanceof Unit) {
                // create a clone of the unit
                return arg.clone();
            }
            else if (isString(arg)) {
                if (Unit.isPlainUnit(arg)) {
                    return new Unit(null, arg); // a pure unit
                }

                var u = Unit.parse(arg);        // a unit with value, like '5cm'
                if (u) {
                    return u;
                }

                throw new SyntaxError('String "' + arg + '" is no valid unit');
            }
            else {
                throw new TypeError('A string or a number and string expected in function unit');
            }
            break;

        case 2:
            // a number and a unit
            return new Unit(arguments[0], arguments[1]);
            break;

        default:
            throw newArgumentsError('unit', arguments.length, 1, 2);
    }
};

math.workspace = function () {
    throw new Error('Workspace is no longer supported, sorry...');
};
/**
 * Concatenate two or more matrices
 * Usage:
 *     math.concat(A, B, C, ...)
 *     math.concat(A, B, C, ..., dim)
 *
 * Where the optional dim is the zero-based number of the dimension to be
 * concatenated.
 *
 * @param {... Array | Matrix} args
 * @return {Array | Matrix} res
 */
math.concat = function concat (args) {
    var i,
        len = arguments.length,
        dim = -1,  // zero-based dimension
        prevDim,
        asMatrix = false,
        matrices = [];  // contains multi dimensional arrays

    for (i = 0; i < len; i++) {
        var arg = arguments[i];

        // test whether we need to return a Matrix (if not we return an Array)
        if (arg instanceof Matrix) {
            asMatrix = true;
        }

        if ((i == len - 1) && isNumber(arg)) {
            // last argument contains the dimension on which to concatenate
            prevDim = dim;
            dim = arg;

            if (!isInteger(dim) || dim < 0) {
                throw new TypeError('Dimension number must be a positive integer ' +
                    '(dim = ' + dim + ')');
            }

            if (i > 0 && dim > prevDim) {
                throw new RangeError('Dimension out of range ' +
                    '(' + dim + ' > ' + prevDim + ')');
            }
        }
        else if (arg instanceof Array || arg instanceof Matrix) {
            // this is a matrix or array
            var matrix = math.clone(arg).valueOf();
            var size = math.size(arg).valueOf();
            matrices[i] = matrix;
            prevDim = dim;
            dim = size.length - 1;

            // verify whether each of the matrices has the same number of dimensions
            if (i > 0 && dim != prevDim) {
                throw new RangeError('Dimension mismatch ' +
                    '(' + prevDim + ' != ' + dim + ')');
            }
        }
        else {
            throw newUnsupportedTypeError('concat', arg);
        }
    }

    if (matrices.length == 0) {
        throw new SyntaxError('At least one matrix expected');
    }

    var res = matrices.shift();
    while (matrices.length) {
        res = _concat(res, matrices.shift(), dim, 0);
    }

    return asMatrix ? new Matrix(res) : res;
};

/**
 * Recursively concatenate two matrices.
 * The contents of the matrices is not cloned.
 * @param {Array} a             Multi dimensional array
 * @param {Array} b             Multi dimensional array
 * @param {Number} concatDim    The dimension on which to concatenate (zero-based)
 * @param {Number} dim          The current dim (zero-based)
 * @return {Array} c            The concatenated matrix
 * @private
 */
function _concat(a, b, concatDim, dim) {
    if (dim < concatDim) {
        // recurse into next dimension
        if (a.length != b.length) {
            throw new Error('Dimensions mismatch (' + a.length + ' != ' + b.length + ')');
        }

        var c = [];
        for (var i = 0; i < a.length; i++) {
            c[i] = _concat(a[i], b[i], concatDim, dim + 1);
        }
        return c;
    }
    else {
        // concatenate this dimension
        return a.concat(b);
    }
}

/**
 * @constructor det
 * Calculate the determinant of a matrix
 *
 *     det(x)
 *
 * @param {Array | Matrix} x
 * @return {Number} determinant
 */
math.det = function det (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('det', arguments.length, 1);
    }

    var size = math.size(x).valueOf();
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
};

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
        // this is an n x n matrix
        var det = 1;
        var lead = 0;
        for (var r = 0; r < rows; r++) {
            if (lead >= cols) {
                break;
            }
            var i = r;
            // Find the pivot element.
            while (matrix[i][lead] == 0) {
                i++;
                if (i == rows) {
                    i = r;
                    lead++;
                    if (lead == cols) {
                        // We found the last pivot.
                        if (util.deepEqual(matrix, math.eye(rows).valueOf())) {
                            return math.round(det, 6);
                        } else {
                            return 0;
                        }
                    }
                }
            }
            if (i != r) {
                // Swap rows i and r, which negates the determinant.
                for (var a = 0; a < cols; a++) {
                    var temp = matrix[i][a];
                    matrix[i][a] = matrix[r][a];
                    matrix[r][a] = temp;
                }
                det *= -1;
            }
            // Scale row r and the determinant simultaneously.
            var div = matrix[r][lead];
            for (var a = 0; a < cols; a++) {
                matrix[r][a] = matrix[r][a] / div;
            }
            det *= div;
            // Back-substitute upwards.
            for (var j = 0; j < rows; j++) {
                if (j != r) {
                    // Taking linear combinations does not change the det.
                    var c = matrix[j][lead];
                    for (var a = 0; a < cols; a++) {
                        matrix[j][a] = matrix[j][a] - matrix[r][a] * c;
                    }
                }
            }
            lead++; // Now looking for a pivot further right.
        }
        // If reduction did not result in the identity, the matrix is singular.
        if (util.deepEqual(matrix, math.eye(rows).valueOf())) {
            return math.round(det, 6);
        } else {
            return 0;
        }
    }
}

/**
 * Create a diagonal matrix or retrieve the diagonal of a matrix
 *
 *     diag(v)
 *     diag(v, k)
 *     diag(X)
 *     diag(X, k)
 *
 * TODO: more documentation on diag
 *
 * @param {Number | Matrix | Array} x
 * @param {Number} [k]
 * @return {Matrix} matrix
 */
math.diag = function diag (x, k) {
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
                data[i + kSub][i + kSuper] = math.clone(vector[i]);
            }
            return matrix;
        break;

        case 2:
            // x is a matrix get diagonal from matrix
            vector = [];
            data = x.valueOf();
            iMax = Math.min(s[0] - kSub, s[1] - kSuper);
            for (i = 0; i < iMax; i++) {
                vector[i] = math.clone(data[i + kSub][i + kSuper]);
            }
            return new Matrix(vector);
        break;

        default:
            throw new RangeError('Matrix for function diag must be 2 dimensional');
    }
};

/**
 * Create an identity matrix with size m x n
 *
 *     eye(m)
 *     eye(m, n)
 *
 * TODO: more documentation on eye
 *
 * @param {...Number | Matrix | Array} size
 * @return {Matrix} matrix
 */
math.eye = function eye (size) {
    var args = util.argsToArray(arguments);
    if (args.length == 0) {
        args = [1, 1];
    }
    else if (args.length == 1) {
        args[1] = args[0];
    }
    else if (args.length > 2) {
        throw newArgumentsError('eye', args.length, 0, 2);
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
};

/**
 * Calculate the inverse of a matrix
 *
 *     inv(x)
 *
 * TODO: more documentation on inv
 *
 * @param {Array | Matrix} x
 * @return {Array | Matrix} inv
 */
math.inv = function inv (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('inv', arguments.length, 1);
    }

    var size = math.size(x).valueOf();
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
};

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
        unary = math.unary,
        multiply = math.multiply,
        divide = math.divide;

    if (rows == 1) {
        // this is a 1 x 1 matrix
        value = matrix[0][0];
        if (value == 0) {
            throw Error('Cannot calculate inverse, determinant is zero');
        }
        return [[
            divide(1, value)
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
                divide(unary(matrix[0][1]), det)
            ],
            [
                divide(unary(matrix[1][0]), det),
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
                        f = divide(unary(Ar[c]), Ac[c]);

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
 * Create a matrix filled with ones
 *
 *     ones(n)
 *     ones(m, n)
 *     ones([m, n])
 *     ones([m, n, p, ...])
 *
 * @param {...Number | Array} size
 * @return {Matrix} matrix
 */
math.ones = function ones (size) {
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
};

/**
 * Calculate the size of a matrix or scalar
 *
 *     size(x)
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.size = function size (x) {
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

    if (x instanceof Matrix) {
        return new Matrix(x.size());
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.size(x.valueOf());
    }

    throw newUnsupportedTypeError('size', x);
};

/**
 * Remove singleton dimensions from a matrix
 *
 *     squeeze(x)
 *
 * @param {Matrix | Array} x
 * @return {Matrix | Array} res
 */
math.squeeze = function squeeze (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('squeeze', arguments.length, 1);
    }

    if (x instanceof Array) {
        return _squeezeArray(math.clone(x));
    }
    else if (x instanceof Matrix) {
        return math.matrix(_squeezeArray(x.toArray()));
    }
    else if (x.valueOf() instanceof Array) {
        return _squeezeArray(math.clone(x.valueOf()));
    }
    else {
        // scalar
        return math.clone(x);
    }
};

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
 * Get or set a subset of a matrix or string
 *
 * Usage:
 *     var subset = math.subset(value, index)               // retrieve subset
 *     var value = math.subset(value, index, replacement)   // replace subset
 *
 * Where:
 *     {*} value        An array, matrix, or scalar value
 *     {Array} index    An array containing index values
 *     {*} replacement  An array, matrix, or scalar
 *
 * @param args
 * @return res
 */
math.subset = function subset (args) {
    switch (arguments.length) {
        case 2: // get subset
            return _getSubset(arguments[0], arguments[1]);

        case 3: // set subset
            return _setSubset(arguments[0], arguments[1], arguments[2]);

        default: // wrong number of arguments
            throw newArgumentsError('subset', arguments.length, 2, 3);
    }
};

/**
 * Retrieve a subset of an value such as an Array, Matrix, or String
 * @param {*} value            Object from which to get a subset
 * @param {Array[] | Range[] | Number[] | Matrix} index
 *                              Two dimensional array (size 1 x n) containing
 *                              the indexes to be retrieved. Can also be a two
 *                              dimensional Matrix (size 1 x n), or an Array
 *                              (size 1) containing a Range or a Number.
 * @returns {*} subset
 * @private
 */
function _getSubset(value, index) {
    var matrix, subset;

    if (value instanceof Array || value instanceof Range) {
        matrix = math.matrix(value);
        subset = matrix.get(index);
        return subset.valueOf();
    }
    else if (value instanceof Matrix) {
        return value.get(index);
    }
    else if (isString(value)) {
        return _getSubstring(value, index);
    }
    else {
        // scalar
        matrix = math.matrix([value]);
        subset = matrix.get(index);
        return subset.valueOf();
    }
}

/**
 * Retrieve a subset of a string
 * @param {String} str          String from which to get a substring
 * @param {Array[] | Range[] | Number[] | Matrix} index
 *                              Two dimensional array (size 1 x n) containing
 *                              the indexes to be retrieved. Can also be a two
 *                              dimensional Matrix (size 1 x n), or an Array
 *                              (size 1) containing a Range or a Number.
 * @returns {string} substring
 * @private
 */
function _getSubstring(str, index) {
    var i, len;
    index = index.valueOf(); // cast from matrix or range to array
    if (index.length != 1) {
        throw new RangeError('Dimension mismatch (' + index.length + ' != 1)');
    }

    if (index instanceof Array) {
        index = index[0];   // read first dimension
    }
    index = index.valueOf(); // cast from matrix or range to array
    if (!(index instanceof Array)) {
        index = [index];
    }

    var substr = '';
    var strLen = str.length;
    for (i = 0, len = index.length; i < len; i++) {
        var index_i = index[i];
        util.validateIndex(index_i, strLen);
        substr += str.charAt(index_i);  // index_i is zero based
    }

    return substr;
}

/**
 * Replace a subset in an value such as an Array, Matrix, or String
 * @param {*} value            Object to be replaced
 * @param {Array[] | Range[] | Number[] | Matrix} index
 *                              Two dimensional array (size 1 x n) containing
 *                              the indexes to be replaced. Can also be a two
 *                              dimensional Matrix (size 1 x n), or an Array
 *                              (size 1) containing a Range.
 * @param {String} replacement
 * @returns {*} result
 * @private
 */
function _setSubset(value, index, replacement) {
    if (value instanceof Array || value instanceof Range) {
        var matrix = math.matrix(math.clone(value));
        matrix.set(index, replacement);
        return matrix.valueOf();
    }
    else if (value instanceof Matrix) {
        return value.clone().set(index, replacement);
    }
    else if (isString(value)) {
        return _setSubstring(value, index, replacement);
    }
    else {
        // scalar
        matrix = math.matrix([value]);
        matrix.set(index, replacement);

        if (matrix.isScalar()) {
            // still a scalar
            return matrix.toScalar();
        }
        else {
            // changed into a matrix. return array
            return matrix.valueOf();
        }
    }
}

/**
 * Replace a substring in a string
 * @param {String} str          String to be replaced
 * @param {Array[] | Range[] | Number[] | Matrix} index
 *                              Two dimensional array (size 1 x n) containing
 *                              the indexes to be replaced. Can also be a two
 *                              dimensional Matrix (size 1 x n), or an Array
 *                              (size 1) containing a Range.
 * @param {String} replacement  Replacement string
 * @returns {string} result
 * @private
 */
function _setSubstring(str, index, replacement) {
    var i, len;
    index = index.valueOf();  // cast from matrix or range to array

    if (index.length != 1) {
        throw new RangeError('Dimension mismatch (' + index.length + ' != 1)');
    }
    if (index instanceof Array) {
        index = index[0];   // read first dimension
    }
    index = index.valueOf(); // cast from matrix or range to array
    if (!(index instanceof Array)) {
        index = [index];
    }

    if (index.length != replacement.length) {
        throw new RangeError('Dimension mismatch ' +
            '(' + index.length + ' != ' + replacement.length + ')');
    }

    // copy the string into an array with characters
    var strLen = str.length;
    var chars = [];
    for (i = 0; i < strLen; i++) {
        chars[i] = str.charAt(i);
    }

    for (i = 0, len = index.length; i < len; i++) {
        var index_i = index[i];
        util.validateIndex(index_i);
        chars[index_i] = replacement.charAt(i); // index_i is zero based
    }

    // initialize undefined characters with a space
    if (chars.length > strLen) {
        for (i = strLen - 1, len = chars.length; i < len; i++) {
            if (!chars[i]) {
                chars[i] = ' ';
            }
        }
    }

    return chars.join('');
}

/**
 * Create the transpose of a matrix
 *
 *     transpose(x)
 *
 * @param {Array | Matrix} x
 * @return {Array | Matrix} transpose
 */
math.transpose = function transpose (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('transpose', arguments.length, 1);
    }

    var size = math.size(x).valueOf();
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
                asMatrix = x instanceof Matrix,
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
            return asMatrix ? new Matrix(transposed) : transposed;
            break;

        default:
            // multi dimensional array
            throw new RangeError('Matrix must be two dimensional ' +
                '(size: ' + math.format(size) + ')');
    }
};

/**
 * create a matrix filled with zeros
 *
 *     zeros(n)
 *     zeros(m, n)
 *     zeros([m, n])
 *     zeros([m, n, p, ...])
 *
 * @param {...Number | Array} size
 * @return {Matrix} matrix
 */
math.zeros = function zeros (size) {
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
};

/**
 * Compute the factorial of a value
 *
 *     x!
 *     factorial(x)
 *
 * Factorial only supports an integer value as argument.
 * For matrices, the function is evaluated element wise.
 *
 * @Param {Number | Array | Matrix} x
 * @return {Number | Array | Matrix} res
 */
math.factorial = function factorial (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('factorial', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (!isInteger(x) || x < 0) {
            throw new TypeError('Positive integer value expected in function factorial');
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

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.factorial);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.factorial(x.valueOf());
    }

    throw newUnsupportedTypeError('factorial', x);
};

/**
 * Return a random number between 0 and 1
 *
 *     random()
 *
 * @return {Number} res
 */

// Each distribution is a function that takes no argument and when called returns
// a number between 0 and 1.
var distributions = {

    uniform: function() {
        return Math.random;
    },

    // Implementation of normal distribution using Box-Muller transform
    // ref : http://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
    // We take : mean = 0.5, standard deviation = 1/6
    // so that 99.7% values are in [0, 1].
    normal: function() {
        return function() {
            var u1, u2,
                picked = -1
            // We reject values outside of the interval [0, 1]
            // TODO: check if it is ok to do that?
            while (picked < 0 || picked > 1) {
                u1 = Math.random();
                u2 = Math.random();
                picked = 1/6 * Math.pow(-2 * Math.log(u1), 0.5) * Math.cos(2 * Math.PI * u2) + 0.5;
            }
            return picked;
        }
    }
};

math.distribution = function(name) {
    if (!distributions.hasOwnProperty(name))
        throw new Error('unknown distribution ' + name);

    var args = Array.prototype.slice.call(arguments, 1),
        distribution = distributions[name].apply(this, args);

    // We wrap all the random functions into one object which uses the given distribution.
    return (function(distribution) {

        var randFunctions = {

            random: function(min, max) {
                if (arguments.length > 2)
                    newArgumentsError('random', arguments.length, 0, 2);
                if (max === undefined) max = 1
                if (min === undefined) min = 0
                return min + distribution() * (max - min);
            },

            randomInt: function(min, max) {
                if (arguments.length > 2)
                    newArgumentsError('randomInt', arguments.length, 0, 2);
                return Math.floor(this.random(min, max));
            },

            pickRandom: function(possibles) {
                if (arguments.length !== 1)
                    newArgumentsError('pickRandom', arguments.length, 1);
                return possibles[Math.floor(Math.random() * possibles.length)];
            },

            randomMatrix: function(size, min, max) {
                if (arguments.length > 3 || arguments.length < 1)
                    newArgumentsError('pickRandom', arguments.length, 1, 3);
                debugger
                return new Matrix(_randomDataForMatrix(size, min, max));
            }
        };

        var _randomDataForMatrix = function(size, min, max) {
            var data = [], length, i;
            size = size.slice(0);

            if (size.length > 1) {
                for (i = 0, length = size.shift(); i < length; i++)
                    data.push(_randomDataForMatrix(size, min, max));
            } else {
                for (i = 0, length = size.shift(); i < length; i++)
                    data.push(randFunctions.random.call(randFunctions, min, max));
            }

            return data;
        };

        return randFunctions;

    })(distribution);

};

// Default random functions use uniform distribution
var uniformRandFunctions = math.distribution('uniform');
math.random = uniformRandFunctions.random;
math.randomInt = uniformRandFunctions.randomInt;
math.pickRandom = uniformRandFunctions.pickRandom;
math.randomMatrix = uniformRandFunctions.randomMatrix;
/**
 * Compute the maximum value of a list of values
 *
 *     max(a, b, c, ...)
 *     max([a, b, c, ...])
 *
 * @param {... *} args  A single matrix or or multiple scalar values
 * @return {*} res
 */
math.max = function max(args) {
    if (arguments.length == 0) {
        throw new Error('Function max requires one or more parameters (0 provided)');
    }

    if (args instanceof Array || args instanceof Matrix || args instanceof Range) {
        // max([a, b, c, d, ...]])
        if (arguments.length > 1) {
            throw Error('Wrong number of parameters (1 matrix or multiple scalars expected)');
        }

        var size = math.size(args).valueOf();

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
};

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
 * Compute the minimum value of a list of values
 *
 *     min(a, b, c, ...)
 *     min([a, b, c, ...])
 *
 * @param {... *} args  A single matrix or multiple scalars
 * @return {*} res
 */
math.min = function min(args) {
    if (arguments.length == 0) {
        throw new Error('Function min requires one or more parameters (0 provided)');
    }

    if (args instanceof Array || args instanceof Matrix || args instanceof Range) {
        // min([a, b, c, d, ...]])
        if (arguments.length > 1) {
            throw Error('Wrong number of parameters (1 matrix or multiple scalars expected)');
        }

        var size = math.size(args).valueOf();

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
};

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
 * Calculate the inverse cosine of a value
 *
 *     acos(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/InverseCosine.html
 */
math.acos = function acos(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('acos', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= -1 && x <= 1) {
            return Math.acos(x);
        }
        else {
            return math.acos(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        // acos(z) = 0.5*pi + i*log(iz + sqrt(1-z^2))
        var temp1 = Complex.create(
            x.im * x.im - x.re * x.re + 1.0,
            -2.0 * x.re * x.im
        );
        var temp2 = math.sqrt(temp1);
        var temp3;
        if (temp2 instanceof Complex) {
            temp3 = Complex.create(
                temp2.re - x.im,
                temp2.im + x.re
            )
        }
        else {
            temp3 = Complex.create(
                temp2 - x.im,
                x.re
            )
        }
        var temp4 = math.log(temp3);

        // 0.5*pi = 1.5707963267948966192313216916398
        if (temp4 instanceof Complex) {
            return Complex.create(
                1.57079632679489661923 - temp4.im,
                temp4.re
            );
        }
        else {
            return new Complex(
                1.57079632679489661923,
                temp4
            );
        }
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.acos);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.acos(x.valueOf());
    }

    throw newUnsupportedTypeError('acos', x);
};

/**
 * Calculate the inverse sine of a value
 *
 *     asin(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/InverseSine.html
 */
math.asin = function asin(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('asin', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= -1 && x <= 1) {
            return Math.asin(x);
        }
        else {
            return math.asin(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        // asin(z) = -i*log(iz + sqrt(1-z^2))
        var re = x.re;
        var im = x.im;
        var temp1 = Complex.create(
            im * im - re * re + 1.0,
            -2.0 * re * im
        );

        var temp2 = math.sqrt(temp1);
        var temp3;
        if (temp2 instanceof Complex) {
            temp3 = Complex.create(
                temp2.re - im,
                temp2.im + re
            );
        }
        else {
            temp3 = Complex.create(
                temp2 - im,
                re
            );
        }

        var temp4 = math.log(temp3);

        if (temp4 instanceof Complex) {
            return Complex.create(temp4.im, -temp4.re);
        }
        else {
            return Complex.create(0, -temp4);
        }
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.asin);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.asin(x.valueOf());
    }

    throw newUnsupportedTypeError('asin', x);
};

/**
 * Calculate the inverse tangent of a value
 *
 *     atan(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/InverseTangent.html
 */
math.atan = function atan(x) {
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

        var temp1 = Complex.create(
            (1.0 - im * im - re * re) / den,
            (-2.0 * re) / den
        );
        var temp2 = math.log(temp1);

        if (temp2 instanceof Complex) {
            return Complex.create(
                -0.5 * temp2.im,
                0.5 * temp2.re
            );
        }
        else {
            return Complex.create(
                0,
                0.5 * temp2
            );
        }
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.atan);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.atan(x.valueOf());
    }

    throw newUnsupportedTypeError('atan', x);
};

/**
 * Computes the principal value of the arc tangent of y/x in radians
 *
 *     atan2(y, x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} y
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/InverseTangent.html
 */
math.atan2 = function atan2(y, x) {
    if (arguments.length != 2) {
        throw newArgumentsError('atan2', arguments.length, 2);
    }

    if (isNumber(y)) {
        if (isNumber(x)) {
            return Math.atan2(y, x);
        }
        /* TODO: support for complex computation of atan2
        else if (x instanceof Complex) {
            return Math.atan2(y.re, x.re);
        }
        */
    }
    else if (y instanceof Complex) {
        if (isNumber(x)) {
            return Math.atan2(y.re, x);
        }
        /* TODO: support for complex computation of atan2
        else if (x instanceof Complex) {
            return Math.atan2(y.re, x.re);
        }
        */
    }

    if (y instanceof Array || y instanceof Matrix ||
        x instanceof Array || x instanceof Matrix) {
        return util.map2(y, x, math.atan2);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.atan2(y.valueOf(), x.valueOf());
    }

    throw newUnsupportedTypeError('atan2', y, x);
};

/**
 * Calculate the cosine of a value
 *
 *     cos(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/Cosine.html
 */
math.cos = function cos(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('cos', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.cos(x);
    }

    if (x instanceof Complex) {
        // cos(z) = (exp(iz) + exp(-iz)) / 2
        return Complex.create(
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

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.cos);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.cos(x.valueOf());
    }

    throw newUnsupportedTypeError('cos', x);
};

/**
 * Calculate the cotangent of a value. cot(x) is defined as 1 / tan(x)
 *
 *     cot(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.cot = function cot(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('cot', arguments.length, 1);
    }

    if (isNumber(x)) {
        return 1 / Math.tan(x);
    }

    if (x instanceof Complex) {
        var den = Math.exp(-4.0 * x.im) -
            2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) + 1.0;

        return Complex.create(
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

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.cot);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.cot(x.valueOf());
    }

    throw newUnsupportedTypeError('cot', x);
};

/**
 * Calculate the cosecant of a value, csc(x) = 1/sin(x)
 *
 *     csc(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.csc = function csc(x) {
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

        return Complex.create (
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

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.csc);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.csc(x.valueOf());
    }

    throw newUnsupportedTypeError('csc', x);
};

/**
 * Calculate the secant of a value, sec(x) = 1/cos(x)
 *
 *     sec(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.sec = function sec(x) {
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
        return Complex.create(
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

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.sec);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.sec(x.valueOf());
    }

    throw newUnsupportedTypeError('sec', x);
};

/**
 * Calculate the sine of a value
 *
 *     sin(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/Sine.html
 */
math.sin = function sin(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('sin', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.sin(x);
    }

    if (x instanceof Complex) {
        return Complex.create(
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

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.sin);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.sin(x.valueOf());
    }

    throw newUnsupportedTypeError('sin', x);
};

/**
 * Calculate the tangent of a value
 *
 *     tan(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/Tangent.html
 */
math.tan = function tan(x) {
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

        return Complex.create(
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

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.tan);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.tan(x.valueOf());
    }

    throw newUnsupportedTypeError('tan', x);
};

/**
 * Change the unit of a value.
 *
 *     x in unit
 *     in(x, unit)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Unit | Array | Matrix} x
 * @param {Unit | Array | Matrix} unit
 * @return {Unit | Array | Matrix} res
 */
math['in'] = function unit_in(x, unit) {
    if (arguments.length != 2) {
        throw newArgumentsError('in', arguments.length, 2);
    }

    if (x instanceof Unit) {
        if (unit instanceof Unit || isString(unit)) {
            return x['in'](unit);
        }
    }

    // TODO: add support for string, in that case, convert to unit

    if (x instanceof Array || x instanceof Matrix ||
        unit instanceof Array || unit instanceof Matrix) {
        return util.map2(x, unit, math['in']);
    }

    if (x.valueOf() !== x || unit.valueOf() !== unit) {
        // fallback on the objects primitive value
        return math['in'](x.valueOf(), unit.valueOf());
    }

    throw newUnsupportedTypeError('in', x, unit);
};

/**
 * Clone an object
 *
 *     clone(x)
 *
 * @param {*} x
 * @return {*} clone
 */
math.clone = function clone(x) {
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
        var c = math.clone;
        return x.map(function (value) {
            return c(value);
        });
    }

    if (x instanceof Object) {
        return util.mapObject(x, math.clone);
    }

    throw newUnsupportedTypeError('clone', x);
};

/**
 * Evaluate an expression.
 *
 * Syntax:
 *
 *     math.eval(expr)
 *     math.eval(expr, scope)
 *     math.eval([expr1, expr2, expr3, ...])
 *     math.eval([expr1, expr2, expr3, ...], scope)
 *
 * Example:
 *
 *     math.eval('(2+3)/4');                // 1.25
 *     math.eval('sqrt(3^2 + 4^2)');        // 5
 *     math.eval('sqrt(-4)');               // 2i
 *     math.eval(['a=3', 'b=4', 'a*b']);,   // [3, 4, 12]
 *
 *     var scope = {a:3, b:4};
 *     math.eval('a * b', scope);           // 12
 *
 * @param {String | String[] | Matrix} expr
 * @param {math.expr.Scope | Object} [scope]
 * @return {*} res
 * @throws {Error}
 */
math.eval = function (expr, scope) {
    if (arguments.length != 1 && arguments.length != 2) {
        throw newArgumentsError('eval', arguments.length, 1, 2);
    }

    // instantiate a scope
    var evalScope;
    if (scope) {
        if (scope instanceof math.expr.Scope) {
            evalScope = scope;
        }
        else {
            evalScope = new math.expr.Scope(scope);
        }
    }
    else {
        evalScope = new math.expr.Scope();
    }

    if (isString(expr)) {
        // evaluate a single expression
        var node = math.parse(expr, evalScope);
        return node.eval();
    }
    else if (expr instanceof Array || expr instanceof Matrix) {
        // evaluate an array or matrix with expressions
        return util.map(expr, function (elem) {
            var node = math.parse(elem, evalScope);
            return node.eval();
        });
    }
    else {
        // oops
        throw new TypeError('String or matrix expected');
    }
};

/**
 * Format a value of any type into a string. Interpolate values into the string.
 * Numbers are rounded off to a maximum number of 5 digits by default.
 * Usage:
 *     math.format(value)
 *     math.format(template, object)
 *
 * Example usage:
 *     math.format(2/7);                // '0.28571'
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
math.format = function format(template, values) {
    var num = arguments.length;
    if (num != 1 && num != 2) {
        throw newArgumentsError('format', num, 1, 2);
    }

    if (num == 1) {
        // just format a value as string
        var value = arguments[0];
        if (isNumber(value)) {
            return util.formatNumber(value, math.options.precision);
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
};

/**
 * Retrieve help on a function or data type.
 * Help files are retrieved from the documentation in math.docs.
 * @param {function | string | Object} search
 * @return {Help} help
 */
math.help = function help(search) {
    if (arguments.length != 1) {
        throw new SyntaxError('Wrong number of arguments in function help ' +
            '(' + arguments.length + ' provided, 1 expected)');
    }

    var text = null;
    if ((search instanceof String) || (typeof(search) === 'string')) {
        text = search;
    }
    else {
        var prop;
        for (prop in math) {
            // search in functions and constants
            if (math.hasOwnProperty(prop)) {
                if (search === math[prop]) {
                    text = prop;
                    break;
                }
            }
        }

        if (!text) {
            // search data type
            for (prop in math.type) {
                if (math.type.hasOwnProperty(prop)) {
                    if (search === math.type[prop]) {
                        text = prop;
                        break;
                    }
                }
            }
        }
    }

    if (!text) {
        throw new Error('Could not find search term "' + search + '"');
    }
    else {
        var doc = math.docs[text];
        if (!doc) {
            throw new Error('No documentation found on "' + text + '"');
        }
        return new Help(doc);
    }
};

/**
 * Import functions from an object or a file
 * @param {function | String | Object} object
 * @param {Object} [options]        Available options:
 *                                  {Boolean} override
 *                                      If true, existing functions will be
 *                                      overwritten. False by default.
 *                                  {Boolean} wrap
 *                                      If true (default), the functions will
 *                                      be wrapped in a wrapper function which
 *                                      converts data types like Matrix to
 *                                      primitive data types like Array.
 *                                      The wrapper is needed when extending
 *                                      math.js with libraries which do not
 *                                      support the math.js data types.
 */
// TODO: return status information
math['import'] = function math_import(object, options) {
    var name;
    var opts = {
        override: false,
        wrap: true
    };
    if (options && options instanceof Object) {
        util.extend(opts, options);
    }

    if (isString(object)) {
        // a string with a filename
        if (typeof (require) !== 'undefined') {
            // load the file using require
            var _module = require(object);
            math['import'](_module);
        }
        else {
            throw new Error('Cannot load file: require not available.');
        }
    }
    else if (isSupportedType(object)) {
        // a single function
        name = object.name;
        if (name) {
            if (opts.override || math[name] === undefined) {
                _import(name, object, opts);
            }
        }
        else {
            throw new Error('Cannot import an unnamed function or object');
        }
    }
    else if (object instanceof Object) {
        // a map with functions
        for (name in object) {
            if (object.hasOwnProperty(name)) {
                var value = object[name];
                if (isSupportedType(value)) {
                    _import(name, value, opts);
                }
                else {
                    math['import'](value);
                }
            }
        }
    }
};

/**
 * Add a property to the math namespace and create a chain proxy for it.
 * @param {String} name
 * @param {*} value
 * @param {Object} options  See import for a description of the options
 * @private
 */
function _import(name, value, options) {
    if (options.override || math[name] === undefined) {
        // add to math namespace
        if (options.wrap && typeof value === 'function') {
            // create a wrapper around the function
            math[name] = function () {
                var args = [];
                for (var i = 0, len = arguments.length; i < len; i++) {
                    args[i] = arguments[i].valueOf();
                }
                return value.apply(math, args);
            };
        }
        else {
            // just create a link to the function or value
            math[name] = value;
        }

        // create a proxy for the Selector
        createSelectorProxy(name, value);
    }

}

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

(function () {
    /**
     * Parse an expression. Returns a node tree, which can be evaluated by
     * invoking node.eval();
     *
     * Syntax:
     *
     *     math.parse(expr)
     *     math.parse(expr, scope)
     *     math.parse([expr1, expr2, expr3, ...])
     *     math.parse([expr1, expr2, expr3, ...], scope)
     *
     * Example:
     *
     *     var node = math.parse('sqrt(3^2 + 4^2)');
     *     node.eval(); // 5
     *
     *     var scope = {a:3, b:4}
     *     var node = math.parse('a * b', scope); // 12
     *     node.eval(); // 12
     *     scope.a = 5;
     *     node.eval(); // 20
     *
     *     var nodes = math.parse(['a = 3', 'b = 4', 'a * b']);
     *     nodes[2].eval(); // 12
     *
     * @param {String | String[] | Matrix} expr
     * @param {math.expr.Scope | Object} [scope]
     * @return {Node | Node[]} node
     * @throws {Error}
     */
    math.parse = function (expr, scope) {
        if (arguments.length != 1 && arguments.length != 2) {
            throw newArgumentsError('parse', arguments.length, 1, 2);
        }

        // instantiate a scope
        var parseScope;
        if (scope) {
            if (scope instanceof math.expr.Scope) {
                parseScope = scope;
            }
            else {
                parseScope = new math.expr.Scope(scope);
            }
        }
        else {
            parseScope = new math.expr.Scope();
        }

        if (isString(expr)) {
            // parse a single expression
            expression = expr || '';
            return parse_start(parseScope);
        }
        else if (expr instanceof Array || expr instanceof Matrix) {
            // parse an array or matrix with expressions
            return util.map(expr, function (elem) {
                expression = elem || '';
                return parse_start(parseScope);
            });
        }
        else {
            // oops
            throw new TypeError('String or matrix expected');
        }
    };

    // token types enumeration
    var TOKENTYPE = {
        NULL : 0,
        DELIMITER : 1,
        NUMBER : 2,
        SYMBOL : 3,
        UNKNOWN : 4
    };

    // map with all delimiters
    var DELIMITERS = {
        ',': true,
        '(': true,
        ')': true,
        '[': true,
        ']': true,
        '\"': true,
        '\n': true,
        ';': true,

        '+': true,
        '-': true,
        '*': true,
        '.*': true,
        '/': true,
        './': true,
        '%': true,
        '^': true,
        '.^': true,
        '!': true,
        '\'': true,
        '=': true,
        ':': true,

        '==': true,
        '!=': true,
        '<': true,
        '>': true,
        '<=': true,
        '>=': true
    };

    var handlers = math.expr.node.handlers;

    var expression = '';  // current expression
    var index = 0;        // current index in expr
    var c = '';           // current token character in expr
    var token = '';       // current token
    var token_type = TOKENTYPE.NULL; // type of the token

    /**
     * Get the first character from the expression.
     * The character is stored into the char c. If the end of the expression is
     * reached, the function puts an empty string in c.
     * @private
     */
    function first() {
        index = 0;
        c = expression.charAt(0);
    }

    /**
     * Get the next character from the expression.
     * The character is stored into the char c. If the end of the expression is
     * reached, the function puts an empty string in c.
     * @private
     */
    function next() {
        index++;
        c = expression.charAt(index);
    }

    /**
     * Preview the next character from the expression.
     * @return {String} cNext
     * @private
     */
    function nextPreview() {
        return expression.charAt(index + 1);
    }

    /**
     * Get next token in the current string expr.
     * The token and token type are available as token and token_type
     * @private
     */
    function getToken() {
        token_type = TOKENTYPE.NULL;
        token = '';

        // skip over whitespaces
        while (c == ' ' || c == '\t') {  // space or tab
            next();
        }

        // skip comment
        if (c == '#') {
            while (c != '\n' && c != '') {
                next();
            }
        }

        // check for end of expression
        if (c == '') {
            // token is still empty
            token_type = TOKENTYPE.DELIMITER;
            return;
        }

        // check for delimiters consisting of 2 characters
        var c2 = c + nextPreview();
        if (DELIMITERS[c2]) {
            token_type = TOKENTYPE.DELIMITER;
            token = c2;
            next();
            next();
            return;
        }

        // check for delimiters consisting of 1 character
        if (DELIMITERS[c]) {
            token_type = TOKENTYPE.DELIMITER;
            token = c;
            next();
            return;
        }

        // check for a number
        if (isDigitDot(c)) {
            token_type = TOKENTYPE.NUMBER;

            // get number, can have a single dot
            if (c == '.') {
                token += c;
                next();

                if (!isDigit(c)) {
                    // this is no legal number, it is just a dot
                    token_type = TOKENTYPE.UNKNOWN;
                }
            }
            else {
                while (isDigit(c)) {
                    token += c;
                    next();
                }
                if (c == '.') {
                    token += c;
                    next();
                }
            }
            while (isDigit(c)) {
                token += c;
                next();
            }

            // check for scientific notation like "2.3e-4" or "1.23e50"
            if (c == 'E' || c == 'e') {
                token += c;
                next();

                if (c == '+' || c == '-') {
                    token += c;
                    next();
                }

                // Scientific notation MUST be followed by an exponent
                if (!isDigit(c)) {
                    // this is no legal number, exponent is missing.
                    token_type = TOKENTYPE.UNKNOWN;
                }

                while (isDigit(c)) {
                    token += c;
                    next();
                }
            }

            return;
        }

        // check for variables or functions
        if (isAlpha(c)) {
            token_type = TOKENTYPE.SYMBOL;

            while (isAlpha(c) || isDigit(c)) {
                token += c;
                next();
            }
            return;
        }

        // something unknown is found, wrong characters -> a syntax error
        token_type = TOKENTYPE.UNKNOWN;
        while (c != '') {
            token += c;
            next();
        }
        throw createSyntaxError('Syntax error in part "' + token + '"');
    }

    /**
     * Check if a given name is valid
     * if not, an error is thrown
     * @param {String} name
     * @return {boolean} valid
     * @private
     */
    // TODO: check for valid symbol name
    function isValidSymbolName (name) {
        for (var i = 0, iMax = name.length; i < iMax; i++) {
            var c = name.charAt(i);
            //var valid = (isAlpha(c) || (i > 0 && isDigit(c))); // TODO: allow digits in symbol name
            var valid = (isAlpha(c));
            if (!valid) {
                return false;
            }
        }

        return true;
    }

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
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_start (scope) {
        // get the first character in expression
        first();

        getToken();

        var node;
        if (token == '') {
            // empty expression
            node = new ConstantNode(undefined);
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
     * Parse a block with expressions. Expressions can be separated by a newline
     * character '\n', or by a semicolon ';'. In case of a semicolon, no output
     * of the preceding line is returned.
     * @param {math.expr.Scope} scope
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
                block = new BlockNode();
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
     * Parse assignment of ans.
     * Ans is assigned when the expression itself is no variable or function
     * assignment
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_ans (scope) {
        var expression = parse_function_assignment(scope);

        // create a variable definition for ans
        var name = 'ans';
        return new AssignmentNode(name, expression, scope);
    }

    /**
     * Parse a function assignment like "function f(a,b) = a*b"
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_function_assignment (scope) {
        // TODO: keyword 'function' must become a reserved keyword
        // TODO: replace the 'function' keyword with an assignment operator '=>'
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
            var functionScope = scope.createSubScope();
            var variables = [];
            while (true) {
                getToken();
                if (token_type == TOKENTYPE.SYMBOL) {
                    // store variable name
                    variables.push(token);
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
            var expression = parse_assignment(functionScope);

            return new FunctionNode(name, variables, expression, functionScope, scope);
        }

        return parse_assignment(scope);
    }

    /**
     * Assignment of a variable, can be a variable like "a=2.3" or a updating an
     * existing variable like "matrix(2,3:5)=[6,7,8]"
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_assignment (scope) {
        var name, params, paramScopes, expr;

        var node = parse_range(scope);

        if (token == '=') {
            if (node instanceof SymbolNode) {
                // parse the expression, with the correct function scope
                getToken();
                name = node.name;
                params = null;
                expr = parse_assignment(scope);
                return new AssignmentNode(name, expr, scope);
            }
            else if (node instanceof ParamsNode && node.object instanceof SymbolNode) {
                // parse the expression, with the correct function scope
                getToken();
                name = node.object.name;
                params = node.params;
                paramScopes = node.paramScopes;
                expr = parse_assignment(scope);
                return new UpdateNode(name, params, paramScopes, expr, scope);
            }
            else {
                throw createSyntaxError('Symbol expected at the left hand side ' +
                    'of assignment operator =');
            }
        }

        return node;
    }

    /**
     * parse range, "start:end", "start:step:end", ":", "start:", ":end", etc
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_range (scope) {
        var node, name, fn, params = [];

        if (token == ':') {
            // implicit start=0
            node = new ConstantNode(0);
        }
        else {
            // explicit start
            node = parse_conditions(scope);
        }

        if (token == ':') {
            params.push(node);

            // parse step and end
            while (token == ':') {
                getToken();
                if (token == ')' || token == ',' || token == '') {
                    // implicit end
                    params.push(new SymbolNode('end', scope));
                }
                else {
                    // explicit end
                    params.push(parse_conditions(scope));
                }
            }

            if (params.length) {
                // create a range constructor
                name = 'range';
                fn = math.range;
                node = new OperatorNode(name, fn, params);
            }
        }

        return node;
    }

    /**
     * conditions like and, or, in
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_conditions (scope) {
        var node, operators, name, fn, params;

        node = parse_bitwise_conditions(scope);

        // TODO: precedence of And above Or?
        // TODO: implement a method for unit to number conversion
        operators = {
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
            name = token;
            fn = math[operators[name]];

            getToken();
            params = [node, parse_bitwise_conditions(scope)];
            node = new OperatorNode(name, fn, params);
        }

        return node;
    }

    /**
     * conditional operators and bitshift
     * @param {math.expr.Scope} scope
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
         node = new OperatorNode(name, fn, params);
         }
         */

        return node;
    }

    /**
     * comparison operators
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_comparison (scope) {
        var node, operators, name, fn, params;

        node = parse_addsubtract(scope);

        operators = {
            '==': 'equal',
            '!=': 'unequal',
            '<': 'smaller',
            '>': 'larger',
            '<=': 'smallereq',
            '>=': 'largereq'
        };
        while (operators[token] !== undefined) {
            name = token;
            fn = math[operators[name]];

            getToken();
            params = [node, parse_addsubtract(scope)];
            node = new OperatorNode(name, fn, params);
        }

        return node;
    }

    /**
     * add or subtract
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_addsubtract (scope)  {
        var node, operators, name, fn, params;

        node = parse_multiplydivide(scope);

        operators = {
            '+': 'add',
            '-': 'subtract'
        };
        while (operators[token] !== undefined) {
            name = token;
            fn = math[operators[name]];

            getToken();
            params = [node, parse_multiplydivide(scope)];
            node = new OperatorNode(name, fn, params);
        }

        return node;
    }

    /**
     * multiply, divide, modulus
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_multiplydivide (scope) {
        var node, operators, name, fn, params;

        node = parse_unary(scope);

        operators = {
            '*': 'multiply',
            '.*': 'emultiply',
            '/': 'divide',
            './': 'edivide',
            '%': 'mod',
            'mod': 'mod'
        };

        while (operators[token] !== undefined) {
            name = token;
            fn = math[operators[name]];

            getToken();
            params = [node, parse_unary(scope)];
            node = new OperatorNode(name, fn, params);
        }

        return node;
    }

    /**
     * Unary minus
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_unary (scope) {
        var name, fn, params;

        if (token == '-') {
            name = token;
            fn = math.unary;
            getToken();
            params = [parse_pow(scope)];

            return new OperatorNode(name, fn, params);
        }

        return parse_pow(scope);
    }

    /**
     * power
     * Node: power operator is right associative
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_pow (scope) {
        var node, leftNode, nodes, ops, name, fn, params;

        nodes = [
            parse_factorial(scope)
        ];
        ops = [];

        // stack all operands of a chained power operator (like '2^3^3')
        while (token == '^' || token == '.^') {
            ops.push(token);
            getToken();
            nodes.push(parse_factorial(scope));
        }

        // evaluate the operands from right to left (right associative)
        node = nodes.pop();
        while (nodes.length) {
            leftNode = nodes.pop();
            name = ops.pop();
            fn = (name == '^') ? math.pow : math.epow;
            params = [leftNode, node];
            node = new OperatorNode(name, fn, params);
        }

        return node;
    }

    /**
     * Factorial
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_factorial (scope)  {
        var node, name, fn, params;

        node = parse_transpose(scope);

        while (token == '!') {
            name = token;
            fn = math.factorial;
            getToken();
            params = [node];

            node = new OperatorNode(name, fn, params);
        }

        return node;
    }

    /**
     * Transpose
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_transpose (scope)  {
        var node, name, fn, params;

        node = parse_node_handler(scope);

        while (token == '\'') {
            name = token;
            fn = math.transpose;
            getToken();
            params = [node];

            node = new OperatorNode(name, fn, params);
        }

        return node;
    }

    /**
     * Parse a custom node handler. A node handler can be used to process
     * nodes in a custom way, for example for handling a plot.
     *
     * A handler must be defined in the namespace math.expr.node.handlers,
     * and must extend math.expr.node.Node, and the handler must contain
     * functions eval(), find(filter), and toString().
     *
     * For example:
     *
     *     math.expr.node.handlers['plot'] = PlotHandler;
     *
     * The constructor of the handler is called as:
     *
     *     node = new PlotHandler(params, paramScopes);
     *
     * The handler will be invoked when evaluating an expression like:
     *
     *     node = math.parse('plot(sin(x), x)');
     *
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_node_handler (scope) {
        var params,
            paramScopes,
            paramScope,
            handler;

        if (token_type == TOKENTYPE.SYMBOL && handlers[token]) {
            handler = handlers[token];

            getToken();

            // parse parameters
            if (token == '(') {
                params = [];
                paramScopes = [];

                getToken();

                if (token != ')') {
                    paramScope = scope.createSubScope();
                    paramScopes.push(paramScope);
                    params.push(parse_range(paramScope));

                    // parse a list with parameters
                    while (token == ',') {
                        getToken();

                        paramScope = scope.createSubScope();
                        paramScopes.push(paramScope);
                        params.push(parse_range(paramScope));
                    }
                }

                if (token != ')') {
                    throw createSyntaxError('Parenthesis ) expected');
                }
                getToken();
            }

            // create a new node handler
            //noinspection JSValidateTypes
            return new handler(params, paramScopes);
        }

        return parse_symbol(scope);
    }

    /**
     * parse symbols: functions, variables, constants, units
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_symbol (scope) {
        var node, name;

        if (token_type == TOKENTYPE.SYMBOL) {
            name = token;

            getToken();

            // create a symbol
            node = new SymbolNode(name, scope);

            // parse parameters
            return parse_params(scope, node);
        }

        return parse_string(scope);
    }

    /**
     * parse parameters, enclosed in parenthesis
     * @param {math.expr.Scope} scope
     * @param {Node} node    Node on which to apply the parameters. If there
     *                       are no parameters in the expression, the node
     *                       itself is returned
     * @return {Node} node
     * @private
     */
    function parse_params (scope, node) {
        var params,
            paramScopes,
            paramScope;

        while (token == '(') {
            params = [];
            paramScopes = [];

            getToken();

            if (token != ')') {
                paramScope = scope.createSubScope();
                paramScopes.push(paramScope);
                params.push(parse_range(paramScope));

                // parse a list with parameters
                while (token == ',') {
                    getToken();

                    paramScope = scope.createSubScope();
                    paramScopes.push(paramScope);
                    params.push(parse_range(paramScope));
                }
            }

            if (token != ')') {
                throw createSyntaxError('Parenthesis ) expected');
            }
            getToken();

            node = new ParamsNode(node, params, paramScopes);
        }

        return node;
    }

    /**
     * parse a string.
     * A string is enclosed by double quotes
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_string (scope) {
        var node, str, tPrev;

        if (token == '"') {
            // string "..."
            str = '';
            tPrev = '';
            while (c != '' && (c != '\"' || tPrev == '\\')) { // also handle escape character
                str += c;
                tPrev = c;
                next();
            }

            getToken();
            if (token != '"') {
                throw createSyntaxError('End of string " expected');
            }
            getToken();

            // create constant
            node = new ConstantNode(str);

            // parse parameters
            node = parse_params(scope, node);

            return node;
        }

        return parse_matrix(scope);
    }

    /**
     * parse the matrix
     * @param {math.expr.Scope} scope
     * @return {Node} A MatrixNode
     * @private
     */
    function parse_matrix (scope) {
        var array, params, r, c, rows, cols;

        if (token == '[') {
            // matrix [...]

            // skip newlines
            getToken();
            while (token == '\n') {
                getToken();
            }

            // check if this is an empty matrix "[ ]"
            if (token != ']') {
                // this is a non-empty matrix
                params = [];
                r = 0;
                c = 0;

                params[0] = [parse_assignment(scope)];

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

                    params[r][c] = parse_assignment(scope);

                    // skip newlines
                    while (token == '\n') {
                        getToken();
                    }
                }

                // TODO: spaces as separator for matrix columns
                /*
                // the columns in the matrix are separated by commas or spaces,
                // and the rows by dot-comma's
                while (token && token != ']') {
                    if (token == ';') {
                        r++;
                        c = 0;
                        params[r] = [];
                        getToken();
                    }
                    else if (token == ',') {
                        c++;
                        getToken();
                    }
                    else {
                        c++;
                    }

                    // skip newlines
                    while (token == '\n') {
                        getToken();
                    }

                    //TODO: math.eval('[1 -2 3]') is evaluated as '[(1-2) 3]' instead of '[(1) (-2) (3)]'
                    //TODO: '[(1) (-2) (3)]' doesn't work
                    params[r][c] = parse_assignment(scope);

                    // skip newlines
                    while (token == '\n') {
                        getToken();
                    }
                }
                */

                rows =  params.length;
                cols = (params.length > 0) ? params[0].length : 0;

                // check if the number of columns matches in all rows
                for (r = 1; r < rows; r++) {
                    if (params[r].length != cols) {
                        throw createError('Number of columns must match ' +
                            '(' + params[r].length + ' != ' + cols + ')');
                    }
                }

                if (token != ']') {
                    throw createSyntaxError('End of matrix ] expected');
                }

                getToken();
                array = new MatrixNode(params);
            }
            else {
                // this is an empty matrix "[ ]"
                getToken();
                array = new MatrixNode([[]]);
            }

            // parse parameters
            array = parse_params(scope, array);

            return array;
        }

        return parse_number(scope);
    }

    /**
     * parse a number
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_number (scope) {
        var node, value, number;

        if (token_type == TOKENTYPE.NUMBER) {
            // this is a number
            if (token == '.') {
                number = 0;
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

            if (token_type == TOKENTYPE.SYMBOL) {
                if (token == 'i' || token == 'I') {
                    value = new Complex(0, number);
                    getToken();
                    return new ConstantNode(value);
                }

                if (Unit.isPlainUnit(token)) {
                    value = new Unit(number, token);
                    getToken();
                    return new ConstantNode(value);
                }

                throw createTypeError('Unknown unit "' + token + '"');
            }

            // just a regular number
            node = new ConstantNode(number);

            // parse parameters
            node = parse_params(scope, node);

            return node;
        }

        return parse_parentheses(scope);
    }

    /**
     * parentheses
     * @param {math.expr.Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_parentheses (scope) {
        var node;

        // check if it is a parenthesized expression
        if (token == '(') {
            // parentheses (...)
            getToken();
            node = parse_assignment(scope); // start again

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

            // parse parameters
            node = parse_params(scope, node);

            return node;
        }

        return parse_end(scope);
    }

    /**
     * Evaluated when the expression is not yet ended but expected to end
     * @param {math.expr.Scope} scope
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
        var r = row();
        var c = col();
        if (r === undefined) {
            if (c === undefined) {
                return message;
            } else {
                return message + ' (char ' + c + ')';
            }
        } else {
            return message + ' (line ' + r + ', char ' + c + ')';
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

/**
 * Wrap any value in a Selector, allowing to perform chained operations on
 * the value.
 *
 * All methods available in the math.js library can be called upon the selector,
 * and then will be evaluated with the value itself as first argument.
 * The selector can be closed by executing selector.done(), which will return
 * the final value.
 *
 * Example usage:
 *     math.select(3)
 *         .add(4)
 *         .subtract(2)
 *         .done();     // 5
 *     math.select( [[1, 2], [3, 4]] )
 *         .set([1, 1], 8)
 *         .multiply(3)
 *         .done();     // [[24, 6], [9, 12]]
 *
 * The Selector has a number of special functions:
 * - done()     Finalize the chained operation and return the selectors value.
 * - valueOf()  The same as done()
 * - toString() Executes math.format() onto the selectors value, returning
 *              a string representation of the value.
 * - get(...)   Get a subselection of the selectors value. Only applicable when
 *              the value has a method get, for example when value is a Matrix
 *              or Array.
 * - set(...)   Replace a subselection of the selectors value. Only applicable
 *              when the value has a method get, for example when value is a
 *              Matrix or Array.
 *
 * @param {*} value
 * @return {math.type.Selector} selector
 */
math.select = function select(value) {
    return new math.type.Selector(value);
};

/**
 * Determine the type of a variable
 *
 *     typeof(x)
 *
 * @param {*} x
 * @return {String} type  Lower case type, for example "number", "string",
 *                        "array".
 */
math['typeof'] = function math_typeof(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('typeof', arguments.length, 1);
    }

    var type = typeof x,
        name;

    if (type == 'object') {
        if (x == null) {
            return 'null';
        }
        if (x instanceof Boolean) {
            return 'boolean';
        }
        if (x instanceof Number) {
            return 'number';
        }
        if (x instanceof String) {
            return 'string';
        }
        if (x instanceof Array) {
            return 'array';
        }
        if (x instanceof Date) {
            return 'date';
        }
        if (x.constructor) {
            // search functions / constants
            for (name in math) {
                if (math.hasOwnProperty(name)) {
                    if (x.constructor == math[name]) {
                        return name.toLowerCase();
                    }
                }
            }

            // search data types
            for (name in math.type) {
                if (math.type.hasOwnProperty(name)) {
                    if (x.constructor == math.type[name]) {
                        return name.toLowerCase();
                    }
                }
            }

            // try the constructors name as last resort
            if (x.constructor.name) {
                return x.constructor.name.toLowerCase();
            }
        }
    }

    return type;
};

math.docs['Infinity'] = {
    'name': 'Infinity',
    'category': 'Constants',
    'syntax': [
        'Infinity'
    ],
    'description': 'Infinity, a number which is larger than the maximum number that can be handled by a floating point number.',
    'examples': [
        'Infinity',
        '1 / 0'
    ],
    'seealso': []
};

math.docs.LN10 = {
    'name': 'LN10',
    'category': 'Constants',
    'syntax': [
        'LN10'
    ],
    'description': 'Returns the natural logarithm of 10, approximately equal to 2.302',
    'examples': [
        'LN10',
        'log(10)'
    ],
    'seealso': []
};

math.docs.LN2 = {
    'name': 'LN2',
    'category': 'Constants',
    'syntax': [
        'LN2'
    ],
    'description': 'Returns the natural logarithm of 2, approximately equal to 0.693',
    'examples': [
        'LN2',
        'log(2)'
    ],
    'seealso': []
};

math.docs.LOG10E = {
    'name': 'LOG10E',
    'category': 'Constants',
    'syntax': [
        'LOG10E'
    ],
    'description': 'Returns the base-10 logarithm of E, approximately equal to 0.434',
    'examples': [
        'LOG10E',
        'log(e, 10)'
    ],
    'seealso': []
};

math.docs.LOG2E = {
    'name': 'LOG2E',
    'category': 'Constants',
    'syntax': [
        'LOG2E'
    ],
    'description': 'Returns the base-2 logarithm of E, approximately equal to 1.442',
    'examples': [
        'LOG2E',
        'log(e, 2)'
    ],
    'seealso': []
};

math.docs['NaN'] = {
    'name': 'NaN',
    'category': 'Constants',
    'syntax': [
        'NaN'
    ],
    'description': 'Not a number',
    'examples': [
        'NaN',
        '0 / 0'
    ],
    'seealso': []
};

math.docs.SQRT1_2 = {
    'name': 'SQRT1_2',
    'category': 'Constants',
    'syntax': [
        'SQRT1_2'
    ],
    'description': 'Returns the square root of 1/2, approximately equal to 0.707',
    'examples': [
        'SQRT1_2',
        'sqrt(1/2)'
    ],
    'seealso': []
};

math.docs.SQRT2 = {
    'name': 'SQRT2',
    'category': 'Constants',
    'syntax': [
        'SQRT2'
    ],
    'description': 'Returns the square root of 2, approximately equal to 1.414',
    'examples': [
        'SQRT2',
        'sqrt(2)'
    ],
    'seealso': []
};

math.docs.e = math.docs.E = {
    'name': 'e',
    'category': 'Constants',
    'syntax': [
        'e'
    ],
    'description': 'Euler\'s number, the base of the natural logarithm. Approximately equal to 2.71828',
    'examples': [
        'e',
        'e ^ 2',
        'exp(2)',
        'log(e)'
    ],
    'seealso': ['exp']
};

math.docs['false'] = {
    'name': 'false',
    'category': 'Constants',
    'syntax': [
        'false'
    ],
    'description': 'Boolean value false',
    'examples': [
        'false'
    ],
    'seealso': ['true']
};

math.docs.i = {
    'name': 'i',
    'category': 'Constants',
    'syntax': [
        'i'
    ],
    'description': 'Imaginary unit, defined as i*i=-1. A complex number is described as a + b*i, where a is the real part, and b is the imaginary part.',
    'examples': [
        'i',
        'i * i',
        'sqrt(-1)'
    ],
    'seealso': []
};

math.docs.pi = math.docs.PI = {
    'name': 'pi',
    'category': 'Constants',
    'syntax': [
        'pi'
    ],
    'description': 'The number pi is a mathematical constant that is the ratio of a circle\'s circumference to its diameter, and is approximately equal to 3.14159',
    'examples': [
        'pi',
        'sin(pi/2)'
    ],
    'seealso': ['tau']
};

math.docs.tau = {
    'name': 'tau',
    'category': 'Constants',
    'syntax': [
        'pi'
    ],
    'description': 'Tau is the ratio constant of a circle\'s circumference to radius, equal to 2 * pi, approximately 6.2832.',
    'examples': [
        'tau',
        '2 * pi'
    ],
    'seealso': ['pi']
};

math.docs['true'] = {
    'name': 'true',
    'category': 'Constants',
    'syntax': [
        'true'
    ],
    'description': 'Boolean value true',
    'examples': [
        'true'
    ],
    'seealso': ['false']
};

math.docs.abs = {
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

math.docs.add = {
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

math.docs.ceil = {
    'name': 'ceil',
    'category': 'Arithmetic',
    'syntax': [
        'ceil(x)'
    ],
    'description':
        'Round a value towards plus infinity.If x is complex, both real and imaginary part are rounded towards plus infinity.',
    'examples': [
        'ceil(3.2)',
        'ceil(3.8)',
        'ceil(-4.2)'
    ],
    'seealso': ['floor', 'fix', 'round']
};

math.docs.cube = {
    'name': 'cube',
    'category': 'Arithmetic',
    'syntax': [
        'cube(x)'
    ],
    'description': 'Compute the cube of a value. The cube of x is x * x * x.',
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

math.docs.divide = {
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

math.docs.edivide = {
    'name': 'edivide',
    'category': 'Operators',
    'syntax': [
        'x ./ y',
        'edivide(x, y)'
    ],
    'description': 'divide two values element wise.',
    'examples': [
        'a = [1, 2, 3; 4, 5, 6]',
        'b = [2, 1, 1; 3, 2, 5]',
        'a ./ b'
    ],
    'seealso': [
        'multiply',
        'emultiply',
        'divide'
    ]
};

math.docs.emultiply = {
    'name': 'emultiply',
    'category': 'Operators',
    'syntax': [
        'x .* y',
        'emultiply(x, y)'
    ],
    'description': 'multiply two values element wise.',
    'examples': [
        'a = [1, 2, 3; 4, 5, 6]',
        'b = [2, 1, 1; 3, 2, 5]',
        'a .* b'
    ],
    'seealso': [
        'multiply',
        'divide',
        'edivide'
    ]
};

math.docs.epow = {
    'name': 'epow',
    'category': 'Operators',
    'syntax': [
        'x .^ y',
        'epow(x, y)'
    ],
    'description':
        'Calculates the power of x to y element wise.',
    'examples': [
        'a = [1, 2, 3; 4, 5, 6]',
        'a .^ 2'
    ],
    'seealso': [
        'pow'
    ]
};

math.docs.equal = {
    'name': 'equal',
    'category': 'Operators',
    'syntax': [
        'x == y',
        'equal(x, y)'
    ],
    'description':
        'Check equality of two values. Returns 1 if the values are equal, and 0 if not.',
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

math.docs.exp = {
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

math.docs.fix = {
    'name': 'fix',
    'category': 'Arithmetic',
    'syntax': [
        'fix(x)'
    ],
    'description':
        'Round a value towards zero.If x is complex, both real and imaginary part are rounded towards zero.',
    'examples': [
        'fix(3.2)',
        'fix(3.8)',
        'fix(-4.2)',
        'fix(-4.8)'
    ],
    'seealso': ['ceil', 'floor', 'round']
};

math.docs.floor = {
    'name': 'floor',
    'category': 'Arithmetic',
    'syntax': [
        'floor(x)'
    ],
    'description':
        'Round a value towards minus infinity.If x is complex, both real and imaginary part are rounded towards minus infinity.',
    'examples': [
        'floor(3.2)',
        'floor(3.8)',
        'floor(-4.2)'
    ],
    'seealso': ['ceil', 'fix', 'round']
};

math.docs.gcd = {
    'name': 'gcd',
    'category': 'Arithmetic',
    'syntax': [
        'gcd(a, b)',
        'gcd(a, b, c, ...)'
    ],
    'description': 'Compute the greatest common divisor.',
    'examples': [
        'gcd(8, 12)',
        'gcd(-4, 6)',
        'gcd(25, 15, -10)'
    ],
    'seealso': [ 'lcm', 'xgcd' ]
};

math.docs.larger = {
    'name': 'larger',
    'category': 'Operators',
    'syntax': [
        'x > y',
        'larger(x, y)'
    ],
    'description':
        'Check if value x is larger than y. Returns 1 if x is larger than y, and 0 if not.',
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

math.docs.largereq = {
    'name': 'largereq',
    'category': 'Operators',
    'syntax': [
        'x >= y',
        'largereq(x, y)'
    ],
    'description':
        'Check if value x is larger or equal to y. Returns 1 if x is larger or equal to y, and 0 if not.',
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

math.docs.lcm = {
    'name': 'lcm',
    'category': 'Arithmetic',
    'syntax': [
        'lcm(x, y)'
    ],
    'description': 'Compute the least common multiple.',
    'examples': [
        'lcm(4, 6)',
        'lcm(6, 21)',
        'lcm(6, 21, 5)'
    ],
    'seealso': [ 'gcd' ]
};

math.docs.log = {
    'name': 'log',
    'category': 'Arithmetic',
    'syntax': [
        'log(x)',
        'log(x, base)'
    ],
    'description': 'Compute the logarithm of a value. If no base is provided, the natural logarithm of x is calculated. If base if provided, the logarithm is calculated for the specified base. log(x, base) is defined as log(x) / log(base).',
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
math.docs.log10 = {
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

math.docs.mod = {
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

math.docs.multiply = {
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

math.docs.pow = {
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

math.docs.round = {
    'name': 'round',
    'category': 'Arithmetic',
    'syntax': [
        'round(x)',
        'round(x, n)'
    ],
    'description':
        'round a value towards the nearest integer.If x is complex, both real and imaginary part are rounded towards the nearest integer. When n is specified, the value is rounded to n decimals.',
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

math.docs.sign = {
    'name': 'sign',
    'category': 'Arithmetic',
    'syntax': [
        'sign(x)'
    ],
    'description':
        'Compute the sign of a value. The sign of a value x is 1 when x>1, -1 when x<0, and 0 when x=0.',
    'examples': [
        'sign(3.5)',
        'sign(-4.2)',
        'sign(0)'
    ],
    'seealso': [
        'abs'
    ]
};

math.docs.smaller = {
    'name': 'smaller',
    'category': 'Operators',
    'syntax': [
        'x < y',
        'smaller(x, y)'
    ],
    'description':
        'Check if value x is smaller than value y. Returns 1 if x is smaller than y, and 0 if not.',
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

math.docs.smallereq = {
    'name': 'smallereq',
    'category': 'Operators',
    'syntax': [
        'x <= y',
        'smallereq(x, y)'
    ],
    'description':
        'Check if value x is smaller or equal to value y. Returns 1 if x is smaller than y, and 0 if not.',
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

math.docs.sqrt = {
    'name': 'sqrt',
    'category': 'Arithmetic',
    'syntax': [
        'sqrt(x)'
    ],
    'description':
        'Compute the square root value. If x = y * y, then y is the square root of x.',
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

math.docs.square = {
    'name': 'square',
    'category': 'Arithmetic',
    'syntax': [
        'square(x)'
    ],
    'description':
        'Compute the square of a value. The square of x is x * x.',
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

math.docs.subtract = {
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

math.docs.unary = {
    'name': 'unary',
    'category': 'Operators',
    'syntax': [
        '-x',
        'unary(x)'
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

math.docs.unequal = {
    'name': 'unequal',
    'category': 'Operators',
    'syntax': [
        'x != y',
        'unequal(x, y)'
    ],
    'description':
        'Check unequality of two values. Returns 1 if the values are unequal, and 0 if they are equal.',
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

math.docs.xgcd = {
    'name': 'xgcd',
    'category': 'Arithmetic',
    'syntax': [
        'xgcd(a, b)'
    ],
    'description': 'Calculate the extended greatest common divisor for two values',
    'examples': [
        'xgcd(8, 12)',
        'gcd(8, 12)',
        'xgcd(36163, 21199)'
    ],
    'seealso': [ 'gcd', 'lcm' ]
};

math.docs.arg = {
    'name': 'arg',
    'category': 'Complex',
    'syntax': [
        'arg(x)'
    ],
    'description':
        'Compute the argument of a complex value. If x = a+bi, the argument is computed as atan2(b, a).',
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

math.docs.conj = {
    'name': 'conj',
    'category': 'Complex',
    'syntax': [
        'conj(x)'
    ],
    'description':
        'Compute the complex conjugate of a complex value. If x = a+bi, the complex conjugate is a-bi.',
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

math.docs.im = {
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

math.docs.re = {
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

math.docs['boolean'] = {
    'name': 'boolean',
    'category': 'Type',
    'syntax': [
        'x',
        'boolean(x)'
    ],
    'description':
        'Convert a string or number into a boolean.',
    'examples': [
        'boolean(0)',
        'boolean(1)',
        'boolean(3)',
        'boolean("true")',
        'boolean("false")'
    ],
    'seealso': [
        'complex', 'matrix', 'range', 'string', 'unit'
    ]
};

math.docs.complex = {
    'name': 'complex',
    'category': 'Type',
    'syntax': [
        'complex()',
        'complex(re, im)',
        'complex(string)'
    ],
    'description':
        'Create a complex number.',
    'examples': [
        'complex()',
        'complex(2, 3)',
        'complex("7 - 2i")'
    ],
    'seealso': [
        'boolean', 'matrix', 'number', 'range', 'string', 'unit'
    ]
};

math.docs.matrix = {
    'name': 'matrix',
    'category': 'Type',
    'syntax': [
        '[]',
        '[a1, b1, ...; a2, b2, ...]',
        'matrix()',
        'matrix([...])'
    ],
    'description':
        'Create a matrix.',
    'examples': [
        '[]',
        '[1, 2, 3]',
        '[1, 2, 3; 4, 5, 6]',
        'matrix()',
        'matrix([3, 4])'
    ],
    'seealso': [
        'boolean', 'complex', 'number', 'range', 'string', 'unit'
    ]
};

math.docs.number = {
    'name': 'number',
    'category': 'Type',
    'syntax': [
        'x',
        'number(x)'
    ],
    'description':
        'Create a number or convert a string or boolean into a number.',
    'examples': [
        '2',
        '2e3',
        '4.05',
        'number(2)',
        'number("7.2")',
        'number(true)'
    ],
    'seealso': [
        'boolean', 'complex', 'matrix', 'range', 'string', 'unit'
    ]
};

math.docs.range = {
    'name': 'range',
    'category': 'Type',
    'syntax': [
        'start:end',
        'start:step:end',
        'range(start, end)',
        'range(start, step, end)',
        'range(string)'
    ],
    'description':
        'Create a range.',
    'examples': [
        '1:5',
        '3:-1:-3',
        'range(3, 6)',
        'range(0, 2, 10)',
        'range("4:10")',
        'a = [1, 2, 3; 4, 5, 6]',
        'a(:, 1:2)'
    ],
    'seealso': [
        'boolean', 'complex', 'matrix', 'number', 'string', 'unit'
    ]
};

math.docs.string = {
    'name': 'string',
    'category': 'Type',
    'syntax': [
        '"text"',
        'string(x)'
    ],
    'description':
        'Create a string or convert a value to a string',
    'examples': [
        '"Hello World!"',
        'string(4.2)',
        'string(3 + 2i)'
    ],
    'seealso': [
        'boolean', 'complex', 'matrix', 'number', 'range', 'unit'
    ]
};

math.docs.unit = {
    'name': 'unit',
    'category': 'Type',
    'syntax': [
        'value unit',
        'unit(value, unit)',
        'unit(string)'
    ],
    'description':
        'Create a unit.',
    'examples': [
        '5.5 mm',
        '3 inch',
        'unit(7.1, "kilogram")',
        'unit("23 deg")'
    ],
    'seealso': [
        'boolean', 'complex', 'matrix', 'number', 'range', 'string'
    ]
};

math.docs.concat = {
    'name': 'concat',
    'category': 'Matrix',
    'syntax': [
        'concat(a, b, c, ...)',
        'concat(a, b, c, ..., dim)'
    ],
    'description': 'Concatenate matrices. By default, the matrices are concatenated by the first dimension. The dimension on which to concatenate can be provided as last argument.',
    'examples': [
        'a = [1, 2; 5, 6]',
        'b = [3, 4; 7, 8]',
        'concat(a, b)',
        '[a, b]',
        'concat(a, b, 2)',
        '[a; b]'
    ],
    'seealso': [
        'det', 'diag', 'eye', 'inv', 'ones', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
    ]
};

math.docs.det = {
    'name': 'det',
    'category': 'Matrix',
    'syntax': [
        'det(x)'
    ],
    'description': 'Calculate the determinant of a matrix',
    'examples': [
        'det([1, 2; 3, 4])',
        'det([-2, 2, 3; -1, 1, 3; 2, 0, -1])'
    ],
    'seealso': [
        'concat', 'diag', 'eye', 'inv', 'ones', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
    ]
};

math.docs.diag = {
    'name': 'diag',
    'category': 'Matrix',
    'syntax': [
        'diag(x)',
        'diag(x, k)'
    ],
    'description': 'Create a diagonal matrix or retrieve the diagonal of a matrix. When x is a vector, a matrix with the vector values on the diagonal will be returned. When x is a matrix, a vector with the diagonal values of the matrix is returned.When k is provided, the k-th diagonal will be filled in or retrieved, if k is positive, the values are placed on the super diagonal. When k is negative, the values are placed on the sub diagonal.',
    'examples': [
        'diag(1:4)',
        'diag(1:4, 1)',
        'a = [1, 2, 3; 4, 5, 6; 7, 8, 9]',
        'diag(a)'
    ],
    'seealso': [
        'concat', 'det', 'eye', 'inv', 'ones', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
    ]
};

math.docs.eye = {
    'name': 'eye',
    'category': 'Matrix',
    'syntax': [
        'eye(n)',
        'eye(m, n)',
        'eye([m, n])',
        'eye'
    ],
    'description': 'Returns the identity matrix with size m-by-n. The matrix has ones on the diagonal and zeros elsewhere.',
    'examples': [
        'eye(3)',
        'eye(3, 5)',
        'a = [1, 2, 3; 4, 5, 6]',
        'eye(size(a))'
    ],
    'seealso': [
        'concat', 'det', 'diag', 'inv', 'ones', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
    ]
};

math.docs.inv = {
    'name': 'inv',
    'category': 'Matrix',
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
        'concat', 'det', 'diag', 'eye', 'ones', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
    ]
};

math.docs.ones = {
    'name': 'ones',
    'category': 'Matrix',
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
        'concat', 'det', 'diag', 'eye', 'inv', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
    ]
};

math.docs.size = {
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
        'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'squeeze', 'subset', 'transpose', 'zeros'
    ]
};

math.docs.squeeze = {
    'name': 'squeeze',
    'category': 'Matrix',
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
        'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'size', 'subset', 'transpose', 'zeros'
    ]
};

math.docs.subset = {
    'name': 'subset',
    'category': 'Matrix',
    'syntax': [
        'value(index)',
        'value(index) = replacement',
        'subset(value, [index])',
        'subset(value, [index], replacement)'
    ],
    'description': 'Get or set a subset of a matrix or string.',
    'examples': [
        'd = [1, 2; 3, 4]',
        'e = []',
        'e(0, 0:1) = [5, 6]',
        'e(1, :) = [7, 8]',
        'f = d * e',
        'f(1, 0)',
        'f(:, 0)'
    ],
    'seealso': [
        'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'transpose', 'zeros'
    ]
};

math.docs.transpose = {
    'name': 'transpose',
    'category': 'Matrix',
    'syntax': [
        'x\'',
        'transpose(x)'
    ],
    'description': 'Transpose a matrix',
    'examples': [
        'a = [1, 2, 3; 4, 5, 6]',
        'a\'',
        'transpose(a)'
    ],
    'seealso': [
        'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'size', 'squeeze', 'subset', 'zeros'
    ]
};

math.docs.zeros = {
    'name': 'zeros',
    'category': 'Matrix',
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
        'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'size', 'squeeze', 'subset', 'transpose'
    ]
};

math.docs.factorial = {
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

math.docs.random = {
    'name': 'random',
    'category': 'Probability',
    'syntax': [
        'random(min, max)'
    ],
    'description':
        'Return a random number between 0 and 1.',
    'examples': [
        'random()'
    ],
    'seealso': []
};

math.docs.randInt = {
    'name': 'randInt',
    'category': 'Probability',
    'syntax': [
        'randInt()'
    ],
    'description':
        'Return a random number between 0 and 1.',
    'examples': [
        'randInt()'
    ],
    'seealso': []
};
math.docs.max = {
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
        //'sum',
        //'prod',
        //'avg',
        //'var',
        //'std',
        'min'
        //'median'
    ]
};

math.docs.min = {
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
        //'sum',
        //'prod',
        //'avg',
        //'var',
        //'std',
        'max'
        //'median'
    ]
};

math.docs.acos = {
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

math.docs.asin = {
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

math.docs.atan = {
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

math.docs.atan2 = {
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

math.docs.cos = {
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

math.docs.cot = {
    'name': 'cot',
    'category': 'Trigonometry',
    'syntax': [
        'cot(x)'
    ],
    'description': 'Compute the cotangent of x in radians. Defined as 1/tan(x)',
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

math.docs.csc = {
    'name': 'csc',
    'category': 'Trigonometry',
    'syntax': [
        'csc(x)'
    ],
    'description': 'Compute the cosecant of x in radians. Defined as 1/sin(x)',
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

math.docs.sec = {
    'name': 'sec',
    'category': 'Trigonometry',
    'syntax': [
        'sec(x)'
    ],
    'description': 'Compute the secant of x in radians. Defined as 1/cos(x)',
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

math.docs.sin = {
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

math.docs.tan = {
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

math.docs['in'] = {
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

math.docs.clone = {
    'name': 'clone',
    'category': 'Utils',
    'syntax': [
        'clone(x)'
    ],
    'description': 'Clone a variable. Creates a copy of primitive variables,and a deep copy of matrices',
    'examples': [
        'clone(3.5)',
        'clone(2 - 4i)',
        'clone(45 deg)',
        'clone([1, 2; 3, 4])',
        'clone("hello world")'
    ],
    'seealso': []
};

math.docs['eval'] = {
    'name': 'eval',
    'category': 'Utils',
    'syntax': [
        'eval(expression)',
        'eval([expr1, expr2, expr3, ...])'
    ],
    'description': 'Evaluate an expression or an array with expressions.',
    'examples': [
        'eval("2 + 3")',
        'eval("sqrt(" + 4 + ")")'
    ],
    'seealso': []
};

math.docs.format = {
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

math.docs.help = {
    'name': 'help',
    'category': 'Utils',
    'syntax': [
        'help(object)',
        'help(string)'
    ],
    'description': 'Display documentation on a function or data type.',
    'examples': [
        'help(sqrt)',
        'help("complex")'
    ],
    'seealso': []
};

math.docs['import'] = {
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

math.docs['typeof'] = {
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
 * Compatibility shims for legacy JavaScript engines
 */

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

// Define Function.bind if not available
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

/**
 * math.js library initialization
 */

// initialise the Chain prototype with all functions and constants in math
for (var prop in math) {
    if (math.hasOwnProperty(prop) && prop) {
        createSelectorProxy(prop, math[prop]);
    }
}

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
    if (window['math']) {
        util.deepExtend(window['math'], math);
    }
    else {
        window['math'] = math;
    }
}


})();
