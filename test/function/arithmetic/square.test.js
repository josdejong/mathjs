// test square
var assert = require('assert'),
    math = require('../../../index'),
    error = require('../../../lib/error/index'),
    unit = math.unit,
    bignumber = math.bignumber,
    matrix = math.matrix,
    range = math.range,
    square = math.square;

describe('square', function() {
  it('should return the square of a boolean', function () {
    assert.equal(square(true), 1);
    assert.equal(square(false), 0);
  });

  it('should return the square of null', function () {
    assert.equal(square(null), 0);
  });

  it('should return the square of a number', function() {
    assert.equal(square(4), 16);
    assert.equal(square(-2), 4);
    assert.equal(square(0), 0);
  });

  it('should return the cube of a big number', function() {
    assert.deepEqual(square(bignumber(4)), bignumber(16));
    assert.deepEqual(square(bignumber(-2)), bignumber(4));
    assert.deepEqual(square(bignumber(0)), bignumber(0));
  });

  it('should throw an error if used with wrong number of arguments', function() {
    assert.throws(function () {square()}, error.ArgumentsError);
    assert.throws(function () {square(1, 2)}, error.ArgumentsError);
  });

  it('should return the square of a complex number', function() {
    assert.deepEqual(square(math.complex('2i')), math.complex('-4'));
    assert.deepEqual(square(math.complex('2+3i')), math.complex('-5+12i'));
    assert.deepEqual(square(math.complex('2')), math.complex('4'));
  });

  it('should throw an error when used with a unit', function() {
    assert.throws(function () {square(unit('5cm'))});
  });

  it('should throw an error when used with a string', function() {
    assert.throws(function () {square('text')});
  });

  it('should return the square of each element in a matrix', function() {
    assert.deepEqual(square([2,3,4,5]), [4,9,16,25]);
    assert.deepEqual(square(matrix([2,3,4,5])), matrix([4,9,16,25]));
    assert.deepEqual(square(matrix([[1,2],[3,4]])), matrix([[1,4],[9,16]]));
  });

});