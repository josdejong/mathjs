var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    matrix = math.matrix,
    eye = math.eye;

describe('eye', function() {

  it('should create an empty matrix', function () {
    assert.deepEqual(eye(), matrix());
    assert.deepEqual(eye([]), []);
    assert.deepEqual(eye(matrix([])), matrix());
  });

  it('should create an identity matrix of the given size', function() {
    assert.deepEqual(eye(1), matrix([[1]]));
    assert.deepEqual(eye(2), matrix([[1,0],[0,1]]));
    assert.deepEqual(eye([2]), [[1,0],[0,1]]);
    assert.deepEqual(eye(2,3), matrix([[1,0,0],[0,1,0]]));
    assert.deepEqual(eye(3,2), matrix([[1,0],[0,1],[0,0]]));
    assert.deepEqual(eye([3,2]), [[1,0],[0,1],[0,0]]);
    assert.deepEqual(eye(math.matrix([3,2])), matrix([[1,0],[0,1],[0,0]]));
    assert.deepEqual(eye(3,3), matrix([[1,0,0],[0,1,0],[0,0,1]]));
  });

  it('should create an identity matrix with bignumbers', function() {
    var zero = math.bignumber(0);
    var one = math.bignumber(1);
    var two = math.bignumber(2);
    var three = math.bignumber(3);
    assert.deepEqual(eye(two), matrix([[one,zero],[zero,one]]));
    assert.deepEqual(eye(two, three), matrix([[one,zero,zero],[zero,one,zero]]));
  });

  it('should return an array when setting matrix=="array"', function() {
    var math2 = math.create({matrix: 'array'});
    assert.deepEqual(math2.eye(2), [[1,0],[0,1]]);
  });

  it('should throw an error with an invalid input', function() {
    assert.throws(function () {eye(3, 3, 2);});
    assert.throws(function () {eye([3, 3, 2]);});
    assert.throws(function () {eye([3, 3], 2);});
    assert.throws(function () {eye([3.2, 3]);});
    assert.throws(function () {eye([3, 3.2]);});
    assert.throws(function () {eye([3.2, 3.2]);});
    assert.throws(function () {eye([2, 'str']);});
    assert.throws(function () {eye(['str', 2]);});
    assert.throws(function () {eye([-2, 2]);});
    assert.throws(function () {eye([2, -2]);});
  });

});