'use strict';

var latex = require('../../utils/latex');
var escape = require('../../utils/string').escape;
var hasOwnProperty = require('../../utils/object').hasOwnProperty;
var getSafeProperty = require('../../utils/customs').getSafeProperty;

function factory (type, config, load, typed, math) {
  var Node = load(require('./Node'));

  /**
   * Check whether some name is a valueless unit like "inch".
   * @param {string} name
   * @return {boolean}
   */
  function isValuelessUnit (name) {
    return type.Unit ? type.Unit.isValuelessUnit(name) : false;
  }

  /**
   * @constructor SymbolNode
   * @extends {Node}
   * A symbol node can hold and resolve a symbol
   * @param {string} name
   * @extends {Node}
   */
  function SymbolNode(name) {
    if (!(this instanceof SymbolNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (typeof name !== 'string')  throw new TypeError('String expected for parameter "name"');

    this.name = name;
  }

  SymbolNode.prototype = new Node();

  SymbolNode.prototype.type = 'SymbolNode';

  SymbolNode.prototype.isSymbolNode = true;

  /**
   * Compile a node into a JavaScript function.
   * This basically pre-calculates as much as possible and only leaves open
   * calculations which depend on a dynamic scope with variables.
   * @param {Object} math     Math.js namespace with functions and constants. 
   * @param {Object} argNames An object with argument names as key and `true`
   *                          as value. Used in the SymbolNode to optimize
   *                          for arguments from user assigned functions
   *                          (see FunctionAssignmentNode) or special symbols
   *                          like `end` (see IndexNode).
   * @return {function} Returns a function which can be called like:
   *                        evalNode(scope: Object, args: Object, context: *)
   */
  SymbolNode.prototype._compile = function (math, argNames) {
    var name = this.name;

    if (hasOwnProperty(argNames, name)) {
      // this is a FunctionAssignment argument
      // (like an x when inside the expression of a function assignment `f(x) = ...`)
      return function (scope, args, context) {
        return args[name];
      }
    }
    else if (name in math) {
      return function (scope, args, context) {
        return name in scope 
          ? getSafeProperty(scope, name) 
          : getSafeProperty(math, name);
      }
    }
    else {
      var isUnit = isValuelessUnit(name);

      return function (scope, args, context) {
        return name in scope 
          ? getSafeProperty(scope, name) 
          : isUnit 
            ? new type.Unit(null, name)
            : undef(name);
      }
    }
  }

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  SymbolNode.prototype.forEach = function (callback) {
    // nothing to do, we don't have childs
  };

  /**
   * Create a new SymbolNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node) : Node} callback
   * @returns {SymbolNode} Returns a clone of the node
   */
  SymbolNode.prototype.map = function (callback) {
    return this.clone();
  };

  /**
   * Throws an error 'Undefined symbol {name}'
   * @param {string} name
   */
  function undef (name) {
    throw new Error('Undefined symbol ' + name);
  }

  /**
   * Create a clone of this node, a shallow copy
   * @return {SymbolNode}
   */
  SymbolNode.prototype.clone = function() {
    return new SymbolNode(this.name);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  SymbolNode.prototype._toString = function(options) {
    return this.name;
  };

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  SymbolNode.prototype.toHTML = function(options) {
	var name = escape(this.name);
	
    if (name == "true" || name == "false") {
	  return '<span class="math-symbol math-boolean">' + name + '</span>';
	}
	else if (name == "i") {
	  return '<span class="math-symbol math-imaginary-symbol">' + name + '</span>';
	}
	else if (name == "Infinity") {
	  return '<span class="math-symbol math-infinity-symbol">' + name + '</span>';
	}
	else if (name == "NaN") {
	  return '<span class="math-symbol math-nan-symbol">' + name + '</span>';
	}
	else if (name == "null") {
	  return '<span class="math-symbol math-null-symbol">' + name + '</span>';
	}
	else if (name == "undefined") {
	  return '<span class="math-symbol math-undefined-symbol">' + name + '</span>';
	}
	
	return '<span class="math-symbol">' + name + '</span>';
  };

  /**
   * Get a JSON representation of the node
   * @returns {Object}
   */
  SymbolNode.prototype.toJSON = function () {
    return {
      mathjs: 'SymbolNode',
      name: this.name
    };
  };

  /**
   * Instantiate a SymbolNode from its JSON representation
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "SymbolNode", name: "x"}`,
   *                       where mathjs is optional
   * @returns {SymbolNode}
   */
  SymbolNode.fromJSON = function (json) {
    return new SymbolNode(json.name);
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  SymbolNode.prototype._toTex = function(options) {
    var isUnit = false;
    if ((typeof math[this.name] === 'undefined') && isValuelessUnit(this.name)) {
      isUnit = true;
    }
    var symbol = latex.toSymbol(this.name, isUnit);
    if (symbol[0] === '\\') {
      //no space needed if the symbol starts with '\'
      return symbol;
    }
    //the space prevents symbols from breaking stuff like '\cdot' if it's written right before the symbol
    return ' ' + symbol;
  };

  return SymbolNode;
}

exports.name = 'SymbolNode';
exports.path = 'expression.node';
exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.factory = factory;
