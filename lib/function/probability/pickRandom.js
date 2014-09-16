'use strict';

module.exports = function (math) {
  var distribution = require('./distribution')(math);

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
   * @return {Number} One of the elements of the provided input array
   */
  math.pickRandom = distribution('uniform').pickRandom;
};
