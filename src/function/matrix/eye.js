/**
 * Create an identity matrix with size m x n, eye(m [, n])
 * @param {Number} m
 * @param {Number} [n]
 * @return {Number | Array} res
 */
function eye (m, n) {
    var rows, cols;
    var num = arguments.length;
    if (num < 0 || num > 2) {
        throw newArgumentsError('eye', num, 0, 2);
    }

    if (num == 0) {
        return 1;
    }

    if (num == 1) {
        // TODO: support an array as first argument
        // TODO: support a matrix as first argument

        rows = m;
        cols = m;
    }
    else if (num == 2) {
        rows = m;
        cols = n;
    }

    if (!isNumber(rows) || !isInteger(rows) || rows < 1) {
        throw new Error('Parameters in function eye must be positive integers');
    }
    if (cols) {
        if (!isNumber(cols) || !isInteger(cols) || cols < 1) {
            throw new Error('Parameters in function eye must be positive integers');
        }
    }

    // TODO: use zeros(m, n) instead, then fill the diagonal with ones
    var res = [];
    for (var r = 0; r < rows; r++) {
        var row = [];
        for (var c = 0; c < cols; c++) {
            row[c] = 0;
        }
        res[r] = row;
    }

    // fill in ones on the diagonal
    var min = Math.min(rows, cols);
    for (var d = 0; d < min; d++) {
        res[d][d] = 1;
    }

    return res;
}

// TODO: export method eye to math
// math.eye = eye;

/**
 * Function documentation
 */
eye.doc = {
    'name': 'eye',
    'category': 'Matrix',
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