'use strict';

var Node = require('./Node');
var ResultSet = require('../../type/ResultSet');
var isBoolean = require('../../util/boolean').isBoolean;

/**
 * @constructor BlockNode
 * @extends {Node}
 * Holds a set with blocks
 */
function BlockNode() {
  if (!(this instanceof BlockNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.blocks = [];
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

  var index = this.blocks.length;
  this.blocks[index] = {
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
  var blocks = this.blocks.map(function (param) {
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
      blocks.join('') +
      'return new ResultSet(results);' +
      '})()';
};

/**
 * Recursively execute a callback for each of the child blocks of this node
 * @param {function(Node, string, Node)} callback
 * @private
 */
BlockNode.prototype._traverse = function (callback) {
  for (var i = 0; i < this.blocks.length; i++) {
    var node = this.blocks[i].node;
    callback(node, 'blocks.' + i + '.node', this);
    node._traverse(callback);
  }
};

/**
 * Create a clone of this node
 * @return {BlockNode}
 */
BlockNode.prototype.clone = function() {
  var clone = new BlockNode();

  this.blocks.forEach(function(param) {
    clone.blocks.push({
      node: param.node.clone(),
      visible: param.visible
    })
  });

  return clone;
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
BlockNode.prototype.toString = function() {
  return this.blocks.map(function (param) {
    return param.node.toString() + (param.visible ? '' : ';');
  }).join('\n');
};

/**
 * Get LaTeX representation
 * @return {String} str
 */
BlockNode.prototype.toTex = function() {
  return this.blocks.map(function (param) {
    return param.node.toTex() + (param.visible ? '' : ';');
  }).join('\n');
};

module.exports = BlockNode;
