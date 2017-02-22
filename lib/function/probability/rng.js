var seedrandom = require('seed-random');

var generator = seedrandom();

var rng = {
  setSeed: function(seed) {
    if(seed === undefined) {
      generator = seedrandom();
    } else {
      generator = seedrandom(seed)
    }
  },
  generate: function(){ return generator(); }
}

module.exports = rng;
