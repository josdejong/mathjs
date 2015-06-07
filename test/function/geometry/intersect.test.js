var assert = require('assert');
var error = require('../../../lib/error/index');
var math = require('../../../index');

describe('intersect', function() {
  it('should calculate the intersection point of two 2D lines', function() {
    assert.deepEqual(math.intersect([0, 0], [10, 10], [10, 0], [0, 10]), [5, 5]);
  });

  it('should calculate the intersection point of two 3D lines', function() {
    assert.deepEqual(math.intersect([0, 0, 0], [10, 10, 0], [10, 0, 0], [0, 10, 0]), [5, 5, 0]);
  });

  it('should calculate the intersection point of a line and a plane', function() {
    assert.deepEqual(math.intersect([1, 0, 1], [4, -2, 2], [1, 1, 1, 6]), [7, -4, 3]);
  });
  
  it('should return null if the points do not intersect', function() {
    assert.deepEqual(math.intersect([0, 1, 0], [0, 0, 0], [1, 1, 0], [1, 0, 0]), null);
    assert.deepEqual(math.intersect([0, 1], [0, 0], [1, 1], [1, 0]), null);
  });

  it('should throw an error when number of arguments are other than 3 or 4', function() {
    assert.throws(function () {math.intersect([2, 0, 1], [1, 1, 1, 6])});
    assert.throws(function () {math.intersect([2, 0, 1], [1, 1, 6], [2, 0, 1], [1, 1, 6], [0, 8, 1])});
  });
  
  it('should throw an error for incompatible parameter types', function() {
    assert.throws(function () {math.intersect(2, 3, 6)}, TypeError);
    assert.throws(function () {math.intersect([2, 0, 1], [1, 1, 1], [5, 1, 10])}, /Arguments are not correct/);
    assert.throws(function () {math.intersect([], [], [], [])});
    assert.throws(function () {math.intersect([2, 8, 9], 3, 6)}, TypeError);
    assert.throws(function () {math.intersect(a, b, c, d)});
  });
});
