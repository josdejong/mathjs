'use strict'

const object = require('../../utils/object')
const array = require('../../utils/array')

function factory (type, config, load, typed) {
  const matrix = load(require('../../type/matrix/function/matrix'))

  /**
   * Squeeze a matrix, remove inner and outer singleton dimensions from a matrix.
   *
   * Syntax:
   *
   *     math.squeeze(x)
   *
   * Examples:
   *
   *     math.squeeze([3])           // returns 3
   *     math.squeeze([[3]])         // returns 3
   *
   *     const A = math.zeros(3, 1)    // returns [[0], [0], [0]] (size 3x1)
   *     math.squeeze(A)             // returns [0, 0, 0] (size 3)
   *
   *     const B = math.zeros(1, 3)    // returns [[0, 0, 0]] (size 1x3)
   *     math.squeeze(B)             // returns [0, 0, 0] (size 3)
   *
   *     // only inner and outer dimensions are removed
   *     const C = math.zeros(2, 1, 3) // returns [[[0, 0, 0]], [[0, 0, 0]]] (size 2x1x3)
   *     math.squeeze(C)             // returns [[[0, 0, 0]], [[0, 0, 0]]] (size 2x1x3)
   *
   * See also:
   *
   *     subset
   *
   * @param {Matrix | Array} x      Matrix to be squeezed
   * @return {Matrix | Array} Squeezed matrix
   */
  const squeeze = typed('squeeze', {
    'Array': function (x) {
      return array.squeeze(object.clone(x))
    },

    'Matrix': function (x) {
      const res = array.squeeze(x.toArray())
      // FIXME: return the same type of matrix as the input
      return Array.isArray(res) ? matrix(res) : res
    },

    'any': function (x) {
      // scalar
      return object.clone(x)
    }
  })

  squeeze.toTex = undefined // use default template

  return squeeze
}

exports.name = 'squeeze'
exports.factory = factory
