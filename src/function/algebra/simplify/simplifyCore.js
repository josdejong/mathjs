'use strict'

function factory (type, config, load, typed, math) {
  const equal = load(require('../../relational/equal'))
  const isZero = load(require('../../utils/isZero'))
  const add = load(require('../../arithmetic/add'))
  const subtract = load(require('../../arithmetic/subtract'))
  const multiply = load(require('../../arithmetic/multiply'))
  const divide = load(require('../../arithmetic/divide'))
  const pow = load(require('../../arithmetic/pow'))

  const ConstantNode = math.expression.node.ConstantNode
  const OperatorNode = math.expression.node.OperatorNode
  const FunctionNode = math.expression.node.FunctionNode
  const ParenthesisNode = math.expression.node.ParenthesisNode

  const node0 = new ConstantNode(0)
  const node1 = new ConstantNode(1)

  /**
   * simplifyCore() performs single pass simplification suitable for
   * applications requiring ultimate performance. In contrast, simplify()
   * extends simplifyCore() with additional passes to provide deeper
   * simplification.
   *
   * Syntax:
   *
   *     simplify.simplifyCore(expr)
   *
   * Examples:
   *
   *     const f = math.parse('2 * 1 * x ^ (2 - 1)')
   *     math.simplify.simpifyCore(f)                          // Node {2 * x}
   *     math.simplify('2 * 1 * x ^ (2 - 1)', [math.simplify.simpifyCore]) // Node {2 * x}
   *
   * See also:
   *
   *     derivative
   *
   * @param {Node} node
   *     The expression to be simplified
   */
  function simplifyCore (node) {
    if (type.isOperatorNode(node) && node.isUnary()) {
      const a0 = simplifyCore(node.args[0])

      if (node.op === '+') { // unary plus
        return a0
      }

      if (node.op === '-') { // unary minus
        if (type.isOperatorNode(a0)) {
          if (a0.isUnary() && a0.op === '-') {
            return a0.args[0]
          } else if (a0.isBinary() && a0.fn === 'subtract') {
            return new OperatorNode('-', 'subtract', [a0.args[1], a0.args[0]])
          }
        }
        return new OperatorNode(node.op, node.fn, [a0])
      }
    } else if (type.isOperatorNode(node) && node.isBinary()) {
      const a0 = simplifyCore(node.args[0])
      const a1 = simplifyCore(node.args[1])

      if (node.op === '+') {
        if (type.isConstantNode(a0)) {
          if (isZero(a0.value)) {
            return a1
          } else if (type.isConstantNode(a1)) {
            return new ConstantNode(add(a0.value, a1.value))
          }
        }
        if (type.isConstantNode(a1) && isZero(a1.value)) {
          return a0
        }
        if (type.isOperatorNode(a1) && a1.isUnary() && a1.op === '-') {
          return new OperatorNode('-', 'subtract', [a0, a1.args[0]])
        }
        return new OperatorNode(node.op, node.fn, a1 ? [a0, a1] : [a0])
      } else if (node.op === '-') {
        if (type.isConstantNode(a0) && a1) {
          if (type.isConstantNode(a1)) {
            return new ConstantNode(subtract(a0.value, a1.value))
          } else if (isZero(a0.value)) {
            return new OperatorNode('-', 'unaryMinus', [a1])
          }
        }
        // if (node.fn === "subtract" && node.args.length === 2) {
        if (node.fn === 'subtract') {
          if (type.isConstantNode(a1) && isZero(a1.value)) {
            return a0
          }
          if (type.isOperatorNode(a1) && a1.isUnary() && a1.op === '-') {
            return simplifyCore(new OperatorNode('+', 'add', [a0, a1.args[0]]))
          }
          return new OperatorNode(node.op, node.fn, [a0, a1])
        }
      } else if (node.op === '*') {
        if (type.isConstantNode(a0)) {
          if (isZero(a0.value)) {
            return node0
          } else if (equal(a0.value, 1)) {
            return a1
          } else if (type.isConstantNode(a1)) {
            return new ConstantNode(multiply(a0.value, a1.value))
          }
        }
        if (type.isConstantNode(a1)) {
          if (isZero(a1.value)) {
            return node0
          } else if (equal(a1.value, 1)) {
            return a0
          } else if (type.isOperatorNode(a0) && a0.isBinary() && a0.op === node.op) {
            const a00 = a0.args[0]
            if (type.isConstantNode(a00)) {
              const a00a1 = new ConstantNode(multiply(a00.value, a1.value))
              return new OperatorNode(node.op, node.fn, [a00a1, a0.args[1]], node.implicit) // constants on left
            }
          }
          return new OperatorNode(node.op, node.fn, [a1, a0], node.implicit) // constants on left
        }
        return new OperatorNode(node.op, node.fn, [a0, a1], node.implicit)
      } else if (node.op === '/') {
        if (type.isConstantNode(a0)) {
          if (isZero(a0.value)) {
            return node0
          } else if (type.isConstantNode(a1) &&
                      (equal(a1.value, 1) || equal(a1.value, 2) || equal(a1.value, 4))) {
            return new ConstantNode(divide(a0.value, a1.value))
          }
        }
        return new OperatorNode(node.op, node.fn, [a0, a1])
      } else if (node.op === '^') {
        if (type.isConstantNode(a1)) {
          if (isZero(a1.value)) {
            return node1
          } else if (equal(a1.value, 1)) {
            return a0
          } else {
            if (type.isConstantNode(a0)) {
              // fold constant
              return new ConstantNode(pow(a0.value, a1.value))
            } else if (type.isOperatorNode(a0) && a0.isBinary() && a0.op === '^') {
              const a01 = a0.args[1]
              if (type.isConstantNode(a01)) {
                return new OperatorNode(node.op, node.fn, [
                  a0.args[0],
                  new ConstantNode(multiply(a01.value, a1.value))
                ])
              }
            }
          }
        }
        return new OperatorNode(node.op, node.fn, [a0, a1])
      }
    } else if (type.isParenthesisNode(node)) {
      const c = simplifyCore(node.content)
      if (type.isParenthesisNode(c) || type.isSymbolNode(c) || type.isConstantNode(c)) {
        return c
      }
      return new ParenthesisNode(c)
    } else if (type.isFunctionNode(node)) {
      const args = node.args
        .map(simplifyCore)
        .map(function (arg) {
          return type.isParenthesisNode(arg) ? arg.content : arg
        })
      return new FunctionNode(simplifyCore(node.fn), args)
    } else {
      // cannot simplify
    }
    return node
  }

  return simplifyCore
}

exports.math = true
exports.name = 'simplifyCore'
exports.path = 'algebra.simplify'
exports.factory = factory
