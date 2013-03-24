/**
 * Create an identity matrix with size m x n, eye(m [, n])
 * @param {...Number | Matrix | Vector | Array} size
 * @return {Matrix} matrix
 */
function eye (size) {
    var args = util.argsToArray(arguments);
    if (args.length == 0) {
        args = [1, 1];
    }
    else if (args.length == 1) {
        args[1] = args[0];
    }
    else if (args.length > 2) {
        throw newArgumentsError('eye', num, 0, 2);
    }

    var rows = args[0],
        cols = args[1];

    if (!isNumber(rows) || !isInteger(rows) || rows < 1) {
        throw new Error('Parameters in function eye must be positive integers');
    }
    if (cols) {
        if (!isNumber(cols) || !isInteger(cols) || cols < 1) {
            throw new Error('Parameters in function eye must be positive integers');
        }
    }

    // create and args the matrix
    var matrix = new Matrix();
    matrix.resize(args);

    // fill in ones on the diagonal
    var min = math.min(args);
    var data = matrix.valueOf();
    for (var d = 0; d < min; d++) {
        data[d][d] = 1;
    }

    return matrix;
}

math.eye = eye;

/**
 * Function documentation
 */
eye.doc = {
    'name': 'eye',
    'category': 'Numerics',
    'syntax': [
        'eye(n)',
        'eye(m, n)',
        'eye([m, n])',
        'eye'
    ],
    'description': 'Returns the identity matrix with size m-by-n. ' +
        'The matrix has ones on the diagonal and zeros elsewhere.',
    'examples': [
        'eye(3)',
        'eye(3, 5)',
        'a = [1, 2, 3; 4, 5, 6]',
        'eye(size(a))'
    ],
    'seealso': [
        'diag', 'ones', 'range', 'size', 'transpose', 'zeros'
    ]
};