// function utils

import { lruQueue } from './lruQueue.js'

/**
 * Memoize a given function by caching the computed result.
 * The cache of a memoized function can be cleared by deleting the `cache`
 * property of the function.
 *
 * @param {function} fn                     The function to be memoized.
 *                                          Must be a pure function.
 * @param {Object} [options]
 * @param {function(args: Array): string} [options.hasher]
 *    A custom hash builder. Is JSON.stringify by default.
 * @param {number | undefined} [options.limit]
 *    Maximum number of values that may be cached. Undefined indicates
 *    unlimited (default)
 * @return {function}                       Returns the memoized function
 */
export function memoize (fn, { hasher, limit } = {}) {
  limit = limit == null ? Number.POSITIVE_INFINITY : limit
  hasher = hasher == null ? JSON.stringify : hasher

  return function memoize () {
    if (typeof memoize.cache !== 'object') {
      memoize.cache = {
        values: new Map(),
        lru: lruQueue(limit || Number.POSITIVE_INFINITY)
      }
    }
    const args = []
    for (let i = 0; i < arguments.length; i++) {
      args[i] = arguments[i]
    }
    const hash = hasher(args)

    if (memoize.cache.values.has(hash)) {
      memoize.cache.lru.hit(hash)
      return memoize.cache.values.get(hash)
    }

    const newVal = fn.apply(fn, args)
    memoize.cache.values.set(hash, newVal)
    memoize.cache.values.delete(memoize.cache.lru.hit(hash))

    return newVal
  }
}

/**
 * Memoize a given function by caching all results and the arguments,
 * and comparing against the arguments of previous results before
 * executing again.
 * This is less performant than `memoize` which calculates a hash,
 * which is very fast to compare. Use `memoizeCompare` only when it is
 * not possible to create a unique serializable hash from the function
 * arguments.
 * The isEqual function must compare two sets of arguments
 * and return true when equal (can be a deep equality check for example).
 * @param {function} fn
 * @param {function(a: *, b: *) : boolean} isEqual
 * @returns {function}
 */
export function memoizeCompare (fn, isEqual) {
  const memoize = function memoize () {
    const args = []
    for (let i = 0; i < arguments.length; i++) {
      args[i] = arguments[i]
    }

    for (let c = 0; c < memoize.cache.length; c++) {
      const cached = memoize.cache[c]

      if (isEqual(args, cached.args)) {
        // TODO: move this cache entry to the top so recently used entries move up?
        return cached.res
      }
    }

    const res = fn.apply(fn, args)
    memoize.cache.unshift({ args, res })

    return res
  }

  memoize.cache = []

  return memoize
}
