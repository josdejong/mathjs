import {
  isAccessorNode,
  isArrayNode,
  isConstantNode,
  isFunctionNode,
  isIndexNode,
  isNode,
  isObjectNode,
  isParenthesisNode,
  isSymbolNode
} from '../../utils/is'
import { getSafeProperty } from '../../utils/customs'
import { factory } from '../../utils/factory'
import { accessFactory } from './utils/access'

const name = 'AccessorNode'
const dependencies = [
  'subset',
  'Node'
]

export const createAccessorNode = /* #__PURE__ */ factory(name, dependencies, ({ subset, Node }) => {
  const access = accessFactory({ subset })

  /**
   * @constructor AccessorNode
   * @extends {Node}
   * Access an object property or get a matrix subset
   *
   * @param {Node} object                 The object from which to retrieve
   *                                      a property or subset.
   * @param {IndexNode} index             IndexNode containing ranges
   */
  function AccessorNode (object, index) {
    if (!(this instanceof AccessorNode)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }

    if (!isNode(object)) {
      throw new TypeError('Node expected for parameter "object"')
    }
    if (!isIndexNode(index)) {
      throw new TypeError('IndexNode expected for parameter "index"')
    }

    this.object = object || null
    this.index = index

    // readonly property name
    Object.defineProperty(this, 'name', {
      get: function () {
        if (this.index) {
          return (this.index.isObjectProperty())
            ? this.index.getObjectProperty()
            : ''
        } else {
          return this.object.name || ''
        }
      }.bind(this),
      set: function () {
        throw new Error('Cannot assign a new name, name is read-only')
      }
    })
  }

  AccessorNode.prototype = new Node()

  AccessorNode.prototype.type = 'AccessorNode'

  AccessorNode.prototype.isAccessorNode = true

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
  AccessorNode.prototype._compile = function (math, argNames) {
    const evalObject = this.object._compile(math, argNames)
    const evalIndex = this.index._compile(math, argNames)

    if (this.index.isObjectProperty()) {
      const prop = this.index.getObjectProperty()
      return function evalAccessorNode (scope, args, context) {
        return getSafeProperty(evalObject(scope, args, context), prop)
      }
    } else {
      return function evalAccessorNode (scope, args, context) {
        const object = evalObject(scope, args, context)
        const index = evalIndex(scope, args, object) // we pass object here instead of context
        return access(object, index)
      }
    }
  }

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  AccessorNode.prototype.forEach = function (callback) {
    callback(this.object, 'object', this)
    callback(this.index, 'index', this)
  }

  /**
   * Create a new AccessorNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {AccessorNode} Returns a transformed copy of the node
   */
  AccessorNode.prototype.map = function (callback) {
    return new AccessorNode(
      this._ifNode(callback(this.object, 'object', this)),
      this._ifNode(callback(this.index, 'index', this))
    )
  }

  /**
   * Create a clone of this node, a shallow copy
   * @return {AccessorNode}
   */
  AccessorNode.prototype.clone = function () {
    return new AccessorNode(this.object, this.index)
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string}
   */
  AccessorNode.prototype._toString = function (options) {
    let object = this.object.toString(options)
    if (needParenthesis(this.object)) {
      object = '(' + object + ')'
    }

    return object + this.index.toString(options)
  }

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string}
   */
  AccessorNode.prototype.toHTML = function (options) {
    let object = this.object.toHTML(options)
    if (needParenthesis(this.object)) {
      object = '<span class="math-parenthesis math-round-parenthesis">(</span>' + object + '<span class="math-parenthesis math-round-parenthesis">)</span>'
    }

    return object + this.index.toHTML(options)
  }

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string}
   */
  AccessorNode.prototype._toTex = function (options) {
    let object = this.object.toTex(options)
    if (needParenthesis(this.object)) {
      object = '\\left(\' + object + \'\\right)'
    }

    return object + this.index.toTex(options)
  }

  /**
   * Get a JSON representation of the node
   * @returns {Object}
   */
  AccessorNode.prototype.toJSON = function () {
    return {
      mathjs: 'AccessorNode',
      object: this.object,
      index: this.index
    }
  }

  /**
   * Instantiate an AccessorNode from its JSON representation
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "AccessorNode", object: ..., index: ...}`,
   *                       where mathjs is optional
   * @returns {AccessorNode}
   */
  AccessorNode.fromJSON = function (json) {
    return new AccessorNode(json.object, json.index)
  }

  /**
   * Are parenthesis needed?
   * @private
   */
  function needParenthesis (node) {
    // TODO: maybe make a method on the nodes which tells whether they need parenthesis?
    return !(
      isAccessorNode(node) ||
        isArrayNode(node) ||
        isConstantNode(node) ||
        isFunctionNode(node) ||
        isObjectNode(node) ||
        isParenthesisNode(node) ||
        isSymbolNode(node))
  }

  return AccessorNode
}, { isClass: true, isNode: true })
