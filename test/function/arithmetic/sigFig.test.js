// test round
var assert = require('assert'),
  approx = require('../../../tools/approx'),
  error = require('../../../lib/error/index'),
  math = require('../../../index'),
  bignumber = math.bignumber,
  sigFig = math.sigFig;

describe('sigFig', function() {

  it('should round a number to the given number of significant figures', function() {
    approx.equal(sigFig(math.pi, 1), 3);
    approx.equal(sigFig(math.pi * 10, 1), 30);
    approx.equal(sigFig(math.pi * 10, 2), 31);
    approx.equal(sigFig(math.pi * 1000, 3), 3140);
    approx.equal(sigFig(math.pi * 1000, 6), 3141.59);
    approx.equal(sigFig(math.pi, 3), 3.14);
    approx.equal(sigFig(-1 * math.pi, 3), -3.14);
    approx.equal(sigFig(-1 * math.pi * 1000, 3), -3140);
  });

  it('should round booleans (yeah, not really useful but it should be supported)', function() {
    approx.equal(sigFig(true, 2), 1);
    approx.equal(sigFig(false, 2), 0);
  });

  it('should throw an error on invalid type of n', function() {
    assert.throws(function () {sigFig(math.pi, new Date());}, TypeError);
  });

  it('should throw an error on invalid value of n', function() {
    assert.throws(function () {sigFig(math.pi, -2);}, /Number of decimals in function sigFig must be in the range of 1-15/);
    assert.throws(function () {sigFig(math.pi, 20);}, /Number of decimals in function sigFig must be in the range of 1-15/);
    assert.throws(function () {sigFig(math.pi, 2.5);}, /Number of decimals in function sigFig must be an integer/);
  });

  it('should throw an error if used with wrong number of arguments', function() {
    assert.throws(function () {sigFig(1);}, error.ArgumentsError);
    assert.throws(function () {sigFig(1,2,3);}, error.ArgumentsError);
  });

  it('should throw an error on invalid type of value', function() {
    assert.throws(function () {sigFig('string', 1);}, TypeError);
    assert.throws(function () {sigFig(new Date(), 1);}, TypeError);
  });

  it('should round real and imag part of a complex number to the given number of significant figures', function() {
    assert.deepEqual(sigFig(math.complex(0.22, math.pi), 1), math.complex(0.2,3));
  });

  it('should round a number to the given number of significant figures when given as a bignumber', function() {
    approx.equal(sigFig(math.pi, bignumber(1)), 3);
    approx.equal(sigFig(math.pi * 10, bignumber(1)), 30);
    approx.equal(sigFig(math.pi * 10, bignumber(2)), 31);
  });

  it('should round a bignumber to the given number of significant figures', function() {
    approx.equal(sigFig(math.pi, bignumber(1)), 3);
    approx.equal(sigFig(math.pi * 10, bignumber(1)), 30);
    approx.equal(sigFig(math.pi * 10, bignumber(2)), 31);
  });

  it('should round each element in a matrix, array, range to a given number of significant figures', function() {
    approx.deepEqual(sigFig(math.range(0,2.1,0.2), 1), math.matrix([0,0.2,0.4,0.6,0.8,1,1,1,2,2,2]));
    approx.deepEqual(sigFig([1.7,2.3], 1), [2,2]);
    assert.deepEqual(sigFig(math.matrix([1.7,2.3]), 1).valueOf(), [2, 2]);
  });

});