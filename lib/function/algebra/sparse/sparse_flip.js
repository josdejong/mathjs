'use strict';

function factory () {

  /**
   * Flips the value
   *
   * @param {Number}  i               The value to flip
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  var sparse_flip = function (i) {
    // flip the value
    return -i - 2;
  };

  return sparse_flip;
}

exports.name = 'sparse_flip';
exports.path = 'sparse';
exports.factory = factory;
