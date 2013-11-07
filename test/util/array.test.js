var assert = require('assert'),
    array = require('../../lib/util/array'),
    resize = array.resize;
    size = array.size;

describe('util.array', function() {

  describe('size', function () {

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

  });

  describe('resize', function () {

    it('should resize a 1 dimensional array', function () {
      var a = [];

      // resize with default value
      resize(a, [3], 100);
      assert.deepEqual(a, [100,100,100]);

      // resize without default value
      resize(a, [5]);
      assert.deepEqual(a, arr(100,100,100, uninit, uninit));

      resize(a, [2]);
      assert.deepEqual(a, [100,100]);
    });

    it('should resize a 2 dimensional array', function () {
      var a = [
        [0, 1],
        [2, 3]
      ];

      resize(a, [2, 4]);
      assert.deepEqual(a, [
        arr(0, 1, uninit, uninit),
        arr(2, 3, uninit, uninit)
      ]);

      resize(a, [4, 4]);
      assert.deepEqual(a, [
        arr(0, 1, uninit, uninit),
        arr(2, 3, uninit, uninit),
        arr(uninit, uninit, uninit, uninit),
        arr(uninit, uninit, uninit, uninit)
      ]);

      resize(a, [4, 2]);
      assert.deepEqual(a, [
        [0, 1],
        [2, 3],
        arr(uninit, uninit),
        arr(uninit, uninit)
      ]);

      resize(a, [2, 2]);
      assert.deepEqual(a, [
        [0, 1],
        [2, 3]
      ]);

      resize(a, [1, 1]);
      assert.deepEqual(a, [
        [0]
      ]);
    });

    it('should resize a 2 dimensional array with default value', function () {
      var a = [
        [0, 1],
        [2, 3]
      ];

      resize(a, [2, 4], 100);
      assert.deepEqual(a, [
        [0, 1, 100, 100],
        [2, 3, 100, 100]
      ]);

      resize(a, [4, 4], 100);
      assert.deepEqual(a, [
        [0, 1, 100, 100],
        [2, 3, 100, 100],
        [100, 100, 100, 100],
        [100, 100, 100, 100]
      ]);

      resize(a, [4, 2]);
      assert.deepEqual(a, [
        [0, 1],
        [2, 3],
        [100, 100],
        [100, 100]
      ]);

      resize(a, [2, 2]);
      assert.deepEqual(a, [
        [0, 1],
        [2, 3]
      ]);

      resize(a, [1, 1]);
      assert.deepEqual(a, [
        [0]
      ]);
    });

    it('should resize a 1 dimensional array to 2 dimensional', function () {
      // TODO
    });

    it('should resize a 2 dimensional array to 1 dimensional', function () {
      // TODO
    });

    it('should resize a 3 dimensional array', function () {
      // TODO
    });

    it('should resize to an empty array', function () {
      // TODO
    });

  });

  // TODO: test validate

  // TODO: test validateIndex

  // TODO: test isArray

  // TODO: test squeeze

  // TODO: test unsqueeze

});

/**
 * Helper function to create an Array containing uninitialized values
 * Example: arr(uninit, uninit, 2);    // [ , , 2 ]
 */
var uninit = {};
function arr() {
  var array = [];
  array.length = arguments.length;
  for (var i = 0; i < arguments.length; i++) {
    var value = arguments[i];
    if (value !== uninit) {
      array[i] = value;
    }
  }
  return array;
}