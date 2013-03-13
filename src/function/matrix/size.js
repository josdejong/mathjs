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
        return [getSize(x)];
    }
    // TODO: implement matrix support

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
            var sizeI = getSize(x[0]);

            // TODO: validate whether the other elements have the same size

            return [sizeX].concat(sizeI);
        }
        else {
            return [sizeX];
        }
    }
    else {
        return [];
    }
}

math.size = size;

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