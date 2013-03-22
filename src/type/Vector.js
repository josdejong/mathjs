/**
 * @constructor Vector
 * A Vector is a wrapper around an Array. A vector can hold a one dimensional
 * array. A vector can be constructed as:
 *     var vector = new Vector(data)
 *
 * Vector contains the following functions:
 *     resize(size, defaultValue)
 *     get(index)
 *     get(indexes)
 *     set(index, value)
 *     set(indexes, values)
 *     clone()
 *     isScalar()
 *     toScalar()
 *     isArray()
 *     toArray()            // create an Array with the vector data cloned
 *     valueOf()            // get the internal data Array of the vector
 *
 * Example usage:
 *     var vector = new Vector([4, 5, 6, 7])
 *     vector.resize(6, -1);
 *     vector.set(2, 9);
 *     vector.valueOf();          // [4, 5, 9, 7, -1, -1]
 *     vector.get([3,4 ])         // [7, -1]
 *
 * @param {Array | Matrix | Vector | Range} [data]    A one dimensional array
 */
function Vector(data) {
    if (this.constructor != Vector) {
        throw new SyntaxError(
            'Vector constructor must be called with the new operator');
    }

    if (data instanceof Matrix) {
        // clone data from Matrix
        this.data = data.toVector();
    }
    else if (data instanceof Vector || data instanceof Range) {
        // clone data from Vector or Range
        this.data = data.toArray();
    }
    else {
        // use data as is
        this.data = data || null;
    }

    // verify whether the data is a one dimensional array
    var s = util.array.size(this.data);
    util.array.validate(this.data, s);
    if (s.length > 1) {
        throw new Error('Vector can only contain one dimension (size: ' + format(s) + ')');
    }
}

math.Vector = Vector;

/**
 * Resize the vector
 * @param {Number | Number[]} size  A positive integer value, or an array
 *                                  containing one integer value.
 * @param {*} [defaultValue]        Default value, filled in on new entries.
 *                                  If not provided, the vector will be filled
 *                                  with zeros.
 */
Vector.prototype.resize = function (size, defaultValue) {
    size = size.valueOf();
    if (size instanceof Array) {
        if (size.length > 1) {
            throw new RangeError('Cannot resize a vector to multiple dimensions ' +
                '(size: ' + format(size) + ')');
        }
        this.resize(size[0], defaultValue);
    }
    else {
        if (!isNumber(size) || !isInteger(size) || size < 0) {
            throw new TypeError('Positive integer expected as size in method resize');
        }

        if (!(this.data instanceof Array) && size > 1) {
            // vector currently contains a scalar. change that to an array
            this.data = [this.data];
            this.resize(size, defaultValue);
        }
        else {
            if(size > this.data.length) {
                // enlarge
                for (var i = this.data.length; i < size; i++) {
                    this.data[i] = defaultValue ? clone(defaultValue) : 0;
                }
            }
            else {
                // shrink
                this.data.length = size;
            }
        }
    }
};

/**
 * get a value or a subset of the vector. Throws an RangeError when index is
 * out of range.
 * Indexes are zero-based.
 * @param {Number | Number[] | Range} index
 * @return {* | *[]} value
 */
Vector.prototype.get = function (index) {
    var me = this;
    index = index.valueOf();

    if (index instanceof Range || index instanceof Array) {
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
            throw new RangeError('Index out of range (' + index + ')');
        }
    }
};

/**
 * Set a value or a set of value in the vector.
 * Indexes are zero-based.
 * @param {Number | Number[]} index
 * @param {* | *[]} value
 */
Vector.prototype.set = function (index, value) {
    var me = this;
    index = index.valueOf();

    if (index instanceof Range) {
        if (index.size() != value.length) {
            throw new RangeError('Dimension mismatch (' + index.size() + ' != ' +
                value.length + ')');
        }

        index.forEach(function (v, i) {
             me._set(v, value[i]);
        });
    }
    else if (index instanceof Array) {
        if (value instanceof Array) {
            if (index.length != value.length) {
                throw new RangeError('Dimension mismatch (' + index.length+ ' != ' +
                    value.length + ')');
            }

            index.forEach(function (v, i) {
                me._set(v, value[i]);
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
            this._set(index, value);
        }
    }
};

/**
 * Set a single value
 * @param {Number} index
 * @param {*} value
 * @private
 */
Vector.prototype._set = function (index, value) {
    if (!(this.data instanceof Array)) {
        this.data = [this.data];
    }
    if (index > this.data.length) {
        this.resize(index);
    }
    this.data[index] = value;
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
    var array = clone(this.data);
    if (!(array instanceof Array)) {
        array = [array];
    }
    return array;
};

/**
 * Get the primitive value of the Vector: a one dimensional array
 * @returns {Array} array
 */
Vector.prototype.valueOf = function () {
    return this.data;
};

/**
 * Get a string representation of the vector
 * @returns {String} str
 */
Vector.prototype.toString = function () {
    return format(this.data);
};
