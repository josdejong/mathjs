'use strict';

var Node = require('./Node');
var ResultSet = require('../../type/ResultSet');
var isBoolean = require('../../util/boolean').isBoolean;

/**
 * @constructor BlockNode
 * @extends {Node}
 * Holds a set with blocks
 * @param {Array.<{node: Node} | {node: Node, visible: boolean}>} blocks
 *            An array with blocks, where a block is constructed as an Object
 *            with properties block, which is a Node, and visible, which is
 *            a boolean. The property visible is optional and is true by default
 */
function BlockNode(blocks) {
  if (!(this instanceof BlockNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate input, copy blocks
  if (!Array.isArray(blocks)) throw new Error('Array expected');
  this.blocks = blocks.map(function (block) {
    var node    = block && block.node;
    var visible = block && block.visible !== undefined ? block.visible : true;

    if (!(node instanceof Node))  throw new TypeError('Property "node" must be a Node');
    if (!isBoolean(visible))      throw new TypeError('Property "visible" must be a boolean');

    return {
      node: node,
      visible: visible
    }
  });
}

BlockNode.prototype = new Node();

BlockNode.prototype.type = 'BlockNode';

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
  var blocks = this.blocks.map(function(block) {
    return {
      node: block.node.clone(),
      visible: block.visible
    };
  });

  return new BlockNode(blocks);
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
