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
    },

    // Implementation of normal distribution using Box-Muller transform
    // ref : http://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
    // We take : mean = 0.5, standard deviation = 1/6
    // so that 99.7% values are in [0, 1].
    normal: function() {
        return function() {
            var u1, u2,
                picked = -1
            // We reject values outside of the interval [0, 1]
            // TODO: check if it is ok to do that?
            while (picked < 0 || picked > 1) {
                u1 = Math.random();
                u2 = Math.random();
                picked = 1/6 * Math.pow(-2 * Math.log(u1), 0.5) * Math.cos(2 * Math.PI * u2) + 0.5;
            }
            return picked;
        }
    }
};

math.distribution = function(name) {
    if (!distributions.hasOwnProperty(name))
        throw new Error('unknown distribution ' + name);

    var args = Array.prototype.slice.call(arguments, 1),
        distribution = distributions[name].apply(this, args);

    // We wrap all the random functions into one object which uses the given distribution.
    return (function(distribution) {

        var randFunctions = {

            random: function(arg1, arg2, arg3) {
                if (arguments.length > 3)
                    newArgumentsError('random', arguments.length, 0, 3);

                // Random matrix
                else if (Object.prototype.toString.call(arg1) === '[object Array]') {
                    var min = arg2, max = arg3;
                    if (max === undefined) max = 1;
                    if (min === undefined) min = 0;
                    return new Matrix(_randomDataForMatrix(arg1, min, max));

                // Random float
                } else {
                    // TODO: more precise error message?
                    if (arguments.length > 2)
                        newArgumentsError('random', arguments.length, 0, 2);
                    var min = arg1, max = arg2;
                    if (max === undefined) max = 1;
                    if (min === undefined) min = 0;
                    return min + distribution() * (max - min);              
                }
            },

            randomInt: function(min, max) {
                if (arguments.length > 2)
                    newArgumentsError('randomInt', arguments.length, 0, 2);
                return Math.floor(this.random(min, max));
            },

            pickRandom: function(possibles) {
                if (arguments.length !== 1)
                    newArgumentsError('pickRandom', arguments.length, 1);
                return possibles[Math.floor(Math.random() * possibles.length)];
            }
        };

        var _randomDataForMatrix = function(size, min, max) {
            var data = [], length, i;
            size = size.slice(0);

            if (size.length > 1) {
                for (i = 0, length = size.shift(); i < length; i++)
                    data.push(_randomDataForMatrix(size, min, max));
            } else {
                for (i = 0, length = size.shift(); i < length; i++)
                    data.push(randFunctions.random.call(randFunctions, min, max));
            }

            return data;
        };

        return randFunctions;

    })(distribution);

};

// Default random functions use uniform distribution
var uniformRandFunctions = math.distribution('uniform');
math.random = uniformRandFunctions.random;
math.randomInt = uniformRandFunctions.randomInt;
math.pickRandom = uniformRandFunctions.pickRandom;
math.randomMatrix = uniformRandFunctions.randomMatrix;