import { getSafeProperty } from '../../utils/customs.js'
import { factory } from '../../utils/factory.js'
import { isNode } from '../../utils/is.js'
import { hasOwnProperty } from '../../utils/object.js'
import { escape, stringify } from '../../utils/string.js'

const name = 'ObjectNode'
const dependencies = [
  'Node'
]

export const createObjectNode = /* #__PURE__ */ factory(name, dependencies, ({ Node }) => {
  class ObjectNode extends Node {
    /**
     * @constructor ObjectNode
     * @extends {Node}
     * Holds an object with keys/values
     * @param {Object.<string, Node>} [properties]   object with key/value pairs
     */
    constructor (properties) {
      super()
      this.properties = properties || {}

      // validate input
      if (properties) {
        if (!(typeof properties === 'object') ||
            !Object.keys(properties).every(function (key) {
              return isNode(properties[key])
            })) {
          throw new TypeError('Object containing Nodes expected')
        }
      }
    }

    static name = name
    get type () { return name }
    get isObjectNode () { return true }

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
      const evalEntries = {}

      for (const key in this.properties) {
        if (hasOwnProperty(this.properties, key)) {
          // we stringify/parse the key here to resolve unicode characters,
          // so you cannot create a key like {"co\\u006Estructor": null}
          const stringifiedKey = stringify(key)
          const parsedKey = JSON.parse(stringifiedKey)
          const prop = getSafeProperty(this.properties, key)

          evalEntries[parsedKey] = prop._compile(math, argNames)
        }
      }

      return function evalObjectNode (scope, args, context) {
        const obj = {}

        for (const key in evalEntries) {
          if (hasOwnProperty(evalEntries, key)) {
            obj[key] = evalEntries[key](scope, args, context)
          }
        }

        return obj
      }
    }

    /**
     * Execute a callback for each of the child nodes of this node
     * @param {function(child: Node, path: string, parent: Node)} callback
     */
    forEach (callback) {
      for (const key in this.properties) {
        if (hasOwnProperty(this.properties, key)) {
          callback(
            this.properties[key], 'properties[' + stringify(key) + ']', this)
        }
      }
    }

    /**
     * Create a new ObjectNode whose children are the results of calling
     * the provided callback function for each child of the original node.
     * @param {function(child: Node, path: string, parent: Node): Node} callback
     * @returns {ObjectNode} Returns a transformed copy of the node
     */
    map (callback) {
      const properties = {}
      for (const key in this.properties) {
        if (hasOwnProperty(this.properties, key)) {
          properties[key] = this._ifNode(
            callback(
              this.properties[key], 'properties[' + stringify(key) + ']', this))
        }
      }
      return new ObjectNode(properties)
    }

    /**
     * Create a clone of this node, a shallow copy
     * @return {ObjectNode}
     */
    clone () {
      const properties = {}
      for (const key in this.properties) {
        if (hasOwnProperty(this.properties, key)) {
          properties[key] = this.properties[key]
        }
      }
      return new ObjectNode(properties)
    }

    /**
     * Get string representation
     * @param {Object} options
     * @return {string} str
     * @override
     */
    _toString (options) {
      const entries = []
      for (const key in this.properties) {
        if (hasOwnProperty(this.properties, key)) {
          entries.push(
            stringify(key) + ': ' + this.properties[key].toString(options))
        }
      }
      return '{' + entries.join(', ') + '}'
    }

    /**
     * Get a JSON representation of the node
     * @returns {Object}
     */
    toJSON () {
      return {
        mathjs: name,
        properties: this.properties
      }
    }

    /**
     * Instantiate an OperatorNode from its JSON representation
     * @param {Object} json  An object structured like
     *                       `{"mathjs": "ObjectNode", "properties": {...}}`,
     *                       where mathjs is optional
     * @returns {ObjectNode}
     */
    static fromJSON (json) {
      return new ObjectNode(json.properties)
    }

    /**
     * Get HTML representation
     * @param {Object} options
     * @return {string} str
     * @override
     */
    _toHTML (options) {
      const entries = []
      for (const key in this.properties) {
        if (hasOwnProperty(this.properties, key)) {
          entries.push(
            '<span class="math-symbol math-property">' + escape(key) + '</span>' +
              '<span class="math-operator math-assignment-operator ' +
              'math-property-assignment-operator math-binary-operator">' +
              ':</span>' + this.properties[key].toHTML(options))
        }
      }
      return '<span class="math-parenthesis math-curly-parenthesis">{</span>' +
        entries.join('<span class="math-separator">,</span>') +
        '<span class="math-parenthesis math-curly-parenthesis">}</span>'
    }

    /**
     * Get LaTeX representation
     * @param {Object} options
     * @return {string} str
     */
    _toTex (options) {
      const entries = []
      for (const key in this.properties) {
        if (hasOwnProperty(this.properties, key)) {
          entries.push(
            '\\mathbf{' + key + ':} & ' +
              this.properties[key].toTex(options) + '\\\\')
        }
      }
      const tex = '\\left\\{\\begin{array}{ll}' + entries.join('\n') +
          '\\end{array}\\right\\}'
      return tex
    }
  }

  return ObjectNode
}, { isClass: true, isNode: true })
