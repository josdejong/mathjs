/**
 * Import functions from an object or a file
 * @param {function | String | Object} object
 * @param {boolean} [override]         If true, existing functions will be
 *                                     overwritten. False by default.
 */
// TODO: return status information
math['import'] = function math_import(object, override) {
    var name;

    if (isString(object)) {
        // a string with a filename
        if (typeof (require) !== 'undefined') {
            // load the file using require
            var _module = require(object);
            math['import'](_module);
        }
        else {
            throw new Error('Cannot load file: require not available.');
        }
    }
    else if (isSupportedType(object)) {
        // a single function
        name = object.name;
        if (name) {
            if (override || math[name] === undefined) {
                math[name] = object;
            }
        }
        else {
            throw new Error('Cannot import an unnamed function');
        }
    }
    else if (object instanceof Object) {
        // a map with functions
        for (name in object) {
            if (object.hasOwnProperty(name)) {
                var value = object[name];
                if (isSupportedType(value)) {
                    if (override || math[name] === undefined) {
                        math[name] = value;
                    }
                }
                else {
                    math['import'](value);
                }
            }
        }
    }
};

/**
 * Check whether given object is a supported type
 * @param object
 * @return {Boolean}
 * @private
 */
function isSupportedType(object) {
    return (typeof object == 'function') ||
        isNumber(object) || isString(object) ||
        (object instanceof Complex) || (object instanceof Unit);
    // TODO: add boolean?
}
