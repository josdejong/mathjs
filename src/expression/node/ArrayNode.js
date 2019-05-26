import { isNode } from '../../utils/is'
import { map } from '../../utils/array'
import { factory } from '../../utils/factory'

const name = 'ArrayNode'
const dependencies = [
  'Node'
]

export const createArrayNode = /* #__PURE__ */ factory(name, dependencies, ({ Node }) => {
  /**
   * @constructor ArrayNode
   * @extends {Node}
   * Holds an 1-dimensional array with items
   * @param {Node[]} [items]   1 dimensional array with items
   */
  function ArrayNode (items) {
    if (!(this instanceof ArrayNode)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }

    this.items = items || []

    // validate input
    if (!Array.isArray(this.items) || !this.items.every(isNode)) {
      throw new TypeError('Array containing Nodes expected')
    }

    // TODO: deprecated since v3, remove some day
    const deprecated = function () {
      throw new Error('Property `ArrayNode.nodes` is deprecated, use `ArrayNode.items` instead')
    }
    Object.defineProperty(this, 'nodes', { get: deprecated, set: deprecated })
  }

  ArrayNode.prototype = new Node()

  ArrayNode.prototype.type = 'ArrayNode'

  ArrayNode.prototype.isArrayNode = true

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
  ArrayNode.prototype._compile = function (math, argNames) {
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
  ArrayNode.prototype.forEach = function (callback) {
    for (let i = 0; i < this.items.length; i++) {
      const node = this.items[i]
      callback(node, 'items[' + i + ']', this)
    }
  }

  /**
   * Create a new ArrayNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {ArrayNode} Returns a transformed copy of the node
   */
  ArrayNode.prototype.map = function (callback) {
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
  ArrayNode.prototype.clone = function () {
    return new ArrayNode(this.items.slice(0))
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ArrayNode.prototype._toString = function (options) {
    const items = this.items.map(function (node) {
      return node.toString(options)
    })
    return '[' + items.join(', ') + ']'
  }

  /**
   * Get a JSON representation of the node
   * @returns {Object}
   */
  ArrayNode.prototype.toJSON = function () {
    return {
      mathjs: 'ArrayNode',
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
  ArrayNode.fromJSON = function (json) {
    return new ArrayNode(json.items)
  }

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ArrayNode.prototype.toHTML = function (options) {
    const items = this.items.map(function (node) {
      return node.toHTML(options)
    })
    return '<span class="math-parenthesis math-square-parenthesis">[</span>' + items.join('<span class="math-separator">,</span>') + '<span class="math-parenthesis math-square-parenthesis">]</span>'
  }

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  ArrayNode.prototype._toTex = function (options) {
    let s = '\\begin{bmatrix}'

    this.items.forEach(function (node) {
      if (node.items) {
        s += node.items.map(function (childNode) {
          return childNode.toTex(options)
        }).join('&')
      } else {
        s += node.toTex(options)
      }

      // new line
      s += '\\\\'
    })
    s += '\\end{bmatrix}'
    return s
  }

  return ArrayNode
}, { isClass: true, isNode: true })
