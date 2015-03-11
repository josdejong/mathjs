var assert = require('assert');
var math = require('../../../index');
var CrsMatrix = math.type.CrsMatrix;
var Complex = math.type.Complex;

describe('CrsMatrix', function() {

  describe('constructor', function() {

    it('should throw exception if called with no argument', function() {
      assert.throws(function () { new CrsMatrix(); }, /data must be an array/);
    });

    it('should create a CRS from an array', function () {
      var m = new CrsMatrix(
        [
          [10, 0, 0, 0, -2, 0],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [0, 4, 0, 0, 2, -1]
        ]);
      assert.equal(m._format, 'crs');
      assert.deepEqual(m._size, [6, 6]);
      assert.deepEqual(m._values, [10, -2, 3, 9, 3, 7, 8, 7, 3, 8, 7, 5, 8, 9, 9, 13, 4, 2, -1]);
      assert.deepEqual(m._index, [0, 4, 0, 1, 5, 1, 2, 3, 0, 2, 3, 4, 1, 3, 4, 5, 1, 4, 5]);
      assert.deepEqual(m._ptr, [0, 2, 5, 8, 12, 16, 19]);
    });

    it('should create a CRS from an array, empty column', function () {
      var m = new CrsMatrix(
        [
          [1, 0, 0],
          [0, 0, 1]
        ]);
      assert.equal(m._format, 'crs');
      assert.deepEqual(m._size, [2, 3]);
      assert.deepEqual(m._values, [1, 1]);
      assert.deepEqual(m._index, [0, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2]);
    });
    
    it('should create a CRS from an array, empty row', function () {
      var m = new CrsMatrix(
        [
          [1, 0],
          [0, 0],
          [0, 1]
        ]);
      assert.equal(m._format, 'crs');
      assert.deepEqual(m._size, [3, 2]);
      assert.deepEqual(m._values, [1, 1]);
      assert.deepEqual(m._index, [0, 1]);
      assert.deepEqual(m._ptr, [0, 1, 1, 2]);
    });

    it('should create an empty CRS from an array', function () {
      var m = new CrsMatrix([]);
      assert.equal(m._format, 'crs');
      assert.deepEqual(m._size, [0, 0]);
      assert.deepEqual(m._values, []);
      assert.deepEqual(m._index, []);
      assert.deepEqual(m._ptr, [0]);
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
  
  describe('toArray', function () {
    
    it('should return array', function () {
      var m = new CrsMatrix({
        values: [10, -2, 3, 9, 3, 7, 8, 7, 3, 8, 7, 5, 8, 9, 9, 13, 4, 2, -1],
        index: [0, 4, 0, 1, 5, 1, 2, 3, 0, 2, 3, 4, 1, 3, 4, 5, 1, 4, 5],
        ptr: [0, 2, 5, 8, 12, 16, 19],
        size: [6, 6]
      });
      
      var a = m.toArray();
      
      assert.deepEqual(
        a, 
        [
          [10, 0, 0, 0, -2, 0],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [0, 4, 0, 0, 2, -1]
        ]);
    });
    
    it('should return array, empty row', function () {
      var m = new CrsMatrix({
        values: [1, 1],
        index: [0, 1],
        ptr: [0, 1, 1, 2],
        size: [3, 2]
      });

      var a = m.toArray();

      assert.deepEqual(
        a, 
        [
          [1, 0],
          [0, 0],
          [0, 1]
        ]);
    });
    
    it('should return array, complex numbers', function () {
      var m = new CrsMatrix({
        values: [new Complex(1, 1), new Complex(2, 2), new Complex(3, 3), new Complex(4, 4), new Complex(5, 5), new Complex(6, 6)],
        index: [0, 2, 2, 0, 1, 2],
        ptr: [0, 2, 3, 6],
        size: [3, 3]
      });

      var a = m.toArray();

      assert.deepEqual(
        a,
        [
          [new Complex(1, 1), 0, new Complex(2, 2)],
          [0, 0, new Complex(3, 3)],
          [new Complex(4, 4), new Complex(5, 5), new Complex(6, 6)]
        ]);
    });
  });
  
  describe('diagonal', function () {

    it('should create CRS matrix (n x n)', function () {

      var m = CrsMatrix.diagonal(3, 3, 1);

      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(m._values, [1, 1, 1]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3]);

      assert.deepEqual(
        m.toArray(), 
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ]);
    });

    it('should create CRS matrix (n x n), complex number', function () {

      var m = CrsMatrix.diagonal(3, 3, new Complex(1, 1));

      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(m._values, [new Complex(1, 1), new Complex(1, 1), new Complex(1, 1)]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3]);
    });

    it('should create CRS matrix (m x n), m > n', function () {

      var m = CrsMatrix.diagonal(4, 3, 1);

      assert.deepEqual(m._size, [4, 3]);
      assert.deepEqual(m._values, [1, 1, 1]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3]);

      assert.deepEqual(
        m.toArray(), 
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0]
        ]);
    });

    it('should create CRS matrix (m x n), m < n', function () {

      var m = CrsMatrix.diagonal(3, 4, 1);

      assert.deepEqual(m._size, [3, 4]);
      assert.deepEqual(m._values, [1, 1, 1]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3]);

      assert.deepEqual(
        m.toArray(), 
        [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0]
        ]);
    });
  });
  
  describe('get', function () {

    it('should throw on invalid element position', function () {
      var m = new CrsMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ]);

      assert.throws(function () { m.get([-1, 0]); }, /Index out of range \(-1 < 0\)/);
      assert.throws(function () { m.get([10, 0]); }, /Index out of range \(10 > 5\)/);
      assert.throws(function () { m.get([0, -1]); }, /Index out of range \(-1 < 0\)/);
      assert.throws(function () { m.get([0, 10]); }, /Index out of range \(10 > 5\)/);
    });
    
    it('should get matrix element', function () {
      var m = new CrsMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ]);

      assert.equal(m.get([0, 0]), 10);
      assert.equal(m.get([3, 1]), 0);
      assert.equal(m.get([5, 1]), 4);
      assert.equal(m.get([5, 5]), -1);
    });
  });
  
  describe('set', function () {

    it('should throw on invalid element position', function () {
      var m = new CrsMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ]);

      assert.throws(function () { m.set([-1, 0]); }, /Index out of range \(-1 < 0\)/);
      assert.throws(function () { m.set([10, 0]); }, /Index out of range \(10 > 5\)/);
      assert.throws(function () { m.set([0, -1]); }, /Index out of range \(-1 < 0\)/);
      assert.throws(function () { m.set([0, 10]); }, /Index out of range \(10 > 5\)/);
    });

    it('should remove matrix element', function () {
      var m = new CrsMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ]);

      m.set([0, 0], 0);
      m.set([0, 4], 0);
      m.set([5, 1], 0);

      assert.deepEqual(
        m.toArray(),
        [
          [0, 0, 0, 0, 0, 0],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [0, 0, 0, 0, 2, -1]
        ]);
    });

    it('should update matrix element (non zero)', function () {
      var m = new CrsMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ]);

      m.set([0, 0], 15);
      m.set([0, 4], 10);
      m.set([5, 1], 20);

      assert.deepEqual(
        m.toArray(),
        [
          [15, 0, 0, 0, 10, 0],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [0, 20, 0, 0, 2, -1]
        ]);
    });

    it('should update matrix element (zero)', function () {
      var m = new CrsMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ]);

      m.set([0, 1], 15);
      m.set([0, 5], 10);
      m.set([5, 0], 20);

      assert.deepEqual(
        m.toArray(),
        [
          [10, 15, 0, 0, -2, 10],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [20, 4, 0, 0, 2, -1]
        ]);
    });
  });
  
  describe('clone', function() {

    it('should clone the matrix properly', function() {
      var m1 = new CrsMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ]);

      var m2 = m1.clone();

      assert.deepEqual(m1.toArray(), m2.toArray());
    });
  });
  
  describe('toString', function() {
    it('should return string representation of matrix', function() {
      assert.equal(new CrsMatrix([[1,2],[3,4]]).toString(), '[[1, 2], [3, 4]]');
      assert.equal(new CrsMatrix([[1,2],[3,1/3]]).toString(), '[[1, 2], [3, 0.3333333333333333]]');
    });
  });
  
  describe('transpose', function () {

    it('should transpose a 2d matrix', function() {
      var m = new CrsMatrix([[1,2,3],[4,5,6]]);
      assert.deepEqual(m.transpose().toArray(), [[1,4],[2,5],[3,6]]);

      m = new CrsMatrix([[1,2],[3,4]]);
      assert.deepEqual(m.transpose().toArray(), [[1,3],[2,4]]);

      m = new CrsMatrix([[1,2,3,4]]);
      assert.deepEqual(m.transpose().toArray(), [[1],[2],[3],[4]]);
    });

    it('should throw an error for invalid matrix transpose', function() {
      var m = new CrsMatrix([[]]);
      assert.throws(function () { m.transpose(); });
    });
  });
});