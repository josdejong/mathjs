/**
 * Format a value of any type into a string. Interpolate values into the string.
 * Usage:
 *     math.format(array);
 *     math.format('Hello $name! The date is $date', {name: 'user', date: new Date()});
 *
 * @param {String} template
 * @param {Object} values
 * @return {String} str
 */
function format(template, values) {
    var num = arguments.length;
    if (num != 1 && num != 2) {
        throw newArgumentsError('format', num, 1, 2);
    }

    if (num == 1) {
        // just format a value as string
        var value = arguments[0];
        if (isNumber(value)) {
            return util.format(value);
        }

        if (value instanceof Array) {
            return formatArray(value);
        }

        if (isString(value)) {
            return '"' + value + '"';
        }

        if (value instanceof Object) {
            return value.toString();
        }

        return String(value);
    }
    else {
        if (!isString(template)) {
            throw new TypeError('String expected as first parameter in function format');
        }
        if (!(values instanceof Object)) {
            throw new TypeError('Object expected as first parameter in function format');
        }

        // format values into a string
        return template.replace(/\$([\w\.]+)/g, function (original, key) {
                var keys = key.split('.');
                var value = values[keys.shift()];
                while (keys.length && value != undefined) {
                    var k = keys.shift();
                    value = k ? value[k] : value + '.';
                }
                return value != undefined ? value : original;
            }
        );
    }
}

math.format = format;

/**
 * Format a n-dimensional array
 * @param {Array} array
 * @returns {string} str
 */
function formatArray (array) {
    var str = '[';
    var s = util.array.validatedSize(array);

    if (s.length != 2) {
        return formatArrayN(array);
    }

    var rows = s[0];
    var cols = s[1];
    for (var r = 0; r < rows; r++) {
        if (r != 0) {
            str += '; ';
        }

        var row = array[r];
        for (var c = 0; c < cols; c++) {
            if (c != 0) {
                str += ', ';
            }
            var cell = row[c];
            if (cell != undefined) {
                str += format(cell);
            }
        }
    }
    str += ']';

    return str;
}

/**
 * Recursively format an n-dimensional matrix
 * @param {Array} array
 * @returns {String} str
 */
function formatArrayN (array) {
    if (array instanceof Array) {
        var str = '[';
        var len = array.length;
        for (var i = 0; i < len; i++) {
            if (i != 0) {
                str += ', ';
            }
            str += formatArrayN(array[i]);
        }
        str += ']';
        return str;
    }
    else {
        return format(array);
    }
}

/**
 * Function documentation
 */
format.doc = {
    'name': 'format',
    'category': 'Utils',
    'syntax': [
        'format(value)'
    ],
    'description': 'Format a value of any type as string.',
    'examples': [
        'format(2.3)',
        'format(3 - 4i)',
        'format([])'
    ],
    'seealso': []
};
