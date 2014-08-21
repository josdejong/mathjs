var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index');

describe('im', function() {

  it('should return the imaginary part of a complex number', function() {
    assert.equal(math.im(math.complex(2,3)), 3);
    assert.equal(math.im(math.complex(-2,-3)), -3);
    assert.equal(math.im(math.i), 1);
  });

  it('should return the imaginary part of a real number', function() {
    assert.equal(math.im(2), 0);
  });

  it('should return the imaginary part of a big number', function() {
    assert.deepEqual(math.im(math.bignumber(2)), math.bignumber(0));
  });

  it('should return the imaginary part of a boolean', function() {
    assert.equal(math.im(true), 0);
    assert.equal(math.im(false), 0);
  });

  it('should return the imaginary part of null', function() {
    assert.equal(math.im(null), 0);
  });

  it('should return the imaginary part of a string', function() {
    assert.equal(math.im('string'), 0);
  });

  it('should return the imaginary part of a boolean', function() {
    assert.equal(math.im(true), 0);
    assert.equal(math.im(false), 0);
  });

  it('should return the imaginary part for each element in a matrix', function() {
    assert.deepEqual(math.im([2, math.complex('3-6i')]), [0, -6]);
    assert.deepEqual(math.im(math.matrix([2, math.complex('3-6i')])).valueOf(), [0, -6]);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.im()}, error.ArgumentsError);
    assert.throws(function () {math.im(1, 2)}, error.ArgumentsError);
  });

});