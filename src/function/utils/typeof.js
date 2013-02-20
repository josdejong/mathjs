/**
 * Calculate the square root of a value
 * @param {*} x
 * @return {String} type  Lower case type, for example "number", "string",
 *                        "array".
 */
function _typeof(x) {
    var type = typeof x;

    if (type == 'object') {
        if (x == null) {
            return 'null';
        }
        if (x && x.constructor && x.constructor.name) {
            return x.constructor.name.toLowerCase();
        }
    }

    return type;
}

math['typeof'] = _typeof;

/**
 * Function documentation
 */
_typeof.doc = {
    'name': 'typeof',
    'category': 'Utils',
    'syntax': [
        'typeof(x)'
    ],
    'description': 'Get the type of a variable.',
    'examples': [
        'typeof(3.5)',
        'typeof(2 - 4i)',
        'typeof(45 deg)',
        'typeof("hello world")'
    ],
    'seealso': []
};
