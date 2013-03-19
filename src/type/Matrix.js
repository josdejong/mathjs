/**
 * @constructor Matrix
 *
 * TODO: document Matrix
 *
 * @param {Array} [array]    A multi dimensional array
 */
function Matrix(array) {
    if (this.constructor != Matrix) {
        throw new SyntaxError(
            'Matrix constructor must be called with the new operator');
    }

    this.array = array || [];
}

math.Matrix = Matrix;

// TODO: implement a parse method

// TODO: implement method toVector
// TODO: implement method isVector



/**
 * Retrieve the size of the matrix.
 * The size of the matrix will be validated too
 * @returns {Number[]} size
 */
Matrix.prototype.size = function () {
    return util.array.validatedSize(this.array);
};

/**
 * Get the scalar value of the matrix. Will return null if the matrix is no
 * scalar value
 * @return {* | null} scalar
 */
Matrix.prototype.toScalar = function () {
    var value = this.array;
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
 * Test whether the matrix is a scalar.
 * @return {boolean} isScalar
 */
Matrix.prototype.isScalar = function () {
    var value = this.array;
    while (value instanceof Array && value.length == 1) {
        value = array[0];
    }
    return !(value instanceof Array);
};

/**
 * Get the matrix contents as vector. Returns null if the Matrix is no vector
 * return {Array} vector
 */
Matrix.prototype.toVector = function () {
    var s = util.array.validatedSize(this.array);
    if (s.length != 2) {
        return null;
    }
    if (s[0] != 1 && s[1] != 1) {
        return null;
    }

    if (s[0] == 1) {
        return this.array[0].concat();
    }
    else {
        var vector = [];
        this.array.forEach(function (row, index) {
            vector[index] = row[0];
        });
        return vector;
    }
};

/**
 * Test if the matrix is a vector.
 * A matrix is a vector when the dims is [1 x n] or [n x 1]
 * return {boolean} isVector
 */
Matrix.prototype.isVector = function () {
    var s = util.array.validatedSize(this.array);
    if (s.length != 2) {
        return false;
    }
    return (s[0] == 1 || s[1] == 1);
};

/**
 * Get the primitive value of the Matrix: a multidimensional array
 * @returns {Array} array
 */
Matrix.prototype.valueOf = function () {
    return this.array;
};
