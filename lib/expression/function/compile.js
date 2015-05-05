'use strict';

function factory (type, config, load, typed, math) {
  var collection = load(require('../../type/matrix/collection'));
  var parse = load(require('../parse'));

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
   *     var code = math.compile('sqrt(3^2 + 4^2)');
   *     code.eval(); // 5
   *
   *     var scope = {a: 3, b: 4}
   *     var code = math.compile('a * b'); // 12
   *     code.eval(scope); // 12
   *     scope.a = 5;
   *     code.eval(scope); // 20
   *
   *     var nodes = math.compile(['a = 3', 'b = 4', 'a * b']);
   *     nodes[2].eval(); // 12
   *
   * See also:
   *
   *    parse, eval
   *
   * @param {String | String[] | Array | Matrix} expr
   *            The expression to be compiled
   * @return {{eval: Function} | Array.<{eval: Function}>} code
   *            An object with the compiled expression
   * @throws {Error}
   */
  return typed('compile', {
    'string': function (expr) {
      return parse(expr).compile(math);
    },

    'Array | Matrix': function (expr) {
      return collection.deepMap(expr, function (entry) {
        return parse(entry).compile(math);
      });
    }
  });
}

exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.name = 'compile';
exports.factory = factory;
