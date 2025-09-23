import { errorTransform } from '../../transform/utils/errorTransform.js'
import { getSafeProperty } from '../../../utils/customs.js'
import { isDenseMatrix } from '../../../utils/is.js'

export function accessFactory ({ subset }) {
  /**
   * Retrieve part of an object:
   *
   * - Retrieve a property from an object
   * - Retrieve a part of a string
   * - Retrieve a matrix subset
   *
   * @param {Object | Array | Matrix | string} object
   * @param {Index} index
   * @return {Object | Array | Matrix | string} Returns the subset
   */
  return function access (object, index) {
    try {
      if (Array.isArray(object)) {
        return subset(object, index)
      } else if (object && typeof object.subset === 'function') { // Matrix
        return object.subset(index)
      } else if (typeof object === 'string') {
        // TODO: move getStringSubset into a separate util file, use that
        return subset(object, index)
      } else if (typeof object === 'object') {
        if (index.isObjectProperty()) {
          return getSafeProperty(object, index.getObjectProperty())
        }

        if (index._dimensions.length > 1) {
          throw new SyntaxError('Cannot apply multi-element matrix as object property')
        }

        if (isDenseMatrix(index._dimensions[0])) {
          const compiledIndex = index._dimensions[0].get([0])

          // For some reason, the value in the generated Dense Matrix _data
          // is always 1 less than the expected calculated value
          return getSafeProperty(object, String(compiledIndex + 1))
        }

        throw new TypeError('Cannot apply unsupported value as object property')
      } else {
        throw new TypeError('Cannot apply index: unsupported type of object')
      }
    } catch (err) {
      throw errorTransform(err)
    }
  }
}
