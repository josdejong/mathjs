import { isInteger } from './number'
import { isNumber } from './is'
import { format } from './string'
import { DimensionError } from '../error/DimensionError'
import { IndexError } from '../error/IndexError'

/**
 * Calculate the size of a multi dimensional array.
 * This function checks the size of the first entry, it does not validate
 * whether all dimensions match. (use function `validate` for that)
 * @param {Array} x
 * @Return {Number[]} size
 */
export function arraySize (x) {
  let s = []

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
 * @param {number} dim   Current dimension
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
    // last dimension. none of the childs may be an array
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
 * Test whether index is an integer number with index >= 0 and index < length
 * when length is provided
 * @param {number} index    Zero-based index
 * @param {number} [length] Length of the array
 */
export function validateIndex (index, length) {
  if (!isNumber(index) || !isInteger(index)) {
    throw new TypeError('Index must be an integer (value: ' + index + ')')
  }
  if (index < 0 || (typeof length === 'number' && index >= length)) {
    throw new IndexError(index, length)
  }
}

/**
 * Resize a multi dimensional array. The resized array is returned.
 * @param {Array} array         Array to be resized
 * @param {Array.<number>} size Array with the size of each dimension
 * @param {*} [defaultValue=0]  Value to be filled in in new entries,
 *                              zero by default. Specify for example `null`,
 *                              to clearly see entries that are not explicitly
 *                              set.
 * @return {Array} array         The resized array
 */
export function resize (array, size, defaultValue) {
  // TODO: add support for scalars, having size=[] ?

  // check the type of the arguments
  if (!Array.isArray(array) || !Array.isArray(size)) {
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
 * @param {*} [defaultValue]    Value to be filled in in new entries,
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
 * @param {Array.<number>} sizes  List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 *
 * @throws {DimensionError}       If the product of the new dimension sizes does
 *                                not equal that of the old ones
 */
export function reshape (array, sizes) {
  const flatArray = flatten(array)
  let newArray

  function product (arr) {
    return arr.reduce((prev, curr) => prev * curr)
  }

  if (!Array.isArray(array) || !Array.isArray(sizes)) {
    throw new TypeError('Array expected')
  }

  if (sizes.length === 0) {
    throw new DimensionError(0, product(arraySize(array)), '!=')
  }

  let totalSize = 1
  for (let sizeIndex = 0; sizeIndex < sizes.length; sizeIndex++) {
    totalSize *= sizes[sizeIndex]
  }

  if (flatArray.length !== totalSize) {
    throw new DimensionError(
      product(sizes),
      product(arraySize(array)),
      '!='
    )
  }

  try {
    newArray = _reshape(flatArray, sizes)
  } catch (e) {
    if (e instanceof DimensionError) {
      throw new DimensionError(
        product(sizes),
        product(arraySize(array)),
        '!='
      )
    }
    throw e
  }

  return newArray
}

/**
 * Iteratively re-shape a multi dimensional array to fit the specified dimensions
 * @param {Array} array           Array to be reshaped
 * @param {Array.<number>} sizes  List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 */

function _reshape (array, sizes) {
  // testing if there are enough elements for the requested shape
  let tmpArray = array
  let tmpArray2
  // for each dimensions starting by the last one and ignoring the first one
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
  let s = size || arraySize(array)

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
 * Paramter `size` will be mutated to match the new, unqueezed matrix size.
 *
 * @param {Array} array
 * @param {number} dims       Desired number of dimensions of the array
 * @param {number} [outer]    Number of outer dimensions to be added
 * @param {Array} [size] Current size of array.
 * @returns {Array} returns the array itself
 * @private
 */
export function unsqueeze (array, dims, outer, size) {
  let s = size || arraySize(array)

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
 * @returns {Array | *} Returns the squeezed array
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
 * @return {Array}        The flattened array (1 dimensional)
 */
export function flatten (array) {
  if (!Array.isArray(array)) {
    // if not an array, return as is
    return array
  }
  let flat = []

  array.forEach(function callback (value) {
    if (Array.isArray(value)) {
      value.forEach(callback) // traverse through sub-arrays recursively
    } else {
      flat.push(value)
    }
  })

  return flat
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
 * Filter values in a callback given a regular expression
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

  let b = []
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

  let b = []
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
 * @return string
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
 * @param array
 * @returns {*}
 */
export function last (array) {
  return array[array.length - 1]
}

/**
 * Get all but the last element of array.
 */
export function initial (array) {
  return array.slice(0, array.length - 1)
}

/**
 * Test whether an array or string contains an item
 * @param {Array | string} array
 * @param {*} item
 * @return {boolean}
 */
export function contains (array, item) {
  return array.indexOf(item) !== -1
}
