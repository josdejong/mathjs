var Node = require('./Node.js');

/**
 * @constructor BlockNode
 * Holds a set with nodes
 * @extends {Node}
 */
function BlockNode() {
  this.params = [];
  this.visible = [];
}

BlockNode.prototype = new Node();

/**
 * Add a parameter
 * @param {Node} param
 * @param {Boolean} [visible]   true by default
 */
BlockNode.prototype.add = function (param, visible) {
  var index = this.params.length;
  this.params[index] = param;
  this.visible[index] = (visible != undefined) ? visible : true;
};

/**
 * Evaluate the set
 * @return {*[]} results
 * @override
 */
BlockNode.prototype.eval = function() {
  // evaluate the parameters
  var results = [];
  for (var i = 0, iMax = this.params.length; i < iMax; i++) {
    var result = this.params[i].eval();
    if (this.visible[i]) {
      results.push(result);
    }
  }

  return results;
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
BlockNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search in parameters
  var params = this.params;
  if (params) {
    for (var i = 0, len = params.length; i < len; i++) {
      nodes = nodes.concat(params[i].find(filter));
    }
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
BlockNode.prototype.toString = function() {
  var strings = [];

  for (var i = 0, iMax = this.params.length; i < iMax; i++) {
    if (this.visible[i]) {
      strings.push('\n  ' + this.params[i].toString());
    }
  }

  return '[' + strings.join(',') + '\n]';
};

module.exports = BlockNode;
