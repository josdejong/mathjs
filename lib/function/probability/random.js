module.exports = function (math) {
  var util = require('../../util/index.js'),

      Matrix = require('../../type/Matrix.js');

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
            picked = -1;
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

  /**
   * Create a distribution object.
   * @param {String} name           Name of a distribution.
   *                                Choose from 'uniform', 'normal'.
   * @return {Object} distribution  A distribution object containing functions:
   *                                    random([size, min, max])
   *                                    randomInt([min, max])
   *                                    pickRandom(array)
   */
  math.distribution = function(name) {
    if (!distributions.hasOwnProperty(name))
      throw new Error('unknown distribution ' + name);

    var args = Array.prototype.slice.call(arguments, 1),
        distribution = distributions[name].apply(this, args);

    return (function(distribution) {

      // This is the public API for all distributions
      var randFunctions = {

        random: function(arg1, arg2, arg3) {
          var size, min, max;
          if (arguments.length > 3) {
            throw new util.error.ArgumentsError('random', arguments.length, 0, 3);

          // `random(max)` or `random(size)`
          } else if (arguments.length === 1) {
            if (Array.isArray(arg1))
              size = arg1;
            else
              max = arg1;
          // `random(min, max)` or `random(size, max)`
          } else if (arguments.length === 2) {
            if (Array.isArray(arg1))
              size = arg1;
            else {
              min = arg1;
              max = arg2;
            }
          // `random(size, min, max)`
          } else {
            size = arg1;
            min = arg2;
            max = arg3;
          }

          if (max === undefined) max = 1;
          if (min === undefined) min = 0;
          // TODO: output Array if size is Array, output Matrix if size is Matrix
          if (size !== undefined) return new Matrix(_randomDataForMatrix(size, min, max, _random));
          else return _random(min, max);
        },

        randomInt: function(arg1, arg2, arg3) {
          var size, min, max;
          if (arguments.length > 3 || arguments.length < 1)
            throw new util.error.ArgumentsError('randomInt', arguments.length, 1, 3);

          // `randomInt(max)`
          else if (arguments.length === 1) max = arg1;
          // `randomInt(min, max)` or `randomInt(size, max)`
          else if (arguments.length === 2) {
            if (Object.prototype.toString.call(arg1) === '[object Array]')
              size = arg1;
            else {
              min = arg1;
              max = arg2;
            }
          // `randomInt(size, min, max)`
          } else {
            size = arg1;
            min = arg2;
            max = arg3;
          }

          if (min === undefined) min = 0;
          // TODO: output Array if size is Array, output Matrix if size is Matrix
          if (size !== undefined) return new Matrix(_randomDataForMatrix(size, min, max, _randomInt));
          else return _randomInt(min, max);
        },

        pickRandom: function(possibles) {
          if (arguments.length !== 1) {
            throw new util.error.ArgumentsError('pickRandom', arguments.length, 1);
          }
          if (!Array.isArray(possibles)) {
            throw new util.error.UnsupportedTypeError('pickRandom', possibles);
          }

          // TODO: add support for matrices
          return possibles[Math.floor(Math.random() * possibles.length)];
        }

      };

      var _random = function(min, max) {
        return min + distribution() * (max - min);
      };

      var _randomInt = function(min, max) {
        return Math.floor(min + distribution() * (max - min));
      };

      // This is a function for generating a random matrix recursively.
      var _randomDataForMatrix = function(size, min, max, randFunc) {
        var data = [], length, i;
        size = size.slice(0);

        if (size.length > 1) {
          for (i = 0, length = size.shift(); i < length; i++)
            data.push(_randomDataForMatrix(size, min, max, randFunc));
        } else {
          for (i = 0, length = size.shift(); i < length; i++)
            data.push(randFunc(min, max));
        }

        return data;
      };

      return randFunctions;

    })(distribution);

  };

  // Default random functions use uniform distribution
  // TODO: put random functions in separate files?
  var uniformRandFunctions = math.distribution('uniform');
  math.random = uniformRandFunctions.random;
  math.randomInt = uniformRandFunctions.randomInt;
  math.pickRandom = uniformRandFunctions.pickRandom;
};
