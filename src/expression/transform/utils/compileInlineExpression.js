import { isSymbolNode } from '../../../utils/is.js'
import { createSubScope } from '../../../utils/scope.js'

/**
 * Compile an inline expression like "x > 0"
 * @param {Node} expression
 * @param {Object} math
 * @param {Object} scope
 * @return {function} Returns a function with one argument which fills in the
 *                    undefined variable (like "x") and evaluates the expression
 */
export function compileInlineExpression (expression, math, scope) {
  // find an undefined symbol
  const symbol = expression.filter(function (node) {
    return isSymbolNode(node) &&
        !(node.name in math) &&
        !(scope.has(node.name))
  })[0]

  if (!symbol) {
    throw new Error('No undefined variable found in inline expression "' + expression + '"')
  }

  // create a test function for this equation
  const name = symbol.name // variable name
  const subScope = createSubScope(scope)
  const eq = expression.compile()
  return function inlineExpression (x) {
    subScope.set(name, x)
    return eq.evaluate(subScope)
  }
}
