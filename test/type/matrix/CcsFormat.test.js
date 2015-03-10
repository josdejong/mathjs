var assert = require('assert');
var math = require('../../../index');
var index = math.index;
var CcsFormat = math.type.Matrix.format.ccs;
var Complex = math.type.Complex;

describe('CcsFormat', function() {

  describe('constructor', function() {

    it('should throw exception if called with no argument', function() {
      assert.throws(function () { new CcsFormat(); }, /data must be an array/);
    });

    it('should create a CCS from an array', function () {
      var m = new CcsFormat(
        [
          [10, 0, 0, 0, -2, 0],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [0, 4, 0, 0, 2, -1]
        ]);
      assert.equal(m._format, 'ccs');
      assert.deepEqual(m._size, [6, 6]);
      assert.deepEqual(m._values, [10, 3, 3, 9, 7, 8, 4, 8, 8, 7, 7, 9, -2, 5, 9, 2, 3, 13, -1]);
      assert.deepEqual(m._index, [0, 1, 3, 1, 2, 4, 5, 2, 3, 2, 3, 4, 0, 3, 4, 5, 1, 4, 5]);
      assert.deepEqual(m._ptr, [0, 3, 7, 9, 12, 16, 19]);
    });
    
    it('should create a CCS from an array, empty column', function () {
      var m = new CcsFormat(
        [
          [1, 0, 0],
          [0, 0, 1]
        ]);
      assert.equal(m._format, 'ccs');
      assert.deepEqual(m._size, [2, 3]);
      assert.deepEqual(m._values, [1, 1]);
      assert.deepEqual(m._index, [0, 1]);
      assert.deepEqual(m._ptr, [0, 1, 1, 2]);
    });
    
    it('should create a CCS from an array, empty row', function () {
      var m = new CcsFormat(
        [
          [1, 0],
          [0, 0],
          [0, 1]
        ]);
      assert.equal(m._format, 'ccs');
      assert.deepEqual(m._size, [3, 2]);
      assert.deepEqual(m._values, [1, 1]);
      assert.deepEqual(m._index, [0, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2]);
    });
    
    it('should create an empty CCS from an array', function () {
      var m = new CcsFormat([]);
      assert.equal(m._format, 'ccs');
      assert.deepEqual(m._size, [0, 0]);
      assert.deepEqual(m._values, []);
      assert.deepEqual(m._index, []);
      assert.deepEqual(m._ptr, [0]);
    });

    it('should create a CCS from a vector', function () {
      var m = new CcsFormat([1, 2, 3]);
      assert.equal(m._format, 'ccs');
      assert.deepEqual(m._size, [3, 1]);
      assert.deepEqual(m._values, [1, 2, 3]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 3]);
    });
    
    it('should throw an error when called without new keyword', function () {
      assert.throws(function () { CcsFormat(); }, /Constructor must be called with the new operator/);
    });
  });

  describe('size', function() {

    it('should return the expected size', function() {
      assert.deepEqual(new CcsFormat([[23]]).size(), [1, 1]);
      assert.deepEqual(new CcsFormat([[1, 2, 3], [4, 5, 6]]).size(), [2, 3]);
      assert.deepEqual(new CcsFormat([[1], [2], [3]]).size(), [3, 1]);
      assert.deepEqual(new CcsFormat([[]]).size(), [1, 0]);
    });
  });
  
  describe('toArray', function () {

    it('should return array', function () {
      var m = new CcsFormat({
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
      var m = new CcsFormat({
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
      var m = new CcsFormat({
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
      
      var m = CcsFormat.diagonal(3, 3, 1);

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
    
    it('should create CCS matrix (n x n), complex number', function () {

      var m = CcsFormat.diagonal(3, 3, new Complex(1, 1));

      assert.deepEqual(m._size, [3, 3]);
      assert.deepEqual(m._values, [new Complex(1, 1), new Complex(1, 1), new Complex(1, 1)]);
      assert.deepEqual(m._index, [0, 1, 2]);
      assert.deepEqual(m._ptr, [0, 1, 2, 3]);
    });
    
    it('should create CCS matrix (m x n), m > n', function () {

      var m = CcsFormat.diagonal(4, 3, 1);

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
    
    it('should create CCS matrix (m x n), m < n', function () {

      var m = CcsFormat.diagonal(3, 4, 1);

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
      var m = new CcsFormat([
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
      var m = new CcsFormat([
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
      var m = new CcsFormat([
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

    it('should remove matrix element', function () {
      var m = new CcsFormat([
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
      var m = new CcsFormat([
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
      var m = new CcsFormat([
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
      var m = new CcsFormat([
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
      var m = new CcsFormat([
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
      var m = new CcsFormat([
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
      var m = new CcsFormat([
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
      var m = new CcsFormat([
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
      var m = new CcsFormat([
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
  
  describe('resize', function() {

    it('should increase columns as needed, zero value', function() {
      var m = new CcsFormat(
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
      var m = new CcsFormat(
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
      var m = new CcsFormat(
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
      var m = new CcsFormat(
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
      var m = new CcsFormat([]);
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
      var m = new CcsFormat([]);
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
      var m = new CcsFormat(
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
      var m = new CcsFormat(
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
      var m = new CcsFormat(
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
      var m = new CcsFormat(
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
      var m = new CcsFormat(
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
  });
  
  describe('clone', function() {

    it('should clone the matrix properly', function() {
      var m1 = new CcsFormat(
        [
          [1,2,3],
          [4,5,6]
        ]);
      
      var m2 = m1.clone();
      
      assert.deepEqual(m1.toArray(), m2.toArray());
    });
  });
  
  describe('map', function() {

    it('should apply the given function to all elements in the matrix', function() {
      var m, m2;

      m = new CcsFormat([
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
      
      m = new CcsFormat([1]);
      m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.toArray(), [[2]]);

      m = new CcsFormat([1,2,3]);
      m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.toArray(), [[2],[4],[6]]);
    });

    it('should work on empty matrices', function() {
      var m = new CcsFormat([]);
      var m2 = m.map(function (value) { return value * 2; });
      assert.deepEqual(m2.toArray(), []);
    });
    
    it('should process all values (zero and non-zero)', function() {
      var m = new CcsFormat(
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
      var m = new CcsFormat(
        [
          [1, 0],
          [0, 2]
        ]
      );
      var m2 = m.map(function (value) { return value + 2; }, m, true);
      assert.deepEqual(
        m2.toArray(),
        [
          [3, 0],
          [0, 4]
        ]);
    });

    it('should invoke callback with parameters value, index, obj', function() {
      var m = new CcsFormat([[1, 2, 3], [4, 5, 6]]);
      var o = {};

      var m2 = m.map(
        function (value, index, obj) {
          return value + index[0] * 100 + index[1] * 10 + (obj === o ? 1000 : 0);
        },
        o
      );

      assert.deepEqual(
        m2.toArray(), 
        [
          [1001, 1012, 1023],
          [1104, 1115, 1126]
        ]);
    });
  });
  
  describe('get subset', function() {

    it('should get the right subset of the matrix', function() {
      var m = new CcsFormat(
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

    /*
    it('should squeeze the output when index contains a scalar', function() {
      var m = new CcsFormat(math.range(0, 10));
      assert.deepEqual(m.subset(index(1)), 1);
      assert.deepEqual(m.subset(index([1, 2])), new CcsFormat([1]));

      m = new CcsFormat([[1,2], [3, 4]]);
      assert.deepEqual(m.subset(index(1, 1)), 4);
      assert.deepEqual(m.subset(index([1, 2], 1)), new CcsFormat([[4]]));
      assert.deepEqual(m.subset(index(1, [1, 2])), new CcsFormat([[4]]));
      assert.deepEqual(m.subset(index([1, 2], [1, 2])), new CcsFormat([[4]]));
    });

    it('should throw an error if the given subset is invalid', function() {
      var m = new CcsFormat();
      assert.throws(function () { m.subset([-1]); });

      m = new CcsFormat([[1, 2, 3], [4, 5, 6]]);
      assert.throws(function () { m.subset([1, 2, 3]); });
      assert.throws(function () { m.subset([3, 0]); });
      assert.throws(function () { m.subset([1]); });
    });

    it('should throw an error in case of wrong number of arguments', function() {
      var m = new CcsFormat();
      assert.throws(function () { m.subset();}, /Wrong number of arguments/);
      assert.throws(function () { m.subset(1, 2, 3, 4); }, /Wrong number of arguments/);
    });

    it('should throw an error in case of dimension mismatch', function() {
      var m = new CcsFormat([[1,2,3],[4,5,6]]);
      assert.throws(function () {m.subset(index([0,2]))}, /Dimension mismatch/);
    });
    */
  });
  
  describe('forEach', function() {

    it('should run on all elements of the matrix', function() {
      var m, output;

      m = new CcsFormat([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11,12],
        [13, 14, 15,16]
      ]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]);

      m = new CcsFormat([1]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, [1]);

      m = new CcsFormat([1,2,3]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, [1,2,3]);
    });

    it('should work on empty matrices', function() {
      m = new CcsFormat([]);
      output = [];
      m.forEach(function (value) { output.push(value); });
      assert.deepEqual(output, []);
    });

    it('should invoke callback with parameters value, index, obj', function() {
      var m = new CcsFormat([[1,2,3], [4,5,6]]);
      var o = {};
      var output = [];
      m.forEach(
        function (value, index, obj) {
          output.push(value + index[0] * 100 + index[1] * 10 + (obj === o ? 1000 : 0));
        },
        o
      );
      assert.deepEqual(output, [1001, 1104, 1012, 1115, 1023, 1126]);
    });
  });
  
  describe('toString', function() {

    it('should return string representation of matrix', function() {
      var m = new CcsFormat(
        [
          [1, 0, 0],
          [0, 0, 1]
        ]);

      var s = m.toString();

      assert.equal(s, '2 x 3\n\n(0, 0) = 1\n(1, 2) = 1');
    });
  });
});