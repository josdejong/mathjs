import { arraySize } from '../../utils/array'
import { factory } from '../../utils/factory'
import { noMatrix } from '../../utils/noop'

const name = 'size'
const dependencies = ['typed', 'config', '?matrix']

export const createSize = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, matrix }) => {
  /**
   * Calculate the size of a matrix or scalar.
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
   * @return {Array | Matrix} A vector with size of `x`.
   */
  return typed(name, {
    'Matrix': function (x) {
      return x.create(x.size())
    },

    'Array': arraySize,

    'string': function (x) {
      return (config.matrix === 'Array') ? [x.length] : matrix([x.length])
    },

    'number | Complex | BigNumber | Unit | boolean | null': function (x) {
      // scalar
      return (config.matrix === 'Array')
        ? []
        : matrix ? matrix([]) : noMatrix()
    }
  })
})
