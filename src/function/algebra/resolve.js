import { createMap } from '../../utils/map.js'
import { factory } from '../../utils/factory.js'

const name = 'resolve'
const dependencies = [
  'typed'
]

export const createResolve = /* #__PURE__ */ factory(name, dependencies, ({
  typed
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

    return node.resolve(scope, within)
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
