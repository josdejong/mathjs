'use strict'

const operators = require('../operators')

function factory (type, config, load, typed) {
  const Node = load(require('./Node'))
  const getSafeProperty = require('../../utils/customs').getSafeProperty

  /**
   * A node representing a chained conditional expression, such as 'x > y > z'
   *
   * @param {String[]} conditionals   An array of conditional operators used to compare the parameters
   * @param {Node[]} params   The parameters that will be compared
   *
   * @constructor RelationalNode
   * @extends {Node}
   */
  function RelationalNode (conditionals, params) {
    if (!(this instanceof RelationalNode)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }
    if (!Array.isArray(conditionals)) throw new TypeError('Parameter conditionals must be an array')
    if (!Array.isArray(params)) throw new TypeError('Parameter params must be an array')

    
    this.conditionals = conditionals
    this.params = params
    console.log("Creating RelationalNode");
    console.log(this.conditionals, this.params);
  }

  RelationalNode.prototype = new Node()

  RelationalNode.prototype.type = 'RelationalNode'

  RelationalNode.prototype.isRelationalNode = true

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
  RelationalNode.prototype._compile = function (math, argNames) {

    // Step 0: let rhs = params[0]
    // Step 1: let lhs = params[0], rhs = params[1]
    // Step 2: Evaluate lhs conditionals[0] rhs.
    // If true, let rhs = params[2], lhs = rhs

    let self = this;
    return function evalRelationalNode (scope, args, context) {

      
      let evalLhs, 
          evalRhs = self.params[0]._compile(math, argNames);
      
      for(let i=0; i<self.conditionals.length; i++) {
        evalLhs = evalRhs;
        evalRhs = self.params[i+1]._compile(math, argNames);
        console.log("Testing " + evalLhs(scope, args, context) + " " + self.conditionals[i] + " " + evalRhs(scope, args, context));
        var condFn = getSafeProperty(math, self.conditionals[i]);
        if(!condFn(evalLhs(scope, args, context), evalRhs(scope, args, context))) {
          return false;
        }
      }
      return true;
    }

    const evalCondition = this.condition._compile(math, argNames)
    const evalTrueExpr = this.trueExpr._compile(math, argNames)
    const evalFalseExpr = this.falseExpr._compile(math, argNames)

    return function evalRelationalNode (scope, args, context) {
      return testCondition(evalCondition(scope, args, context))
        ? evalTrueExpr(scope, args, context)
        : evalFalseExpr(scope, args, context)
    }
  }

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  RelationalNode.prototype.forEach = function (callback) {
    this.params.forEach((n, i) => callback(n, 'params[' + i + ']', this), this);
  }

  /**
   * Create a new RelationalNode having its childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {RelationalNode} Returns a transformed copy of the node
   */
  RelationalNode.prototype.map = function (callback) {
    return new RelationalNode(this.conditionals.slice(), this.params.map((n, i) => this._ifNode(callback(n, 'params[' + i + ']', this)), this))
  }

  /**
   * Create a clone of this node, a shallow copy
   * @return {RelationalNode}
   */
  RelationalNode.prototype.clone = function () {
    return new RelationalNode(this.conditionals, this.params);
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  RelationalNode.prototype._toString = function (options) {
    const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
    const precedence = operators.getPrecedence(this, parenthesis)

    // Enclose Arguments in parentheses if they are an OperatorNode
    // or have lower or equal precedence
    // NOTE: enclosing all OperatorNodes in parentheses is a decision
    // purely based on aesthetics and readability
    let condition = this.condition.toString(options)
    const conditionPrecedence = operators.getPrecedence(this.condition, parenthesis)
    if ((parenthesis === 'all') ||
        (this.condition.type === 'OperatorNode') ||
        ((conditionPrecedence !== null) && (conditionPrecedence <= precedence))) {
      condition = '(' + condition + ')'
    }

    let trueExpr = this.trueExpr.toString(options)
    const truePrecedence = operators.getPrecedence(this.trueExpr, parenthesis)
    if ((parenthesis === 'all') ||
        (this.trueExpr.type === 'OperatorNode') ||
        ((truePrecedence !== null) && (truePrecedence <= precedence))) {
      trueExpr = '(' + trueExpr + ')'
    }

    let falseExpr = this.falseExpr.toString(options)
    const falsePrecedence = operators.getPrecedence(this.falseExpr, parenthesis)
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
  RelationalNode.prototype.toJSON = function () {
    return {
      mathjs: 'RelationalNode',
      conditionals: this.conditionals,
      params: this.params,
    }
  }

  /**
   * Instantiate a RelationalNode from its JSON representation
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "RelationalNode", "condition": ..., "trueExpr": ..., "falseExpr": ...}`,
   *                       where mathjs is optional
   * @returns {RelationalNode}
   */
  RelationalNode.fromJSON = function (json) {
    return new RelationalNode(json.conditionals, json.params)
  }

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   */
  RelationalNode.prototype.toHTML = function (options) {
    const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
    const precedence = operators.getPrecedence(this, parenthesis)

    // Enclose Arguments in parentheses if they are an OperatorNode
    // or have lower or equal precedence
    // NOTE: enclosing all OperatorNodes in parentheses is a decision
    // purely based on aesthetics and readability
    let condition = this.condition.toHTML(options)
    const conditionPrecedence = operators.getPrecedence(this.condition, parenthesis)
    if ((parenthesis === 'all') ||
        (this.condition.type === 'OperatorNode') ||
        ((conditionPrecedence !== null) && (conditionPrecedence <= precedence))) {
      condition = '<span class="math-parenthesis math-round-parenthesis">(</span>' + condition + '<span class="math-parenthesis math-round-parenthesis">)</span>'
    }

    let trueExpr = this.trueExpr.toHTML(options)
    const truePrecedence = operators.getPrecedence(this.trueExpr, parenthesis)
    if ((parenthesis === 'all') ||
        (this.trueExpr.type === 'OperatorNode') ||
        ((truePrecedence !== null) && (truePrecedence <= precedence))) {
      trueExpr = '<span class="math-parenthesis math-round-parenthesis">(</span>' + trueExpr + '<span class="math-parenthesis math-round-parenthesis">)</span>'
    }

    let falseExpr = this.falseExpr.toHTML(options)
    const falsePrecedence = operators.getPrecedence(this.falseExpr, parenthesis)
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
  RelationalNode.prototype._toTex = function (options) {
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
      if (type.isBigNumber(condition)) {
        return !condition.isZero()
      }

      if (type.isComplex(condition)) {
        return !!((condition.re || condition.im))
      }

      if (type.isUnit(condition)) {
        return !!condition.value
      }
    }

    if (condition === null || condition === undefined) {
      return false
    }

    throw new TypeError('Unsupported type of condition "' + mathTypeOf(condition) + '"')
  }

  return RelationalNode
}

exports.name = 'RelationalNode'
exports.path = 'expression.node'
exports.factory = factory
