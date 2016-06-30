'use strict';

function factory (type, config, load, typed) {
  var distribution = load(require('./distribution'));

  /**
   * Random pick a specified number of values from a one dimensional array.
   * Array elements are picked using a random function with uniform distribution.
   *
   * Syntax:
   *
   *     math.pickMultipleRandom(array, int)
   *
   * Examples:
   *
   *     math.pickMultipleRandom([3, 6, 12, 2], 2);   // returns two of the values in the array
   *
   * See also:
   *
   *     random, randomInt, pickRandom, pickMultipleRandom
   *
   * @param {Array} array     A one dimensional array
   * @param {number} num     A one dimensional array
   * @return {array} An array with n elements of the provided input array
   */
  var pickMultipleRandom =  distribution('uniform').pickMultipleRandom;

  pickMultipleRandom.toTex = undefined; // use default template

  return pickMultipleRandom;
}

exports.name = 'pickMultipleRandom';
exports.factory = factory;
