import { flatten, generalize, identify } from '../../utils/array'
import { factory } from '../../utils/factory'

const name = 'setDifference'
const dependencies = ['typed', 'size', 'subset', 'compareNatural', 'Index', 'DenseMatrix']

export const createSetDifference = /* #__PURE__ */ factory(name, dependencies, ({ typed, size, subset, compareNatural, Index, DenseMatrix }) => {
  /**
   * Create the difference of two (multi)sets: every element of set1, that is not the element of set2.
   * Multi-dimension arrays will be converted to single-dimension arrays before the operation.
   *
   * Syntax:
   *
   *    math.setDifference(set1, set2)
   *
   * Examples:
   *
   *    math.setDifference([1, 2, 3, 4], [3, 4, 5, 6])            // returns [1, 2]
   *    math.setDifference([[1, 2], [3, 4]], [[3, 4], [5, 6]])    // returns [1, 2]
   *
   * See also:
   *
   *    setUnion, setIntersect, setSymDifference
   *
   * @param {Array | Matrix}    a1  A (multi)set
   * @param {Array | Matrix}    a2  A (multi)set
   * @return {Array | Matrix}    The difference of two (multi)sets
   */
  return typed(name, {
    'Array | Matrix, Array | Matrix': function (a1, a2) {
      let result
      if (subset(size(a1), new Index(0)) === 0) { // empty-anything=empty
        result = []
      } else if (subset(size(a2), new Index(0)) === 0) { // anything-empty=anything
        return flatten(a1.toArray())
      } else {
        const b1 = identify(flatten(Array.isArray(a1) ? a1 : a1.toArray()).sort(compareNatural))
        const b2 = identify(flatten(Array.isArray(a2) ? a2 : a2.toArray()).sort(compareNatural))
        result = []
        let inb2
        for (let i = 0; i < b1.length; i++) {
          inb2 = false
          for (let j = 0; j < b2.length; j++) {
            if (compareNatural(b1[i].value, b2[j].value) === 0 && b1[i].identifier === b2[j].identifier) { // the identifier is always a decimal int
              inb2 = true
              break
            }
          }
          if (!inb2) {
            result.push(b1[i])
          }
        }
      }
      // return an array, if both inputs were arrays
      if (Array.isArray(a1) && Array.isArray(a2)) {
        return generalize(result)
      }
      // return a matrix otherwise
      return new DenseMatrix(generalize(result))
    }
  })
})
