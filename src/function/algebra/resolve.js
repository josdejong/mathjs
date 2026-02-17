import { createMap } from '../../utils/map.js'
import { isNode } from '../../utils/is.js'
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
  return typed('resolve', {
    // First, the specific implementations that handle different Node types:
    // (Note these take a "within" argument for cycle detection that is not
    //  part of the documented operation, as it is used only for internal
    //  cycle detection.)
    'SymbolNode, Map | null | undefined, Set': typed.referToSelf(self =>
      (symbol, scope, within) => {
        // The key case for resolve; most other nodes we just recurse.
        if (!scope) return symbol
        if (within.has(symbol.name)) {
          const variables = Array.from(within).join(', ')
          throw new ReferenceError(
            `recursive loop of variable definitions among {${variables}}`
          )
        }
        const value = scope.get(symbol.name)
        if (isNode(value)) {
          const nextWithin = new Set(within)
          nextWithin.add(symbol.name)
          return self(value, scope, nextWithin)
        }
        if (typeof value === 'number') {
          return parse(String(value)) // ?? is this just to get the currently
          // defined behavior for number literals, i.e. maybe numbers are
          // currently being coerced to BigNumber?
        }
        if (value !== undefined) {
          return new ConstantNode(value)
        }
        return symbol
      }
    ),
    'OperatorNode, Map | null | undefined, Set': typed.referToSelf(self =>
      (operator, scope, within) => {
        const args = operator.args.map(arg => self(arg, scope, within))
        // Has its own implementation because we don't recurse on the op also
        return new OperatorNode(
          operator.op, operator.fn, args, operator.implicit)
      }
    ),
    'FunctionNode, Map | null | undefined, Set': typed.referToSelf(self =>
      (func, scope, within) => {
        const args = func.args.map(arg => self(arg, scope, within))
        // The only reason this has a separate implementation of its own
        // is that we don't resolve the func.name itself. But is that
        // really right? If the tree being resolved was the parse of
        // 'f(x,y)' and 'f' is defined in the scope, is it clear that we
        // don't want to replace the function symbol, too? Anyhow, leaving
        // the implementation as it was before the refactoring.
        return new FunctionNode(func.name, args)
      }
    ),
    'Node, Map | null | undefined, Set': typed.referToSelf(self =>
      (node, scope, within) => {
        // The generic case: just recurse
        return node.map(child => self(child, scope, within))
      }
    ),
    // Second, generic forwarders to deal with optional arguments and different types:
    Node: typed.referToSelf(
      self => node => self(node, undefined, new Set())
    ),
    'Node, Map | null | undefined': typed.referToSelf(
      self => (node, scope) => self(node, scope, new Set())
    ),
    'Node, Object': typed.referToSelf(
      self => (node, objScope) => self(node, createMap(objScope), new Set())
    ),
    // And finally, the array/matrix handlers:
    'Array | Matrix': typed.referToSelf(
      self => A => A.map(n => self(n, undefined, new Set()))
    ),
    'Array | Matrix, Map | null | undefined': typed.referToSelf(
      self => (A, scope) => A.map(n => self(n, scope, new Set()))
    ),
    'Array | Matrix, Object': typed.referToSelf(
      self => (A, objScope) => A.map(n => self(n, createMap(objScope), new Set()))
    ),
    'Array | Matrix, Map | null | undefined, Set': typed.referToSelf(
      self => (A, scope, within) => A.map(n => self(n, scope, within))
    )
  })
})
