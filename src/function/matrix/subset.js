import { isIndex } from '../../utils/is.js'
import { clone } from '../../utils/object.js'
import { isEmptyIndex, validateIndex, validateIndexSourceSize } from '../../utils/array.js'
import { getSafeProperty, setSafeProperty } from '../../utils/customs.js'
import { DimensionError } from '../../error/DimensionError.js'
import { factory } from '../../utils/factory.js'

const name = 'subset'
export const dependencies = ['typed', 'matrix', 'zeros', 'add', 'index', 'size']

export const createSubset = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, zeros, add, index, size }) => {
  /**
   * Get or set a subset of a matrix or string.
   *
   * The second argument should be a specification of the desired subset of
   * the first argument. Therefore, the second argument is typically an Index
   * object produced by the `index` function, which see (in short, for each
   * dimension of the matrix, the Index specifies one position or a list or
   * range of positions to include in the subset).
   *
   * For convenience, the second argument may be simply a number n, in which
   * case the subset is the entire section of one dimension lower than the
   * given matrix, at position n. In other words, it corresponds to the
   * entry of a vector at position n, or the row of a 2D matrix at position
   * n, etc.
   *
   * Furthermore, it can also be an array of appropriate arguments to the
   * `index` function, in which case it will be passed to the `index` function
   * for you. Beware, though: in the case of a 1d vector v,
   * `math.subset(v, [2, 3])` will not therefore return the elements at
   * positions 2 and 3, because passing those arguments to `index` would
   * attempt to index the first dimension of v by and its nonexistent second
   * dimension by 3. You can call `math.subset(v, [[2, 3]])` to obtain the
   * elements at positions 2 and 3, because now the inner `[2, 3]` will be
   * interpreted as the list of positions with which to index into the first
   * dimension.
   *
   * Syntax:
   *     math.subset(value, index)                                // retrieve a subset
   *     math.subset(value, index, replacement [, defaultValue])  // replace a subset
   *
   * Examples:
   *
   *     // get a subset
   *     const d = [[1, 2], [3, 4]]
   *     math.subset(d, math.index(1, 0))               // returns 3 ...
   *     math.subset(d, [1, 0])                         // returns 3 ...
   *     math.subset(d, math.index([0, 1], [1]))        // Array [[2], [4]] ...
   *     math.subset(d, [[0, 1], [1]])                  // Array [[2], [4]] ...
   *     math.subset(d, math.index([false, true], [0])) // Array [[3]] ...
   *     math.subset(d, [[false, true], 0])             // Array [3] ...
   *     math.subset(d, 1)                              // Array [3, 4]
   *
   *     // replace a subset
   *     const e = []
   *     const f = math.subset(e, math.index(0, [0, 2]), [5, 6])
   *     f                                                 // Array [[5, 0, 6]] ...
   *     const g = math.subset(f, math.index(1, 1), 7, 0)
   *     g                                                 // Array [[5, 0, 6], [0, 7, 0]] ...
   *     math.subset(g, math.index([false, true], 1), 8)   // Array [[5, 0, 6], [0, 8, 0]]
   *
   *     // get submatrix using ranges
   *     const M = [
   *       [1, 2, 3],
   *       [4, 5, 6],
   *       [7, 8, 9]
   *     ]
   *     math.subset(M, math.index(math.range(0,2), math.range(0,3))) // Array [[1, 2, 3], [4, 5, 6]]
   *
   * See also:
   *
   *     size, resize, squeeze, index
   *
   * @param {Array | Matrix | string} matrix  An array, matrix, or string
   * @param {Index} index
   *    For each dimension of the target, specifies an index or a list of
   *    indices to fetch or set. `subset` uses the cartesian product of
   *    the indices specified in each dimension.
   * @param {*} [replacement]                 An array, matrix, or scalar.
   *                                          If provided, the subset is replaced with replacement.
   *                                          If not provided, the subset is returned
   * @param {*} [defaultValue=undefined]      Default value, filled in on new entries when
   *                                          the matrix is resized. If not provided,
   *                                          math.matrix elements will be left undefined.
   * @return {Array | Matrix | string} Either the retrieved subset or the updated matrix.
   */

  return typed(name, {
    // get subset
    'Matrix, Index': function (value, index) {
      if (isEmptyIndex(index)) { return matrix() }
      validateIndexSourceSize(value, index)
      return value.subset(index)
    },

    'Array, Index': typed.referTo('Matrix, Index', function (subsetRef) {
      return function (value, index) {
        const subsetResult = subsetRef(matrix(value), index)
        return index.isScalar() ? subsetResult : subsetResult.valueOf()
      }
    }),

    'Object, Index': _getObjectProperty,

    'string, Index': _getSubstring,

    // Allow single number index to get layer:
    'Matrix, number': function (M, position) {
      return M.layer(position)
    },

    'Array, number': function (A, position) {
      return A[position]
    },

    'string, number': function (s, position) {
      return s.charAt(position)
    },

    // Otherwise pass second array argument to index function for convenience
    'Matrix | Array | Object | string, Array': typed.referToSelf(
      self => (v, i) => self(v, index(...i))),

    // set subset
    'Matrix, Index, any, any': function (value, index, replacement, defaultValue) {
      if (isEmptyIndex(index)) { return value }
      validateIndexSourceSize(value, index)
      return value.clone().subset(index, _broadcastReplacement(replacement, index), defaultValue)
    },

    'Array, Index, any, any': typed.referTo('Matrix, Index, any, any', function (subsetRef) {
      return function (value, index, replacement, defaultValue) {
        const subsetResult = subsetRef(matrix(value), index, replacement, defaultValue)
        return subsetResult.isMatrix ? subsetResult.valueOf() : subsetResult
      }
    }),

    'string, Index, string': _setSubstring,
    'string, Index, string, string': _setSubstring,
    'Object, Index, any': _setObjectProperty,

    // fourth argument defaults to undefined:
    'Matrix | Array, Index | Array | number, any': typed.referToSelf(
      self => (v, pos, rep) => self(v, pos, rep, undefined)
    ),

    // Allow 2nd index to be a number:
    'Matrix | Array | Object | string, number, any, any': typed.referToSelf(
      self => (v, pos, rep, def) => {
        const ix = [pos]
        let wildcards = size(v).length
        while (--wildcards > 0) ix.push(':')
        return self(v, index(...ix), rep, def)
      }),

    'string, number, string': typed.referTo(
      'string, Index, string', sis => (s, n, rep) => sis(s, index(n), rep)),

    // Or allow 2nd argument to be an array of arguments to index
    'Matrix | Array | Object | string, Array, any, any': typed.referToSelf(
      self => (v, ixes, rep, def) => self(v, index(...ixes), rep, def)
    )
  })

  /**
   * Broadcasts a replacment value to be the same size as index
   * @param {number | BigNumber | Array | Matrix} replacement Replacement value to try to broadcast
   * @param {*} index Index value
   * @returns broadcasted replacement that matches the size of index
   */

  function _broadcastReplacement (replacement, index) {
    if (typeof replacement === 'string') {
      throw new Error('can\'t boradcast a string')
    }
    if (index.isScalar()) {
      return replacement
    }

    const indexSize = index.size()
    if (indexSize.every(d => d > 0)) {
      try {
        return add(replacement, zeros(indexSize))
      } catch (error) {
        return replacement
      }
    } else {
      return replacement
    }
  }
})

/**
 * Retrieve a subset of a string
 * @param {string} str            string from which to get a substring
 * @param {Index} index           An index or list of indices (character positions)
 * @returns {string} substring
 * @private
 */
function _getSubstring (str, index) {
  if (!isIndex(index)) {
    // TODO: better error message
    throw new TypeError('Index expected')
  }

  if (isEmptyIndex(index)) { return '' }
  validateIndexSourceSize(Array.from(str), index)

  if (index.size().length !== 1) {
    throw new DimensionError(index.size().length, 1)
  }

  // validate whether the range is out of range
  const strLen = str.length
  validateIndex(index.min()[0], strLen)
  validateIndex(index.max()[0], strLen)

  const range = index.dimension(0)

  let substr = ''
  function callback (v) {
    substr += str.charAt(v)
  }
  if (Number.isInteger(range)) {
    callback(range)
  } else {
    range.forEach(callback)
  }

  return substr
}

/**
 * Replace a substring in a string
 * @param {string} str            string to be replaced
 * @param {Index} index           An index or list of indices (character positions)
 * @param {string} replacement    Replacement string
 * @param {string} [defaultValue] Default value to be used when resizing
 *                                the string. is ' ' by default
 * @returns {string} result
 * @private
 */
function _setSubstring (str, index, replacement, defaultValue) {
  if (!index || index.isIndex !== true) {
    // TODO: better error message
    throw new TypeError('Index expected')
  }
  if (isEmptyIndex(index)) { return str }
  validateIndexSourceSize(Array.from(str), index)
  if (index.size().length !== 1) {
    throw new DimensionError(index.size().length, 1)
  }
  if (defaultValue !== undefined) {
    if (typeof defaultValue !== 'string' || defaultValue.length !== 1) {
      throw new TypeError('Single character expected as defaultValue')
    }
  } else {
    defaultValue = ' '
  }

  const range = index.dimension(0)
  const len = Number.isInteger(range) ? 1 : range.size()[0]

  if (len !== replacement.length) {
    throw new DimensionError(range.size()[0], replacement.length)
  }

  // validate whether the range is out of range
  const strLen = str.length
  validateIndex(index.min()[0])
  validateIndex(index.max()[0])

  // copy the string into an array with characters
  const chars = []
  for (let i = 0; i < strLen; i++) {
    chars[i] = str.charAt(i)
  }

  function callback (v, i) {
    chars[v] = replacement.charAt(i[0])
  }

  if (Number.isInteger(range)) {
    callback(range, [0])
  } else {
    range.forEach(callback)
  }

  // initialize undefined characters with a space
  if (chars.length > strLen) {
    for (let i = strLen - 1, len = chars.length; i < len; i++) {
      if (!chars[i]) {
        chars[i] = defaultValue
      }
    }
  }

  return chars.join('')
}

/**
 * Retrieve a property from an object
 * @param {Object} object
 * @param {Index} index
 * @return {*} Returns the value of the property
 * @private
 */
function _getObjectProperty (object, index) {
  if (isEmptyIndex(index)) { return undefined }

  if (index.size().length !== 1) {
    throw new DimensionError(index.size(), 1)
  }

  const key = index.dimension(0)
  if (typeof key !== 'string') {
    throw new TypeError('String expected as index to retrieve an object property')
  }

  return getSafeProperty(object, key)
}

/**
 * Set a property on an object
 * @param {Object} object
 * @param {Index} index
 * @param {*} replacement
 * @return {*} Returns the updated object
 * @private
 */
function _setObjectProperty (object, index, replacement) {
  if (isEmptyIndex(index)) { return object }
  if (index.size().length !== 1) {
    throw new DimensionError(index.size(), 1)
  }

  const key = index.dimension(0)
  if (typeof key !== 'string') {
    throw new TypeError('String expected as index to retrieve an object property')
  }

  // clone the object, and apply the property to the clone
  const updated = clone(object)
  setSafeProperty(updated, key, replacement)

  return updated
}
