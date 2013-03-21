/**
 * Calculate the size of a vector, matrix, or scalar. size(x)
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function size (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('size', arguments.length, 1);
    }

    if (isNumber(x) || x instanceof Complex || x instanceof Unit || x == null) {
        return [];
    }

    if (isString(x)) {
        return [x.length];
    }

    if (x instanceof Array) {
        return util.array.validatedSize(x);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return size(x.valueOf());
    }

    throw newUnsupportedTypeError('size', x);
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