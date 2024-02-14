import { isArrayNode, isNode } from '../../utils/is.js'
import { map } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'ArrayNode'
const dependencies = [
  'Node'
]

export const createArrayNode = /* #__PURE__ */ factory(name, dependencies, ({ Node }) => {
  class ArrayNode extends Node {
    /**
     * @constructor ArrayNode
     * @extends {Node}
     * Holds an 1-dimensional array with items
     * @param {Node[]} [items]   1 dimensional array with items
     */
    constructor (items) {
      super()
      this.items = items || []

      // validate input
      if (!Array.isArray(this.items) || !this.items.every(isNode)) {
        throw new TypeError('Array containing Nodes expected')
      }
    }

    static name = name
    get type () { return name }
    get isArrayNode () { return true }

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
      const evalItems = map(this.items, function (item) {
        return item._compile(math, argNames)
      })

      const asMatrix = (math.config.matrix !== 'Array')
      if (asMatrix) {
        const matrix = math.matrix
        return function evalArrayNode (scope, args, context) {
          return matrix(map(evalItems, function (evalItem) {
            return evalItem(scope, args, context)
          }))
        }
      } else {
        return function evalArrayNode (scope, args, context) {
          return map(evalItems, function (evalItem) {
            return evalItem(scope, args, context)
          })
        }
      }
    }

    /**
     * Execute a callback for each of the child nodes of this node
     * @param {function(child: Node, path: string, parent: Node)} callback
     */
    forEach (callback) {
      for (let i = 0; i < this.items.length; i++) {
        const node = this.items[i]
        callback(node, 'items[' + i + ']', this)
      }
    }

    /**
     * Create a new ArrayNode whose children are the results of calling
     * the provided callback function for each child of the original node.
     * @param {function(child: Node, path: string, parent: Node): Node} callback
     * @returns {ArrayNode} Returns a transformed copy of the node
     */
    map (callback) {
      const items = []
      for (let i = 0; i < this.items.length; i++) {
        items[i] = this._ifNode(callback(this.items[i], 'items[' + i + ']', this))
      }
      return new ArrayNode(items)
    }

    /**
     * Create a clone of this node, a shallow copy
     * @return {ArrayNode}
     */
    clone () {
      return new ArrayNode(this.items.slice(0))
    }

    /**
     * Get string representation
     * @param {Object} options
     * @return {string} str
     * @override
     */
    _toString (options) {
      const items = this.items.map(function (node) {
        return node.toString(options)
      })
      return '[' + items.join(', ') + ']'
    }

    /**
     * Get a JSON representation of the node
     * @returns {Object}
     */
    toJSON () {
      return {
        mathjs: name,
        items: this.items
      }
    }

    /**
     * Instantiate an ArrayNode from its JSON representation
     * @param {Object} json  An object structured like
     *                       `{"mathjs": "ArrayNode", items: [...]}`,
     *                       where mathjs is optional
     * @returns {ArrayNode}
     */
    static fromJSON (json) {
      return new ArrayNode(json.items)
    }

    /**
     * Get HTML representation
     * @param {Object} options
     * @return {string} str
     * @override
     */
    _toHTML (options) {
      const items = this.items.map(function (node) {
        return node.toHTML(options)
      })
      return '<span class="math-parenthesis math-square-parenthesis">[</span>' +
        items.join('<span class="math-separator">,</span>') +
        '<span class="math-parenthesis math-square-parenthesis">]</span>'
    }

    /**
     * Get LaTeX representation
     * @param {Object} options
     * @return {string} str
     */
    _toTex (options) {
      function itemsToTex (items, nested) {
        const mixedItems = items.some(isArrayNode) && !items.every(isArrayNode)
        const itemsFormRow = nested || mixedItems
        const itemSep = itemsFormRow ? '&' : '\\\\'
        const itemsTex = items
          .map(function (node) {
            if (node.items) {
              return itemsToTex(node.items, !nested)
            } else {
              return node.toTex(options)
            }
          })
          .join(itemSep)
        return mixedItems || !itemsFormRow || (itemsFormRow && !nested)
          ? '\\begin{bmatrix}' + itemsTex + '\\end{bmatrix}'
          : itemsTex
      }
      return itemsToTex(this.items, false)
    }
  }

  return ArrayNode
}, { isClass: true, isNode: true })
