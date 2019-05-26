import { isBigNumber, isComplex, isNode, isUnit, typeOf } from '../../utils/is'
import { factory } from '../../utils/factory'
import { getPrecedence } from '../operators'

const name = 'ConditionalNode'
const dependencies = [
  'Node'
]

export const createConditionalNode = /* #__PURE__ */ factory(name, dependencies, ({ Node }) => {
  /**
   * A lazy evaluating conditional operator: 'condition ? trueExpr : falseExpr'
   *
   * @param {Node} condition   Condition, must result in a boolean
   * @param {Node} trueExpr    Expression evaluated when condition is true
   * @param {Node} falseExpr   Expression evaluated when condition is true
   *
   * @constructor ConditionalNode
   * @extends {Node}
   */
  function ConditionalNode (condition, trueExpr, falseExpr) {
    if (!(this instanceof ConditionalNode)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }
    if (!isNode(condition)) throw new TypeError('Parameter condition must be a Node')
    if (!isNode(trueExpr)) throw new TypeError('Parameter trueExpr must be a Node')
    if (!isNode(falseExpr)) throw new TypeError('Parameter falseExpr must be a Node')

    this.condition = condition
    this.trueExpr = trueExpr
    this.falseExpr = falseExpr
  }

  ConditionalNode.prototype = new Node()

  ConditionalNode.prototype.type = 'ConditionalNode'

  ConditionalNode.prototype.isConditionalNode = true

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
  ConditionalNode.prototype._compile = function (math, argNames) {
    const evalCondition = this.condition._compile(math, argNames)
    const evalTrueExpr = this.trueExpr._compile(math, argNames)
    const evalFalseExpr = this.falseExpr._compile(math, argNames)

    return function evalConditionalNode (scope, args, context) {
      return testCondition(evalCondition(scope, args, context))
        ? evalTrueExpr(scope, args, context)
        : evalFalseExpr(scope, args, context)
    }
  }

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  ConditionalNode.prototype.forEach = function (callback) {
    callback(this.condition, 'condition', this)
    callback(this.trueExpr, 'trueExpr', this)
    callback(this.falseExpr, 'falseExpr', this)
  }

  /**
   * Create a new ConditionalNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {ConditionalNode} Returns a transformed copy of the node
   */
  ConditionalNode.prototype.map = function (callback) {
    return new ConditionalNode(
      this._ifNode(callback(this.condition, 'condition', this)),
      this._ifNode(callback(this.trueExpr, 'trueExpr', this)),
      this._ifNode(callback(this.falseExpr, 'falseExpr', this))
    )
  }

  /**
   * Create a clone of this node, a shallow copy
   * @return {ConditionalNode}
   */
  ConditionalNode.prototype.clone = function () {
    return new ConditionalNode(this.condition, this.trueExpr, this.falseExpr)
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  ConditionalNode.prototype._toString = function (options) {
    const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
    const precedence = getPrecedence(this, parenthesis)

    // Enclose Arguments in parentheses if they are an OperatorNode
    // or have lower or equal precedence
    // NOTE: enclosing all OperatorNodes in parentheses is a decision
    // purely based on aesthetics and readability
    let condition = this.condition.toString(options)
    const conditionPrecedence = getPrecedence(this.condition, parenthesis)
    if ((parenthesis === 'all') ||
        (this.condition.type === 'OperatorNode') ||
        ((conditionPrecedence !== null) && (conditionPrecedence <= precedence))) {
      condition = '(' + condition + ')'
    }

    let trueExpr = this.trueExpr.toString(options)
    const truePrecedence = getPrecedence(this.trueExpr, parenthesis)
    if ((parenthesis === 'all') ||
        (this.trueExpr.type === 'OperatorNode') ||
        ((truePrecedence !== null) && (truePrecedence <= precedence))) {
      trueExpr = '(' + trueExpr + ')'
    }

    let falseExpr = this.falseExpr.toString(options)
    const falsePrecedence = getPrecedence(this.falseExpr, parenthesis)
    if ((parenthesis === 'all') ||
        (this.falseExpr.type === 'OperatorNode') ||
        ((falsePrecedence !== null) && (falsePrecedence <= precedence))) {
      falseExpr = '(' + falseExpr + ')'
    }
    return condition + ' ? ' + trueExpr + ' : ' + falseExpr
  }

  /**
   * Get a JSON representation of the node
   * @returns {Object}
   */
  ConditionalNode.prototype.toJSON = function () {
    return {
      mathjs: 'ConditionalNode',
      condition: this.condition,
      trueExpr: this.trueExpr,
      falseExpr: this.falseExpr
    }
  }

  /**
   * Instantiate an ConditionalNode from its JSON representation
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "ConditionalNode", "condition": ..., "trueExpr": ..., "falseExpr": ...}`,
   *                       where mathjs is optional
   * @returns {ConditionalNode}
   */
  ConditionalNode.fromJSON = function (json) {
    return new ConditionalNode(json.condition, json.trueExpr, json.falseExpr)
  }

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   */
  ConditionalNode.prototype.toHTML = function (options) {
    const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
    const precedence = getPrecedence(this, parenthesis)

    // Enclose Arguments in parentheses if they are an OperatorNode
    // or have lower or equal precedence
    // NOTE: enclosing all OperatorNodes in parentheses is a decision
    // purely based on aesthetics and readability
    let condition = this.condition.toHTML(options)
    const conditionPrecedence = getPrecedence(this.condition, parenthesis)
    if ((parenthesis === 'all') ||
        (this.condition.type === 'OperatorNode') ||
        ((conditionPrecedence !== null) && (conditionPrecedence <= precedence))) {
      condition = '<span class="math-parenthesis math-round-parenthesis">(</span>' + condition + '<span class="math-parenthesis math-round-parenthesis">)</span>'
    }

    let trueExpr = this.trueExpr.toHTML(options)
    const truePrecedence = getPrecedence(this.trueExpr, parenthesis)
    if ((parenthesis === 'all') ||
        (this.trueExpr.type === 'OperatorNode') ||
        ((truePrecedence !== null) && (truePrecedence <= precedence))) {
      trueExpr = '<span class="math-parenthesis math-round-parenthesis">(</span>' + trueExpr + '<span class="math-parenthesis math-round-parenthesis">)</span>'
    }

    let falseExpr = this.falseExpr.toHTML(options)
    const falsePrecedence = getPrecedence(this.falseExpr, parenthesis)
    if ((parenthesis === 'all') ||
        (this.falseExpr.type === 'OperatorNode') ||
        ((falsePrecedence !== null) && (falsePrecedence <= precedence))) {
      falseExpr = '<span class="math-parenthesis math-round-parenthesis">(</span>' + falseExpr + '<span class="math-parenthesis math-round-parenthesis">)</span>'
    }
    return condition + '<span class="math-operator math-conditional-operator">?</span>' + trueExpr + '<span class="math-operator math-conditional-operator">:</span>' + falseExpr
  }

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  ConditionalNode.prototype._toTex = function (options) {
    return '\\begin{cases} {' +
        this.trueExpr.toTex(options) + '}, &\\quad{\\text{if }\\;' +
        this.condition.toTex(options) +
        '}\\\\{' + this.falseExpr.toTex(options) +
        '}, &\\quad{\\text{otherwise}}\\end{cases}'
  }

  /**
   * Test whether a condition is met
   * @param {*} condition
   * @returns {boolean} true if condition is true or non-zero, else false
   */
  function testCondition (condition) {
    if (typeof condition === 'number' ||
        typeof condition === 'boolean' ||
        typeof condition === 'string') {
      return !!condition
    }

    if (condition) {
      if (isBigNumber(condition)) {
        return !condition.isZero()
      }

      if (isComplex(condition)) {
        return !!((condition.re || condition.im))
      }

      if (isUnit(condition)) {
        return !!condition.value
      }
    }

    if (condition === null || condition === undefined) {
      return false
    }

    throw new TypeError('Unsupported type of condition "' + typeOf(condition) + '"')
  }

  return ConditionalNode
}, { isClass: true, isNode: true })
