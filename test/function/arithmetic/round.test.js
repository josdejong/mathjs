// test round
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    bignumber = math.bignumber,
    round = math.round;

describe('round', function() {

  it('should round a number to te given number of decimals', function() {
    approx.equal(round(math.pi), 3);
    approx.equal(round(math.pi * 1000), 3142);
    approx.equal(round(math.pi, 3), 3.142);
    approx.equal(round(math.pi, 6), 3.141593);
    approx.equal(round(1234.5678, 2), 1234.57);
  });

  it('should round booleans (yeah, not really useful but it should be supported)', function() {
    approx.equal(round(true, 2), 1);
    approx.equal(round(false, 2), 0);
  });

  it('should throw an error on invalid type of n', function() {
    assert.throws(function () {round(math.pi, true);}, TypeError);
    // TODO: also test other types
  });

  it('should throw an error if used with wrong number of arguments', function() {
    assert.throws(function () {round();}, SyntaxError, 'Wrong number of arguments in function round (3 provided, 1-2 expected)');
    assert.throws(function () {round(1,2,3);}, SyntaxError, 'Wrong number of arguments in function round (3 provided, 1-2 expected)');
  });

  it('should round bignumbers', function() {
    assert.deepEqual(round(bignumber(2.7)), bignumber(3));
    assert.deepEqual(round(bignumber(2.1)), bignumber(2));
    assert.deepEqual(round(bignumber(2.123456), bignumber(3)), bignumber(2.123));
    assert.deepEqual(round(bignumber(2.123456), 3), bignumber(2.123));
    assert.deepEqual(round(2.1234567, bignumber(3)), 2.123);
    assert.deepEqual(round(true, bignumber(3)), 1);
  });

  it('should round real and imag part of a complex number', function() {
    assert.deepEqual(round(math.complex(2.2, math.pi)), math.complex(2,3));
  });

  it('should round a complex number with a bignumber as number of decimals', function() {
    assert.deepEqual(round(math.complex(2.157, math.pi), bignumber(2)), math.complex(2.16, 3.14));
  });

  it('should throw an error if used with a unit', function() {
    assert.throws(function () { round(math.unit('5cm')); }, TypeError, 'Function round(unit) not supported');
    assert.throws(function () { round(math.unit('5cm'), 2); }, TypeError, 'Function round(unit) not supported');
    assert.throws(function () { round(math.unit('5cm'), bignumber(2)); }, TypeError, 'Function round(unit) not supported');
  });

  it('should throw an error if used with a string', function() {
    assert.throws(function () { round("hello world"); }, TypeError, 'Function round(unit) not supported');
  });

  it('should round each element in a matrix, array, range', function() {
    assert.deepEqual(round(math.range(0,2.1,1/3), 2), math.matrix([0,0.33,0.67,1,1.33,1.67,2]));
    assert.deepEqual(round(math.range(0,2.1,1/3)), math.matrix([0,0,1,1,1,2,2]));
    assert.deepEqual(round([1.7,2.3]), [2,2]);
    assert.deepEqual(round(math.matrix([1.7,2.3])).valueOf(), [2, 2]);
  });

});