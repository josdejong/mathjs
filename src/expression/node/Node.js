import { isNode } from '../../utils/is.js'

import { keywords } from '../keywords.js'
import { deepStrictEqual } from '../../utils/object.js'
import { factory } from '../../utils/factory.js'
import { createMap } from '../../utils/map.js'

const name = 'Node'
const dependencies = ['mathWithTransform']

export const createNode = /* #__PURE__ */ factory(name, dependencies, ({ mathWithTransform }) => {
  /**
   * Validate the symbol names of a scope.
   * Throws an error when the scope contains an illegal symbol.
   * @param {Object} scope
   */
  function _validateScope (scope) {
    for (const symbol of [...keywords]) {
      if (scope.has(symbol)) {
        throw new Error('Scope contains an illegal symbol, "' + symbol + '" is a reserved keyword')
      }
    }
  }

  class Node {
    get type () { return 'Node' }
    get isNode () { return true }

    /**
     * Evaluate the node
     * @param {Object} [scope]  Scope to read/write variables
     * @return {*}              Returns the result
     */
    evaluate (scope) {
      return this.compile().evaluate(scope)
    }

    /**
     * Compile the node into an optimized, evauatable JavaScript function
     * @return {{evaluate: function([Object])}} object
     *                Returns an object with a function 'evaluate',
     *                which can be invoked as expr.evaluate([scope: Object]),
     *                where scope is an optional object with
     *                variables.
     */
    compile () {
      const expr = this._compile(mathWithTransform, {})
      const args = {}
      const context = null

      function evaluate (scope) {
        const s = createMap(scope)
        _validateScope(s)
        return expr(s, args, context)
      }

      return {
        evaluate
      }
    }

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
    _compile (math, argNames) {
      throw new Error('Method _compile must be implemented by type ' + this.type)
    }

    /**
     * Execute a callback for each of the child nodes of this node
     * @param {function(child: Node, path: string, parent: Node)} callback
     */
    forEach (callback) {
      // must be implemented by each of the Node implementations
      throw new Error('Cannot run forEach on a Node interface')
    }

    /**
     * Create a new Node whose children are the results of calling the
     * provided callback function for each child of the original node.
     * @param {function(child: Node, path: string, parent: Node): Node} callback
     * @returns {OperatorNode} Returns a transformed copy of the node
     */
    map (callback) {
      // must be implemented by each of the Node implementations
      throw new Error('Cannot run map on a Node interface')
    }

    /**
     * Validate whether an object is a Node, for use with map
     * @param {Node} node
     * @returns {Node} Returns the input if it's a node, else throws an Error
     * @protected
     */
    _ifNode (node) {
      if (!isNode(node)) {
        throw new TypeError('Callback function must return a Node')
      }
      return node
    }

    /**
     * Recursively traverse all nodes in a node tree. Executes given callback for
     * this node and each of its child nodes.
     * @param {function(node: Node, path: string, parent: Node)} callback
     *          A callback called for every node in the node tree.
     */
    traverse (callback) {
      // execute callback for itself
      // eslint-disable-next-line
      callback(this, null, null)

      // recursively traverse over all children of a node
      function _traverse (node, callback) {
        node.forEach(function (child, path, parent) {
          callback(child, path, parent)
          _traverse(child, callback)
        })
      }

      _traverse(this, callback)
    }

    /**
     * Recursively transform a node tree via a transform function.
     *
     * For example, to replace all nodes of type SymbolNode having name 'x' with
     * a ConstantNode with value 2:
     *
     *     const res = Node.transform(function (node, path, parent) {
     *       if (node && node.isSymbolNode) && (node.name === 'x')) {
     *         return new ConstantNode(2)
     *       }
     *       else {
     *         return node
     *       }
     *     })
     *
     * @param {function(node: Node, path: string, parent: Node) : Node} callback
     *          A mapping function accepting a node, and returning
     *          a replacement for the node or the original node. The "signature"
     *          of the callback must be:
     *          callback(node: Node, index: string, parent: Node) : Node
     * @return {Node} Returns the original node or its replacement
     */
    transform (callback) {
      function _transform (child, path, parent) {
        const replacement = callback(child, path, parent)

        if (replacement !== child) {
          // stop iterating when the node is replaced
          return replacement
        }

        return child.map(_transform)
      }

      return _transform(this, null, null)
    }

    /**
     * Find any node in the node tree matching given filter function. For
     * example, to find all nodes of type SymbolNode having name 'x':
     *
     *     const results = Node.filter(function (node) {
     *       return (node && node.isSymbolNode) && (node.name === 'x')
     *     })
     *
     * @param {function(node: Node, path: string, parent: Node) : Node} callback
     *            A test function returning true when a node matches, and false
     *            otherwise. Function signature:
     *            callback(node: Node, index: string, parent: Node) : boolean
     * @return {Node[]} nodes
     *            An array with nodes matching given filter criteria
     */
    filter (callback) {
      const nodes = []

      this.traverse(function (node, path, parent) {
        if (callback(node, path, parent)) {
          nodes.push(node)
        }
      })

      return nodes
    }

    /**
     * Create a shallow clone of this node
     * @return {Node}
     */
    clone () {
      // must be implemented by each of the Node implementations
      throw new Error('Cannot clone a Node interface')
    }

    /**
     * Create a deep clone of this node
     * @return {Node}
     */
    cloneDeep () {
      return this.map(function (node) {
        return node.cloneDeep()
      })
    }

    /**
     * Deep compare this node with another node.
     * @param {Node} other
     * @return {boolean} Returns true when both nodes are of the same type and
     *                   contain the same values (as do their childs)
     */
    equals (other) {
      return other
        ? this.type === other.type && deepStrictEqual(this, other)
        : false
    }

    /**
     * Get string representation. (wrapper function)
     *
     * This function can get an object of the following form:
     * {
     *    handler: //This can be a callback function of the form
     *             // "function callback(node, options)"or
     *             // a map that maps function names (used in FunctionNodes)
     *             // to callbacks
     *    parenthesis: "keep" //the parenthesis option (This is optional)
     * }
     *
     * @param {Object} [options]
     * @return {string}
     */
    toString (options) {
      const customString = this._getCustomString(options)

      if (typeof customString !== 'undefined') {
        return customString
      }

      return this._toString(options)
    }

    /**
     * Internal function to generate the string output.
     * This has to be implemented by every Node
     *
     * @throws {Error}
     */
    _toString () {
      // must be implemented by each of the Node implementations
      throw new Error('_toString not implemented for ' + this.type)
    }

    /**
     * Get a JSON representation of the node
     * Both .toJSON() and the static .fromJSON(json) should be implemented by all
     * implementations of Node
     * @returns {Object}
     */
    toJSON () {
      throw new Error(
        'Cannot serialize object: toJSON not implemented by ' + this.type)
    }

    /**
     * Get HTML representation. (wrapper function)
     *
     * This function can get an object of the following form:
     * {
     *    handler: //This can be a callback function of the form
     *             // "function callback(node, options)" or
     *             // a map that maps function names (used in FunctionNodes)
     *             // to callbacks
     *    parenthesis: "keep" //the parenthesis option (This is optional)
     * }
     *
     * @param {Object} [options]
     * @return {string}
     */
    toHTML (options) {
      const customString = this._getCustomString(options)

      if (typeof customString !== 'undefined') {
        return customString
      }

      return this._toHTML(options)
    }

    /**
     * Internal function to generate the HTML output.
     * This has to be implemented by every Node
     *
     * @throws {Error}
     */
    _toHTML () {
      // must be implemented by each of the Node implementations
      throw new Error('_toHTML not implemented for ' + this.type)
    }

    /**
     * Get LaTeX representation. (wrapper function)
     *
     * This function can get an object of the following form:
     * {
     *    handler: //This can be a callback function of the form
     *             // "function callback(node, options)"or
     *             // a map that maps function names (used in FunctionNodes)
     *             // to callbacks
     *    parenthesis: "keep" //the parenthesis option (This is optional)
     * }
     *
     * @param {Object} [options]
     * @return {string}
     */
    toTex (options) {
      const customString = this._getCustomString(options)

      if (typeof customString !== 'undefined') {
        return customString
      }

      return this._toTex(options)
    }

    /**
     * Internal function to generate the LaTeX output.
     * This has to be implemented by every Node
     *
     * @param {Object} [options]
     * @throws {Error}
     */
    _toTex (options) {
      // must be implemented by each of the Node implementations
      throw new Error('_toTex not implemented for ' + this.type)
    }

    /**
     * Helper used by `to...` functions.
     */
    _getCustomString (options) {
      if (options && typeof options === 'object') {
        switch (typeof options.handler) {
          case 'object':
          case 'undefined':
            return
          case 'function':
            return options.handler(this, options)
          default:
            throw new TypeError('Object or function expected as callback')
        }
      }
    }

    /**
     * Get identifier.
     * @return {string}
     */
    getIdentifier () {
      return this.type
    }

    /**
     * Get the content of the current Node.
     * @return {Node} node
     **/
    getContent () {
      return this
    }
  }

  return Node
}, { isClass: true, isNode: true })
