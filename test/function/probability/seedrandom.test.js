var assert = require('assert'),
    math = require('../../../index');

describe('seed', function () {
  it('should have a function seed', function () {
    assert.equal(typeof math.seedrandom, 'function');
  })

  it('should LaTeX seed', function () {
    var expression = math.parse('randomseed(abc)');
    assert.equal(expression.toTex(), '\\mathrm{randomseed}\\left( abc\\right)');
  });

  it('should generate same number with seed', function () {
    math.seedrandom('a');
    var first = math.random();
    math.seedrandom('a');
    var second = math.random();
    assert.equal(first, second);
  });

  it('should generate different number subsequent calls to seeded random', function () {
    math.seedrandom('a');
    var first = math.random();
    var second = math.random();
    assert.notEqual(first, second);
  });

  it('calling with no parameters should unseed rng', function () {
    math.seedrandom('a');
    var firstA = math.random();
    var secondA = math.random();
    math.seedrandom('a');
    var firstB = math.random();
    math.seedrandom();
    var secondB = math.random();
    assert.equal(firstA, firstB);
    assert.notEqual(secondA, secondB);
  });

  it('should generate same matrix with seed', function () {
    math.seedrandom('a');
    var first = math.random([5, 5]);
    math.seedrandom('a');
    var second = math.random([5, 5]);
    assert.equal(math.deepEqual(first, second), true);
  });

  it('should generate different matrices subsequent calls to seeded random', function () {
    math.seedrandom('a');
    var first = math.random([5, 5]);
    var second = math.random([5, 5]);
    assert.equal(math.deepEqual(first, second), false);
  });

  it('should pick same number with seed', function () {
    var range = math.range(1,1000);
    math.seedrandom('a');
    var first = math.pickRandom(range);
    math.seedrandom('a');
    var second = math.pickRandom(range);
    assert.equal(first, second);
  });

  it('should pick different number subsequent calls to seeded random', function () {
    // In theory these might be the same but with 'a' as seed they are different and always will be
    var range = math.range(1, 1000);
    math.seedrandom('a');
    var first = math.pickRandom(range);
    var second = math.pickRandom(range);
    assert.notEqual(first, second);
  });

  it('should pick same int with seed', function () {
    math.seedrandom('a');
    var first = math.randomInt(1, 100);
    math.seedrandom('a');
    var second = math.randomInt(1, 100);
    assert.equal(first, second);
  });

  it('should pick different int subsequent calls to seeded random', function () {
    math.seedrandom('a');
    var first = math.randomInt(1, 100);
    var second = math.randomInt(1, 100);
    assert.notEqual(first, second);
  });
});
