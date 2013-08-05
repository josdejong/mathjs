var collection = require('../../type/collection.js'),
    parse = require('./parse.js'),
    string = require('../../util/string.js'),
    error = require('../../util/error.js'),
    Matrix = require('../../type/Matrix.js'),
    Scope = require('../../expr/Scope.js');

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
 * @param {String | String[] | Matrix} expr
 * @param {Scope | Object} [scope]
 * @return {*} res
 * @throws {Error}
 */
module.exports = function (expr, scope) {
  if (arguments.length != 1 && arguments.length != 2) {
    throw new error.ArgumentsError('eval', arguments.length, 1, 2);
  }

  // instantiate a scope
  var evalScope;
  if (scope) {
    if (scope instanceof Scope) {
      evalScope = scope;
    }
    else {
      evalScope = new Scope(scope);
    }
  }
  else {
    evalScope = new Scope();
  }

  if (string.isString(expr)) {
    // evaluate a single expression
    var node = parse(expr, evalScope);
    return node.eval();
  }
  else if (Array.isArray(expr) || expr instanceof Matrix) {
    // evaluate an array or matrix with expressions
    return collection.map(expr, function (elem) {
      var node = parse(elem, evalScope);
      return node.eval();
    });
  }
  else {
    // oops
    throw new TypeError('String or matrix expected');
  }
};
