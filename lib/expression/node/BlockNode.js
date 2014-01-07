var Node = require('./Node');

/**
 * @constructor BlockNode
 * @extends {Node}
 * Holds a set with nodes
 */
function BlockNode() {
  this.params = [];
}

BlockNode.prototype = new Node();

/**
 * Add a parameter
 * @param {Node} node
 * @param {Boolean} [visible]   true by default
 */
BlockNode.prototype.add = function (node, visible) {
  var index = this.params.length;
  this.params[index] = {
    node: node,
    visible: (visible != undefined) ? visible : true
  };
};

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
BlockNode.prototype._compile = function (defs) {
  var params = this.params.map(function (param) {
    var js = param.node._compile(defs);
    if (param.visible) {
      return 'results.push(' + js + ');';
    }
    else {
      return js + ';';
    }
  });

  return '(function () {' +
      'var results = [];' +
      params.join('') +
      'return results;' +
      '})()';
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter settings
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
      nodes = nodes.concat(params[i].node.find(filter));
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
  return this.params.map(function (param) {
    return param.node.toString() + (param.visible ? '' : ';');
  }).join('\n');
};

module.exports = BlockNode;
