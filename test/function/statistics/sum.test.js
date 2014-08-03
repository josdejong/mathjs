var assert = require('assert'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    sum = math.sum;

describe('sum', function() {

  it('should return the sum of numbers', function() {
    assert.equal(sum(5), 5);
    assert.equal(sum(3,1), 4);
    assert.equal(sum(1,3), 4);
    assert.equal(sum(1,3,5,2), 11);
    assert.equal(sum(0,0,0,0), 0);
  });

  it('should return the sum of big numbers', function() {
    assert.deepEqual(sum(bignumber(1),bignumber(3),bignumber(5),bignumber(2)),
        bignumber(11));
  });

  it('should return the sum of strings (concatenates the strings)', function() {
    assert.equal(sum('A', 'C', 'D', 'B'), 'ACDB');
    assert.equal(sum([['A', 'C'], ['D', 'B']]), 'ACDB');
  });

  it('should return the sum of complex numbers', function() {
    assert.deepEqual(sum(math.complex(2,3), math.complex(-1,2)), math.complex(1,5));
  });

  it('should return the sum of mixed numbers and complex numbers', function() {
    assert.deepEqual(sum(2, math.complex(-1,3)), math.complex(1,3));
  });

  it('should return the sum from an array', function() {
    assert.equal(sum([1,3,5,2,-5]), 6);
  });

  it('should return the sum of units', function() {
    assert.deepEqual(sum([math.unit('5mm'), math.unit('10mm'), math.unit('15mm')]), math.unit('30mm'));
  });

  it('should return the sum from an 1d matrix', function() {
    assert.equal(sum(math.matrix([1,3,5,2,-5])), 6);
  });

  it('should return the sum element from a 2d array', function() {
    assert.deepEqual(sum([
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 11, 9]
    ]), 39);
  });

  it('should return the sum element from a 2d matrix', function() {
    assert.deepEqual(sum(math.matrix([
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 11, 9]
    ])), 39);
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() {sum()});
    assert.throws(function() {sum([], 2, 3)});
  });

  it('should throw an error if called with not yet supported argument dim', function() {
    assert.throws(function() {sum([], 2)}, /not yet supported/);
  });

  it('should throw an error if called with an empty array', function() {
    assert.throws(function() {sum([])});
  });

});
