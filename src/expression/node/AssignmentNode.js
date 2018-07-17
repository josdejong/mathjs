'use strict'

const getSafeProperty = require('../../utils/customs').getSafeProperty
const setSafeProperty = require('../../utils/customs').setSafeProperty

function factory (type, config, load, typed) {
  const Node = load(require('./Node'))
  const assign = load(require('./utils/assign'))
  const access = load(require('./utils/access'))

  const operators = require('../operators')

  /**
   * @constructor AssignmentNode
   * @extends {Node}
   *
   * Define a symbol, like `a=3.2`, update a property like `a.b=3.2`, or
   * replace a subset of a matrix like `A[2,2]=42`.
   *
   * Syntax:
   *
   *     new AssignmentNode(symbol, value)
   *     new AssignmentNode(object, index, value)
   *
   * Usage:
   *
   *    new AssignmentNode(new SymbolNode('a'), new ConstantNode(2))                       // a=2
   *    new AssignmentNode(new SymbolNode('a'), new IndexNode('b'), new ConstantNode(2))   // a.b=2
   *    new AssignmentNode(new SymbolNode('a'), new IndexNode(1, 2), new ConstantNode(3))  // a[1,2]=3
   *
   * @param {SymbolNode | AccessorNode} object  Object on which to assign a value
   * @param {IndexNode} [index=null]            Index, property name or matrix
   *                                            index. Optional. If not provided
   *                                            and `object` is a SymbolNode,
   *                                            the property is assigned to the
   *                                            global scope.
   * @param {Node} value                        The value to be assigned
   */
  function AssignmentNode (object, index, value) {
    if (!(this instanceof AssignmentNode)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }

    this.object = object
    this.index = value ? index : null
    this.value = value || index

    // validate input
    if (!type.isSymbolNode(object) && !type.isAccessorNode(object)) {
      throw new TypeError('SymbolNode or AccessorNode expected as "object"')
    }
    if (type.isSymbolNode(object) && object.name === 'end') {
      throw new Error('Cannot assign to symbol "end"')
    }
    if (this.index && !type.isIndexNode(this.index)) { // index is optional
      throw new TypeError('IndexNode expected as "index"')
    }
    if (!type.isNode(this.value)) {
      throw new TypeError('Node expected as "value"')
    }

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

  AssignmentNode.prototype = new Node()

  AssignmentNode.prototype.type = 'AssignmentNode'

  AssignmentNode.prototype.isAssignmentNode = true

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
  AssignmentNode.prototype._compile = function (math, argNames) {
    const evalObject = this.object._compile(math, argNames)
    const evalIndex = this.index ? this.index._compile(math, argNames) : null
    const evalValue = this.value._compile(math, argNames)
    const name = this.object.name

    if (!this.index) {
      // apply a variable to the scope, for example `a=2`
      if (!type.isSymbolNode(this.object)) {
        throw new TypeError('SymbolNode expected as object')
      }

      return function evalAssignmentNode (scope, args, context) {
        return setSafeProperty(scope, name, evalValue(scope, args, context))
      }
    } else if (this.index.isObjectProperty()) {
      // apply an object property for example `a.b=2`
      const prop = this.index.getObjectProperty()

      return function evalAssignmentNode (scope, args, context) {
        const object = evalObject(scope, args, context)
        const value = evalValue(scope, args, context)
        return setSafeProperty(object, prop, value)
      }
    } else if (type.isSymbolNode(this.object)) {
      // update a matrix subset, for example `a[2]=3`
      return function evalAssignmentNode (scope, args, context) {
        const childObject = evalObject(scope, args, context)
        const value = evalValue(scope, args, context)
        const index = evalIndex(scope, args, childObject) // Important:  we pass childObject instead of context
        setSafeProperty(scope, name, assign(childObject, index, value))
        return value
      }
    } else { // type.isAccessorNode(node.object) === true
      // update a matrix subset, for example `a.b[2]=3`

      // we will not use the compile function of the AccessorNode, but compile it
      // ourselves here as we need the parent object of the AccessorNode:
      // wee need to apply the updated object to parent object
      const evalParentObject = this.object.object._compile(math, argNames)

      if (this.object.index.isObjectProperty()) {
        const parentProp = this.object.index.getObjectProperty()

        return function evalAssignmentNode (scope, args, context) {
          const parent = evalParentObject(scope, args, context)
          const childObject = getSafeProperty(parent, parentProp)
          const index = evalIndex(scope, args, childObject) // Important: we pass childObject instead of context
          const value = evalValue(scope, args, context)
          setSafeProperty(parent, parentProp, assign(childObject, index, value))
          return value
        }
      } else {
        // if some parameters use the 'end' parameter, we need to calculate the size
        const evalParentIndex = this.object.index._compile(math, argNames)

        return function evalAssignmentNode (scope, args, context) {
          const parent = evalParentObject(scope, args, context)
          const parentIndex = evalParentIndex(scope, args, parent) // Important: we pass parent instead of context
          const childObject = access(parent, parentIndex)
          const index = evalIndex(scope, args, childObject) // Important:  we pass childObject instead of context
          const value = evalValue(scope, args, context)

          assign(parent, parentIndex, assign(childObject, index, value))

          return value
        }
      }
    }
  }

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  AssignmentNode.prototype.forEach = function (callback) {
    callback(this.object, 'object', this)
    if (this.index) {
      callback(this.index, 'index', this)
    }
    callback(this.value, 'value', this)
  }

  /**
   * Create a new AssignmentNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {AssignmentNode} Returns a transformed copy of the node
   */
  AssignmentNode.prototype.map = function (callback) {
    const object = this._ifNode(callback(this.object, 'object', this))
    const index = this.index
      ? this._ifNode(callback(this.index, 'index', this))
      : null
    const value = this._ifNode(callback(this.value, 'value', this))

    return new AssignmentNode(object, index, value)
  }

  /**
   * Create a clone of this node, a shallow copy
   * @return {AssignmentNode}
   */
  AssignmentNode.prototype.clone = function () {
    return new AssignmentNode(this.object, this.index, this.value)
  }

  /*
   * Is parenthesis needed?
   * @param {node} node
   * @param {string} [parenthesis='keep']
   * @private
   */
  function needParenthesis (node, parenthesis) {
    if (!parenthesis) {
      parenthesis = 'keep'
    }

    const precedence = operators.getPrecedence(node, parenthesis)
    const exprPrecedence = operators.getPrecedence(node.value, parenthesis)
    return (parenthesis === 'all') ||
      ((exprPrecedence !== null) && (exprPrecedence <= precedence))
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string}
   */
  AssignmentNode.prototype._toString = function (options) {
    const object = this.object.toString(options)
    const index = this.index ? this.index.toString(options) : ''
    let value = this.value.toString(options)
    if (needParenthesis(this, options && options.parenthesis)) {
      value = '(' + value + ')'
    }

    return object + index + ' = ' + value
  }

  /**
   * Get a JSON representation of the node
   * @returns {Object}
   */
  AssignmentNode.prototype.toJSON = function () {
    return {
      mathjs: 'AssignmentNode',
      object: this.object,
      index: this.index,
      value: this.value
    }
  }

  /**
   * Instantiate an AssignmentNode from its JSON representation
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "AssignmentNode", object: ..., index: ..., value: ...}`,
   *                       where mathjs is optional
   * @returns {AssignmentNode}
   */
  AssignmentNode.fromJSON = function (json) {
    return new AssignmentNode(json.object, json.index, json.value)
  }

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string}
   */
  AssignmentNode.prototype.toHTML = function (options) {
    const object = this.object.toHTML(options)
    const index = this.index ? this.index.toHTML(options) : ''
    let value = this.value.toHTML(options)
    if (needParenthesis(this, options && options.parenthesis)) {
      value = '<span class="math-paranthesis math-round-parenthesis">(</span>' + value + '<span class="math-paranthesis math-round-parenthesis">)</span>'
    }

    return object + index + '<span class="math-operator math-assignment-operator math-variable-assignment-operator math-binary-operator">=</span>' + value
  }

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string}
   */
  AssignmentNode.prototype._toTex = function (options) {
    const object = this.object.toTex(options)
    const index = this.index ? this.index.toTex(options) : ''
    let value = this.value.toTex(options)
    if (needParenthesis(this, options && options.parenthesis)) {
      value = `\\left(${value}\\right)`
    }

    return object + index + ':=' + value
  }

  return AssignmentNode
}

exports.name = 'AssignmentNode'
exports.path = 'expression.node'
exports.factory = factory
