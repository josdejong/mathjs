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
     * Check if a text ends with a certain string.
     * @param {String} text
     * @param {String} search
     */
    util.endsWith = function(text, search) {
        var start = text.length - search.length;
        var end = text.length;
        return (text.substring(start, end) === search);
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
