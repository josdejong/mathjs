'use strict';

var Node = require('./Node'),
    IndexNode = require('./IndexNode');

/**
 * @constructor UpdateNode
 * @extends {Node}
 * Update a matrix subset, like A[2,3] = 4.5
 *
 * @param {IndexNode} index             IndexNode containing symbol and ranges
 * @param {Node} expr                   The expression defining the symbol
 */
function UpdateNode(index, expr) {
  if (!(this instanceof UpdateNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  if (!(index instanceof IndexNode)) {
    throw new TypeError('Expected IndexNode for parameter "index"');
  }
  if (!(expr instanceof Node)) {
    throw new TypeError('Expected Node for parameter "expr"');
  }

  this.index = index;
  this.expr = expr;
}

UpdateNode.prototype = new Node();

UpdateNode.prototype.type = 'UpdateNode';

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
UpdateNode.prototype._compile = function (defs) {
  return 'scope["' + this.index.objectName() + '\"] = ' +
      this.index.compileSubset(defs,  this.expr._compile(defs));
};

/**
 * Recursively execute a callback for each of the child nodes of this node
 * @param {function(Node, string, Node)} callback
 * @private
 */
UpdateNode.prototype._traverse = function (callback) {
  callback(this.index, 'index', this);
  this.index._traverse(callback);

  callback(this.expr, 'expr', this);
  this.expr._traverse(callback);
};

/**
 * Create a clone of this node
 * @return {UpdateNode}
 */
UpdateNode.prototype.clone = function() {
  return new UpdateNode(this.index.clone(), this.expr.clone());
};

/**
 * Get string representation
 * @return {String}
 */
UpdateNode.prototype.toString = function() {
  return this.index.toString() + ' = ' + this.expr.toString();
};

/**
 * Get LaTeX representation
 * @return {String}
 */
UpdateNode.prototype.toTex = function() {
  return this.index.toTex() + ' = ' + this.expr.toTex();
};

module.exports = UpdateNode;
