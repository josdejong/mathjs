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
      a = resize(a, [3], 100);
      assert.deepEqual(a, [100,100,100]);

      // resize without default value
      a = resize(a, [5]);
      assert.deepEqual(a, arr(100,100,100, uninit, uninit));

      a = resize(a, [2]);
      assert.deepEqual(a, [100,100]);
    });

    it('should resize a 2 dimensional array', function () {
      var a = [
        [0, 1],
        [2, 3]
      ];

      a = resize(a, [2, 4]);
      assert.deepEqual(a, [
        arr(0, 1, uninit, uninit),
        arr(2, 3, uninit, uninit)
      ]);

      a = resize(a, [4, 4]);
      assert.deepEqual(a, [
        arr(0, 1, uninit, uninit),
        arr(2, 3, uninit, uninit),
        arr(uninit, uninit, uninit, uninit),
        arr(uninit, uninit, uninit, uninit)
      ]);

      a = resize(a, [4, 2]);
      assert.deepEqual(a, [
        [0, 1],
        [2, 3],
        arr(uninit, uninit),
        arr(uninit, uninit)
      ]);

      a = resize(a, [2, 2]);
      assert.deepEqual(a, [
        [0, 1],
        [2, 3]
      ]);

      a = resize(a, [1, 1]);
      assert.deepEqual(a, [
        [0]
      ]);
    });

    it('should resize a 2 dimensional array with default value', function () {
      var a = [
        [0, 1],
        [2, 3]
      ];

      a = resize(a, [2, 4], 100);
      assert.deepEqual(a, [
        [0, 1, 100, 100],
        [2, 3, 100, 100]
      ]);

      a = resize(a, [4, 4], 100);
      assert.deepEqual(a, [
        [0, 1, 100, 100],
        [2, 3, 100, 100],
        [100, 100, 100, 100],
        [100, 100, 100, 100]
      ]);

      a = resize(a, [4, 2]);
      assert.deepEqual(a, [
        [0, 1],
        [2, 3],
        [100, 100],
        [100, 100]
      ]);

      a = resize(a, [2, 2]);
      assert.deepEqual(a, [
        [0, 1],
        [2, 3]
      ]);

      a = resize(a, [1, 1]);
      assert.deepEqual(a, [
        [0]
      ]);
    });

    it('should resize a 1 dimensional array to 2 dimensional', function () {
      var a = [0, 0];

      a = resize(a, [4]);
      assert.deepEqual(a, arr(0, 0, uninit, uninit));

      a = resize(a, [2, 4]);
      assert.deepEqual(a, [
        arr(0, 0, uninit, uninit),
        arr(uninit, uninit, uninit, uninit)
      ]);

      var b = [0, 0];

      b = resize(b, [4]);
      assert.deepEqual(b, arr(0, 0, uninit, uninit));

      b = resize(b, [2, 5], 8); // with a default value
      assert.deepEqual(b, [
        arr(0, 0, uninit, uninit, 8),
        arr(8, 8, 8, 8, 8)
      ]);
    });

    it('should resize a 2 dimensional array to 1 dimensional', function () {
      var a = [[1,2,3,4], [5,6,7,8]];
      a = resize(a, [6]);
      assert.deepEqual(a, arr(1,2,3,4, uninit, uninit));

      var b = [[],[]];
      b = resize(b, [2], 8);
      assert.deepEqual(b, [8, 8]);

    });

    it('should resize a 3 dimensional array', function () {
      var a = [];
      a = resize(a, [2,3], 5);
      assert.deepEqual(a, [[5,5,5], [5,5,5]]);

      a = resize(a, [2,2,3], 7);
      assert.deepEqual(a, [[[5,5,5], [5,5,5]], [[7,7,7], [7,7,7]]]);

      a = resize(a, [3,2], 9);
      assert.deepEqual(a, [[5,5], [5,5], [9, 9]]);
    });

    it('should resize to an empty array', function () {
      var a = [];
      a = resize(a, [2,3], 5);
      assert.deepEqual(a, [[5,5,5], [5,5,5]]);

      a = resize(a, [0]);
      assert.deepEqual(a, []);
    });

    it('should throw an error when resizing to a scalar', function () {
      var a = [];
      assert.throws(function () {a = resize(a, []);}, /Resizing to scalar is not supported/);
    });

    it('should throw an error in case of wrong type of arguments', function () {
      assert.throws(function () {resize([], 2)}, /Array expected/);
      assert.throws(function () {resize(2)}, /Array expected/);
    });

    it('should throw an error in case of invalid array', function () {
      assert.throws(function () {resize([[1, 2], 3], [2, 2])}, /Array expected/);
    });
  });

  describe('squeeze', function () {

    it('should squeeze a scalar', function () {
      assert.deepEqual(array.squeeze(2), 2);
      assert.deepEqual(array.squeeze({}), {});
      assert.deepEqual(array.squeeze('string'), 'string');
    });

    it('should squeeze an array', function () {
      assert.deepEqual(array.squeeze([]), []);
      assert.deepEqual(array.squeeze([[]]), []);
      assert.deepEqual(array.squeeze([[[]]]), []);
      assert.deepEqual(array.squeeze([[[], []]]), [[], []]);
      assert.deepEqual(array.squeeze([[[]], [[]]]), [[[]], [[]]]);

      assert.deepEqual(array.squeeze([1, 2, 3]), [1, 2, 3]);
      assert.deepEqual(array.squeeze([[1, 2, 3]]), [1, 2, 3]);
      assert.deepEqual(array.squeeze([[[1, 2, 3]]]), [1, 2, 3]);
      assert.deepEqual(array.squeeze([[1], [2], [3]]), [[1], [2], [3]]);
      assert.deepEqual(array.squeeze([[1, 2], [3, 4]]), [[1, 2], [3, 4]]);
      assert.deepEqual(array.squeeze([[[1, 2]], [[3, 4]]]), [[[1, 2]], [[3, 4]]]);
      assert.deepEqual(array.squeeze([[[1, 2], [3, 4]]]), [[1, 2], [3, 4]]);
      assert.deepEqual(array.squeeze([[[1], [2]], [[3], [4]]]), [[[1], [2]], [[3], [4]]]);
    });

  });

  describe('unsqueeze', function () {

    it('should unsqueeze a scalar', function () {
      assert.deepEqual(array.unsqueeze(2, 0), 2);
      assert.deepEqual(array.unsqueeze(2, 1), [2]);
      assert.deepEqual(array.unsqueeze(2, 2), [[2]]);
      assert.deepEqual(array.unsqueeze('string', 2), [['string']]);
    });

    it('should unsqueeze an array', function () {
      assert.deepEqual(array.unsqueeze([], 0), []);
      assert.deepEqual(array.unsqueeze([], 1), []);
      assert.deepEqual(array.unsqueeze([], 2), [[]]);
      assert.deepEqual(array.unsqueeze([], 3), [[[]]]);

      assert.deepEqual(array.unsqueeze([[]], 0), [[]]);
      assert.deepEqual(array.unsqueeze([[]], 1), [[]]);
      assert.deepEqual(array.unsqueeze([[]], 2), [[]]);
      assert.deepEqual(array.unsqueeze([[]], 3), [[[]]]);

      assert.deepEqual(array.unsqueeze([1, 2, 3], 1), [1, 2, 3]);
      assert.deepEqual(array.unsqueeze([1, 2, 3], 2), [[1, 2, 3]]);
      assert.deepEqual(array.unsqueeze([1, 2, 3], 3), [[[1, 2, 3]]]);

      assert.deepEqual(array.unsqueeze([[1, 2], [3, 4]], 1), [[1, 2], [3, 4]]);
      assert.deepEqual(array.unsqueeze([[1, 2], [3, 4]], 2), [[1, 2], [3, 4]]);
      assert.deepEqual(array.unsqueeze([[1, 2], [3, 4]], 3), [[[1, 2], [3, 4]]]);
    });

  });

  describe('resize', function () {

    it('should test whether an object is an array', function () {
      assert.equal(array.isArray([]), true);
      assert.equal(array.isArray({}), false);
      assert.equal(array.isArray(2), false);
      assert.equal(array.isArray('string'), false);
    });

  });

  describe('validateIndex', function () {

    it('should validate whether an index contains integers', function () {
      assert.equal(array.validateIndex(2), undefined);
      assert.equal(array.validateIndex(10), undefined);
      assert.throws(function () {array.validateIndex(2.3)}, /Index must be an integer/);
      assert.throws(function () {array.validateIndex('str')}, /Index must be an integer/);
      assert.throws(function () {array.validateIndex(true)}, /Index must be an integer/);
    });

    it('should validate whether an index doesn\'t exceed the minimum 0', function () {
      assert.equal(array.validateIndex(2), undefined);
      assert.equal(array.validateIndex(0), undefined);
      assert.throws(function () {array.validateIndex(-1)}, /Index out of range/);
      assert.throws(function () {array.validateIndex(-100)}, /Index out of range/);
    });

    it('should validate whether an index doesn\'t exceed both minimum and maximum', function () {
      assert.equal(array.validateIndex(0, 10), undefined);
      assert.equal(array.validateIndex(4, 10), undefined);
      assert.equal(array.validateIndex(9, 10), undefined);
      assert.throws(function () {array.validateIndex(-1, 10)}, /Index out of range/);
      assert.throws(function () {array.validateIndex(10, 10)}, /Index out of range/);
      assert.throws(function () {array.validateIndex(11, 10)}, /Index out of range/);
      assert.throws(function () {array.validateIndex(100, 10)}, /Index out of range/);
    });

  });

  describe('validate', function () {

    it('should validate whether all elements in a vector have correct size', function () {
      // valid vector with correct size
      assert.equal(array.validate([], [0]), undefined);
      assert.equal(array.validate([1], [1]), undefined);
      assert.equal(array.validate([1,2,3], [3]), undefined);

      // valid matrix but wrong size
      assert.throws(function () {array.validate([1,2,3], [2])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([1,2,3], [4])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([1,2,3], [])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([1,2,3], [3,2])}, /Dimension mismatch/);

      // invalid vector
      assert.throws(function () {array.validate([1,[2],3], [3])}, /Dimension mismatch/);
    });

    it('should validate whether all elements in a 2d matrix have correct size', function () {
      // valid matrix with correct size
      assert.equal(array.validate([[1,2],[3,4]], [2,2]), undefined);
      assert.equal(array.validate([[1,2,3],[4,5,6]], [2,3]), undefined);
      assert.equal(array.validate([[1,2],[3,4],[5,6]], [3,2]), undefined);

      // valid matrix with wrong size
      assert.throws(function () {array.validate([[1,2],[3,4]], [2,1])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[1,2],[3,4]], [3,2])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[1,2,3],[4,5,6]], [2,4])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[1,2],[3,4],[5,6]], [4,3])}, /Dimension mismatch/);

      // invalid matrix
      assert.throws(function () {array.validate([[1,2],[3,4,5]], [2,2])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[1,2],[3]], [2,2])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[1,2],3], [2,2])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([1,2], [2,2])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[[1,2],[3,4]]], [2,2])}, /Dimension mismatch/);
    });

    it('should validate whether all elements in a multi dimensional matrix have correct size', function () {
      // valid matrix with correct size
      assert.equal(array.validate([[[1,2],[3,4]],[[5,6],[7,8]]], [2,2,2]), undefined);
      assert.equal(array.validate([[[1,2,3],[4,5,6]],[[7,8,9],[10,11,12]]], [2,2,3]), undefined);
      assert.equal(array.validate([[[1,2],[3,4],[5,6]],[[7,8],[9,10],[11,12]]], [2,3,2]), undefined);
      assert.equal(array.validate([[[1,2],[3,4]],[[5,6],[7,8]],[[9,10],[11,12]]], [3,2,2]), undefined);

      // valid matrix with wrong size
      assert.throws(function () {array.validate([[[1,2],[3,4]],[[5,6],[7,8]]], [2,2,3])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[[1,2],[3,4]],[[5,6],[7,8]]], [2,2])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[[1,2],[3,4]],[[5,6],[7,8]]], [2,2,2,2])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[[1,2],[3,4]],[[5,6],[7,8]]], [3,2,2])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[[1,2],[3,4]],[[5,6],[7,8]]], [2,3,2])}, /Dimension mismatch/);

      // invalid matrix
      assert.throws(function () {array.validate([[[1,2],[3,4]],[[5,6],[7,8,9]]], [2,2,2])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[[1,2],[3,4]],[[5,6,6.5],[7,8]]], [2,2,2])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[[1,2],[3,4]],[[5,6],7]], [2,2,2])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[[1,2],[3,4]],[6,[7,8]]], [2,2,2])}, /Dimension mismatch/);
    });

    it('should validate whether a variable contains a scalar', function () {
      assert.equal(array.validate(2.3, []), undefined);
      assert.equal(array.validate(new Date(), []), undefined);
      assert.equal(array.validate({}, []), undefined);

      assert.throws(function () {array.validate([], [])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([1,2,3], [])}, /Dimension mismatch/);
      assert.throws(function () {array.validate([[1,2],[3,4]], [])}, /Dimension mismatch/);
    });

  });

  describe('flatten', function () {

    it('should flatten a scalar', function () {
      assert.deepEqual(array.flatten(1), 1);
    });

    it('should flatten a 1 dimensional array', function () {
      assert.deepEqual(array.flatten([1,2,3]), [1,2,3]);
    });

    it('should flatten a 2 dimensional array', function () {
      assert.deepEqual(array.flatten([[1,2],[3,4]]), [1,2,3,4]);
    });

    it('should flatten a 3 dimensional array', function () {
      assert.deepEqual(array.flatten([[[1,2],[3,4]],[[5,6],[7,8]]]), [1,2,3,4,5,6,7,8]);
    });

  });

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