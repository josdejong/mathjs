var assert = require('assert'),
    math = require('../../index'),
    index = math.index,
    Matrix = require('../../lib/type/Matrix');

describe('matrix', function() {

  describe('constructor', function() {

    it('should build an empty if called with no argument', function() {
      var m = new Matrix();
      assert.deepEqual(m.toArray(), []);
    });

    it('should create a matrix from an other matrix', function () {
      var m = new Matrix([1,2,3]);
      var n = new Matrix(m);

      m.resize([0]); // empty matrix m to ensure n is a clone

      assert.deepEqual(n, new Matrix([1,2,3]));
    });

    it('should create a matrix an array containing matrices', function () {
      var m = new Matrix([new Matrix([1,2]), new Matrix([3, 4])]);

      assert.deepEqual(m, new Matrix([[1,2],[3, 4]]));
    });

    it('should throw an error when called without new keyword', function () {
      assert.throws(function () {Matrix()}, /Constructor must be called with the new operator/);
    });

  });

  describe('size', function() {

    it('should return the expected size', function() {
      assert.deepEqual(new Matrix().size(), [0]);
      assert.deepEqual(new Matrix([[23]]).size(), [1,1]);
      assert.deepEqual(new Matrix([[1,2,3],[4,5,6]]).size(), [2,3]);
      assert.deepEqual(new Matrix([1,2,3]).size(), [3]);
      assert.deepEqual(new Matrix([[1],[2],[3]]).size(), [3,1]);
      assert.deepEqual(new Matrix([[[1],[2],[3]]]).size(), [1,3,1]);
      assert.deepEqual(new Matrix([[[3]]]).size(), [1,1,1]);
      assert.deepEqual(new Matrix([[]]).size(), [1,0]);
    });

  });

  it('toString', function() {
    assert.equal(new Matrix([[1,2],[3,4]]).toString(), '[[1, 2], [3, 4]]');
    assert.equal(new Matrix([[1,2],[3,1/3]]).toString(), '[[1, 2], [3, 0.3333333333333333]]');
  });

  it('format', function() {
    assert.equal(new Matrix([[1,2],[3,1/3]]).format(), '[[1, 2], [3, 0.3333333333333333]]');
    assert.equal(new Matrix([[1,2],[3,1/3]]).format(3), '[[1, 2], [3, 0.333]]');
    assert.equal(new Matrix([[1,2],[3,1/3]]).format(4), '[[1, 2], [3, 0.3333]]');
  });

  describe('resize', function() {

    it('should resize the matrix correctly', function() {
      var m = new Matrix([[1,2,3],[4,5,6]]);
      m.resize([2,4]);
      assert.deepEqual(m.valueOf(), [[1,2,3,0], [4,5,6,0]]);

      m.resize([1,2]);
      assert.deepEqual(m.valueOf(), [[1,2]]);

      m.resize([1,2,2], 8);
      assert.deepEqual(m.valueOf(), [[[1,8],[2,8]]]);

      m.resize([2,3], 9);
      assert.deepEqual(m.valueOf(), [[1,2, 9], [9,9,9]]);

      m = new Matrix();
      m.resize([3,3,3], 6);
      assert.deepEqual(m.valueOf(), [
        [[6,6,6],[6,6,6],[6,6,6]],
        [[6,6,6],[6,6,6],[6,6,6]],
        [[6,6,6],[6,6,6],[6,6,6]]
      ]);

      m.resize([2,2]);
      assert.deepEqual(m.valueOf(), [[6,6],[6,6]]);

      m.resize([0]);
      assert.deepEqual(m.valueOf(), []);
    });

    it('should resize the matrix with uninitialized default value', function() {
      var m = new Matrix([]);
      m.resize([3], math.uninitialized);
      assert.deepEqual(m.valueOf(), arr(uninit, uninit, uninit));
    });
  });

  describe('get', function() {
    var m = new Matrix([[0, 1], [2, 3]]);

    it('should get a value from the matrix', function() {
      assert.equal(m.get([1,0]), 2);
      assert.equal(m.get([0,1]), 1);
    });

    it('should throw an error when getting a value out of range', function() {
      assert.throws(function () {m.get([3,0])});
      assert.throws(function () {m.get([1,5])});
      assert.throws(function () {m.get([1])});
      assert.throws(function () {m.get([])});
    });

    it('should throw an error in case of dimension mismatch', function() {
      assert.throws(function () {m.get([0,2,0,2,0,2])}, /Dimension mismatch/);
    });

    it('should throw an error when getting a value given a invalid index', function() {
      assert.throws(function () {m.get([1.2, 2])});
      assert.throws(function () {m.get([1,-2])});
      assert.throws(function () {m.get(1,1)});
      assert.throws(function () {m.get(math.index(1,1))});
      assert.throws(function () {m.get([[1,1]])});
    });

  });

  describe('set', function() {
    it('should set a value in a matrix', function() {
      var m = new Matrix([[0, 0], [0, 0]]);
      m.set([1,0], 5);
      assert.deepEqual(m, new Matrix([
        [0, 0],
        [5, 0]
      ]));

      m.set([0, 2], 4);
      assert.deepEqual(m, new Matrix([
        [0, 0, 4],
        [5, 0, 0]
      ]));

      m.set([0,0,1], 3);
      assert.deepEqual(m, new Matrix([
        [[0,3], [0,0], [4,0]],
        [[5,0], [0,0], [0,0]]
      ]));
    });

    it('should set a value in a matrix with defaultValue for new elements', function() {
      var m = new Matrix();
      var defaultValue = 0;
      m.set([2], 4, defaultValue);
      assert.deepEqual(m, new Matrix([0, 0, 4]));
    });

    it('should throw an error when setting a value given a invalid index', function() {
      var m = new Matrix([[0, 0], [0, 0]]);
      assert.throws(function() {m.set([2.5,0], 5)});
      assert.throws(function() {m.set([1], 5)});
      assert.throws(function() {m.set([-1, 1], 5)});
      assert.throws(function() {m.set(math.index([0,0]), 5)});
    });

  });

  // TODO: replace all assert.deepEqual(a.valueOf(), [...]) with assert.deepEqual(a, new Matrix([...]))

  describe('get subset', function() {

    it('should get the right subset of the matrix', function() {
      var m;

      // get 1-dimensional
      m = new Matrix(math.range(0,10));
      assert.deepEqual(m.size(), [10]);
      assert.deepEqual(m.subset(index([2,5])).valueOf(), [2,3,4]);

      // get 2-dimensional
      m = new Matrix([[1,2,3],[4,5,6],[7,8,9]]);
      assert.deepEqual(m.size(), [3,3]);
      assert.deepEqual(m.subset(index(1,1)), 5);
      assert.deepEqual(m.subset(index([0,2],[0,2])).valueOf(), [[1,2],[4,5]]);
      assert.deepEqual(m.subset(index(1, [1,3])).valueOf(), [[5,6]]);
      assert.deepEqual(m.subset(index(0, [1,3])).valueOf(), [[2,3]]);
      assert.deepEqual(m.subset(index([1,3], 1)).valueOf(), [[5],[8]]);
      assert.deepEqual(m.subset(index([1,3], 2)).valueOf(), [[6],[9]]);

      // get n-dimensional
      m = new Matrix([[[1,2],[3,4]], [[5,6],[7,8]]]);
      assert.deepEqual(m.size(), [2,2,2]);
      assert.deepEqual(m.subset(index([0,2],[0,2],[0,2])).valueOf(), m.valueOf());
      assert.deepEqual(m.subset(index(0,0,0)), 1);
      assert.deepEqual(m.subset(index(1,1,1)).valueOf(), 8);
      assert.deepEqual(m.subset(index(1,1,[0,2])).valueOf(), [[[7,8]]]);
      assert.deepEqual(m.subset(index(1,[0,2],1)).valueOf(), [[[6],[8]]]);
      assert.deepEqual(m.subset(index([0,2],1,1)).valueOf(), [[[4]],[[8]]]);
    });

    it('should squeeze the output when index contains a scalar', function() {
      var m = new Matrix(math.range(0,10));
      assert.deepEqual(m.subset(index(1)), 1);
      assert.deepEqual(m.subset(index([1,2])), new Matrix([1]));

      m = new Matrix([[1,2], [3,4]]);
      assert.deepEqual(m.subset(index(1,1)), 4);
      assert.deepEqual(m.subset(index([1,2], 1)), new Matrix([[4]]));
      assert.deepEqual(m.subset(index(1, [1,2])), new Matrix([[4]]));
      assert.deepEqual(m.subset(index([1,2], [1,2])), new Matrix([[4]]));
    });

    it('should throw an error if the given subset is invalid', function() {
      var m = new Matrix();
      assert.throws(function () { m.subset([-1]); });

      m = new Matrix([[1,2,3],[4,5,6]]);
      assert.throws(function () { m.subset([1,2,3]); });
      assert.throws(function () { m.subset([3,0]); });
      assert.throws(function () { m.subset([1]); });
    });

    it('should throw an error in case of wrong number of arguments', function() {
      var m = new Matrix();
      assert.throws(function () { m.subset();}, /Wrong number of arguments/);
      assert.throws(function () { m.subset(1,2,3,4); }, /Wrong number of arguments/);
    });

    it('should throw an error in case of dimension mismatch', function() {
      var m = new Matrix([[1,2,3],[4,5,6]]);
      assert.throws(function () {m.subset(index([0,2]))}, /Dimension mismatch/);
    });

  });

  describe('set subset', function() {

    it('should set the given subset', function() {
      // set 1-dimensional
      var m = new Matrix(math.range(0,7));
      m.subset(index([2,4]), [20,30]);
      assert.deepEqual(m, new Matrix([0,1,20,30,4,5,6]));
      m.subset(index(4), 40);
      assert.deepEqual(m, new Matrix([0,1,20,30,40,5,6]));

      // set 2-dimensional
      m = new Matrix();
      m.resize([3,3]);
      assert.deepEqual(m, new Matrix([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]));
      m.subset(index([1,3], [1,3]), [[1,2],[3,4]]);
      assert.deepEqual(m, new Matrix([
        [0, 0, 0],
        [0, 1, 2],
        [0, 3, 4]]));
      m.subset(index(0, [0,3]), [5,6,7]);
      assert.deepEqual(m, new Matrix([[5,6,7],[0,1,2],[0,3,4]]));
      m.subset(index([0,3], 0), [8,9,10]);  // unsqueezes the submatrix
      assert.deepEqual(m, new Matrix([[8,6,7],[9,1,2],[10,3,4]]));
    });

    it('should set the given subset with defaultValue for new elements', function() {
      // multiple values
      var m = new Matrix();
      var defaultValue = 0;
      m.subset(index([3,5]), [3, 4], defaultValue);
      assert.deepEqual(m, new Matrix([0, 0, 0, 3, 4]));

      defaultValue = 1;
      m.subset(index([3,5],1), [5, 6], defaultValue);
      assert.deepEqual(m, new Matrix([
        [0, 1],
        [0, 1],
        [0, 1],
        [3, 5],
        [4, 6]
      ]));

      defaultValue = 2;
      m.subset(index([3,5],2), [7, 8], defaultValue);
      assert.deepEqual(m, new Matrix([
        [0, 1, 2],
        [0, 1, 2],
        [0, 1, 2],
        [3, 5, 7],
        [4, 6, 8]
      ]));

      // a single value
      var i = math.matrix();
      defaultValue = 0;
      i.subset(math.index(2, 1), 6, defaultValue);
      assert.deepEqual(i, new Matrix([[0, 0], [0, 0], [0, 6]]));
    });

    it('should unsqueeze the replacement subset if needed', function() {
      var m = new Matrix([[0,0],[0,0]]); // 2x2

      m.subset(index(0, [0,2]), [1,1]); // 2
      assert.deepEqual(m, new Matrix([[1,1],[0,0]]));

      m.subset(index([0,2], 0), [2,2]); // 2
      assert.deepEqual(m, new Matrix([[2,1],[2,0]]));

      m = new Matrix([[[0],[0],[0]]]); // 1x3x1
      m.subset(index(0, [0,3], 0), [1,2,3]); // 3
      assert.deepEqual(m, new Matrix([[[1],[2],[3]]]));

      m = new Matrix([[[0,0,0]]]); // 1x1x3
      m.subset(index(0, 0, [0,3]), [1,2,3]); // 3
      assert.deepEqual(m, new Matrix([[[1,2,3]]]));

      m = new Matrix([[[0]],[[0]],[[0]]]); // 3x1x1
      m.subset(index([0,3], 0, 0), [1,2,3]); // 3
      assert.deepEqual(m, new Matrix([[[1]],[[2]],[[3]]]));

      m = new Matrix([[[0,0,0]]]); // 1x1x3
      m.subset(index(0, 0, [0,3]), [[1,2,3]]); // 1x3
      assert.deepEqual(m, new Matrix([[[1,2,3]]]));

      m = new Matrix([[[0]],[[0]],[[0]]]); // 3x1x1
      m.subset(index([0,3], 0, 0), [[1],[2],[3]]); // 3x1
      assert.deepEqual(m, new Matrix([[[1]],[[2]],[[3]]]));
    });

    it('should resize the matrix if the replacement subset is different size than selected subset', function() {
      // set 2-dimensional with resize
      var m = new Matrix([[123]]);
      m.subset(index([1,3], [1,3]), [[1,2],[3,4]]);
      assert.deepEqual(m, new Matrix([[123,0,0],[0,1,2],[0,3,4]]));

      // set resize dimensions
      m = new Matrix([123]);
      assert.deepEqual(m.size(), [1]);

      m.subset(index([1,3], [1,3]), [[1,2],[3,4]]);
      assert.deepEqual(m, new Matrix([[123,0,0],[0,1,2],[0,3,4]]));

      m.subset(index([0,2], [0,2]), [[55,55],[55,55]]);
      assert.deepEqual(m, new Matrix([[55,55,0],[55,55,2],[0,3,4]]));

      m = new Matrix();
      m.subset(index([1,3], [1,3], [1,3]), [[[1,2],[3,4]],[[5,6],[7,8]]]);
      var res = new Matrix([
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
        [
          [0, 0, 0],
          [0, 1, 2],
          [0, 3, 4]
        ],
        [
          [0, 0, 0],
          [0, 5, 6],
          [0, 7, 8]
        ]
      ]);
      assert.deepEqual(m, res);
    });

    it ('should throw an error in case of wrong type of index', function () {
      assert.throws(function () {new Matrix().subset('no index', 2)}, /Invalid index/)
    });

    it ('should throw an error in case of wrong size of submatrix', function () {
      assert.throws(function () {new Matrix().subset(index(0), [2,3])}, /Scalar expected/)
    });

    it('should throw an error in case of dimension mismatch', function() {
      var m = new Matrix([[1,2,3],[4,5,6]]);
      assert.throws(function () {m.subset(index([0,2]), [100,100])}, /Dimension mismatch/);
      assert.throws(function () {m.subset(index([0,2], [0,2]), [100,100])}, /Dimension mismatch/);
    });

  });

  describe('map', function() {

    it('should apply the given function to all elements in the matrix', function() {
      var m, m2;

      m = new Matrix([
        [[1,2],[3,4]],
        [[5,6],[7,8]],
        [[9,10],[11,12]],
        [[13,14],[15,16]]
      ]);
      m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.valueOf(), [
        [[2,4],[6,8]],
        [[10,12],[14,16]],
        [[18,20],[22,24]],
        [[26,28],[30,32]]
      ]);

      m = new Matrix([1]);
      m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.valueOf(), [2]);

      m = new Matrix([1,2,3]);
      m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.valueOf(), [2,4,6]);
    });

    it('should work on empty matrices', function() {
      var m, m2;
      m = new Matrix([]);
      m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.valueOf(), []);
    });

    it('should invoke callback with parameters value, index, obj', function() {
      var m = new Matrix([[1,2,3], [4,5,6]]);

      assert.deepEqual(m.map(function (value, index, obj) {
        return math.clone([value, index, obj === m]);
      }).valueOf(), [
        [
          [1, [0, 0], true ],
          [2, [0, 1], true ],
          [3, [0, 2], true ]
        ],
        [
          [4, [1, 0], true ],
          [5, [1, 1], true ],
          [6, [1, 2], true ]
        ]
      ]);

    });

  });

  describe('forEach', function() {

    it('should run on all elements of the matrix, last dimension first', function() {
      var m, output;

      m = new Matrix([
        [[1,2],[3,4]],
        [[5,6],[7,8]],
        [[9,10],[11,12]],
        [[13,14],[15,16]]
      ]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);

      m = new Matrix([1]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, [1]);

      m = new Matrix([1,2,3]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, [1,2,3]);
    });

    it('should work on empty matrices', function() {
      m = new Matrix([]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, []);
    });

    it('should invoke callback with parameters value, index, obj', function() {
      var m = new Matrix([[1,2,3], [4,5,6]]);

      var output = [];
      m.forEach(function (value, index, obj) {
        output.push(math.clone([value, index, obj === m]));
      });
      assert.deepEqual(output, [
        [1, [0, 0], true ],
        [2, [0, 1], true ],
        [3, [0, 2], true ],
        [4, [1, 0], true ],
        [5, [1, 1], true ],
        [6, [1, 2], true ]
      ]);
    });

  });

  describe('clone', function() {

    it('should clone the matrix properly', function() {
      var m = new Matrix([[1,2,3], [4,5,6]]);
      var m4 = m.clone();
      assert.deepEqual(m4.size(), [2,3]);
      assert.deepEqual(m4.valueOf(), [[1,2,3], [4,5,6]]);
    });

  });

});

// TODO: extensively test Matrix


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
