'use strict'

const arraySize = require('../array').size
const isMatrix = require('../collection/isMatrix')
const IndexError = require('../../error/IndexError')

/**
 * Apply function that takes an array and returns a Scalar
 * along a given axis of a matrix or array.
 * Returns a new matrix or array with one less dimension.
 * @param {Array | Matrix} mat
 * @param {number} dim
 * @param {Function} callback
 * @return {Array | Matrix} res
 */
module.exports = function (mat, dim, callback) {
  const size = Array.isArray(mat) ? arraySize(mat) : mat.size()
  if (dim < 0 || (dim >= size.length)) {
    // TODO: would be more clear when throwing a DimensionError here
    throw new IndexError(dim, size.length)
  }

  if (isMatrix(mat)) {
    return mat.create(_apply(mat.valueOf(), dim, callback))
  } else {
    return _apply(mat, dim, callback)
  }
}

/**
 * Recursively reduce a matrix
 * @param {Array} mat
 * @param {number} dim
 * @param {Function} callback
 * @returns {Array} ret
 * @private
 */
function _apply (mat, dim, callback) {
  let i, ret, tran

  if (dim <= 0) {
    if (!Array.isArray(mat[0])) {
      return callback(mat)
    } else {
      tran = _switch(mat)
      ret = []
      for (i = 0; i < tran.length; i++) {
        ret[i] = _apply(tran[i], dim - 1, callback)
      }
      return ret
    }
  } else {
    ret = []
    for (i = 0; i < mat.length; i++) {
      ret[i] = _apply(mat[i], dim - 1, callback)
    }
    return ret
  }
}

/**
 * Transpose a matrix
 * @param {Array} mat
 * @returns {Array} ret
 * @private
 */
function _switch (mat) {
  const I = mat.length
  const J = mat[0].length
  let i, j
  const ret = []
  for (j = 0; j < J; j++) {
    const tmp = []
    for (i = 0; i < I; i++) {
      tmp.push(mat[i][j])
    }
    ret.push(tmp)
  }
  return ret
}
