var assert = require('assert'),
    math = require('../../../index'),
    matrix = math.matrix;

describe('eye', function() {

  it('should create an identity matrix of the given size', function() {
    assert.deepEqual(math.eye(), matrix([[1]]));
    assert.deepEqual(math.eye([]), [[1]]);
    assert.deepEqual(math.eye(1), matrix([[1]]));
    assert.deepEqual(math.eye(2), matrix([[1,0],[0,1]]));
    assert.deepEqual(math.eye([2]), [[1,0],[0,1]]);
    assert.deepEqual(math.eye(2,3), matrix([[1,0,0],[0,1,0]]));
    assert.deepEqual(math.eye(3,2), matrix([[1,0],[0,1],[0,0]]));
    assert.deepEqual(math.eye([3,2]), [[1,0],[0,1],[0,0]]);
    assert.deepEqual(math.eye(math.matrix([3,2])), matrix([[1,0],[0,1],[0,0]]));
    assert.deepEqual(math.eye(math.matrix([[3],[2]])), matrix([[1,0],[0,1],[0,0]]));
    assert.deepEqual(math.eye(3,3), matrix([[1,0,0],[0,1,0],[0,0,1]]));
  });

  // TODO: test option math.options.matrix.defaultType

  it('should throw an error with an invalid input', function() {
    assert.throws(function () {math.eye(3,3,2);});
    assert.throws(function () {math.eye([3,3,2]);});
  });

});