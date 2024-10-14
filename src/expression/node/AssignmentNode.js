import { isAccessorNode, isIndexNode, isNode, isSymbolNode } from '../../utils/is.js'
import { getSafeProperty, setSafeProperty } from '../../utils/customs.js'
import { factory } from '../../utils/factory.js'
import { accessFactory } from './utils/access.js'
import { assignFactory } from './utils/assign.js'
import { getPrecedence } from '../operators.js'

const name = 'AssignmentNode'
const dependencies = [
  'subset',
  '?matrix', // FIXME: should not be needed at all, should be handled by subset
  'Node'
]

export const createAssignmentNode = /* #__PURE__ */ factory(name, dependencies, ({ subset, matrix, Node }) => {
  const access = accessFactory({ subset })
  const assign = assignFactory({ subset, matrix })

  /*
   * Is parenthesis needed?
   * @param {node} node
   * @param {string} [parenthesis='keep']
   * @param {string} implicit
   * @private
   */
  function needParenthesis (node, parenthesis, implicit) {
    if (!parenthesis) {
      parenthesis = 'keep'
    }

    const precedence = getPrecedence(node, parenthesis, implicit)
    const exprPrecedence = getPrecedence(node.value, parenthesis, implicit)
    return (parenthesis === 'all') ||
      ((exprPrecedence !== null) && (exprPrecedence <= precedence))
  }

  class AssignmentNode extends Node {
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
     *    new AssignmentNode(new SymbolNode('a'), new ConstantNode(2))  // a=2
     *    new AssignmentNode(new SymbolNode('a'),
     *                       new IndexNode('b'),
     *                       new ConstantNode(2))   // a.b=2
     *    new AssignmentNode(new SymbolNode('a'),
     *                       new IndexNode(1, 2),
     *                       new ConstantNode(3))  // a[1,2]=3
     *
     * @param {SymbolNode | AccessorNode} object
     *     Object on which to assign a value
     * @param {IndexNode} [index=null]
     *     Index, property name or matrix index. Optional. If not provided
     *     and `object` is a SymbolNode, the property is assigned to the
     *     global scope.
     * @param {Node} value
     *     The value to be assigned
     */
    constructor (object, index, value) {
      super()
      this.object = object
      this.index = value ? index : null
      this.value = value || index

      // validate input
      if (!isSymbolNode(object) && !isAccessorNode(object)) {
        throw new TypeError('SymbolNode or AccessorNode expected as "object"')
      }
      if (isSymbolNode(object) && object.name === 'end') {
        throw new Error('Cannot assign to symbol "end"')
      }
      if (this.index && !isIndexNode(this.index)) { // index is optional
        throw new TypeError('IndexNode expected as "index"')
      }
      if (!isNode(this.value)) {
        throw new TypeError('Node expected as "value"')
      }
    }

    // class name for typing purposes:
    static name = name

    // readonly property name
    get name () {
      if (this.index) {
        return (this.index.isObjectProperty())
          ? this.index.getObjectProperty()
          : ''
      } else {
        return this.object.name || ''
      }
    }

    get type () { return name }
    get isAssignmentNode () { return true }

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
      const evalObject = this.object._compile(math, argNames)
      const evalIndex = this.index ? this.index._compile(math, argNames) : null
      const evalValue = this.value._compile(math, argNames)
      const name = this.object.name

      if (!this.index) {
        // apply a variable to the scope, for example `a=2`
        if (!isSymbolNode(this.object)) {
          throw new TypeError('SymbolNode expected as object')
        }

        return function evalAssignmentNode (scope, args, context) {
          const value = evalValue(scope, args, context)
          scope.set(name, value)
          return value
        }
      } else if (this.index.isObjectProperty()) {
        // apply an object property for example `a.b=2`
        const prop = this.index.getObjectProperty()

        return function evalAssignmentNode (scope, args, context) {
          const object = evalObject(scope, args, context)
          const value = evalValue(scope, args, context)
          setSafeProperty(object, prop, value)
          return value
        }
      } else if (isSymbolNode(this.object)) {
        // update a matrix subset, for example `a[2]=3`
        return function evalAssignmentNode (scope, args, context) {
          const childObject = evalObject(scope, args, context)
          const value = evalValue(scope, args, context)
          // Important:  we pass childObject instead of context:
          const index = evalIndex(scope, args, childObject)
          scope.set(name, assign(childObject, index, value))
          return value
        }
      } else { // isAccessorNode(node.object) === true
        // update a matrix subset, for example `a.b[2]=3`

        // we will not use the compile function of the AccessorNode, but
        // compile it ourselves here as we need the parent object of the
        // AccessorNode:
        // wee need to apply the updated object to parent object
        const evalParentObject = this.object.object._compile(math, argNames)

        if (this.object.index.isObjectProperty()) {
          const parentProp = this.object.index.getObjectProperty()

          return function evalAssignmentNode (scope, args, context) {
            const parent = evalParentObject(scope, args, context)
            const childObject = getSafeProperty(parent, parentProp)
            // Important: we pass childObject instead of context:
            const index = evalIndex(scope, args, childObject)
            const value = evalValue(scope, args, context)
            setSafeProperty(
              parent, parentProp, assign(childObject, index, value))
            return value
          }
        } else {
          // if some parameters use the 'end' parameter, we need to calculate
          // the size
          const evalParentIndex = this.object.index._compile(math, argNames)

          return function evalAssignmentNode (scope, args, context) {
            const parent = evalParentObject(scope, args, context)
            // Important: we pass parent instead of context:
            const parentIndex = evalParentIndex(scope, args, parent)
            const childObject = access(parent, parentIndex)
            // Important:  we pass childObject instead of context
            const index = evalIndex(scope, args, childObject)
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
    forEach (callback) {
      callback(this.object, 'object', this)
      if (this.index) {
        callback(this.index, 'index', this)
      }
      callback(this.value, 'value', this)
    }

    /**
     * Create a new AssignmentNode whose children are the results of calling
     * the provided callback function for each child of the original node.
     * @param {function(child: Node, path: string, parent: Node): Node} callback
     * @returns {AssignmentNode} Returns a transformed copy of the node
     */
    map (callback) {
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
    clone () {
      return new AssignmentNode(this.object, this.index, this.value)
    }

    /**
     * Get string representation
     * @param {Object} options
     * @return {string}
     */
    _toString (options) {
      const object = this.object.toString(options)
      const index = this.index ? this.index.toString(options) : ''
      let value = this.value.toString(options)
      if (needParenthesis(
        this, options && options.parenthesis, options && options.implicit)) {
        value = '(' + value + ')'
      }

      return object + index + ' = ' + value
    }

    /**
     * Get a JSON representation of the node
     * @returns {Object}
     */
    toJSON () {
      return {
        mathjs: name,
        object: this.object,
        index: this.index,
        value: this.value
      }
    }

    /**
     * Instantiate an AssignmentNode from its JSON representation
     * @param {Object} json
     *     An object structured like
     *     `{"mathjs": "AssignmentNode", object: ..., index: ..., value: ...}`,
     *     where mathjs is optional
     * @returns {AssignmentNode}
     */
    static fromJSON (json) {
      return new AssignmentNode(json.object, json.index, json.value)
    }

    /**
     * Get HTML representation
     * @param {Object} options
     * @return {string}
     */
    _toHTML (options) {
      const object = this.object.toHTML(options)
      const index = this.index ? this.index.toHTML(options) : ''
      let value = this.value.toHTML(options)
      if (needParenthesis(
        this, options && options.parenthesis, options && options.implicit)) {
        value = '<span class="math-paranthesis math-round-parenthesis">(</span>' +
          value +
          '<span class="math-paranthesis math-round-parenthesis">)</span>'
      }

      return object + index +
        '<span class="math-operator math-assignment-operator ' +
        'math-variable-assignment-operator math-binary-operator">=</span>' +
        value
    }

    /**
     * Get LaTeX representation
     * @param {Object} options
     * @return {string}
     */
    _toTex (options) {
      const object = this.object.toTex(options)
      const index = this.index ? this.index.toTex(options) : ''
      let value = this.value.toTex(options)
      if (needParenthesis(
        this, options && options.parenthesis, options && options.implicit)) {
        value = `\\left(${value}\\right)`
      }

      return object + index + '=' + value
    }
  }

  return AssignmentNode
}, { isClass: true, isNode: true })
