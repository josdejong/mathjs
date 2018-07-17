'use strict'

const deepMap = require('../../utils/collection/deepMap')

function factory (type, config, load, typed) {
  const parse = load(require('../parse'))

  /**
   * Parse and compile an expression.
   * Returns a an object with a function `eval([scope])` to evaluate the
   * compiled expression.
   *
   * Syntax:
   *
   *     math.compile(expr)                       // returns one node
   *     math.compile([expr1, expr2, expr3, ...]) // returns an array with nodes
   *
   * Examples:
   *
   *     const code1 = math.compile('sqrt(3^2 + 4^2)')
   *     code1.eval() // 5
   *
   *     let scope = {a: 3, b: 4}
   *     const code2 = math.compile('a * b') // 12
   *     code2.eval(scope) // 12
   *     scope.a = 5
   *     code2.eval(scope) // 20
   *
   *     const nodes = math.compile(['a = 3', 'b = 4', 'a * b'])
   *     nodes[2].eval() // 12
   *
   * See also:
   *
   *    parse, eval
   *
   * @param {string | string[] | Array | Matrix} expr
   *            The expression to be compiled
   * @return {{eval: Function} | Array.<{eval: Function}>} code
   *            An object with the compiled expression
   * @throws {Error}
   */
  return typed('compile', {
    'string': function (expr) {
      return parse(expr).compile()
    },

    'Array | Matrix': function (expr) {
      return deepMap(expr, function (entry) {
        return parse(entry).compile()
      })
    }
  })
}

exports.name = 'compile'
exports.factory = factory
