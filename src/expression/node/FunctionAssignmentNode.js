'use strict'

const keywords = require('../keywords')
const escape = require('../../utils/string').escape
const forEach = require('../../utils/array').forEach
const join = require('../../utils/array').join
const latex = require('../../utils/latex')
const operators = require('../operators')
const setSafeProperty = require('../../utils/customs').setSafeProperty

function factory (type, config, load, typed) {
  const Node = load(require('./Node'))

  /**
   * @constructor FunctionAssignmentNode
   * @extends {Node}
   * Function assignment
   *
   * @param {string} name           Function name
   * @param {string[] | Array.<{name: string, type: string}>} params
   *                                Array with function parameter names, or an
   *                                array with objects containing the name
   *                                and type of the parameter
   * @param {Node} expr             The function expression
   */
  function FunctionAssignmentNode (name, params, expr) {
    if (!(this instanceof FunctionAssignmentNode)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }

    // validate input
    if (typeof name !== 'string') throw new TypeError('String expected for parameter "name"')
    if (!Array.isArray(params)) throw new TypeError('Array containing strings or objects expected for parameter "params"')
    if (!type.isNode(expr)) throw new TypeError('Node expected for parameter "expr"')
    if (name in keywords) throw new Error('Illegal function name, "' + name + '" is a reserved keyword')

    this.name = name
    this.params = params.map(function (param) {
      return (param && param.name) || param
    })
    this.types = params.map(function (param) {
      return (param && param.type) || 'any'
    })
    this.expr = expr
  }

  FunctionAssignmentNode.prototype = new Node()

  FunctionAssignmentNode.prototype.type = 'FunctionAssignmentNode'

  FunctionAssignmentNode.prototype.isFunctionAssignmentNode = true

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
  FunctionAssignmentNode.prototype._compile = function (math, argNames) {
    const childArgNames = Object.create(argNames)
    forEach(this.params, function (param) {
      childArgNames[param] = true
    })

    // compile the function expression with the child args
    const evalExpr = this.expr._compile(math, childArgNames)
    const name = this.name
    const params = this.params
    const signature = join(this.types, ',')
    const syntax = name + '(' + join(this.params, ', ') + ')'

    return function evalFunctionAssignmentNode (scope, args, context) {
      const signatures = {}
      signatures[signature] = function () {
        const childArgs = Object.create(args)

        for (let i = 0; i < params.length; i++) {
          childArgs[params[i]] = arguments[i]
        }

        return evalExpr(scope, childArgs, context)
      }
      const fn = typed(name, signatures)
      fn.syntax = syntax

      setSafeProperty(scope, name, fn)

      return fn
    }
  }

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  FunctionAssignmentNode.prototype.forEach = function (callback) {
    callback(this.expr, 'expr', this)
  }

  /**
   * Create a new FunctionAssignmentNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {FunctionAssignmentNode} Returns a transformed copy of the node
   */
  FunctionAssignmentNode.prototype.map = function (callback) {
    const expr = this._ifNode(callback(this.expr, 'expr', this))

    return new FunctionAssignmentNode(this.name, this.params.slice(0), expr)
  }

  /**
   * Create a clone of this node, a shallow copy
   * @return {FunctionAssignmentNode}
   */
  FunctionAssignmentNode.prototype.clone = function () {
    return new FunctionAssignmentNode(this.name, this.params.slice(0), this.expr)
  }

  /**
   * Is parenthesis needed?
   * @param {Node} node
   * @param {Object} parenthesis
   * @private
   */
  function needParenthesis (node, parenthesis) {
    const precedence = operators.getPrecedence(node, parenthesis)
    const exprPrecedence = operators.getPrecedence(node.expr, parenthesis)

    return (parenthesis === 'all') ||
      ((exprPrecedence !== null) && (exprPrecedence <= precedence))
  }

  /**
   * get string representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionAssignmentNode.prototype._toString = function (options) {
    const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
    let expr = this.expr.toString(options)
    if (needParenthesis(this, parenthesis)) {
      expr = '(' + expr + ')'
    }
    return this.name + '(' + this.params.join(', ') + ') = ' + expr
  }

  /**
   * Get a JSON representation of the node
   * @returns {Object}
   */
  FunctionAssignmentNode.prototype.toJSON = function () {
    const types = this.types

    return {
      mathjs: 'FunctionAssignmentNode',
      name: this.name,
      params: this.params.map(function (param, index) {
        return {
          name: param,
          type: types[index]
        }
      }),
      expr: this.expr
    }
  }

  /**
   * Instantiate an FunctionAssignmentNode from its JSON representation
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "FunctionAssignmentNode", name: ..., params: ..., expr: ...}`,
   *                       where mathjs is optional
   * @returns {FunctionAssignmentNode}
   */
  FunctionAssignmentNode.fromJSON = function (json) {
    return new FunctionAssignmentNode(json.name, json.params, json.expr)
  }

  /**
   * get HTML representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionAssignmentNode.prototype.toHTML = function (options) {
    const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
    const params = []
    for (let i = 0; i < this.params.length; i++) {
      params.push('<span class="math-symbol math-parameter">' + escape(this.params[i]) + '</span>')
    }
    let expr = this.expr.toHTML(options)
    if (needParenthesis(this, parenthesis)) {
      expr = '<span class="math-parenthesis math-round-parenthesis">(</span>' + expr + '<span class="math-parenthesis math-round-parenthesis">)</span>'
    }
    return '<span class="math-function">' + escape(this.name) + '</span>' + '<span class="math-parenthesis math-round-parenthesis">(</span>' + params.join('<span class="math-separator">,</span>') + '<span class="math-parenthesis math-round-parenthesis">)</span><span class="math-operator math-assignment-operator math-variable-assignment-operator math-binary-operator">=</span>' + expr
  }

  /**
   * get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionAssignmentNode.prototype._toTex = function (options) {
    const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
    let expr = this.expr.toTex(options)
    if (needParenthesis(this, parenthesis)) {
      expr = `\\left(${expr}\\right)`
    }

    return '\\mathrm{' + this.name +
        '}\\left(' + this.params.map(latex.toSymbol).join(',') + '\\right):=' + expr
  }

  return FunctionAssignmentNode
}
exports.name = 'FunctionAssignmentNode'
exports.path = 'expression.node'
exports.factory = factory
