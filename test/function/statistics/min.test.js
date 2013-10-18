var assert = require('assert'),
    math = require('../../../index.js'),
    min = math.min;

describe('min', function() {

  it('should return the min between several numbers', function() {
    assert.equal(min(5), 5);
    assert.equal(min(1,3), 1);
    assert.equal(min(3,1), 1);
    assert.equal(min(1,3,5,-5,2), -5);
    assert.equal(min(0,0,0,0), 0);
  });

  it('should return the min string following lexical order', function() {
    assert.equal(min('A', 'C', 'D', 'B'), 'A');
  });

  it('should return the min element from a vector', function() {
    assert.equal(min([1,3,5,-5,2]), -5);
  });

  it('should return the min element from a vector array', function() {
    assert.equal(min(math.matrix([1,3,5,-5,2])), -5);
  });

  it('should return the max element from a 2d matrix', function() {
    assert.deepEqual(min([
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 9, 11]
    ]), -1);
    assert.deepEqual(min(math.matrix([
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 9, 11]
    ])), -1);
  });

  it('should throw an error when called with complex numbers', function() {
    assert.throws(function () {min(math.complex(2,3), math.complex(2,1))}, TypeError);
    assert.throws(function () {min(math.complex(2,3), math.complex(2,5))}, TypeError);

    assert.throws(function () {min(math.complex(3,4), 4)}, TypeError);
    assert.throws(function () {min(math.complex(3,4), 5)}, TypeError);
    assert.throws(function () {min(5, math.complex(3,4))}, TypeError);
    assert.throws(function () {min(math.complex(3,4), 6)}, TypeError);
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() {min()});
  });

  it('should throw an error if called with an empty array', function() {
    assert.throws(function() {min([])});
  });

});