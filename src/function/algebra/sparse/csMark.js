'use strict'

export function factory (type, config, load) {
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

export const name = 'csMark'
export var path = 'algebra.sparse'
