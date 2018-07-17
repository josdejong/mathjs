'use strict'

const flatten = require('../../utils/array').flatten

function factory (type, config, load, typed) {
  const compareNatural = load(require('../relational/compareNatural'))
  const MatrixIndex = load(require('../../type/matrix/MatrixIndex'))
  const size = load(require('../matrix/size'))
  const subset = load(require('../matrix/subset'))

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
  const setMultiplicity = typed('setMultiplicity', {
    'number | BigNumber | Fraction | Complex, Array | Matrix': function (e, a) {
      if (subset(size(a), new MatrixIndex(0)) === 0) { // if empty, return 0
        return 0
      }
      const b = flatten(Array.isArray(a) ? a : a.toArray())
      let count = 0
      for (let i = 0; i < b.length; i++) {
        if (compareNatural(b[i], e) === 0) {
          count++
        }
      }
      return count
    }
  })

  return setMultiplicity
}

exports.name = 'setMultiplicity'
exports.factory = factory
