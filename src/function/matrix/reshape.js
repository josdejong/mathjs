import { reshape as arrayReshape } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'reshape'
const dependencies = ['typed', 'isInteger', 'matrix']

export const createReshape = /* #__PURE__ */ factory(name, dependencies, ({ typed, isInteger, matrix }) => {
  /**
   * Reshape a multi dimensional array to fit the specified dimensions
   *
   * Syntax:
   *
   *     math.reshape(x, sizes)
   *
   * Examples:
   *
   *     math.reshape([1, 2, 3, 4, 5, 6], [2, 3])
   *     // returns Array  [[1, 2, 3], [4, 5, 6]]
   *
   *     math.reshape([[1, 2], [3, 4]], [1, 4])
   *     // returns Array  [[1, 2, 3, 4]]
   *
   *     math.reshape([[1, 2], [3, 4]], [4])
   *     // returns Array [1, 2, 3, 4]
   *
   *     const x = math.matrix([1, 2, 3, 4, 5, 6, 7, 8])
   *     math.reshape(x, [2, 2, 2])
   *     // returns Matrix [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
   *
   * See also:
   *
   *     size, squeeze, resize
   *
   * @param {Array | Matrix | *} x  Matrix to be reshaped
   * @param {number[]} sizes        One dimensional array with integral sizes for
   *                                each dimension
   *
   * @return {* | Array | Matrix}   A reshaped clone of matrix `x`
   *
   * @throws {TypeError}            If `sizes` does not contain solely integers
   * @throws {DimensionError}       If the product of the new dimension sizes does
   *                                not equal that of the old ones
   */
  return typed(name, {

    'Matrix, Array': function (x, sizes) {
      if (x.reshape) {
        return x.reshape(sizes)
      } else {
        return matrix(arrayReshape(x.valueOf(), sizes))
      }
    },

    'Array, Array': function (x, sizes) {
      sizes.forEach(function (size) {
        if (!isInteger(size)) {
          throw new TypeError('Invalid size for dimension: ' + size)
        }
      })
      return arrayReshape(x, sizes)
    }

  })
})
