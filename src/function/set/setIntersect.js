import { flatten, generalize, identify } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'setIntersect'
const dependencies = ['typed', 'size', 'compareNatural']

export const createSetIntersect = /* #__PURE__ */ factory(name, dependencies, ({ typed, size, compareNatural }) => {
  /**
   * Create the intersection of two (multi)sets.
   * Multi-dimension arrays will be converted to single-dimension arrays before the operation.
   *
   * Syntax:
   *
   *    math.setIntersect(set1, set2)
   *
   * Examples:
   *
   *    math.setIntersect([1, 2, 3, 4], [3, 4, 5, 6])            // returns [3, 4]
   *    math.setIntersect([[1, 2], [3, 4]], [[3, 4], [5, 6]])    // returns [3, 4]
   *
   * See also:
   *
   *    setUnion, setDifference
   *
   * @param {Array | Matrix}    a1  A (multi)set
   * @param {Array | Matrix}    a2  A (multi)set
   * @return {Array | Matrix}    The intersection of two (multi)sets
   */
  return typed(name, {
    'Array | Matrix, Array | Matrix': function (a1, a2) {
      let result = []
      // if both are nonempty, we must compute the intersection
      if (size(a1)[0] !== 0 && size(a2)[0] !== 0) {
        const b1 = identify(flatten(a1.valueOf()).sort(compareNatural))
        const b2 = identify(flatten(a2.valueOf()).sort(compareNatural))
        for (let i = 0; i < b1.length; i++) {
          for (let j = 0; j < b2.length; j++) {
            if (compareNatural(b1[i].value, b2[j].value) === 0 && b1[i].identifier === b2[j].identifier) { // the identifier is always a decimal int
              result.push(b1[i])
              break
            }
          }
        }
      }
      result = generalize(result) // remove the identifiers
      // return an array, if both inputs were arrays
      if (Array.isArray(a1)) {
        if (Array.isArray(a2)) return result
        return a2.create(result)
      }
      return a1.create(result)
    }
  })
})
