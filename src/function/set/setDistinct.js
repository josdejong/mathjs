import { flatten } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'setDistinct'
const dependencies = ['typed', 'size', 'compareNatural', 'Index', 'DenseMatrix']

export const createSetDistinct = /* #__PURE__ */ factory(name, dependencies, ({ typed, size, compareNatural }) => {
  /**
   * Collect the distinct elements of a multiset.
   * A multi-dimension array will be converted to a single-dimension array before the operation.
   * The items of the returned array will be in order of first occurrence.
   *
   * Syntax:
   *
   *    math.setDistinct(set)
   *
   * Examples:
   *
   *    math.setDistinct([1, 1, 1, 2, 2, 3])        // returns [1, 2, 3]
   *
   * See also:
   *
   *    setMultiplicity
   *
   * @param {Array | Matrix}    a  A multiset
   * @return {Array | Matrix}    A set containing the distinct elements of the multiset
   */
  return typed(name, {
    'Array | Matrix': function (a) {
      const result = []
      // if empty, return empty
      if (size(a)[0] !== 0) {
        const b = flatten(a.valueOf())
        result.push(b[0])
        for (let i = 1; i < b.length; i++) {
          if (!result.some(item => compareNatural(b[i], item) === 0)) {
            result.push(b[i])
          }
        }
      }
      // return an array, if the input was an array
      if (Array.isArray(a)) {
        return result
      }
      // return a matrix otherwise
      return a.create(result)
    }
  })
})
