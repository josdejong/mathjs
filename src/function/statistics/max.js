/**
 * Compute the maximum value of a list of values, max(a, b, c, ...)
 * @param {... *} args  one or multiple arguments
 * @return {*} res
 */
function max(args) {
    if (arguments.length == 0) {
        throw new Error('Function sum requires one or more parameters (0 provided)');
    }

    if (arguments.length == 1 && arguments[0] instanceof Array) {
        return max.apply(this, arguments[0]);
    }
    // TODO: implement matrix support

    var res = arguments[0];
    for (var i = 1, iMax = arguments.length; i < iMax; i++) {
        var value = arguments[i];
        if (larger(value, res)) {
            res = value;
        }
    }

    return res;
}

math.max = max;

/**
 * Function documentation
 */
max.doc = {
    'name': 'max',
    'category': 'Statistics',
    'syntax': [
        'max(a, b, c, ...)'
    ],
    'description': 'Compute the maximum value of a list of values.',
    'examples': [
        'max(2, 3, 4, 1)',
        'max(2.7, 7.1, -4.5, 2.0, 4.1)',
        'min(2.7, 7.1, -4.5, 2.0, 4.1)'
    ],
    'seealso': [
        'sum',
        'prod',
        'avg',
        'var',
        'std',
        'min',
        'median'
    ]
};
