// test round
var assert = require('assert');
var math = require('../../../index.js');

describe('round', function() {

  it('should be parsed correctly', function() {
    assert.equal(math.eval('round(pi)'), 3);
    assert.equal(math.eval('round(pi, 3)'), 3.142);
  });

  it('should round a number to te given number of decimals', function() {
    assert.equal(math.round(math.pi), 3);
    assert.equal(math.round(math.pi * 1000), 3142);
    assert.equal(math.round(math.pi, 3), 3.142);
    assert.equal(math.round(math.pi, 6), 3.141593);
    assert.equal(math.round(1234.5678, 2), 1234.57);
  });

  it('should throw an error if used with wrong number of arguments', function() {
    assert.throws(function () {math.round();}, SyntaxError, 'Wrong number of arguments in function round (3 provided, 1-2 expected)');
    assert.throws(function () {math.round(1,2,3);}, SyntaxError, 'Wrong number of arguments in function round (3 provided, 1-2 expected)');
  });

  it('should round real and imag part of a complex number', function() {
    assert.deepEqual(math.round(math.complex(2.2, math.pi)), math.complex(2,3));
  });

  it('should throw an error if used with a unit', function() {
    assert.throws(function () { math.round(math.unit('5cm')); }, TypeError, 'Function round(unit) not supported');
  });

  it('should throw an error if used with a string', function() {
    assert.throws(function () { math.round("hello world"); }, TypeError, 'Function round(unit) not supported');
  });

  it('should round each element in a matrix, array, range', function() {
    assert.deepEqual(math.round(math.range(0,2.1,1/3), 2), [0,0.33,0.67,1,1.33,1.67,2]);
    assert.deepEqual(math.round(math.range(0,2.1,1/3)), [0,0,1,1,1,2,2]);
    assert.deepEqual(math.round([1.7,2.3]), [2,2]);
    assert.deepEqual(math.round(math.matrix([1.7,2.3])).valueOf(), [2, 2]);
  });

});