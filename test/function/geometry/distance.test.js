var assert = require('assert');
var error = require('../../../lib/error/index');
var math = require('../../../index');
describe('distance', function() {
  it('should calculate the distance of two 2D points', function() {
    assert.equal(math.distance([0, 0], [10, 10]), 14.142135623730951);
    assert.equal(math.distance(math.matrix([0,0]),math.matrix([10,10])), 14.142135623730951);
  });

  it('should calculate distance for non-zero values', function() {
    assert.equal(math.distance([1, 1], [10,10]), 12.727922061357855);
    assert.equal(math.distance([-1, -1], [10,10]), 15.556349186104045);
    assert.equal(math.distance([-1, 8], [5,10]), 6.324555320336759);
    assert.equal(math.distance([-100, 60], [0,500]), 451.22056690713913);
    assert.equal(math.distance([-100.78, 60.04], [0.3,500.09]), 451.5098768576386);
  });

  it('should throw an error for incompatible parameter types', function() {
    assert.throws(function() {math.distance(0.5)}, TypeError);
    assert.throws(function() {math.distance('1')}, TypeError);
  });

  it('should throw an error for different number of parameters', function() {
    assert.throws(function() {math.distance([0,0])}, TypeError);
    assert.throws(function() {math.distance([0,0],[0,0],[0,0])}, TypeError);
  });
});