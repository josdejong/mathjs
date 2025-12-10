import { clone } from '../../utils/object.js'
import { squeeze as arraySqueeze } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'squeeze'
const dependencies = ['typed']

export const createSqueeze = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Squeeze a matrix, remove inner and outer singleton dimensions from a matrix.
   *
   * Syntax:
   *
   *     math.squeeze(x)
   *
   * Examples:
   *
   *     math.squeeze([3])           // returns 3
   *     math.squeeze([[3]])         // returns 3
   *
   *     // Squeezes size 3x1 to size 3:
   *     const A = math.zeros(3, 1)
   *     A                           // Matrix [[0], [0], [0]] ...
   *     math.squeeze(A)             // Matrix [0, 0, 0]
   *
   *     // Also squeezes size 1x3 to 3:
   *     const B = math.zeros(1, 3)
   *     B                           // Matrix [[0, 0, 0]] ...
   *     math.squeeze(B)             // Matrix [0, 0, 0]
   *
   *     // only inner and outer dimensions are removed:
   *     const C = math.zeros(2, 1, 3)
   *     C                           // Matrix [[[0, 0, 0]], [[0, 0, 0]]] ...
   *     math.squeeze(C)             // Matrix [[[0, 0, 0]], [[0, 0, 0]]]
   *
   * See also:
   *
   *     subset
   *
   * @param {Matrix | Array} x      Matrix to be squeezed
   * @return {Matrix | Array} Squeezed matrix
   */
  return typed(name, {
    Array: function (x) {
      return arraySqueeze(clone(x))
    },

    Matrix: function (x) {
      const res = arraySqueeze(x.toArray())
      // FIXME: return the same type of matrix as the input
      return Array.isArray(res) ? x.create(res, x.datatype()) : res
    },

    any: function (x) {
      // scalar
      return clone(x)
    }
  })
})
