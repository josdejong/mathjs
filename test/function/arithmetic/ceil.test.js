// test ceil
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    range = math.range,
    ceil = math.ceil;

describe('ceil', function() {
  it('should return the ceil of a boolean', function () {
    assert.equal(ceil(true), 1);
    assert.equal(ceil(false), 0);
  });

  it('should return the ceil of null', function () {
    assert.equal(math.ceil(null), 0);
  });

  it('should return the ceil of a number', function() {
    approx.equal(ceil(0), 0);
    approx.equal(ceil(1), 1);
    approx.equal(ceil(1.3), 2);
    approx.equal(ceil(1.8), 2);
    approx.equal(ceil(2), 2);
    approx.equal(ceil(-1), -1);
    approx.equal(ceil(-1.3), -1);
    approx.equal(ceil(-1.8), -1);
    approx.equal(ceil(-2), -2);
    approx.equal(ceil(-2.1), -2);
    approx.deepEqual(ceil(math.pi), 4);
  });

  it('should return the ceil of a big number', function () {
    assert.deepEqual(ceil(bignumber(0)), bignumber(0));
    assert.deepEqual(ceil(bignumber(1)), bignumber(1));
    assert.deepEqual(ceil(bignumber(1.3)), bignumber(2));
    assert.deepEqual(ceil(bignumber(1.8)), bignumber(2));
    assert.deepEqual(ceil(bignumber(2)), bignumber(2));
    assert.deepEqual(ceil(bignumber(-1)), bignumber(-1));
    assert.deepEqual(ceil(bignumber(-1.3)), bignumber(-1));
    assert.deepEqual(ceil(bignumber(-1.8)), bignumber(-1));
    assert.deepEqual(ceil(bignumber(-2)), bignumber(-2));
    assert.deepEqual(ceil(bignumber(-2.1)), bignumber(-2));
  });

  it('should return the ceil of real and imag part of a complex', function() {
    approx.deepEqual(ceil(complex(0, 0)), complex(0, 0));
    approx.deepEqual(ceil(complex(1.3, 1.8)), complex(2, 2));
    approx.deepEqual(ceil(math.i), complex(0, 1));
    approx.deepEqual(ceil(complex(-1.3, -1.8)), complex(-1, -1));
  });


  it('should throw an error for units', function() {
    assert.throws(function () {ceil(unit('5cm'))}, TypeError, 'Function ceil(unit) not supported');
  });


  it('should throw an error for strings', function() {
    assert.throws(function () {ceil('hello world')}, TypeError, 'Function ceil(string) not supported');
  });

  it('should ceil each element in a matrix, array or range', function() {
    approx.deepEqual(ceil([1.2, 3.4, 5.6, 7.8, 10.0]), [2, 4, 6, 8, 10]);
    approx.deepEqual(ceil(matrix([1.2, 3.4, 5.6, 7.8, 10.0])), matrix([2, 4, 6, 8, 10]));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {ceil()}, error.ArgumentsError);
    assert.throws(function () {ceil(1, 2)}, error.ArgumentsError);
  });

});
