/**
 * Calculates the power of x to y element wise
 *
 *     x .^ y
 *     epow(x, y)
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex | Unit | Array | Matrix} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.epow = function epow(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('epow', arguments.length, 2);
    }

    return util.deepMap2(x, y, math.pow);
};
