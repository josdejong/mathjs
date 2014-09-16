// test atan2
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    acos = math.acos,
    atan = math.atan,
    asin = math.asin,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    divide = math.divide,
    round = math.round,
    sec = math.sec,
    csc = math.csc,
    cot = math.cot,
    sin = math.sin,
    cos = math.cos,
    tan = math.tan,
    atan2 = math.atan2;

describe('atan2', function() {

  it('should calculate atan2 correctly', function() {
    approx.equal(atan2(0, 0) / pi, 0);
    approx.equal(atan2(0, 1) / pi, 0);
    approx.equal(atan2(1, 1) / pi, 0.25);
    approx.equal(atan2(1, 0) / pi, 0.5);
    approx.equal(atan2(1, -1) / pi, 0.75);
    approx.equal(atan2(0, -1) / pi, 1);
    approx.equal(atan2(-1, -1) / pi, -0.75);
    approx.equal(atan2(-1, 0) / pi, -0.5);
    approx.equal(atan2(-1, 1) / pi, -0.25);
  });

  it('should calculate atan2 for booleans', function() {
    assert.equal(atan2(true, true), 0.25 * pi);
    assert.equal(atan2(true, false), 0.5 * pi);
    assert.equal(atan2(false, true), 0);
    assert.equal(atan2(false, false), 0);
  });

  it('should calculate atan2 with mixed numbers and booleans', function() {
    assert.equal(atan2(1, true), 0.25 * pi);
    assert.equal(atan2(1, false), 0.5 * pi);
    assert.equal(atan2(true, 1), 0.25 * pi);
    assert.equal(atan2(false, 1), 0);
  });

  it('should calculate atan2 with mixed numbers and null', function() {
    assert.equal(atan2(1, null), 0.5 * pi);
    assert.equal(atan2(null, 1), 0);
  });

  it('should return the arctan of for bignumbers (downgrades to number)', function() {
    approx.equal(atan2(math.bignumber(1), math.bignumber(1)), pi / 4);
  });

  it('should return the arctan of for mixed numbers and bignumbers (downgrades to number)', function() {
    approx.equal(atan2(1, math.bignumber(1)), pi / 4);
    approx.equal(atan2(math.bignumber(1), 1), pi / 4);
  });

  it('should throw an error if called with a complex', function() {
    assert.throws(function () {atan2(complex('2+3i'), complex('1-2i')); });
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {atan2('string', 1)});
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {atan2(unit('5cm'), 1)});
  });

  it('should calculate the atan2 element-wise for arrays and matrices', function() {
    // array, matrix, range
    approx.deepEqual(divide(atan2([1,0,-1], [1,0,-1]), pi), [0.25, 0, -0.75]);
    approx.deepEqual(divide(atan2(
        matrix([1,0,-1]),
        matrix([1,0,-1])), pi),
        matrix([0.25, 0, -0.75]));
    approx.equal(atan2(0, 2) / pi, 0);
    approx.equal(atan2(0, -2) / pi, 1);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {atan2(1)}, error.ArgumentsError);
    assert.throws(function () {atan2(1, 2, 3)}, error.ArgumentsError);
  });

});