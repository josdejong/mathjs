/**
 * @constructor Matrix
 *
 * A Matrix is a wrapper around an Array. A matrix can hold a multi dimensional
 * array. A matrix can be constructed as:
 *     var matrix = new Matrix(data)
 *
 * Matrix contains the functions to resize, get and set values, get the size,
 * clone the matrix and to convert the matrix to a vector, array, or scalar.
 * The internal Array of the Matrix can be accessed using the method valueOf.
 *
 * Example usage:
 *     var matrix = new Matrix([[1, 2], [3, 4]);
 *     matix.size();              // [2, 2]
 *     matrix.resize([3, 2], 5);
 *     matrix.valueOf();          // [[1, 2], [3, 4], [5, 5]]
 *     matrix.get([1, 0])         // 3
 *
 * @param {Array | Matrix | Vector | Range} [data]    A multi dimensional array
 */
function Matrix(data) {
    if (this.constructor != Matrix) {
        throw new SyntaxError(
            'Matrix constructor must be called with the new operator');
    }

    if (data instanceof Matrix || data instanceof Vector || data instanceof Range) {
        // clone data from Vector, Matrix, or Range
        this._data = data.toArray();
    }
    else if (data instanceof Array) {
        // use array as is
        this._data = data;
    }
    else if (data != null) {
        // a scalar provided
        this._data = [data];
    }
    else {
        // nothing provided
        this._data = [];
    }

    // verify the size of the array
    this._size = util.size(this._data);
}

math.Matrix = Matrix;

/**
 * Get a value or a set of values from the matrix.
 * Indexes are zero-based.
 * @param {Array | Vector | Matrix} index
 */
Matrix.prototype.get = function (index) {
    // TODO: support syntax Matrix.get(m,n,p, ...)
    // TODO: support getting a range of values

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

    if (index instanceof Array) {
        if (index.length != this._size.length) {
            throw new RangeError('Number of dimensions do not match ' +
                '(' + index.length + ' != ' + this._size.length + ')');
        }

        var value = this._data;
        index.forEach(function (i) {
            if (!isNumber(i) || !isInteger(i) || i < 0) {
                throw new TypeError('Positive integer expected as index in method get');
            }
            if (i > value.length - 1) {
                throw new RangeError('Index out of range (' + i + ')');
            }
            value = value[i];
        });
        return value;
    }
    else {
        // TODO: support a single number as index in case the matrix is a vector
        throw new TypeError('Unsupported type of index ' + type(index));
    }
};

/**
 * Get a value or a set of values from the matrix.
 * Indexes are zero-based.
 * @param {Array | Vector | Matrix} index
 * @param {*} value
 */
Matrix.prototype.set = function (index, value) {
    // TODO: support syntax Matrix.get(m,n,p, ..., value)
    // TODO: support setting a range of values

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

    if (index instanceof Array) {
        if (value instanceof Array) {
            throw new Error('Setting a range of values is not yet implemented...');
        }
        else {
            var size = this._size.concat([]);
            var needResize = false;
            if (index.length != this._size.length) {
                needResize = true;
            }
            for (var i = 0; i < index.length; i++) {
                var index_i = index[i];
                if (!isNumber(index_i) || !isInteger(index_i) || index_i < 0) {
                    throw new TypeError('Positive integer expected as index in method get');
                }
                if ((size[i] == undefined) || (index_i + 1 > size[i])) {
                    size[i] = index_i + 1;
                    needResize = true;
                }
            }
            if (needResize) {
                this.resize(size);
            }

            var len = size.length;
            var arr = this._data;
            index.forEach(function (v, i) {
                if (i < len - 1) {
                    arr = arr[v];
                }
                else {
                    arr[v] = value;
                }
            });
        }
    }
    else {
        // TODO: support a single number as index in case the matrix is a vector
        throw new TypeError('Unsupported type of index ' + type(index));
    }
};

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

// TODO: implement Matrix.map
// TODO: implement Matrix.forEach

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
 * Create a Vector with a copy of the data of the Matrix
 * Returns null if the Matrix does not contain a vector
 *
 * A matrix is a vector when it has 0 or 1 dimensions, or has multiple
 * dimensions where maximum one of the dimensions has a size larger than 1.
 * return {Vector | null} vector
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
        return new Vector(this.toScalar());
    }
    else if (count == 1) {
        // valid vector
        var vector = [];
        for (var i = 0, iMax = this._size[dim]; i < iMax; i++) {
            index[dim] = i;
            vector[i] = clone(this.get(index));
        }
        return new Vector(vector);
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
