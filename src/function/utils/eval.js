/**
 * Evaluate an expression. The expression will be evaluated using a read-only
 * instance of a Parser (i.e. variable definitions are not supported).
 *
 *     eval(expr)
 *     eval([expr1, expr2, expr3, ...])
 *
 * @param {String | Array | Matrix} expr
 * @return {*} res
 */
math.eval = function (expr) {
    if (arguments.length != 1) {
        throw newArgumentsError('eval', arguments.length, 1);
    }

    if (isString(expr)) {
        return _readonlyParser.eval(expr);
    }

    if (expr instanceof Array || expr instanceof Matrix) {
        return util.map(expr, math.eval);
    }

    throw new TypeError('String or matrix expected');
};

/** @private */
var _readonlyParser = new math.expr.Parser({
    readonly: true
});
