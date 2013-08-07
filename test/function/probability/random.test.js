var assert = require('assert'),
    _ = require('underscore'),
    math = require('../../../src/index.js');

var assertApproxEqual = function(testVal, val, tolerance) {
  var diff = Math.abs(val - testVal);
  if (diff > tolerance) assert.equal(testVal, val);
  else assert.ok(diff <= tolerance)
};

var assertUniformDistribution = function(values, min, max) {
  var interval = (max - min) / 10, count;
  count = _.filter(values, function(val) { return val < min }).length;
  assert.equal(count, 0);
  count = _.filter(values, function(val) { return val > max }).length;
  assert.equal(count, 0);

  count = _.filter(values, function(val) { return val < (min + interval) }).length;
  assertApproxEqual(count/values.length, 0.1, 0.03);
  count = _.filter(values, function(val) { return val >= (min + interval) && val < (min + 2 * interval) }).length;
  assertApproxEqual(count/values.length, 0.1, 0.03);
  count = _.filter(values, function(val) { return val >= (min + 2 * interval) && val < (min + 3 * interval) }).length;
  assertApproxEqual(count/values.length, 0.1, 0.03);
  count = _.filter(values, function(val) { return val >= (min + 3 * interval) && val < (min + 4 * interval) }).length;
  assertApproxEqual(count/values.length, 0.1, 0.03);
  count = _.filter(values, function(val) { return val >= (min + 4 * interval) && val < (min + 5 * interval) }).length;
  assertApproxEqual(count/values.length, 0.1, 0.03);
  count = _.filter(values, function(val) { return val >= (min + 5 * interval) && val < (min + 6 * interval) }).length;
  assertApproxEqual(count/values.length, 0.1, 0.03);
  count = _.filter(values, function(val) { return val >= (min + 6 * interval) && val < (min + 7 * interval) }).length;
  assertApproxEqual(count/values.length, 0.1, 0.03);
  count = _.filter(values, function(val) { return val >= (min + 7 * interval) && val < (min + 8 * interval) }).length;
  assertApproxEqual(count/values.length, 0.1, 0.03);
  count = _.filter(values, function(val) { return val >= (min + 8 * interval) && val < (min + 9 * interval) }).length;
  assertApproxEqual(count/values.length, 0.1, 0.03);
  count = _.filter(values, function(val) { return val >= (min + 9 * interval) }).length;
  assertApproxEqual(count/values.length, 0.1, 0.03);
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

var testRandomFloat = function() {
  var picked = [], count;

  _.times(1000, function() {
    picked.push(math.random())
  });
  assertUniformDistribution(picked, 0, 1);
};

var testRandomFloatMinMax = function() {
  var picked = [], count;

  _.times(1000, function() {
    picked.push(math.random(-10, 10));
  });
  assertUniformDistribution(picked, -10, 10);
};

var testRandomMatrix = function() {
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
};

var testRandomMatrixMinMax = function() {
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
};

var testRandomInvalidArgs = function() {
  assert.throws(function() {
    math.random(1, 2, [4, 8]);
  });
  assert.throws(function() {
    math.random(1, 2, 3, 6);
  });
};

var testRandomIntMinMax = function() {
  var picked = [];

  _.times(10000, function() {
    picked.push(math.randomInt(-15, -5));
  });

  assertUniformDistributionInt(picked, -15, -5);
};

var testRandomIntMatrixMinMax = function() {
  var picked = [],
      matrices = [],
      size = [2, 3, 4],
      matrix;

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
};

var testRandomIntInvalidArgs = function() {
  assert.throws(function() {
    math.randomInt(1, 2, [4, 8]);
  })
  assert.throws(function() {
    math.randomInt(1, 2, 3, 6);
  })
}

var testPickRandom = function() {
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
};

var testRandomNormal = function() {
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
};

testRandomFloat();
testRandomFloatMinMax();
testRandomMatrix();
testRandomMatrixMinMax();
testRandomInvalidArgs();


testRandomIntMinMax();
testRandomIntMatrixMinMax();
testRandomIntInvalidArgs();

testPickRandom();

testRandomNormal();
