import { factory } from '../utils/factory'
import { extend, hasOwnProperty } from '../utils/object'
import { getSafeProperty, setSafeProperty } from '../utils/customs'

const name = 'Parser'
const dependencies = ['parse']

export const createParserClass = /* #__PURE__ */ factory(name, dependencies, ({ parse }) => {
  /**
   * @constructor Parser
   * Parser contains methods to evaluate or parse expressions, and has a number
   * of convenience methods to get, set, and remove variables from memory. Parser
   * keeps a scope containing variables in memory, which is used for all
   * evaluations.
   *
   * Methods:
   *    const result = parser.evaluate(expr)  // evaluate an expression
   *    const value = parser.get(name)        // retrieve a variable from the parser
   *    const values = parser.getAll()        // retrieve all defined variables
   *    parser.set(name, value)               // set a variable in the parser
   *    parser.remove(name)                   // clear a variable from the
   *                                          // parsers scope
   *    parser.clear()                        // clear the parsers scope
   *
   * Example usage:
   *    const parser = new Parser()
   *    // Note: there is a convenience method which can be used instead:
   *    // const parser = new math.parser()
   *
   *    // evaluate expressions
   *    parser.evaluate('sqrt(3^2 + 4^2)')        // 5
   *    parser.evaluate('sqrt(-4)')               // 2i
   *    parser.evaluate('2 inch in cm')           // 5.08 cm
   *    parser.evaluate('cos(45 deg)')            // 0.7071067811865476
   *
   *    // define variables and functions
   *    parser.evaluate('x = 7 / 2')              // 3.5
   *    parser.evaluate('x + 3')                  // 6.5
   *    parser.evaluate('function f(x, y) = x^y') // f(x, y)
   *    parser.evaluate('f(2, 3)')                // 8
   *
   *    // get and set variables and functions
   *    const x = parser.get('x')                 // 7
   *    const f = parser.get('f')                 // function
   *    const g = f(3, 2)                         // 9
   *    parser.set('h', 500)
   *    const i = parser.evaluate('h / 2')        // 250
   *    parser.set('hello', function (name) {
   *        return 'hello, ' + name + '!'
   *    })
   *    parser.evaluate('hello("user")')          // "hello, user!"
   *
   *    // clear defined functions and variables
   *    parser.clear()
   *
   */
  function Parser () {
    if (!(this instanceof Parser)) {
      throw new SyntaxError(
        'Constructor must be called with the new operator')
    }
    this.scope = {}
  }

  /**
   * Attach type information
   */
  Parser.prototype.type = 'Parser'
  Parser.prototype.isParser = true

  /**
   * Parse and evaluate the given expression
   * @param {string} expr   A string containing an expression, for example "2+3"
   * @return {*} result     The result, or undefined when the expression was empty
   * @throws {Error}
   */
  Parser.prototype.evaluate = function (expr) {
    // TODO: validate arguments
    return parse(expr)
      .compile()
      .evaluate(this.scope)
  }

  /**
   * Get a variable (a function or variable) by name from the parsers scope.
   * Returns undefined when not found
   * @param {string} name
   * @return {* | undefined} value
   */
  Parser.prototype.get = function (name) {
    // TODO: validate arguments
    return name in this.scope
      ? getSafeProperty(this.scope, name)
      : undefined
  }

  /**
   * Get a map with all defined variables
   * @return {Object} values
   */
  Parser.prototype.getAll = function () {
    return extend({}, this.scope)
  }

  /**
   * Set a symbol (a function or variable) by name from the parsers scope.
   * @param {string} name
   * @param {* | undefined} value
   */
  Parser.prototype.set = function (name, value) {
    // TODO: validate arguments
    return setSafeProperty(this.scope, name, value)
  }

  /**
   * Remove a variable from the parsers scope
   * @param {string} name
   */
  Parser.prototype.remove = function (name) {
    // TODO: validate arguments
    delete this.scope[name]
  }

  /**
   * Clear the scope with variables and functions
   */
  Parser.prototype.clear = function () {
    for (const name in this.scope) {
      if (hasOwnProperty(this.scope, name)) {
        delete this.scope[name]
      }
    }
  }

  return Parser
}, { isClass: true })
