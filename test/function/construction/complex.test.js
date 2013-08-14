var assert = require('assert'),
    math = require('../../../lib/index.js'),
    complex = math.complex;

describe('complex', function() {

  it('should return 0 + 0i if called with no argument', function() {
    assert.deepEqual(complex(), new math.type.Complex(0, 0));
    assert.ok(complex() instanceof math.type.Complex);
  });

  it('should parse a valid string and create the complex number accordingly', function() {
    assert.deepEqual(complex('2+3i'), new math.type.Complex(2, 3));
    assert.deepEqual(complex('2-3i'), new math.type.Complex(2, -3));
    assert.ok(complex('2+3i') instanceof math.type.Complex);
  });

  it('should be the identity if called with a complex number', function() {
    var b = complex(complex(2,3));
    assert.deepEqual(b, new math.type.Complex(2,3));
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {complex('no valid complex number')}, SyntaxError);
  });

  it('should throw an error if called with a single number', function() {
    assert.throws(function () {complex(123)}, TypeError);
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {complex(math.unit('5cm'))}, TypeError);
  });

  it('should throw an error if called with a matrix', function() {
    assert.throws(function () {complex(math.matrix())}, TypeError);
  });

  it('should accept two numbers as arguments', function() {
    assert.deepEqual(complex(2, 3), new math.type.Complex(2, 3));
    assert.deepEqual(complex(2, -3), new math.type.Complex(2, -3));
    assert.deepEqual(complex(-2, 3), new math.type.Complex(-2, 3));
    assert.ok(complex(2, 3) instanceof math.type.Complex);
  });

  it('should throw an error if passed two argument, one is invalid', function() {
    assert.throws(function () {complex('string', 2)}, TypeError);
    assert.throws(function () {complex(2, 'string')}, TypeError);
  });

  it('should throw an error if called with more than 2 arguments', function() {
    assert.throws(function () {complex(2,3,4)}, SyntaxError);
  });
});