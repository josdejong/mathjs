'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),
      _parse = math.expression.parse,

      collection = math.collection,

      isString = util.string.isString,
      isCollection = collection.isCollection;

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
   * @param {String | String[] | Matrix} expr
   *            The expression to be compiled
   * @return {{eval: Function} | Array.<{eval: Function}>} code
   *            An object with the compiled expression
   * @throws {Error}
   */
  math.compile = function compile (expr) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('compile', arguments.length, 1);
    }

    if (isString(expr)) {
      // evaluate a single expression
      return _parse(expr).compile(math);
    }
    else if (isCollection(expr)) {
      // evaluate an array or matrix with expressions
      return collection.deepMap(expr, function (elem) {
        return _parse(elem).compile(math);
      });
    }
    else {
      // oops
      throw new TypeError('String, array, or matrix expected');
    }
  }
};
