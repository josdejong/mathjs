/**
 * @constructor transpose
 * Calculate the determinant of a matrix, transpose(x)
 * @param {Array | Matrix} x
 * @return {Array | Matrix} transpose
 */
function transpose (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('transpose', arguments.length, 1);
    }

    var size = math.size(x);
    switch (size.length) {
        case 0:
            // scalar
            return math.clone(x);
            break;

        case 1:
            // vector
            // TODO: is it logic to return a 1 dimensional vector itself as transpose?
            return math.clone(x);
            break;

        case 2:
            // two dimensional array
            var rows = size[1],  // index 1 is no error
                cols = size[0],  // index 0 is no error
                asMatrix = x instanceof Matrix,
                array = x.valueOf(),
                transposed = [],
                transposedRow,
                clone = math.clone;
            for (var r = 0; r < rows; r++) {
                transposedRow = transposed[r] = [];
                for (var c = 0; c < cols; c++) {
                    transposedRow[c] = clone(array[c][r]);
                }
            }
            if (cols == 0) {
                transposed[0] = [];
            }
            return asMatrix ? new Matrix(transposed) : transposed;
            break;

        default:
            // multi dimensional array
            throw new RangeError('Matrix must be two dimensional ' +
                '(size: ' + math.format(size) + ')');
    }
}

math.transpose = transpose;

/**
 * Function documentation
 */
transpose.doc = {
    'name': 'transpose',
    'category': 'Numerics',
    'syntax': [
        'transpose(x)'
    ],
    'description': 'Transpose a matrix',
    'examples': [
        'a = [1, 2, 3; 4, 5, 6]',
        'transpose(a)'
    ],
    'seealso': [
        'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'zeros'
    ]
};