// test inv
var assert = require('assert');
var math = require('../../../index.js');

describe('inv', function() {

  it('should return the inverse of a number', function() {
    assert.deepEqual(math.inv(4), 1/4);
  });

  it('should return the inverse for each element in an array', function() {
    assert.deepEqual(math.inv([4]), [1/4]);
    assert.deepEqual(math.inv([[4]]), [[1/4]]);

    assert.deepEqual(math.format(math.inv([
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 9, 11]
    ])), math.format([
      [ 5.625, -2.375, -2.5],
      [ 4.75,  -2.25,  -2],
      [-3.375,  1.625,  1.5]
    ]));

    assert.deepEqual(math.format(math.inv([
      [ 2, -1,  0],
      [-1,  2, -1],
      [ 0, -1,  2]
    ])), math.format([
      [3/4, 1/2, 1/4],
      [1/2, 1,   1/2],
      [1/4, 1/2, 3/4]
    ]));
  });

  it('should return the inverse for each element in a matrix', function() {
    assert.deepEqual(math.inv(math.matrix([4])), math.matrix([1/4]));
    assert.deepEqual(math.inv(math.matrix([[4]])), math.matrix([[1/4]]));
    assert.deepEqual(math.inv(math.matrix([[1,2],[3,4]])), math.matrix([[-2, 1],[1.5, -0.5]]));
  });

});