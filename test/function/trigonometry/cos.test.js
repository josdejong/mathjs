var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    cos = math.cos;

describe('cos', function() {
  it('should return the cosine of a boolean', function () {
    approx.equal(cos(true), 0.54030230586814);
    approx.equal(cos(false), 1);
  });

  it('should return the cosine of null', function () {
    approx.equal(cos(null), 1);
  });

  it('should return the cosine of a number', function() {
    approx.equal(cos(0), 1);
    approx.equal(cos(pi*1/4), 0.707106781186548);
    approx.equal(cos(pi*1/8), 0.923879532511287);
    approx.equal(cos(pi*2/4), 0);
    approx.equal(cos(pi*3/4), -0.707106781186548);
    approx.equal(cos(pi*4/4), -1);
    approx.equal(cos(pi*5/4), -0.707106781186548);
    approx.equal(cos(pi*6/4), 0);
    approx.equal(cos(pi*7/4), 0.707106781186548);
    approx.equal(cos(pi*8/4), 1);
    approx.equal(cos(pi/4), math.sqrt(2)/2);
    assert.ok(cos(complex('1e-50+1e-50i')).im != 0);
  });

  it('should return the cosine of a bignumber (downgrades to number)', function() {
    approx.equal(cos(math.bignumber(1)), 0.54030230586814);
  });

  it('should return the cosine of a complex number', function() {
    var re = 4.18962569096881,
        im = 9.10922789375534;
    approx.deepEqual(cos(complex('2+3i')), complex(-re, -im));
    approx.deepEqual(cos(complex('2-3i')), complex(-re, im));
    approx.deepEqual(cos(complex('-2+3i')), complex(-re, im));
    approx.deepEqual(cos(complex('-2-3i')), complex(-re, -im));
    approx.deepEqual(cos(complex('i')), complex(1.54308063481524, 0));
    approx.deepEqual(cos(complex('1')), complex(0.540302305868140, 0));
    approx.deepEqual(cos(complex('1+i')), complex(0.833730025131149, -0.988897705762865));
  });

  it('should return the cosine of an angle', function() {
    approx.equal(cos(unit('45deg')), 0.707106781186548);
    approx.equal(cos(unit('-135deg')), -0.707106781186548);
  });

  it('should throw an error if called with an invalid unit', function() {
    assert.throws(function () {cos(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {cos('string')});
  });

  var cos123 = [0.540302305868140, -0.41614683654714, -0.989992496600445];

  it('should return the cos of each element of a matrix', function() {
    approx.deepEqual(cos(matrix([1,2,3])), matrix(cos123));
  });

  it('should return the cos of each element of an array', function() {
    approx.deepEqual(cos([1,2,3]), cos123);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {cos()}, error.ArgumentsError);
    assert.throws(function () {cos(1, 2)}, error.ArgumentsError);
  });

});
