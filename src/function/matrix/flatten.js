import { flatten as flattenArray } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'flatten'
const dependencies = ['typed']

export const createFlatten = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
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
   * @param {DenseMatrix | Array} x   Matrix to be flattened
   * @return {DenseMatrix | Array} Returns the flattened matrix
   */
  return typed(name, {
    Array: function (x) {
      return flattenArray(x)
    },

    DenseMatrix: function (x) {
      // Return the same matrix type as x (Dense or Sparse Matrix)
      // Return the same data type as x
      return x.create(flattenArray(x.valueOf(), true), x.datatype())
    },

    SparseMatrix: function (_x) {
      throw new TypeError('SparseMatrix is not supported by function flatten ' +
        'because it does not support 1D vectors. ' +
        'Convert to a DenseMatrix or Array first. Example: flatten(x.toArray())')
    }
  })
})
