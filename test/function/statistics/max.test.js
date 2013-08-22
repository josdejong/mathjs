var assert = require('assert');
var math = require('../../../index.js');

describe('max', function() {

  it('should return the max between several numbers', function() {
    assert.equal(math.max(5), 5);
    assert.equal(math.max(3,1), 3);
    assert.equal(math.max(1,3), 3);
    assert.equal(math.max(1,3,5,2,-5), 5);
    assert.equal(math.max(0,0,0,0), 0);
  });

  it('should return the max string following lexical order', function() {
    assert.equal(math.max('A', 'C', 'D', 'B'), 'D');
  });

  it('should return the max element from a vector', function() {
    assert.equal(math.max(math.matrix([1,3,5,2,-5])), 5);
  });

  it('should return the max element from each vector on the last dimension', function() {
    assert.deepEqual(math.max([
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 9, 11]
    ]), [ 3, 9, 11]);
    assert.deepEqual(math.max(math.matrix([
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 9, 11]
    ])), math.matrix([ 3, 9, 11]));
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() {math.max()});
  });

  it('should throw an error if called with arguments of different types', function() {
    assert.throws(function() {math.max([5,2], 3)});
  });

  it('should throw an error if called with an empty array', function() {
    assert.throws(function() {math.max([])});
  });

});