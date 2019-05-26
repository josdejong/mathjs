import { clone } from '../../utils/object'
import { flatten as flattenArray } from '../../utils/array'
import { factory } from '../../utils/factory'

const name = 'flatten'
const dependencies = ['typed', 'matrix']

export const createFlatten = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix }) => {
  /**
   * Flatten a multi dimensional matrix into a single dimensional matrix.
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
    'Array': function (x) {
      return flattenArray(clone(x))
    },

    'Matrix': function (x) {
      const flat = flattenArray(clone(x.toArray()))
      // TODO: return the same matrix type as x
      return matrix(flat)
    }
  })
})
