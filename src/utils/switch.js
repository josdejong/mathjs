/**
 * Transpose a matrix
 * @param {Array} mat
 * @returns {Array} ret
 * @private
 */
export function _switch (mat) {
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
