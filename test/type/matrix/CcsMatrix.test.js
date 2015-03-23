var assert = require('assert');
var math = require('../../../index');
var index = math.index;
var Matrix = math.type.Matrix;
var CcsMatrix = math.type.CcsMatrix;
var DenseMatrix = math.type.DenseMatrix;
var Complex = math.type.Complex;

describe('CcsMatrix', function() {

  describe('constructor', function() {

    it('should create empty matrix if called with no argument', function() {
      var m = new CcsMatrix();
      assert.deepEqual(m._size, [0]);
      assert.deepEqual(m._values, []);
      assert.deepEqual(m._index, []);
      assert.deepEqual(m._ptr, [0]);
    });

    it('should create a CCS from an array', function () {
      var m = new CcsMatrix(
        [
          [10, 0, 0, 0, -2, 0],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [0, 4, 0, 0, 2, -1]
        ]);
      assert.deepEqual(m._size, [6, 6]);
      assert.deepEqual(m._values, [10, 3, 3, 9, 7, 8, 4, 8, 8, 7, 7, 9, -2, 5, 9, 2, 3, 13, -1]);
      assert.deepEqual(m._index, [0, 1, 3, 1, 2, 4, 5, 2, 3, 2, 3, 4, 0, 3, 4, 5, 1, 4, 5]);
      assert.deepEqual(m._ptr, [0, 3, 7, 9, 12, 16, 19]);
    });
    
    it('should create a CCS from an array, empty column', function () {
      var m = new CcsMatrix(
        [
          [1, 0, 0],
          [0, 0, 1]
        ]);
      assert.deepEqual(m._size, [2, 3]);
      assert.deepEqual(m._values, [1, 1]);
      assert.deepEqual(m._index, [0, 1]);
      assert.deepEqual(m._ptr, [0, 1, 1, 2]);
    });
    
    it('should create a CCS from an array, empty row', function () {
      var m = new CcsMatrix(
        [
          [1, 0],
          [0, 0],
          [0, 1]
        ]);
      assert.deepEqual(m._size, [3, 2]);
      assert.deepEqual(m._values, [1, 1]);
      assert.deepEqual(m._index, [0, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2]);
    });
    
    it('should create an empty CCS from an array', function () {
      var m = new CcsMatrix([]);
      assert.deepEqual(m._size, [0, 0]);
      assert.deepEqual(m._values, []);
      assert.deepEqual(m._index, []);
      assert.deepEqual(m._ptr, [0]);
    });

    it('should create a CCS from a vector', function () {
      var m = new CcsMatrix([1, 2, 3]);
      assert.deepEqual(m._size, [3, 1]);
      assert.deepEqual(m._values, [1, 2, 3]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 3]);
    });
    
    it('should create a CcsMatrix from another CcsMatrix', function () {
      var m1 = new CcsMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ]);
      var m2 = new CcsMatrix(m1);
      assert.deepEqual(m1._size, m2._size);
      assert.deepEqual(m1._values, m2._values);
      assert.deepEqual(m1._index, m2._index);
      assert.deepEqual(m1._ptr, m2._ptr);
    });
    
    it('should create a CcsMatrix from a DenseMatrix', function () {
      var m1 = new DenseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ]);
      var m2 = new CcsMatrix(m1);
      assert.deepEqual(m1.size(), m2.size());
      assert.deepEqual(m1.toArray(), m2.toArray());
    });
    
    it('should throw an error when called without new keyword', function () {
      assert.throws(function () { CcsMatrix(); }, /Constructor must be called with the new operator/);
    });
  });

  describe('size', function() {

    it('should return the expected size', function() {
      assert.deepEqual(new CcsMatrix([[23]]).size(), [1, 1]);
      assert.deepEqual(new CcsMatrix([[1, 2, 3], [4, 5, 6]]).size(), [2, 3]);
      assert.deepEqual(new CcsMatrix([[1], [2], [3]]).size(), [3, 1]);
      assert.deepEqual(new CcsMatrix([[]]).size(), [1, 0]);
    });
  });
  
  describe('toString', function() {
    it('should return string representation of matrix', function() {
      assert.equal(new CcsMatrix([[1,2],[3,4]]).toString(), '[[1, 2], [3, 4]]');
      assert.equal(new CcsMatrix([[1,2],[3,1/3]]).toString(), '[[1, 2], [3, 0.3333333333333333]]');
    });
  });
  
  describe('toJSON', function () {

    it('should serialize Matrix', function() {
      assert.deepEqual(
        new CcsMatrix([[1, 2], [3, 4]]).toJSON(),
        {
          mathjs: 'CcsMatrix',
          values: [1, 3, 2, 4],
          index: [0, 1, 0, 1],
          ptr: [0, 2, 4],
          size: [2, 2]
        });
    });
  });
  
  describe('fromJSON', function () {

    it('should deserialize Matrix', function() {
      var json = {
        mathjs: 'CcsMatrix',
        values: [1, 3, 2, 4],
        index: [0, 1, 0, 1],
        ptr: [0, 2, 4],
        size: [2, 2]
      };
      var m = CcsMatrix.fromJSON(json);
      assert.ok(m instanceof Matrix);

      assert.deepEqual(m._size, [2, 2]);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2],
          [3, 4]
        ]);
    });
  });
  
  describe('format', function () {    
    it('should format matrix', function() {
      var m = new CcsMatrix(
        [
          [0, 0], 
          [0, 1/3]
        ]);
      assert.equal(m.format(), 'CCS [2 x 2] density: 0.25\n\n    (1, 1) ==> 0.3333333333333333');
      
      m = new CcsMatrix(
        [
          [0, 0], 
          [0, 1/3]
        ]);
      assert.equal(m.format(3), 'CCS [2 x 2] density: 0.25\n\n    (1, 1) ==> 0.333');
      
      m = new CcsMatrix(
        [
          [0, 0], 
          [0, 1/3]
        ]);
      assert.equal(m.format(4), 'CCS [2 x 2] density: 0.25\n\n    (1, 1) ==> 0.3333');
    });
  });
  
  describe('resize', function() {

    it('should increase columns as needed, zero value', function() {
      var m = new CcsMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ]);
      m.resize([2, 4]);
      assert.deepEqual(m._size, [2, 4]);
      assert.deepEqual(m._values, [1, 4, 2, 5, 3, 6]);
      assert.deepEqual(m._index, [0, 1, 0, 1, 0, 1]);
      assert.deepEqual(m._ptr, [0, 2, 4, 6, 6]);
      assert.deepEqual(
        m.toArray(), 
        [
          [1, 2, 3, 0],
          [4, 5, 6, 0]
        ]);
    });

    it('should increase columns as needed, non zero value', function() {
      var m = new CcsMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ]);
      m.resize([2, 4], 100);
      assert.deepEqual(m._size, [2, 4]);
      assert.deepEqual(m._values, [1, 4, 2, 5, 3, 6, 100, 100]);
      assert.deepEqual(m._index, [0, 1, 0, 1, 0, 1, 0, 1]);
      assert.deepEqual(m._ptr, [0, 2, 4, 6, 8]);
      assert.deepEqual(
        m.toArray(), 
        [
          [1, 2, 3, 100],
          [4, 5, 6, 100]
        ]);
    });

    it('should increase rows as needed, zero value', function() {
      var m = new CcsMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ]);
      m.resize([3, 3]);
      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(m._values, [1, 4, 2, 5, 3, 6]);
      assert.deepEqual(m._index, [0, 1, 0, 1, 0, 1]);
      assert.deepEqual(m._ptr, [0, 2, 4, 6]);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2, 3],
          [4, 5, 6],
          [0, 0, 0]
        ]);
    });

    it('should increase rows as needed, non zero value', function() {
      var m = new CcsMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ]);
      m.resize([3, 3], 100);
      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(m._values, [1, 4, 100, 2, 5, 100, 3, 6, 100]);
      assert.deepEqual(m._index, [0, 1, 2, 0, 1, 2, 0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 3, 6, 9]);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2, 3],
          [4, 5, 6],
          [100, 100, 100]
        ]);
    });

    it('should increase rows & columns as needed, zero value, empty CCS', function() {
      var m = new CcsMatrix([]);
      m.resize([2, 2]);
      assert.deepEqual(m._size, [2, 2]);
      assert.deepEqual(m._values, []);
      assert.deepEqual(m._index, []);
      assert.deepEqual(m._ptr, [0, 0, 0]);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0],
          [0, 0]
        ]);
    });

    it('should increase rows & columns as needed, non zero value, empty CCS', function() {
      var m = new CcsMatrix([]);
      m.resize([2, 2], 100);
      assert.deepEqual(m._size, [2, 2]);
      assert.deepEqual(m._values, [100, 100, 100, 100]);
      assert.deepEqual(m._index, [0, 1, 0, 1]);
      assert.deepEqual(m._ptr, [0, 2, 4]);
      assert.deepEqual(
        m.toArray(), 
        [
          [100, 100],
          [100, 100]
        ]);
    });

    it('should decrease columns as needed', function() {
      var m = new CcsMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ]);
      m.resize([2, 2]);
      assert.deepEqual(m._size, [2, 2]);
      assert.deepEqual(m._values, [1, 4, 2, 5]);
      assert.deepEqual(m._index, [0, 1, 0, 1]);
      assert.deepEqual(m._ptr, [0, 2, 4]);
      assert.deepEqual(
        m.toArray(), 
        [
          [1, 2],
          [4, 5]
        ]);
    });

    it('should decrease columns as needed, zero matrix', function() {
      var m = new CcsMatrix(
        [
          [0, 0, 0],
          [0, 0, 0]
        ]);
      m.resize([2, 2]);
      assert.deepEqual(m._size, [2, 2]);
      assert.deepEqual(m._values, []);
      assert.deepEqual(m._index, []);
      assert.deepEqual(m._ptr, [0, 0, 0]);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0],
          [0, 0]
        ]);
    });

    it('should decrease rows as needed', function() {
      var m = new CcsMatrix(
        [
          [1, 2],
          [3, 4]
        ]);
      m.resize([1, 2]);
      assert.deepEqual(m._size, [1, 2]);
      assert.deepEqual(m._values, [1, 2]);
      assert.deepEqual(m._index, [0, 0]);
      assert.deepEqual(m._ptr, [0, 1, 2]);
      assert.deepEqual(
        m.toArray(), 
        [
          [1, 2]
        ]);
    });

    it('should decrease rows as needed, zero CCS', function() {
      var m = new CcsMatrix(
        [
          [0, 0],
          [0, 0]
        ]);
      m.resize([1, 2]);
      assert.deepEqual(m._size, [1, 2]);
      assert.deepEqual(m._values, []);
      assert.deepEqual(m._index, []);
      assert.deepEqual(m._ptr, [0, 0, 0]);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0]
        ]);
    });

    it('should decrease rows & columns as needed, zero CCS', function() {
      var m = new CcsMatrix(
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ]);
      m.resize([2, 2]);
      assert.deepEqual(m._size, [2, 2]);
      assert.deepEqual(m._values, []);
      assert.deepEqual(m._index, []);
      assert.deepEqual(m._ptr, [0, 0, 0]);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0],
          [0, 0]
        ]);
    });
    
    it('should return a different matrix when copy=true', function() {
      var m1 = new CcsMatrix(
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ]);
      var m2 = m1.resize([2, 2], 0, true);
      assert(m1 !== m2);
      // original matrix cannot be modified
      assert.deepEqual(m1._size, [4, 4]);
      assert.deepEqual(m1._values, []);
      assert.deepEqual(m1._index, []);
      assert.deepEqual(m1._ptr, [0, 0, 0, 0, 0]);
      assert.deepEqual(
        m1.toArray(), 
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ]);
      // new matrix should have correct size
      assert.deepEqual(m2._size, [2, 2]);
      assert.deepEqual(m2._values, []);
      assert.deepEqual(m2._index, []);
      assert.deepEqual(m2._ptr, [0, 0, 0]);
      assert.deepEqual(
        m2.toArray(), 
        [
          [0, 0],
          [0, 0]
        ]);
    });
  });
  
  describe('get', function () {

    it('should throw on invalid element position', function () {
      var m = new CcsMatrix([
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
    
    it('should throw an error in case of dimension mismatch', function() {
      var m = new CcsMatrix([[0, 1], [2, 3]]);
      assert.throws(function () { m.get([0,2,0,2,0,2]); }, /Dimension mismatch/);
    });

    it('should get matrix element', function () {
      var m = new CcsMatrix([
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
      var m = new CcsMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ]);

      assert.throws(function () { m.set([-1, 0]); }, /Index out of range \(-1 < 0\)/);
      assert.throws(function () { m.set([0, -1]); }, /Index out of range \(-1 < 0\)/);
      assert.throws(function () { m.set([0, 1.5]); }, /Index must be an integer \(value: 1\.5\)/);
    });

    it('should remove matrix element', function () {
      var m = new CcsMatrix([
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
      var m = new CcsMatrix([
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
      var m = new CcsMatrix([
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

    it('should add rows as meeded', function () {
      var m = new CcsMatrix([
        [1, 2],
        [3, 4]
      ]);

      m.set([3, 1], 22);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2],
          [3, 4],
          [0, 0],
          [0, 22]
        ]);

      m.set([4, 0], 33);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2],
          [3, 4],
          [0, 0],
          [0, 22],
          [33, 0]
        ]);
    });

    it('should add columns as meeded', function () {
      var m = new CcsMatrix([
        [1, 2],
        [3, 4]
      ]);

      m.set([1, 3], 22);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2, 0, 0],
          [3, 4, 0, 22],
        ]);

      m.set([0, 4], 33);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2, 0, 0, 33],
          [3, 4, 0, 22, 0],
        ]);
    });

    it('should add rows & columns as meeded', function () {
      var m = new CcsMatrix([
        [1, 2],
        [3, 4]
      ]);

      m.set([3, 3], 22);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2, 0, 0],
          [3, 4, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 22]
        ]);

      m.set([4, 4], 33);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2, 0, 0, 0],
          [3, 4, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 22, 0],
          [0, 0, 0, 0, 33]
        ]);
    });

    it('should add rows as meeded, non zero default', function () {
      var m = new CcsMatrix([
        [1, 2],
        [3, 4]
      ]);

      m.set([3, 1], 22, -1);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2],
          [3, 4],
          [-1, -1],
          [-1, 22]
        ]);

      m.set([4, 0], 33, -2);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2],
          [3, 4],
          [-1, -1],
          [-1, 22],
          [33, -2]
        ]);
    });

    it('should add columns as meeded, non zero default', function () {
      var m = new CcsMatrix([
        [1, 2],
        [3, 4]
      ]);

      m.set([1, 3], 22, -1);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2, -1, -1],
          [3, 4, -1, 22],
        ]);

      m.set([0, 4], 33, -2);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2, -1, -1, 33],
          [3, 4, -1, 22, -2],
        ]);
    });

    it('should add rows & columns as meeded, non zero default', function () {
      var m = new CcsMatrix([
        [1, 2],
        [3, 4]
      ]);

      m.set([3, 3], 22, -1);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2, -1, -1],
          [3, 4, -1, -1],
          [-1, -1, -1, -1],
          [-1, -1, -1, 22]
        ]);

      m.set([4, 4], 33, -2);
      assert.deepEqual(
        m.toArray(),
        [
          [1, 2, -1, -1, -2],
          [3, 4, -1, -1, -2],
          [-1, -1, -1, -1, -2],
          [-1, -1, -1, 22, -2],
          [-2, -2, -2, -2, 33]
        ]);
    });
  });

  describe('get subset', function() {

    it('should get the right subset of the matrix', function() {
      var m = new CcsMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ]);
      assert.deepEqual(m.size(), [3, 3]);
      assert.deepEqual(m.subset(index(1, 1)), 5);
      assert.deepEqual(m.subset(index([0, 2],[0, 2])).toArray(), [[1, 2], [4, 5]]);
      assert.deepEqual(m.subset(index(1, [1, 3])).toArray(), [[5, 6]]);
      assert.deepEqual(m.subset(index(0, [1, 3])).toArray(), [[2, 3]]);
      assert.deepEqual(m.subset(index([1, 3], 1)).toArray(), [[5], [8]]);
      assert.deepEqual(m.subset(index([1, 3], 2)).toArray(), [[6], [9]]);
    });

    /* TODO: implement!
    it('should squeeze the output when index contains a scalar', function() {
      var m = new CcsMatrix(math.range(0, 10));
      // assert.deepEqual(m.subset(index(1)), 1);
      assert.deepEqual(m.subset(index([1, 2])), new CcsMatrix([1]));

      m = new CcsMatrix([[1,2], [3, 4]]);
      assert.deepEqual(m.subset(index(1, 1)), 4);
      assert.deepEqual(m.subset(index([1, 2], 1)), new CcsMatrix([[4]]));
      assert.deepEqual(m.subset(index(1, [1, 2])), new CcsMatrix([[4]]));
      assert.deepEqual(m.subset(index([1, 2], [1, 2])), new CcsMatrix([[4]]));
    });
    */
    it('should throw an error if the given subset is invalid', function() {
      var m = new CcsMatrix();
      assert.throws(function () { m.subset([-1]); });

      m = new CcsMatrix([[1, 2, 3], [4, 5, 6]]);
      assert.throws(function () { m.subset([1, 2, 3]); });
      assert.throws(function () { m.subset([3, 0]); });
      assert.throws(function () { m.subset([1]); });
    });
    
    /* TODO: implement!
    it('should throw an error in case of wrong number of arguments', function() {
      var m = new CcsMatrix();
      assert.throws(function () { m.subset();}, /Wrong number of arguments/);
      assert.throws(function () { m.subset(1, 2, 3, 4); }, /Wrong number of arguments/);
    });
    */
    it('should throw an error in case of dimension mismatch', function() {
      var m = new CcsMatrix([[1,2,3],[4,5,6]]);
      assert.throws(function () { m.subset(index([0,2])); }, /Dimension mismatch/);
    });
  });

  describe('set subset', function() {
    
    it('should set scalar value', function () {
      var m = new CcsMatrix([
        [0, 0],
        [0, 0]
      ]);
      
      m.subset(index(1, 1), 1);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0],
          [0, 1]
        ]);
      
      m.subset(index(0, 0), 2);
      assert.deepEqual(
        m.toArray(), 
        [
          [2, 0],
          [0, 1]
        ]);
    });
    
    it('should set scalar value growing matrix', function () {
      var m = new CcsMatrix([
        [0, 0],
        [0, 1]
      ]);

      m.subset(index(2, 2), 2);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0],
          [0, 1, 0],
          [0, 0, 2]
        ]);
    });
    
    it('should set scalar value growing matrix, default value', function () {
      var m = new CcsMatrix([
        [0, 0],
        [0, 1]
      ]);

      m.subset(index(2, 2), 2, 1);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 1],
          [0, 1, 1],
          [1, 1, 2]
        ]);
    });

    it('should set vector value', function () {
      var m = new CcsMatrix([
        [0, 0],
        [0, 0]
      ]);

      m.subset(index(0, [0, 2]), [1, 2]);
      assert.deepEqual(
        m.toArray(), 
        [
          [1, 2],
          [0, 0]
        ]);
      
      m.subset(index(1, [0, 2]), [3, 4]);
      assert.deepEqual(
        m.toArray(), 
        [
          [1, 2],
          [3, 4]
        ]);
    });

    it('should set subset', function() {
      // set 2-dimensional
      var m = new CcsMatrix(
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ]);
      
      m.subset(index([1, 3], [1, 3]), [[1, 2], [3, 4]]);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0],
          [0, 1, 2],
          [0, 3, 4]
        ]);

      m.subset(index(0, [0, 3]), [5, 6, 7]);
      assert.deepEqual(
        m.toArray(), 
        [
          [5, 6, 7],
          [0, 1, 2],
          [0, 3, 4]
        ]);      

      m.subset(index([0,3], 0), [8,9,10]);
      assert.deepEqual(
        m.toArray(), 
        [
          [8, 6, 7],
          [9, 1, 2],
          [10, 3, 4]
        ]);
    });
    
    it('should set subset growing matrix', function() {
      // set 2-dimensional
      var m = new CcsMatrix(
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ]);

      m.subset(index([2, 4], [2, 4]), [[1, 2], [3, 4]]);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 1, 2],
          [0, 0, 3, 4]
        ]);

      m.subset(index(4, [0, 3]), [5, 6, 7]);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 1, 2],
          [0, 0, 3, 4],
          [5, 6, 7, 0]
        ]);      

      m.subset(index([0, 3], 4), [8, 9, 10]);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0, 0, 8],
          [0, 0, 0, 0, 9],
          [0, 0, 1, 2, 10],
          [0, 0, 3, 4, 0],
          [5, 6, 7, 0, 0]
        ]);
    });
    
    it('should set subset growing matrix, default value', function() {
      // set 2-dimensional
      var m = new CcsMatrix(
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ]);

      m.subset(index([2, 4], [2, 4]), [[1, 2], [3, 4]], -1);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0, -1],
          [0, 0, 0, -1],
          [0, 0, 1, 2],
          [-1, -1, 3, 4]
        ]);

      m.subset(index(4, [0, 3]), [5, 6, 7], -2);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0, -1],
          [0, 0, 0, -1],
          [0, 0, 1, 2],
          [-1, -1, 3, 4],
          [5, 6, 7, -2]
        ]);      

      m.subset(index([0, 3], 4), [8, 9, 10], -3);
      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0, -1, 8],
          [0, 0, 0, -1, 9],
          [0, 0, 1, 2, 10],
          [-1, -1, 3, 4, -3],
          [5, 6, 7, -2, -3]
        ]);
    });
    
    it ('should throw an error in case of wrong type of index', function () {
      assert.throws(function () { new CcsMatrix().subset('no index', 2); }, /Invalid index/);
    });

    it ('should throw an error in case of wrong size of submatrix', function () {
      assert.throws(function () { new CcsMatrix().subset(index(0), [2,3]); }, /Scalar expected/);
    });
  });
  
  describe('map', function() {

    it('should apply the given function to all elements in the matrix', function() {
      var m, m2;

      m = new CcsMatrix([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11,12],
        [13, 14, 15,16]
      ]);
      m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.toArray(), [
        [2, 4, 6, 8],
        [10, 12, 14, 16],
        [18, 20, 22, 24],
        [26, 28, 30, 32]
      ]);

      m = new CcsMatrix([1]);
      m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.toArray(), [[2]]);

      m = new CcsMatrix([1,2,3]);
      m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.toArray(), [[2],[4],[6]]);
    });

    it('should work on empty matrices', function() {
      var m = new CcsMatrix([]);
      var m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.toArray(), []);
    });

    it('should process all values (zero and non-zero)', function() {
      var m = new CcsMatrix(
        [
          [0, 0],
          [0, 0]
        ]
      );
      var m2 = m.map(function (value) { return value + 2; });
      assert.deepEqual(
        m2.toArray(),
        [
          [2, 2],
          [2, 2]
        ]);
    });

    it('should process non-zero values', function() {
      var m = new CcsMatrix(
        [
          [1, 0],
          [0, 0]
        ]
      );
      var counter = 0;
      
      var m2 = m.map(
        function (value) { 
          counter++;
          return value + 2; 
        }, 
        m, 
        true);
      
      assert(counter === 1);
      assert.deepEqual(
        m2.toArray(),
        [
          [3, 0],
          [0, 0]
        ]);
    });

    it('should invoke callback with parameters value, index, obj', function() {
      var m = new CcsMatrix([[1, 2, 3], [4, 5, 6]]);

      var m2 = m.map(
        function (value, index, obj) {
          return value + index[0] * 100 + index[1] * 10 + (obj === m ? 1000 : 0);
        }
      );

      assert.deepEqual(
        m2.toArray(), 
        [
          [1001, 1012, 1023],
          [1104, 1115, 1126]
        ]);
    });
  });
  
  describe('forEach', function() {

    it('should run on all elements of the matrix', function() {
      var m, output;

      m = new CcsMatrix([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11,12],
        [13, 14, 15,16]
      ]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]);

      m = new CcsMatrix([1]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, [1]);

      m = new CcsMatrix([1,2,3]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, [1,2,3]);
    });

    it('should work on empty matrices', function() {
      var m = new CcsMatrix([]);
      var output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, []);
    });
    
    it('should process non-zero values', function() {
      var m = new CcsMatrix(
        [
          [1, 0],
          [0, 0]
        ]
      );
      var counter = 0;
      
      m.forEach(function () { counter++; }, true);
      assert(counter === 1);
    });

    it('should invoke callback with parameters value, index, obj', function() {
      var m = new CcsMatrix([[1,2,3], [4,5,6]]);
      var output = [];
      m.forEach(
        function (value, index, obj) {
          output.push(value + index[0] * 100 + index[1] * 10 + (obj === m ? 1000 : 0));
        }
      );
      assert.deepEqual(output, [1001, 1104, 1012, 1115, 1023, 1126]);
    });
  });
  
  describe('clone', function() {

    it('should clone the matrix properly', function() {
      var m1 = new CcsMatrix(
        [
          [1,2,3],
          [4,5,6]
        ]);

      var m2 = m1.clone();

      assert.deepEqual(m1.toArray(), m2.toArray());
    });
  });
  
  describe('toArray', function () {

    it('should return array', function () {
      var m = new CcsMatrix({
        values: [10, 3, 3, 9, 7, 8, 4, 8, 8, 7, 7, 9, -2, 5, 9, 2, 3, 13, -1],
        index: [0, 1, 3, 1, 2, 4, 5, 2, 3, 2, 3, 4, 0, 3, 4, 5, 1, 4, 5],
        ptr: [0, 3, 7, 9, 12, 16, 19],
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
    
    it('should return array, empty column', function () {
      var m = new CcsMatrix({
        values: [1, 1],
        index: [0, 1],
        ptr: [0, 1, 1, 2],
        size: [2, 3]
      });

      var a = m.toArray();

      assert.deepEqual(
        a, 
        [
          [1, 0, 0],
          [0, 0, 1]
        ]);
    });
    
    it('should return array, complex numbers', function () {
      var m = new CcsMatrix({
        values: [new Complex(1, 1), new Complex(4, 4), new Complex(5, 5), new Complex(2, 2), new Complex(3, 3), new Complex(6, 6)],
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

    it('should create CCS matrix (n x n)', function () {
      
      var m = CcsMatrix.diagonal([3, 3], 1);

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
    
    it('should create CCS matrix (n x n), k > 0', function () {

      var m = CcsMatrix.diagonal([3, 3], 1, 1);

      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(m._values, [1, 1]);
      assert.deepEqual(m._index, [0, 1]);
      assert.deepEqual(m._ptr, [0, 0, 1, 2]);

      assert.deepEqual(
        m.toArray(), 
        [
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0]
        ]);
    });
    
    it('should create CCS matrix (n x n), k < 0', function () {

      var m = CcsMatrix.diagonal([3, 3], 1, -1);

      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(m._values, [1, 1]);
      assert.deepEqual(m._index, [1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 2]);

      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0]
        ]);
    });
    
    it('should create CCS matrix (n x n), vector value', function () {

      var m = CcsMatrix.diagonal([3, 3], [1, 2, 3]);

      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(m._values, [1, 2, 3]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3]);

      assert.deepEqual(
        m.toArray(), 
        [
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 3]
        ]);
    });
    
    it('should create CCS matrix (n x n), vector value, k > 0', function () {

      var m = CcsMatrix.diagonal([3, 3], [1, 2], 1);

      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(m._values, [1, 2]);
      assert.deepEqual(m._index, [0, 1]);
      assert.deepEqual(m._ptr, [0, 0, 1, 2]);

      assert.deepEqual(
        m.toArray(), 
        [
          [0, 1, 0],
          [0, 0, 2],
          [0, 0, 0]
        ]);
    });
    
    it('should create CCS matrix (n x n), vector value, k < 0', function () {

      var m = CcsMatrix.diagonal([3, 3], [1, 2], -1);

      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(m._values, [1, 2]);
      assert.deepEqual(m._index, [1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 2]);

      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 2, 0]
        ]);
    });
    
    it('should create CCS matrix (n x n), complex number', function () {

      var m = CcsMatrix.diagonal([3, 3], new Complex(1, 1));

      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(m._values, [new Complex(1, 1), new Complex(1, 1), new Complex(1, 1)]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3]);
    });
    
    it('should create CCS matrix (m x n), m > n', function () {

      var m = CcsMatrix.diagonal([4, 3], 1);

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
    
    it('should create CCS matrix (m x n), m > n, k > 0', function () {

      var m = CcsMatrix.diagonal([4, 3], 1, 1);

      assert.deepEqual(m._size, [4, 3]);
      assert.deepEqual(m._values, [1, 1]);
      assert.deepEqual(m._index, [0, 1]);
      assert.deepEqual(m._ptr, [0, 0, 1, 2]);

      assert.deepEqual(
        m.toArray(), 
        [
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0],
          [0, 0, 0]
        ]);
    });
    
    it('should create CCS matrix (m x n), m > n, k < 0', function () {

      var m = CcsMatrix.diagonal([4, 3], 1, -1);

      assert.deepEqual(m._size, [4, 3]);
      assert.deepEqual(m._values, [1, 1, 1]);
      assert.deepEqual(m._index, [1, 2, 3]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3]);

      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ]);
    });
    
    it('should create CCS matrix (m x n), m > n, vector value', function () {

      var m = CcsMatrix.diagonal([4, 3], [1, 2, 3]);

      assert.deepEqual(m._size, [4, 3]);
      assert.deepEqual(m._values, [1, 2, 3]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3]);

      assert.deepEqual(
        m.toArray(), 
        [
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 3],
          [0, 0, 0]
        ]);
    });
    
    it('should create CCS matrix (m x n), m > n, vector value, k > 0', function () {

      var m = CcsMatrix.diagonal([4, 3], [1, 2], 1);

      assert.deepEqual(m._size, [4, 3]);
      assert.deepEqual(m._values, [1, 2]);
      assert.deepEqual(m._index, [0, 1]);
      assert.deepEqual(m._ptr, [0, 0, 1, 2]);

      assert.deepEqual(
        m.toArray(), 
        [
          [0, 1, 0],
          [0, 0, 2],
          [0, 0, 0],
          [0, 0, 0]
        ]);
    });
    
    it('should create CCS matrix (m x n), m > n, vector value, k < 0', function () {

      var m = CcsMatrix.diagonal([4, 3], [1, 2, 3], -1);

      assert.deepEqual(m._size, [4, 3]);
      assert.deepEqual(m._values, [1, 2, 3]);
      assert.deepEqual(m._index, [1, 2, 3]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3]);

      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 3]
        ]);
    });
    
    it('should create CCS matrix (m x n), m < n', function () {

      var m = CcsMatrix.diagonal([3, 4], 1);

      assert.deepEqual(m._size, [3, 4]);
      assert.deepEqual(m._values, [1, 1, 1]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3, 3]);

      assert.deepEqual(
        m.toArray(), 
        [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0]
        ]);
    });
    
    it('should create CCS matrix (m x n), m < n, k > 0', function () {

      var m = CcsMatrix.diagonal([3, 4], 1, 1);

      assert.deepEqual(m._size, [3, 4]);
      assert.deepEqual(m._values, [1, 1, 1]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 0, 1, 2, 3]);

      assert.deepEqual(
        m.toArray(), 
        [
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]
        ]);
    });
    
    it('should create CCS matrix (m x n), m < n, k < 0', function () {

      var m = CcsMatrix.diagonal([3, 4], 1, -1);

      assert.deepEqual(m._size, [3, 4]);
      assert.deepEqual(m._values, [1, 1]);
      assert.deepEqual(m._index, [1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 2, 2]);

      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [0, 1, 0, 0]
        ]);
    });
    
    it('should create CCS matrix (m x n), m < n, vector value', function () {

      var m = CcsMatrix.diagonal([3, 4], [1, 2, 3]);

      assert.deepEqual(m._size, [3, 4]);
      assert.deepEqual(m._values, [1, 2, 3]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3, 3]);

      assert.deepEqual(
        m.toArray(), 
        [
          [1, 0, 0, 0],
          [0, 2, 0, 0],
          [0, 0, 3, 0]
        ]);
    });
    
    it('should create CCS matrix (m x n), m < n, vector value, k > 0', function () {

      var m = CcsMatrix.diagonal([3, 4], [1, 2, 3], 1);

      assert.deepEqual(m._size, [3, 4]);
      assert.deepEqual(m._values, [1, 2, 3]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 0, 1, 2, 3]);

      assert.deepEqual(
        m.toArray(), 
        [
          [0, 1, 0, 0],
          [0, 0, 2, 0],
          [0, 0, 0, 3]
        ]);
    });
    
    it('should create CCS matrix (m x n), m < n, vector value, k < 0', function () {

      var m = CcsMatrix.diagonal([3, 4], [1, 2], -1);

      assert.deepEqual(m._size, [3, 4]);
      assert.deepEqual(m._values, [1, 2]);
      assert.deepEqual(m._index, [1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 2, 2]);

      assert.deepEqual(
        m.toArray(), 
        [
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [0, 2, 0, 0]
        ]);
    });
    
    it('should get CCS matrix diagonal (n x n)', function () {

      var m = new CcsMatrix(
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ]);

      assert.deepEqual(m.diagonal(), [1, 1, 1]);
    });
    
    it('should get CCS matrix diagonal (n x n), k > 0', function () {

      var m = new CcsMatrix(
        [
          [1, 2, 0],
          [0, 1, 3],
          [0, 0, 1]
        ]);

      assert.deepEqual(m.diagonal(1), [2, 3]);
    });
    
    it('should get CCS matrix diagonal (n x n), k < 0', function () {

      var m = new CcsMatrix(
        [
          [1, 0, 0],
          [2, 1, 0],
          [0, 3, 1]
        ]);

      assert.deepEqual(m.diagonal(-1), [2, 3]);
    });
    
    it('should get CCS matrix diagonal (m x n), m > n', function () {

      var m = new CcsMatrix(
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0]
        ]);

      assert.deepEqual(m.diagonal(), [1, 1, 1]);
    });

    it('should get CCS matrix diagonal (m x n), m > n, k > 0', function () {

      var m = new CcsMatrix(
        [
          [1, 2, 0],
          [0, 1, 3],
          [0, 0, 1],
          [0, 0, 0]
        ]);

      assert.deepEqual(m.diagonal(1), [2, 3]);
    });
    
    it('should get CCS matrix diagonal (m x n), m > n, k < 0', function () {

      var m = new CcsMatrix(
        [
          [1, 0, 0],
          [2, 1, 0],
          [0, 3, 1],
          [0, 0, 4]
        ]);

      assert.deepEqual(m.diagonal(-1), [2, 3, 4]);
    });
    
    it('should get CCS matrix diagonal (m x n), m < n', function () {

      var m = new CcsMatrix(
        [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0]
        ]);

      assert.deepEqual(m.diagonal(), [1, 1, 1]);
    });
    
    it('should get CCS matrix diagonal (m x n), m < n, k > 0', function () {

      var m = new CcsMatrix(
        [
          [1, 2, 0, 0],
          [0, 1, 3, 0],
          [0, 0, 1, 4]
        ]);
      
      assert.deepEqual(m.diagonal(1), [2, 3, 4]);
    });
    
    it('should get CCS matrix diagonal (m x n), m < n, k < 0', function () {

      var m = new CcsMatrix(
        [
          [1, 0, 0, 0],
          [2, 1, 0, 0],
          [4, 3, 1, 0]
        ]);

      assert.deepEqual(m.diagonal(-1), [2, 3]);
      
      assert.deepEqual(m.diagonal(-2), [4]);
    });
  });
  
  describe('transpose', function () {
    
    it('should transpose a 2d matrix', function() {
      var m = new CcsMatrix([[1,2,3],[4,5,6]]);
      assert.deepEqual(m.transpose().toArray(), [[1,4],[2,5],[3,6]]);
      
      m = new CcsMatrix([[1,2],[3,4]]);
      assert.deepEqual(m.transpose().toArray(), [[1,3],[2,4]]);
      
      m = new CcsMatrix([[1,2,3,4]]);
      assert.deepEqual(m.transpose().toArray(), [[1],[2],[3],[4]]);
    });
    
    it('should throw an error for invalid matrix transpose', function() {
      var m = new CcsMatrix([[]]);
      assert.throws(function () { m.transpose(); });
    });
  });
  
  describe('trace', function () {

    it('should calculate trace on a square matrix', function() {
      var m = new CcsMatrix([
        [1, 2],
        [4, -2]
      ]);
      assert.equal(m.trace(), -1);
      
      m = new CcsMatrix([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]);
      assert.equal(m.trace(), 0);
      
      m = new CcsMatrix([
        [1, 0, 0, 0],
        [0, 0, 2, 0],
        [1, 0, 0, 0],
        [0, 0, 1, 9]
      ]);
      assert.equal(m.trace(), 10);
    });
    
    it('should throw an error for invalid matrix', function() {
      var m = new CcsMatrix([
        [1, 2, 3],
        [4, 5, 6]
      ]);
      assert.throws(function () { m.trace(); });
    });
  });
  
  describe('multiply', function () {
    
    it('should multiply matrix x scalar', function() {
      var m = new CcsMatrix([
        [2, 0],
        [4, 0]
      ]);
      
      var r = m.multiply(3);
      assert.deepEqual(r._size, m._size);
      assert.deepEqual(r._values, [6, 12]);
      assert.deepEqual(r._index, m._index);
      assert.deepEqual(r._ptr, m._ptr);
      
      r = m.multiply(math.complex(3, 3));
      assert.deepEqual(r._size, m._size);
      assert.deepEqual(r._values, [math.complex(6, 6), math.complex(12, 12)]);
      assert.deepEqual(r._index, m._index);
      assert.deepEqual(r._ptr, m._ptr);
      
      r = m.multiply(math.bignumber(3));
      assert.deepEqual(r._size, m._size);
      assert.deepEqual(r._values, [math.bignumber(6), math.bignumber(12)]);
      assert.deepEqual(r._index, m._index);
      assert.deepEqual(r._ptr, m._ptr);
      
      r = m.multiply(true);
      assert.deepEqual(r._size, m._size);
      assert.deepEqual(r._values, [2, 4]);
      assert.deepEqual(r._index, m._index);
      assert.deepEqual(r._ptr, m._ptr);
      
      r = m.multiply(false);
      assert.deepEqual(r._size, m._size);
      assert.deepEqual(r._values, []);
      assert.deepEqual(r._index, []);
      assert.deepEqual(r._ptr, [0, 0, 0]);
    });
    
    it('should multiply matrix x matrix', function() {
      var m = new CcsMatrix([
        [2, 0],
        [4, 0]
      ]);
      
      var r = m.multiply(new CcsMatrix([
        [2, 0],
        [4, 0]
      ]));
      assert.deepEqual(
        r.valueOf(),
        [
          [4, 0],
          [8, 0]
        ]);
      
      r = m.multiply(math.matrix([
        [2, 0],
        [4, 0]
      ]), 'crs');
      assert.deepEqual(
        r.valueOf(),
        [
          [4, 0],
          [8, 0]
        ]);
      
      r = m.multiply(math.matrix([
        [2, 0],
        [4, 0]
      ]), 'dense');
      assert.deepEqual(
        r.valueOf(),
        [
          [4, 0],
          [8, 0]
        ]);
    });
    
    it('should multiply matrix x array', function() {
      var m = new CcsMatrix([
        [2, 0],
        [4, 0]
      ]);

      var r = m.multiply(
        [
          [2, 0],
          [4, 0]
        ]);
      assert.deepEqual(
        r.valueOf(),
        [
          [4, 0],
          [8, 0]
        ]);
      
      r = m.multiply(
        [
          [2, 0, 1],
          [4, 0, 1]
        ]);
      assert.deepEqual(
        r.valueOf(),
        [
          [4, 0, 2],
          [8, 0, 4]
        ]);
    });
    
    it('should multiply matrix x vector array', function() {
      var m = new CcsMatrix([
        [2, 0],
        [4, 0]
      ]);

      var r = m.multiply(
        [
          [2],
          [4]
        ]);
      assert.deepEqual(
        r.valueOf(),
        [
          [4],
          [8]
        ]);
    });
    
    it ('should squeeze scalar results of matrix * matrix', function () {
      var a = new CcsMatrix(
        [
          [1, 2, 3]
        ]);
      var b = new CcsMatrix(
        [
          [4], 
          [5], 
          [6]
        ]);
      assert.strictEqual(a.multiply(b), 32);
    });

    it ('should squeeze scalar results of matrix * vector', function () {
      var a = new CcsMatrix(
        [
          [1, 2, 3]
        ]);
      var b = [4, 5, 6];
      assert.strictEqual(a.multiply(b), 32);
    });
    
    it('should throw an error when multiplying matrices with incompatible sizes', function() {
      // vector * vector
      assert.throws(function () {math.matrix([1,1], 'ccs').multiply([1, 1, 1]);});

      // matrix * matrix
      assert.throws(function () {math.matrix([[1,1]], 'ccs').multiply([[1,1]]);});
      assert.throws(function () {math.matrix([[1,1]], 'ccs').multiply([[1,1], [1,1], [1,1]]);});

      // matrix * vector
      assert.throws(function () {math.matrix([[1,1], [1,1]], 'ccs').multiply([1,1,1]);});

      // vector * matrix
      assert.throws(function () {math.matrix([1,1,1], 'ccs').multiply([[1,1], [1,1]]);});
    });
  });
});