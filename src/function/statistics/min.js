/**
 * Compute the minimum value of a list of values, min(a, b, c, ...)
 * @param {... *} args  one or multiple arguments
 * @return {*} res
 */
function min(args) {
    if (arguments.length == 0) {
        throw new Error('Function sum requires one or more parameters (0 provided)');
    }

    if (arguments.length == 1 && (args.valueOf() instanceof Array)) {
        return min.apply(this, args.valueOf());
    }

    var res = arguments[0];
    for (var i = 1, iMax = arguments.length; i < iMax; i++) {
        var value = arguments[i];
        if (smaller(value, res)) {
            res = value;
        }
    }

    return res;
}

math.min = min;

/**
 * Function documentation
 */
min.doc = {
    'name': 'min',
    'category': 'Statistics',
    'syntax': [
        'min(a, b, c, ...)'
    ],
    'description': 'Compute the minimum value of a list of values.',
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
