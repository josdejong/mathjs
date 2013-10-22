var assert = require('assert');
var math = require('../../../index.js');

describe('mean', function() {

  it('should return the mean value of some numbers', function() {
    assert.equal(math.mean(5), 5);
    assert.equal(math.mean(3,1), 2);
    assert.equal(math.mean(0,3), 1.5);
    assert.equal(math.mean(1,3,5,2,-5), 1.2);
    assert.equal(math.mean(0,0,0,0), 0);
  });

  it('should return the mean value for complex values', function() {
    assert.deepEqual(math.mean(math.complex(2,3), math.complex(2,1)), math.complex(2,2));
    assert.deepEqual(math.mean(math.complex(2,3), math.complex(2,5)), math.complex(2,4));
  });

  it('should return the mean value for mixed real and complex values', function() {
    assert.deepEqual(math.mean(math.complex(2,4), 4), math.complex(3,2));
    assert.deepEqual(math.mean(4, math.complex(2,4)), math.complex(3,2));
  });

  it('should return the mean value from a vector', function() {
    assert.equal(math.mean(math.matrix([1,3,5,2,-5])), 1.2);
  });

  it('should return the mean for each vector on the last dimension', function() {
    assert.deepEqual(math.mean([
      [ 2, 4],
      [ 6, 8]
    ]), 5);
    assert.deepEqual(math.mean(math.matrix([
      [ 2, 4],
      [ 6, 8]
    ])), 5);
  });

  it('should return the mean value along a dimension on a matrix', function() {
	  assert.deepEqual(math.mean([
			  [2, 6],
			  [4, 10]],2), [4, 7]);
	  assert.deepEqual(math.mean([
			  [2, 6],
			  [4, 10]],1), [3, 8]);
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() {math.mean()});
  });

  it('should throw an error if called with an empty array', function() {
    assert.throws(function() {math.mean([])});
  });

});
