import { factory } from '../../utils/factory.js'
import {
  isFunctionNode, isOperatorNode, isParenthesisNode
} from '../../utils/is.js'
import { defaultContext } from '../../function/algebra/simplify/util.js'
import { hasOwnProperty } from '../../utils/object.js'

const name = 'operatorIs'
const dependencies = ['typed']
const defaultName = 'defaultF'

export const createOperatorIs = /* #__PURE__ */ factory(name, dependencies, ({
  typed
}) => {
  /**
   * Report a mathematical property of an operator.
   * Mathematical operations may be associative or commutative, with their
   * familar meanings from school: an operator · is associative if always
   * a · (b · c) = (a · b) · c and commutative if always a · b = b · a. There
   * are other, less familiar properties: we say an operator is "total" if
   * it has a well-defined value no matter what the values of its operands
   * are (for example, sqrt on the real numbers, if Complex numbers are not
   * in use, is not total because negative numbers have no sqrt). And we say
   * an operation is "trival" if applying it to a single argument has
   * no effect. For example, add() -- the function behind the + operator --
   * is trivial in this sense because add(x) always produces x.
   *
   * In any case, for a variety of reasons, such as facilitating the
   * simplification of symbolic expressions, mathjs tracks which of these
   * properties hold for each operator. The operatorIs() function provides
   * access to this information, which may also depend on a "context" --
   * an object describing operator properties.
   *
   * Syntax:
   *
   *    math.operatorIs(node, property)
   *    math.operatorIs(opName, property)
   *    math.operatorIs(node, property, context)
   *    math.operatorIs(opName, property, context)
   *
   * Examples:
   *
   *    math.operatorIs(math.parse('2+5'), 'associative') // returns true
   *    math.operatorIs('subtract', 'commutative')        // returns false
   *    math.operatorIs('subtract', 'total', math.simplify.positiveContext)
   *                                                      // returns false
   * See also:
   *
   *    simplify
   *
   * History:
   *
   *    v15.3  moved to top level from simplify.utils.hasProperty
   *
   * @param {Node | string} op  The operator being queried
   * @param {string} property  The property being queried
   * @param {Context} [context = simplify.defaultContext]
   *    An object encoding properties of operators
   * @return {boolean}  Whether op has the given property in context
   */
  return typed(name, {
    'Node | string, string': _hasProperty,
    'Node | string, string, Object | undefined': _hasProperty
  })

  function _hasProperty (nodeOrName, property, context = defaultContext) {
    let name = defaultName
    if (typeof nodeOrName === 'string') {
      name = nodeOrName
    } else if (isOperatorNode(nodeOrName)) {
      name = nodeOrName.fn.toString()
    } else if (isFunctionNode(nodeOrName)) {
      name = nodeOrName.name
    } else if (isParenthesisNode(nodeOrName)) {
      name = 'paren'
    }
    if (hasOwnProperty(context, name)) {
      const properties = context[name]
      if (hasOwnProperty(properties, property)) {
        return properties[property]
      }
      if (hasOwnProperty(defaultContext, name)) {
        return defaultContext[name][property]
      }
    }
    if (hasOwnProperty(context, defaultName)) {
      const properties = context[defaultName]
      if (hasOwnProperty(properties, property)) {
        return properties[property]
      }
      return defaultContext[defaultName][property]
    }
    /* name not found in context and context has no global default */
    /* So use default context. */
    if (hasOwnProperty(defaultContext, name)) {
      const properties = defaultContext[name]
      if (hasOwnProperty(properties, property)) {
        return properties[property]
      }
    }
    return defaultContext[defaultName][property]
  }
})
