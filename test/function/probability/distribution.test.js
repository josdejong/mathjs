var assert = require('assert');
var error = require('../../../lib/error/index');
var seed = require('seed-random');
var _ = require('underscore');
var math = require('../../../index');
math.import(require('../../../lib/function/probability/distribution'));

var Matrix = math.type.Matrix;
var distribution = math.distribution;

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
    assertApproxEqual(count/values.length, 0.1, 0.02);
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
  var originalRandom, uniformDistrib;

  before(function () {
    // replace the original Math.random with a reproducible one
    originalRandom = Math.random;
    Math.random = seed('key');
  });

  after(function () {
    // restore the original random function
    Math.random = originalRandom;
  });

  beforeEach(function() {
    uniformDistrib = distribution('uniform')
  });

  describe('random', function() {
    var originalRandom;

    it('should pick uniformly distributed numbers in [0, 1]', function() {
      var picked = [];

      _.times(1000, function() {
        picked.push(uniformDistrib.random())
      });
      assertUniformDistribution(picked, 0, 1);
    });


    it('should pick uniformly distributed numbers in [min, max]', function() {
      var picked = [];

      _.times(1000, function() {
        picked.push(uniformDistrib.random(-10, 10));
      });
      assertUniformDistribution(picked, -10, 10);
    });

    it('should pick uniformly distributed random array, with elements in [0, 1]', function() {
      var picked = [],
          matrices = [],
          size = [2, 3, 4];

      _.times(100, function() {
        matrices.push(uniformDistrib.random(size));
      });

      // Collect all values in one array
      matrices.forEach(function(matrix) {
        assert(Array.isArray(matrix));
        assert.deepEqual(math.size(matrix), size);
        math.forEach(matrix, function(val) {
          picked.push(val);
        })
      });
      assert.equal(picked.length, 2 * 3 * 4 * 100);

      assertUniformDistribution(picked, 0, 1);
    });

    it('should pick uniformly distributed random array, with elements in [0, max]', function() {
      var picked = [],
          matrices = [],
          size = [2, 3, 4];

      _.times(100, function() {
        matrices.push(uniformDistrib.random(size, 8));
      });

      // Collect all values in one array
      matrices.forEach(function(matrix) {
        assert(Array.isArray(matrix));
        assert.deepEqual(math.size(matrix), size);
        math.forEach(matrix, function(val) {
          picked.push(val);
        })
      });
      assert.equal(picked.length, 2 * 3 * 4 * 100);

      assertUniformDistribution(picked, 0, 8);
    });

    it('should pick uniformly distributed random matrix, with elements in [0, 1]', function() {
      var picked = [],
          matrices = [],
          size = math.matrix([2, 3, 4]);

      _.times(100, function() {
        matrices.push(uniformDistrib.random(size));
      });

      // Collect all values in one array
      matrices.forEach(function(matrix) {
        assert(matrix instanceof Matrix);
        assert.deepEqual(matrix.size(), size.valueOf());
        matrix.forEach(function(val) {
          picked.push(val);
        })
      });
      assert.equal(picked.length, 2 * 3 * 4 * 100);

      assertUniformDistribution(picked, 0, 1);
    });

    it('should pick uniformly distributed random array, with elements in [min, max]', function() {
      var picked = [],
          matrices = [],
          size = [2, 3, 4];

      _.times(100, function() {
        matrices.push(uniformDistrib.random(size, -103, 8));
      });

      // Collect all values in one array
      matrices.forEach(function(matrix) {
        assert.deepEqual(math.size(matrix), size);
        math.forEach(matrix, function(val) {
          picked.push(val);
        })
      });
      assert.equal(picked.length, 2 * 3 * 4 * 100);
      assertUniformDistribution(picked, -103, 8);
    });

    it.skip ('should throw an error if called with invalid arguments', function() {
      assert.throws(function() { uniformDistrib.random(1, 2, [4, 8]); });
      assert.throws(function() { uniformDistrib.random(1, 2, 3, 6); });

      assert.throws( function () {uniformDistrib.random('str', 10)} );
      assert.throws( function () {uniformDistrib.random(math.bignumber(-10), 10)} );
    });

  });

  describe('randomInt', function() {

    it('should pick uniformly distributed integers in [min, max)', function() {
      var picked = [];

      _.times(10000, function() {
        picked.push(uniformDistrib.randomInt(-15, -5));
      });

      assertUniformDistributionInt(picked, -15, -5);
    });

    it('should pick uniformly distributed random array, with elements in [min, max)', function() {
      var picked = [],
          matrices = [],
          size = [2, 3, 4];

      _.times(1000, function() {
        matrices.push(uniformDistrib.randomInt(size, -14.9, -2));
      });

      // Collect all values in one array
      matrices.forEach(function(matrix) {
        assert.deepEqual(math.size(matrix), size);
        math.forEach(matrix, function(val) {
          picked.push(val)
        });
      });
      assert.equal(picked.length, 2 * 3 * 4 * 1000);
      assertUniformDistributionInt(picked, -14.9, -2);
    });

    it('should throw an error if called with invalid arguments', function() {
      assert.throws(function() {
        uniformDistrib.randomInt(1, 2, [4, 8]);
      });

      assert.throws(function() {
        uniformDistrib.randomInt(1, 2, 3, 6);
      });
    });

  });

  describe('pickRandom', function() {

    it('should pick numbers from the given array following an uniform distribution', function() {
      var possibles = [11, 22, 33, 44, 55],
          picked = [],
          count;

      _.times(1000, function() {
        picked.push(uniformDistrib.pickRandom(possibles));
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

    it('should pick numbers from the given matrix following an uniform distribution', function() {
      var possibles = math.matrix([11, 22, 33, 44, 55]),
          picked = [],
          count;

      _.times(1000, function() {
        picked.push(uniformDistrib.pickRandom(possibles));
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

    it('should throw an error when providing a multi dimensional matrix', function() {
      assert.throws(function () {
        uniformDistrib.pickRandom(math.matrix([[1,2], [3,4]]));
      }, /Only one dimensional vectors supported/);
    });
  });

  describe('distribution.normal', function() {

    it('should pick numbers in [0, 1] following a normal distribution', function() {
      var picked = [], count, dist = distribution('normal');

      _.times(100000, function() {
        picked.push(dist.random())
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

  it('should throw an error in case of unknown distribution name', function() {
    assert.throws(function () {
      distribution('non-existing');
    }, /Unknown distribution/)
  });

  it('created random functions should throw an error in case of wrong number of arguments', function() {
    var dist = distribution('uniform');
    assert.throws(function () {dist.random([2,3], 10, 100, 12); }, error.ArgumentsError);
    assert.throws(function () {dist.randomInt([2,3], 10, 100, 12); }, error.ArgumentsError);
    assert.throws(function () {dist.pickRandom(); }, error.ArgumentsError);
    assert.throws(function () {dist.pickRandom([], 23); }, error.ArgumentsError);
  });

  it('created random functions should throw an error in case of wrong type of arguments', function() {
    var dist = distribution('uniform');
    assert.throws(function () {dist.pickRandom(23); }, error.TypeError);
    // TODO: more type testing...
  });

  it('should LaTeX distribution', function () {
    var expression = math.parse('distribution("normal")');
    assert.equal(expression.toTex(), '\\mathrm{distribution}\\left(\\mathtt{"normal"}\\right)');
  });
});
