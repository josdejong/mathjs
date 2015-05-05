'use strict';

function factory (type, config, load, typed, math) {
  var collection = load(require('../../type/collection'));
  var parse = load(require('../parse'));

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
  return typed('compile', {
    'string': function (expr) {
      var scope = {};
      return parse(expr).compile(math).eval(scope);
    },

    'string, Object': function (expr, scope) {
      return parse(expr).compile(math).eval(scope);
    },

    'Array | Matrix': function (expr) {
      var scope = {};
      return collection.deepMap(expr, function (entry) {
        return parse(entry).compile(math).eval(scope);
      });
    },

    'Array | Matrix, Object': function (expr, scope) {
      return collection.deepMap(expr, function (entry) {
        return parse(entry).compile(math).eval(scope);
      });
    }
  });
}

exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.name = 'eval';
exports.factory = factory;