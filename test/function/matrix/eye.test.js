var assert = require('assert'),
    math = require('../../../index')(),
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

  // TODO: test option math.options.matrix.defaultType

  it('should throw an error with an invalid input', function() {
    assert.throws(function () {eye(3,3,2);});
    assert.throws(function () {eye([3,3,2]);});
  });

});