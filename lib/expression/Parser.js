var Scope = require('./Scope.js');

/**
 * @constructor Parser
 * Parser contains methods to evaluate or parse expressions, and has a number
 * of convenience methods to get, set, and remove variables from memory. Parser
 * keeps a scope containing variables in memory, which is used for all
 * evaluations.
 *
 * Methods:
 *    var result = parser.eval(expr);    // evaluate an expression
 *    var value = parser.get(name);      // retrieve a variable from the parser
 *    parser.set(name, value);           // set a variable in the parser
 *    parser.remove(name);               // clear a variable from the
 *                                       // parsers scope
 *    parser.clear();                    // clear the parsers scope
 *
 *    // it is possible to parse an expression into a node tree:
 *    var node = parser.parse(expr);     // parse an expression into a node tree
 *    var result = node.eval();          // evaluate a parsed node
 *
 * Example usage:
 *    var parser = new Parser(math);
 *    // Note: there is a convenience method which can be used instead:
 *    // var parser = new math.parser();
 *
 *    // evaluate expressions
 *    parser.eval('sqrt(3^2 + 4^2)');         // 5
 *    parser.eval('sqrt(-4)');                // 2i
 *    parser.eval('2 inch in cm');            // 5.08 cm
 *    parser.eval('cos(45 deg)');             // 0.7071067811865476
 *
 *    // define variables and functions
 *    parser.eval('x = 7 / 2');               // 3.5
 *    parser.eval('x + 3');                   // 6.5
 *    parser.eval('function f(x, y) = x^y');  // f(x, y)
 *    parser.eval('f(2, 3)');                 // 8
 *
 *    // get and set variables and functions
 *    var x = parser.get('x');                // 7
 *    var f = parser.get('f');                // function
 *    var g = f(3, 2);                        // 9
 *    parser.set('h', 500);
 *    var i = parser.eval('h / 2');           // 250
 *    parser.set('hello', function (name) {
 *        return 'hello, ' + name + '!';
 *    });
 *    parser.eval('hello("user")');           // "hello, user!"
 *
 *    // clear defined functions and variables
 *    parser.clear();
 *
 *
 * @param {Object} math     Link to the math.js namespace
 */
function Parser(math) {
  if (!(this instanceof Parser)) {
    throw new SyntaxError(
        'Parser constructor must be called with the new operator');
  }

  this.math = math;
  this.scope = new Scope(math);
}

/**
 * Parse an expression end return the parsed function node.
 * The node can be evaluated via node.eval()
 * @param {String} expr
 * @return {Node} node
 * @throws {Error}
 */
Parser.prototype.parse = function (expr) {
  // TODO: validate arguments
  return this.math.parse(expr, this.scope);
};

/**
 * Parse and evaluate the given expression
 * @param {String} expr   A string containing an expression, for example "2+3"
 * @return {*} result     The result, or undefined when the expression was empty
 * @throws {Error}
 */
Parser.prototype.eval = function (expr) {
  // TODO: validate arguments
  var node = this.math.parse(expr, this.scope);
  return node.eval();
};

/**
 * Get a variable (a function or variable) by name from the parsers scope.
 * Returns undefined when not found
 * @param {String} name
 * @return {* | undefined} value
 */
Parser.prototype.get = function (name) {
  // TODO: validate arguments
  return this.scope.get(name);
};

/**
 * Set a symbol (a function or variable) by name from the parsers scope.
 * @param {String} name
 * @param {* | undefined} value
 */
Parser.prototype.set = function (name, value) {
  // TODO: validate arguments
  return this.scope.set(name, value);
};

/**
 * Remove a variable from the parsers scope
 * @param {String} name
 */
Parser.prototype.remove = function (name) {
  // TODO: validate arguments
  this.scope.remove(name);
};

/**
 * Clear the scope with variables and functions
 */
Parser.prototype.clear = function () {
  this.scope.clear();
};

module.exports = Parser;
