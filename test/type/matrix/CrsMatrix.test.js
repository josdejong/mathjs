var assert = require('assert');
var math = require('../../../index');
var index = math.index;
var Matrix = math.type.Matrix;
var CrsMatrix = math.type.CrsMatrix;
var DenseMatrix = math.type.DenseMatrix;
var Complex = math.type.Complex;

describe('CrsMatrix', function() {

  describe('constructor', function() {

    it('should create empty matrix if called with no argument', function() {
      var m = new CrsMatrix();
      assert.deepEqual(m._size, [0]);
      assert.deepEqual(m._values, []);
      assert.deepEqual(m._index, []);
      assert.deepEqual(m._ptr, [0]);
    });

    it('should create a CCS from an array', function () {
      var m = new CrsMatrix(
        [
          [10, 0, 0, 0, -2, 0],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [0, 4, 0, 0, 2, -1]
        ]);
      assert.deepEqual(m._size, [6, 6]);
      assert.deepEqual(m._values, [10, -2, 3, 9, 3, 7, 8, 7, 3, 8, 7, 5, 8, 9, 9, 13, 4, 2, -1]);
      assert.deepEqual(m._index, [0, 4, 0, 1, 5, 1, 2, 3, 0, 2, 3, 4, 1, 3, 4, 5, 1, 4, 5]);
      assert.deepEqual(m._ptr, [0, 2, 5, 8, 12, 16, 19]);
    });

    it('should create a CCS from an array, empty column', function () {
      var m = new CrsMatrix(
        [
          [1, 0, 0],
          [0, 0, 1]
        ]);
      assert.deepEqual(m._size, [2, 3]);
      assert.deepEqual(m._values, [1, 1]);
      assert.deepEqual(m._index, [0, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2]);
    });

    it('should create a CCS from an array, empty row', function () {
      var m = new CrsMatrix(
        [
          [1, 0],
          [0, 0],
          [0, 1]
        ]);
      assert.deepEqual(m._size, [3, 2]);
      assert.deepEqual(m._values, [1, 1]);
      assert.deepEqual(m._index, [0, 1]);
      assert.deepEqual(m._ptr, [0, 1, 1, 2]);
    });

    it('should create an empty CCS from an array', function () {
      var m = new CrsMatrix([]);
      assert.deepEqual(m._size, [0, 0]);
      assert.deepEqual(m._values, []);
      assert.deepEqual(m._index, []);
      assert.deepEqual(m._ptr, [0]);
    });

    it('should create a CCS from a vector', function () {
      var m = new CrsMatrix([1, 2, 3]);
      assert.deepEqual(m._size, [3, 1]);
      assert.deepEqual(m._values, [1, 2, 3]);
      assert.deepEqual(m._index, [0, 0, 0]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3]);
    });

    it('should create a CrsMatrix from another CrsMatrix', function () {
      var m1 = new CrsMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ]);
      var m2 = new CrsMatrix(m1);
      assert.deepEqual(m1._size, m2._size);
      assert.deepEqual(m1._values, m2._values);
      assert.deepEqual(m1._index, m2._index);
      assert.deepEqual(m1._ptr, m2._ptr);
    });

    it('should create a CrsMatrix from a DenseMatrix', function () {
      var m1 = new DenseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ]);
      var m2 = new CrsMatrix(m1);
      assert.deepEqual(m1.size(), m2.size());
      assert.deepEqual(m1.toArray(), m2.toArray());
    });

    it('should throw an error when called without new keyword', function () {
      assert.throws(function () { CrsMatrix(); }, /Constructor must be called with the new operator/);
    });
  });

  describe('size', function() {

    it('should return the expected size', function() {
      assert.deepEqual(new CrsMatrix([[23]]).size(), [1, 1]);
      assert.deepEqual(new CrsMatrix([[1, 2, 3], [4, 5, 6]]).size(), [2, 3]);
      assert.deepEqual(new CrsMatrix([[1], [2], [3]]).size(), [3, 1]);
      assert.deepEqual(new CrsMatrix([[]]).size(), [1, 0]);
    });
  });
  
  describe('toString', function() {
    it('should return string representation of matrix', function() {
      assert.equal(new CrsMatrix([[1,2],[3,4]]).toString(), '[[1, 2], [3, 4]]');
      assert.equal(new CrsMatrix([[1,2],[3,1/3]]).toString(), '[[1, 2], [3, 0.3333333333333333]]');
    });
  });
  
  describe('toJSON', function () {

    it('should serialize Matrix', function() {
      assert.deepEqual(
        new CrsMatrix([[1, 2], [3, 4]]).toJSON(),
        {
          mathjs: 'CrsMatrix',
          values: [1, 2, 3, 4],
          index: [0, 1, 0, 1],
          ptr: [0, 2, 4],
          size: [2, 2]
        });
    });
  });
  
  describe('fromJSON', function () {

    it('should deserialize Matrix', function() {
      var json = {
        mathjs: 'CrsMatrix',
        values: [1, 2, 3, 4],
        index: [0, 1, 0, 1],
        ptr: [0, 2, 4],
        size: [2, 2]
      };
      var m = CrsMatrix.fromJSON(json);
      assert.ok(m instanceof Matrix);

      assert.deepEqual(m._size, [2, 2]);
      assert.deepEqual(
        m.valueOf(),
        [
          [1, 2],
          [3, 4]
        ]);
    });
  });
  
  describe('format', function () {    
    it('should format matrix', function() {
      var m = new CrsMatrix(
        [
          [0, 0], 
          [0, 1/3]
        ]);
      assert.equal(m.format(), 'CRS [2 x 2] density: 0.25\n\n    (1, 1) ==> 0.3333333333333333');

      m = new CrsMatrix(
        [
          [0, 0], 
          [0, 1/3]
        ]);
      assert.equal(m.format(3), 'CRS [2 x 2] density: 0.25\n\n    (1, 1) ==> 0.333');

      m = new CrsMatrix(
        [
          [0, 0], 
          [0, 1/3]
        ]);
      assert.equal(m.format(4), 'CRS [2 x 2] density: 0.25\n\n    (1, 1) ==> 0.3333');
    });
  });
});