'use strict'

const flatten = require('../../utils/array').flatten

function factory (type, config, load, typed) {
  const MatrixIndex = load(require('../../type/matrix/MatrixIndex'))
  const DenseMatrix = load(require('../../type/matrix/DenseMatrix'))
  const size = load(require('../matrix/size'))
  const subset = load(require('../matrix/subset'))
  const compareNatural = load(require('../relational/compareNatural'))

  /**
   * Create the cartesian product of two (multi)sets.
   * Multi-dimension arrays will be converted to single-dimension arrays before the operation.
   *
   * Syntax:
   *
   *    math.setCartesian(set1, set2)
   *
   * Examples:
   *
   *    math.setCartesian([1, 2], [3, 4])        // returns [[1, 3], [1, 4], [2, 3], [2, 4]]
   *
   * See also:
   *
   *    setUnion, setIntersect, setDifference, setPowerset
   *
   * @param {Array | Matrix}    a1  A (multi)set
   * @param {Array | Matrix}    a2  A (multi)set
   * @return {Array | Matrix}    The cartesian product of two (multi)sets
   */
  const setCartesian = typed('setCartesian', {
    'Array | Matrix, Array | Matrix': function (a1, a2) {
      let result = []

      if (subset(size(a1), new MatrixIndex(0)) !== 0 && subset(size(a2), new MatrixIndex(0)) !== 0) { // if any of them is empty, return empty
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

  return setCartesian
}

exports.name = 'setCartesian'
exports.factory = factory
