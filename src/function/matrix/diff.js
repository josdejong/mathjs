import { factory } from '../../utils/factory'
import { isInteger } from '../../utils/number'
import { isMatrix } from '../../utils/is'

const name = 'diff'
const dependencies = ['typed', 'matrix', 'subtract', 'number']

export const createDiff = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, subtract, number }) => {
  /**
   * Create a new matrix or array of the difference between elements of the given array
   * The optional dim parameter lets you specify the dimension to evaluate the difference of
   * If no dimension parameter is passed it is assumed as dimension 0
   *
   * Dimension is zero-based in javascript and one-based in the parser and can be a number or bignumber
   * Arrays must be 'rectangular' meaning arrays like [1, 2]
   * If something is passed as a matrix it will be returned as a matrix but other than that all matrices are converted to arrays
   *
   * Syntax:
   *
   *     math.diff(arr)
   *     math.diff(arr, dim)
   *
   * Examples:
   *
   *     const arr = [1, 2, 4, 7, 0]
   *     math.diff(arr) // returns [1, 2, 3, -7] (no dimension passed so 0 is assumed)
   *     math.diff(math.matrix(arr)) // returns math.matrix([1, 2, 3, -7])
   *
   *     const arr = [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [9, 8, 7, 6, 4]]
   *     math.diff(arr) // returns [[0, 0, 0, 0, 0], [8, 6, 4, 2, -1]]
   *     math.diff(arr, 0) // returns [[0, 0, 0, 0, 0], [8, 6, 4, 2, -1]]
   *     math.diff(arr, 1) // returns [[1, 1, 1, 1], [1, 1, 1, 1], [-1, -1, -1, -2]]
   *     math.diff(arr, math.bignumber(1)) // returns [[1, 1, 1, 1], [1, 1, 1, 1], [-1, -1, -1, -2]]
   *
   *     math.diff(arr, 2) // throws RangeError as arr is 2 dimensional not 3
   *     math.diff(arr, -1) // throws RangeError as negative dimensions are not allowed
   *
   *     // These will all produce the same result
   *     math.diff([[1, 2], [3, 4]])
   *     math.diff([math.matrix([1, 2]), math.matrix([3, 4])])
   *     math.diff([[1, 2], math.matrix([3, 4])])
   *     math.diff([math.matrix([1, 2]), [3, 4]])
   *     // They do not produce the same result as  math.diff(math.matrix([[1, 2], [3, 4]])) as this returns a matrix
   *
   * See Also:
   *
   *      sum
   *      subtract
   *      partitionSelect
   *
   * @param {Array | Matrix} arr    An array or matrix
   * @param {number} dim            Dimension
   * @return {Array | Matrix}       Difference between array elements in given dimension
   */
  return typed(name, {
    'Array | Matrix': function (arr) { // No dimension specified => assume dimension 0
      if (isMatrix(arr)) {
        return matrix(_diff(arr.toArray()))
      } else {
        return _diff(arr)
      }
    },
    'Array | Matrix, number': function (arr, dim) {
      if (!isInteger(dim)) throw new RangeError('Dimension must be a whole number')
      if (isMatrix(arr)) {
        return matrix(_recursive(arr.toArray(), dim))
      } else {
        return _recursive(arr, dim)
      }
    },
    'Array | Matrix, BigNumber': function (arr, dim) {
      return this(arr, number(dim))
    }
  })

  /**
   * Recursively find the correct dimension in the array/matrix
   * Then Apply _diff to that dimension
   *
   * @param {Array} arr      The array
   * @param {number} dim     Dimension
   * @return {Array}         resulting array
   */
  function _recursive (arr, dim) {
    if (isMatrix(arr)) {
      arr = arr.toArray() // Makes sure arrays like [ matrix([0, 1]), matrix([1, 0]) ] are processed properly
    }
    if (!Array.isArray(arr)) {
      throw RangeError('Array/Matrix does not have that many dimensions')
    }
    if (dim > 0) {
      const result = []
      arr.forEach(element => {
        result.push(_recursive(element, dim - 1))
      })
      return result
    } else if (dim === 0) {
      return _diff(arr)
    } else {
      throw RangeError('Cannot have negative dimension')
    }
  }

  /**
   * Difference between elements in the array
   *
   * @param {Array} arr      An array
   * @return {Array}         resulting array
   */
  function _diff (arr) {
    const result = []
    const size = arr.length
    if (size < 2) {
      return arr
    }
    for (let i = 1; i < size; i++) {
      result.push(_ElementDiff(arr[i - 1], arr[i]))
    }
    return result
  }

  /**
   * Difference between 2 objects
   *
   * @param {Object} obj1    First object
   * @param {Object} obj2    Second object
   * @return {Array}         resulting array
   */
  function _ElementDiff (obj1, obj2) {
    // Convert matrices to arrays
    if (isMatrix(obj1)) obj1 = obj1.toArray()
    if (isMatrix(obj2)) obj2 = obj2.toArray()

    const obj1IsArray = Array.isArray(obj1)
    const obj2IsArray = Array.isArray(obj2)
    if (obj1IsArray && obj2IsArray) {
      return _ArrayDiff(obj1, obj2)
    }
    if (!obj1IsArray && !obj2IsArray) {
      return subtract(obj2, obj1) // Difference is (second - first) NOT (first - second)
    }
    throw TypeError('Cannot calculate difference between 1 array and 1 non-array')
  }

  /**
   * Difference of elements in 2 arrays
   *
   * @param {Array} arr1     Array 1
   * @param {Array} arr2     Array 2
   * @return {Array}         resulting array
   */
  function _ArrayDiff (arr1, arr2) {
    if (arr1.length !== arr2.length) {
      throw RangeError('Not all sub-arrays have the same length')
    }
    const result = []
    const size = arr1.length
    for (let i = 0; i < size; i++) {
      result.push(_ElementDiff(arr1[i], arr2[i]))
    }
    return result
  }
})
