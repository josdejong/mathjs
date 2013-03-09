/**
 * Get the imaginary part of a complex number.
 * @param {Number | Complex | Array} x
 * @return {Number | Array} im
 */
function im(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('im', arguments.length, 1);
    }

    if (isNumber(x)) {
        return 0;
    }

    if (x instanceof Complex) {
        return x.im;
    }

    if (x instanceof Array) {
        return util.map(x, im);
    }
    // TODO: implement matrix support

    throw newUnsupportedTypeError('im', x);
}

math.im = im;

/**
 * Function documentation
 */
im.doc = {
    'name': 'im',
    'category': 'Complex',
    'syntax': [
        'im(x)'
    ],
    'description': 'Get the imaginary part of a complex number.',
    'examples': [
        'im(2 + 3i)',
        're(2 + 3i)',
        'im(-5.2i)',
        'im(2.4)'
    ],
    'seealso': [
        're',
        'conj',
        'abs',
        'arg'
    ]
};
