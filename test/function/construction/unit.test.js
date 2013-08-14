var assert = require('assert'),
    math = require('../../../index.js'),
    unit = math.unit;

describe('unit', function() {

  it('should parse a valid string to a unit', function() {
    assert.deepEqual(unit('5 cm').toString(), '50 mm');
    assert.deepEqual(unit('5000 cm').toString(), '50 m');
    assert.deepEqual(unit('10 kg').toString(), '10 kg');
  });

  it('should be the identity if called with a unit', function() {
    var a = math.unit('5cm');
    var b = math.unit(a);
    assert.deepEqual(b.toString(), '50 mm');
  });

  it('should throw an error if called with an invalid string', function() {
    assert.throws(function () {unit('invalid unit')}, SyntaxError);
  });

  it('should throw an error if called with a number', function() {
    assert.throws(function () {unit(2)}, TypeError);
  });

  it('should throw an error if called with a complex', function() {
    assert.throws(function () {unit(math.complex(2,3))}, TypeError);
  });

  it('should take a number as the quantity and a string as the unit', function() {
    assert.deepEqual(unit(5, 'cm').toString(), '50 mm');
    assert.deepEqual(unit(10, 'kg').toString(), '10 kg');
  });

  it('should throw an error if called with 2 strings', function() {
    assert.throws(function () {unit('2', 'cm')}, TypeError);
  });

  it('should throw an error if called with one invalid argument', function() {
    assert.throws(function () {unit(2, math.complex(2,3))}, TypeError);
  });

  it('should throw an error if called with no argument', function() {
    assert.throws(function () {unit()}, SyntaxError);
  });

  it('should throw an error if called with an invalid number of arguments', function() {  
    assert.throws(function () {unit(1,2,3)}, SyntaxError);
  });
});