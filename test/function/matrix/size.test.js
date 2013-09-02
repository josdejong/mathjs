// test size
var assert = require('assert');
var math = require('../../../index.js');

describe('size', function() {

  it('should calculate the size of an array', function() {
    assert.deepEqual(math.size([[1,2,3],[4,5,6]]), [2,3]);
    assert.deepEqual(math.size([[[1,2],[3,4]],[[5,6],[7,8]]]), [2,2,2]);
    assert.deepEqual(math.size([1,2,3]), [3]);
    assert.deepEqual(math.size([[1],[2],[3]]), [3,1]);
    assert.deepEqual(math.size(100), []);
    assert.deepEqual(math.size([100]), [1]);
    assert.deepEqual(math.size([[100]]), [1,1]);
    assert.deepEqual(math.size([[[100]]]), [1,1,1]);
    assert.deepEqual(math.size([]), [0]);
    assert.deepEqual(math.size([[]]), [1,0]);
    assert.deepEqual(math.size([[[]]]), [1,1,0]);
    assert.deepEqual(math.size([[[],[]]]), [1,2,0]);
  });

  it('should calculate the size of a matrix', function() {
    assert.deepEqual(math.size(math.matrix()), math.matrix([0]));
    assert.deepEqual(math.size(math.matrix([[1,2,3], [4,5,6]])), math.matrix([2,3]));
    assert.deepEqual(math.size(math.matrix([[], []])), math.matrix([2,0]));
  });

  it('should calculate the size of a range', function() {
    assert.deepEqual(math.size(math.range(2,6)), [4]);
  });

  it('should calculate the size of a scalar', function() {
    assert.deepEqual(math.size(math.complex(2,3)), []);
    assert.deepEqual(math.size(2), []);
    assert.deepEqual(math.size(true), []);
    assert.deepEqual(math.size(null), []);
  });

  it('should calculate the size of a string', function() {
    assert.deepEqual(math.size('hello'), [5]);
    assert.deepEqual(math.size(''), [0]);
  });

  // TODO: test whether math.size throws an error in case of invalid data or size

});
