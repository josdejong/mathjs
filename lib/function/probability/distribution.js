'use strict';

var ArgumentsError = require('../../error/ArgumentsError');
var isCollection = require('../../utils/collection/isCollection');

// TODO: rethink math.distribution
// TODO: rework to a typed function
function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));
  var array = require('../../utils/array');

  /**
   * Create a distribution object with a set of random functions for given
   * random distribution.
   *
   * Syntax:
   *
   *     math.distribution(name)
   *
   * Examples:
   *
   *     var normalDist = math.distribution('normal'); // create a normal distribution
   *     normalDist.random(0, 10);                     // get a random value between 0 and 10
   *
   * See also:
   *
   *     random, randomInt, pickRandom
   *
   * @param {string} name   Name of a distribution. Choose from 'uniform', 'normal'.
   * @return {Object}       Returns a distribution object containing functions:
   *                        `random([size] [, min] [, max])`,
   *                        `randomInt([min] [, max])`,
   *                        `pickRandom(array)`
   */
  function distribution(name) {
    if (!distributions.hasOwnProperty(name))
      throw new Error('Unknown distribution ' + name);

    var args = Array.prototype.slice.call(arguments, 1),
        distribution = distributions[name].apply(this, args);

    return (function(distribution) {

      // This is the public API for all distributions
      var randFunctions = {

        random: function(arg1, arg2, arg3) {
          var size, min, max;
          if (arguments.length > 3) {
            throw new ArgumentsError('random', arguments.length, 0, 3);

          // `random(max)` or `random(size)`
          } else if (arguments.length === 1) {
            if (isCollection(arg1)) {
              size = arg1;
            }
            else {
              max = arg1;
            }
          // `random(min, max)` or `random(size, max)`
          } else if (arguments.length === 2) {
            if (isCollection(arg1)) {
              size = arg1;
              max = arg2;
            }
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

          // TODO: validate type of min, max, and size

          if (max === undefined) max = 1;
          if (min === undefined) min = 0;
          if (size !== undefined) {
            var res = _randomDataForMatrix(size.valueOf(), min, max, _random);
            return (size && size.isMatrix === true) ? matrix(res) : res;
          }
          else return _random(min, max);
        },

        randomInt: function(arg1, arg2, arg3) {
          var size, min, max;
          if (arguments.length > 3 || arguments.length < 1)
            throw new ArgumentsError('randomInt', arguments.length, 1, 3);

          // `random(max)` or `random(size)`
          else if (arguments.length === 1)
            if (isCollection(arg1)) {
              size = arg1;
            }
            else {
              max = arg1;
            }
          // `randomInt(min, max)` or `randomInt(size, max)`
          else if (arguments.length === 2) {
            if (isCollection(arg1)) {
              size = arg1;
              max = arg2;
            }
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

          // TODO: validate type of min, max, and size

          if (min === undefined) min = 0;
          if (size !== undefined) {
            var res = _randomDataForMatrix(size.valueOf(), min, max, _randomInt);
            return (size && size.isMatrix === true) ? matrix(res) : res;
          }
          else return _randomInt(min, max);
        },

        pickRandom: function(possibles) {
          if (arguments.length !== 1) {
            throw new ArgumentsError('pickRandom', arguments.length, 1);
          }
          if (possibles && possibles.isMatrix === true) {
            possibles = possibles.valueOf(); // get Array
          }
          else if (!Array.isArray(possibles)) {
            throw new TypeError('Unsupported type of value in function pickRandom');
          }

          if (array.size(possibles).length > 1) {
            throw new Error('Only one dimensional vectors supported');
          }

          // TODO: add support for multi dimensional matrices
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
  }

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

  distribution.toTex = undefined; // use default template

  return distribution;
}

exports.name = 'distribution';
exports.factory = factory;
