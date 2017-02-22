'use strict';

function factory (type, config, load, typed) {
  var rng = require('./rng');

  /**
   * Seed the random number generator
   *
   * Syntax:
   *
   *     math.seedrandom('a')         // seed random number generator with 'a'
   *
   * Examples:
   *
   *     math.seedrandom('a')
   *     math.random();       // returns 0.43449421599986604 every time
   *
   * See also:
   *
   *     random, randomInt, pickRandom
   *
   * @param {string} [seed] seed for random number generator
   */
  var seedrandom = typed('seedrandom', {
    'string': rng.setSeed,
    '': rng.setSeed
  });

  seedrandom.toTex = undefined; // use default template

  return seedrandom;
}

exports.name = 'seedrandom';
exports.factory = factory;
