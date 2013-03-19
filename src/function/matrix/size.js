/**
 * Calculate the size of a matrix, size(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function size (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('size', arguments.length, 1);
    }

    if (isNumber(x)) {
        return [[1, 1]];
    }

    if (x instanceof Complex) {
        return [[1, 1]];
    }

    if (x instanceof Unit) {
        return [[1, 1]];
    }

    if (isString(x)) {
        return [[1, x.length]];
    }

    if (x instanceof Array) {
        var s = getSize(x);
        validate(x, s);
        return [getSize(x)];
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return size(x.valueOf());
    }

    throw newUnsupportedTypeError('size', x);
}

/**
 * Recursively get the size of an array or object
 * @param {Array | Object} x
 * @Return {Array}
 */
function getSize (x) {
    if (x instanceof Array) {
        var sizeX = x.length;
        if (sizeX) {
            var size0 = getSize(x[0]);
            return [sizeX].concat(size0);
        }
        else {
            return [sizeX];
        }
    }
    else {
        return [];
    }
}

/**
 * Verify whether each element in an n dimensional array has the correct size
 * @param {Array | Object} array    Array to be validated
 * @param {Number[]} size           Array with dimensions
 * @param {Number} [dim]            Current dimension
 * @throw Error
 */
function validate(array, size, dim) {
    var i,
        len = array.length;
    if (!dim) {
        dim = 0;
    }

    if (len != size[dim]) {
        throw new Error('Dimension mismatch (' + len + ' != ' + size[dim] + ')');
    }

    if (dim < size.length - 1) {
        // recursively validate each child array
        var dimNext = dim + 1;
        for (i = 0; i < len; i++) {
            var child = array[i];
            if (!(child instanceof Array)) {
                throw new Error('Dimension mismatch ' +
                    '(' + (size.length - 1) + ' < ' + size.length + ')');
            }
            validate(array[i], size, dimNext);
        }
    }
    else {
        // last dimension. none of the childs may be an array
        for (i = 0; i < len; i++) {
            if (array[i] instanceof Array) {
                throw new Error('Dimension mismatch ' +
                    '(' + (size.length + 1) + ' > ' + size.length + ')');
            }
        }
    }

    return true;
}

/**
 * Compare two arrays
 * @param a
 * @param b
 * @return {Boolean} equal   True if both arrays are equal, else false
 */
function compare(a, b) {
    var len = a.length;
    if (len != b.length) {
        return false;
    }

    for (var i = 0; i < len; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }

    return true;
}


// TODO: export method size to math
// math.size = size;

/**
 * Function documentation
 */
size.doc = {
    'name': 'size',
    'category': 'Matrix',
    'syntax': [
        'size(x)'
    ],
    'description': 'Calculate the size of a matrix.',
    'examples': [
        'size(2.3)',
        'size("hello world")',
        'a = [1, 2; 3, 4; 5, 6]',
        'size(a)',
        'size(1:6)'
    ],
    'seealso': [
        'diag', 'eye', 'ones', 'range', 'transpose', 'zeros'
    ]
};