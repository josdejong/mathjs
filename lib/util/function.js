// function utils

/*
 * Memoize a given function by caching the computed result.
 *
 * @param {function} fn   The function to be memoized. Must be a pure function.
 * @return {function}     Returns the memoized function
 */
exports.memoize = function( fn ) {
  function memoize(){
    var hash = JSON.stringify(arguments);
    if (!(hash in memoize.cache)) {
      return memoize.cache[hash] = fn.apply(fn, arguments);
    }
    return memoize.cache[hash];
  }
  memoize.cache = {};

  return memoize;
};
