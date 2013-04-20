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
