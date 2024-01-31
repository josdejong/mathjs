import { isBigNumber, isComplex, isNode, isUnit, typeOf } from '../../utils/is.js'
import { factory } from '../../utils/factory.js'
import { getPrecedence } from '../operators.js'

const name = 'ConditionalNode'
const dependencies = [
  'Node'
]

export const createConditionalNode = /* #__PURE__ */ factory(name, dependencies, ({ Node }) => {
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

  class ConditionalNode extends Node {
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
    constructor (condition, trueExpr, falseExpr) {
      super()
      if (!isNode(condition)) { throw new TypeError('Parameter condition must be a Node') }
      if (!isNode(trueExpr)) { throw new TypeError('Parameter trueExpr must be a Node') }
      if (!isNode(falseExpr)) { throw new TypeError('Parameter falseExpr must be a Node') }

      this.condition = condition
      this.trueExpr = trueExpr
      this.falseExpr = falseExpr
    }

    static name = name
    get type () { return name }
    get isConditionalNode () { return true }

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
    forEach (callback) {
      callback(this.condition, 'condition', this)
      callback(this.trueExpr, 'trueExpr', this)
      callback(this.falseExpr, 'falseExpr', this)
    }

    /**
     * Create a new ConditionalNode whose children are the results of calling
     * the provided callback function for each child of the original node.
     * @param {function(child: Node, path: string, parent: Node): Node} callback
     * @returns {ConditionalNode} Returns a transformed copy of the node
     */
    map (callback) {
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
    clone () {
      return new ConditionalNode(this.condition, this.trueExpr, this.falseExpr)
    }

    /**
     * Get string representation
     * @param {Object} options
     * @return {string} str
     */
    _toString (options) {
      const parenthesis =
          (options && options.parenthesis) ? options.parenthesis : 'keep'
      const precedence =
          getPrecedence(this, parenthesis, options && options.implicit)

      // Enclose Arguments in parentheses if they are an OperatorNode
      // or have lower or equal precedence
      // NOTE: enclosing all OperatorNodes in parentheses is a decision
      // purely based on aesthetics and readability
      let condition = this.condition.toString(options)
      const conditionPrecedence =
          getPrecedence(this.condition, parenthesis, options && options.implicit)
      if ((parenthesis === 'all') ||
          (this.condition.type === 'OperatorNode') ||
          ((conditionPrecedence !== null) &&
              (conditionPrecedence <= precedence))) {
        condition = '(' + condition + ')'
      }

      let trueExpr = this.trueExpr.toString(options)
      const truePrecedence =
          getPrecedence(this.trueExpr, parenthesis, options && options.implicit)
      if ((parenthesis === 'all') ||
          (this.trueExpr.type === 'OperatorNode') ||
          ((truePrecedence !== null) && (truePrecedence <= precedence))) {
        trueExpr = '(' + trueExpr + ')'
      }

      let falseExpr = this.falseExpr.toString(options)
      const falsePrecedence =
          getPrecedence(this.falseExpr, parenthesis, options && options.implicit)
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
    toJSON () {
      return {
        mathjs: name,
        condition: this.condition,
        trueExpr: this.trueExpr,
        falseExpr: this.falseExpr
      }
    }

    /**
     * Instantiate an ConditionalNode from its JSON representation
     * @param {Object} json
     *     An object structured like
     *     ```
     *     {"mathjs": "ConditionalNode",
     *      "condition": ...,
     *      "trueExpr": ...,
     *      "falseExpr": ...}
     *     ```
     *     where mathjs is optional
     * @returns {ConditionalNode}
     */
    static fromJSON (json) {
      return new ConditionalNode(json.condition, json.trueExpr, json.falseExpr)
    }

    /**
     * Get HTML representation
     * @param {Object} options
     * @return {string} str
     */
    _toHTML (options) {
      const parenthesis =
          (options && options.parenthesis) ? options.parenthesis : 'keep'
      const precedence =
          getPrecedence(this, parenthesis, options && options.implicit)

      // Enclose Arguments in parentheses if they are an OperatorNode
      // or have lower or equal precedence
      // NOTE: enclosing all OperatorNodes in parentheses is a decision
      // purely based on aesthetics and readability
      let condition = this.condition.toHTML(options)
      const conditionPrecedence =
          getPrecedence(this.condition, parenthesis, options && options.implicit)
      if ((parenthesis === 'all') ||
          (this.condition.type === 'OperatorNode') ||
          ((conditionPrecedence !== null) &&
              (conditionPrecedence <= precedence))) {
        condition =
          '<span class="math-parenthesis math-round-parenthesis">(</span>' +
          condition +
          '<span class="math-parenthesis math-round-parenthesis">)</span>'
      }

      let trueExpr = this.trueExpr.toHTML(options)
      const truePrecedence =
          getPrecedence(this.trueExpr, parenthesis, options && options.implicit)
      if ((parenthesis === 'all') ||
          (this.trueExpr.type === 'OperatorNode') ||
          ((truePrecedence !== null) && (truePrecedence <= precedence))) {
        trueExpr =
          '<span class="math-parenthesis math-round-parenthesis">(</span>' +
          trueExpr +
          '<span class="math-parenthesis math-round-parenthesis">)</span>'
      }

      let falseExpr = this.falseExpr.toHTML(options)
      const falsePrecedence =
          getPrecedence(this.falseExpr, parenthesis, options && options.implicit)
      if ((parenthesis === 'all') ||
          (this.falseExpr.type === 'OperatorNode') ||
          ((falsePrecedence !== null) && (falsePrecedence <= precedence))) {
        falseExpr =
          '<span class="math-parenthesis math-round-parenthesis">(</span>' +
          falseExpr +
          '<span class="math-parenthesis math-round-parenthesis">)</span>'
      }
      return condition +
        '<span class="math-operator math-conditional-operator">?</span>' +
        trueExpr +
        '<span class="math-operator math-conditional-operator">:</span>' +
        falseExpr
    }

    /**
     * Get LaTeX representation
     * @param {Object} options
     * @return {string} str
     */
    _toTex (options) {
      return '\\begin{cases} {' +
        this.trueExpr.toTex(options) + '}, &\\quad{\\text{if }\\;' +
        this.condition.toTex(options) +
        '}\\\\{' + this.falseExpr.toTex(options) +
        '}, &\\quad{\\text{otherwise}}\\end{cases}'
    }
  }

  return ConditionalNode
}, { isClass: true, isNode: true })
