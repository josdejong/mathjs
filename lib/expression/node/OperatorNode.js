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

  var args = this.args.map(function (arg) {
    return arg._compile(defs);
  });
  return 'math.' + this.fn + '(' + args.join(', ') + ')';
};

/**
 * Execute a callback for each of the child nodes of this node
 * @param {function(child: Node, path: string, parent: Node)} callback
 */
OperatorNode.prototype.forEach = function (callback) {
  for (var i = 0; i < this.args.length; i++) {
    callback(this.args[i], 'args[' + i + ']', this);
  }
};

/**
 * Create a new OperatorNode having it's childs be the results of calling
 * the provided callback function for each of the childs of the original node.
 * @param {function(child: Node, path: string, parent: Node): Node} callback
 * @returns {OperatorNode} Returns a transformed copy of the node
 */
OperatorNode.prototype.map = function (callback) {
  var args = [];
  for (var i = 0; i < this.args.length; i++) {
    args[i] = this._ifNode(callback(this.args[i], 'args[' + i + ']', this));
  }
  return new OperatorNode(this.op, this.fn, args);
};

/**
 * Create a clone of this node, a shallow copy
 * @return {OperatorNode}
 */
OperatorNode.prototype.clone = function() {
  return new OperatorNode(this.op, this.fn, this.args.slice(0));
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
