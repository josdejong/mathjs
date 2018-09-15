'use strict'
function factory (type, config, load, typed) {
  const _typeof = load(require('../../../function/utils/typeof'))

  function getArrayDataType (array) {
    let _type // to hold type info
    let _length = 0 // to hold length value to ensure it has consistent sizes
    for (let i = 0; i < array.length; i++) {
      const item = array[i]
      const isArray = Array.isArray(item)

      // Saving the target matrix row size
      if (i === 0 && isArray) {
        _length = item.length
      }
      // If the current item is an array but the length does not equal the targetVectorSize
      if (isArray && item.length !== _length) {
        return undefined
      }

      const itemType = isArray
        ? getArrayDataType(item) // recurse into a nested array
        : _typeof(item)
      if (_type === undefined) {
        _type = itemType // first item
      } else if (_type !== itemType) {
        return 'mixed'
      } else {
        // we're good, everything has the same type so far
      }
    }

    return _type
  }
  return getArrayDataType
}

/**
 * Check the datatype of a given object
 * This is a low level implementation that should only be used by
 * parent Matrix classes such as SparseMatrix or DenseMatrix
 * This method does not validate Array Matrix shape
 * @param array
 * @return string
 */
exports.factory = factory
