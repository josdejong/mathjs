'use strict';

function factory (type, config, load) {

  var sparse_flip = load(require('./sparse_flip'));

  /**
   * Marks the node at w[j]
   *
   * @param {Array}   w               The array
   * @param {Number}  j               The array index
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  var sparse_mark = function (w, j) {
    // mark w[j]
    w[j] = sparse_flip(w [j]);
  };

  return sparse_mark;
}

exports.name = 'sparse_mark';
exports.path = 'sparse';
exports.factory = factory;
