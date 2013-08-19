var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../index.js'),
    unit = math.unit;

describe('in', function() {

  it('should perform the given unit conversion', function() {
    assert.equal(math.in(unit('5m'), unit('cm')).toString(), '500 cm');
    assert.equal(math.in(unit('12 inch'), unit('foot')).toString(), '1 foot');
    assert.equal(math.in(unit('2.54 cm'), unit('inch')).toString(), '1 inch');
    assert.equal(math.in(unit('20 celsius'), unit('fahrenheit')).toString(), '68 fahrenheit');
    assert.equal(math.in(unit('2 litre'), unit('m3')).toString(), '0.002 m3');
  });

  it('should perform the given unit conversion on each element of an array', function() {
    assert.deepEqual(math.format(math.in([
      unit('1cm'),
      unit('2 inch'),
      unit('2km')], unit('foot'))),
        '[0.032808 foot, 0.16667 foot, 6561.7 foot]');
  });

  it('should perform the given unit conversion on each element of a matrix', function() {
    var a = math.matrix([[unit('1cm'), unit('2cm')],[unit('3cm'),unit('4cm')]]);
    var b = math.in(a, unit('mm'));
    assert.ok(b instanceof math.type.Matrix);
    assert.equal(math.format(b), '[[10 mm, 20 mm], [30 mm, 40 mm]]');
  });

  it('should be parsed correctly', function() {
    assert.equal(math.eval('2.54 cm in inch').toString(), '1 inch');
    assert.equal(math.eval('2.54 cm + 2 inch in foot').toString(), '0.25 foot');
  });

  it('should throw an error if converting between incompatible units', function() {
    assert.throws(function () {math.in(unit('20 kg'), unit('cm'))});
    assert.throws(function () {math.in(unit('20 celsius'), unit('litre'))});
    assert.throws(function () {math.in(unit('5 cm'), unit('2 m'))});
  });

  it('should throw an error if called with a wrong number of arguments', function() {
    assert.throws(function () {math.in(unit('20 kg'))});
    assert.throws(function () {math.in(unit('20 kg'), unit('m'), unit('cm'))});
  });

  it('should throw an error if called with a non-plain unit', function() {
    assert.throws( function () {math.unit(5000, 'cm').in('5mm'); });
  });

  it('should throw an error if called with a number', function() {
    assert.throws(function () {math.in(5, unit('m'))}, TypeError);
    assert.throws(function () {math.in(unit('5cm'), 2)}, TypeError);
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {math.in('5cm', unit('cm'))}, TypeError);
  });

});