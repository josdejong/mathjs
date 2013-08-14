// test ones
var assert = require('assert');
var math = require('../../../lib/index.js'),
    ones = math.ones;

describe('ones', function() {

  it('should create a scalar', function () {
    assert.deepEqual(ones(), 1);
    assert.deepEqual(ones([]), 1);
  });

  it('should create a vector with ones', function () {
    assert.deepEqual(ones(3), [1,1,1]);
    assert.deepEqual(ones([4]), [1,1,1,1]);
    assert.deepEqual(ones(0), []);
  });

  it('should create a 2D matrix with ones from an array', function () {
    assert.deepEqual(ones(2,3), [[1,1,1],[1,1,1]]);
    assert.deepEqual(ones(3,2), [[1,1],[1,1],[1,1]]);
    assert.deepEqual(ones([3,2]), [[1,1],[1,1],[1,1]]);
  });

  it('should create a matrix with ones from a matrix', function () {
    assert.deepEqual(ones(math.matrix([3])), math.matrix([1,1,1]));
    assert.deepEqual(ones(math.matrix([3,2])), math.matrix([[1,1],[1,1],[1,1]]));

    // TODO: do we want to support the following? maybe better not
    assert.deepEqual(ones(math.matrix([[[3]],[[2]]])), math.matrix([[1,1],[1,1],[1,1]]));
  });

  it('should create a 3D matrix with ones', function () {
    assert.deepEqual(ones(2,3,4), [
      [
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1]
      ],
      [
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1]
      ]
    ]);
    assert.deepEqual(ones([2,3,4]), [
      [
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1]
      ],
      [
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1]
      ]
    ]);
  });

  it('should create a matrix with ones with the same size as original matrix', function () {
    var a = math.matrix([[1, 2, 3], [4, 5, 6]]);
    assert.deepEqual(ones(math.size(a)).size(), a.size());
  });

  // TODO: test with invalid input

});