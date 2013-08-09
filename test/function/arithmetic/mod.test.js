// test mod
var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../src/index.js'),
    matrix = math.matrix,
    range = math.range,
    mod = math.mod;

describe('mod', function() {

  it('should be parsed correctly', function() {
    approx.equal(math.eval('8 % 3'), 2);
    approx.equal(math.eval('mod(8, 3)'), 2);
  });

  it('should perform the modulus of two numbers', function() {
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
    assert.throws(function () {mod(1)}, SyntaxError);
    assert.throws(function () {mod(1,2,3)}, SyntaxError);
  });

  it('should throw an error if used on complex numbers', function() {
    assert.throws(function () {mod(math.complex(1,2), 3)}, TypeError);
    assert.throws(function () {mod(3, math.complex(1,2))}, TypeError);
  });

  it('should an throw an error if used on a string', function() {
    assert.throws(function () {mod('string', 3)}, TypeError);
    assert.throws(function () {mod(5, 'string')}, TypeError);
  });

  it('should perform element-wise modulus on a matrix', function() {
    approx.deepEqual(mod([-4,-3,-2,-1,0,1,2,3,4], 3), [2,0,1,2,0,1,2,0,1]);
    approx.deepEqual(mod(matrix([-4,-3,-2,-1,0,1,2,3,4]), 3), matrix([2,0,1,2,0,1,2,0,1]));
    approx.deepEqual(mod(range(-4,5), 3), [2,0,1,2,0,1,2,0,1]);
  });

});