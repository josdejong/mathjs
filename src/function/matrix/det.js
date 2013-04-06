/**
 * @constructor det
 * Calculate the determinant of a matrix, det(x)
 * @param {Array | Matrix} x
 * @return {Number} determinant
 */
function det (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('det', arguments.length, 1);
    }

    var size = math.size(x);
    switch (size.length) {
        case 0:
            // scalar
            return math.clone(x);
            break;

        case 1:
            // vector
            if (size[0] == 1) {
                return math.clone(x.valueOf()[0]);
            }
            else {
                throw new RangeError('Matrix must be square ' +
                    '(size: ' + math.format(size) + ')');
            }
            break;

        case 2:
            // two dimensional array
            var rows = size[0];
            var cols = size[1];
            if (rows == cols) {
                return _det(x.valueOf(), rows, cols);
            }
            else {
                throw new RangeError('Matrix must be square ' +
                    '(size: ' + math.format(size) + ')');
            }
            break;

        default:
            // multi dimensional array
            throw new RangeError('Matrix must be two dimensional ' +
                '(size: ' + math.format(size) + ')');
    }
}

math.det = det;

/**
 * Calculate the determinant of a matrix
 * @param {Array[]} matrix  A square, two dimensional matrix
 * @param {Number} rows     Number of rows of the matrix (zero-based)
 * @param {Number} cols     Number of columns of the matrix (zero-based)
 * @returns {Number} det
 * @private
 */
function _det (matrix, rows, cols) {
    var multiply = math.multiply,
        subtract = math.subtract;

    // this is a square matrix
    if (rows == 1) {
        // this is a 1 x 1 matrix
        return matrix[0][0];
    }
    else if (rows == 2) {
        // this is a 2 x 2 matrix
        // the determinant of [a11,a12;a21,a22] is det = a11*a22-a21*a12
        return subtract(
            multiply(matrix[0][0], matrix[1][1]),
            multiply(matrix[1][0], matrix[0][1])
        );
    }
    else {
        // this is a matrix of 3 x 3 or larger
        var d = 0;
        for (var c = 0; c < cols; c++) {
            var minor = _minor(matrix, rows, cols, 0, c);
            //d += Math.pow(-1, 1 + c) * a(1, c) * _det(minor);
            d += multiply(
                multiply((c + 1) % 2 + (c + 1) % 2 - 1, matrix[0][c]),
                _det(minor, rows - 1, cols - 1)
            ); // faster than with pow()
        }
        return d;
    }
}

/**
 * Extract a minor from a matrix
 * @param {Array[]} matrix  A square, two dimensional matrix
 * @param {Number} rows     Number of rows of the matrix (zero-based)
 * @param {Number} cols     Number of columns of the matrix (zero-based)
 * @param {Number} row      Row number to be removed (zero-based)
 * @param {Number} col      Column number to be removed (zero-based)
 * @private
 */
function _minor(matrix, rows, cols, row, col) {
    var minor = [],
        minorRow;

    for (var r = 0; r < rows; r++) {
        if (r != row) {
            minorRow = minor[r - (r > row)] = [];
            for (var c = 0; c < cols; c++) {
                if (c != col) {
                    minorRow[c - (c > col)] = matrix[r][c];
                }
            }
        }
    }

    return minor;
}

/**
 * Function documentation
 */
det.doc = {
    'name': 'det',
    'category': 'Numerics',
    'syntax': [
        'det(x)'
    ],
    'description': 'Calculate the determinant of a matrix',
    'examples': [
        'det([1, 2; 3, 4])',
        'det([-2, 2, 3; -1, 1, 3; 2, 0, -1])'
    ],
    'seealso': [
        'concat', 'diag', 'eye', 'inv', 'range', 'size', 'squeeze', 'transpose', 'zeros'
    ]
};