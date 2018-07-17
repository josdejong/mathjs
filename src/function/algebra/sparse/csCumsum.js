'use strict'

function factory () {
  /**
   * It sets the p[i] equal to the sum of c[0] through c[i-1].
   *
   * @param {Array}   ptr             The Sparse Matrix ptr array
   * @param {Array}   c               The Sparse Matrix ptr array
   * @param {Number}  n               The number of columns
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  const csCumsum = function (ptr, c, n) {
    // variables
    let i
    let nz = 0

    for (i = 0; i < n; i++) {
      // initialize ptr @ i
      ptr[i] = nz
      // increment number of nonzeros
      nz += c[i]
      // also copy p[0..n-1] back into c[0..n-1]
      c[i] = ptr[i]
    }
    // finalize ptr
    ptr[n] = nz
    // return sum (c [0..n-1])
    return nz
  }

  return csCumsum
}

exports.name = 'csCumsum'
exports.path = 'algebra.sparse'
exports.factory = factory
