import { flatten, identify } from '../../utils/array'
import { factory } from '../../utils/factory'

const name = 'setIsSubset'
const dependencies = ['typed', 'size', 'subset', 'compareNatural', 'Index']

export const createSetIsSubset = /* #__PURE__ */ factory(name, dependencies, ({ typed, size, subset, compareNatural, Index }) => {
  /**
   * Check whether a (multi)set is a subset of another (multi)set. (Every element of set1 is the element of set2.)
   * Multi-dimension arrays will be converted to single-dimension arrays before the operation.
   *
   * Syntax:
   *
   *    math.setIsSubset(set1, set2)
   *
   * Examples:
   *
   *    math.setIsSubset([1, 2], [3, 4, 5, 6])        // returns false
   *    math.setIsSubset([3, 4], [3, 4, 5, 6])        // returns true
   *
   * See also:
   *
   *    setUnion, setIntersect, setDifference
   *
   * @param {Array | Matrix}    a1  A (multi)set
   * @param {Array | Matrix}    a2  A (multi)set
   * @return {boolean}            true | false
   */
  return typed(name, {
    'Array | Matrix, Array | Matrix': function (a1, a2) {
      if (subset(size(a1), new Index(0)) === 0) { // empty is a subset of anything
        return true
      } else if (subset(size(a2), new Index(0)) === 0) { // anything is not a subset of empty
        return false
      }
      const b1 = identify(flatten(Array.isArray(a1) ? a1 : a1.toArray()).sort(compareNatural))
      const b2 = identify(flatten(Array.isArray(a2) ? a2 : a2.toArray()).sort(compareNatural))
      let inb2
      for (let i = 0; i < b1.length; i++) {
        inb2 = false
        for (let j = 0; j < b2.length; j++) {
          if (compareNatural(b1[i].value, b2[j].value) === 0 && b1[i].identifier === b2[j].identifier) { // the identifier is always a decimal int
            inb2 = true
            break
          }
        }
        if (inb2 === false) {
          return false
        }
      }
      return true
    }
  })
})
