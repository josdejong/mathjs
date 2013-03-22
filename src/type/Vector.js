/**
 * @constructor Vector
 *
 * TODO: document Vector
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
 * Get the primitive value of the Vector: a one dimensional array
 * @returns {Array} array
 */
Vector.prototype.valueOf = function () {
    return this.data;
};

// TODO: implement Vector.toString()
