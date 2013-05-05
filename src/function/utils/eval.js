/**
 * Evaluate an expression.
 *
 *     eval(expr)
 *     eval(expr1, expr2, expr3, ...)
 *     eval([expr1, expr2, expr3, ...])
 *
 * @param {String | Array | Matrix} expr
 * @return {*} res
 */
math.eval = function (expr) {
    var parser,
        res;

    switch (arguments.length) {
        case 0:
            throw new Error('Function eval requires one or more parameters (0 provided)');

        case 1:
            parser = new math.expr.Parser();
            return _eval(parser, expr);

        default:
            parser = new math.expr.Parser();
            res = [];
            for (var i = 0, len = arguments.length; i < len; i++) {
                res[i] = _eval(parser, arguments[i]);
            }
            return res;
    }
};

/**
 * Evaluate an expression
 * @param {math.expr.Parser} parser
 * @param {String | Array | Matrix} expr
 * @private
 */
var _eval = function (parser, expr) {
    if (isString(expr)) {
        return parser.eval(expr);
    }

    if (expr instanceof Array || expr instanceof Matrix) {
        return util.map(expr, parser.eval.bind(parser));
    }

    throw new TypeError('String or matrix expected');
};
