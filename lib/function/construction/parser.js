module.exports = function (math) {
  var util = require('../../util/index.js'),

      Parser = require('../../expr/Parser.js');

  /**
   * Create a parser. The function creates a new math.expr.Parser object.
   *
   *    parser()
   *
   * Example usage:
   *     var parser = new math.parser();
   *
   *     // evaluate expressions
   *     var a = parser.eval('sqrt(3^2 + 4^2)'); // 5
   *     var b = parser.eval('sqrt(-4)');        // 2i
   *     var c = parser.eval('2 inch in cm');    // 5.08 cm
   *     var d = parser.eval('cos(45 deg)');     // 0.7071067811865476
   *
   *     // define variables and functions
   *     parser.eval('x = 7 / 2');               // 3.5
   *     parser.eval('x + 3');                   // 6.5
   *     parser.eval('function f(x, y) = x^y');  // f(x, y)
   *     parser.eval('f(2, 3)');                 // 8
   *
   *     // get and set variables and functions
   *     var x = parser.get('x');                // 7
   *     var f = parser.get('f');                // function
   *     var g = f(3, 2);                        // 9
   *     parser.set('h', 500);
   *     var i = parser.eval('h / 2');           // 250
   *     parser.set('hello', function (name) {
 *         return 'hello, ' + name + '!';
 *     });
   *     parser.eval('hello("user")');           // "hello, user!"
   *
   *     // clear defined functions and variables
   *     parser.clear();
   *
   * @return {Parser} Parser
   */
  math.parser = function parser() {
    return new Parser(math);
  };
};
