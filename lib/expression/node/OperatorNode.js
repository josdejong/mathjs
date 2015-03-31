'use strict';

var Node = require('./Node'),
    ConstantNode = require('./ConstantNode'),
    SymbolNode = require('./SymbolNode'),
    FunctionNode = require('./FunctionNode'),
    latex = require('../../util/latex'),
    operators = require('../operators'),
    isArray = Array.isArray,
    isNode = Node.isNode;

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

  //validate input
  if (typeof op !== 'string') {
    throw new TypeError('string expected for parameter "op"');
  }
  if (typeof fn !== 'string') {
    throw new TypeError('string expected for parameter "fn"');
  }
  if (!isArray(args) || !args.every(isNode)) {
    throw new TypeError('Array containing Nodes expected for parameter "args"');
  }

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
 * Calculate which parentheses are necessary. Gets an OperatorNode
 * (which is the root of the tree) and an Array of Nodes
 * (this.args) and returns an array where 'true' means that an argument
 * has to be enclosed in parentheses whereas 'false' means the opposite.
 *
 * @param {OperatorNode} root
 * @param {Node[]} arguments
 * @return {bool[]}
 * @private
 */
function calculateNecessaryParentheses (root, args) {
  //precedence of the root OperatorNode
  var precedence = operators.getPrecedence(root);
  var associativity = operators.getAssociativity(root);

  switch (args.length) {
    case 1: //unary operators
      //precedence of the operand
      var operandPrecedence = operators.getPrecedence(args[0]);

      if (operandPrecedence === null) {
        //if the operand has no defined precedence, no parens are needed
        return [false];
      }

      if (operandPrecedence <= precedence) {
        //if the operands precedence is lower, parens are needed
        return [true];
      }

      //otherwise, no parens needed
      return [false];

    case 2: //binary operators
      var lhsParens; //left hand side needs parenthesis?
      //precedence of the left hand side
      var lhsPrecedence = operators.getPrecedence(args[0]);
      //is the root node associative with the left hand side
      var assocWithLhs = operators.isAssociativeWith(root, args[0]);

      if (lhsPrecedence === null) {
        //if the left hand side has no defined precedence, no parens are needed
        //FunctionNode for example
        lhsParens = false;
      }
      else if ((lhsPrecedence === precedence) && (associativity === 'right') && !assocWithLhs) {
        //In case of equal precedence, if the root node is left associative
        // parens are **never** necessary for the left hand side.
        //If it is right associative however, parens are necessary
        //if the root node isn't associative with the left hand side
        lhsParens = true;
      }
      else if (lhsPrecedence < precedence) {
        lhsParens = true;
      }
      else {
        lhsParens = false;
      }

      var rhsParens; //right hand side needs parenthesis?
      //precedence of the right hand side
      var rhsPrecedence = operators.getPrecedence(args[1]);
      //is the root node associative with the right hand side?
      var assocWithRhs = operators.isAssociativeWith(root, args[1]);

      if (rhsPrecedence === null) {
        //if the right hand side has no defined precedence, no parens are needed
        //FunctionNode for example
        rhsParens = false;
      }
      else if ((rhsPrecedence === precedence) && (associativity === 'left') && !assocWithRhs) {
        //In case of equal precedence, if the root node is right associative
        // parens are **never** necessary for the right hand side.
        //If it is left associative however, parens are necessary
        //if the root node isn't associative with the right hand side
        rhsParens = true;
      }
      else if (rhsPrecedence < precedence) {
        rhsParens = true;
      }
      else {
        rhsParens = false;
      }
      return [lhsParens, rhsParens];
    default:
      //behavior is undefined, fall back to putting everything in parens
      var parens = [];
      args.forEach(function () {
        parens.push(true);
      });
      return parens;
  }
}

/**
 * Get string representation.
 * @return {String} str
 */
OperatorNode.prototype.toString = function() {
  var args = this.args;
  var parens = calculateNecessaryParentheses(this, args);

  switch (args.length) {
    case 1: //unary operators
      var assoc = operators.getAssociativity(this);

      var operand = args[0].toString();
      if (parens[0]) {
        operand = '(' + operand + ')';
      }

      if (assoc === 'right') { //prefix operator
        return this.op + operand;
      }
      else if (assoc === 'left') { //postfix
        return operand + this.op;
      }

      //fall back to postfix
      return operand + this.op;

    case 2:
      var lhs = args[0].toString(); //left hand side
      var rhs = args[1].toString(); //right hand side
      if (parens[0]) { //left hand side in parenthesis?
        lhs = '(' + lhs + ')';
      }
      if (parens[1]) { //right hand side in parenthesis?
        rhs = '(' + rhs + ')';
      }

      return lhs + ' ' + this.op + ' ' + rhs;

    default:
      //fallback to formatting as a function call
      return this.fn + '(' + this.args.join(', ') + ')';
  }
};

/**
 * Get LaTeX representation
 * @param {Object|function} callback(s)
 * @return {String} str
 */
OperatorNode.prototype._toTex = function(callbacks) {
 var args = this.args; 
 var parens = calculateNecessaryParentheses(this, args);
 var op = latex.toOperator(this.op); //operator

 switch (args.length) {
   case 1: //unary operators
     var assoc = operators.getAssociativity(this);

     var operand = args[0].toTex(callbacks);
     if (parens[0]) {
       operand = latex.addBraces(operand, true);
     }

     if (assoc === 'right') { //prefix operator
       return op + operand;
     }
     else if (assoc === 'left') { //postfix operator
       return operand + op;
     }

     //fall back to postfix
     return operand + op;

   case 2: //binary operators
     var lhs = args[0]; //left hand side
     //reminder: if parens[0] is false, this puts it in curly braces
     var lhsTex = latex.addBraces(lhs.toTex(callbacks), parens[0]);
     var rhs = args[1]; //right hand side
     var rhsTex = latex.addBraces(rhs.toTex(callbacks), parens[1]);

     switch (this.getIdentifier()) {
       case 'OperatorNode:divide':
         //op contains '\\frac' at this point
         return op + lhsTex + rhsTex;

       case 'OperatorNode:to':
         rhsTex = latex.toUnit(rhs.toTex(callbacks));
         rhsTex = latex.addBraces(rhsTex, parens[1]);
         break;
     }
     return lhsTex + ' ' + op + ' ' + rhsTex;

   default:
     //fall back to formatting as a function call
     var argumentList = this.args.map(latex.toSymbol).join(', ');
     return latex.toFunction(this.fn) + latex.addBraces(argumentList, true);
 }
};

/**
 * Get identifier.
 * @return {String}
 */
OperatorNode.prototype.getIdentifier = function () {
  return this.type + ':' + this.fn;
};

module.exports = OperatorNode;
