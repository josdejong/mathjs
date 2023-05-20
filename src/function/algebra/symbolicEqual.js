import { isConstantNode } from '../../utils/is.js'
import { factory } from '../../utils/factory.js'

const name = 'symbolicEqual'
const dependencies = [
  'parse',
  'simplify',
  'typed',
  'OperatorNode'
]

export const createSymbolicEqual = /* #__PURE__ */ factory(name, dependencies, ({
  parse,
  simplify,
  typed,
  OperatorNode
}) => {
  /**
   * Attempts to determine if two expressions are symbolically equal, i.e.
   * one is the result of valid algebraic manipulations on the other.
   * Currently, this simply checks if the difference of the two expressions
   * simplifies down to 0. So there are two important caveats:
   * 1. whether two expressions are symbolically equal depends on the
   *     manipulations allowed. Therefore, this function takes an optional
   *     third argument, which are the options that control the behavior
   *     as documented for the `simplify()` function.
   * 2. it is in general intractable to find the minimal simplification of
   *     an arbitrarily complicated expression. So while a `true` value
   *     of `symbolicEqual` ensures that the two expressions can be manipulated
   *     to match each other, a `false` value does not absolutely rule this out.
   *
   * Syntax:
   *
   *     math.symbolicEqual(expr1, expr2)
   *     math.symbolicEqual(expr1, expr2, options)
   *
   * Examples:
   *
   *     math.symbolicEqual('x*y', 'y*x') // Returns true
   *     math.symbolicEqual('x*y', 'y*x', {context: {multiply: {commutative: false}}}) // Returns false
   *     math.symbolicEqual('x/y', '(y*x^(-1))^(-1)') // Returns true
   *     math.symbolicEqual('abs(x)','x') // Returns false
   *     math.symbolicEqual('abs(x)','x', simplify.positiveContext) // Returns true
   *
   * See also:
   *
   *     simplify, evaluate
   *
   * @param {Node|string} expr1  The first expression to compare
   * @param {Node|string} expr2  The second expression to compare
   * @param {Object} [options] Optional option object, passed to simplify
   * @returns {boolean}
   *     Returns true if a valid manipulation making the expressions equal
   *     is found.
   */
  function _symbolicEqual (e1, e2, options = {}) {
    const diff = new OperatorNode('-', 'subtract', [e1, e2])
    const simplified = simplify(diff, {}, options)
    return (isConstantNode(simplified) && !(simplified.value))
  }

  return typed(name, {
    'Node, Node': _symbolicEqual,
    'Node, Node, Object': _symbolicEqual
  })
})
