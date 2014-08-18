'use strict';

var Node = require('./Node');

var latex = require('../../util/latex');
var isNode = Node.isNode;
var isArray = Array.isArray;

/**
 * @constructor FunctionNode
 * @extends {Node}
 * invoke a list with parameters on a node
 * @param {SymbolNode} symbol
 * @param {Node[]} params
 */
function FunctionNode (symbol, params) {
  if (!(this instanceof FunctionNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate input
  if (!(symbol instanceof Node)) throw new TypeError('SymbolNode expected for parameter "symbol"');
  if (!isArray(params) || !params.every(isNode)) {
    throw new TypeError('Array containing Nodes expected for parameter "params"');
  }

  this.symbol = symbol;
  this.params = params;
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
  var fn = defs.math[this.symbol.name];
  var isRaw = (typeof fn === 'function') && (fn.rawArgs == true);

  // compile the parameters
  var params = this.params.map(function (param) {
    return param._compile(defs);
  });

  if (isRaw) {
    // pass unevaluated parameters (nodes) to the function
    var name = this.symbol.name;
    var paramsName;
    do {
      paramsName = 'p' + Math.round(Math.random() * 10000);
    }
    while (paramsName in defs);
    defs[paramsName] = this.params;

    return '("' + name + '" in scope ? ' +
        'scope["' + name + '"](' + params.join(', ') + ') : ' +
        'math["' + name + '"]' + '(' + paramsName + ', math, scope))';
  }
  else {
    // "regular" evaluation
    return this.symbol._compile(defs) + '(' + params.join(', ') + ')';
  }
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
FunctionNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search symbol
  nodes = nodes.concat(this.symbol.find(filter));

  // search in parameters
  var params = this.params;
  for (var i = 0, len = params.length; i < len; i++) {
    nodes = nodes.concat(params[i].find(filter));
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String} str
 */
FunctionNode.prototype.toString = function() {
  // format the parameters like "add(2, 4.2)"
  return this.symbol.toString() + '(' + this.params.join(', ') + ')';
};

/**
 * Get LaTeX representation
 * @return {String} str
 */
FunctionNode.prototype.toTex = function() {
  return latex.toParams(this);
};

module.exports = FunctionNode;
