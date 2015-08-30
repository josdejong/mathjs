var assert = require('assert');
var error = require('../../../lib/error/index');
var math = require('../../../index');
describe('distance', function() {
  it('should calculate the distance of two 2D points', function() {
    assert.equal(math.distance([0, 0], [10, 10]), 14.142135623730951);
    assert.equal(math.distance(math.matrix([0,0]),math.matrix([10,10])), 14.142135623730951);
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