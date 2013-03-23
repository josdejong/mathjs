/**
 * Format a value of any type into a string. Interpolate values into the string.
 * Usage:
 *     math.format(value)
 *     math.format(template, object)
 *
 * Example usage:
 *     math.format(2/7);                // '0.2857142857'
 *     math.format(new Complex(2, 3));  // '2 + 3i'
 *     math.format('Hello $name! The date is $date', {
 *         name: 'user',
 *         date: new Date().toISOString().substring(0, 10)
 *     });                              // 'hello user! The date is 2013-03-23'
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
            return util.formatNumber(value);
        }

        if (value instanceof Array) {
            return util.formatArray(value);
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
