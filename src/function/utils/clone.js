/**
 * Clone an object
 * @param {*} x
 * @return {*} clone
 */
function clone(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('clone', arguments.length, 1);
    }

    if (typeof(x.clone) === 'function') {
        return x.clone();
    }

    if (isNumber(x) || isString(x) || x === null) {
        return x;
    }

    if (x instanceof Array) {
        return x.map(function (value) {
            return clone(value);
        });
    }

    if (x instanceof Object) {
        return util.map(x, clone);
    }

    throw newUnsupportedTypeError('clone', x);
}

math.clone = clone;



/**
 * Function documentation
 */
clone.doc = {
    'name': 'clone',
    'category': 'Utils',
    'syntax': [
        'clone(x)'
    ],
    'description': 'Clone a variable. Creates a copy of primitive variables,' +
        'and a deep copy of matrices',
    'examples': [
        'clone(3.5)',
        'clone(2 - 4i)',
        'clone(45 deg)',
        'clone([1, 2; 3, 4])',
        'clone("hello world")'
    ],
    'seealso': []
};
