// test transpose
var assert = require('assert'),
    math = require('../../../index')();

describe('transpose', function() {

  it('should transpose a scalar', function() {
    assert.deepEqual(math.transpose(3), 3);
  });

  it('should transpose a vector', function() {
    assert.deepEqual(math.transpose([1,2,3]), [1,2,3]);
    assert.deepEqual(math.transpose(math.matrix([1,2,3])), math.matrix([1,2,3]));
  });

  it('should transpose a 2d matrix', function() {
    assert.deepEqual(math.transpose([[1,2,3],[4,5,6]]), [[1,4],[2,5],[3,6]]);
    assert.deepEqual(math.transpose(math.matrix([[1,2,3],[4,5,6]])), math.matrix([[1,4],[2,5],[3,6]]));
    assert.deepEqual(math.transpose([[1,2],[3,4]]), [[1,3],[2,4]]);
    assert.deepEqual(math.transpose([[1,2,3,4]]), [[1],[2],[3],[4]]);
  });

  it('should throw an error for invalid matrix transpose', function() {
    assert.throws(function () {
      assert.deepEqual(math.transpose([[]]), [[]]);  // size [2,0]
    });
    assert.throws(function () {
      math.transpose([[[1],[2]],[[3],[4]]]); // size [2,2,1]
    });
  });

});

