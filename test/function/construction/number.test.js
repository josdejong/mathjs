var assert = require('assert'),
    math = require('../../../index.js'),
    approx = require('../../../tools/approx.js'),
    number = math.number;

describe('number', function() {

  it('should be parsed correctly', function() {
    assert.equal(math.eval('number("123")'), 123);
    assert.equal(math.eval('number()'), 0);
  });

  it('should be 0 if called with no argument', function() {
    approx.equal(number(), 0);
  });

  it('should be 1 if called with true, 0 if called with false', function() {
    approx.equal(number(true), 1);
    approx.equal(number(false), 0);
  });

  it('should be the identity if called with a number', function() {
    approx.equal(number(3), 3);
    approx.equal(number(-3), -3);
  });

  it('should parse the string if called with a valid string', function() {
    approx.equal(number('2.1e3'), 2100);
    approx.equal(number(' 2.1e-3 '), 0.0021);
    approx.equal(number(''), 0);
    approx.equal(number(' '), 0);
  });

  it('should throw an error if called with an invalid string', function() {
    assert.throws(function () {number('2.3.4')}, SyntaxError);
    assert.throws(function () {number('23a')}, SyntaxError);
  });

  it('should throw an error if called with a wrong number of arguments', function() {
    assert.throws(function () {number(1,2)}, SyntaxError);
    assert.throws(function () {number(1,2,3)}, SyntaxError);
  });

  it('should throw an error if called with a complex number', function() {
    assert.throws(function () {number(math.complex(2,3))}, SyntaxError);
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {number(math.unit('5cm'))}, SyntaxError);
  });
    
  it('should throw an error if called with a range', function() {
    assert.throws(function () {number(math.range(1,3))}, SyntaxError);
  });

  it('should throw an error if called with a matrix', function() {
    assert.throws(function () {number(math.matrix([1,3]))}, SyntaxError);
  });
    
  it('should throw an error if called with an array', function() {
    assert.throws(function () {number([1,3])}, SyntaxError);
  });
});

