import { isInteger } from './number.js'
import { isNumber, isBigNumber, isArray, isString } from './is.js'
import { format } from './string.js'
import { DimensionError } from '../error/DimensionError.js'
import { IndexError } from '../error/IndexError.js'
import { deepStrictEqual } from './object.js'

/**
 * Calculate the size of a multi dimensional array.
 * This function checks the size of the first entry, it does not validate
 * whether all dimensions match. (use function `validate` for that)
 * @param {Array} x
 * @return {number[]} size
 */
export function arraySize (x) {
  const s = []

  while (Array.isArray(x)) {
    s.push(x.length)
    x = x[0]
  }

  return s
}

/**
 * Recursively validate whether each element in a multi dimensional array
 * has a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @param {number} dim     Current dimension
 * @throws DimensionError
 * @private
 */
function _validate (array, size, dim) {
  let i
  const len = array.length

  if (len !== size[dim]) {
    throw new DimensionError(len, size[dim])
  }

  if (dim < size.length - 1) {
    // recursively validate each child array
    const dimNext = dim + 1
    for (i = 0; i < len; i++) {
      const child = array[i]
      if (!Array.isArray(child)) {
        throw new DimensionError(size.length - 1, size.length, '<')
      }
      _validate(array[i], size, dimNext)
    }
  } else {
    // last dimension. none of the children may be an array
    for (i = 0; i < len; i++) {
      if (Array.isArray(array[i])) {
        throw new DimensionError(size.length + 1, size.length, '>')
      }
    }
  }
}

/**
 * Validate whether each element in a multi dimensional array has
 * a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @throws DimensionError
 */
export function validate (array, size) {
  const isScalar = (size.length === 0)
  if (isScalar) {
    // scalar
    if (Array.isArray(array)) {
      throw new DimensionError(array.length, 0)
    }
  } else {
    // array
    _validate(array, size, 0)
  }
}

/**
 * Validate whether the source of the index matches the size of the Array
 * @param {Array | Matrix} value    Array to be validated
 * @param {Index} index  Index with the source information to validate
 * @throws DimensionError
 */
export function validateIndexSourceSize (value, index) {
  const valueSize = value.isMatrix ? value._size : arraySize(value)
  const sourceSize = index._sourceSize
  // checks if the source size is not null and matches the valueSize
  sourceSize.forEach((sourceDim, i) => {
    if (sourceDim !== null && sourceDim !== valueSize[i]) { throw new DimensionError(sourceDim, valueSize[i]) }
  })
}

/**
 * Test whether index is an integer number with index >= 0 and index < length
 * when length is provided
 * @param {number} index    Zero-based index
 * @param {number} [length] Length of the array
 */
export function validateIndex (index, length) {
  if (index !== undefined) {
    if (!isNumber(index) || !isInteger(index)) {
      throw new TypeError('Index must be an integer (value: ' + index + ')')
    }
    if (index < 0 || (typeof length === 'number' && index >= length)) {
      throw new IndexError(index, length)
    }
  }
}

/**
 * Test if an index has empty values
 * @param {Index} index    Zero-based index
 */
export function isEmptyIndex (index) {
  for (let i = 0; i < index._dimensions.length; ++i) {
    const dimension = index._dimensions[i]
    if (dimension._data && isArray(dimension._data)) {
      if (dimension._size[0] === 0) {
        return true
      }
    } else if (dimension.isRange) {
      if (dimension.start === dimension.end) {
        return true
      }
    } else if (isString(dimension)) {
      if (dimension.length === 0) {
        return true
      }
    }
  }
  return false
}

/**
 * Resize a multi dimensional array. The resized array is returned.
 * @param {Array | number} array         Array to be resized
 * @param {number[]} size Array with the size of each dimension
 * @param {*} [defaultValue=0]  Value to be filled in new entries,
 *                              zero by default. Specify for example `null`,
 *                              to clearly see entries that are not explicitly
 *                              set.
 * @return {Array} array         The resized array
 */
export function resize (array, size, defaultValue) {
  // check the type of the arguments
  if (!Array.isArray(size)) {
    throw new TypeError('Array expected')
  }
  if (size.length === 0) {
    throw new Error('Resizing to scalar is not supported')
  }

  // check whether size contains positive integers
  size.forEach(function (value) {
    if (!isNumber(value) || !isInteger(value) || value < 0) {
      throw new TypeError('Invalid size, must contain positive integers ' +
        '(size: ' + format(size) + ')')
    }
  })

  // convert number to an array
  if (isNumber(array) || isBigNumber(array)) {
    array = [array]
  }

  // recursively resize the array
  const _defaultValue = (defaultValue !== undefined) ? defaultValue : 0
  _resize(array, size, 0, _defaultValue)

  return array
}

/**
 * Recursively resize a multi dimensional array
 * @param {Array} array         Array to be resized
 * @param {number[]} size       Array with the size of each dimension
 * @param {number} dim          Current dimension
 * @param {*} [defaultValue]    Value to be filled in new entries,
 *                              undefined by default.
 * @private
 */
function _resize (array, size, dim, defaultValue) {
  let i
  let elem
  const oldLen = array.length
  const newLen = size[dim]
  const minLen = Math.min(oldLen, newLen)

  // apply new length
  array.length = newLen

  if (dim < size.length - 1) {
    // non-last dimension
    const dimNext = dim + 1

    // resize existing child arrays
    for (i = 0; i < minLen; i++) {
      // resize child array
      elem = array[i]
      if (!Array.isArray(elem)) {
        elem = [elem] // add a dimension
        array[i] = elem
      }
      _resize(elem, size, dimNext, defaultValue)
    }

    // create new child arrays
    for (i = minLen; i < newLen; i++) {
      // get child array
      elem = []
      array[i] = elem

      // resize new child array
      _resize(elem, size, dimNext, defaultValue)
    }
  } else {
    // last dimension

    // remove dimensions of existing values
    for (i = 0; i < minLen; i++) {
      while (Array.isArray(array[i])) {
        array[i] = array[i][0]
      }
    }

    // fill new elements with the default value
    for (i = minLen; i < newLen; i++) {
      array[i] = defaultValue
    }
  }
}

/**
 * Re-shape a multi dimensional array to fit the specified dimensions
 * @param {Array} array           Array to be reshaped
 * @param {number[]} sizes        List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 *
 * @throws {DimensionError}       If the product of the new dimension sizes does
 *                                not equal that of the old ones
 */
export function reshape (array, sizes) {
  const flatArray = flatten(array, true) // since it has rectangular
  const currentLength = flatArray.length

  if (!Array.isArray(array) || !Array.isArray(sizes)) {
    throw new TypeError('Array expected')
  }

  if (sizes.length === 0) {
    throw new DimensionError(0, currentLength, '!=')
  }

  sizes = processSizesWildcard(sizes, currentLength)
  const newLength = product(sizes)
  if (currentLength !== newLength) {
    throw new DimensionError(
      newLength,
      currentLength,
      '!='
    )
  }

  try {
    return _reshape(flatArray, sizes)
  } catch (e) {
    if (e instanceof DimensionError) {
      throw new DimensionError(
        newLength,
        currentLength,
        '!='
      )
    }
    throw e
  }
}

/**
 * Replaces the wildcard -1 in the sizes array.
 * @param {number[]} sizes  List of sizes for each dimension. At most one wildcard.
 * @param {number} currentLength  Number of elements in the array.
 * @throws {Error}                If more than one wildcard or unable to replace it.
 * @returns {number[]}      The sizes array with wildcard replaced.
 */
export function processSizesWildcard (sizes, currentLength) {
  const newLength = product(sizes)
  const processedSizes = sizes.slice()
  const WILDCARD = -1
  const wildCardIndex = sizes.indexOf(WILDCARD)

  const isMoreThanOneWildcard = sizes.indexOf(WILDCARD, wildCardIndex + 1) >= 0
  if (isMoreThanOneWildcard) {
    throw new Error('More than one wildcard in sizes')
  }

  const hasWildcard = wildCardIndex >= 0
  const canReplaceWildcard = currentLength % newLength === 0

  if (hasWildcard) {
    if (canReplaceWildcard) {
      processedSizes[wildCardIndex] = -currentLength / newLength
    } else {
      throw new Error('Could not replace wildcard, since ' + currentLength + ' is no multiple of ' + (-newLength))
    }
  }
  return processedSizes
}

/**
 * Computes the product of all array elements.
 * @param {number[]} array Array of factors
 * @returns {number}            Product of all elements
 */
function product (array) {
  return array.reduce((prev, curr) => prev * curr, 1)
}

/**
 * Iteratively re-shape a multi dimensional array to fit the specified dimensions
 * @param {Array} array           Array to be reshaped
 * @param {number[]} sizes  List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 */

function _reshape (array, sizes) {
  // testing if there are enough elements for the requested shape
  let tmpArray = array
  let tmpArray2
  // for each dimension starting by the last one and ignoring the first one
  for (let sizeIndex = sizes.length - 1; sizeIndex > 0; sizeIndex--) {
    const size = sizes[sizeIndex]
    tmpArray2 = []

    // aggregate the elements of the current tmpArray in elements of the requested size
    const length = tmpArray.length / size
    for (let i = 0; i < length; i++) {
      tmpArray2.push(tmpArray.slice(i * size, (i + 1) * size))
    }
    // set it as the new tmpArray for the next loop turn or for return
    tmpArray = tmpArray2
  }

  return tmpArray
}

/**
 * Squeeze a multi dimensional array
 * @param {Array} array
 * @param {Array} [size]
 * @returns {Array} returns the array itself
 */
export function squeeze (array, size) {
  const s = size || arraySize(array)

  // squeeze outer dimensions
  while (Array.isArray(array) && array.length === 1) {
    array = array[0]
    s.shift()
  }

  // find the first dimension to be squeezed
  let dims = s.length
  while (s[dims - 1] === 1) {
    dims--
  }

  // squeeze inner dimensions
  if (dims < s.length) {
    array = _squeeze(array, dims, 0)
    s.length = dims
  }

  return array
}

/**
 * Recursively squeeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the squeezed array
 * @private
 */
function _squeeze (array, dims, dim) {
  let i, ii

  if (dim < dims) {
    const next = dim + 1
    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _squeeze(array[i], dims, next)
    }
  } else {
    while (Array.isArray(array)) {
      array = array[0]
    }
  }

  return array
}

/**
 * Unsqueeze a multi dimensional array: add dimensions when missing
 *
 * Parameter `size` will be mutated to match the new, unsqueezed matrix size.
 *
 * @param {Array} array
 * @param {number} dims       Desired number of dimensions of the array
 * @param {number} [outer]    Number of outer dimensions to be added
 * @param {Array} [size] Current size of array.
 * @returns {Array} returns the array itself
 * @private
 */
export function unsqueeze (array, dims, outer, size) {
  const s = size || arraySize(array)

  // unsqueeze outer dimensions
  if (outer) {
    for (let i = 0; i < outer; i++) {
      array = [array]
      s.unshift(1)
    }
  }

  // unsqueeze inner dimensions
  array = _unsqueeze(array, dims, 0)
  while (s.length < dims) {
    s.push(1)
  }

  return array
}

/**
 * Recursively unsqueeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the unsqueezed array
 * @private
 */
function _unsqueeze (array, dims, dim) {
  let i, ii

  if (Array.isArray(array)) {
    const next = dim + 1
    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _unsqueeze(array[i], dims, next)
    }
  } else {
    for (let d = dim; d < dims; d++) {
      array = [array]
    }
  }

  return array
}
/**
 * Flatten a multi dimensional array, put all elements in a one dimensional
 * array
 * @param {Array} array   A multi dimensional array
 * @param {boolean} isRectangular Optional. If the array is rectangular (not jagged)
 * @return {Array}        The flattened array (1 dimensional)
 */
export function flatten (array, isRectangular = false) {
  if (!Array.isArray(array)) {
    // if not an array, return as is
    return array
  }
  if (typeof isRectangular !== 'boolean') {
    throw new TypeError('Boolean expected for second argument of flatten')
  }
  const flat = []

  if (isRectangular) {
    _flattenRectangular(array)
  } else {
    _flatten(array)
  }

  return flat

  function _flatten (array) {
    for (let i = 0; i < array.length; i++) {
      const item = array[i]
      if (Array.isArray(item)) {
        _flatten(item)
      } else {
        flat.push(item)
      }
    }
  }

  function _flattenRectangular (array) {
    if (Array.isArray(array[0])) {
      for (let i = 0; i < array.length; i++) {
        _flattenRectangular(array[i])
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        flat.push(array[i])
      }
    }
  }
}

/**
 * A safe map
 * @param {Array} array
 * @param {function} callback
 */
export function map (array, callback) {
  return Array.prototype.map.call(array, callback)
}

/**
 * A safe forEach
 * @param {Array} array
 * @param {function} callback
 */
export function forEach (array, callback) {
  Array.prototype.forEach.call(array, callback)
}

/**
 * A safe filter
 * @param {Array} array
 * @param {function} callback
 */
export function filter (array, callback) {
  if (arraySize(array).length !== 1) {
    throw new Error('Only one dimensional matrices supported')
  }

  return Array.prototype.filter.call(array, callback)
}

/**
 * Filter values in an array given a regular expression
 * @param {Array} array
 * @param {RegExp} regexp
 * @return {Array} Returns the filtered array
 * @private
 */
export function filterRegExp (array, regexp) {
  if (arraySize(array).length !== 1) {
    throw new Error('Only one dimensional matrices supported')
  }

  return Array.prototype.filter.call(array, (entry) => regexp.test(entry))
}

/**
 * A safe join
 * @param {Array} array
 * @param {string} separator
 */
export function join (array, separator) {
  return Array.prototype.join.call(array, separator)
}

/**
 * Assign a numeric identifier to every element of a sorted array
 * @param {Array} a  An array
 * @return {Array} An array of objects containing the original value and its identifier
 */
export function identify (a) {
  if (!Array.isArray(a)) {
    throw new TypeError('Array input expected')
  }

  if (a.length === 0) {
    return a
  }

  const b = []
  let count = 0
  b[0] = { value: a[0], identifier: 0 }
  for (let i = 1; i < a.length; i++) {
    if (a[i] === a[i - 1]) {
      count++
    } else {
      count = 0
    }
    b.push({ value: a[i], identifier: count })
  }
  return b
}

/**
 * Remove the numeric identifier from the elements
 * @param {array} a  An array
 * @return {array} An array of values without identifiers
 */
export function generalize (a) {
  if (!Array.isArray(a)) {
    throw new TypeError('Array input expected')
  }

  if (a.length === 0) {
    return a
  }

  const b = []
  for (let i = 0; i < a.length; i++) {
    b.push(a[i].value)
  }
  return b
}

/**
 * Check the datatype of a given object
 * This is a low level implementation that should only be used by
 * parent Matrix classes such as SparseMatrix or DenseMatrix
 * This method does not validate Array Matrix shape
 * @param {Array} array
 * @param {function} typeOf   Callback function to use to determine the type of a value
 * @return {string}
 */
export function getArrayDataType (array, typeOf) {
  let type // to hold type info
  let length = 0 // to hold length value to ensure it has consistent sizes

  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    const isArray = Array.isArray(item)

    // Saving the target matrix row size
    if (i === 0 && isArray) {
      length = item.length
    }

    // If the current item is an array but the length does not equal the targetVectorSize
    if (isArray && item.length !== length) {
      return undefined
    }

    const itemType = isArray
      ? getArrayDataType(item, typeOf) // recurse into a nested array
      : typeOf(item)

    if (type === undefined) {
      type = itemType // first item
    } else if (type !== itemType) {
      return 'mixed'
    } else {
      // we're good, everything has the same type so far
    }
  }

  return type
}

/**
 * Return the last item from an array
 * @param {Array} array
 * @returns {*}
 */
export function last (array) {
  return array[array.length - 1]
}

/**
 * Get all but the last element of array.
 * @param {Array} array
 * @returns {Array}
 */
export function initial (array) {
  return array.slice(0, array.length - 1)
}

/**
 * Recursively concatenate two matrices.
 * The contents of the matrices are not cloned.
 * @param {Array} a             Multi dimensional array
 * @param {Array} b             Multi dimensional array
 * @param {number} concatDim    The dimension on which to concatenate (zero-based)
 * @param {number} dim          The current dim (zero-based)
 * @return {Array} c            The concatenated matrix
 * @private
 */
function concatRecursive (a, b, concatDim, dim) {
  if (dim < concatDim) {
    // recurse into next dimension
    if (a.length !== b.length) {
      throw new DimensionError(a.length, b.length)
    }

    const c = []
    for (let i = 0; i < a.length; i++) {
      c[i] = concatRecursive(a[i], b[i], concatDim, dim + 1)
    }
    return c
  } else {
    // concatenate this dimension
    return a.concat(b)
  }
}

/**
 * Concatenates many arrays in the specified direction
 * @param {...Array} arrays All the arrays to concatenate
 * @param {number} concatDim The dimension on which to concatenate (zero-based)
 * @returns {Array}
 */
export function concat () {
  const arrays = Array.prototype.slice.call(arguments, 0, -1)
  const concatDim = Array.prototype.slice.call(arguments, -1)

  if (arrays.length === 1) {
    return arrays[0]
  }
  if (arrays.length > 1) {
    return arrays.slice(1).reduce(function (A, B) { return concatRecursive(A, B, concatDim, 0) }, arrays[0])
  } else {
    throw new Error('Wrong number of arguments in function concat')
  }
}

/**
 * Receives two or more sizes and gets the broadcasted size for both.
 * @param  {...number[]} sizes Sizes to broadcast together
 * @returns {number[]} The broadcasted size
 */
export function broadcastSizes (...sizes) {
  const dimensions = sizes.map((s) => s.length)
  const N = Math.max(...dimensions)
  const sizeMax = new Array(N).fill(null)
  // check for every size
  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i]
    const dim = dimensions[i]
    for (let j = 0; j < dim; j++) {
      const n = N - dim + j
      if (size[j] > sizeMax[n]) {
        sizeMax[n] = size[j]
      }
    }
  }
  for (let i = 0; i < sizes.length; i++) {
    checkBroadcastingRules(sizes[i], sizeMax)
  }
  return sizeMax
}

/**
 * Checks if it's possible to broadcast a size to another size
 * @param {number[]} size The size of the array to check
 * @param {number[]} toSize The size of the array to validate if it can be broadcasted to
 */
export function checkBroadcastingRules (size, toSize) {
  const N = toSize.length
  const dim = size.length
  for (let j = 0; j < dim; j++) {
    const n = N - dim + j
    if ((size[j] < toSize[n] && size[j] > 1) || (size[j] > toSize[n])) {
      throw new Error(
        `shape mismatch: mismatch is found in arg with shape (${size}) not possible to broadcast dimension ${dim} with size ${size[j]} to size ${toSize[n]}`
      )
    }
  }
}

/**
 * Broadcasts a single array to a certain size
 * @param {Array} array Array to be broadcasted
 * @param {number[]} toSize Size to broadcast the array
 * @returns {Array} The broadcasted array
 */
export function broadcastTo (array, toSize) {
  let Asize = arraySize(array)
  if (deepStrictEqual(Asize, toSize)) {
    return array
  }
  checkBroadcastingRules(Asize, toSize)
  const broadcastedSize = broadcastSizes(Asize, toSize)
  const N = broadcastedSize.length
  const paddedSize = [...Array(N - Asize.length).fill(1), ...Asize]

  let A = clone(array)
  // reshape A if needed to make it ready for concat
  if (Asize.length < N) {
    A = reshape(A, paddedSize)
    Asize = arraySize(A)
  }

  // stretches the array on each dimension to make it the same size as index
  for (let dim = 0; dim < N; dim++) {
    if (Asize[dim] < broadcastedSize[dim]) {
      A = stretch(A, broadcastedSize[dim], dim)
      Asize = arraySize(A)
    }
  }
  return A
}

/**
 * Broadcasts arrays and returns the broadcasted arrays in an array
 * @param  {...Array | any} arrays
 * @returns {Array[]} The broadcasted arrays
 */
export function broadcastArrays (...arrays) {
  if (arrays.length === 0) {
    throw new Error('Insufficient number of arguments in function broadcastArrays')
  }
  if (arrays.length === 1) {
    return arrays[0]
  }
  const sizes = arrays.map(function (array) { return arraySize(array) })
  const broadcastedSize = broadcastSizes(...sizes)
  const broadcastedArrays = []
  arrays.forEach(function (array) { broadcastedArrays.push(broadcastTo(array, broadcastedSize)) })
  return broadcastedArrays
}

/**
 * Stretches a matrix up to a certain size in a certain dimension
 * @param {Array} arrayToStretch
 * @param {number[]} sizeToStretch
 * @param {number} dimToStretch
 * @returns {Array} The stretched array
 */
export function stretch (arrayToStretch, sizeToStretch, dimToStretch) {
  return concat(...Array(sizeToStretch).fill(arrayToStretch), dimToStretch)
}

/**
* Retrieves a single element from an array given an index.
*
* @param {Array} array - The array from which to retrieve the value.
* @param {Array<number>} index - An array of indices specifying the position of the desired element in each dimension.
* @returns {*} - The value at the specified position in the array.
*
* @example
* const arr = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
* const index = [1, 0, 1];
* console.log(get(arr, index)); // 6
*/
export function get (array, index) {
  if (!Array.isArray(array)) { throw new Error('Array expected') }
  const size = arraySize(array)
  if (index.length !== size.length) { throw new DimensionError(index.length, size.length) }
  for (let x = 0; x < index.length; x++) { validateIndex(index[x], size[x]) }
  return index.reduce((acc, curr) => acc[curr], array)
}

/**
 * Recursively maps over each element of nested array using a provided callback function.
 *
 * @param {Array} array - The array to be mapped.
 * @param {Function} callback - The function to execute on each element, taking three arguments:
 *   - `value` (any): The current element being processed in the array.
 *   - `index` (Array<number>): The index of the current element being processed in the array.
 *   - `array` (Array): The array `deepMap` was called upon.
 * @param {boolean} [skipIndex=false] - If true, the callback function is called with only the value.
 * @returns {Array} A new array with each element being the result of the callback function.
 */
export function deepMap (array, callback, skipIndex = false) {
  if (array.length === 0) {
    return []
  }

  if (skipIndex) {
    return recursiveMap(array)
  }
  const index = []

  return recursiveMapWithIndex(array, 0)

  function recursiveMapWithIndex (value, depth) {
    if (Array.isArray(value)) {
      const N = value.length
      const result = Array(N)
      for (let i = 0; i < N; i++) {
        index[depth] = i
        result[i] = recursiveMapWithIndex(value[i], depth + 1)
      }
      return result
    } else {
      return callback(value, index.slice(0, depth), array)
    }
  }
  function recursiveMap (value) {
    if (Array.isArray(value)) {
      const N = value.length
      const result = Array(N)
      for (let i = 0; i < N; i++) {
        result[i] = recursiveMap(value[i])
      }
      return result
    } else {
      return callback(value)
    }
  }
}

/**
 * Recursively iterates over each element in a multi-dimensional array and applies a callback function.
 *
 * @param {Array} array - The multi-dimensional array to iterate over.
 * @param {Function} callback - The function to execute for each element. It receives three arguments:
 *   - {any} value: The current element being processed in the array.
 *   - {Array<number>} index: The index of the current element in each dimension.
 *   - {Array} array: The original array being processed.
 * @param {boolean} [skipIndex=false] - If true, the callback function is called with only the value.
 */
export function deepForEach (array, callback, skipIndex = false) {
  if (array.length === 0) {
    return
  }

  if (skipIndex) {
    recursiveForEach(array)
    return
  }
  const index = []
  recursiveForEachWithIndex(array, 0)

  function recursiveForEachWithIndex (value, depth) {
    if (Array.isArray(value)) {
      const N = value.length
      for (let i = 0; i < N; i++) {
        index[depth] = i
        recursiveForEachWithIndex(value[i], depth + 1)
      }
    } else {
      callback(value, index.slice(0, depth), array)
    }
  }
  function recursiveForEach (value) {
    if (Array.isArray(value)) {
      const N = value.length
      for (let i = 0; i < N; i++) {
        recursiveForEach(value[i])
      }
    } else {
      callback(value)
    }
  }
}

/**
 * Deep clones a multidimensional array
 * @param {Array} array
 * @returns {Array} cloned array
 */
export function clone (array) {
  return Object.assign([], array)
}
