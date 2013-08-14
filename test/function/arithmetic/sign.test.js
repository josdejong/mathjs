// test sign
var assert = require('assert');
var math = require('../../../lib/index.js');

describe('sign', function() {

  it('should be parsed correctly', function() {
    assert.equal(math.eval('sign(3)'), 1);
    assert.equal(math.eval('sign(-3)'), -1);
    assert.equal(math.eval('sign(0)'), 0);
  });

  it('should return the sign of a number as 1, -1 or 0', function() {
    assert.equal(math.sign(3), 1);
    assert.equal(math.sign(-3), -1);
    assert.equal(math.sign(0), 0);
  });

  it('???', function() {
    assert.equal(math.sign(math.complex(2,-3)).toString(), '0.5547 - 0.83205i');
  });

  it('should throw an error when used with a unit', function() {
    assert.throws(function () { math.sign(math.unit('5cm')); });
  });

  it('should throw an error when used with a string', function() {
    assert.throws(function () { math.sign("hello world"); });
  });

  it('should return a matrix of the signs of each elements in the given matrix', function() {
    assert.deepEqual(math.sign(math.range(-2,3)), [-1,-1,0,1,1]);
    assert.deepEqual(math.sign(math.matrix(math.range(-2,3))).valueOf(), [-1,-1,0,1,1]);
    assert.deepEqual(math.sign([-2, -1, 0, 1, 2]), [-1,-1,0,1,1]);
  });

});