/**
 * Create a diagonal matrix or retrieve the diagonal of a matrix
 * diag(v)
 * diag(v, k)
 * diag(X)
 * diag(X, k)
 * @param {Number | Matrix | Array} x
 * @param {Number} [k]
 * @return {Matrix} matrix
 */
function diag (x, k) {
    var data, vector, i, iMax;

    if (arguments.length != 1 && arguments.length != 2) {
        throw newArgumentsError('diag', arguments.length, 1, 2);
    }

    if (k) {
        if (!isNumber(k) || !isInteger(k)) {
            throw new TypeError ('Second parameter in function diag must be an integer');
        }
    }
    else {
        k = 0;
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;

    // convert to matrix
    if (!(x instanceof Matrix) && !(x instanceof Range)) {
        x = new Matrix(x);
    }

    // get as array when the matrix is a vector
    var s;
    if (x.isVector()) {
        x = x.toVector();
        s = [x.length];
    }
    else {
        s = x.size();
    }

    switch (s.length) {
        case 1:
            // x is a vector. create diagonal matrix
            vector = x.valueOf();
            var matrix = new Matrix();
            matrix.resize([vector.length + kSub, vector.length + kSuper]);
            data = matrix.valueOf();
            iMax = vector.length;
            for (i = 0; i < iMax; i++) {
                data[i + kSub][i + kSuper] = clone(vector[i]);
            }
            return matrix;
        break;

        case 2:
            // x is a matrix get diagonal from matrix
            vector = [];
            data = x.valueOf();
            iMax = Math.min(s[0] - kSub, s[1] - kSuper);
            for (i = 0; i < iMax; i++) {
                vector[i] = clone(data[i + kSub][i + kSuper]);
            }
            return new Matrix(vector);
        break;

        default:
            throw new RangeError('Matrix for function diag must be 2 dimensional');
    }
}

math.diag = diag;

/**
 * Function documentation
 */
diag.doc = {
    'name': 'diag',
    'category': 'Matrix',
    'syntax': [
        'diag(x)',
        'diag(x, k)'
    ],
    'description': 'Create a diagonal matrix or retrieve the diagonal ' +
        'of a matrix. When x is a vector, a matrix with the vector values ' +
        'on the diagonal will be returned. When x is a matrix, ' +
        'a vector with the diagonal values of the matrix is returned.' +
        'When k is provided, the k-th diagonal will be ' +
        'filled in or retrieved, if k is positive, the values are placed ' +
        'on the super diagonal. When k is negative, the values are placed ' +
        'on the sub diagonal.',
    'examples': [
        'diag(1:4)',
        'diag(1:4, 1)',
        'a = [1, 2, 3; 4, 5, 6; 7, 8, 9]',
        'diag(a)'
    ],
    'seealso': [
        'det', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'transpose', 'zeros'
    ]
};