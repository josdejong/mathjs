var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index');

describe('re', function() {

  it('should return the real part of a complex number', function() {
    assert.equal(math.re(math.complex(2,3)), 2);
    assert.equal(math.re(math.complex(-2,-3)), -2);
    assert.equal(math.re(math.i), 0);
  });

  it('should return the real part of a real number', function() {
    assert.equal(math.re(2), 2);
  });

  it('should return the real part of a big number', function() {
    assert.deepEqual(math.re(math.bignumber(2)), math.bignumber(2));
  });

  it('should return the real part of a string', function() {
    assert.equal(math.re('string'), 'string');
  });

  it('should return the real part of a boolean', function() {
    assert.strictEqual(math.re(true), 1);
    assert.strictEqual(math.re(false), 0);
  });

  it('should return the real part of null', function() {
    assert.strictEqual(math.re(null), 0);
  });

  it('should return the real part for each element in a matrix', function() {
    assert.deepEqual(math.re([2, math.complex('3-6i')]), [2, 3]);
    assert.deepEqual(math.re(math.matrix([2, math.complex('3-6i')])).valueOf(), [2, 3]);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.re()}, error.ArgumentsError);
    assert.throws(function () {math.re(1, 2)}, error.ArgumentsError);
  });

  it('should LaTeX re', function () {
    var expression = math.parse('re(1+i)');
    assert.equal(expression.toTex(), '\\Re\\left\\lbrace1+ i\\right\\rbrace');
  });

});
