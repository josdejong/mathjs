// test mod
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    matrix = math.matrix,
    range = math.range,
    mod = math.mod;

describe('mod', function() {
  it('should calculate the modulus of booleans correctly', function () {
    assert.equal(mod(true, true), 0);
    assert.equal(mod(false, true), 0);
    assert.equal(mod(true, false), 1);
    assert.equal(mod(false, false), 0);
  });

  it('should calculate the modulus of numbers and null', function () {
    assert.equal(mod(null, null), 0);
    assert.equal(mod(null, 1), 0);
    assert.equal(mod(1, null), 1);
  });

  it('should calculate the modulus of two numbers', function() {
    assert.equal(mod(1, 1), 0);
    assert.equal(mod(0, 1), 0);
    assert.equal(mod(1, 0), 1);
    assert.equal(mod(0, 0), 0);
    assert.equal(mod(7, 0), 7);

    approx.equal(mod(7, 2), 1);
    approx.equal(mod(9, 3), 0);
    approx.equal(mod(10, 4), 2);
    approx.equal(mod(-10, 4), 2);
    approx.equal(mod(8.2, 3), 2.2);
    approx.equal(mod(4, 1.5), 1);
    approx.equal(mod(0, 3), 0);
  });

  it('should throw an error if the modulus is negative', function() {
    assert.throws(function () {mod(10, -4)});
  });

  it('should throw an error if used with wrong number of arguments', function() {
    assert.throws(function () {mod(1)}, error.ArgumentsError);
    assert.throws(function () {mod(1,2,3)}, error.ArgumentsError);
  });

  it('should throw an error if used with wrong type of arguments', function() {
    assert.throws(function () {mod(1, 'string')}, math.error.UnsupportedTypeError);
    assert.throws(function () {mod('string', bignumber(2))}, math.error.UnsupportedTypeError);
  });

  it('should calculate the modulus of bignumbers', function() {
    assert.deepEqual(mod(bignumber(7), bignumber(2)), bignumber(1));
    assert.deepEqual(mod(bignumber(7), bignumber(0)), bignumber(7));
    assert.deepEqual(mod(bignumber(0), bignumber(3)), bignumber(0));
    assert.deepEqual(mod(bignumber(7), bignumber(2)), bignumber(1));
    assert.deepEqual(mod(bignumber(8), bignumber(3)).valueOf(), bignumber(2).valueOf());
  });

  it.skip('should calculate the modulus of bignumbers for fractions', function () {
    assert.deepEqual(mod(bignumber(7).div(3), bignumber(1).div(3)), bignumber(0));
  });

  it.skip('should calculate the modulus of bignumbers for negative values', function () {
    assert.deepEqual(mod(bignumber(-10), bignumber(4)), bignumber(2));
  });

  it('should calculate the modulus of mixed numbers and bignumbers', function() {
    assert.deepEqual(mod(bignumber(7), 2), bignumber(1));
    assert.deepEqual(mod(bignumber(7), 0), bignumber(7));
    assert.deepEqual(mod(8, bignumber(3)), bignumber(2));
    assert.deepEqual(mod(7, bignumber(0)), bignumber(7));
    assert.deepEqual(mod(bignumber(0), 3), bignumber(0));
    assert.deepEqual(mod(bignumber(7), 0), bignumber(7));

    approx.equal(mod(7/3, bignumber(2)), 1/3);
    approx.equal(mod(7/3, 1/3), 0);
    approx.equal(mod(bignumber(7).div(3), 1/3), 0);
  });

  it('should calculate the modulus of mixed booleans and bignumbers', function() {
    assert.deepEqual(mod(bignumber(7), true), bignumber(0));
    assert.deepEqual(mod(bignumber(7), false), bignumber(7));
    assert.deepEqual(mod(true, bignumber(3)), bignumber(1));
    assert.deepEqual(mod(false, bignumber(3)), bignumber(0));
  });

  it('should throw an error if used on complex numbers', function() {
    assert.throws(function () {mod(math.complex(1,2), 3)}, TypeError);
    assert.throws(function () {mod(3, math.complex(1,2))}, TypeError);
    assert.throws(function () {mod(bignumber(3), math.complex(1,2))}, TypeError);
  });

  it('should an throw an error if used on a string', function() {
    assert.throws(function () {mod('string', 3)}, TypeError);
    assert.throws(function () {mod(5, 'string')}, TypeError);
  });

  it('should perform element-wise modulus on a matrix', function() {
    approx.deepEqual(mod([-4,-3,-2,-1,0,1,2,3,4], 3), [2,0,1,2,0,1,2,0,1]);
    approx.deepEqual(mod(matrix([-4,-3,-2,-1,0,1,2,3,4]), 3), matrix([2,0,1,2,0,1,2,0,1]));
  });

  it('should LaTeX mod', function () {
    var expression = math.parse('mod(11,2)');
    assert.equal(expression.toTex(), '\\left(11\\mod2\\right)');
  });

});
