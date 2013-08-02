/**
 * Return a random number between 0 and 1
 *
 *     random()
 *
 * @return {Number} res
 */

// Each distribution is a function that takes no argument and when called returns
// a number between 0 and 1.
var distributions = {

    uniform: function() {
        return Math.random;
    }
};

math.distribution = function(name) {
    if (!distributions.hasOwnProperty(name))
        throw new Error('unknown distribution ' + name);

    var args = Array.prototype.slice.call(arguments, 1),
        distribution = distributions[name].apply(this, args);

    // We wrap all the random functions into one object which uses the given distribution.
    return (function(distribution) {

        // TODO: argument check 
        return {
            random: function(min, max) {
                return min + distribution() * (max - min);
            },

            randomInt: function(min, max) {
                return Math.floor(this.random(min, max));
            }
        }

    })(distribution)
};

// Default random functions use uniform distribution
var uniformRandFunctions = math.distribution('uniform');
math.random = uniformRandFunctions.random;
math.randomInt = uniformRandFunctions.randomInt;