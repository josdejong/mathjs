// test ones
var assert = require('assert'),
    math = require('../../../index')(),
    ones = math.ones,
    matrix = math.matrix;

describe('ones', function() {

  it('should create an empty matrix', function () {
    assert.deepEqual(ones(), matrix());
    assert.deepEqual(ones([]), []);
    assert.deepEqual(ones(matrix([])), matrix());
  });

  it('should create a vector with ones', function () {
    assert.deepEqual(ones(3), matrix([1,1,1]));
    assert.deepEqual(ones(matrix([4])), matrix([1,1,1,1]));
    assert.deepEqual(ones([4]), [1,1,1,1]);
    assert.deepEqual(ones(0), matrix([]));
  });

  it('should create a 2D matrix with ones', function () {
    assert.deepEqual(ones(2,3), matrix([[1,1,1],[1,1,1]]));
    assert.deepEqual(ones(3,2), matrix([[1,1],[1,1],[1,1]]));
    assert.deepEqual(ones([3,2]), [[1,1],[1,1],[1,1]]);
  });

  it('should create a matrix with ones from a matrix', function () {
    assert.deepEqual(ones(matrix([3])), matrix([1,1,1]));
    assert.deepEqual(ones(matrix([3,2])), matrix([[1,1],[1,1],[1,1]]));
  });

  it('should create a 3D matrix with ones', function () {
    var res = [
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
    ];
    assert.deepEqual(ones(2,3,4), matrix(res));
    assert.deepEqual(ones(matrix([2,3,4])), matrix(res));
    assert.deepEqual(ones([2,3,4]), res);
  });

  // TODO: test option math.options.matrix.defaultType

  it('should create a matrix with ones with the same size as original matrix', function () {
    var a = matrix([[1, 2, 3], [4, 5, 6]]);
    assert.deepEqual(ones(math.size(a)).size(), a.size());
  });

  // TODO: test with invalid input

});