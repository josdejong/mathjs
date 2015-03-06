var assert = require('assert');
var math = require('../../../index');
var DenseFormat = math.type.Matrix.format.dense;
var Complex = math.type.Complex;

describe('DenseFormat', function() {

  describe('constructor', function() {

    it('should throw exception if called with no argument', function() {
      assert.throws(function () { new DenseFormat(); }, /data must be an array/);
    });

    it('should create a DenseFormat from an array', function () {
      var m = new DenseFormat(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ]);
      assert.equal(m._format, 'dense');
      assert.deepEqual(m._size, [4, 3]);
      assert.deepEqual(
        m._data,
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ]);
    });

    it('should throw an error when called without new keyword', function () {
      assert.throws(function () { DenseFormat(); }, /Constructor must be called with the new operator/);
    });
  });

  describe('size', function() {

    it('should return the expected size', function() {
      assert.deepEqual(new DenseFormat([[23]]).size(), [1, 1]);
      assert.deepEqual(new DenseFormat([[1, 2, 3], [4, 5, 6]]).size(), [2, 3]);
      assert.deepEqual(new DenseFormat([[1], [2], [3]]).size(), [3, 1]);
      assert.deepEqual(new DenseFormat([[]]).size(), [1, 0]);
    });
  });

  describe('toArray', function () {

    it('should return array', function () {
      var m = new DenseFormat({
        data: 
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [10, 11, 12]
          ],
        size: [4, 3]
      });

      var a = m.toArray();

      assert.deepEqual(
        a, 
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ]);
    });

    it('should return array, complex numbers', function () {
      var m = new DenseFormat({
        data: [new Complex(1, 1), new Complex(4, 4), new Complex(5, 5), new Complex(2, 2), new Complex(3, 3), new Complex(6, 6)],
        size: [1, 6]
      });

      var a = m.toArray();

      assert.deepEqual(a, [new Complex(1, 1), new Complex(4, 4), new Complex(5, 5), new Complex(2, 2), new Complex(3, 3), new Complex(6, 6)]);
    });
  });

  /*
  describe('diagonal', function () {

    it('should create DenseFormat matrix (n x n)', function () {

      var m = DenseFormat.diagonal(3, 3, 1);

      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(
        m._data, 
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ]);
    });

    it('should create DenseFormat matrix (n x n), complex number', function () {

      var m = DenseFormat.diagonal(3, 3, new Complex(1, 1));

      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(
        m._data,
        [
          [new Complex(1, 1), 0, 0],
          [0, new Complex(1, 1), 0],
          [0, 0, new Complex(1, 1)]
        ]);
    });

    it('should create DenseFormat matrix (m x n), m > n', function () {

      var m = DenseFormat.diagonal(4, 3, 1);

      assert.equal(m._size, [4, 3]);
      assert.deepEqual(
        m._data, 
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0]
        ]);
    });

    it('should create DenseFormat matrix (m x n), m < n', function () {

      var m = DenseFormat.diagonal(3, 4, 1);

      assert.equal(m._size, [3, 4]);
      assert.deepEqual(
        m._data, 
        [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0]
        ]);
    });
  });
  */

  describe('get', function () {

    it('should throw on invalid element position', function () {
      var m = new DenseFormat([
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
      var m = new DenseFormat([
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
      var m = new DenseFormat([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ]);

      assert.throws(function () { m.set([-1, 0]); }, /Index out of range \(-1 < 0\)/);
      assert.throws(function () { m.set([0, -1]); }, /Index out of range \(-1 < 0\)/);
    });
    
    it('should grow matrix as needed', function () {
      var m = new DenseFormat([
        [1, 2],
        [3, 4]
      ]);

      m.set([0, 2], 22);
      assert.deepEqual(
        m._data,
        [
          [1, 2, 22],
          [3, 4, 0]
        ]);
      
      m.set([2, 2], 33);
      assert.deepEqual(
        m._data,
        [
          [1, 2, 22],
          [3, 4, 0],
          [0, 0, 33]
        ]);
    });

    it('should remove matrix element', function () {
      var m = new DenseFormat([
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
        m._data,
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
      var m = new DenseFormat([
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
        m._data,
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
      var m = new DenseFormat([
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
        m._data,
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
      var m1 = new DenseFormat(
        [
          [1,2,3],
          [4,5,6]
        ]);

      var m2 = m1.clone();

      assert.deepEqual(m1._data, m2._data);
    });
  });

  describe('toString', function() {

    it('should return string representation of matrix', function() {
      var m = new DenseFormat(
        [
          [1, 0, 0],
          [0, 0, 1]
        ]);

      var s = m.toString();

      assert.equal(s, '[[1, 0, 0], [0, 0, 1]]');
    });
  });
});