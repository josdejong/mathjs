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
 * @param {String | String[] | Matrix} expr
 * @param {math.expr.Scope | Object} [scope]
 * @return {*} res
 * @throws {Error}
 */
math.eval = function (expr, scope) {
    if (arguments.length != 1 && arguments.length != 2) {
        throw newArgumentsError('eval', arguments.length, 1, 2);
    }

    // instantiate a scope
    var evalScope;
    if (scope) {
        if (scope instanceof math.expr.Scope) {
            evalScope = scope;
        }
        else {
            evalScope = new math.expr.Scope(scope);
        }
    }
    else {
        evalScope = new math.expr.Scope();
    }

    if (isString(expr)) {
        // evaluate a single expression
        var node = math.parse(expr, evalScope);
        return node.eval();
    }
    else if (expr instanceof Array || expr instanceof Matrix) {
        // evaluate an array or matrix with expressions
        return util.map(expr, function (elem) {
            var node = math.parse(elem, evalScope);
            return node.eval();
        });
    }
    else {
        // oops
        throw new TypeError('String or matrix expected');
    }
};
