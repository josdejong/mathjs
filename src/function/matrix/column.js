'use strict'

const clone = require('../../utils/object').clone
const validateIndex = require('../../utils/array').validateIndex

function factory (type, config, load, typed) {
  const MatrixIndex = load(require('../../type/matrix/MatrixIndex'))
  const matrix = load(require('../../type/matrix/function/matrix'))
  const range = load(require('./range'))

  /**
   * Return a column from a Matrix.
   *
   * Syntax:
   *
   *     math.column(value, index)
   *
   * Example:
   *
   *     // get a column
   *     const d = [[1, 2], [3, 4]]
   *     math.column(d, 1) // returns [2, 4]
   *
   * See also:
   *
   *     row
   *
   * @param {Array | Matrix } value   An array or matrix
   * @param {number} column           The index of the column
   * @return {Array | Matrix}         The retrieved column
   */
  const column = typed('column', {
    'Matrix, number': _column,

    'Array, number': function (value, column) {
      return _column(matrix(clone(value)), column).valueOf()
    }
  })

  column.toTex = undefined // use default template

  return column

  /**
   * Retrieve a column of a matrix
   * @param {Matrix } value  A matrix
   * @param {number} column  The index of the column
   * @return {Matrix}        The retrieved column
   */
  function _column (value, column) {
    // check dimensions
    if (value.size().length !== 2) {
      throw new Error('Only two dimensional matrix is supported')
    }

    validateIndex(column, value.size()[1])

    const rowRange = range(0, value.size()[0])
    const index = new MatrixIndex(rowRange, column)
    return value.subset(index)
  }
}

exports.name = 'column'
exports.factory = factory
