'use strict'

const flatten = require('../../utils/array').flatten

function factory (type, config, load, typed) {
  const compareNatural = load(require('../relational/compareNatural'))

  /**
   * Count the number of elements of a (multi)set. When a second parameter is 'true', count only the unique values.
   * A multi-dimension array will be converted to a single-dimension array before the operation.
   *
   * Syntax:
   *
   *    math.setSize(set)
   *    math.setSize(set, unique)
   *
   * Examples:
   *
   *    math.setSize([1, 2, 2, 4])          // returns 4
   *    math.setSize([1, 2, 2, 4], true)    // returns 3
   *
   * See also:
   *
   *    setUnion, setIntersect, setDifference
   *
   * @param {Array | Matrix}    a  A multiset
   * @return {number}            The number of elements of the (multi)set
   */
  const setSize = typed('setSize', {
    'Array | Matrix': function (a) {
      return Array.isArray(a) ? flatten(a).length : flatten(a.toArray()).length
    },
    'Array | Matrix, boolean': function (a, unique) {
      if (unique === false || a.length === 0) {
        return Array.isArray(a) ? flatten(a).length : flatten(a.toArray()).length
      } else {
        const b = flatten(Array.isArray(a) ? a : a.toArray()).sort(compareNatural)
        let count = 1
        for (let i = 1; i < b.length; i++) {
          if (compareNatural(b[i], b[i - 1]) !== 0) {
            count++
          }
        }
        return count
      }
    }
  })

  return setSize
}

exports.name = 'setSize'
exports.factory = factory
