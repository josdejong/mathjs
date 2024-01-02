import { getPrecedence } from '../operators.js'
import { escape } from '../../utils/string.js'
import { getSafeProperty } from '../../utils/customs.js'
import { latexOperators } from '../../utils/latex.js'
import { factory } from '../../utils/factory.js'

const name = 'RelationalNode'
const dependencies = [
  'Node'
]

export const createRelationalNode = /* #__PURE__ */ factory(name, dependencies, ({ Node }) => {
  const operatorMap = {
    equal: '==',
    unequal: '!=',
    smaller: '<',
    larger: '>',
    smallerEq: '<=',
    largerEq: '>='
  }

  class RelationalNode extends Node {
    /**
     * A node representing a chained conditional expression, such as 'x > y > z'
     *
     * @param {String[]} conditionals
     *     An array of conditional operators used to compare the parameters
     * @param {Node[]} params
     *     The parameters that will be compared
     *
     * @constructor RelationalNode
     * @extends {Node}
     */
    constructor (conditionals, params) {
      super()
      if (!Array.isArray(conditionals)) { throw new TypeError('Parameter conditionals must be an array') }
      if (!Array.isArray(params)) { throw new TypeError('Parameter params must be an array') }
      if (conditionals.length !== params.length - 1) {
        throw new TypeError(
          'Parameter params must contain exactly one more element ' +
            'than parameter conditionals')
      }

      this.conditionals = conditionals
      this.params = params
    }

    static name = name
    get type () { return name }
    get isRelationalNode () { return true }

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
      const self = this

      const compiled = this.params.map(p => p._compile(math, argNames))

      return function evalRelationalNode (scope, args, context) {
        let evalLhs
        let evalRhs = compiled[0](scope, args, context)

        for (let i = 0; i < self.conditionals.length; i++) {
          evalLhs = evalRhs
          evalRhs = compiled[i + 1](scope, args, context)
          const condFn = getSafeProperty(math, self.conditionals[i])
          if (!condFn(evalLhs, evalRhs)) {
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
    forEach (callback) {
      this.params.forEach((n, i) => callback(n, 'params[' + i + ']', this), this)
    }

    /**
     * Create a new RelationalNode whose children are the results of calling
     * the provided callback function for each child of the original node.
     * @param {function(child: Node, path: string, parent: Node): Node} callback
     * @returns {RelationalNode} Returns a transformed copy of the node
     */
    map (callback) {
      return new RelationalNode(
        this.conditionals.slice(),
        this.params.map(
          (n, i) => this._ifNode(callback(n, 'params[' + i + ']', this)), this))
    }

    /**
     * Create a clone of this node, a shallow copy
     * @return {RelationalNode}
     */
    clone () {
      return new RelationalNode(this.conditionals, this.params)
    }

    /**
     * Get string representation.
     * @param {Object} options
     * @return {string} str
     */
    _toString (options) {
      const parenthesis =
          (options && options.parenthesis) ? options.parenthesis : 'keep'
      const precedence =
          getPrecedence(this, parenthesis, options && options.implicit)

      const paramStrings = this.params.map(function (p, index) {
        const paramPrecedence =
            getPrecedence(p, parenthesis, options && options.implicit)
        return (parenthesis === 'all' ||
                (paramPrecedence !== null && paramPrecedence <= precedence))
          ? '(' + p.toString(options) + ')'
          : p.toString(options)
      })

      let ret = paramStrings[0]
      for (let i = 0; i < this.conditionals.length; i++) {
        ret += ' ' + operatorMap[this.conditionals[i]]
        ret += ' ' + paramStrings[i + 1]
      }

      return ret
    }

    /**
     * Get a JSON representation of the node
     * @returns {Object}
     */
    toJSON () {
      return {
        mathjs: name,
        conditionals: this.conditionals,
        params: this.params
      }
    }

    /**
     * Instantiate a RelationalNode from its JSON representation
     * @param {Object} json
     *     An object structured like
     *     `{"mathjs": "RelationalNode", "conditionals": ..., "params": ...}`,
     *     where mathjs is optional
     * @returns {RelationalNode}
     */
    static fromJSON (json) {
      return new RelationalNode(json.conditionals, json.params)
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

      const paramStrings = this.params.map(function (p, index) {
        const paramPrecedence =
            getPrecedence(p, parenthesis, options && options.implicit)
        return (parenthesis === 'all' ||
                (paramPrecedence !== null && paramPrecedence <= precedence))
          ? ('<span class="math-parenthesis math-round-parenthesis">(</span>' +
             p.toHTML(options) +
             '<span class="math-parenthesis math-round-parenthesis">)</span>')
          : p.toHTML(options)
      })

      let ret = paramStrings[0]
      for (let i = 0; i < this.conditionals.length; i++) {
        ret += '<span class="math-operator math-binary-operator ' +
          'math-explicit-binary-operator">' +
          escape(operatorMap[this.conditionals[i]]) + '</span>' +
          paramStrings[i + 1]
      }

      return ret
    }

    /**
     * Get LaTeX representation
     * @param {Object} options
     * @return {string} str
     */
    _toTex (options) {
      const parenthesis =
          (options && options.parenthesis) ? options.parenthesis : 'keep'
      const precedence =
          getPrecedence(this, parenthesis, options && options.implicit)

      const paramStrings = this.params.map(function (p, index) {
        const paramPrecedence =
            getPrecedence(p, parenthesis, options && options.implicit)
        return (parenthesis === 'all' ||
                (paramPrecedence !== null && paramPrecedence <= precedence))
          ? '\\left(' + p.toTex(options) + '\right)'
          : p.toTex(options)
      })

      let ret = paramStrings[0]
      for (let i = 0; i < this.conditionals.length; i++) {
        ret += latexOperators[this.conditionals[i]] + paramStrings[i + 1]
      }

      return ret
    }
  }

  return RelationalNode
}, { isClass: true, isNode: true })
