'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),
      _parse = math.expression.parse,

      collection = math.collection,

      isString = util.string.isString,
      isCollection = collection.isCollection;

  /**
   * Evaluate an expression.
   *
   * Syntax:
   *
   *     math.eval(expr)
   *     math.eval(expr, scope)
   *     math.eval([expr1, expr2, expr3, ...])
   *     math.eval([expr1, expr2, expr3, ...], scope)
   *
   * Example:
   *
   *     math.eval('(2+3)/4');                // 1.25
   *     math.eval('sqrt(3^2 + 4^2)');        // 5
   *     math.eval('sqrt(-4)');               // 2i
   *     math.eval(['a=3', 'b=4', 'a*b']);,   // [3, 4, 12]
   *
   *     var scope = {a:3, b:4};
   *     math.eval('a * b', scope);           // 12
   *
   * See also:
   *
   *    parse, compile
   *
   * @param {String | String[] | Matrix} expr   The expression to be evaluated
   * @param {Object} [scope]                    Scope to read/write variables
   * @return {*} The result of the expression
   * @throws {Error}
   */
  math.eval = function _eval (expr, scope) {
    if (arguments.length != 1 && arguments.length != 2) {
      throw new math.error.ArgumentsError('eval', arguments.length, 1, 2);
    }

    // instantiate a scope
    scope = scope || {};

    if (isString(expr)) {
      // evaluate a single expression
      return _parse(expr)
          .compile(math)
          .eval(scope);
    }
    else if (isCollection(expr)) {
      // evaluate an array or matrix with expressions
      return collection.deepMap(expr, function (elem) {
        return _parse(elem)
            .compile(math).eval(scope);
      });
    }
    else {
      // oops
      throw new TypeError('String, array, or matrix expected');
    }
  };
};
