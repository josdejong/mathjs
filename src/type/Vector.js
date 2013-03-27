/**
 * @constructor Vector
 * A Vector is a wrapper around an Array. A vector can hold a one dimensional
 * array. A vector can be constructed as:
 *     var vector = new Vector(data)
 *
 * Vector contains the functions to resize, get and set values, get the size,
 * clone the vector and to convert the vector to an array or scalar.
 * The internal Array of the Vector can be accessed using the method valueOf.
 *
 * Example usage:
 *     var vector = new Vector([4, 5, 6, 7]);
 *     vector.resize(6, -1);
 *     vector.set(2, 9);
 *     vector.valueOf();          // [4, 5, 9, 7, -1, -1]
 *     vector.get([3, 4])         // [7, -1]
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
        this._data = data.toVector();
    }
    else if (data instanceof Vector || data instanceof Range) {
        // clone data from Vector or Range
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

    // verify whether the data is a one dimensional array
    this._size = util.size(this._data);
    if (this._size.length > 1) {
        throw new Error('Vector can only contain one dimension ' +
            '(size: ' + format(this._size) + ')');
    }
}

math.type.Vector = Vector;

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

        if(size > this._data.length) {
            // enlarge
            for (var i = this._data.length; i < size; i++) {
                this._data[i] = defaultValue ? clone(defaultValue) : 0;
            }
        }
        else {
            // shrink
            this._data.length = size;
        }

        this._size = [this._data.length];
    }
};

/**
 * get a value or a subset of the vector. Throws an RangeError when index is
 * out of range.
 * Indexes are zero-based.
 * @param {Number | Array | Matrix | Vector | Range} index
 * @return {* | Array | Matrix | Vector | Range} value
 */
Vector.prototype.get = function (index) {
    var me = this;
    index = index.valueOf();

    if (index instanceof Matrix) {
        if (!index.isVector()) {
            throw new RangeError('Index must be a vector ' +
                '(size: ' + format(index.size()) + ')');
        }
        index = index.toVector();
    }
    if (index instanceof Vector) {
        index = index.valueOf();
    }

    if (index instanceof Range || index instanceof Array) {
        return index.map(function (i) {
            return me.get(i);
        });
    }
    else {
        if (!isNumber(index) || !isInteger(index) || index < 0) {
            throw new TypeError('Positive integer expected as index in method get');
        }
        if (index > this._data.length - 1) {
            throw new RangeError('Index out of range (' + index + ')');
        }
        return this._data[index];
    }
};

/**
 * Set a value or a set of values in the vector.
 * Indexes are zero-based.
 * @param {Number | Array | Matrix | Vector | Range} index
 * @param {* | Array | Matrix | Vector | Range} value
 * @return {Vector} itself
 */
Vector.prototype.set = function (index, value) {
    var me = this;

    if (index instanceof Matrix) {
        if (!index.isVector()) {
            throw new RangeError('Index must be a vector ' +
                '(size: ' + format(index.size()) + ')');
        }
        index = index.toVector();
    }
    if (index instanceof Vector) {
        index = index.valueOf();
    }
    if (value instanceof Matrix || value instanceof Vector || value instanceof Range) {
        value = value.valueOf();
    }

    if (index instanceof Range || index instanceof Array) {
        if (value instanceof Array) {
            if (size(index) != value.length) {
                throw new RangeError('Dimension mismatch ' +
                    '(' + size(index) + ' != ' + value.length + ')');
            }

            index.forEach(function (v, i) {
                 me._set(v, value[i]);
            });
        }
        else {
            index.forEach(function (v) {
                me._set(v, value);
            });
        }
    }
    else {
        // index is a scalar
        if (value instanceof Array) {
            // try as two arrays
            this.set([index], value);
        }
        else {
            // set single value
            this._set(index, value);
        }
    }

    return this;
};

/**
 * Set a single value
 * @param {Number} index
 * @param {*} value
 * @private
 */
Vector.prototype._set = function (index, value) {
    if (index > this._data.length) {
        this.resize(index);
    }
    this._data[index] = value;
};

/**
 * Create a clone of the vector
 * @return {Vector} clone
 */
Vector.prototype.clone = function () {
    var vector = new Vector();
    vector._data = clone(this._data);
    return vector;
};

/**
 * Retrieve the size of the vector.
 * The size of the vector will be validated too
 * @returns {Number[]} size
 */
Vector.prototype.size = function () {
    return this._size;
};

// TODO: implement Vector.map
// TODO: implement Vector.forEach

/**
 * Create a Scalar with a copy of the Vectors data
 * @return {* | null} scalar
 */
Vector.prototype.toScalar = function () {
    if (this._data.length == 1) {
        return clone(this._data[0]);
    }
    else {
        return null;
    }
};

/**
 * Test whether the vector is a scalar.
 * @return {boolean} isScalar
 */
Vector.prototype.isScalar = function () {
    return (this._data.length <= 1);
};

/**
 * Create a Matrix with a copy of the Vectors data
 * @return {Matrix} matrix
 */
Vector.prototype.toMatrix = function () {
    return new Matrix(this.toArray());
};

/**
 * Create an Array with a copy of the Vectors data
 * @returns {Array} array
 */
Vector.prototype.toArray = function () {
    return clone(this._data);
};

/**
 * Get the primitive value of the Vector: a one dimensional array
 * @returns {Array} array
 */
Vector.prototype.valueOf = function () {
    return this._data;
};

/**
 * Get a string representation of the vector
 * @returns {String} str
 */
Vector.prototype.toString = function () {
    return util.formatArray(this._data);
};
