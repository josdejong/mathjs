import { isIndex } from '../../utils/is'
import { clone } from '../../utils/object'
import { validateIndex } from '../../utils/array'
import { getSafeProperty, setSafeProperty } from '../../utils/customs'
import { DimensionError } from '../../error/DimensionError'
import { factory } from '../../utils/factory'

const name = 'subset'
const dependencies = ['typed', 'matrix']

export const createSubset = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix }) => {
  /**
   * Get or set a subset of a matrix or string.
   *
   * Syntax:
   *     math.subset(value, index)                                // retrieve a subset
   *     math.subset(value, index, replacement [, defaultValue])  // replace a subset
   *
   * Examples:
   *
   *     // get a subset
   *     const d = [[1, 2], [3, 4]]
   *     math.subset(d, math.index(1, 0))        // returns 3
   *     math.subset(d, math.index([0, 1], 1))   // returns [[2], [4]]
   *
   *     // replace a subset
   *     const e = []
   *     const f = math.subset(e, math.index(0, [0, 2]), [5, 6])  // f = [[5, 6]]
   *     const g = math.subset(f, math.index(1, 1), 7, 0)         // g = [[5, 6], [0, 7]]
   *
   * See also:
   *
   *     size, resize, squeeze, index
   *
   * @param {Array | Matrix | string} matrix  An array, matrix, or string
   * @param {Index} index                     An index containing ranges for each
   *                                          dimension
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
    'Array, Index': function (value, index) {
      const m = matrix(value)
      const subset = m.subset(index) // returns a Matrix
      return index.isScalar()
        ? subset
        : subset.valueOf() // return an Array (like the input)
    },

    'Matrix, Index': function (value, index) {
      return value.subset(index)
    },

    'Object, Index': _getObjectProperty,

    'string, Index': _getSubstring,

    // set subset
    'Array, Index, any': function (value, index, replacement) {
      return matrix(clone(value))
        .subset(index, replacement, undefined)
        .valueOf()
    },

    'Array, Index, any, any': function (value, index, replacement, defaultValue) {
      return matrix(clone(value))
        .subset(index, replacement, defaultValue)
        .valueOf()
    },

    'Matrix, Index, any': function (value, index, replacement) {
      return value.clone().subset(index, replacement)
    },

    'Matrix, Index, any, any': function (value, index, replacement, defaultValue) {
      return value.clone().subset(index, replacement, defaultValue)
    },

    'string, Index, string': _setSubstring,
    'string, Index, string, string': _setSubstring,
    'Object, Index, any': _setObjectProperty
  })
})

/**
 * Retrieve a subset of a string
 * @param {string} str            string from which to get a substring
 * @param {Index} index           An index containing ranges for each dimension
 * @returns {string} substring
 * @private
 */
function _getSubstring (str, index) {
  if (!isIndex(index)) {
    // TODO: better error message
    throw new TypeError('Index expected')
  }
  if (index.size().length !== 1) {
    throw new DimensionError(index.size().length, 1)
  }

  // validate whether the range is out of range
  const strLen = str.length
  validateIndex(index.min()[0], strLen)
  validateIndex(index.max()[0], strLen)

  const range = index.dimension(0)

  let substr = ''
  range.forEach(function (v) {
    substr += str.charAt(v)
  })

  return substr
}

/**
 * Replace a substring in a string
 * @param {string} str            string to be replaced
 * @param {Index} index           An index containing ranges for each dimension
 * @param {string} replacement    Replacement string
 * @param {string} [defaultValue] Default value to be uses when resizing
 *                                the string. is ' ' by default
 * @returns {string} result
 * @private
 */
function _setSubstring (str, index, replacement, defaultValue) {
  if (!index || index.isIndex !== true) {
    // TODO: better error message
    throw new TypeError('Index expected')
  }
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
  const len = range.size()[0]

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

  range.forEach(function (v, i) {
    chars[v] = replacement.charAt(i[0])
  })

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
