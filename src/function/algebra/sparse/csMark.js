'use strict'

function factory (type, config, load) {
  const csFlip = load(require('./csFlip'))

  /**
   * Marks the node at w[j]
   *
   * @param {Array}   w               The array
   * @param {Number}  j               The array index
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  const csMark = function (w, j) {
    // mark w[j]
    w[j] = csFlip(w[j])
  }

  return csMark
}

exports.name = 'csMark'
exports.path = 'algebra.sparse'
exports.factory = factory
