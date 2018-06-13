'use strict'

const flatten = require('../../utils/array').flatten

function factory (type, config, load, typed) {
  const MatrixIndex = load(require('../../type/matrix/MatrixIndex'))
  const DenseMatrix = load(require('../../type/matrix/DenseMatrix'))
  const size = load(require('../matrix/size'))
  const subset = load(require('../matrix/subset'))
  const compareNatural = load(require('../relational/compareNatural'))

  /**
   * Collect the distinct elements of a multiset.
   * A multi-dimension array will be converted to a single-dimension array before the operation.
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
   * @return {Array | Matrix}    A set containing the distinc elements of the multiset
   */
  const setDistinct = typed('setDistinct', {
    'Array | Matrix': function (a) {
      let result
      if (subset(size(a), new MatrixIndex(0)) === 0) { // if empty, return empty
        result = []
      } else {
        const b = flatten(Array.isArray(a) ? a : a.toArray()).sort(compareNatural)
        result = []
        result.push(b[0])
        for (let i = 1; i < b.length; i++) {
          if (compareNatural(b[i], b[i - 1]) !== 0) {
            result.push(b[i])
          }
        }
      }
      // return an array, if the input was an array
      if (Array.isArray(a)) {
        return result
      }
      // return a matrix otherwise
      return new DenseMatrix(result)
    }
  })

  return setDistinct
}

exports.name = 'setDistinct'
exports.factory = factory
