import { format } from '../../utils/string'
import { typeOf } from '../../utils/is'
import { escapeLatex } from '../../utils/latex'
import { factory } from '../../utils/factory'

const name = 'ConstantNode'
const dependencies = [
  'Node'
]

export const createConstantNode = /* #__PURE__ */ factory(name, dependencies, ({ Node }) => {
  /**
   * A ConstantNode holds a constant value like a number or string.
   *
   * Usage:
   *
   *     new ConstantNode(2.3)
   *     new ConstantNode('hello')
   *
   * @param {*} value    Value can be any type (number, BigNumber, string, ...)
   * @constructor ConstantNode
   * @extends {Node}
   */
  function ConstantNode (value) {
    if (!(this instanceof ConstantNode)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }

    if (arguments.length === 2) {
      // TODO: remove deprecation error some day (created 2018-01-23)
      throw new SyntaxError('new ConstantNode(valueStr, valueType) is not supported anymore since math v4.0.0. Use new ConstantNode(value) instead, where value is a non-stringified value.')
    }

    this.value = value
  }

  ConstantNode.prototype = new Node()

  ConstantNode.prototype.type = 'ConstantNode'

  ConstantNode.prototype.isConstantNode = true

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
  ConstantNode.prototype._compile = function (math, argNames) {
    const value = this.value

    return function evalConstantNode () {
      return value
    }
  }

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  ConstantNode.prototype.forEach = function (callback) {
    // nothing to do, we don't have childs
  }

  /**
   * Create a new ConstantNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node) : Node} callback
   * @returns {ConstantNode} Returns a clone of the node
   */
  ConstantNode.prototype.map = function (callback) {
    return this.clone()
  }

  /**
   * Create a clone of this node, a shallow copy
   * @return {ConstantNode}
   */
  ConstantNode.prototype.clone = function () {
    return new ConstantNode(this.value)
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  ConstantNode.prototype._toString = function (options) {
    return format(this.value, options)
  }

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   */
  ConstantNode.prototype.toHTML = function (options) {
    const value = this._toString(options)

    switch (typeOf(this.value)) {
      case 'number':
      case 'BigNumber':
      case 'Fraction':
        return '<span class="math-number">' + value + '</span>'
      case 'string':
        return '<span class="math-string">' + value + '</span>'
      case 'boolean':
        return '<span class="math-boolean">' + value + '</span>'
      case 'null':
        return '<span class="math-null-symbol">' + value + '</span>'
      case 'undefined':
        return '<span class="math-undefined">' + value + '</span>'

      default:
        return '<span class="math-symbol">' + value + '</span>'
    }
  }

  /**
   * Get a JSON representation of the node
   * @returns {Object}
   */
  ConstantNode.prototype.toJSON = function () {
    return {
      mathjs: 'ConstantNode',
      value: this.value
    }
  }

  /**
   * Instantiate a ConstantNode from its JSON representation
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "SymbolNode", value: 2.3}`,
   *                       where mathjs is optional
   * @returns {ConstantNode}
   */
  ConstantNode.fromJSON = function (json) {
    return new ConstantNode(json.value)
  }

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  ConstantNode.prototype._toTex = function (options) {
    const value = this._toString(options)

    switch (typeOf(this.value)) {
      case 'string':
        return '\\mathtt{' + escapeLatex(value) + '}'

      case 'number':
      case 'BigNumber':
        {
          const index = value.toLowerCase().indexOf('e')
          if (index !== -1) {
            return value.substring(0, index) + '\\cdot10^{' +
                value.substring(index + 1) + '}'
          }
        }
        return value
      case 'Fraction':
        return this.value.toLatex()

      default:
        return value
    }
  }

  return ConstantNode
}, { isClass: true, isNode: true })
