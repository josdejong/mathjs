// test larger
var assert = require('assert'),
    math = require('../../../index')(),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    larger = math.larger;

describe('larger', function() {
  it('should compare two numbers correctly', function() {
    assert.equal(larger(2, 3), false);
    assert.equal(larger(2, 2), false);
    assert.equal(larger(2, 1), true);
    assert.equal(larger(0, 0), false);
    assert.equal(larger(-2, 2), false);
    assert.equal(larger(-2, -3), true);
    assert.equal(larger(-3, -2), false);
  });

  it('should compare two booleans', function() {
    assert.equal(larger(true, true), false);
    assert.equal(larger(true, false), true);
    assert.equal(larger(false, true), false);
    assert.equal(larger(false, false), false);
  });

  it('should compare mixed numbers and booleans', function() {
    assert.equal(larger(2, true), true);
    assert.equal(larger(0, true), false);
    assert.equal(larger(true, 2), false);
    assert.equal(larger(false, 2), false);
  });

  it('should compare bignumbers', function() {
    assert.equal(larger(bignumber(2), bignumber(3)), false);
    assert.equal(larger(bignumber(2), bignumber(2)), false);
    assert.equal(larger(bignumber(3), bignumber(2)), true);
    assert.equal(larger(bignumber(0), bignumber(0)), false);
    assert.equal(larger(bignumber(-2), bignumber(2)), false);
  });

  it('should compare mixed numbers and bignumbers', function() {
    assert.equal(larger(bignumber(2), 3), false);
    assert.equal(larger(2, bignumber(2)), false);

    assert.equal(larger(1/3, bignumber(1).div(3)), false);
    assert.equal(larger(bignumber(1).div(3), 1/3), false);
  });

  it('should compare mixed booleans and bignumbers', function() {
    assert.equal(larger(bignumber(0.1), true), false);
    assert.equal(larger(bignumber(1), true), false);
    assert.equal(larger(false, bignumber(0)), false);
  });

  it('should add two measures of the same unit', function() {
    assert.equal(larger(unit('100cm'), unit('10inch')), true);
    assert.equal(larger(unit('99cm'), unit('1m')), false);
    //assert.equal(larger(unit('100cm'), unit('1m')), false); // dangerous, round-off errors
    assert.equal(larger(unit('101cm'), unit('1m')), true);
  });

  it('should throw an error if comparing a unit with a number', function() {
    assert.throws(function () {larger(unit('100cm'), 22)});
  });

  it('should throw an error if comparing a unit with a bignumber', function() {
    assert.throws(function () {larger(unit('100cm'), bignumber(22))});
  });

  it('should perform lexical comparison for two strings', function() {
    assert.equal(larger('0', 0), false);

    assert.equal(larger('abd', 'abc'), true);
    assert.equal(larger('abc', 'abc'), false);
    assert.equal(larger('abc', 'abd'), false);
  });

  it('should perform element-wise comparison for two matrices of same size', function() {
    assert.deepEqual(larger([1,4,6], [3,4,5]), [false, false, true]);
    assert.deepEqual(larger([1,4,6], matrix([3,4,5])), matrix([false, false, true]));
  });

  it('should throw an error when comparing complex numbers', function() {
    assert.throws(function () {larger(complex(1,1), complex(1,2))}, TypeError);
    assert.throws(function () {larger(complex(2,1), 3)}, TypeError);
    assert.throws(function () {larger(3, complex(2,4))}, TypeError);
    assert.throws(function () {larger(math.bignumber(3), complex(2,4))}, TypeError);
    assert.throws(function () {larger(complex(2,4), math.bignumber(3))}, TypeError);
  });

  it('should throw an error if matrices are different sizes', function() {
    assert.throws(function () {larger([1,4,6], [3,4])});
  });

});
