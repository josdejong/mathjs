import { createMap } from '../../utils/map.js'
import { isFunctionNode, isNode, isOperatorNode, isParenthesisNode, isSymbolNode } from '../../utils/is.js'
import { factory } from '../../utils/factory.js'

const name = 'resolve'
const dependencies = [
  'typed',
  'parse',
  'ConstantNode',
  'FunctionNode',
  'OperatorNode',
  'ParenthesisNode'
]

export const createResolve = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  parse,
  ConstantNode,
  FunctionNode,
  OperatorNode,
  ParenthesisNode
}) => {
  /**
   * resolve(expr, scope) replaces variable nodes with their scoped values
   *
   * Syntax:
   *
   *     math.resolve(expr, scope)
   *
   * Examples:
   *
   *     math.resolve('x + y', {x:1, y:2})           // Node '1 + 2'
   *     math.resolve(math.parse('x+y'), {x:1, y:2}) // Node '1 + 2'
   *     math.simplify('x+y', {x:2, y: math.parse('x+x')}).toString() // "6"
   *
   * See also:
   *
   *     simplify, evaluate
   *
   * @param {Node | Node[]} node
   *     The expression tree (or trees) to be simplified
   * @param {Object} scope
   *     Scope specifying variables to be resolved
   * @return {Node | Node[]} Returns `node` with variables recursively substituted.
   * @throws {ReferenceError}
   *     If there is a cyclic dependency among the variables in `scope`,
   *     resolution is impossible and a ReferenceError is thrown.
   */
  function _resolve (node, scope, within = new Set()) { // note `within`:
    // `within` is not documented, since it is for internal cycle
    // detection only
    if (!scope) {
      return node
    }
    if (isSymbolNode(node)) {
      if (within.has(node.name)) {
        const variables = Array.from(within).join(', ')
        throw new ReferenceError(
          `recursive loop of variable definitions among {${variables}}`
        )
      }
      const value = scope.get(node.name)
      if (isNode(value)) {
        const nextWithin = new Set(within)
        nextWithin.add(node.name)
        return _resolve(value, scope, nextWithin)
      } else if (typeof value === 'number') {
        return parse(String(value))
      } else if (value !== undefined) {
        return new ConstantNode(value)
      } else {
        return node
      }
    } else if (isOperatorNode(node)) {
      const args = node.args.map(function (arg) {
        return _resolve(arg, scope, within)
      })
      return new OperatorNode(node.op, node.fn, args, node.implicit)
    } else if (isParenthesisNode(node)) {
      return new ParenthesisNode(_resolve(node.content, scope, within))
    } else if (isFunctionNode(node)) {
      const args = node.args.map(function (arg) {
        return _resolve(arg, scope, within)
      })
      return new FunctionNode(node.name, args)
    }

    // Otherwise just recursively resolve any children (might also work
    // for some of the above special cases)
    return node.map(child => _resolve(child, scope, within))
  }

  return typed('resolve', {
    Node: _resolve,
    'Node, Map | null | undefined': _resolve,
    'Node, Object': (n, scope) => _resolve(n, createMap(scope)),
    // For arrays and matrices, we map `self` rather than `_resolve`
    // because resolve is fairly expensive anyway, and this way
    // we get nice error messages if one entry in the array has wrong type.
    'Array | Matrix': typed.referToSelf(self => A => A.map(n => self(n))),
    'Array | Matrix, null | undefined': typed.referToSelf(
      self => A => A.map(n => self(n))),
    'Array, Object': typed.referTo(
      'Array,Map', selfAM => (A, scope) => selfAM(A, createMap(scope))),
    'Matrix, Object': typed.referTo(
      'Matrix,Map', selfMM => (A, scope) => selfMM(A, createMap(scope))),
    'Array | Matrix, Map': typed.referToSelf(
      self => (A, scope) => A.map(n => self(n, scope)))
  })
})
