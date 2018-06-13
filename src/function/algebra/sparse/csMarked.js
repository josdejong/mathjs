'use strict'

function factory () {
  /**
   * Checks if the node at w[j] is marked
   *
   * @param {Array}   w               The array
   * @param {Number}  j               The array index
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  const csMarked = function (w, j) {
    // check node is marked
    return w[j] < 0
  }

  return csMarked
}

exports.name = 'csMarked'
exports.path = 'algebra.sparse'
exports.factory = factory
