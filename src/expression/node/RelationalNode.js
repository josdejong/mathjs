'use strict'

const operators = require('../operators')
const latex = require('../../utils/latex')
const escape = require('../../utils/string').escape

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

    let self = this
    return function evalRelationalNode (scope, args, context) {
      let evalLhs

      let evalRhs = self.params[0]._compile(math, argNames)

      for (let i = 0; i < self.conditionals.length; i++) {
        evalLhs = evalRhs
        evalRhs = self.params[i + 1]._compile(math, argNames)
        var condFn = getSafeProperty(math, self.conditionals[i])
        if (!condFn(evalLhs(scope, args, context), evalRhs(scope, args, context))) {
          return false
        }
      }
      return true
    }
  }

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  RelationalNode.prototype.forEach = function (callback) {
    this.params.forEach((n, i) => callback(n, 'params[' + i + ']', this), this)
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
    return new RelationalNode(this.conditionals, this.params)
  }

  /**
   * Get string representation.
   * @param {Object} options
   * @return {string} str
   */
  RelationalNode.prototype._toString = function (options) {
    const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
    const precedence = operators.getPrecedence(this, parenthesis)

    const paramStrings = this.params.map(function (p, index) {
      let paramPrecedence = operators.getPrecedence(p, parenthesis)
      return (parenthesis === 'all' || (paramPrecedence !== null && paramPrecedence <= precedence))
        ? '(' + p.toString(options) + ')'
        : p.toString(options)
    })

    let operatorMap = {
      'equal': '==',
      'unequal': '!=',
      'smaller': '<',
      'larger': '>',
      'smallerEq': '<=',
      'largerEq': '>='
    }

    let ret = paramStrings[0]
    for (let i = 0; i < this.conditionals.length; i++) {
      ret += ' ' + operatorMap[this.conditionals[i]] + ' ' + paramStrings[i + 1]
    }

    return ret
  }

  /**
   * Get a JSON representation of the node
   * @returns {Object}
   */
  RelationalNode.prototype.toJSON = function () {
    return {
      mathjs: 'RelationalNode',
      conditionals: this.conditionals,
      params: this.params
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

    const paramStrings = this.params.map(function (p, index) {
      let paramPrecedence = operators.getPrecedence(p, parenthesis)
      return (parenthesis === 'all' || (paramPrecedence !== null && paramPrecedence <= precedence))
        ? '<span class="math-parenthesis math-round-parenthesis">(</span>' + p.toHTML(options) + '<span class="math-parenthesis math-round-parenthesis">)</span>'
        : p.toHTML(options)
    })

    let operatorMap = {
      'equal': '==',
      'unequal': '!=',
      'smaller': '<',
      'larger': '>',
      'smallerEq': '<=',
      'largerEq': '>='
    }

    let ret = paramStrings[0]
    for (let i = 0; i < this.conditionals.length; i++) {
      ret += '<span class="math-operator math-binary-operator math-explicit-binary-operator">' + escape(operatorMap[this.conditionals[i]]) + '</span>' + paramStrings[i + 1]
    }

    return ret
  }

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  RelationalNode.prototype._toTex = function (options) {
    const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
    const precedence = operators.getPrecedence(this, parenthesis)

    const paramStrings = this.params.map(function (p, index) {
      let paramPrecedence = operators.getPrecedence(p, parenthesis)
      return (parenthesis === 'all' || (paramPrecedence !== null && paramPrecedence <= precedence))
        ? '\\left(' + p.toString(options) + '\right)'
        : p.toString(options)
    })

    let ret = paramStrings[0]
    for (let i = 0; i < this.conditionals.length; i++) {
      ret += latex.operators[this.conditionals[i]] + paramStrings[i + 1]
    }

    return ret
  }

  return RelationalNode
}

exports.name = 'RelationalNode'
exports.path = 'expression.node'
exports.factory = factory
