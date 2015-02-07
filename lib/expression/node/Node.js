'use strict';

var keywords = require('../keywords');

/**
 * Node
 */
function Node() {
  if (!(this instanceof Node)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }
}

/**
 * Evaluate the node
 * @return {*} result
 */
// TODO: cleanup deprecated code one day. Deprecated since version 0.19.0
Node.prototype.eval = function () {
  throw new Error('Node.eval is deprecated. ' +
      'Use Node.compile(math).eval([scope]) instead.');
};

Node.prototype.type = 'Node';

/**
 * Compile the node to javascript code
 * @param {Object} math             math.js instance
 * @return {{eval: function}} expr  Returns an object with a function 'eval',
 *                                  which can be invoked as expr.eval([scope]),
 *                                  where scope is an optional object with
 *                                  variables.
 */
Node.prototype.compile = function (math) {
  if (!(math instanceof Object)) {
    throw new TypeError('Object expected for parameter math');
  }

  // definitions globally available inside the closure of the compiled expressions
  var defs = {
    math: _transform(math),
    _validateScope: _validateScope
  };

  var code = this._compile(defs);

  var defsCode = Object.keys(defs).map(function (name) {
    return '    var ' + name + ' = defs["' + name + '"];';
  });

  var factoryCode =
      defsCode.join(' ') +
          'return {' +
          '  "eval": function (scope) {' +
          '    if (scope) _validateScope(scope);' +
          '    scope = scope || {};' +
          '    return ' + code + ';' +
          '  }' +
          '};';

  var factory = new Function ('defs', factoryCode);
  return factory(defs);
};

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          and constants globally available inside the closure
 *                          of the compiled expression
 * @return {String} js
 * @private
 */
Node.prototype._compile = function (defs) {
  // must be implemented by each of the Node implementations
  throw new Error('Cannot compile a Node interface');
};

/**
 * Execute a callback for each of the child nodes of this node
 * @param {function(child: Node, path: string, parent: Node)} callback
 */
Node.prototype.forEach = function (callback) {
  // must be implemented by each of the Node implementations
  throw new Error('Cannot run forEach on a Node interface');
};

/**
 * Create a new Node having it's childs be the results of calling
 * the provided callback function for each of the childs of the original node.
 * @param {function(child: Node, path: string, parent: Node): Node} callback
 * @returns {OperatorNode} Returns a transformed copy of the node
 */
Node.prototype.map = function (callback) {
  // must be implemented by each of the Node implementations
  throw new Error('Cannot run map on a Node interface');
};

/**
 * Validate whether an object is a Node, for use with map
 * @param {Node} node
 * @returns {Node} Returns the input if it's a node, else throws an Error
 * @protected
 */
Node.prototype._ifNode = function (node) {
  if (!(node instanceof Node)) {
    throw new TypeError('Callback function must return a Node');
  }

  return node;
};

/**
 * Recursively traverse all nodes in a node tree. Executes given callback for
 * this node and each of its child nodes.
 * @param {function(node: Node, path: string, parent: Node)} callback
 *          A callback called for every node in the node tree.
 */
Node.prototype.traverse = function (callback) {
  // execute callback for itself
  callback(this, null, null);

  // recursively traverse over all childs of a node
  function _traverse (node, callback) {
    node.forEach(function(child, path, parent) {
      callback(child, path, parent);
      _traverse(child, callback);
    });
  }
  _traverse(this, callback);
};

/**
 * Recursively transform a node tree via a transform function.
 *
 * For example, to replace all nodes of type SymbolNode having name 'x' with a
 * ConstantNode with value 2:
 *
 *     var res = Node.transform(function (node, path, parent) {
 *       if (node instanceof SymbolNode) && (node.name == 'x')) {
 *         return new ConstantNode(2);
 *       }
 *       else {
 *         return node;
 *       }
 *     });
 *
 * @param {function(node: Node, path: string, parent: Node) : Node} callback
 *          A mapping function accepting a node, and returning
 *          a replacement for the node or the original node.
 *          Signature: callback(node: Node, index: string, parent: Node) : Node
 * @return {Node} Returns the original node or its replacement
 */
Node.prototype.transform = function (callback) {
  // check itself
  var replacement = callback(this, null, null);
  if (replacement !== this) {
    return replacement;
  }

  // traverse over all childs
  function _transform (node, callback) {
    return node.map(function(child, path, parent) {
      var replacement = callback(child, path, parent);
      return (replacement !== child) ? replacement : _transform(child, callback);
    });
  }
  return _transform(this, callback);
};

/**
 * Find any node in the node tree matching given filter function. For example, to
 * find all nodes of type SymbolNode having name 'x':
 *
 *     var results = Node.filter(function (node) {
 *       return (node instanceof SymbolNode) && (node.name == 'x');
 *     });
 *
 * @param {function(node: Node, path: string, parent: Node) : Node} callback
 *            A test function returning true when a node matches, and false
 *            otherwise. Function signature:
 *            callback(node: Node, index: string, parent: Node) : boolean
 * @return {Node[]} nodes       An array with nodes matching given filter criteria
 */
Node.prototype.filter = function (callback) {
  var nodes = [];

  this.traverse(function (node, path, parent) {
    if (callback(node, path, parent)) {
      nodes.push(node);
    }
  });

  return nodes;
};

// TODO: deprecated since version 1.1.0, remove this some day
Node.prototype.find = function () {
  throw new Error('Function Node.find is deprecated. Use Node.filter instead.');
};

// TODO: deprecated since version 1.1.0, remove this some day
Node.prototype.match = function () {
  throw new Error('Function Node.match is deprecated. See functions Node.filter, Node.transform, Node.traverse.');
};

/**
 * Create a clone of this node, a shallow copy
 * @return {Node}
 */
Node.prototype.clone = function() {
  // must be implemented by each of the Node implementations
  throw new Error('Cannot clone a Node interface');
};

/**
 * Get string representation
 * @return {String}
 */
Node.prototype.toString = function() {
  return '';
};

/**
 * Get LaTeX representation
 * @return {String}
 */
Node.prototype.toTex = function() {
  return '';
};

/**
 * Test whether an object is a Node
 * @param {*} object
 * @returns {boolean} isNode
 */
Node.isNode = function(object) {
  return object instanceof Node;
};

/**
 * Validate the symbol names of a scope.
 * Throws an error when the scope contains an illegal symbol.
 * @param {Object} scope
 */
function _validateScope (scope) {
  for (var symbol in scope) {
    if (scope.hasOwnProperty(symbol)) {
      if (symbol in keywords) {
        throw new Error('Scope contains an illegal symbol, "' + symbol + '" is a reserved keyword');
      }
    }
  }
}

/**
 * Replace all functions having a transform function attached at property transform
 * with their transform.
 * @param {Object} math
 * @return {Object} transformed
 * @private
 */
function _transform(math) {
  var transformed = Object.create(math);

  for (var name in math) {
    if (math.hasOwnProperty(name)) {
      var fn = math[name];
      var transform = fn && fn.transform;
      if (transform) {
        transformed[name] = transform;
      }
    }
  }

  return transformed;
}

module.exports = Node;
