import { factory } from '../../utils/factory'
import { isMatrix } from '../../utils/is'

const name = 'diff'
const dependencies = ['typed', 'matrix']

export const createDiff = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix }) => {
  /**
   * Create a new matrix or array of the difference between elements of the given array
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
   * @param {Array | Matrix } x     An array or matrix
   * @return {Array | Matrix}       Difference between array elements
   * 
   * See Also:
   *
   *      Subtract 
   * 
   */
  return typed(name, {
    'Array | Matrix, function': function (x) {
      if (isMatrix(x)) {
        return matrix(_ArrayDiff(x.toArray(), diff))
      } else {
        return _ArrayDiff(x)
      }
    }
  })

  /**
   * 
   * @param {Array} arr         An array
   * @return {Array}            resulting array
   */
  function _ArrayDiff (arr) {
    const result = []
    const size = arr.length
    for (let i = 1; i < size; i++) {
      result.push(arr[i] - arr[i-1])
    }
    return result
  }
})