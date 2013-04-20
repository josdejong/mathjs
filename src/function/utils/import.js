/**
 * Import functions from an object or a file
 * @param {function | String | Object} object
 * @param {Object} [options]        Available options:
 *                                  {Boolean} override
 *                                  If true, existing functions will be
 *                                  overwritten. False by default.
 */
// TODO: return status information
math['import'] = function math_import(object, options) {
    var name;
    var opts = {
        override: false
    };
    if (options && options instanceof Object) {
        util.extend(opts, options);
    }

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
            if (opts.override || math[name] === undefined) {
                _import(name, object);
            }
        }
        else {
            throw new Error('Cannot import an unnamed function or object');
        }
    }
    else if (object instanceof Object) {
        // a map with functions
        for (name in object) {
            if (object.hasOwnProperty(name)) {
                var value = object[name];
                if (isSupportedType(value)) {
                    if (opts.override || math[name] === undefined) {
                        _import(name, value);
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
 * Add a property to the math namespace and create a chain proxy for it.
 * @param {String} name
 * @param {*} value
 * @private
 */
function _import(name, value) {
    // add to math namespace
    math[name] = value;

    // create a proxy for the Selector
    createSelectorProxy(name, value);
}

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
