import { factory } from '../../utils/factory.js'
import { createUtil } from '../../function/algebra/simplify/util.js'

const name = 'flattenAssociation'
const dependencies = [
  'typed', 'FunctionNode', 'OperatorNode', 'SymbolNode', 'operatorIs'
]

const cFA = /* #__PURE__ */ factory(name, dependencies, ({
  typed, FunctionNode, OperatorNode, SymbolNode, operatorIs
}) => {
  const { allChildren } = createUtil({
    FunctionNode, OperatorNode, SymbolNode, operatorIs
  })

  /**
   * Collapse all associative subtrees of calls to the same operator
   * within a Node (expression tree) into a single call to that operator
   * with multiple arguments.
   *
   * Note that Parenthesis nodes will break up the detection of such
   * call subtrees, so it is best to remove them before calling this method.
   *
   * Note that this method clones the expression tree that it is called on,
   * so that it will not change the original tree by side effect.
   *
   * Syntax:
   *
   *   math.flattenAssociation(node)
   *   math.flattenAssociation(node, context)
   *
   * Examples:
   *
   *   const flat = math.flattenAssociation(math.parse('3 + 4 + 5'))
   *   flat.toString({parenthesis: all})  // '3 + 4 + 5'
   *     // no parens because flat is now a single node with three children
   *
   *   const node = math.parse('3 / 4 / 5')
   *   const tree = math.flattenAssociation(node, math.simplify.realContext)
   *   tree.toString({parenthesis: 'all'})  // '(3 / 4) / 5'
   *     // parens because no flattening occurred as divide is not associative
   *
   * See also:
   *
   *   simplify, simplifyConstant
   *
   * History:
   *
   *   v15.3  moved to top level from simplify.utils.flatten
   *
   * @param {Node} node  The expression tree to flatten
   * @param {Context} context  The context to use to determine associativity
   * @return {Node}  A clone of node, as flattened as possible
   */
  return typed(name, {
    Node: _flatten,
    'Node, Object | undefined': _flatten
  })

  function _flatten (node, context) {
    node = node.clone()
    if (!node.args || node.args.length === 0) {
      return node
    }
    node.args = allChildren(node, context).map(
      child => _flatten(child, context))
    return node
  }
})

export { cFA as createFlattenAssociation }
