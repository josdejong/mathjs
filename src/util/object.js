var number = require('./number.js'),
    string = require('./string.js'),
    bool = require('./boolean.js');

/**
 * Clone an object
 *
 *     clone(x)
 *
 * @param {*} x
 * @return {*} clone
 */
exports.clone = function clone(x) {
  if (x == null) {
    // null or undefined
    return x;
  }

  if (typeof(x.clone) === 'function') {
    return x.clone();
  }

  if (number.isNumber(x) || string.isString(x) || bool.isBoolean(x)) {
    return x;
  }

  if (Array.isArray(x)) {
    return x.map(function (value) {
      return clone(value);
    });
  }

  if (x instanceof Object) {
    var m = {};
    for (var key in x) {
      if (x.hasOwnProperty(key)) {
        m[key] = clone(x[key]);
      }
    }
  }

  throw new TypeError('Cannot clone ' + x);
};

/**
 * Extend object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 */
exports.extend = function extend (a, b) {
  for (var prop in b) {
    if (b.hasOwnProperty(prop)) {
      a[prop] = b[prop];
    }
  }
  return a;
};

/**
 * Deep extend an object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
exports.deepExtend = function deepExtend (a, b) {
  for (var prop in b) {
    if (b.hasOwnProperty(prop)) {
      if (b[prop] && b[prop].constructor === Object) {
        if (a[prop] === undefined) {
          a[prop] = {};
        }
        if (a[prop].constructor === Object) {
          deepExtend(a[prop], b[prop]);
        }
        else {
          a[prop] = b[prop];
        }
      } else {
        a[prop] = b[prop];
      }
    }
  }
  return a;
};

/**
 * Deep test equality of all fields in two pairs of arrays or objects.
 * @param {Array | Object} a
 * @param {Array | Object} b
 * @returns {boolean}
 */
exports.deepEqual = function deepEqual (a, b) {
  var prop, i, len;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }

    for (i = 0, len = a.length; i < len; i++) {
      if (!exports.deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  else if (a instanceof Object) {
    if (Array.isArray(b) || !(b instanceof Object)) {
      return false;
    }

    for (prop in a) {
      if (a.hasOwnProperty(prop)) {
        if (!exports.deepEqual(a[prop], b[prop])) {
          return false;
        }
      }
    }
    for (prop in b) {
      if (b.hasOwnProperty(prop)) {
        if (!exports.deepEqual(a[prop], b[prop])) {
          return false;
        }
      }
    }
    return true;
  }
  else {
    return (a.valueOf() == b.valueOf());
  }
};
