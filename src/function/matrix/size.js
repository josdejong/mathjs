import { arraySize } from '../../utils/array'
import { factory } from '../../utils/factory'

const name = 'size'
const dependencies = ['typed']

export const createSize = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Calculate the size of a matrix or scalar.
   *
   * The function always returns an Array, also for Matrix input.
   *
   * Syntax:
   *
   *     math.size(x)
   *
   * Examples:
   *
   *     math.size(2.3)                  // returns []
   *     math.size('hello world')        // returns [11]
   *
   *     const A = [[1, 2, 3], [4, 5, 6]]
   *     math.size(A)                    // returns [2, 3]
   *     math.size(math.range(1,6))      // returns [5]
   *
   * See also:
   *
   *     resize, squeeze, subset
   *
   * @param {boolean | number | Complex | Unit | string | Array | Matrix} x  A matrix
   * @return {Array} A vector with size of `x`.
   */
  return typed(name, {
    Matrix: function (x) {
      return x.size()
    },

    Array: arraySize,

    string: function (x) {
      return [x.length]
    },

    'number | Complex | BigNumber | Unit | boolean | null': function (x) {
      // scalar
      return []
    }
  })
})
