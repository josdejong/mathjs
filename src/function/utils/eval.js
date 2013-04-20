/**
 * Evaluate an expression. The expression will be evaluated using a read-only
 * instance of a Parser (i.e. variable definitions are not supported).
 *
 *     eval(expr)
 *
 * @param {String} expr
 * @return {*} res
 */
math.eval = function eval(expr) {
    if (arguments.length != 1) {
        throw newArgumentsError('eval', arguments.length, 1);
    }

    if (!isString(expr)) {
        throw new TypeError('String expected');
    }

    // TODO: add support for matrices in function eval

    return _readonlyParser.eval(expr);
};

/** @private */
var _readonlyParser = new math.expr.Parser({
    readonly: true
});
