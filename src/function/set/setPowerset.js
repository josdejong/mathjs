import { flatten } from '../../utils/array'
import { factory } from '../../utils/factory'

const name = 'setPowerset'
const dependencies = ['typed', 'size', 'subset', 'compareNatural', 'Index']

export const createSetPowerset = /* #__PURE__ */ factory(name, dependencies, ({ typed, size, subset, compareNatural, Index }) => {
  /**
   * Create the powerset of a (multi)set. (The powerset contains very possible subsets of a (multi)set.)
   * A multi-dimension array will be converted to a single-dimension array before the operation.
   *
   * Syntax:
   *
   *    math.setPowerset(set)
   *
   * Examples:
   *
   *    math.setPowerset([1, 2, 3])        // returns [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]
   *
   * See also:
   *
   *    setCartesian
   *
   * @param {Array | Matrix}    a  A (multi)set
   * @return {Array}    The powerset of the (multi)set
   */
  return typed(name, {
    'Array | Matrix': function (a) {
      if (subset(size(a), new Index(0)) === 0) { // if empty, return empty
        return []
      }
      const b = flatten(Array.isArray(a) ? a : a.toArray()).sort(compareNatural)
      const result = []
      let number = 0
      while (number.toString(2).length <= b.length) {
        result.push(_subset(b, number.toString(2).split('').reverse()))
        number++
      }
      // can not return a matrix, because of the different size of the subarrays
      return _sort(result)
    }
  })

  // create subset
  function _subset (array, bitarray) {
    const result = []
    for (let i = 0; i < bitarray.length; i++) {
      if (bitarray[i] === '1') {
        result.push(array[i])
      }
    }
    return result
  }

  // sort subsests by length
  function _sort (array) {
    let temp = []
    for (let i = array.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j].length > array[j + 1].length) {
          temp = array[j]
          array[j] = array[j + 1]
          array[j + 1] = temp
        }
      }
    }
    return array
  }
})
