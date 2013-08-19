var assert = require('assert'),
    seed = require('seed-random'),
    _ = require('underscore'),
    math = require('../../../index.js');

var assertApproxEqual = function(testVal, val, tolerance) {
  var diff = Math.abs(val - testVal);
  if (diff > tolerance) assert.equal(testVal, val);
  else assert.ok(diff <= tolerance)
};

var assertUniformDistribution = function(values, min, max) {
  var interval = (max - min) / 10
    , count, i;
  count = _.filter(values, function(val) { return val < min }).length;
  assert.equal(count, 0);
  count = _.filter(values, function(val) { return val > max }).length;
  assert.equal(count, 0);

  for (i = 0; i < 10; i++) {
    count = _.filter(values, function(val) {
      return val >= (min + i * interval) && val < (min + (i + 1) * interval)
    }).length;
    assertApproxEqual(count/values.length, 0.1, 0.03);
  }
};

var assertUniformDistributionInt = function(values, min, max) {
  var range = _.range(Math.floor(min), Math.floor(max)), count;

  values.forEach(function(val) {
    assert.ok(_.contains(range, val));
  });

  range.forEach(function(val) {
    count = _.filter(values, function(testVal) { return testVal === val }).length;
    assertApproxEqual(count/values.length, 1/range.length, 0.03);
  });
};

describe('distribution', function () {
  var originalRandom;

  before(function () {
    // replace the original Math.random with a reproducible one
    originalRandom = Math.random;
    Math.random = seed('someconstantkey');
  });

  after(function () {
    // restore the original random function
    Math.random = originalRandom;
  });

  describe('random', function() {
    var originalRandom;

    it('should pick uniformely distributed numbers in [0, 1]', function() {
      var picked = [], count;

      _.times(1000, function() {
        picked.push(math.random())
      });
      assertUniformDistribution(picked, 0, 1);
    });


    it('should pick uniformely distributed numbers in [min, max]', function() {
      var picked = [], count;

      _.times(1000, function() {
        picked.push(math.random(-10, 10));
      });
      assertUniformDistribution(picked, -10, 10);
    });

    it('should pick uniformely distributed random matrix, with elements in [0, 1]', function() {
      var picked = [],
          matrices = [],
          size = [2, 3, 4],
          count, matrix;

      _.times(100, function() {
        matrices.push(math.random(size));
      });

      // Collect all values in one array
      matrices.forEach(function(matrix) {
        assert.deepEqual(matrix.size(), size);
        matrix.forEach(function(val) {
          picked.push(val);
        })
      });
      assert.equal(picked.length, 2 * 3 * 4 * 100);

      assertUniformDistribution(picked, 0, 1);
    });

    it('should pick uniformely distributed random matrix, with elements in [min, max]', function() {
      var picked = [],
          matrices = [],
          size = [2, 3, 4],
          matrix;

      _.times(100, function() {
        matrices.push(math.random(size, -103, 8));
      });

      // Collect all values in one array
      matrices.forEach(function(matrix) {
        assert.deepEqual(matrix.size(), size);
        matrix.forEach(function(val) {
          picked.push(val);
        })
      });
      assert.equal(picked.length, 2 * 3 * 4 * 100);
      assertUniformDistribution(picked, -103, 8);
    });

    it('should throw an error if called with invalid arguments', function() {
      assert.throws(function() { math.random(1, 2, [4, 8]); });
      assert.throws(function() { math.random(1, 2, 3, 6); });
    });

  });

  describe('randomInt', function() {

    it('should pick uniformely distributed integers in [min, max)', function() {
      var picked = [];

      _.times(10000, function() {
        picked.push(math.randomInt(-15, -5));
      });

      assertUniformDistributionInt(picked, -15, -5);
    });

    it('should pick uniformely distributed random matrix, with elements in [min, max)', function() {
      var picked = [],
          matrices = [],
          size = [2, 3, 4];

      _.times(1000, function() {
        matrices.push(math.randomInt(size, -14.9, -2));
      });

      // Collect all values in one array
      matrices.forEach(function(matrix) {
        assert.deepEqual(matrix.size(), size);
        matrix.forEach(function(val) {
          picked.push(val)
        });
      });
      assert.equal(picked.length, 2 * 3 * 4 * 1000);
      assertUniformDistributionInt(picked, -14.9, -2);
    });

    it('should throw an error if called with invalid arguments', function() {
      assert.throws(function() {
        math.randomInt(1, 2, [4, 8]);
      });

      assert.throws(function() {
        math.randomInt(1, 2, 3, 6);
      });
    });

  });

  describe('pickRandom', function() {

    it('should pick numbers from the given array following an uniform distribution', function() {
      var possibles = [11, 22, 33, 44, 55],
          picked = [],
          count;

      _.times(1000, function() {
        picked.push(math.pickRandom(possibles));
      });

      count = _.filter(picked, function(val) { return val === 11 }).length;
      assert.equal(math.round(count/picked.length, 1), 0.2);

      count = _.filter(picked, function(val) { return val === 22 }).length;
      assert.equal(math.round(count/picked.length, 1), 0.2);

      count = _.filter(picked, function(val) { return val === 33 }).length;
      assert.equal(math.round(count/picked.length, 1), 0.2);

      count = _.filter(picked, function(val) { return val === 44 }).length;
      assert.equal(math.round(count/picked.length, 1), 0.2);

      count = _.filter(picked, function(val) { return val === 55 }).length;
      assert.equal(math.round(count/picked.length, 1), 0.2);
    });

  });

  describe('distribution.normal', function() {

    it('should pick numbers in [0, 1] following a normal distribution', function() {
      var picked = [], count, distribution = math.distribution('normal');

      _.times(100000, function() {
        picked.push(distribution.random())
      });
      count = _.filter(picked, function(val) { return val < 0 }).length;
      assert.equal(count, 0);
      count = _.filter(picked, function(val) { return val > 1 }).length;
      assert.equal(count, 0);

      count = _.filter(picked, function(val) { return val < 0.25 }).length;
      assertApproxEqual(count/picked.length, 0.07, 0.01);
      count = _.filter(picked, function(val) { return val < 0.4 }).length;
      assertApproxEqual(count/picked.length, 0.27, 0.01);
      count = _.filter(picked, function(val) { return val < 0.5 }).length;
      assertApproxEqual(count/picked.length, 0.5, 0.01);
      count = _.filter(picked, function(val) { return val < 0.6 }).length;
      assertApproxEqual(count/picked.length, 0.73, 0.01);
      count = _.filter(picked, function(val) { return val < 0.75 }).length;
      assertApproxEqual(count/picked.length, 0.93, 0.01);
    });

  });

});
