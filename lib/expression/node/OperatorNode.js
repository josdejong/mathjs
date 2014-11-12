'use strict';

var Node = require('./Node'),
    ConstantNode = require('./ConstantNode'),
    SymbolNode = require('./SymbolNode'),
    FunctionNode = require('./FunctionNode'),
    latex = require('../../util/latex');

/**
 * @constructor OperatorNode
 * @extends {Node}
 * An operator with two arguments, like 2+3
 *
 * @param {String} op       Operator name, for example '+'
 * @param {String} fn       Function name, for example 'add'
 * @param {Node[]} args     Operator arguments
 */
function OperatorNode (op, fn, args) {
  if (!(this instanceof OperatorNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // TODO: validate input
  this.op = op;
  this.fn = fn;
  this.args = args || [];
}

OperatorNode.prototype = new Node();

OperatorNode.prototype.type = 'OperatorNode';

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
OperatorNode.prototype._compile = function (defs) {
  if (!(this.fn in defs.math)) {
    throw new Error('Function ' + this.fn + ' missing in provided namespace "math"');
  }

  var args = this.args.map(function (param) {
    return param._compile(defs);
  });
  return 'math.' + this.fn + '(' + args.join(', ') + ')';
};

/**
 * Recursively execute a callback for each of the child nodes of this node
 * @param {function(Node, string, Node)} callback
 * @private
 */
OperatorNode.prototype._traverse = function (callback) {
  for (var i = 0; i < this.args.length; i++) {
    var param = this.args[i];
    callback(param, 'args.' + i, this);
    param._traverse(callback);
  }
};

/**
 * Create a clone of this node
 * @return {OperatorNode}
 */
OperatorNode.prototype.clone = function() {
  return new OperatorNode(this.op, this.fn, this.args.map(function (param) {
    return param.clone();
  }));
};

/**
 * Get string representation
 * @return {String} str
 */
OperatorNode.prototype.toString = function() {
  var args = this.args;

  switch (args.length) {
    case 1:
      if (this.op == '-') {
        // special case: unary minus
        return '-' + args[0].toString();
      }
      else {
        // for example '5!'
        return args[0].toString() + this.op;
      }

    case 2: // for example '2+3'
      var lhs = args[0].toString();
      if (args[0] instanceof OperatorNode) {
        lhs = '(' + lhs + ')';
      }
      var rhs = args[1].toString();
      if (args[1] instanceof OperatorNode) {
        rhs = '(' + rhs + ')';
      }
      return lhs + ' ' + this.op + ' ' + rhs;

    default: // this should not occur. format as a function call
      return this.op + '(' + this.args.join(', ') + ')';
  }
};

/**
 * Get LaTeX representation
 * @return {String} str
 */
OperatorNode.prototype.toTex = function() {
  var args = this.args,
      mop = latex.toOperator(this.op),
      lp = args[0],
      rp = args[1];

  switch (args.length) {
    case 1:
      if (this.op === '-' || this.op === '+') {
        // special case: unary minus
        return this.op + lp.toTex();
      }
      // for example '5!'
      return lp.toTex() + this.op;

    case 2: // for example '2+3'
      var lhs = lp.toTex(),
          lhb = false,
          rhs = rp.toTex(),
          rhb = false,
          lop = '',
          rop = '';

      switch (this.op) {
        case '/':
          lop = mop;
          mop = '';

          break;

        case '*':
          if (lp instanceof OperatorNode) {
            if (lp.op === '+' || lp.op === '-') {
              lhb = true;
            }
          }

          if (rp instanceof OperatorNode) {
            if (rp.op === '+' || rp.op === '-') {
              rhb = true;
            }
            else if (rp.op === '*') {
              rhb = true;
            }
          }

          if ((lp instanceof ConstantNode || lp instanceof OperatorNode) &&
              (rp instanceof ConstantNode || rp instanceof OperatorNode)) {
            mop = ' \\cdot ';
          }
          else {
            mop = ' \\, ';
          }

          break;

        case '^':
          if (lp instanceof OperatorNode || lp instanceof FunctionNode) {
            lhb = true;
          }
          else if (lp instanceof SymbolNode) {
            lhb = null;
          }

          break;

        case 'to':
          rhs = latex.toUnit(rhs, true);
          break;
      }

      lhs = latex.addBraces(lhs, lhb);
      rhs = latex.addBraces(rhs, rhb);

      return lop + lhs + mop + rhs + rop;

    default: // this should not occur. format as a function call
      return mop + '(' + this.args.map(latex.toSymbol).join(', ') + ')';
  }
};

module.exports = OperatorNode;
