// test sign
var assert = require('assert');
var math = require('../../../index.js');

describe('sign', function() {
  it('should calculate the sign of a boolean', function () {
    assert.equal(math.sign(true), 1);
    assert.equal(math.sign(false), 0);
  });

  it('should calculate the sign of a number as 1, -1 or 0', function() {
    assert.equal(math.sign(3), 1);
    assert.equal(math.sign(-3), -1);
    assert.equal(math.sign(0), 0);
  });

  it('should calculate the sign of a complex value', function() {
    assert.equal(math.sign(math.complex(2,-3)).toString(), '0.5547 - 0.83205i');
  });

  it('should throw an error when used with a unit', function() {
    assert.throws(function () { math.sign(math.unit('5cm')); });
  });

  it('should throw an error when used with a string', function() {
    assert.throws(function () { math.sign("hello world"); });
  });

  it('should return a matrix of the signs of each elements in the given array', function() {
    assert.deepEqual(math.sign([-2,-1,0,1,2]), [-1,-1,0,1,1]);
  });

  it('should return a matrix of the signs of each elements in the given matrix', function() {
    assert.deepEqual(math.sign(math.matrix([-2,-1,0,1,2])), math.matrix([-1,-1,0,1,1]));
  });

});