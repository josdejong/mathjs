import { factory } from '../../utils/factory'
import { isMatrix } from '../../utils/is'

const name = 'diff'
const dependencies = ['typed', 'matrix', 'subtract']

export const createDiff = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, subtract }) => {
  /**
   * Create a new matrix or array of the difference between elements of the given array
   * If array or matrix has less than 2 elements then the original value will be returned
   *
   * Syntax:
   *
   *     math.diff(x)
   *
   * Examples:
   *
   *     const arr = [1, 2, 4, 7, 0]
   *     math.diff(arr) // returns [1, 2, 3, -7]
   *
   *     const arr = [1]
   *     math.diff(arr) // returns [1]
   *
   * @param {Array | Matrix } x     An array or matrix
   * @return {Array | Matrix}       Difference between array elements
   *
   * See Also:
   *
   *      Subtract
   */
  return typed(name, {
    'Array | Matrix': function (x) {
      if (isMatrix(x)) {
        return matrix(_ArrayDiff(x.toArray()))
      } else {
        return _ArrayDiff(x)
      }
    }
  })

  /**
   * Difference of elements in the array
   *
   * @param {Array} arr      An array
   * @return {Array}         resulting array
   */
  function _ArrayDiff (arr) {
    if (arr.length < 2) {
      return arr
    }

    const result = []
    const size = arr.length
    for (let i = 1; i < size; i++) {
      result.push(subtract(arr[i], arr[i - 1]))
    }
    return result
  }
})
