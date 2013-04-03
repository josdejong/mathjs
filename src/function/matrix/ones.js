/**
 * @constructor ones
 * ones(n)
 * ones(m, n)
 * ones([m, n])
 * ones([m, n, p, ...])
 * returns a matrix filled with ones
 * @param {...Number | Array} size
 * @return {Matrix} matrix
 */
function ones (size) {
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
}

math.ones = ones;

/**
 * Function documentation
 */
ones.doc = {
    'name': 'ones',
    'category': 'Numerics',
    'syntax': [
        'ones(n)',
        'ones(m, n)',
        'ones(m, n, p, ...)',
        'ones([m, n])',
        'ones([m, n, p, ...])',
        'ones'
    ],
    'description': 'Create a matrix containing ones.',
    'examples': [
        'ones(3)',
        'ones(3, 5)',
        'ones([2,3]) * 4.5',
        'a = [1, 2, 3; 4, 5, 6]',
        'ones(size(a))'
    ],
    'seealso': [
        'det', 'diag', 'identity', 'range', 'size', 'squeeze', 'transpose', 'zeros'
    ]
};