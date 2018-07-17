'use strict'

const forEach = require('../../utils/array').forEach
const map = require('../../utils/array').map

function factory (type, config, load, typed) {
  const Node = load(require('./Node'))
  const ResultSet = load(require('../../type/resultset/ResultSet'))

  /**
   * @constructor BlockNode
   * @extends {Node}
   * Holds a set with blocks
   * @param {Array.<{node: Node} | {node: Node, visible: boolean}>} blocks
   *            An array with blocks, where a block is constructed as an Object
   *            with properties block, which is a Node, and visible, which is
   *            a boolean. The property visible is optional and is true by default
   */
  function BlockNode (blocks) {
    if (!(this instanceof BlockNode)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }

    // validate input, copy blocks
    if (!Array.isArray(blocks)) throw new Error('Array expected')
    this.blocks = blocks.map(function (block) {
      const node = block && block.node
      const visible = block && block.visible !== undefined ? block.visible : true

      if (!type.isNode(node)) throw new TypeError('Property "node" must be a Node')
      if (typeof visible !== 'boolean') throw new TypeError('Property "visible" must be a boolean')

      return {
        node: node,
        visible: visible
      }
    })
  }

  BlockNode.prototype = new Node()

  BlockNode.prototype.type = 'BlockNode'

  BlockNode.prototype.isBlockNode = true

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
  BlockNode.prototype._compile = function (math, argNames) {
    const evalBlocks = map(this.blocks, function (block) {
      return {
        eval: block.node._compile(math, argNames),
        visible: block.visible
      }
    })

    return function evalBlockNodes (scope, args, context) {
      const results = []

      forEach(evalBlocks, function evalBlockNode (block) {
        const result = block.eval(scope, args, context)
        if (block.visible) {
          results.push(result)
        }
      })

      return new ResultSet(results)
    }
  }

  /**
   * Execute a callback for each of the child blocks of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  BlockNode.prototype.forEach = function (callback) {
    for (let i = 0; i < this.blocks.length; i++) {
      callback(this.blocks[i].node, 'blocks[' + i + '].node', this)
    }
  }

  /**
   * Create a new BlockNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {BlockNode} Returns a transformed copy of the node
   */
  BlockNode.prototype.map = function (callback) {
    const blocks = []
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i]
      const node = this._ifNode(callback(block.node, 'blocks[' + i + '].node', this))
      blocks[i] = {
        node: node,
        visible: block.visible
      }
    }
    return new BlockNode(blocks)
  }

  /**
   * Create a clone of this node, a shallow copy
   * @return {BlockNode}
   */
  BlockNode.prototype.clone = function () {
    const blocks = this.blocks.map(function (block) {
      return {
        node: block.node,
        visible: block.visible
      }
    })

    return new BlockNode(blocks)
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  BlockNode.prototype._toString = function (options) {
    return this.blocks.map(function (param) {
      return param.node.toString(options) + (param.visible ? '' : ';')
    }).join('\n')
  }

  /**
   * Get a JSON representation of the node
   * @returns {Object}
   */
  BlockNode.prototype.toJSON = function () {
    return {
      mathjs: 'BlockNode',
      blocks: this.blocks
    }
  }

  /**
   * Instantiate an BlockNode from its JSON representation
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "BlockNode", blocks: [{node: ..., visible: false}, ...]}`,
   *                       where mathjs is optional
   * @returns {BlockNode}
   */
  BlockNode.fromJSON = function (json) {
    return new BlockNode(json.blocks)
  }

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  BlockNode.prototype.toHTML = function (options) {
    return this.blocks.map(function (param) {
      return param.node.toHTML(options) + (param.visible ? '' : '<span class="math-separator">;</span>')
    }).join('<span class="math-separator"><br /></span>')
  }

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  BlockNode.prototype._toTex = function (options) {
    return this.blocks.map(function (param) {
      return param.node.toTex(options) + (param.visible ? '' : ';')
    }).join('\\;\\;\n')
  }

  return BlockNode
}

exports.name = 'BlockNode'
exports.path = 'expression.node'
exports.factory = factory
