import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'
import { isMapLike } from '../../utils/customs.js'

const name = 'evaluate'
const dependencies = ['typed', 'parse']

function deprecatePlainObjectScope (scope) {
  // Using bare objects as scopes is a source of potential security vulnerabilities.
  // https://github.com/josdejong/mathjs/issues/2165
  if (!isMapLike(scope)) {
    console.warn('⚠️ Using bare objects as scopes is deprecated and may be removed in future versions. Use Map instead. ⚠️')
  }
}

function throwIfNotMapLike (scope) {
  if (!isMapLike(scope)) {
    throw new TypeError('New scope objects should be Map or resemble Maps')
  }
}

export const createEvaluate = /* #__PURE__ */ factory(name, dependencies, ({ typed, parse }) => {
  /**
   * Evaluate an expression.
   *
   * Note the evaluating arbitrary expressions may involve security risks,
   * see [https://mathjs.org/docs/expressions/security.html](https://mathjs.org/docs/expressions/security.html) for more information.
   *
   * Syntax:
   *
   *     math.evaluate(expr)
   *     math.evaluate(expr, scope)
   *     math.evaluate([expr1, expr2, expr3, ...])
   *     math.evaluate([expr1, expr2, expr3, ...], scope)
   *
   * Example:
   *
   *     math.evaluate('(2+3)/4')                // 1.25
   *     math.evaluate('sqrt(3^2 + 4^2)')        // 5
   *     math.evaluate('sqrt(-4)')               // 2i
   *     math.evaluate(['a=3', 'b=4', 'a*b'])    // [3, 4, 12]
   *
   *     let scope = {a:3, b:4}
   *     math.evaluate('a * b', scope)           // 12
   *
   * See also:
   *
   *    parse, compile
   *
   * @param {string | string[] | Matrix} expr   The expression to be evaluated
   * @param {Object} [scope]                    Scope to read/write variables
   * @return {*} The result of the expression
   * @throws {Error}
   */
  return typed(name, {
    string: function (expr) {
      const scope = new Map()
      return parse(expr).compile().evaluate(scope)
    },

    'string, Object': function (expr, scope) {
      deprecatePlainObjectScope(scope)
      return parse(expr).compile().evaluate(scope)
    },

    'string, any': function (expr, scope) {
      throwIfNotMapLike(scope)
      return parse(expr).compile().evaluate(scope)
    },

    'Array | Matrix': function (expr) {
      const scope = new Map()
      return deepMap(expr, function (entry) {
        return parse(entry).compile().evaluate(scope)
      })
    },

    'Array | Matrix, Object': function (expr, scope) {
      deprecatePlainObjectScope(scope)
      return deepMap(expr, function (entry) {
        return parse(entry).compile().evaluate(scope)
      })
    },

    'Array | Matrix, any': function (expr, scope) {
      throwIfNotMapLike(scope)
      return deepMap(expr, function (entry) {
        return parse(entry).compile().evaluate(scope)
      })
    }
  })
})
