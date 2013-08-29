/**
 * Determine the type of a variable
 *
 *     typeof(x)
 *
 * @param {*} x
 * @return {String} type  Lower case type, for example "number", "string",
 *                        "array".
 */
exports.type = function type (x) {
  var type = typeof x,
      name;

  if (type === 'object') {
    if (x === null) {
      return 'null';
    }
    if (x instanceof Boolean) {
      return 'boolean';
    }
    if (x instanceof Number) {
      return 'number';
    }
    if (x instanceof String) {
      return 'string';
    }
    if (Array.isArray(x)) {
      return 'array';
    }
    if (x instanceof Date) {
      return 'date';
    }
    if (x.constructor) {
      // search data types
      for (name in types) {
        if (types.hasOwnProperty(name)) {
          if (x.constructor == types[name]) {
            return name.toLowerCase();
          }
        }
      }

      // try the constructors name as last resort
      if (x.constructor.name) {
        return x.constructor.name.toLowerCase();
      }
    }
  }

  return type;
};

/**
 * Custom registered types, for example {'matrix': Matrix}
 * @private
 */
var types = {};

/**
 * Register a new type, for example addType('matrix', Matrix)
 * @param {String} name                     Lower case name of the type
 * @param {Function} type                   Prototype function of the type
 */
exports.addType = function addType (name, type) {
  types[name] = type;
};
