/**
 * Maps each element of the array using the provided callback function.
 *
 * @param {Array} array - The array to be mapped.
 * @param {Function|TypedFunction} callback - The function to execute on each element.
 * @param {boolean} [isHomogeneous=false] - Whether the array is homogeneous.
 * @param {boolean} [callbackIsIndexed=true] - Whether the callback uses the parameter index.
 * @param {Object} [thisArg] - The value of this provided for the call to the callback function.
 * @returns {Array} The new array with the results of the callback function.
 */
export function map (array, callback, isHomogeneous = false, callbackIsIndexed = true, thisArg) {
  if (callbackIsIndexed) {
    thisArg = thisArg || array
    if (isHomogeneous) {
      return array.map((value, index) => recurseIndexedHomogeneous(value, [index], 1))
    } else {
      return array.map((value, index) => recurseIndexedHeterogeneous(value, [index], 1))
    }
  } else {
    if (isHomogeneous) {
      return array.map(function rec (value) {
        if (Array.isArray(value[0])) {
          return value.map(rec)
        } else {
          return value.map(callback)
        }
      })
    } else {
      return array.map(function rec (value) {
        if (Array.isArray(value)) {
          return value.map(rec)
        } else {
          return callback(value)
        }
      })
    }
  }

  function recurseIndexedHeterogeneous (value, index, depth) {
    if (Array.isArray(value)) {
      return value.map(function (child, i) {
        index[depth] = i
        const results = recurseIndexedHeterogeneous(child, index, depth + 1)
        index[depth] = null
        return results
      })
    } else {
      return callback(value, index.slice(), thisArg)
    }
  }

  function recurseIndexedHomogeneous (value, index, depth) {
    if (Array.isArray(value[0])) {
      return value.map(function (child, i) {
        index[depth] = i
        const results = recurseIndexedHomogeneous(child, index, depth + 1)
        index[depth] = null
        return results
      })
    } else {
      return value.map((v, i) => {
        index[depth] = i
        return callback(v, index.slice(), thisArg)
      })
    }
  }
}

/**
   * Applies a callback function to each element of the array using .forEach.
   *
   * @param {Array} array - The array to be iterated over.
   * @param {Function|TypedFunction} callback - The function to execute on each element.
   * @param {boolean} [isHomogeneous=false] - Whether the array is homogeneous.
   * @param {boolean} [callbackIsIndexed=true] - Whether the callback uses the parameter index.
   * @param {Object} [thisArg] - The value of this provided for the call to the callback function.
   */
export function forEach (array, callback, isHomogeneous = false, callbackIsIndexed = true, thisArg) {
  if (callbackIsIndexed) {
    thisArg = thisArg || array
    if (isHomogeneous) {
      array.forEach((value, index) => recurseIndexedHomogeneous(value, [index], 1))
    } else {
      array.forEach((value, index) => recurseIndexedHeterogeneous(value, [index], 1))
    }
  } else {
    if (isHomogeneous) {
      array.forEach(function rec (value) {
        if (Array.isArray(value[0])) {
          value.forEach(rec)
        } else {
          value.forEach(callback)
        }
      })
    } else {
      array.forEach(function rec (value) {
        if (Array.isArray(value)) {
          value.forEach(rec)
        } else {
          callback(value)
        }
      })
    }
  }

  function recurseIndexedHeterogeneous (value, index, depth) {
    if (Array.isArray(value)) {
      value.forEach(function (child, i) {
        index[depth] = i
        recurseIndexedHeterogeneous(child, index, depth + 1)
        index[depth] = null
      })
    } else {
      callback(value, index.slice(), thisArg)
    }
  }

  function recurseIndexedHomogeneous (value, index, depth) {
    if (Array.isArray(value[0])) {
      value.forEach(function (child, i) {
        index[depth] = i
        recurseIndexedHomogeneous(child, index, depth + 1)
        index[depth] = null
      })
    } else {
      value.forEach((v, i) => {
        index[depth] = i
        callback(v, index.slice(), thisArg)
      })
    }
  }
}
