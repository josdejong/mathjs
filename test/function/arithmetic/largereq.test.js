// test largereq
var assert = require('assert'),
    mathjs = require('../../../index')
    math = mathjs(),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    largereq = math.largereq;

describe('largereq', function() {

  it('should compare two numbers correctly', function() {
    assert.equal(largereq(2, 3), false);
    assert.equal(largereq(2, 2), true);
    assert.equal(largereq(2, 1), true);
    assert.equal(largereq(0, 0), true);
    assert.equal(largereq(-2, 2), false);
    assert.equal(largereq(-2, -3), true);
    assert.equal(largereq(-3, -2), false);
  });

  it('should compare two floating point numbers correctly', function() {
    // Infinity
    assert.equal(largereq(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), true);
    assert.equal(largereq(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY), true);
    assert.equal(largereq(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), true);
    assert.equal(largereq(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), false);
    assert.equal(largereq(Number.POSITIVE_INFINITY, 2.0), true);
    assert.equal(largereq(2.0, Number.POSITIVE_INFINITY), false);
    assert.equal(largereq(Number.NEGATIVE_INFINITY, 2.0), false);
    assert.equal(largereq(2.0, Number.NEGATIVE_INFINITY), true);
    // floating point numbers
    assert.equal(largereq(0.3 - 0.2, 0.1), true);
  });

  it('should compare two booleans', function() {
    assert.equal(largereq(true, true), true);
    assert.equal(largereq(true, false), true);
    assert.equal(largereq(false, true), false);
    assert.equal(largereq(false, false), true);
  });

  it('should compare mixed numbers and booleans', function() {
    assert.equal(largereq(2, true), true);
    assert.equal(largereq(0, true), false);
    assert.equal(largereq(true, 2), false);
    assert.equal(largereq(true, 1), true);
    assert.equal(largereq(false, 0), true);
  });

  it('should compare bignumbers', function() {
    assert.equal(largereq(bignumber(2), bignumber(3)), false);
    assert.equal(largereq(bignumber(2), bignumber(2)), true);
    assert.equal(largereq(bignumber(3), bignumber(2)), true);
    assert.equal(largereq(bignumber(0), bignumber(0)), true);
    assert.equal(largereq(bignumber(-2), bignumber(2)), false);
  });

  it('should compare mixed numbers and bignumbers', function() {
    assert.equal(largereq(bignumber(2), 3), false);
    assert.equal(largereq(2, bignumber(2)), true);

    assert.equal(largereq(1/3, bignumber(1).div(3)), true);
    assert.equal(largereq(bignumber(1).div(3), 1/3), true);
  });

  it('should compare mixed booleans and bignumbers', function() {
    assert.equal(largereq(bignumber(0.1), true), false);
    assert.equal(largereq(bignumber(1), true), true);
    assert.equal(largereq(bignumber(1), false), true);
    assert.equal(largereq(false, bignumber(0)), true);
    assert.equal(largereq(true, bignumber(0)), true);
    assert.equal(largereq(true, bignumber(1)), true);
  });

  it('should compare two units correctly', function() {
    assert.equal(largereq(unit('100cm'), unit('10inch')), true);
    assert.equal(largereq(unit('99cm'), unit('1m')), false);
    //assert.equal(largereq(unit('100cm'), unit('1m')), true); // dangerous, round-off errors
    assert.equal(largereq(unit('101cm'), unit('1m')), true);
  });

  it('should apply configuration option epsilon', function() {
    var mymath = mathjs();
    assert.equal(mymath.largereq(1, 1.01), false);
    mymath.config({epsilon: 1e-2});
    assert.equal(mymath.largereq(1, 1.01), true);
  });

  it('should throw an error if comparing a unit with a number', function() {
    assert.throws(function () {largereq(unit('100cm'), 22)});
  });

  it('should throw an error for two measures of different units', function() {
    assert.throws(function () {largereq(math.unit(5, 'km'), math.unit(100, 'gram')); });
  });

  it('should throw an error if comparing a unit with a bignumber', function() {
    assert.throws(function () {largereq(unit('100cm'), bignumber(22))});
  });

  it('should perform lexical comparison for 2 strings', function() {
    assert.equal(largereq('0', 0), true);
    assert.equal(largereq('abd', 'abc'), true);
    assert.equal(largereq('abc', 'abc'), true);
    assert.equal(largereq('abc', 'abd'), false);
  });

  it('should compare a string an matrix elementwise', function() {
    assert.deepEqual(largereq('B', ['A', 'B', 'C']), [true, true, false]);
    assert.deepEqual(largereq(['A', 'B', 'C'], 'B'), [false, true, true]);
  });

  it('should perform element-wise comparison for two matrices of the same size', function() {
    assert.deepEqual(largereq([1,4,6], [3,4,5]), [false, true, true]);
    assert.deepEqual(largereq([1,4,6], matrix([3,4,5])), matrix([false, true, true]));
  });

  it('should throw an error when comparing complex numbers', function() {
    assert.throws(function () {largereq(complex(1,1), complex(1,2))}, TypeError);
    assert.throws(function () {largereq(complex(2,1), 3)}, TypeError);
    assert.throws(function () {largereq(3, complex(2,4))}, TypeError);
    assert.throws(function () {largereq(math.bignumber(3), complex(2,4))}, TypeError);
    assert.throws(function () {largereq(complex(2,4), math.bignumber(3))}, TypeError);
  });

  it('should throw an error if comparing two matrices of different sizes', function() {
    assert.throws(function () {largereq([1,4,6], [3,4])});
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {largereq(1)}, error.ArgumentsError);
    assert.throws(function () {largereq(1, 2, 3)}, error.ArgumentsError);
  });

});