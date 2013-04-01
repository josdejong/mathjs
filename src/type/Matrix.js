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
 *     matrix.get([1, 0])         // 3
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
 * Indexes are zero-based.
 * @param {Array | Matrix} index
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
            case 1: return _getSubmatrix1D(this._data, index);
            case 2: return _getSubmatrix2D(this._data, index);
            default: return _getSubmatrix(this._data, index, 0);
        }
    }
};

/**
 * Get a single value from an array. The method tests whether:
 * - index is a non-negative integer
 * - index does not exceed the dimensions of array
 * @param {Array} array
 * @param {Number} index
 * @return {*} value
 * @private
 */
function _get (array, index) {
    if (!isNumber(index) || !isInteger(index) || index < 0) {
        throw new TypeError('Index must contain positive integers (value: ' + index + ')');
    }
    if (index > array.length - 1) {
        throw new RangeError('Index out of range (' + index + '>' + (array.length - 1) +  ')');
    }
    return array[index];
}

/**
 * Get a single value from the matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Number[]} index
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
 * @param {Array} index
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
 * @param {Array} index
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
 * @param {Array} index
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
 * @param {Array | Range | Matrix} index
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
 * @param {Number} index
 * @param {*} value
 * @private
 */
function _set (array, index, value) {
    if (!isNumber(index) || !isInteger(index) || index < 0) {
        throw new TypeError('Index must contain positive integers (value: ' + index + ')');
    }
    if (value instanceof Array) {
        throw new TypeError('Dimension mismatch, value expected instead of array');
    }
    array[index] = value;
}

/**
 * Replace a single value in a multi dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Number[]} index
 * @param {*} value
 * @private
 */
function _setScalar (data, size, index, value) {
    var resized = false;
    if (index.length > size.length) {
        resized = true;
    }

    for (var i = 0; i < index.length; i++) {
        var index_i = index[i];
        if (!isNumber(index_i) || !isInteger(index_i) || index_i < 0) {
            throw new TypeError('Positive integer expected as index in method get');
        }
        if ((size[i] == null) || (index_i + 1 > size[i])) {
            size[i] = index_i + 1;
            resized = true;
        }
    }

    if (resized) {
        util.resize(data, size, 0);
    }

    var len = size.length;
    index.forEach(function (v, i) {
        if (i < len - 1) {
            data = data[v];
        }
        else {
            data[v] = value;
        }
    });
}

/**
 * Replace a single value in a one dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Number[]} index
 * @param {*} value
 * @private
 */
function _setScalar1D (data, size, index, value) {
    var row = index[0];
    if (!isNumber(row) || !isInteger(row) || row < 0) {
        throw new TypeError('Positive integer expected as index in method get');
    }

    if (row + 1 > size[0]) {
        util.resize(data, [row + 1], 0);
    }

    data[row] = value;
}

/**
 * Replace a single value in a two dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Number[]} index
 * @param {*} value
 * @private
 */
function _setScalar2D (data, size, index, value) {
    var row = index[0];
    var col = index[1];
    if (!isNumber(row) || !isInteger(row) || row < 0 ||
        !isNumber(col) || !isInteger(col) || col < 0) {
        throw new TypeError('Positive integer expected as index in method get');
    }

    var resized = false;
    if (row + 1 > (size[0] || 0)) {
        size[0] = row + 1;
        resized = true;
    }
    if (col + 1 > (size[1] || 0)) {
        size[1] = col + 1;
        resized = true;
    }
    if (resized) {
        util.resize(data, size, 0);
    }

    data[row][col] = value;
}

/**
 * Replace a submatrix of a multi dimensional matrix.
 * @param {Array} data
 * @param {Array} size
 * @param {Array} index
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
            var child = data[v];
            if (!(child instanceof Array)) {
                data[v] = child = [child];
                if (data.length > (size[dim] || 0)) {
                    size[dim] = data.length;
                }
            }
            _setSubmatrix(child, size, index, dim + 1, submatrix[i]);
        }
    };

    if (current.map) {
        // array or Range
        if (current.length != submatrix.length) {
            throw new RangeError('Dimensions mismatch ' +
                '(' + current.length + ' != '+ submatrix.length + ')');
        }
        current.map(recurse);
    }
    else {
        // scalar
        recurse(current)
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
                index[dim] = i;
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
                index[dim] = i;
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
        for (var i = 0, iMax = this._size[dim]; i < iMax; i++) {
            index[dim] = i;
            vector[i] = clone(this.get(index));
        }
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
