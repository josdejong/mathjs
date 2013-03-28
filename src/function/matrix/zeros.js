/**
 * @constructor zeros
 * zeros(n)
 * zeros(m, n)
 * zeros([m, n])
 * zeros([m, n, p, ...])
 * returns a matrix filled with zeros
 * @param {...Number | Array} size
 * @return {Matrix} matrix
 */
function zeros (size) {
    var args = util.argsToArray(arguments);

    if (args.length == 0) {
        args = [1, 1];
    }
    else if (args.length == 1) {
        args[1] = args[0];
    }

    // create and size the matrix
    var matrix = new Matrix();
    matrix.resize(args);
    return matrix;
}

math.zeros = zeros;

/**
 * Function documentation
 */
zeros.doc = {
    'name': 'zeros',
    'category': 'Numerics',
    'syntax': [
        'zeros(n)',
        'zeros(m, n)',
        'zeros(m, n, p, ...)',
        'zeros([m, n])',
        'zeros([m, n, p, ...])',
        'zeros'
    ],
    'description': 'Create a matrix containing zeros.',
    'examples': [
        'zeros(3)',
        'zeros(3, 5)',
        'a = [1, 2, 3; 4, 5, 6]',
        'zeros(size(a))'
    ],
    'seealso': [
        'diag', 'identity', 'ones', 'range', 'size', 'transpose'
    ]
};