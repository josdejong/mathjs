// test size
var assert = require('assert'),
    math = require('../../../index')(),
    matrix = math.matrix;

describe('size', function() {

  it('should calculate the size of an array', function() {
    assert.deepEqual(math.size([[1,2,3],[4,5,6]]), [2,3]);
    assert.deepEqual(math.size([[[1,2],[3,4]],[[5,6],[7,8]]]), [2,2,2]);
    assert.deepEqual(math.size([1,2,3]), [3]);
    assert.deepEqual(math.size([[1],[2],[3]]), [3,1]);
    assert.deepEqual(math.size([100]), [1]);
    assert.deepEqual(math.size([[100]]), [1,1]);
    assert.deepEqual(math.size([[[100]]]), [1,1,1]);
    assert.deepEqual(math.size([]), [0]);
    assert.deepEqual(math.size([[]]), [1,0]);
    assert.deepEqual(math.size([[[]]]), [1,1,0]);
    assert.deepEqual(math.size([[[],[]]]), [1,2,0]);
  });

  it('should calculate the size of a matrix', function() {
    assert.deepEqual(math.size(matrix()), matrix([0]));
    assert.deepEqual(math.size(matrix([[1,2,3], [4,5,6]])), matrix([2,3]));
    assert.deepEqual(math.size(matrix([[], []])), matrix([2,0]));
  });

  it('should calculate the size of a range', function() {
    assert.deepEqual(math.size(math.range(2,6)), matrix([4]));
  });

  it('should calculate the size of a scalar', function() {
    assert.deepEqual(math.size(2), matrix([]));
    assert.deepEqual(math.size(math.bignumber(2)), matrix([]));
    assert.deepEqual(math.size(math.complex(2,3)), matrix([]));
    assert.deepEqual(math.size(true), matrix([]));
    assert.deepEqual(math.size(null), matrix([]));
  });

  it('should calculate the size of a string', function() {
    assert.deepEqual(math.size('hello'), matrix([5]));
    assert.deepEqual(math.size(''), matrix([0]));
  });

  // TODO: test whether math.size throws an error in case of invalid data or size

});
