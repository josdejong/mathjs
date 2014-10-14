'use strict';

module.exports = function (math) {
  var distribution = require('./distribution')(math);

  /**
   * Return a random integer number larger or equal to `min` and smaller than `max`
   * using a uniform distribution.
   *
   * Syntax:
   *
   *     math.randomInt()                // generate a random integer between 0 and 1
   *     math.randomInt(max)             // generate a random integer between 0 and max
   *     math.randomInt(min, max)        // generate a random integer between min and max
   *     math.randomInt(size)            // generate a matrix with random integer between 0 and 1
   *     math.randomInt(size, max)       // generate a matrix with random integer between 0 and max
   *     math.randomInt(size, min, max)  // generate a matrix with random integer between min and max
   *
   * Examples:
   *
   *     math.randomInt();       // returns a random integer between 0 and 1
   *     math.randomInt(100);    // returns a random integer between 0 and 100
   *     math.randomInt(30, 40); // returns a random integer between 30 and 40
   *     math.randomInt([2, 3]); // returns a 2x3 matrix with random integers between 0 and 1
   *
   * See also:
   *
   *     random, pickRandom
   *
   * @param {Array | Matrix} [size] If provided, an array or matrix with given
   *                                size and filled with random values is returned
   * @param {Number} [min]  Minimum boundary for the random value, included
   * @param {Number} [max]  Maximum boundary for the random value, excluded
   * @return {Number | Array | Matrix} A random integer value
   */
  math.randomInt = distribution('uniform').randomInt;
};
