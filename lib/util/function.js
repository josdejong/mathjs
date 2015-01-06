// function utils

/*
 * Memoize a given function by caching the computed result.
 * Very limited, supports only functions with one argument, and only primitive
 * values as argument.
 *
 * @param {function} fn   The function to be memoized. Must be a pure
 *                        function.
 * @return {function}     Returns the memoized function
 */
exports.memoize = function( fn ) {
  if (fn.length === 1) {
    function memoize( arg ){
      return (arg in memoize.cache) ?
          memoize.cache[arg] :
          (memoize.cache[arg] = fn(arg));
    }
    memoize.cache = {};

    return memoize;
  }
  else {
    throw new Error('Function must have one argument');
  }
};
