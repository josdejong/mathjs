var Node = require('./Node'),
    object = require('../../util/object'),
    string = require('../../util/string'),
    collection = require('../../type/collection'),
    Matrix = require('../../type/Matrix');

/**
 * @constructor ArrayNode
 * Holds an 1-dimensional array with nodes
 * @param {Object} settings Object with the math.js configuration settings
 * @param {Array} nodes    1 dimensional array with nodes
 * @extends {Node}
 */
function ArrayNode(settings, nodes) {
  this.settings = settings; // math.js settings
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

  return (this.settings.matrix === 'array') ? results : new Matrix(results);
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter settings
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
 * Get string representation
 * @return {String} str
 * @override
 */
ArrayNode.prototype.toString = function() {
  return string.format(this.nodes);
};

module.exports = ArrayNode;
