/**
 * Divide two values element wise.
 *
 *     x ./ y
 *     edivide(x, y)
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex | Unit | Array | Matrix} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.edivide = function edivide(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('edivide', arguments.length, 2);
    }

    return util.deepMap2(x, y, math.divide);
};
