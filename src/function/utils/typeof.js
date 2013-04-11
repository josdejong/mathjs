/**
 * Calculate the square root of a value
 * @param {*} x
 * @return {String} type  Lower case type, for example "number", "string",
 *                        "array".
 */
math['typeof'] = function math_typeof(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('typeof', arguments.length, 1);
    }

    var type = typeof x;

    if (type == 'object') {
        if (x == null) {
            return 'null';
        }
        if (x.constructor) {
            for (var name in math) {
                if (math.hasOwnProperty(name)) {
                    if (x.constructor == math[name]) {
                        return name.toLowerCase();
                    }
                }
            }
            if (x.constructor.name) {
                return x.constructor.name.toLowerCase();
            }
        }
    }

    return type;
};
