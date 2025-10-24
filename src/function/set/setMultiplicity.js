import { flatten } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'setMultiplicity'
const dependencies = ['typed', 'size', 'subset', 'compareNatural']

export const createSetMultiplicity = /* #__PURE__ */ factory(name, dependencies, ({ typed, size, subset, compareNatural }) => {
  /**
   * Count the multiplicity of an element in a multiset.
   * A multi-dimension array will be converted to a single-dimension array before the operation.
   *
   * Syntax:
   *
   *    math.setMultiplicity(element, set)
   *
   * Examples:
   *
   *    math.setMultiplicity(1, [1, 2, 2, 4])    // returns 1
   *    math.setMultiplicity(2, [1, 2, 2, 4])    // returns 2
   *
   * See also:
   *
   *    setDistinct, setSize
   *
   * @param {number | BigNumber | Fraction | Complex} e  An element in the multiset
   * @param {Array | Matrix}     a  A multiset
   * @return {number}            The number of how many times the multiset contains the element
   */
  return typed(name, {
    'number | BigNumber | Fraction | Complex, Array | Matrix': function (e, a) {
      if (size(a)[0] === 0) { // if empty, return 0
        return 0
      }
      const b = flatten(a.valueOf())
      let count = 0
      for (let i = 0; i < b.length; i++) {
        if (compareNatural(b[i], e) === 0) {
          count++
        }
      }
      return count
    }
  })
})
