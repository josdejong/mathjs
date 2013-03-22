/**
 * @constructor Matrix
 *
 * TODO: document Matrix
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
        this.data = data.toArray();
    }
    else {
        // use data as is
        this.data = data || null;
    }

    // verify the size of the array
    util.array.validatedSize(this.data);
}

math.Matrix = Matrix;

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
