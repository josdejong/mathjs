'use strict';

var Node = require('./Node');
var SymbolNode = require('./SymbolNode');

var latex = require('../../util/latex');
var isNode = Node.isNode;
var isArray = Array.isArray;

/**
 * @constructor FunctionNode
 * @extends {Node}
 * invoke a list with arguments on a node
 * @param {string} name
 * @param {Node[]} args
 */
function FunctionNode (name, args) {
  if (!(this instanceof FunctionNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate input
  if (typeof name !== 'string') throw new TypeError('string expected for parameter "name"');
  if (!isArray(args) || !args.every(isNode)) {
    throw new TypeError('Array containing Nodes expected for parameter "args"');
  }

  this.name = name;
  this.args = args || [];
}

FunctionNode.prototype = new Node();

FunctionNode.prototype.type = 'FunctionNode';

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
FunctionNode.prototype._compile = function (defs) {
  var fn = defs.math[this.name];
  var isRaw = (typeof fn === 'function') && (fn.rawArgs == true);

  // compile the parameters
  var args = this.args.map(function (param) {
    return param._compile(defs);
  });

  if (isRaw) {
    // pass unevaluated parameters (nodes) to the function
    var paramsName;
    do {
      paramsName = 'p' + Math.round(Math.random() * 10000);
    }
    while (paramsName in defs);
    defs[paramsName] = this.args;

    return '("' + this.name + '" in scope ? ' +
        'scope["' + this.name + '"](' + args.join(', ') + ') : ' +
        'math["' + this.name + '"]' + '(' + paramsName + ', math, scope))';
  }
  else {
    // "regular" evaluation
    var symbol = new SymbolNode(this.name);
    return symbol._compile(defs) + '(' + args.join(', ') + ')';
  }
};

/**
 * Recursively execute a callback for each of the child nodes of this node
 * @param {function(Node, string, Node)} callback
 * @private
 */
FunctionNode.prototype._traverse = function (callback) {
  // args
  for (var i = 0; i < this.args.length; i++) {
    var param = this.args[i];
    callback(param, 'args.' + i, this);
    param._traverse(callback);
  }
};

/**
 * Create a clone of this node
 * @return {FunctionNode}
 */
FunctionNode.prototype.clone = function() {
  return new FunctionNode(this.name, this.args.map(function (param) {
    return param.clone();
  }));
};

/**
 * Get string representation
 * @return {String} str
 */
FunctionNode.prototype.toString = function() {
  // format the parameters like "add(2, 4.2)"
  return this.name + '(' + this.args.join(', ') + ')';
};

/**
 * Get LaTeX representation
 * @return {String} str
 */
FunctionNode.prototype.toTex = function() {
  return latex.toArgs(this);
};

module.exports = FunctionNode;
