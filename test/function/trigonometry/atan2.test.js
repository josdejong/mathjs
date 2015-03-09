// test atan2
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    divide = math.divide,
    atan2 = math.atan2,
    bigmath = math.create({precision: 20}),
    Big = bigmath.bignumber,
    atan2Big = bigmath.atan2;

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

  it('should return the arctan of for bignumbers', function() {
    assert.deepEqual(atan2Big(Big(0), Big(0)), Big(NaN));
    assert.deepEqual(atan2Big(Big(0), Big(1)), Big(0));
    assert.deepEqual(atan2Big(Big(1), Big(1)), Big('0.7853981633974483096'));
    assert.deepEqual(atan2Big(Big(1), Big(0)), Big('1.5707963267948966192'));
    assert.deepEqual(atan2Big(Big(1), Big(-1)), Big('2.3561944901923449288'));
    assert.deepEqual(atan2Big(Big(0), Big(-1)), Big('3.1415926535897932385'));
    assert.deepEqual(atan2Big(Big(-1), Big(-1)), Big('-2.3561944901923449288'));
    assert.deepEqual(atan2Big(Big(-1), Big(0)), Big('-1.5707963267948966192'));
    assert.deepEqual(atan2Big(Big(-1), Big(1)), Big('-0.7853981633974483096'));
  });

  it('should return the arctan of for mixed numbers and bignumbers', function() {
    assert.deepEqual(atan2Big(1, Big(1)), Big('0.7853981633974483096'));
    assert.deepEqual(atan2Big(Big(1), 1), Big('0.7853981633974483096'));
  });

  it('should return the arctan of for mixed bignumbers and booleans', function() {
    assert.deepEqual(atan2Big(Big(1), true), Big('0.7853981633974483096'));
    assert.deepEqual(atan2Big(Big(1), false), Big('1.5707963267948966192'));
    assert.deepEqual(atan2Big(true, Big(1)), Big('0.7853981633974483096'));
    assert.deepEqual(atan2Big(false, Big(1)), Big(0));
  });

  it('should calculate atan2 with mixed bignumbers and null', function() {
    assert.deepEqual(atan2Big(Big(1), null), Big('1.5707963267948966192'));
    assert.deepEqual(atan2Big(null, Big(1)), Big(0));
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
