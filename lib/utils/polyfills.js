// TODO: remove these polyfills as soon as we have a build process that transpiles the code to ES5

// Polyfill for Object.assign for IE 11 (Object.assign is used in `escape-latex`)
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

// Polyfill for Object.assign for IE 11 (Object.assign is used in `escape-latex`)
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

// Polyfill for IE 11 (Number.isFinite is used in `complex.js`)
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
Number.isFinite = Number.isFinite || function(value) {
  return typeof value === 'number' && isFinite(value);
}

// Polyfill for IE 11
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
Number.isNaN = Number.isNaN || function(value) {
  return value !== value;
}
