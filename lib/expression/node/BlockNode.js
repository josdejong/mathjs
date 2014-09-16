'use strict';

var Node = require('./Node');
var ResultSet = require('../../type/ResultSet');
var isBoolean = require('../../util/boolean').isBoolean;

/**
 * @constructor BlockNode
 * @extends {Node}
 * Holds a set with nodes
 */
function BlockNode() {
  if (!(this instanceof BlockNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.params = [];
}

BlockNode.prototype = new Node();

BlockNode.prototype.type = 'BlockNode';

/**
 * Add an expression. If visible = false, the expression will be evaluated
 * but not returned in the output.
 * @param {Node} expr
 * @param {Boolean} [visible=true]
 */
BlockNode.prototype.add = function (expr, visible) {
  if (visible === undefined) visible = true;

  // validate input
  if (!(expr instanceof Node))  throw new TypeError('Node expected for parameter "expr"');
  if (!isBoolean(visible))      throw new TypeError('Boolean expected for parameter "visible"');

  var index = this.params.length;
  this.params[index] = {
    node: expr,
    visible: visible
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
  defs.ResultSet = ResultSet;
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
      'return new ResultSet(results);' +
      '})()';
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
  for (var i = 0, len = params.length; i < len; i++) {
    nodes = nodes.concat(params[i].node.find(filter));
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

/**
 * Get LaTeX representation
 * @return {String} str
 */
BlockNode.prototype.toTex = function() {
  return this.params.map(function (param) {
    return param.node.toTex() + (param.visible ? '' : ';');
  }).join('\n');
};

module.exports = BlockNode;
