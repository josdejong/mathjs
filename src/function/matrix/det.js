'use strict'

const util = require('../../utils/index')
const object = util.object
const string = util.string

function factory (type, config, load, typed) {
  const matrix = load(require('../../type/matrix/function/matrix'))
  const subtract = load(require('../arithmetic/subtract'))
  const multiply = load(require('../arithmetic/multiply'))
  const unaryMinus = load(require('../arithmetic/unaryMinus'))
  const lup = load(require('../algebra/decomposition/lup'))

  /**
   * Calculate the determinant of a matrix.
   *
   * Syntax:
   *
   *    math.det(x)
   *
   * Examples:
   *
   *    math.det([[1, 2], [3, 4]]) // returns -2
   *
   *    const A = [
   *      [-2, 2, 3],
   *      [-1, 1, 3],
   *      [2, 0, -1]
   *    ]
   *    math.det(A) // returns 6
   *
   * See also:
   *
   *    inv
   *
   * @param {Array | Matrix} x  A matrix
   * @return {number} The determinant of `x`
   */
  const det = typed('det', {
    'any': function (x) {
      return object.clone(x)
    },

    'Array | Matrix': function det (x) {
      let size
      if (type.isMatrix(x)) {
        size = x.size()
      } else if (Array.isArray(x)) {
        x = matrix(x)
        size = x.size()
      } else {
        // a scalar
        size = []
      }

      switch (size.length) {
        case 0:
          // scalar
          return object.clone(x)

        case 1:
          // vector
          if (size[0] === 1) {
            return object.clone(x.valueOf()[0])
          } else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + string.format(size) + ')')
          }

        case 2:
          // two dimensional array
          const rows = size[0]
          const cols = size[1]
          if (rows === cols) {
            return _det(x.clone().valueOf(), rows, cols)
          } else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + string.format(size) + ')')
          }

        default:
          // multi dimensional array
          throw new RangeError('Matrix must be two dimensional ' +
          '(size: ' + string.format(size) + ')')
      }
    }
  })

  det.toTex = { 1: `\\det\\left(\${args[0]}\\right)` }

  return det

  /**
   * Calculate the determinant of a matrix
   * @param {Array[]} matrix  A square, two dimensional matrix
   * @param {number} rows     Number of rows of the matrix (zero-based)
   * @param {number} cols     Number of columns of the matrix (zero-based)
   * @returns {number} det
   * @private
   */
  function _det (matrix, rows, cols) {
    if (rows === 1) {
      // this is a 1 x 1 matrix
      return object.clone(matrix[0][0])
    } else if (rows === 2) {
      // this is a 2 x 2 matrix
      // the determinant of [a11,a12;a21,a22] is det = a11*a22-a21*a12
      return subtract(
        multiply(matrix[0][0], matrix[1][1]),
        multiply(matrix[1][0], matrix[0][1])
      )
    } else {
      // Compute the LU decomposition
      const decomp = lup(matrix)

      // The determinant is the product of the diagonal entries of U (and those of L, but they are all 1)
      let det = decomp.U[0][0]
      for (let i = 1; i < rows; i++) {
        det = multiply(det, decomp.U[i][i])
      }

      // The determinant will be multiplied by 1 or -1 depending on the parity of the permutation matrix.
      // This can be determined by counting the cycles. This is roughly a linear time algorithm.
      let evenCycles = 0
      let i = 0
      const visited = []
      while (true) {
        while (visited[i]) {
          i++
        }
        if (i >= rows) break
        let j = i
        let cycleLen = 0
        while (!visited[decomp.p[j]]) {
          visited[decomp.p[j]] = true
          j = decomp.p[j]
          cycleLen++
        }
        if (cycleLen % 2 === 0) {
          evenCycles++
        }
      }

      return evenCycles % 2 === 0 ? det : unaryMinus(det)
    }
  }
}

exports.name = 'det'
exports.factory = factory
