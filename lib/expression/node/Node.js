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
  throw new Error('Cannot compile a Node interface');
};

/**
 * Execute a callback for each of the child nodes of this node
 * @param {function(Node)} callback    Called as callback(node: Node).
 *                                     When the callback returns a node,
 *                                     the child is replaced with this node.
 * @private
 */
Node.prototype._traverse = function (callback) {
  // must be implemented by each of the nodes
};

/**
 * Test if this object matches given filter
 * @param {Object} [filter]     Available parameters:
 *                              {Function} type
 *                              {Object<String, *>} properties
 * @return {Boolean} matches    True if there is a match
 */
Node.prototype.match = function (filter) {
  var match = true;

  if (filter) {
    if (filter.type && !(this instanceof filter.type)) {
      match = false;
    }

    var properties = filter.properties;
    if (match && properties) {
      for (var prop in properties) {
        if (properties.hasOwnProperty(prop)) {
          if (this[prop] !== properties[prop]) {
            match = false;
            break;
          }
        }
      }
    }
  }

  return match;
};

/**
 * Find any node in the node tree matching given filter. For example, to
 * find all nodes of type SymbolNode having name 'x':
 *
 *     var results = Node.find({
 *         type: SymbolNode,
 *         properties: {
 *             name: 'x'
 *         }
 *     });
 *
 * @param {Object} filter       Available parameters:
 *                                  {Function} type
 *                                  {Object<String, String>} properties
 * @return {Node[]} nodes       An array with nodes matching given filter criteria
 */
Node.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search in the child nodes
  this._traverse(function (node) {
    nodes = nodes.concat(node.find(filter));
  });

  return nodes;
};

/**
 * Replace any node matching given filter with a replacement node. For example,
 * to replace all nodes of type SymbolNode having name 'x' with a ConstantNode
 * with value 2:
 *
 *     var results = Node.replace({
 *         type: SymbolNode,
 *         properties: {
 *             name: 'x'
 *         },
 *         replacement: new ConstantNode(2)
 *     });
 *
 * @param {Object} params       Available parameters:
 *                                  {Function} type
 *                                  {Object<String, String>} properties
 *                                  {Node | function } replacement
 * @return {Node} Returns the original node when there is no match, or
 *                the replaced node when there was a match.
 */
Node.prototype.replace = function (params) {
  // check itself
  if (this.match(params)) {
    var replacement = params.replacement;
    return typeof replacement === 'function' ? replacement(this) : replacement;
  }

  // recurse over the child nodes
  this._traverse(function (node) {
    return node.replace(params);
  });

  return this;
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
