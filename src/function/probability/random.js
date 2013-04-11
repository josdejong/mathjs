/**
 * Return a random number between 0 and 1
 * @return {Number} res
 */
math.random = function random () {
    if (arguments.length != 0) {
        throw newArgumentsError('random', arguments.length, 0);
    }

    // TODO: implement parameter min and max
    return Math.random();
};
