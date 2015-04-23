'use strict';

function factory (type, config, load) {

  var sparse_flip = load(require('./sparse_flip'));
  
  /**
   * Flips the value if it is negative of returns the same value otherwise.
   *
   * @param {Number}  i               The value to flip
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  var sparse_unflip = function (i) {
    // flip the value if it is negative
    return i < 0 ? sparse_flip(i) : i;
  };

  return sparse_unflip;
}

exports.name = 'sparse_unflip';
exports.path = 'sparse';
exports.factory = factory;
