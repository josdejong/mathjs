var assert = require('assert'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    prod = math.prod;

describe('prod', function() {

  it('should return the product of numbers', function() {
    assert.equal(prod(5), 5);
    assert.equal(prod(3,2), 6);
    assert.equal(prod(1,3,5,2), 30);
    assert.equal(prod(1,3,0,2), 0);
    assert.equal(prod(0,0,0,0), 0);
  });

  it('should return the product of big numbers', function() {
    assert.deepEqual(prod(bignumber(1),bignumber(3),bignumber(5),bignumber(2)),
        bignumber(30));
  });

  it('should return the product of complex numbers', function() {
    assert.deepEqual(prod(math.complex(2,3), math.complex(-1,2)), math.complex(-8,1));
  });

  it('should return the product of mixed numbers and complex numbers', function() {
    assert.deepEqual(prod(2, math.complex(2,3)), math.complex(4,6));
  });

  it('should return the prod from an array', function() {
    assert.equal(prod([1,3,5,2]), 30);
  });

  it('should return the prod from an 1d matrix', function() {
    assert.equal(prod(math.matrix([1,3,5,2])), 30);
  });

  it('should return the prod element from a 2d array', function() {
    assert.deepEqual(prod([
      [ 1, 7, 2],
      [ 3, 5, 4]
    ]), 840);
  });

  it('should return the prod element from a 2d matrix', function() {
    assert.deepEqual(prod(math.matrix([
      [ 1, 7, 2],
      [ 3, 5, 4]
    ])), 840);
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() {prod()});
    assert.throws(function() {prod([], 2, 3)});
  });

  it('should throw an error if called with not yet supported argument dim', function() {
    assert.throws(function() {prod([], 2)}, /not yet supported/);
  });

  it('should throw an error if called with an empty array', function() {
    assert.throws(function() {prod([])});
  });

});
