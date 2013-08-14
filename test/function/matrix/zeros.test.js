// test zeros
var assert = require('assert');
var math = require('../../../lib/index.js'),
    zeros = math.zeros;

describe('zeros', function() {

  it('should create a scalar', function () {
    assert.deepEqual(zeros(), 0);
    assert.deepEqual(zeros([]), 0);
  });

  it('should create a vector with zeros', function () {
    assert.deepEqual(zeros(3), [0,0,0]);
    assert.deepEqual(zeros([4]), [0,0,0,0]);
    assert.deepEqual(zeros(0), []);
  });

  it('should create a 2D matrix with zeros from an array', function () {
    assert.deepEqual(zeros(2,3), [[0,0,0],[0,0,0]]);
    assert.deepEqual(zeros(3,2), [[0,0],[0,0],[0,0]]);
    assert.deepEqual(zeros([3,2]), [[0,0],[0,0],[0,0]]);
  });

  it('should create a matrix with zeros from a matrix', function () {
    assert.deepEqual(zeros(math.matrix([3])), math.matrix([0,0,0]));
    assert.deepEqual(zeros(math.matrix([3,2])), math.matrix([[0,0],[0,0],[0,0]]));

    // TODO: do we want to support the following? maybe better not
    assert.deepEqual(zeros(math.matrix([[[3]],[[2]]])), math.matrix([[0,0],[0,0],[0,0]]));
  });

  it('should create a 3D matrix with zeros', function () {
    assert.deepEqual(zeros(2,3,4), [
      [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
      ],
      [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
      ]
    ]);
    assert.deepEqual(zeros([2,3,4]), [
      [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
      ],
      [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
      ]
    ]);
  });

  it('should create a matrix with zeros with the same size as original matrix', function () {
    var a = math.matrix([[1, 2, 3], [4, 5, 6]]);
    assert.deepEqual(zeros(math.size(a)).size(), a.size());
  });

  // TODO: test with invalid input

});