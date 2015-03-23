// test transpose
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    transpose = math.transpose;

describe('transpose', function() {

  it('should transpose a scalar', function() {
    assert.deepEqual(transpose(3), 3);
  });

  it('should transpose a vector', function() {
    assert.deepEqual(transpose([1,2,3]), [1,2,3]);
    assert.deepEqual(transpose(math.matrix([1,2,3]).toArray()), [1,2,3]);
  });

  it('should transpose a 2d matrix', function() {
    assert.deepEqual(transpose([[1,2,3],[4,5,6]]), [[1,4],[2,5],[3,6]]);
    assert.deepEqual(transpose(math.matrix([[1,2,3],[4,5,6]]).toArray()), [[1,4],[2,5],[3,6]]);
    assert.deepEqual(transpose([[1,2],[3,4]]), [[1,3],[2,4]]);
    assert.deepEqual(transpose([[1,2,3,4]]), [[1],[2],[3],[4]]);
  });

  it('should throw an error for invalid matrix transpose', function() {
    assert.throws(function () {
      assert.deepEqual(transpose([[]]), [[]]);  // size [2,0]
    });
    assert.throws(function () {
      transpose([[[1],[2]],[[3],[4]]]); // size [2,2,1]
    });
  });

  it('should throw an error if called with an invalid number of arguments', function() {
    assert.throws(function () {transpose()}, error.ArgumentsError);
    assert.throws(function () {transpose([1,2],2)}, error.ArgumentsError);
  });
});