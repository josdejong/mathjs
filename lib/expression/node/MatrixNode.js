var Node = require('./Node.js'),
    object = require('../../util/object.js'),
    string = require('../../util/string.js'),
    collection = require('../../type/collection.js'),
    Matrix = require('../../type/Matrix.js');

/**
 * @constructor MatrixNode
 * Holds an 2-dimensional array with nodes
 * @param {Array[]} nodes    2 dimensional array with nodes
 * @extends {Node}
 */
function MatrixNode(nodes) {
  this.nodes = nodes || [];
}

MatrixNode.prototype = new Node();

/**
 * Evaluate the array
 * @return {Matrix} results
 * @override
 */
MatrixNode.prototype.eval = function() {
  // evaluate all nodes in the 2d array, and merge the results into a matrix
  var nodes = this.nodes,
      results = [],
      mergeNeeded = false;

  for (var r = 0, rows = nodes.length; r < rows; r++) {
    var nodes_r = nodes[r];
    var results_r = [];
    for (var c = 0, cols = nodes_r.length; c < cols; c++) {
      var results_rc = nodes_r[c].eval();
      if (collection.isCollection(results_rc)) {
        mergeNeeded = true;
      }
      results_r[c] = results_rc;
    }
    results[r] = results_r;
  }

  if (mergeNeeded) {
    results = merge(results);
  }

  return new Matrix(results);
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
MatrixNode.prototype.find = function (filter) {
  var results = [];

  // check itself
  if (this.match(filter)) {
    results.push(this);
  }

  // search in all nodes
  var nodes = this.nodes;
  for (var r = 0, rows = nodes.length; r < rows; r++) {
    var nodes_r = nodes[r];
    for (var c = 0, cols = nodes_r.length; c < cols; c++) {
      results = results.concat(nodes_r[c].find(filter));
    }
  }

  return results;
};

/**
 * Merge nested Matrices in a two dimensional Array.
 * @param {Array} array    Two-dimensional array containing Matrices
 * @return {Array} merged  The merged array (two-dimensional)
 */
function merge (array) {
  var merged = [];
  var rows = array.length;
  for (var r = 0; r < rows; r++) {
    var array_r = array[r];
    var cols = array_r.length;
    var submatrix = null;
    var submatrixRows = null;
    for (var c = 0; c < cols; c++) {
      var entry = object.clone(array_r[c]);
      var size;
      if (entry instanceof Matrix) {
        // get the data from the matrix
        size = entry.size();
        entry = entry.valueOf();
        if (size.length == 1) {
          entry = [entry];
          size = [1, size[0]];
        }
        else if (size.length > 2) {
          throw new Error('Cannot merge a multi dimensional matrix');
        }
      }
      else if (Array.isArray(entry)) {
        // change array into a 1xn matrix
        size = [1, entry.length];
        entry = [entry];
      }
      else {
        // change scalar into a 1x1 matrix
        size = [1, 1];
        entry = [[entry]];
      }

      // check the height of this row
      if (submatrix == null) {
        // first entry
        submatrix = entry;
        submatrixRows = size[0];
      }
      else if (size[0] == submatrixRows) {
        // merge
        for (var s = 0; s < submatrixRows; s++) {
          submatrix[s] = submatrix[s].concat(entry[s]);
        }
      }
      else {
        // no good...
        throw new Error('Dimension mismatch ' +
            '(' + size[0] + ' != ' + submatrixRows + ')');
      }
    }

    // merge the submatrix
    merged = merged.concat(submatrix);
  }

  return merged;
}

/**
 * Get string representation
 * @return {String} str
 * @override
 */
MatrixNode.prototype.toString = function() {
  return string.format(this.nodes);
};

module.exports = MatrixNode;
