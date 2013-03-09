/**
 * Get the real part of a complex number.
 * @param {Number | Complex | Array} x
 * @return {Number | Array} re
 */
function re(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('re', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x;
    }

    if (x instanceof Complex) {
        return x.re;
    }

    if (x instanceof Array) {
        return util.map(x, re);
    }
    // TODO: implement matrix support

    throw newUnsupportedTypeError('re', x);
}

math.re = re;

/**
 * Function documentation
 */
re.doc = {
    'name': 're',
    'category': 'Complex',
    'syntax': [
        're(x)'
    ],
    'description': 'Get the real part of a complex number.',
    'examples': [
        're(2 + 3i)',
        'im(2 + 3i)',
        're(-5.2i)',
        're(2.4)'
    ],
    'seealso': [
        'im',
        'conj',
        'abs',
        'arg'
    ]
};
