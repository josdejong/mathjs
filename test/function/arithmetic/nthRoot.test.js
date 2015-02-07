// test nthRoot
var assert = require('assert');
var approx = require('../../../tools/approx');
var error = require('../../../lib/error/index');
var math = require('../../../index');
var complex = math.complex;
var matrix = math.matrix;
var unit = math.unit;
var range = math.range;
var nthRoot = math.nthRoot;
var big = math.bignumber;


describe('nthRoot', function() {
  it('should return the nthRoot of a boolean value', function () {
    assert.equal(nthRoot(true), 1);
    assert.equal(nthRoot(false), 0);
    assert.equal(nthRoot(1,true), 1);
  });

  it('should return the nthRoot of null', function () {
    assert.equal(nthRoot(null), 0);
  });

  it('should return the nthRoot for numbers', function() {
    approx.equal(nthRoot(4), 2);
    approx.equal(nthRoot(9), 3);
    approx.equal(nthRoot(8, 3), 2);
    approx.equal(nthRoot(64, 3), 4);
    approx.equal(nthRoot(2, 2.5), 1.31950791077289);
    approx.equal(nthRoot(2.5, 2), 1.58113883008419);
    approx.equal(nthRoot(0, 3), 0);
    approx.equal(nthRoot(0, 2), 0);
    approx.equal(nthRoot(0.0001, 3), 0.0464158883361278);
  });

  it('should return the nthRoot for negative numbers', function() {
    approx.equal(nthRoot(-64, 3), -4);
    approx.equal(nthRoot(-64, 3), -4);
  });

  it('should return the nthRoot for negative roots', function() {
    approx.equal(nthRoot(64, -3), 0.25);
    approx.equal(nthRoot(-64, -3), -0.25);
  });

  it('should return the nthRoot for infinity', function() {
    approx.equal(nthRoot(Infinity, 2), Infinity);
    approx.equal(nthRoot(-Infinity, 3), -Infinity);
    approx.equal(nthRoot(Infinity, -3), 0);
  });

  it('should throw an error when n is zero', function() {
    assert.throws(function () {nthRoot(4, 0)}, /Root must be non-zero/);
  });

  it('should throw an error when value is negative and root is even', function() {
    assert.throws(function () {nthRoot(-27, 2)}, /Root must be odd when a is negative/);
    assert.throws(function () {nthRoot(-27, 2.5)}, /Root must be odd when a is negative/);
  });

  it('should throw an error if invalid number of arguments', function() {
    assert.throws(function () {nthRoot()}, error.ArgumentsError);
    assert.throws(function () {nthRoot(1, 2, 3)}, error.ArgumentsError);
  });


  it('should return the nthRoot of bignumbers', function() {
    assert.deepEqual(nthRoot(big(4)), big(2));
    assert.deepEqual(nthRoot(big(9)), big(3));
    assert.deepEqual(nthRoot(big(8), big(3)), big(2));
    assert.deepEqual(nthRoot(big(64), big(3)), big(4));
  });

  it('should return the nthRoot of negative bignumber values', function() {
    assert.deepEqual(nthRoot(big(-64), big(3)), big(-4));
  });

  it('should return the nthRoot of negative bignumber roots', function() {
    assert.deepEqual(nthRoot(big(64), big(-3)), big(0.25));
    assert.deepEqual(nthRoot(big(-64), big(3)), big(-4));
    assert.deepEqual(nthRoot(big(-64), big(-3)), big(-0.25));
  });

  it('should return the nthRoot for bignumber infinity', function() {
    assert.deepEqual(nthRoot(big(Infinity), big(2)), big(Infinity));
    assert.deepEqual(nthRoot(big(-Infinity), big(3)), big(-Infinity));
    assert.deepEqual(nthRoot(big(Infinity), big(-3)), big(0));
  });

  it('should throw an error when used on a complex value', function() {
    assert.throws(function () {nthRoot(math.complex(2,3))});
    assert.throws(function () {nthRoot(math.complex(2,3), 3)});
  });

  it('should throw an error when used on a unit', function() {
    assert.throws(function () {nthRoot(unit('5cm'))});
  });

  it('should throw an error when used on a string', function() {
    assert.throws(function () {nthRoot('text')});
  });

  it('should return the nthRoot of each element of a matrix', function() {
    var x = [2, 3, 4];
    var a = [8, 27, 64];
    var n = 3;
    approx.deepEqual(nthRoot(a, n), x);
    approx.deepEqual(nthRoot(matrix(a), n), matrix(x));
  });

});