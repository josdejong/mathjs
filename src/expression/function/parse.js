'use strict'

import { factory } from '../../utils/factory'

const name = 'parse'
const dependencies = ['typed', 'expression.parse']

export const createParse = /* #__PURE__ */ factory(name, dependencies, ({ typed, expression: { parse } }) => {
  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.evaluate().
   *
   * Note the evaluating arbitrary expressions may involve security risks,
   * see [http://mathjs.org/docs/expressions/security.html](http://mathjs.org/docs/expressions/security.html) for more information.
   *
   * Syntax:
   *
   *     math.parse(expr)
   *     math.parse(expr, options)
   *     math.parse([expr1, expr2, expr3, ...])
   *     math.parse([expr1, expr2, expr3, ...], options)
   *
   * Example:
   *
   *     const node1 = math.parse('sqrt(3^2 + 4^2)')
   *     node1.compile().evaluate() // 5
   *
   *     let scope = {a:3, b:4}
   *     const node2 = math.parse('a * b') // 12
   *     const code2 = node2.compile()
   *     code2.evaluate(scope) // 12
   *     scope.a = 5
   *     code2.evaluate(scope) // 20
   *
   *     const nodes = math.parse(['a = 3', 'b = 4', 'a * b'])
   *     nodes[2].compile().evaluate() // 12
   *
   * See also:
   *
   *     evaluate, compile
   *
   * @param {string | string[] | Matrix} expr          Expression to be parsed
   * @param {{nodes: Object<string, Node>}} [options]  Available options:
   *                                                   - `nodes` a set of custom nodes
   * @return {Node | Node[]} node
   * @throws {Error}
   */
  return typed(name, {
    'string | Array | Matrix': parse,
    'string | Array | Matrix, Object': parse
  })
})
