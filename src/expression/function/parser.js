import { factory } from '../../utils/factory.js'

const name = 'parser'
const dependencies = ['typed', 'Parser']

export const createParser = /* #__PURE__ */ factory(name, dependencies, ({ typed, Parser }) => {
  /**
   * Create a parser. The function creates a new `math.Parser` object.
   *
   * Syntax:
   *
   *    math.parser()
   *
   * Examples:
   *
   *     const parser = new math.parser()
   *
   *     // evaluate expressions
   *     const a = parser.evaluate('sqrt(3^2 + 4^2)') // 5
   *     const b = parser.evaluate('sqrt(-4)')        // 2i
   *     const c = parser.evaluate('2 inch in cm')    // 5.08 cm
   *     const d = parser.evaluate('cos(45 deg)')     // 0.7071067811865476
   *
   *     // define variables and functions
   *     parser.evaluate('x = 7 / 2')                 // 3.5
   *     parser.evaluate('x + 3')                     // 6.5
   *     parser.evaluate('function f(x, y) = x^y')    // f(x, y)
   *     parser.evaluate('f(2, 3)')                   // 8
   *
   *     // get and set variables and functions
   *     const x = parser.get('x')                // 7
   *     const f = parser.get('f')                // function
   *     const g = f(3, 2)                        // 9
   *     parser.set('h', 500)
   *     const i = parser.evaluate('h / 2')       // 250
   *     parser.set('hello', function (name) {
   *       return 'hello, ' + name + '!'
   *     })
   *     parser.evaluate('hello("user")')         // "hello, user!"
   *
   *     // clear defined functions and variables
   *     parser.clear()
   *
   * See also:
   *
   *    evaluate, compile, parse
   *
   * @return {Parser} Parser
   */
  return typed(name, {
    '': function () {
      return new Parser()
    }
  })
})
