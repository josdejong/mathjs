import { factory } from '../../utils/factory.js'
import {
  isParenthesisNode, isOperatorNode, isFunctionNode
} from '../../utils/is.js'

const name = 'reassociate'
const dependencies = ['typed', 'operatorIs']

export const createReassociate = /* #__PURE__ */ factory(name, dependencies, ({
  typed, operatorIs
}) => {
  /**
   * Alters an expression tree by reconfiguring the calls to associative
   * operators, if any occur therein. The exact nature of the reconfiguration
   * depends on value of the `direction` property in the options argument,
   * which defaults to `flat`. With that value, all subtrees consisting
   * exclusively of the same associative operator are "flattened" into single
   * calls to that operator with multiple arguments. Conversely, when
   * `direction` is either `left` or `right`, calls to associative operators
   * with more than two arguments are converted into a sequence of binary
   * calls, associated to the left or right, respectively.
   *
   * By default, this method clones the expression tree that it is called on.
   * You may specify `inplace: true` in the options to have it perform the
   * same operation without cloning, but **note** that this changes the node
   * argument by side effect and may introduce aliasing within the expression
   * tree. This option is provided only for efficiency in critical loops;
   * in ordinary usage, prefer the default `inplace: false`.
   *
   * The optional `context` argument is passed to `operatorIs` to determine
   * which operators are associative.
   *
   * Syntax:
   *
   *  math.reassociate(node)
   *  math.reassociate(node, context)
   *  math.reassociate(node, context, options)
   *
   * Examples:
   *
   *  const flat = math.reassociate(math.parse('3 + 4 + 5 + 6'))
   *  flat.toString({parenthesis: 'all'})  // '3 + 4 + 5 + 6' ...
   *  const ctxt = math.simplify.defaultContext
   *  const left = math.reassociate(flat, ctxt, { direction: 'left' })
   *  left.toString({parenthesis: 'all'})  // '((3 + 4) + 5) + 6' ...
   *  const rght = math.reassociate(flat, ctxt, { direction: 'right'})
   *  rght.toString({parenthesis: 'all'})  // '3 + (4 + (5 + 6))' ...
   *  math.reassociate(rght, ctxt, { inplace: true })
   *  rght.toString({parenthesis: 'all'})  // '3 + 4 + 5 + 6'
   *    // WARNING: rght was changed in place in the las call to reassociate
   *
   * See also:
   *
   *   operatorIs, simplify
   *
   * History:
   *
   *   v15.3  moved to top level, merging flatten, unflattenr, and unflattenl
   *          from simplify.utils
   *
   * @param {Node} node  The expression tree to reconfigure
   * @param {Context} [context=defaultContext]  The context that
   *   determines associativity
   * @param {Object} [options={ direction: 'flat', inplace: false }] Specifies
   *   the desired association and whether to operate in place
   * @return {Node}  A node with associative calls reconfigured
   */
  return typed(name, {
    Node: _reassoc,
    'Node, Object': _reassoc,
    'Node, undefined': _reassoc,
    'Node, Object, Object': _reassoc,
    'Node, Object, undefined': _reassoc,
    'Node, undefined, Object': _reassoc,
    'Node, undefined, undefined': _reassoc
  })

  function _reassoc (node, context, options) {
    if (!options?.direction) {
      options = Object.assign({ direction: 'flat' }, options)
    }
    if (!(options.inplace)) node = node.clone()
    if (isParenthesisNode(node)) {
      node.content = _reassoc(node.content, context, options)
      return node
    }
    if (!node.args || node.args.length === 0) return node
    node.args = node.args.map(child => _reassoc(child, context, options))
    if (!operatorIs(node, 'associative', context)) return node
    // OK, we need to do one of three things:
    if (options.direction.startsWith('f')) {
      for (let i = node.args.length - 1; i >= 0; --i) {
        let child = node.args[i]
        while (isParenthesisNode(child)) child = child.content
        if (sameOperator(node, child)) node.args.splice(i, 1, ...child.args)
      }
      return node
    }
    if (options.direction.startsWith('r')) {
      while (node.args.length > 2) {
        const rr = node.args.pop()
        const last = node.args.length - 1
        const newLast = node.clone()
        newLast.args = [node.args[last], rr]
        node.args[last] = newLast
      }
      return node
    }
    // Remaining case: 'left'
    while (node.args.length > 2) {
      const ll = node.args.shift()
      const newFirst = node.clone()
      newFirst.args = [ll, node.args[0]]
      node.args[0] = newFirst
    }
    return node
  }

  function sameOperator (opNode, child) {
    if (!(isOperatorNode(child) || isFunctionNode(child))) return false
    const opName = isOperatorNode(opNode) ? opNode.fn : opNode.name
    const childName = isOperatorNode(child) ? child.fn : child.name
    return opName && opName === childName
  }
})
