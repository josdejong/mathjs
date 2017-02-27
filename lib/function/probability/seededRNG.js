'use strict';
var seedrandom = require('seed-random');

function factory (type, config, load, typed, math) {

  // initialize a seeded pseudo random number generator with config's random seed
  var generator = config.randomSeed === null ? seedrandom() : seedrandom(config.randomSeed.toString());

  // wrapper function so the rng can be updated via generator
  function rng() {
      return generator();
  }

  // updates generator with a new instance of a seeded pseudo random number generator
  math.on('config', function (curr, prev, changes) {
    // if the user specified a randomSeed
    if(changes.randomSeed !== undefined) {
      // update generator with a new instance of a seeded pseudo random number generator
      generator = curr.randomSeed === null ? seedrandom() : seedrandom(curr.randomSeed.toString());
    }
  });

  return rng;
}

exports.factory = factory;
exports.math = true;
