var OperatorNode = require('./OperatorNode'),

    latex = require('../../util/latex');

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

/**
 * Get LaTeX representation
 * @return {String} str
 */
TernaryNode.prototype.toTex = function() {
  var s = (
        latex.addBraces(this.params[1].toTex()) +
        ', &\\quad' +
        latex.addBraces('\\text{if}\\;' + this.params[0].toTex())
      ) + '\\\\' + (
        latex.addBraces(this.params[2].toTex()) +
        ', &\\quad' +
        latex.addBraces('\\text{otherwise}')
      );

  return latex.addBraces(s, [
        '\\left\\{\\begin{array}{l l}',
        '\\end{array}\\right.'
      ]);
};

module.exports = TernaryNode;
