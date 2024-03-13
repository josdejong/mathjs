import { isAccessorNode, isArrayNode, isConstantNode, isFunctionNode, isIndexNode, isObjectNode, isOperatorNode } from '../../utils/is.js'
import { getOperator } from '../../expression/operators.js'
import { createUtil } from './simplify/util.js'
import { factory } from '../../utils/factory.js'

const name = 'simplifyCore'
const dependencies = [
  'typed',
  'parse',
  'equal',
  'isZero',
  'add',
  'subtract',
  'multiply',
  'divide',
  'pow',
  'AccessorNode',
  'ArrayNode',
  'ConstantNode',
  'FunctionNode',
  'IndexNode',
  'ObjectNode',
  'OperatorNode',
  'ParenthesisNode',
  'SymbolNode'
]

export const createSimplifyCore = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  parse,
  equal,
  isZero,
  add,
  subtract,
  multiply,
  divide,
  pow,
  AccessorNode,
  ArrayNode,
  ConstantNode,
  FunctionNode,
  IndexNode,
  ObjectNode,
  OperatorNode,
  ParenthesisNode,
  SymbolNode
}) => {
  const node0 = new ConstantNode(0)
  const node1 = new ConstantNode(1)
  const nodeT = new ConstantNode(true)
  const nodeF = new ConstantNode(false)
  // test if a node will always have a boolean value (true/false)
  // not sure if this list is complete
  function isAlwaysBoolean (node) {
    return isOperatorNode(node) && ['and', 'not', 'or'].includes(node.op)
  }

  const { hasProperty, isCommutative } =
    createUtil({ FunctionNode, OperatorNode, SymbolNode })
  /**
   * simplifyCore() performs single pass simplification suitable for
   * applications requiring ultimate performance. To roughly summarize,
   * it handles cases along the lines of simplifyConstant() but where
   * knowledge of a single argument is sufficient to determine the value.
   * In contrast, simplify() extends simplifyCore() with additional passes
   * to provide deeper simplification (such as gathering like terms).
   *
   * Specifically, simplifyCore:
   *
   * * Converts all function calls with operator equivalents to their
   *   operator forms.
   * * Removes operators or function calls that are guaranteed to have no
   *   effect (such as unary '+').
   * * Removes double unary '-', '~', and 'not'
   * * Eliminates addition/subtraction of 0 and multiplication/division/powers
   *   by 1 or 0.
   * * Converts addition of a negation into subtraction.
   * * Eliminates logical operations with constant true or false leading
   *   arguments.
   * * Puts constants on the left of a product, if multiplication is
   *   considered commutative by the options (which is the default)
   *
   * Syntax:
   *
   *     math.simplifyCore(expr)
   *     math.simplifyCore(expr, options)
   *
   * Examples:
   *
   *     const f = math.parse('2 * 1 * x ^ (1 - 0)')
   *     math.simplifyCore(f)                          // Node "2 * x"
   *     math.simplify('2 * 1 * x ^ (1 - 0)', [math.simplifyCore]) // Node "2 * x"
   *
   * See also:
   *
   *     simplify, simplifyConstant, resolve, derivative
   *
   * @param {Node | string} node
   *     The expression to be simplified
   * @param {Object} options
   *     Simplification options, as per simplify()
   * @return {Node} Returns expression with basic simplifications applied
   */
  function _simplifyCore (nodeToSimplify, options = {}) {
    const context = options ? options.context : undefined
    if (hasProperty(nodeToSimplify, 'trivial', context)) {
      // This node does nothing if it has only one argument, so if so,
      // return that argument simplified
      if (isFunctionNode(nodeToSimplify) && nodeToSimplify.args.length === 1) {
        return _simplifyCore(nodeToSimplify.args[0], options)
      }
      // For other node types, we try the generic methods
      let simpChild = false
      let childCount = 0
      nodeToSimplify.forEach(c => {
        ++childCount
        if (childCount === 1) {
          simpChild = _simplifyCore(c, options)
        }
      })
      if (childCount === 1) {
        return simpChild
      }
    }
    let node = nodeToSimplify
    if (isFunctionNode(node)) {
      const op = getOperator(node.name)
      if (op) {
        // Replace FunctionNode with a new OperatorNode
        if (node.args.length > 2 && hasProperty(node, 'associative', context)) {
          // unflatten into binary operations since that's what simplifyCore handles
          while (node.args.length > 2) {
            const last = node.args.pop()
            const seclast = node.args.pop()
            node.args.push(new OperatorNode(op, node.name, [last, seclast]))
          }
        }
        node = new OperatorNode(op, node.name, node.args)
      } else {
        return new FunctionNode(
          _simplifyCore(node.fn), node.args.map(n => _simplifyCore(n, options)))
      }
    }
    if (isOperatorNode(node) && node.isUnary()) {
      const a0 = _simplifyCore(node.args[0], options)

      if (node.op === '~') { // bitwise not
        if (isOperatorNode(a0) && a0.isUnary() && a0.op === '~') {
          return a0.args[0]
        }
      }
      if (node.op === 'not') { // logical not
        if (isOperatorNode(a0) && a0.isUnary() && a0.op === 'not') {
          // Has the effect of turning the argument into a boolean
          // So can only eliminate the double negation if
          // the inside is already boolean
          if (isAlwaysBoolean(a0.args[0])) {
            return a0.args[0]
          }
        }
      }
      let finish = true
      if (node.op === '-') { // unary minus
        if (isOperatorNode(a0)) {
          if (a0.isBinary() && a0.fn === 'subtract') {
            node = new OperatorNode('-', 'subtract', [a0.args[1], a0.args[0]])
            finish = false // continue to process the new binary node
          }
          if (a0.isUnary() && a0.op === '-') {
            return a0.args[0]
          }
        }
      }
      if (finish) return new OperatorNode(node.op, node.fn, [a0])
    }
    if (isOperatorNode(node) && node.isBinary()) {
      const a0 = _simplifyCore(node.args[0], options)
      let a1 = _simplifyCore(node.args[1], options)

      if (node.op === '+') {
        if (isConstantNode(a0) && isZero(a0.value)) {
          return a1
        }
        if (isConstantNode(a1) && isZero(a1.value)) {
          return a0
        }
        if (isOperatorNode(a1) && a1.isUnary() && a1.op === '-') {
          a1 = a1.args[0]
          node = new OperatorNode('-', 'subtract', [a0, a1])
        }
      }
      if (node.op === '-') {
        if (isOperatorNode(a1) && a1.isUnary() && a1.op === '-') {
          return _simplifyCore(
            new OperatorNode('+', 'add', [a0, a1.args[0]]), options)
        }
        if (isConstantNode(a0) && isZero(a0.value)) {
          return _simplifyCore(new OperatorNode('-', 'unaryMinus', [a1]))
        }
        if (isConstantNode(a1) && isZero(a1.value)) {
          return a0
        }
        return new OperatorNode(node.op, node.fn, [a0, a1])
      }
      if (node.op === '*') {
        if (isConstantNode(a0)) {
          if (isZero(a0.value)) {
            return node0
          } else if (equal(a0.value, 1)) {
            return a1
          }
        }
        if (isConstantNode(a1)) {
          if (isZero(a1.value)) {
            return node0
          } else if (equal(a1.value, 1)) {
            return a0
          }
          if (isCommutative(node, context)) {
            return new OperatorNode(node.op, node.fn, [a1, a0], node.implicit) // constants on left
          }
        }
        return new OperatorNode(node.op, node.fn, [a0, a1], node.implicit)
      }
      if (node.op === '/') {
        if (isConstantNode(a0) && isZero(a0.value)) {
          return node0
        }
        if (isConstantNode(a1) && equal(a1.value, 1)) {
          return a0
        }
        return new OperatorNode(node.op, node.fn, [a0, a1])
      }
      if (node.op === '^') {
        if (isConstantNode(a1)) {
          if (isZero(a1.value)) {
            return node1
          } else if (equal(a1.value, 1)) {
            return a0
          }
        }
      }
      if (node.op === 'and') {
        if (isConstantNode(a0)) {
          if (a0.value) {
            if (isAlwaysBoolean(a1)) return a1
            if (isConstantNode(a1)) {
              return a1.value ? nodeT : nodeF
            }
          } else {
            return nodeF
          }
        }
        if (isConstantNode(a1)) {
          if (a1.value) {
            if (isAlwaysBoolean(a0)) return a0
          } else {
            return nodeF
          }
        }
      }
      if (node.op === 'or') {
        if (isConstantNode(a0)) {
          if (a0.value) {
            return nodeT
          } else {
            if (isAlwaysBoolean(a1)) return a1
          }
        }
        if (isConstantNode(a1)) {
          if (a1.value) {
            return nodeT
          } else {
            if (isAlwaysBoolean(a0)) return a0
          }
        }
      }
      return new OperatorNode(node.op, node.fn, [a0, a1])
    }
    if (isOperatorNode(node)) {
      return new OperatorNode(
        node.op, node.fn, node.args.map(a => _simplifyCore(a, options)))
    }
    if (isArrayNode(node)) {
      return new ArrayNode(node.items.map(n => _simplifyCore(n, options)))
    }
    if (isAccessorNode(node)) {
      return new AccessorNode(
        _simplifyCore(node.object, options), _simplifyCore(node.index, options))
    }
    if (isIndexNode(node)) {
      return new IndexNode(
        node.dimensions.map(n => _simplifyCore(n, options)))
    }
    if (isObjectNode(node)) {
      const newProps = {}
      for (const prop in node.properties) {
        newProps[prop] = _simplifyCore(node.properties[prop], options)
      }
      return new ObjectNode(newProps)
    }
    // cannot simplify
    return node
  }

  return typed(name, { Node: _simplifyCore, 'Node,Object': _simplifyCore })
})
