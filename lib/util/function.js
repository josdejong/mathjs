// function utils

/*
 * Memoize a given function by caching the computed result.
 * The cache of a memoized function can be cleared by deleting the `cache`
 * property of the function.
 *
 * @param {function} fn   The function to be memoized. Must be a pure function.
 * @return {function}     Returns the memoized function
 */
exports.memoize = function(fn) {
  return function memoize() {
    if (typeof memoize.cache !== 'object') {
      memoize.cache = {};
    }

    var hash = JSON.stringify(arguments);
    if (!(hash in memoize.cache)) {
      return memoize.cache[hash] = fn.apply(fn, arguments);
    }
    return memoize.cache[hash];
  };
};
