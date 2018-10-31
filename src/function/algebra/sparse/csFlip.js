'use strict'

export function factory () {
  /**
   * This function "flips" its input about the integer -1.
   *
   * @param {Number}  i               The value to flip
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  const csFlip = function (i) {
    // flip the value
    return -i - 2
  }

  return csFlip
}

export const name = 'csFlip'
export var path = 'algebra.sparse'
