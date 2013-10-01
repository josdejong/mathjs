var options = require('../../options.js'),
    Node = require('./Node.js'),
    object = require('../../util/object.js'),
    string = require('../../util/string.js'),
    collection = require('../../type/collection.js'),
    Matrix = require('../../type/Matrix.js');

/**
 * @constructor ArrayNode
 * Holds an 1-dimensional array with nodes
 * @param {Array} nodes    1 dimensional array with nodes
 * @extends {Node}
 */
function ArrayNode(nodes) {
  this.nodes = nodes || [];
}

ArrayNode.prototype = new Node();

/**
 * Evaluate the array
 * @return {Matrix | Array} results
 * @override
 */
ArrayNode.prototype.eval = function() {
  // evaluate all nodes in the array, and merge the results into a matrix
  var nodes = this.nodes,
      results = [];

  for (var i = 0, ii = nodes.length; i < ii; i++) {
    var node = nodes[i];
    var result = node.eval();
    results[i] = (result instanceof Matrix) ? result.valueOf() : result;
  }

  return (options.matrix.default === 'array') ? results : new Matrix(results);
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
ArrayNode.prototype.find = function (filter) {
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
// TODO: cleanup merge function
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
ArrayNode.prototype.toString = function() {
  return string.format(this.nodes);
};

module.exports = ArrayNode;
