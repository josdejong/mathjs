/**
 * Create a range. range(start[, step], end) or start:end
 * @param {Number} start
 * @param {Number} [step]
 * @param {Number} end
 * @return {Number[]} range
 */
function range (start, step, end) {
    if (arguments.length != 1 && arguments.length != 2) {
        throw newArgumentsError('range', arguments.length, 1);
    }

    var r = new Range(start, end, step);
    return r.toArray();
}

math.range = range;

/**
 * Function documentation
 */
range.doc = {
    'name': 'range',
    'category': 'Matrix',
    'syntax': [
        'start : end',
        'start : step : end',
        'range(start, end)',
        'range(start, step, end)'
    ],
    'description': 'Create a range.',
    'examples': [
        '1:10',
        '0:10:100',
        '0:0.2:1',
        'range(20, -1, 10)',
        'matrix = [1, 2, 3; 4, 5, 6; 7, 8, 9]',
        'matrix(2:3, 1:2)'
    ],
    'seealso': [
        'diag', 'eye', 'ones', 'size', 'transpose', 'zeros'
    ]
};