'use strict'

function factory (type, config, load) {
  const csFlip = load(require('./csFlip'))

  /**
   * Flips the value if it is negative of returns the same value otherwise.
   *
   * @param {Number}  i               The value to flip
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  const csUnflip = function (i) {
    // flip the value if it is negative
    return i < 0 ? csFlip(i) : i
  }

  return csUnflip
}

exports.name = 'csUnflip'
exports.path = 'algebra.sparse'
exports.factory = factory
