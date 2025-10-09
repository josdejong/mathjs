import { arraySize } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'size'
const dependencies = ['typed']

export const createSize = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Calculate the size of a matrix or scalar. Always returns an Array containing numbers.
   *
   * Note that in mathjs v14 and older, function size could return a Matrix depending on
   * the input type and configuration.
   *
   * Syntax:
   *
   *     math.size(x)
   *
   * Examples:
   *
   *     math.size(2.3)                       // returns []
   *     math.size('hello world')             // returns [11]
   *
   *     const A = [[1, 2, 3], [4, 5, 6]]
   *     math.size(A)                         // returns [2, 3]
   *     math.size(math.range(1,6).toArray()) // returns [5]
   *
   * See also:
   *
   *     count, resize, squeeze, subset
   *
   * @param {boolean | number | Complex | Unit | string | Array | Matrix} x  A matrix
   * @return {Array} A vector with size of `x`.
   */
  return typed(name, {
    Matrix: x => x.size(),

    Array: arraySize,

    string: x => [x.length],

    // scalar
    'number | Complex | BigNumber | Unit | boolean | null': _x => []
  })
})
