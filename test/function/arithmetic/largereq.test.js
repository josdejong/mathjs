// test largereq
var assert = require('assert'),
    math = require('../../../index')(),
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
    assert.equal(largereq(false, bignumber(0)), true);
  });

  it('should compare two units correctly', function() {
    assert.equal(largereq(unit('100cm'), unit('10inch')), true);
    assert.equal(largereq(unit('99cm'), unit('1m')), false);
    //assert.equal(largereq(unit('100cm'), unit('1m')), true); // dangerous, round-off errors
    assert.equal(largereq(unit('101cm'), unit('1m')), true);
  });

  it('should throw an error if comparing a unit with a number', function() {
    assert.throws(function () {largereq(unit('100cm'), 22)});
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


});