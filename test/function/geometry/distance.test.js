var assert = require('assert');
var error = require('../../../lib/error/index');
var math = require('../../../index');

describe('distance', function() {
  it('should calculate the distance of two 2D points', function() {
  assert.equal(math.distance([0, 0], [10, 10], 2), 14.142135623730951);
  assert.equal(math.distance(math.matrix([0,0]),math.matrix([10,10]), 2), 14.142135623730951);
  assert.equal(math.distance(math.matrix([0,0,0]),math.matrix([10,10,0]), 3), 14.142135623730951);
});

it('should calculate distance for non-zero values', function() {
  assert.equal(math.distance([1, 1], [10,10], 2), 12.727922061357855);
  assert.equal(math.distance([-1, -1], [10,10], 2), 15.556349186104045);
  assert.equal(math.distance([-1, 8], [5,10], 2), 6.324555320336759);
  assert.equal(math.distance([-100, 60], [0,500], 2), 451.22056690713913);
  assert.equal(math.distance([-100.78, 60.04], [0.3,500.09], 2), 451.5098768576386);
  assert.equal(math.distance([74, -34, -0.5], [34, 100, -4.33], 3), 139.89520685141431);
});
// appropriate error if passed values is NaN
it('should throw an error for incompatible parameter types', function() {
  assert.throws(function() {math.distance(0.5)}, TypeError);
  assert.throws(function() {math.distance('1')}, TypeError);
});

it('should throw an error for different number of parameters', function() {
  assert.throws(function() {math.distance([0,0])}, TypeError);
  assert.throws(function() {math.distance([0,0],[0,0],[0,0], 2)}, TypeError);
  assert.throws(function() {math.distance([0, 0, 0], [10, 10, 0], 4)}, TypeError);
  assert.throws(function() {math.distance([9, 4, 3.6], 1)}, TypeError);
});

it('should calculate distance between two 3d points', function(){
  assert.equal(math.distance([1, 0, 1], [4, -2, 2], 3), 3.7416573867739413);
  assert.equal(math.distance([0, 0, 0], [10, 10, 0], 3), 14.142135623730951);
});

  // TODO:
  // dist b/w point and plane in 2D
  // ...and in 3D
  // dist b/w more than two 2D points
  // ...and 3D points
  // dist b/w two 2D arrays
  // ...and 3D arrays
  // dist b/w more than two 2D
  // ...and 3D arrays
});
