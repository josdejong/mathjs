var assert = require('assert');
var math = require('../../index.js'),
    index = math.index;

describe('matrix', function() {

  describe('constructor', function() {

    it('should build an emtpy if called with no argument', function() {
      var m = math.matrix();
      assert.deepEqual(m.toArray(), []);
    });

  });

  describe('isScalar', function() {

    it('should be true for single values', function() {
      assert.equal(math.matrix([[23]]).isScalar(), true);
      assert.equal(math.matrix().isScalar(), true);
      assert.equal(math.matrix([[[3]]]).isScalar(), true);
      assert.equal(math.matrix([[]]).isScalar(), true);
    });

    it('should be false for matrices', function() {
      assert.equal(math.matrix([[1,2,3],[4,5,6]]).isScalar(), false);
      assert.equal(math.matrix([1,2,3]).isScalar(), false);
      assert.equal(math.matrix([[1],[2],[3]]).isScalar(), false);
      assert.equal(math.matrix([[[1],[2],[3]]]).isScalar(), false);
    });

  });

  describe('isVector', function() {

    it('should be true for vectors', function() {
      assert.equal(math.matrix().isVector(), true);
      assert.equal(math.matrix([[23]]).isVector(), true);
      assert.equal(math.matrix([1,2,3]).isVector(), true);
      assert.equal(math.matrix([[1],[2],[3]]).isVector(), true);
      assert.equal(math.matrix([[[1],[2],[3]]]).isVector(), true);
      assert.equal(math.matrix([[[3]]]).isVector(), true);
      assert.equal(math.matrix([[]]).isVector(), true);
      assert.equal(math.matrix().isVector(), true);
    });

    it('should be false for matrices', function() {
      assert.equal(math.matrix([[1,2,3],[4,5,6]]).isVector(), false);
    });

  });

  describe('size', function() {

    it('should return the expected size', function() {
      assert.deepEqual(math.matrix().size(), [0]);
      assert.deepEqual(math.matrix([[23]]).size(), [1,1]);
      assert.deepEqual(math.matrix([[1,2,3],[4,5,6]]).size(), [2,3]);
      assert.deepEqual(math.matrix([1,2,3]).size(), [3]);
      assert.deepEqual(math.matrix([[1],[2],[3]]).size(), [3,1]);
      assert.deepEqual(math.matrix([[[1],[2],[3]]]).size(), [1,3,1]);
      assert.deepEqual(math.matrix([[[3]]]).size(), [1,1,1]);
      assert.deepEqual(math.matrix([[]]).size(), [1,0]);
    });

  });

  describe('toScalar', function() {

    it('should return a scalar if the matrix is a scalar', function() {
      assert.deepEqual(math.matrix().toScalar(), null);
      assert.deepEqual(math.matrix([[23]]).toScalar(), 23);
    });

    it('should return null if the matrix is not a scalar', function() {
      assert.equal(math.matrix([[1,2,3],[4,5,6]]).toScalar(), null);
    });

  });

  describe('toVector', function() {

    it('should return a vector if the matrix is a vector', function() {
      assert.deepEqual(math.matrix([1,2,3]).toVector(), [1,2,3]);
      assert.deepEqual(math.matrix([[1],[2],[3]]).toVector(), [1,2,3]);
      assert.deepEqual(math.matrix([[[1],[2],[3]]]).toVector(), [1,2,3]);
      assert.deepEqual(math.matrix([[[3]]]).toVector(), [3]);
      assert.deepEqual(math.matrix([[]]).toVector(), []);
      assert.deepEqual(math.matrix().toVector(), []);
    });

    it('should return null if the matrix is not a vector', function() {
      assert.deepEqual(math.matrix([[1,2,3],[4,5,6]]).toVector(), null);
    });

  });

  it('toString', function() {
    assert.equal(math.matrix([[1,2],[3,4]]).toString(), '[[1, 2], [3, 4]]');
    assert.equal(math.matrix([[1,2],[3,1/3]]).toString(), '[[1, 2], [3, 0.3333333333333333]]');
  });

  it('format', function() {
    assert.equal(math.matrix([[1,2],[3,1/3]]).format(), '[[1, 2], [3, 0.3333333333333333]]');
    assert.equal(math.matrix([[1,2],[3,1/3]]).format(3), '[[1, 2], [3, 0.333]]');
    assert.equal(math.matrix([[1,2],[3,1/3]]).format(4), '[[1, 2], [3, 0.3333]]');
  });

  describe('resize', function() {

    it('should resize the matrix correctly', function() {
      var m = math.matrix([[1,2,3],[4,5,6]]);
      m.resize([2,4]);
      assert.deepEqual(m.valueOf(), [[1,2,3,0],[4,5,6,0]]);

      m.resize([1,2]);
      assert.deepEqual(m.valueOf(), [[1,2]]);

      m.resize([1,2,2], 8);
      assert.deepEqual(m.valueOf(), [[[1,8],[2,8]]]);

      m.resize([2,3], 9);
      assert.deepEqual(m.valueOf(), [[1, 2, 9], [9, 9, 9]]);

      m = math.matrix();
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

  });

  describe('get subset', function() {

    it('should get the right subset of the matrix', function() {
      var m;

      // get 1-dimensional
      m = math.matrix(math.range(0,10));
      assert.deepEqual(m.size(), [10]);
      assert.deepEqual(m.subset(index([2,5])).valueOf(), [2,3,4]);

      // get 2-dimensional
      m = math.matrix([[1,2,3],[4,5,6],[7,8,9]]);
      assert.deepEqual(m.size(), [3,3]);
      assert.deepEqual(m.subset(index(1,1)), 5);
      assert.deepEqual(m.subset(index([0,2],[0,2])).valueOf(), [[1,2],[4,5]]);
      assert.deepEqual(m.subset(index(1, [1,3])).valueOf(), [5,6]);
      assert.deepEqual(m.subset(index(0, [1,3])).valueOf(), [2,3]);
      assert.deepEqual(m.subset(index([1,3], 1)).valueOf(), [[5],[8]]);
      assert.deepEqual(m.subset(index([1,3], 2)).valueOf(), [[6],[9]]);

      // get n-dimensional
      m = math.matrix([[[1,2],[3,4]], [[5,6],[7,8]]]);
      assert.deepEqual(m.size(), [2,2,2]);
      assert.deepEqual(m.subset(index([0,2],[0,2],[0,2])).valueOf(), m.valueOf());
      assert.deepEqual(m.subset(index(0,0,0)), 1);
      assert.deepEqual(m.subset(index(1,1,1)).valueOf(), 8);
      assert.deepEqual(m.subset(index(1,1,[0,2])).valueOf(), [7,8]);
      assert.deepEqual(m.subset(index(1,[0,2],1)).valueOf(), [[6],[8]]);
    });

    it('should throw an error if the given subset is invalid', function() {
      var m = math.matrix();
      assert.throws(function () { m.subset([-1]); });

      m = math.matrix([[1,2,3],[4,5,6]]);
      assert.throws(function () { m.subset([1,2,3]); });
      assert.throws(function () { m.subset([3,0]); });
      assert.throws(function () { m.subset([1]); });
    });

  });

  describe('set subset', function() {

    it('should set the given subset', function() {
      // set 1-dimensional
      var m = math.matrix(math.range(0,7));
      m.subset(index([2,4]), [20,30]);
      assert.deepEqual(m.valueOf(), [0,1,20,30,4,5,6]);
      m.subset(index(4), 40);
      assert.deepEqual(m.valueOf(), [0,1,20,30,40,5,6]);

      // set 2-dimensional
      m = math.matrix();
      m.resize([3,3]);
      assert.deepEqual(m.valueOf(), [[0,0,0],[0,0,0],[0,0,0]]);
      m.subset(index([1,3], [1,3]), [[1,2],[3,4]]);
      assert.deepEqual(m.valueOf(), [[0,0,0],[0,1,2],[0,3,4]]);
      m.subset(index(0, [0,3]), [5,6,7]);  // unsqueezes the submatrix
      assert.deepEqual(m.valueOf(), [[5,6,7],[0,1,2],[0,3,4]]);
    });

    it('should resize the matrix if the replacement subset is different size than selected subset', function() {
      // set 2-dimensional with resize
      var m = math.matrix([[123]]);
      m.subset(index([1,3], [1,3]), [[1,2],[3,4]]);
      assert.deepEqual(m.valueOf(), [[123,0,0],[0,1,2],[0,3,4]]);

      // set resize dimensions
      m = math.matrix([123]);
      assert.deepEqual(m.size(), [1]);

      m.subset(index([1,3], [1,3]), [[1,2],[3,4]]);
      assert.deepEqual(m.valueOf(), [[123,0,0],[0,1,2],[0,3,4]]);

      m.subset(index([0,2], [0,2]), [[55,55],[55,55]]);
      assert.deepEqual(m.valueOf(), [[55,55,0],[55,55,2],[0,3,4]]);

      m = math.matrix();
      m.subset(index([1,3], [1,3], [1,3]), [[[1,2],[3,4]],[[5,6],[7,8]]]);
      assert.deepEqual(m.valueOf(), [
        [
          [0,0,0],
          [0,0,0],
          [0,0,0]
        ],
        [
          [0,0,0],
          [0,1,2],
          [0,3,4]
        ],
        [
          [0,0,0],
          [0,5,6],
          [0,7,8]
        ]
      ]);

    });

  });

  describe('map', function() {

    it('should apply the given function to all elements in the matrix', function() {
      var m, m2;

      m = math.matrix([
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

      m = math.matrix([1]);
      m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.valueOf(), [2]);

      m = math.matrix([1,2,3]);
      m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.valueOf(), [2,4,6]);
    });

    it('should work on empty matrices', function() {
      var m, m2;
      m = math.matrix([]);
      m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.valueOf(), []);
    });

    it('should invoke callback with parameters value, index, obj', function() {
      var m = math.matrix([[1,2,3], [4,5,6]]);

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

      m = math.matrix([
        [[1,2],[3,4]],
        [[5,6],[7,8]],
        [[9,10],[11,12]],
        [[13,14],[15,16]]
      ]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);

      m = math.matrix([1]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, [1]);

      m = math.matrix([1,2,3]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, [1,2,3]);
    });

    it('should work on empty matrices', function() {
      m = math.matrix([]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, []);
    });

    it('should invoke callback with parameters value, index, obj', function() {
      var m = math.matrix([[1,2,3], [4,5,6]]);

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
      var m = math.matrix([[1,2,3], [4,5,6]]);
      var m4 = m.clone();
      assert.deepEqual(m4.size(), [2,3]);
      assert.deepEqual(m4.valueOf(), [[1,2,3], [4,5,6]]);
    });

  });

});

// TODO: extensively test Matrix
