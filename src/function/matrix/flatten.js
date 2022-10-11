import { flatten as flattenArray } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'flatten'
const dependencies = ['typed', 'matrix']

export const createFlatten = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix }) => {
  /**
   * Flatten a multidimensional matrix into a single dimensional matrix.
   * A new matrix is returned, the original matrix is left untouched.
   *
   * Syntax:
   *
   *    math.flatten(x)
   *
   * Examples:
   *
   *    math.flatten([[1,2], [3,4]])   // returns [1, 2, 3, 4]
   *
   * See also:
   *
   *    concat, resize, size, squeeze
   *
   * @param {Matrix | Array} x   Matrix to be flattened
   * @return {Matrix | Array} Returns the flattened matrix
   */
  return typed(name, {
    Array: function (x) {
      return flattenArray(x)
    },

    Matrix: function (x) {
      const flat = flattenArray(x.toArray())
      // TODO: return the same matrix type as x (Dense or Sparse Matrix)
      return matrix(flat)
    }
  })
})
