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
   *     resolve(expr, scope)
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

  // First we set up core implementations for different node types
  // Note the 'within' argument that they all take is not documented, as it is
  // used only for internal cycle detection
  const resolvers = {
    SymbolNode: typed.referToSelf(self =>
      (symbol, scope, within = new Set()) => {
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
    OperatorNode: typed.referToSelf(self =>
      (operator, scope, within = new Set()) => {
        const args = operator.args.map(arg => self(arg, scope, within))
        // Has its own implementation because we don't recurse on the op also
        return new OperatorNode(
          operator.op, operator.fn, args, operator.implicit)
      }
    ),
    FunctionNode: typed.referToSelf(self =>
      (func, scope, within = new Set()) => {
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
    Node: typed.referToSelf(self =>
      (node, scope, within = new Set()) => {
        // The generic case: just recurse
        return node.map(child => self(child, scope, within))
      }
    )
  }

  // Now expand with all the possible argument types:
  const nodeTypes = Object.keys(resolvers)
  const scopeType = ', Map | null | undefined'
  const objType = ', Object'
  const withinType = ', Set'
  for (const nodeType of nodeTypes) {
    resolvers[nodeType + scopeType] = resolvers[nodeType]
    resolvers[nodeType + scopeType + withinType] = resolvers[nodeType]
    resolvers[nodeType + objType] = typed.referToSelf(self =>
      (node, objScope) => self(node, createMap(objScope))
    )
    // Don't need to do nodeType + objType + withinType since we only get
    // an obj instead of a Map scope in the outermost call, which has no
    // "within" argument.
  }

  // Now add the array and matrix types:
  Object.assign(resolvers, {
    'Array | Matrix': typed.referToSelf(self => A => A.map(n => self(n))),
    'Array | Matrix, null | undefined': typed.referToSelf(
      self => A => A.map(n => self(n))),
    'Array | Matrix, Map': typed.referToSelf(
      self => (A, scope) => A.map(n => self(n, scope))),
    'Array, Object': typed.referTo(
      'Array,Map', selfAM => (A, scope) => selfAM(A, createMap(scope))),
    'Matrix, Object': typed.referTo(
      'Matrix,Map', selfMM => (A, scope) => selfMM(A, createMap(scope)))
  })

  return typed('resolve', resolvers)
})
