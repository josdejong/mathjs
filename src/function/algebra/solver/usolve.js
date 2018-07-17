'use strict'

function factory (type, config, load, typed) {
  const matrix = load(require('../../../type/matrix/function/matrix'))
  const divideScalar = load(require('../../arithmetic/divideScalar'))
  const multiplyScalar = load(require('../../arithmetic/multiplyScalar'))
  const subtract = load(require('../../arithmetic/subtract'))
  const equalScalar = load(require('../../relational/equalScalar'))

  const solveValidation = load(require('./utils/solveValidation'))

  const DenseMatrix = type.DenseMatrix

  /**
   * Solves the linear equation system by backward substitution. Matrix must be an upper triangular matrix.
   *
   * `U * x = b`
   *
   * Syntax:
   *
   *    math.usolve(U, b)
   *
   * Examples:
   *
   *    const a = [[-2, 3], [2, 1]]
   *    const b = [11, 9]
   *    const x = usolve(a, b)  // [[8], [9]]
   *
   * See also:
   *
   *    lup, slu, usolve, lusolve
   *
   * @param {Matrix, Array} U       A N x N matrix or array (U)
   * @param {Matrix, Array} b       A column vector with the b values
   *
   * @return {DenseMatrix | Array}  A column vector with the linear system solution (x)
   */
  const usolve = typed('usolve', {

    'SparseMatrix, Array | Matrix': function (m, b) {
      // process matrix
      return _sparseBackwardSubstitution(m, b)
    },

    'DenseMatrix, Array | Matrix': function (m, b) {
      // process matrix
      return _denseBackwardSubstitution(m, b)
    },

    'Array, Array | Matrix': function (a, b) {
      // create dense matrix from array
      const m = matrix(a)
      // use matrix implementation
      const r = _denseBackwardSubstitution(m, b)
      // result
      return r.valueOf()
    }
  })

  function _denseBackwardSubstitution (m, b) {
    // validate matrix and vector, return copy of column vector b
    b = solveValidation(m, b, true)
    // column vector data
    const bdata = b._data
    // rows & columns
    const rows = m._size[0]
    const columns = m._size[1]
    // result
    const x = []
    // arrays
    const data = m._data
    // backward solve m * x = b, loop columns (backwards)
    for (let j = columns - 1; j >= 0; j--) {
      // b[j]
      const bj = bdata[j][0] || 0
      // x[j]
      let xj
      // backward substitution (outer product) avoids inner looping when bj === 0
      if (!equalScalar(bj, 0)) {
        // value @ [j, j]
        const vjj = data[j][j]
        // check vjj
        if (equalScalar(vjj, 0)) {
          // system cannot be solved
          throw new Error('Linear system cannot be solved since matrix is singular')
        }
        // calculate xj
        xj = divideScalar(bj, vjj)
        // loop rows
        for (let i = j - 1; i >= 0; i--) {
          // update copy of b
          bdata[i] = [subtract(bdata[i][0] || 0, multiplyScalar(xj, data[i][j]))]
        }
      } else {
        // zero value @ j
        xj = 0
      }
      // update x
      x[j] = [xj]
    }
    // return column vector
    return new DenseMatrix({
      data: x,
      size: [rows, 1]
    })
  }

  function _sparseBackwardSubstitution (m, b) {
    // validate matrix and vector, return copy of column vector b
    b = solveValidation(m, b, true)
    // column vector data
    const bdata = b._data
    // rows & columns
    const rows = m._size[0]
    const columns = m._size[1]
    // matrix arrays
    const values = m._values
    const index = m._index
    const ptr = m._ptr
    // vars
    let i, k
    // result
    const x = []
    // backward solve m * x = b, loop columns (backwards)
    for (let j = columns - 1; j >= 0; j--) {
      // b[j]
      const bj = bdata[j][0] || 0
      // backward substitution (outer product) avoids inner looping when bj === 0
      if (!equalScalar(bj, 0)) {
        // value @ [j, j]
        let vjj = 0
        // upper triangular matrix values & index (column j)
        const jvalues = []
        const jindex = []
        // first & last indeces in column
        const f = ptr[j]
        let l = ptr[j + 1]
        // values in column, find value @ [j, j], loop backwards
        for (k = l - 1; k >= f; k--) {
          // row
          i = index[k]
          // check row
          if (i === j) {
            // update vjj
            vjj = values[k]
          } else if (i < j) {
            // store upper triangular
            jvalues.push(values[k])
            jindex.push(i)
          }
        }
        // at this point we must have a value @ [j, j]
        if (equalScalar(vjj, 0)) {
          // system cannot be solved, there is no value @ [j, j]
          throw new Error('Linear system cannot be solved since matrix is singular')
        }
        // calculate xj
        const xj = divideScalar(bj, vjj)
        // loop upper triangular
        for (k = 0, l = jindex.length; k < l; k++) {
          // row
          i = jindex[k]
          // update copy of b
          bdata[i] = [subtract(bdata[i][0], multiplyScalar(xj, jvalues[k]))]
        }
        // update x
        x[j] = [xj]
      } else {
        // update x
        x[j] = [0]
      }
    }
    // return vector
    return new DenseMatrix({
      data: x,
      size: [rows, 1]
    })
  }

  return usolve
}

exports.name = 'usolve'
exports.factory = factory
