/**
 * Remove singleton dimensions from a matrix. squeeze(x)
 * @param {Matrix | Array} x
 * @return {Matrix | Array} res
 */
function squeeze (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('squeeze', arguments.length, 1);
    }

    if (x instanceof Matrix || x instanceof Range) {
        return _squeezeArray(x.toArray());
    }
    else if (x instanceof Array) {
        return _squeezeArray(clone(x));
    }
    else {
        // scalar
        return clone(x);
    }
}

math.squeeze = squeeze;

/**
 * Recursively squeeze a multi dimensional array
 * @param {Array} array
 * @return {Array} array
 * @private
 */
function _squeezeArray(array) {
    if (array.length == 1) {
        // squeeze this array
        return _squeezeArray(array[0]);
    }
    else {
        // process all childs
        for (var i = 0, len = array.length; i < len; i++) {
            var child = array[i];
            if (child instanceof Array) {
                array[i] = _squeezeArray(child);
            }
        }
        return array;
    }
}

/**
 * Function documentation
 */
squeeze.doc = {
    'name': 'squeeze',
    'category': 'Numerics',
    'syntax': [
        'squeeze(x)'
    ],
    'description': 'Remove singleton dimensions from a matrix.',
    'examples': [
        'a = zeros(1,3,2)',
        'size(squeeze(a))',
        'b = zeros(3,1,1)',
        'size(squeeze(b))'
    ],
    'seealso': [
        'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'transpose', 'zeros'
    ]
};