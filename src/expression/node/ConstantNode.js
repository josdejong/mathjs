import { format } from '../../utils/string.js'
import { typeOf } from '../../utils/is.js'
import { escapeLatex } from '../../utils/latex.js'
import { factory } from '../../utils/factory.js'

const name = 'ConstantNode'
const dependencies = [
  'Node', 'isBounded'
]

export const createConstantNode = /* #__PURE__ */ factory(name, dependencies, ({ Node, isBounded }) => {
  class ConstantNode extends Node {
    /**
     * A ConstantNode holds a constant value like a number or string.
     *
     * Usage:
     *
     *     new ConstantNode(2.3)
     *     new ConstantNode('hello')
     *
     * @param {*} value    Value can be any type (number, BigNumber, bigint, string, ...)
     * @constructor ConstantNode
     * @extends {Node}
     */
    constructor (value) {
      super()
      this.value = value
    }

    static name = name
    get type () { return name }
    get isConstantNode () { return true }

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
      const value = this.value

      return function evalConstantNode () {
        return value
      }
    }

    /**
     * Execute a callback for each of the child nodes of this node
     * @param {function(child: Node, path: string, parent: Node)} callback
     */
    forEach (callback) {
      // nothing to do, we don't have any children
    }

    /**
     * Create a new ConstantNode with children produced by the given callback.
     * Trivial because there are no children.
     * @param {function(child: Node, path: string, parent: Node) : Node} callback
     * @returns {ConstantNode} Returns a clone of the node
     */
    map (callback) {
      return this.clone()
    }

    /**
     * Create a clone of this node, a shallow copy
     * @return {ConstantNode}
     */
    clone () {
      return new ConstantNode(this.value)
    }

    /**
     * Get string representation
     * @param {Object} options
     * @return {string} str
     */
    _toString (options) {
      return format(this.value, options)
    }

    /**
     * Get HTML representation
     * @param {Object} options
     * @return {string} str
     */
    _toHTML (options) {
      const value = this._toString(options)

      switch (typeOf(this.value)) {
        case 'number':
        case 'bigint':
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
    toJSON () {
      return { mathjs: name, value: this.value }
    }

    /**
     * Instantiate a ConstantNode from its JSON representation
     * @param {Object} json  An object structured like
     *                       `{"mathjs": "SymbolNode", value: 2.3}`,
     *                       where mathjs is optional
     * @returns {ConstantNode}
     */
    static fromJSON (json) {
      return new ConstantNode(json.value)
    }

    /**
     * Get LaTeX representation
     * @param {Object} options
     * @return {string} str
     */
    _toTex (options) {
      const value = this._toString(options)
      const type = typeOf(this.value)

      switch (type) {
        case 'string':
          return '\\mathtt{' + escapeLatex(value) + '}'

        case 'number':
        case 'BigNumber': {
          if (!isBounded(this.value)) {
            return (this.value.valueOf() < 0)
              ? '-\\infty'
              : '\\infty'
          }

          const index = value.toLowerCase().indexOf('e')
          if (index !== -1) {
            return value.substring(0, index) + '\\cdot10^{' +
              value.substring(index + 1) + '}'
          }

          return value
        }

        case 'bigint': {
          return value.toString()
        }

        case 'Fraction':
          return this.value.toLatex()

        default:
          return value
      }
    }
  }

  return ConstantNode
}, { isClass: true, isNode: true })
