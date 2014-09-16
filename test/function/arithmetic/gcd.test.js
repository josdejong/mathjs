// test gcd
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    gcd = math.gcd;

describe('gcd', function() {
  it('should find the greatest common divisor of two or more numbers', function() {
    assert.equal(gcd(12, 8), 4);
    assert.equal(gcd(8, 12), 4);
    assert.equal(gcd(8, -12), 4);
    assert.equal(gcd(-12, 8), 4);
    assert.equal(gcd(12, -8), 4);
    assert.equal(gcd(15, 3), 3);
    assert.equal(gcd(25, 15, -10, 30), 5);
  });

  it ('should calculate gcd for edge cases around zero', function () {
    assert.equal(gcd(3, 0), 3);
    assert.equal(gcd(-3, 0), 3);
    assert.equal(gcd(0, 3), 3);
    assert.equal(gcd(0, -3), 3);
    assert.equal(gcd(0, 0), 0);

    assert.equal(gcd(1, 1), 1);
    assert.equal(gcd(1, 0), 1);
    assert.equal(gcd(1, -1), 1);
    assert.equal(gcd(-1, 1), 1);
    assert.equal(gcd(-1, 0), 1);
    assert.equal(gcd(-1, -1), 1);
    assert.equal(gcd(0, 1), 1);
    assert.equal(gcd(0, -1), 1);
    assert.equal(gcd(0, 0), 0);
  });

  it ('should calculate gcd for edge cases with negative values', function () {
    assert.deepEqual(1, gcd(2, 5));
    assert.deepEqual(1, gcd(2, -5));
    assert.deepEqual(1, gcd(-2, 5));
    assert.deepEqual(1, gcd(-2, -5));

    assert.deepEqual(2, gcd(2, 6));
    assert.deepEqual(2, gcd(2, -6));
    assert.deepEqual(2, gcd(-2, 6));
    assert.deepEqual(2, gcd(-2, -6));
  });

  it('should calculate gcd for BigNumbers', function() {
    assert.deepEqual(gcd(math.bignumber(12), math.bignumber(8)), math.bignumber(4));
    assert.deepEqual(gcd(math.bignumber(8), math.bignumber(12)), math.bignumber(4));
  });

  it('should calculate gcd for mixed BigNumbers and Numbers', function() {
    assert.deepEqual(gcd(math.bignumber(12), 8), math.bignumber(4));
    assert.deepEqual(gcd(8, math.bignumber(12)), math.bignumber(4));
  });

  it('should find the greatest common divisor of booleans', function() {
    assert.equal(gcd(true, true), 1);
    assert.equal(gcd(true, false), 1);
    assert.equal(gcd(false, true), 1);
    assert.equal(gcd(false, false), 0);
  });

  it('should find the greatest common divisor of numbers and null', function () {
    assert.equal(gcd(1, null), 1);
    assert.equal(gcd(null, 1), 1);
    assert.equal(gcd(null, null), 0);
  });

  it('should throw an error if only one argument', function() {
    assert.throws(function () {gcd(1); }, SyntaxError);
  });

  it('should throw an error for non-integer numbers', function() {
    assert.throws(function () {gcd(2, 4.1); }, /Parameters in function gcd must be integer numbers/);
    assert.throws(function () {gcd(2.3, 4); }, /Parameters in function gcd must be integer numbers/);
  })

  it('should throw an error with complex numbers', function() {
    assert.throws(function () {gcd(math.complex(1,3),2); }, math.error.UnsupportedTypeError);
  });

  it('should throw an error with strings', function() {
    assert.throws(function () {gcd('a', 2); }, /Function gcd\(string, number\) not supported/);
    assert.throws(function () {gcd(2, 'a'); }, /Function gcd\(number, string\) not supported/);
  });

  it('should throw an error with units', function() {
    assert.throws(function () { gcd(math.unit('5cm'), 2); }, /Function gcd\(unit, number\) not supported/);
  });

  it('should find the greatest common divisor element-wise in a matrix', function() {
    assert.deepEqual(gcd([5,2,3], [25,3,6]), [5, 1, 3]);
  });

});