var util = require('../util/index.js'),

    Matrix = require('./Matrix.js'),

    isArray = Array.isArray,
    isString = util.string.isString;

// utility methods for strings, objects, and arrays

/**
 * Convert function arguments to an array. Arguments can have the following
 * signature:
 *     fn()
 *     fn(n)
 *     fn(m, n, p, ...)
 *     fn([m, n, p, ...])
 * @param {...Number | Array | Matrix} args
 * @returns {Array} array
 */
exports.argsToArray = function argsToArray(args) {
  var array;
  if (args.length == 0) {
    // fn()
    array = [];
  }
  else if (args.length == 1) {
    // fn(n)
    // fn([m, n, p, ...])
    array = args[0];
    if (array instanceof Matrix) {
      array = array.toVector();
    }
    if (!isArray(array)) {
      array = [array];
    }
  }
  else {
    // fn(m, n, p, ...)
    /* TODO: cleanup
    array = [];
    for (var i = 0; i < args.length; i++) {
      array[i] = args[i];
    }
    */
    array = Array.prototype.slice.apply(args);
  }
  return array;
};


/**
 * Test whether a value is a collection: an Array or Matrix
 * @param {*} x
 * @returns {boolean} isCollection
 */
exports.isCollection = function isCollection (x) {
  return (isArray(x) || (x instanceof Matrix));
};

// TODO: write the map, deepMap, map2, and deepMap2 functions in a more concise way
// TODO: remove map and map2, only use deepMap and deepMap2 everywhere?

/**
 * Execute function fn element wise for each element in array.
 * Returns an array with the results
 * @param {Array | Matrix} array
 * @param {function} fn
 * @return {Array | Matrix} res
 */
exports.map = function map(array, fn) {
  if (array && array.map) {
    return array.map(function (x) {
      return fn(x);
    });
  }
  else {
    throw new TypeError('Array expected');
  }
};

/**
 * Execute function fn element wise for each element in array and any nested
 * array
 * Returns an array with the results
 * @param {Array | Matrix} array
 * @param {function} fn
 * @return {Array | Matrix} res
 */
exports.deepMap = function deepMap(array, fn) {
  if (array && array.map) {
    return array.map(function (x) {
      return deepMap(x, fn);
    });
  }
  else {
    return fn(array);
  }
};

/**
 * Execute function fn element wise for each entry in two given arrays, or
 * for a (scalar) object and array pair. Returns an array with the results
 * @param {Array | Matrix | Object} array1
 * @param {Array | Matrix | Object} array2
 * @param {function} fn
 * @return {Array | Matrix} res
 */
exports.map2 = function map2(array1, array2, fn) {
  var res, len, i;

  // handle Matrix
  if (array1 instanceof Matrix || array2 instanceof Matrix) {
    return new Matrix(map2(array1.valueOf(), array2.valueOf(), fn));
  }

  if (isArray(array1)) {
    if (isArray(array2)) {
      // fn(array, array)
      if (array1.length != array2.length) {
        throw new RangeError('Dimension mismatch ' +
            '(' +  array1.length + ' != ' + array2.length + ')');
      }

      res = [];
      len = array1.length;
      for (i = 0; i < len; i++) {
        res[i] = fn(array1[i], array2[i]);
      }
    }
    else {
      // fn(array, object)
      res = [];
      len = array1.length;
      for (i = 0; i < len; i++) {
        res[i] = fn(array1[i], array2);
      }
    }
  }
  else {
    if (isArray(array2)) {
      // fn(object, array)
      res = [];
      len = array2.length;
      for (i = 0; i < len; i++) {
        res[i] = fn(array1, array2[i]);
      }
    }
    else {
      // fn(object, object)
      res = fn(array1, array2);
    }
  }

  return res;
};

/**
 * Execute function fn element wise for each entry in two given arrays,
 * and for any nested array. Objects can also be scalar objects.
 * Returns an array with the results.
 * @param {Array | Matrix | Object} array1
 * @param {Array | Matrix | Object} array2
 * @param {function} fn
 * @return {Array | Matrix} res
 */
exports.deepMap2 = function deepMap2(array1, array2, fn) {
  var res, len, i;

  // handle Matrix
  if (array1 instanceof Matrix || array2 instanceof Matrix) {
    return new Matrix(deepMap2(array1.valueOf(), array2.valueOf(), fn));
  }

  if (isArray(array1)) {
    if (isArray(array2)) {
      // fn(array, array)
      if (array1.length != array2.length) {
        throw new RangeError('Dimension mismatch ' +
            '(' +  array1.length + ' != ' + array2.length + ')');
      }

      res = [];
      len = array1.length;
      for (i = 0; i < len; i++) {
        res[i] = deepMap2(array1[i], array2[i], fn);
      }
    }
    else {
      // fn(array, object)
      res = [];
      len = array1.length;
      for (i = 0; i < len; i++) {
        res[i] = deepMap2(array1[i], array2, fn);
      }
    }
  }
  else {
    if (isArray(array2)) {
      // fn(object, array)
      res = [];
      len = array2.length;
      for (i = 0; i < len; i++) {
        res[i] = deepMap2(array1, array2[i], fn);
      }
    }
    else {
      // fn(object, object)
      res = fn(array1, array2);
    }
  }

  return res;
};
