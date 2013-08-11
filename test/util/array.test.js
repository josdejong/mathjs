var assert = require('assert'),
    array = require('../../src/util/array.js'),
    resize = array.resize;
    size = array.size;

describe('util.array', function() {

  it('should resize an array', function () {
    var a = [];
    resize(a, [3], 123);
    assert.deepEqual(a, [123,123,123]);

    // TODO: extensively test array.resize, also with changing number of dimensions
  });

  it('should calculate the size of a scalar', function () {
    assert.deepEqual(size(2), []);
    assert.deepEqual(size("string"), []);
  });

  it('should calculate the size of a 1-dimensional array', function () {
    assert.deepEqual(size([]), [0]);
    assert.deepEqual(size([1]), [1]);
    assert.deepEqual(size([1,2,3]), [3]);
  });

  it('should calculate the size of a 2-dimensional array', function () {
    assert.deepEqual(size([[]]), [1,0]);
    assert.deepEqual(size([[], []]), [2,0]);
    assert.deepEqual(size([[1,2],[3,4]]), [2,2]);
    assert.deepEqual(size([[1,2,3],[4,5,6]]), [2,3]);
  });

  it('should calculate the size of a 3-dimensional array', function () {
    assert.deepEqual(size([[[]]]), [1,1,0]);
    assert.deepEqual(size([[[], []]]), [1,2,0]);
    assert.deepEqual(size([[[], []],[[], []]]), [2,2,0]);
    assert.deepEqual(size([[[1],[2]],[[3],[4]]]), [2,2,1]);
    assert.deepEqual(size([[[1,2],[3,4]],[[5,6],[7,8]]]), [2,2,2]);
    assert.deepEqual(size([
      [[1,2,3,4],[5,6,7,8]],
      [[1,2,3,4],[5,6,7,8]],
      [[1,2,3,4],[5,6,7,8]]
    ]), [3,2,4]);
  });

  // TODO: test validate

  // TODO: test validateIndex

  // TODO: test isArray


});
