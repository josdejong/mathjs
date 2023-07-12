import { errorTransform } from '../../transform/utils/errorTransform.js'
import { setSafeProperty } from '../../../utils/customs.js'

export function assignFactory ({ subset, matrix }) {
  /**
   * Replace part of an object:
   *
   * - Assign a property to an object
   * - Replace a part of a string
   * - Replace a matrix subset
   *
   * @param {Object | Array | Matrix | string} object
   * @param {Index} index
   * @param {*} value
   * @return {Object | Array | Matrix | string} Returns the original object
   *                                            except in case of a string
   */
  // TODO: change assign to return the value instead of the object
  return function assign (object, index, value) {
    try {
      if (Array.isArray(object)) {
        // FIXME: here we want to use the matrix.subset method on a plain Array, but we do not have this function
        //  available right now. We should extract this method into a plain function acting on Arrays.
        //  For now, we use an ugly workaround to be able to adjust a nested value inside a plain array
        //  without cloning the array contents.
        const temp = matrix(object)
        // make sure we do have the original array inside the temporary Matrix, we *want* to mutate it
        temp._data = object
        temp.subset(index, value)
        return object
      } else if (object && typeof object.subset === 'function') { // Matrix
        return object.subset(index, value)
      } else if (typeof object === 'string') {
        // TODO: move setStringSubset into a separate util file, use that
        return subset(object, index, value)
      } else if (typeof object === 'object') {
        if (!index.isObjectProperty()) {
          throw TypeError('Cannot apply a numeric index as object property')
        }
        setSafeProperty(object, index.getObjectProperty(), value)
        return object
      } else {
        throw new TypeError('Cannot apply index: unsupported type of object')
      }
    } catch (err) {
      throw errorTransform(err)
    }
  }
}
