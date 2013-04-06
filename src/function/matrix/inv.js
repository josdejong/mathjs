/**
 * @constructor inv
 * Calculate the inverse of a matrix, inv(x)
 * @param {Array | Matrix} x
 * @return {Array | Matrix} inv
 */
function inv (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('inv', arguments.length, 1);
    }

    var size = math.size(x);
    switch (size.length) {
        case 0:
            // scalar
            return math.divide(1, x);
            break;

        case 1:
            // vector
            if (size[0] == 1) {
                if (x instanceof Matrix) {
                    return new Matrix([
                        math.divide(1, x.valueOf()[0])
                    ]);
                }
                else {
                    return [
                        math.divide(1, x[0])
                    ];
                }
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
                if (x instanceof Matrix) {
                    return new Matrix(
                        _inv(x.valueOf(), rows, cols)
                    );
                }
                else {
                    // return an Array
                    return _inv(x, rows, cols);
                }
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

math.inv = inv;

/**
 * Calculate the inverse of a square matrix
 * @param {Array[]} matrix  A square matrix
 * @param {Number} rows     Number of rows
 * @param {Number} cols     Number of columns, must equal rows
 * @return {Array[]} inv    Inverse matrix
 * @private
 */
function _inv (matrix, rows, cols){
    var r, s, f, value, temp,
        add = math.add,
        unaryminus = math.unaryminus,
        multiply = math.multiply,
        divide = math.divide;

    if (rows == 1) {
        // this is a 1 x 1 matrix
        value = matrix[0][0];
        if (value == 0) {
            throw Error('Cannot calculate inverse, determinant is zero');
        }
        return [[
            math.divide(1, value)
        ]];
    }
    else if (rows == 2) {
        // this is a 2 x 2 matrix
        var det = math.det(matrix);
        if (det == 0) {
            throw Error('Cannot calculate inverse, determinant is zero');
        }
        return [
            [
                divide(matrix[1][1], det),
                divide(unaryminus(matrix[0][1]), det)
            ],
            [
                divide(unaryminus(matrix[1][0]), det),
                divide(matrix[0][0], det)
            ]
        ];
    }
    else {
        // this is a matrix of 3 x 3 or larger
        // calculate inverse using gauss-jordan elimination
        //      http://en.wikipedia.org/wiki/Gaussian_elimination
        //      http://mathworld.wolfram.com/MatrixInverse.html
        //      http://math.uww.edu/~mcfarlat/inverse.htm

        // make a copy of the matrix (only the arrays, not of the elements)
        var A = matrix.concat();
        for (r = 0; r < rows; r++) {
            A[r] = A[r].concat();
        }

        // create an identity matrix which in the end will contain the
        // matrix inverse
        var B = math.eye(rows).valueOf();

        // loop over all columns, and perform row reductions
        for (var c = 0; c < cols; c++) {
            // element Acc should be non zero. if not, swap content
            // with one of the lower rows
            r = c;
            while (r < rows && A[r][c] == 0) {
                r++;
            }
            if (r == rows || A[r][c] == 0) {
                throw Error('Cannot calculate inverse, determinant is zero');
            }
            if (r != c) {
                temp = A[c]; A[c] = A[r]; A[r] = temp;
                temp = B[c]; B[c] = B[r]; B[r] = temp;
            }

            // eliminate non-zero values on the other rows at column c
            var Ac = A[c],
                Bc = B[c];
            for (r = 0; r < rows; r++) {
                var Ar = A[r],
                    Br = B[r];
                if(r != c) {
                    // eliminate value at column c and row r
                    if (Ar[c] != 0) {
                        f = divide(unaryminus(Ar[c]), Ac[c]);

                        // add (f * row c) to row r to eliminate the value
                        // at column c
                        for (s = c; s < cols; s++) {
                            Ar[s] = add(Ar[s], multiply(f, Ac[s]));
                        }
                        for (s = 0; s < cols; s++) {
                            Br[s] = add(Br[s], multiply(f, Bc[s]));
                        }
                    }
                }
                else {
                    // normalize value at Acc to 1,
                    // divide each value on row r with the value at Acc
                    f = Ac[c];
                    for (s = c; s < cols; s++) {
                        Ar[s] = divide(Ar[s], f);
                    }
                    for (s = 0; s < cols; s++) {
                        Br[s] = divide(Br[s], f);
                    }
                }
            }
        }
        return B;
    }
}

/**
 * Function documentation
 */
inv.doc = {
    'name': 'inv',
    'category': 'Numerics',
    'syntax': [
        'inv(x)'
    ],
    'description': 'Calculate the inverse of a matrix',
    'examples': [
        'inv([1, 2; 3, 4])',
        'inv(4)',
        '1 / 4'
    ],
    'seealso': [
        'concat', 'det', 'diag', 'eye', 'ones', 'range', 'size', 'squeeze', 'transpose', 'zeros'
    ]
};