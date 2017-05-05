'use strict';

var latex = require('../../utils/latex');
var stringify = require('../../utils/string').stringify;
var hasOwnProperty = require('../../utils/object').hasOwnProperty;
var getSafeProperty = require('../../utils/customs').getSafeProperty;

function factory (type, config, load, typed, math) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));
  var Unit = load(require('../../type/unit/Unit'));

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
   * Compile the node to javascript code
   * @param {SymbolNode} node The node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  function compileSymbolNode(node, defs, args) {
    if (!(node instanceof SymbolNode)) {
      throw new TypeError('No valid SymbolNode')
    }

    // add a function to the definitions
    defs['undef'] = undef;
    defs['Unit'] = Unit;
    defs.getSafeProperty = getSafeProperty;
    defs.hasOwnProperty = hasOwnProperty;

    var jsName = stringify(node.name); // escaped node name inside double quotes

    if (hasOwnProperty(args, node.name)) {
      // this is a FunctionAssignment argument
      // (like an x when inside the expression of a function assignment `f(x) = ...`)
      return args[node.name];
    }
    else if (node.name in defs.math) {
      return '(' + jsName + ' in scope ' +
          '? getSafeProperty(scope, ' + jsName + ') ' +
          ': getSafeProperty(math, ' + jsName + '))';
    }
    else {
      return '(' +
          jsName + ' in scope ' +
          '? getSafeProperty(scope, ' + jsName + ') ' +
          ': ' + (Unit.isValuelessUnit(node.name)
              ? 'new Unit(null, ' + jsName + ')'
              : 'undef(' + jsName + ')') +
          ')';
    }
  }

  // register the compile function
  register(SymbolNode.prototype.type, compileSymbolNode);

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
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  SymbolNode.prototype._toTex = function(options) {
    var isUnit = false;
    if ((typeof math[this.name] === 'undefined') && Unit.isValuelessUnit(this.name)) {
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
