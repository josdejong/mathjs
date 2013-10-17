var assert = require('assert');
var math = require('../../../index.js');

describe('min', function() {

  it('should return the min between several numbers', function() {
    assert.equal(math.min(5), 5);
    assert.equal(math.min(1,3), 1);
    assert.equal(math.min(3,1), 1);
    assert.equal(math.min(1,3,5,-5,2), -5);
    assert.equal(math.min(0,0,0,0), 0);
  });

  it('should return the min string following lexical order', function() {
    assert.equal(math.min('A', 'C', 'D', 'B'), 'A');
  });

  it('should return the min element from a vector', function() {
    assert.equal(math.min([1,3,5,-5,2]), -5);
  });

  it('should return the min element from a vector array', function() {
    assert.equal(math.min(math.matrix([1,3,5,-5,2])), -5);
  });

  it('should return the max element from each vector on the last dimension', function() {
    assert.deepEqual(math.min([
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 9, 11]
    ]), [-1, 0,  5]);
    assert.deepEqual(math.min(math.matrix([
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 9, 11]
    ])), math.matrix([-1, 0, 5]));
  });

  it('should throw an error when called with complex numbers', function() {
    assert.throws(function () {math.min(math.complex(2,3), math.complex(2,1))}, TypeError);
    assert.throws(function () {math.min(math.complex(2,3), math.complex(2,5))}, TypeError);

    assert.throws(function () {math.min(math.complex(3,4), 4)}, TypeError);
    assert.throws(function () {math.min(math.complex(3,4), 5)}, TypeError);
    assert.throws(function () {math.min(5, math.complex(3,4))}, TypeError);
    assert.throws(function () {math.min(math.complex(3,4), 6)}, TypeError);
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() {math.min()});
  });

  it('should throw an error if called with arguments of different types', function() {
    assert.throws(function() {math.min([5,2], 3)});
  });

  it('should throw an error if called with an empty array', function() {
    assert.throws(function() {math.min([])});
  });

});