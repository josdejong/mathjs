/**
 * Create a vector. The function creates a new math.type.Vector object.
 *
 * The method accepts the following arguments:
 *     vector()       creates an empty vector
 *     vector(data)   creates a vector with initial data.
 *
 * Example usage:
 *     var v = math.vector([4, 5, 6, 7]);
 *     v.resize(6, -1);
 *     v.set(2, 9);
 *     v.valueOf();          // [4, 5, 9, 7, -1, -1]
 *     v.get([3, 4])         // [7, -1]
 *
 * @param {Array | Matrix | Vector | Range} [data]
 * @return {Vector} vector
 */
function vector(data) {
    if (arguments.length > 1) {
        throw newArgumentsError('vector', arguments.length, 0, 1);
    }

    return new Vector(data);
}

math.vector = vector;
