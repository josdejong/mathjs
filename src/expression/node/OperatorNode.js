'use strict'

const latex = require('../../utils/latex')
const map = require('../../utils/array').map
const escape = require('../../utils/string').escape
const isSafeMethod = require('../../utils/customs').isSafeMethod
const getSafeProperty = require('../../utils/customs').getSafeProperty
const operators = require('../operators')

function factory (type, config, load, typed) {
  const Node = load(require('./Node'))

  /**
   * @constructor OperatorNode
   * @extends {Node}
   * An operator with two arguments, like 2+3
   *
   * @param {string} op           Operator name, for example '+'
   * @param {string} fn           Function name, for example 'add'
   * @param {Node[]} args         Operator arguments
   * @param {boolean} [implicit]  Is this an implicit multiplication?
   */
  function OperatorNode (op, fn, args, implicit) {
    if (!(this instanceof OperatorNode)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }

    // validate input
    if (typeof op !== 'string') {
      throw new TypeError('string expected for parameter "op"')
    }
    if (typeof fn !== 'string') {
      throw new TypeError('string expected for parameter "fn"')
    }
    if (!Array.isArray(args) || !args.every(type.isNode)) {
      throw new TypeError('Array containing Nodes expected for parameter "args"')
    }

    this.implicit = (implicit === true)
    this.op = op
    this.fn = fn
    this.args = args || []
  }

  OperatorNode.prototype = new Node()

  OperatorNode.prototype.type = 'OperatorNode'

  OperatorNode.prototype.isOperatorNode = true

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
  OperatorNode.prototype._compile = function (math, argNames) {
    // validate fn
    if (typeof this.fn !== 'string' || !isSafeMethod(math, this.fn)) {
      if (!math[this.fn]) {
        throw new Error('Function ' + this.fn + ' missing in provided namespace "math"')
      } else {
        throw new Error('No access to function "' + this.fn + '"')
      }
    }

    const fn = getSafeProperty(math, this.fn)
    const evalArgs = map(this.args, function (arg) {
      return arg._compile(math, argNames)
    })

    if (evalArgs.length === 1) {
      const evalArg0 = evalArgs[0]
      return function evalOperatorNode (scope, args, context) {
        return fn(evalArg0(scope, args, context))
      }
    } else if (evalArgs.length === 2) {
      const evalArg0 = evalArgs[0]
      const evalArg1 = evalArgs[1]
      return function evalOperatorNode (scope, args, context) {
        return fn(evalArg0(scope, args, context), evalArg1(scope, args, context))
      }
    } else {
      return function evalOperatorNode (scope, args, context) {
        return fn.apply(null, map(evalArgs, function (evalArg) {
          return evalArg(scope, args, context)
        }))
      }
    }
  }

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  OperatorNode.prototype.forEach = function (callback) {
    for (let i = 0; i < this.args.length; i++) {
      callback(this.args[i], 'args[' + i + ']', this)
    }
  }

  /**
   * Create a new OperatorNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {OperatorNode} Returns a transformed copy of the node
   */
  OperatorNode.prototype.map = function (callback) {
    const args = []
    for (let i = 0; i < this.args.length; i++) {
      args[i] = this._ifNode(callback(this.args[i], 'args[' + i + ']', this))
    }
    return new OperatorNode(this.op, this.fn, args, this.implicit)
  }

  /**
   * Create a clone of this node, a shallow copy
   * @return {OperatorNode}
   */
  OperatorNode.prototype.clone = function () {
    return new OperatorNode(this.op, this.fn, this.args.slice(0), this.implicit)
  }

  /**
   * Check whether this is an unary OperatorNode:
   * has exactly one argument, like `-a`.
   * @return {boolean} Returns true when an unary operator node, false otherwise.
   */
  OperatorNode.prototype.isUnary = function () {
    return this.args.length === 1
  }

  /**
   * Check whether this is a binary OperatorNode:
   * has exactly two arguments, like `a + b`.
   * @return {boolean} Returns true when a binary operator node, false otherwise.
   */
  OperatorNode.prototype.isBinary = function () {
    return this.args.length === 2
  }

  /**
   * Calculate which parentheses are necessary. Gets an OperatorNode
   * (which is the root of the tree) and an Array of Nodes
   * (this.args) and returns an array where 'true' means that an argument
   * has to be enclosed in parentheses whereas 'false' means the opposite.
   *
   * @param {OperatorNode} root
   * @param {string} parenthesis
   * @param {Node[]} args
   * @param {boolean} latex
   * @return {boolean[]}
   * @private
   */
  function calculateNecessaryParentheses (root, parenthesis, implicit, args, latex) {
    // precedence of the root OperatorNode
    const precedence = operators.getPrecedence(root, parenthesis)
    const associativity = operators.getAssociativity(root, parenthesis)

    if ((parenthesis === 'all') || ((args.length > 2) && (root.getIdentifier() !== 'OperatorNode:add') && (root.getIdentifier() !== 'OperatorNode:multiply'))) {
      const parens = args.map(function (arg) {
        switch (arg.getContent().type) { // Nodes that don't need extra parentheses
          case 'ArrayNode':
          case 'ConstantNode':
          case 'SymbolNode':
          case 'ParenthesisNode':
            return false
          default:
            return true
        }
      })
      return parens
    }

    let result
    switch (args.length) {
      case 0:
        result = []
        break

      case 1: // unary operators
        // precedence of the operand
        const operandPrecedence = operators.getPrecedence(args[0], parenthesis)

        // handle special cases for LaTeX, where some of the parentheses aren't needed
        if (latex && (operandPrecedence !== null)) {
          let operandIdentifier
          let rootIdentifier
          if (parenthesis === 'keep') {
            operandIdentifier = args[0].getIdentifier()
            rootIdentifier = root.getIdentifier()
          } else {
            // Ignore Parenthesis Nodes when not in 'keep' mode
            operandIdentifier = args[0].getContent().getIdentifier()
            rootIdentifier = root.getContent().getIdentifier()
          }
          if (operators.properties[precedence][rootIdentifier].latexLeftParens === false) {
            result = [false]
            break
          }

          if (operators.properties[operandPrecedence][operandIdentifier].latexParens === false) {
            result = [false]
            break
          }
        }

        if (operandPrecedence === null) {
          // if the operand has no defined precedence, no parens are needed
          result = [false]
          break
        }

        if (operandPrecedence <= precedence) {
          // if the operands precedence is lower, parens are needed
          result = [true]
          break
        }

        // otherwise, no parens needed
        result = [false]
        break

      case 2: // binary operators
        let lhsParens // left hand side needs parenthesis?
        // precedence of the left hand side
        const lhsPrecedence = operators.getPrecedence(args[0], parenthesis)
        // is the root node associative with the left hand side
        const assocWithLhs = operators.isAssociativeWith(root, args[0], parenthesis)

        if (lhsPrecedence === null) {
          // if the left hand side has no defined precedence, no parens are needed
          // FunctionNode for example
          lhsParens = false
        } else if ((lhsPrecedence === precedence) && (associativity === 'right') && !assocWithLhs) {
          // In case of equal precedence, if the root node is left associative
          // parens are **never** necessary for the left hand side.
          // If it is right associative however, parens are necessary
          // if the root node isn't associative with the left hand side
          lhsParens = true
        } else if (lhsPrecedence < precedence) {
          lhsParens = true
        } else {
          lhsParens = false
        }

        let rhsParens // right hand side needs parenthesis?
        // precedence of the right hand side
        const rhsPrecedence = operators.getPrecedence(args[1], parenthesis)
        // is the root node associative with the right hand side?
        const assocWithRhs = operators.isAssociativeWith(root, args[1], parenthesis)

        if (rhsPrecedence === null) {
          // if the right hand side has no defined precedence, no parens are needed
          // FunctionNode for example
          rhsParens = false
        } else if ((rhsPrecedence === precedence) && (associativity === 'left') && !assocWithRhs) {
          // In case of equal precedence, if the root node is right associative
          // parens are **never** necessary for the right hand side.
          // If it is left associative however, parens are necessary
          // if the root node isn't associative with the right hand side
          rhsParens = true
        } else if (rhsPrecedence < precedence) {
          rhsParens = true
        } else {
          rhsParens = false
        }

        // handle special cases for LaTeX, where some of the parentheses aren't needed
        if (latex) {
          let rootIdentifier
          let lhsIdentifier
          let rhsIdentifier
          if (parenthesis === 'keep') {
            rootIdentifier = root.getIdentifier()
            lhsIdentifier = root.args[0].getIdentifier()
            rhsIdentifier = root.args[1].getIdentifier()
          } else {
            // Ignore ParenthesisNodes when not in 'keep' mode
            rootIdentifier = root.getContent().getIdentifier()
            lhsIdentifier = root.args[0].getContent().getIdentifier()
            rhsIdentifier = root.args[1].getContent().getIdentifier()
          }

          if (lhsPrecedence !== null) {
            if (operators.properties[precedence][rootIdentifier].latexLeftParens === false) {
              lhsParens = false
            }

            if (operators.properties[lhsPrecedence][lhsIdentifier].latexParens === false) {
              lhsParens = false
            }
          }

          if (rhsPrecedence !== null) {
            if (operators.properties[precedence][rootIdentifier].latexRightParens === false) {
              rhsParens = false
            }

            if (operators.properties[rhsPrecedence][rhsIdentifier].latexParens === false) {
              rhsParens = false
            }
          }
        }

        result = [lhsParens, rhsParens]
        break

      default:
        if ((root.getIdentifier() === 'OperatorNode:add') || (root.getIdentifier() === 'OperatorNode:multiply')) {
          result = args.map(function (arg) {
            const argPrecedence = operators.getPrecedence(arg, parenthesis)
            const assocWithArg = operators.isAssociativeWith(root, arg, parenthesis)
            const argAssociativity = operators.getAssociativity(arg, parenthesis)
            if (argPrecedence === null) {
              // if the argument has no defined precedence, no parens are needed
              return false
            } else if ((precedence === argPrecedence) && (associativity === argAssociativity) && !assocWithArg) {
              return true
            } else if (argPrecedence < precedence) {
              return true
            }

            return false
          })
        }
        break
    }

    // handles an edge case of 'auto' parentheses with implicit multiplication of ConstantNode
    // In that case print parentheses for ParenthesisNodes even though they normally wouldn't be
    // printed.
    if ((args.length >= 2) && (root.getIdentifier() === 'OperatorNode:multiply') && root.implicit && (parenthesis === 'auto') && (implicit === 'hide')) {
      result = args.map(function (arg, index) {
        const isParenthesisNode = (arg.getIdentifier() === 'ParenthesisNode')
        if (result[index] || isParenthesisNode) { // put in parenthesis?
          return true
        }

        return false
      })
    }

    return result
  }

  /**
   * Get string representation.
   * @param {Object} options
   * @return {string} str
   */
  OperatorNode.prototype._toString = function (options) {
    const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
    const implicit = (options && options.implicit) ? options.implicit : 'hide'
    const args = this.args
    const parens = calculateNecessaryParentheses(this, parenthesis, implicit, args, false)

    if (args.length === 1) { // unary operators
      const assoc = operators.getAssociativity(this, parenthesis)

      let operand = args[0].toString(options)
      if (parens[0]) {
        operand = '(' + operand + ')'
      }

      if (assoc === 'right') { // prefix operator
        return this.op + operand
      } else if (assoc === 'left') { // postfix
        return operand + this.op
      }

      // fall back to postfix
      return operand + this.op
    } else if (args.length === 2) {
      let lhs = args[0].toString(options) // left hand side
      let rhs = args[1].toString(options) // right hand side
      if (parens[0]) { // left hand side in parenthesis?
        lhs = '(' + lhs + ')'
      }
      if (parens[1]) { // right hand side in parenthesis?
        rhs = '(' + rhs + ')'
      }

      if (this.implicit && (this.getIdentifier() === 'OperatorNode:multiply') && (implicit === 'hide')) {
        return lhs + ' ' + rhs
      }

      return lhs + ' ' + this.op + ' ' + rhs
    } else if ((args.length > 2) && ((this.getIdentifier() === 'OperatorNode:add') || (this.getIdentifier() === 'OperatorNode:multiply'))) {
      const stringifiedArgs = args.map(function (arg, index) {
        arg = arg.toString(options)
        if (parens[index]) { // put in parenthesis?
          arg = '(' + arg + ')'
        }

        return arg
      })

      if (this.implicit && (this.getIdentifier() === 'OperatorNode:multiply') && (implicit === 'hide')) {
        return stringifiedArgs.join(' ')
      }

      return stringifiedArgs.join(' ' + this.op + ' ')
    } else {
      // fallback to formatting as a function call
      return this.fn + '(' + this.args.join(', ') + ')'
    }
  }

  /**
   * Get a JSON representation of the node
   * @returns {Object}
   */
  OperatorNode.prototype.toJSON = function () {
    return {
      mathjs: 'OperatorNode',
      op: this.op,
      fn: this.fn,
      args: this.args,
      implicit: this.implicit
    }
  }

  /**
   * Instantiate an OperatorNode from its JSON representation
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "OperatorNode", "op": "+", "fn": "add", "args": [...], "implicit": false}`,
   *                       where mathjs is optional
   * @returns {OperatorNode}
   */
  OperatorNode.fromJSON = function (json) {
    return new OperatorNode(json.op, json.fn, json.args, json.implicit)
  }

  /**
   * Get HTML representation.
   * @param {Object} options
   * @return {string} str
   */
  OperatorNode.prototype.toHTML = function (options) {
    const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
    const implicit = (options && options.implicit) ? options.implicit : 'hide'
    const args = this.args
    const parens = calculateNecessaryParentheses(this, parenthesis, implicit, args, false)

    if (args.length === 1) { // unary operators
      const assoc = operators.getAssociativity(this, parenthesis)

      let operand = args[0].toHTML(options)
      if (parens[0]) {
        operand = '<span class="math-parenthesis math-round-parenthesis">(</span>' + operand + '<span class="math-parenthesis math-round-parenthesis">)</span>'
      }

      if (assoc === 'right') { // prefix operator
        return '<span class="math-operator math-unary-operator math-lefthand-unary-operator">' + escape(this.op) + '</span>' + operand
      } else if (assoc === 'left') { // postfix
        return '<span class="math-operator math-unary-operator math-righthand-unary-operator">' + escape(this.op) + '</span>' + operand
      }

      // fall back to postfix
      return '<span class="math-operator math-unary-operator math-righthand-unary-operator">' + escape(this.op) + '</span>' + operand
    } else if (args.length === 2) { // binary operatoes
      let lhs = args[0].toHTML(options) // left hand side
      let rhs = args[1].toHTML(options) // right hand side
      if (parens[0]) { // left hand side in parenthesis?
        lhs = '<span class="math-parenthesis math-round-parenthesis">(</span>' + lhs + '<span class="math-parenthesis math-round-parenthesis">)</span>'
      }
      if (parens[1]) { // right hand side in parenthesis?
        rhs = '<span class="math-parenthesis math-round-parenthesis">(</span>' + rhs + '<span class="math-parenthesis math-round-parenthesis">)</span>'
      }

      if (this.implicit && (this.getIdentifier() === 'OperatorNode:multiply') && (implicit === 'hide')) {
        return lhs + '<span class="math-operator math-binary-operator math-implicit-binary-operator"></span>' + rhs
      }

      return lhs + '<span class="math-operator math-binary-operator math-explicit-binary-operator">' + escape(this.op) + '</span>' + rhs
    } else {
      const stringifiedArgs = args.map(function (arg, index) {
        arg = arg.toHTML(options)
        if (parens[index]) { // put in parenthesis?
          arg = '<span class="math-parenthesis math-round-parenthesis">(</span>' + arg + '<span class="math-parenthesis math-round-parenthesis">)</span>'
        }

        return arg
      })

      if ((args.length > 2) && ((this.getIdentifier() === 'OperatorNode:add') || (this.getIdentifier() === 'OperatorNode:multiply'))) {
        if (this.implicit && (this.getIdentifier() === 'OperatorNode:multiply') && (implicit === 'hide')) {
          return stringifiedArgs.join('<span class="math-operator math-binary-operator math-implicit-binary-operator"></span>')
        }

        return stringifiedArgs.join('<span class="math-operator math-binary-operator math-explicit-binary-operator">' + escape(this.op) + '</span>')
      } else {
        // fallback to formatting as a function call
        return '<span class="math-function">' + escape(this.fn) + '</span><span class="math-paranthesis math-round-parenthesis">(</span>' + stringifiedArgs.join('<span class="math-separator">,</span>') + '<span class="math-paranthesis math-round-parenthesis">)</span>'
      }
    }
  }

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  OperatorNode.prototype._toTex = function (options) {
    const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
    const implicit = (options && options.implicit) ? options.implicit : 'hide'
    const args = this.args
    const parens = calculateNecessaryParentheses(this, parenthesis, implicit, args, true)
    let op = latex.operators[this.fn]
    op = typeof op === 'undefined' ? this.op : op // fall back to using this.op

    if (args.length === 1) { // unary operators
      const assoc = operators.getAssociativity(this, parenthesis)

      let operand = args[0].toTex(options)
      if (parens[0]) {
        operand = `\\left(${operand}\\right)`
      }

      if (assoc === 'right') { // prefix operator
        return op + operand
      } else if (assoc === 'left') { // postfix operator
        return operand + op
      }

      // fall back to postfix
      return operand + op
    } else if (args.length === 2) { // binary operators
      const lhs = args[0] // left hand side
      let lhsTex = lhs.toTex(options)
      if (parens[0]) {
        lhsTex = `\\left(${lhsTex}\\right)`
      }

      const rhs = args[1] // right hand side
      let rhsTex = rhs.toTex(options)
      if (parens[1]) {
        rhsTex = `\\left(${rhsTex}\\right)`
      }

      // handle some exceptions (due to the way LaTeX works)
      let lhsIdentifier
      if (parenthesis === 'keep') {
        lhsIdentifier = lhs.getIdentifier()
      } else {
        // Ignore ParenthesisNodes if in 'keep' mode
        lhsIdentifier = lhs.getContent().getIdentifier()
      }
      switch (this.getIdentifier()) {
        case 'OperatorNode:divide':
          // op contains '\\frac' at this point
          return op + '{' + lhsTex + '}' + '{' + rhsTex + '}'
        case 'OperatorNode:pow':
          lhsTex = '{' + lhsTex + '}'
          rhsTex = '{' + rhsTex + '}'
          switch (lhsIdentifier) {
            case 'ConditionalNode': //
            case 'OperatorNode:divide':
              lhsTex = `\\left(${lhsTex}\\right)`
          }
          break
        case 'OperatorNode:multiply':
          if (this.implicit && (implicit === 'hide')) {
            return lhsTex + '~' + rhsTex
          }
      }
      return lhsTex + op + rhsTex
    } else if ((args.length > 2) && ((this.getIdentifier() === 'OperatorNode:add') || (this.getIdentifier() === 'OperatorNode:multiply'))) {
      const texifiedArgs = args.map(function (arg, index) {
        arg = arg.toTex(options)
        if (parens[index]) {
          arg = `\\left(${arg}\\right)`
        }
        return arg
      })

      if ((this.getIdentifier() === 'OperatorNode:multiply') && this.implicit) {
        return texifiedArgs.join('~')
      }

      return texifiedArgs.join(op)
    } else {
      // fall back to formatting as a function call
      // as this is a fallback, it doesn't use
      // fancy function names
      return '\\mathrm{' + this.fn + '}\\left(' +
          args.map(function (arg) {
            return arg.toTex(options)
          }).join(',') + '\\right)'
    }
  }

  /**
   * Get identifier.
   * @return {string}
   */
  OperatorNode.prototype.getIdentifier = function () {
    return this.type + ':' + this.fn
  }

  return OperatorNode
}

exports.name = 'OperatorNode'
exports.path = 'expression.node'
exports.factory = factory
