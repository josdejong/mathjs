import { flatten } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'setCartesian'
const dependencies = ['typed', 'size', 'subset', 'compareNatural', 'Index', 'DenseMatrix']

export const createSetCartesian = /* #__PURE__ */ factory(name, dependencies, ({ typed, size, subset, compareNatural, Index, DenseMatrix }) => {
  /**
   * Create the cartesian product of two (multi)sets.
   * Multi-dimension arrays will be converted to single-dimension arrays
   * and the values will be sorted in ascending order before the operation.
   *
   * Syntax:
   *
   *    math.setCartesian(set1, set2)
   *
   * Examples:
   *
   *    math.setCartesian([1, 2], [3, 4])        // returns [[1, 3], [1, 4], [2, 3], [2, 4]]
   *    math.setCartesian([4, 3], [2, 1])        // returns [[3, 1], [3, 2], [4, 1], [4, 2]]
   *
   * See also:
   *
   *    setUnion, setIntersect, setDifference, setPowerset
   *
   * @param {Array | Matrix}    a1  A (multi)set
   * @param {Array | Matrix}    a2  A (multi)set
   * @return {Array | Matrix}    The cartesian product of two (multi)sets
   */
  return typed(name, {
    'Array | Matrix, Array | Matrix': function (a1, a2) {
      let result = []

      if (subset(size(a1), new Index(0)) !== 0 && subset(size(a2), new Index(0)) !== 0) { // if any of them is empty, return empty
        const b1 = flatten(Array.isArray(a1) ? a1 : a1.toArray()).sort(compareNatural)
        const b2 = flatten(Array.isArray(a2) ? a2 : a2.toArray()).sort(compareNatural)
        result = []
        for (let i = 0; i < b1.length; i++) {
          for (let j = 0; j < b2.length; j++) {
            result.push([b1[i], b2[j]])
          }
        }
      }
      // return an array, if both inputs were arrays
      if (Array.isArray(a1) && Array.isArray(a2)) {
        return result
      }
      // return a matrix otherwise
      return new DenseMatrix(result)
    }
  })
})
