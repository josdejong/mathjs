// test smaller
var assert = require('assert'),
    mathjs = require('../../../index'),
    math = mathjs(),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    smallereq = math.smallereq;

describe('smallereq', function() {

  it('should compare two numbers correctly', function() {
    assert.equal(smallereq(2, 3), true);
    assert.equal(smallereq(2, 2), true);
    assert.equal(smallereq(2, 1), false);
    assert.equal(smallereq(0, 0), true);
    assert.equal(smallereq(-2, 2), true);
    assert.equal(smallereq(-2, -3), false);
    assert.equal(smallereq(-2, -2), true);
    assert.equal(smallereq(-3, -2), true);
  });

  it('should compare two floating point numbers correctly', function() {
    // Infinity
    assert.equal(smallereq(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), true);
    assert.equal(smallereq(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY), true);
    assert.equal(smallereq(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), false);
    assert.equal(smallereq(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), true);
    assert.equal(smallereq(Number.POSITIVE_INFINITY, 2.0), false);
    assert.equal(smallereq(2.0, Number.POSITIVE_INFINITY), true);
    assert.equal(smallereq(Number.NEGATIVE_INFINITY, 2.0), true);
    assert.equal(smallereq(2.0, Number.NEGATIVE_INFINITY), false);
    // floating point numbers
    assert.equal(smallereq(0.3 - 0.2, 0.1), true);
  });

  it('should compare two booleans', function() {
    assert.equal(smallereq(true, true), true);
    assert.equal(smallereq(true, false), false);
    assert.equal(smallereq(false, true), true);
    assert.equal(smallereq(false, false), true);
  });

  it('should compare mixed numbers and booleans', function() {
    assert.equal(smallereq(2, true), false);
    assert.equal(smallereq(1, true), true);
    assert.equal(smallereq(0, true), true);
    assert.equal(smallereq(true, 2), true);
    assert.equal(smallereq(true, 1), true);
    assert.equal(smallereq(false, 2), true);
  });

  it('should compare bignumbers', function() {
    assert.deepEqual(smallereq(bignumber(2), bignumber(3)), true);
    assert.deepEqual(smallereq(bignumber(2), bignumber(2)), true);
    assert.deepEqual(smallereq(bignumber(3), bignumber(2)), false);
    assert.deepEqual(smallereq(bignumber(0), bignumber(0)), true);
    assert.deepEqual(smallereq(bignumber(-2), bignumber(2)), true);
  });

  it('should compare mixed numbers and bignumbers', function() {
    assert.deepEqual(smallereq(bignumber(2), 3), true);
    assert.deepEqual(smallereq(2, bignumber(2)), true);

    assert.equal(smallereq(1/3, bignumber(1).div(3)), true);
    assert.equal(smallereq(bignumber(1).div(3), 1/3), true);
  });

  it('should compare mixed booleans and bignumbers', function() {
    assert.deepEqual(smallereq(bignumber(0.1), true), true);
    assert.deepEqual(smallereq(bignumber(1), true), true);
    assert.deepEqual(smallereq(bignumber(1), false), false);
    assert.deepEqual(smallereq(bignumber(0), false), true);
    assert.deepEqual(smallereq(false, bignumber(0)), true);
    assert.deepEqual(smallereq(true, bignumber(0)), false);
    assert.deepEqual(smallereq(true, bignumber(1)), true);
  });

  it('should compare two measures of the same unit correctly', function() {
    assert.equal(smallereq(unit('100cm'), unit('10inch')), false);
    assert.equal(smallereq(unit('99cm'), unit('1m')), true);
    //assert.equal(smallereq(unit('100cm'), unit('1m')), true); // dangerous, round-off errors
    assert.equal(smallereq(unit('101cm'), unit('1m')), false);
  });

  it('should apply configuration option epsilon', function() {
    var mymath = mathjs();
    assert.equal(mymath.smallereq(1.01, 1), false);
    mymath.config({epsilon: 1e-2});
    assert.equal(mymath.smallereq(1.01, 1), true);
  });

  it('should throw an error if comparing a unit with a number', function() {
    assert.throws(function () {smallereq(unit('100cm'), 22)});
    assert.throws(function () {smallereq(22, unit('100cm'))});
  });

  it('should throw an error for two measures of different units', function() {
    assert.throws(function () {smallereq(math.unit(5, 'km'), math.unit(100, 'gram'));});
  });

  it('should throw an error if comparing a unit with a bignumber', function() {
    assert.throws(function () {smallereq(unit('100cm'), bignumber(22))});
    assert.throws(function () {smallereq(bignumber(22), unit('100cm'))});
  });

  it('should perform lexical comparison of two strings', function() {
    assert.equal(smallereq('0', 0), true);
    assert.equal(smallereq('abd', 'abc'), false);
    assert.equal(smallereq('abc', 'abc'), true);
    assert.equal(smallereq('abc', 'abd'), true);
  });

  it('should compare a string an matrix elementwise', function() {
    assert.deepEqual(smallereq('B', ['A', 'B', 'C']), [false, true, true]);
    assert.deepEqual(smallereq(['A', 'B', 'C'], 'B'), [true, true, false]);
  });

  it('should perform element-wise comparison on two matrices', function() {
    assert.deepEqual(smallereq([1,4,6], [3,4,5]), [true, true, false]);
    assert.deepEqual(smallereq([1,4,6], matrix([3,4,5])), matrix([true, true, false]));
  });

  it('should throw an error when comparing complex numbers', function() {
    assert.throws(function () {smallereq(complex(1,1), complex(1,2))}, TypeError);
    assert.throws(function () {smallereq(complex(2,1), 3)}, TypeError);
    assert.throws(function () {smallereq(3, complex(2,4))}, TypeError);
    assert.throws(function () {smallereq(math.bignumber(3), complex(2,4))}, TypeError);
    assert.throws(function () {smallereq(complex(2,4), math.bignumber(3))}, TypeError);
  });

  it('should throw an error with two matrices of different sizes', function () {
    assert.throws(function () {smallereq([1,4,6], [3,4])});
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {smallereq(1)}, error.ArgumentsError);
    assert.throws(function () {smallereq(1, 2, 3)}, error.ArgumentsError);
  });

});