/**
 * Determine the type of a variable
 *
 *     typeof(x)
 *
 * @param {*} x
 * @return {String} type  Lower case type, for example "number", "string",
 *                        "array".
 */
math['typeof'] = function math_typeof(x) {
  if (arguments.length != 1) {
    throw newArgumentsError('typeof', arguments.length, 1);
  }

  var type = typeof x,
      name;

  if (type == 'object') {
    if (x == null) {
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
      // search functions / constants
      for (name in math) {
        if (math.hasOwnProperty(name)) {
          if (x.constructor == math[name]) {
            return name.toLowerCase();
          }
        }
      }

      // search data types
      for (name in math.type) {
        if (math.type.hasOwnProperty(name)) {
          if (x.constructor == math.type[name]) {
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
