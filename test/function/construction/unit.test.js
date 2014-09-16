var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    unit = math.unit;
    Unit = require('../../../lib/type/Unit');

describe('unit', function() {

  it ('should construct a unit', function () {
    var u = unit('5 cm');
    assert.deepEqual(u, new Unit(5, 'cm'));
  });

  it('should parse a valid string to a unit', function() {
    assert.deepEqual(unit('5 cm').toString(), '50 mm');
    assert.deepEqual(unit('5000 cm').toString(), '50 m');
    assert.deepEqual(unit('10 kg').toString(), '10 kg');
  });

  it('should clone a unit', function() {
    var a = math.unit('5cm');
    var b = math.unit(a);
    assert.deepEqual(b.toString(), '50 mm');
  });

  it('should create units from all elements in an array', function() {
    assert.deepEqual(math.unit(['5 cm', '3kg']), [math.unit('5cm'), math.unit('3kg')]);
  });

  it('should create units from all elements in an array', function() {
    assert.deepEqual(math.unit(math.matrix(['5 cm', '3kg'])), math.matrix([math.unit('5cm'), math.unit('3kg')]));
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

  it('should take a bignumber as the quantity and a string as the unit (downgrades to number)', function() {
    assert.deepEqual(unit(math.bignumber(5), 'cm').toString(), '50 mm');
  });

  it('should throw an error if called with 2 strings', function() {
    assert.throws(function () {unit('2', 'cm')}, TypeError);
  });

  it('should throw an error if called with one invalid argument', function() {
    assert.throws(function () {unit(2, math.complex(2,3))}, TypeError);
    assert.throws(function () {unit(true, 'cm')}, TypeError);
  });

  it('should throw an error if called with no argument', function() {
    assert.throws(function () {unit()}, error.ArgumentsError);
  });

  it('should throw an error if called with an invalid number of arguments', function() {  
    assert.throws(function () {unit(1,2,3)}, error.ArgumentsError);
  });
});