var OperatorNode = require('./OperatorNode');

/**
 * @constructor TernaryNode
 * @extends {OperatorNode}
 *
 * A conditional expression
 *
 *     condition ? truePart : falsePart
 *
 * @param {String[]} ops  The operator symbols, for example ['?', ':']
 * @param {String} fn     The function name, for example 'ifElse'
 * @param {Node[]} params The operator parameters, should contain three parameters.
 */
function TernaryNode (ops, fn, params) {
  if (!(this instanceof TernaryNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // TODO: validate input
  this.ops = ops;
  this.fn = fn;
  this.params = params;
}

TernaryNode.prototype = new OperatorNode();

TernaryNode.prototype.type = 'TernaryNode';

/**
 * Get string representation
 * @return {String} str
 */
TernaryNode.prototype.toString = function() {
  return this.params[0] + ' ' + this.ops[0] + ' ' +
      this.params[1] + ' ' + this.ops[1] + ' ' +
      this.params[2];
};

module.exports = TernaryNode;
