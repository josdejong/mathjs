'use strict';

function factory (type, config, load, typed) {
  var distribution = load(require('./distribution'));

  /**
   * Random pick a value from a one dimensional array.
   * Array element is picked using a random function with uniform distribution.
   *
   * Syntax:
   *
   *     math.pickRandom(array)
   *
   * Examples:
   *
   *     math.pickRandom([3, 6, 12, 2]);       // returns one of the values in the array
   *
   * See also:
   *
   *     random, randomInt
   *
   * @param {Array} array     A one dimensional array
   * @return {number} One of the elements of the provided input array
   */
  // TODO: rework pickRandom to a typed-function
  var pickRandom =  distribution('uniform').pickRandom;

  pickRandom.toTex = undefined; // use default template

  return pickRandom;
}

exports.name = 'pickRandom';
exports.factory = factory;
