import { isAccessorNode, isArrayNode, isIndexNode, isNode, isSymbolNode } from '../../utils/is'
import { getSafeProperty, setSafeProperty } from '../../utils/customs'
import { last, map, matchFlatten } from '../../utils/array'
import { factory } from '../../utils/factory'
import { accessFactory } from './utils/access'
import { assignFactory } from './utils/assign'
import { getPrecedence } from '../operators'

const name = 'AssignmentNode'
const dependencies = [
  'subset',
  '?matrix', // FIXME: should not be needed at all, should be handled by subset
  'Node'
]

export const createAssignmentNode = /* #__PURE__ */ factory(name, dependencies, ({ subset, matrix, Node }) => {
  const access = accessFactory({ subset })
  const assign = assignFactory({ subset, matrix })

  /**
   * @constructor AssignmentNode
   * @extends {Node}
   *
   * Define a symbol, like `a=3.2`, update a property like `a.b=3.2`,
   * replace a subset of a matrix like `A[2,2]=42`, or
   * define an array of symbols or nested arrays that eventually end in symbols
   * like `[a,b]=[1,2]`, `[a;b]=[1;2]`, or `[[a],[b]]=[[1],[2]]`.
   *
   * Syntax:
   *
   *   new AssignmentNode(object, value)
   *   new AssignmentNode(object, index, value)
   *
   * Usage:
   *
   *   new AssignmentNode(new SymbolNode('a'), new ConstantNode(2))                       // a=2
   *   new AssignmentNode(new SymbolNode('a'), new IndexNode('b'), new ConstantNode(2))   // a.b=2
   *   new AssignmentNode(new SymbolNode('a'), new IndexNode(1, 2), new ConstantNode(3))  // a[1,2]=3
   *   new AssignmentNode(                                                                // [a,b]=[1,2]
   *     new ArrayNode([new SymbolNode('a'), new SymbolNode('b')]),
   *     new ArrayNode([new ConstantNode(1), new ConstantNode(2)])
   *   )
   *   new AssignmentNode(                                                                // [a;b]=[1;2]
   *     new ArrayNode([                                                                  // or
   *       new ArrayNode([new SymbolNode('a')]),                                          // [[a],[b]]=[[1],[2]]
   *       new ArrayNode([new SymbolNode('b')]),
   *     ]),
   *     new ArrayNode([
   *       new ArrayNode([new ConstantNode(1)]),
   *       new ArrayNode([new ConstantNode(2)]),
   *     ])
   *   )
   *
   * @param {SymbolNode | AccessorNode | ArrayNode} object  Object on which to assign a value
   * @param {IndexNode} [index=null]                        Index, property name or matrix
   *                                                        index. Optional. If not provided
   *                                                        and `object` is a SymbolNode,
   *                                                        the property is assigned to the
   *                                                        global scope.
   * @param {Node} value                                    The value to be assigned
   */
  function AssignmentNode (object, index, value) {
    if (!(this instanceof AssignmentNode)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }

    this.object = object
    this.index = value ? index : null
    this.value = value || index

    // validate input
    if (!isSymbolNode(object) && !isAccessorNode(object) && !isArrayNode(object)) {
      throw new TypeError('SymbolNode, AccessorNode, or ArrayNode expected as "object"')
    }
    if (isSymbolNode(object) && object.name === 'end') {
      throw new Error('Cannot assign to symbol "end"')
    }
    if (this.index && !isIndexNode(this.index)) { // index is optional
      throw new TypeError('IndexNode expected as "index"')
    }
    if (isArrayNode(object)) {
      if (this.index) {
        throw new TypeError('"index" not expected when "object" is ArrayNode')
      }
      // validate nested elements
      arrayNames(object)
    }
    if (!isNode(this.value)) {
      throw new TypeError('Node expected as "value"')
    }

    // readonly property name
    Object.defineProperty(this, 'name', {
      get: function () {
        if (this.index) {
          return (this.index.isObjectProperty())
            ? this.index.getObjectProperty()
            : ''
        } else if (isArrayNode(this.object)) {
          return arrayNames(this.object)
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
    return delegate(this.object, this.index, this.value)

    function delegate (object, index, value, scope, args, context) {
      if (!index) {
        if (isSymbolNode(object)) {
          // apply a variable to the scope, for example `a=2`
          return getEvalSymbolAssignmentNode(object, null, value, scope, args, context)
        } else if (isArrayNode(object)) {
          // apply an array of variables to the scope, for example `[a,b]=[1,2]`
          return getEvalArrayAssignmentNode(object, null, value)
        }
      } else if (index.isObjectProperty()) {
        // apply an object property for example `a.b=2`
        return getEvalPropertyAssignmentNode(object, index, value, scope, args, context)
      } else if (isSymbolNode(object)) {
        // update a matrix subset, for example `a[2]=3`
        return getEvalSubsetAssignmentNode(object, index, value, scope, args, context)
      } else { // isAccessorNode(node.object) === true
        // update a matrix property subset, for example `a.b[2]=3`
        return getEvalPropertySubsetAssignmentNode(object, index, value, scope, args, context)
      }
    }

    function getEvalArrayAssignmentNode (object, index, value) {
      const evalValue = value._compile(math, argNames)
      return function evalArrayAssignmentNode (scope, args, context) {
        const valueType = math.config.matrix
        const asMatrix = (valueType !== 'Array')
        let objects = object.toArray()
        let values = evalValue(scope, args, context)
        values = (asMatrix && values.toArray) ? values.toArray() : values
        let matches
        try {
          matches = matchFlatten(objects, values)
        } catch (e) {
          throw new TypeError(`Does not evaluate to ${valueType} of the same size as ${valueType} being assigned to`)
        }
        const results = map(matches, function (match) {
          const node = match.key
          const value = match.value
          if (isSymbolNode(node)) {
            return delegate(node, null, value, scope, args, context)
          } else { // isAccessorNode(node) === true
            return delegate(node.object, node.index, value, scope, args, context)
          }
        })
        return last(results)
      }
    }

    function getEvalSymbolAssignmentNode (object, index, value, scope, args, context) {
      if (scope) {
        return setSafeProperty(scope, object.name, value)
      } else {
        const evalValue = value._compile(math, argNames)
        return function evalSymbolAssignmentNode (scope, args, context) {
          return setSafeProperty(scope, object.name, evalValue(scope, args, context))
        }
      }
    }

    function getEvalPropertyAssignmentNode (object, index, value, scope, args, context) {
      const evalObject = object._compile(math, argNames)
      const prop = index.getObjectProperty()
      if (scope) {
        const object = evalObject(scope, args, context)
        return setSafeProperty(object, prop, value)
      } else {
        const evalValue = value._compile(math, argNames)
        return function evalPropertyAssignmentNode (scope, args, context) {
          const object = evalObject(scope, args, context)
          const value = evalValue(scope, args, context)
          return setSafeProperty(object, prop, value)
        }
      }
    }

    function getEvalSubsetAssignmentNode (object, index, value, scope, args, context) {
      const evalObject = object._compile(math, argNames)
      const evalIndex = index ? index._compile(math, argNames) : null
      if (scope) {
        const childObject = evalObject(scope, args, context)
        const index = evalIndex(scope, args, childObject) // Important:  we pass childObject instead of context
        setSafeProperty(scope, object.name, assign(childObject, index, value))
        return value
      } else {
        const evalValue = value._compile(math, argNames)
        return function evalSubsetAssignmentNode (scope, args, context) {
          const childObject = evalObject(scope, args, context)
          const value = evalValue(scope, args, context)
          const index = evalIndex(scope, args, childObject) // Important:  we pass childObject instead of context
          setSafeProperty(scope, object.name, assign(childObject, index, value))
          return value
        }
      }
    }

    function getEvalPropertySubsetAssignmentNode (object, index, value, scope, args, context) {
      const evalIndex = index ? index._compile(math, argNames) : null
      // we will not use the compile function of the AccessorNode, but compile it
      // ourselves here as we need the parent object of the AccessorNode:
      // we need to apply the updated object to parent object
      const evalParentObject = object.object._compile(math, argNames)
      if (scope) {
        if (object.index.isObjectProperty()) {
          const parentProp = object.index.getObjectProperty()
          const parent = evalParentObject(scope, args, context)
          const childObject = getSafeProperty(parent, parentProp)
          const index = evalIndex(scope, args, childObject) // Important: we pass childObject instead of context
          setSafeProperty(parent, parentProp, assign(childObject, index, value))
          return value
        } else {
          // if some parameters use the 'end' parameter, we need to calculate the size
          const evalParentIndex = object.index._compile(math, argNames)
          const parent = evalParentObject(scope, args, context)
          const parentIndex = evalParentIndex(scope, args, parent) // Important: we pass parent instead of context
          const childObject = access(parent, parentIndex)
          const index = evalIndex(scope, args, childObject) // Important:  we pass childObject instead of context
          assign(parent, parentIndex, assign(childObject, index, value))
          return value
        }
      } else {
        const evalValue = value._compile(math, argNames)
        if (object.index.isObjectProperty()) {
          const parentProp = object.index.getObjectProperty()
          return function evalPropertySubsetAssignmentNode (scope, args, context) {
            const parent = evalParentObject(scope, args, context)
            const childObject = getSafeProperty(parent, parentProp)
            const index = evalIndex(scope, args, childObject) // Important: we pass childObject instead of context
            const value = evalValue(scope, args, context)
            setSafeProperty(parent, parentProp, assign(childObject, index, value))
            return value
          }
        } else {
          // if some parameters use the 'end' parameter, we need to calculate the size
          const evalParentIndex = object.index._compile(math, argNames)
          return function evalPropertySubsetAssignmentNode (scope, args, context) {
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

  /**
  * Return a flattened (1-dimensional array) of all the names in `object`
  * @param {ArrayNode} object
  * @param {Array} [names=[]]
  * @return {Array}
  */
  function arrayNames (object, names) {
    names = names || []
    object.items.forEach(function (item) {
      if (isArrayNode(item)) {
        arrayNames(item, names)
      } else if (isSymbolNode(item) || isAccessorNode(item)) {
        names.push(item.toString())
      } else {
        throw new TypeError('Cannot assign to ' + item.type)
      }
    })
    return names
  }

  /**
   * Is parenthesis needed?
   * @param {node} node
   * @param {string} [parenthesis='keep']
   * @private
   */
  function needParenthesis (node, parenthesis) {
    if (!parenthesis) {
      parenthesis = 'keep'
    }

    const precedence = getPrecedence(node, parenthesis)
    const exprPrecedence = getPrecedence(node.value, parenthesis)
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
}, { isClass: true, isNode: true })
