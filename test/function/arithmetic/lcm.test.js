var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    lcm = math.lcm;

describe('lcm', function() {

  it('should find the lowest common multiple of two or more numbers', function() {
    assert.equal(lcm(4, 6), 12);
    assert.equal(lcm(4, -6), 12);
    assert.equal(lcm(6, 4), 12);
    assert.equal(lcm(-6, 4), 12);
    assert.equal(lcm(-6, -4), 12);
    assert.equal(lcm(21, 6), 42);
    assert.equal(lcm(3, -4, 24), 24);

    assert.throws(function () {lcm(1); }, SyntaxError, 'Wrong number of arguments in function lcm (3 provided, 1-2 expected)');
  });

  it ('should calculate lcm for edge cases around zero', function () {
    assert.equal(lcm(3, 0), 0);
    assert.equal(lcm(-3, 0), 0);
    assert.equal(lcm(0, 3), 0);
    assert.equal(lcm(0, -3), 0);
    assert.equal(lcm(0, 0), 0);

    assert.equal(lcm(1, 1), 1);
    assert.equal(lcm(1, 0), 0);
    assert.equal(lcm(1, -1), 1);
    assert.equal(lcm(-1, 1), 1);
    assert.equal(lcm(-1, 0), 0);
    assert.equal(lcm(-1, -1), 1);
    assert.equal(lcm(0, 1), 0);
    assert.equal(lcm(0, -1), 0);
    assert.equal(lcm(0, 0), 0);
  });

  it('should calculate lcm for BigNumbers', function() {
    assert.deepEqual(lcm(math.bignumber(4), math.bignumber(6)), math.bignumber(12));
    assert.deepEqual(lcm(math.bignumber(4), math.bignumber(6)), math.bignumber(12));
  });

  it('should calculate lcm for mixed BigNumbers and Numbers', function() {
    assert.deepEqual(lcm(math.bignumber(4), 6), math.bignumber(12));
    assert.deepEqual(lcm(4, math.bignumber(6)), math.bignumber(12));
  });

  it('should find the lowest common multiple of booleans', function() {
    assert.equal(lcm(true, true), 1);
    assert.equal(lcm(true, false), 0);
    assert.equal(lcm(false, true), 0);
    assert.equal(lcm(false, false), 0);
  });

  it('should find the lowest common multiple of numbers and null', function () {
    assert.equal(lcm(1, null), 0);
    assert.equal(lcm(null, 1), 0);
    assert.equal(lcm(null, null), 0);
  });

  it('should throw an error for non-integer numbers', function() {
    assert.throws(function () {lcm(2, 4.1); }, /Parameters in function lcm must be integer numbers/);
    assert.throws(function () {lcm(2.3, 4); }, /Parameters in function lcm must be integer numbers/);
  })

  it('should throw an error with complex numbers', function() {
    assert.throws(function () {lcm(math.complex(1,3),2); }, TypeError, 'Function lcm(complex, number) not supported');
  });

  it('should throw an error with strings', function() {
    assert.throws(function () {lcm('a', 2); }, TypeError, 'Function lcm(string, number) not supported');
    assert.throws(function () {lcm(2, 'a'); }, TypeError, 'Function lcm(number, string) not supported');
  });

  it('should throw an error with units', function() {
    assert.throws(function () { lcm(math.unit('5cm'), 2); }, TypeError, 'Function lcm(unit, number) not supported');
  });

  it('should perform element-wise lcm on two or more matrices of the same size', function() {
    assert.deepEqual(lcm([5,2,3], [25,3,6]), [25, 6, 6]);
  });

  it('should LaTeX lcm', function () {
    var expression = math.parse('lcm(2,3)');
    assert.equal(expression.toTex(), '\\mathrm{lcm}\\left(2,3\\right)');
  });

});
