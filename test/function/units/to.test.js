var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    unit = math.unit;

describe('to', function() {

  it('should perform the given unit conversion', function() {
    // TODO: improve these tests
    var a = math.unit('500 cm'); a.fixPrefix = true;
    approx.deepEqual(math.to(unit('5m'), unit('cm')), a);

    var b = math.unit('1 foot'); b.fixPrefix = true;
    approx.deepEqual(math.to(unit('12 inch'), unit('foot')), b);

    var c = math.unit('1 inch'); c.fixPrefix = true;
    approx.deepEqual(math.to(unit('2.54 cm'), unit('inch')), c);

    var d = math.unit('68 fahrenheit'); d.fixPrefix = true;
    approx.deepEqual(math.to(unit('20 celsius'), unit('fahrenheit')), d);

    var e = math.unit('0.002 m3'); e.fixPrefix = true;
    approx.deepEqual(math.to(unit('2 litre'), unit('m3')), e);
  });

  it('should perform the given unit conversion on each element of an array', function() {
    // TODO: do not use math.format here
    assert.deepEqual(math.format(math.to([
      unit('1cm'),
      unit('2 inch'),
      unit('2km')], unit('foot')), 5),
        '[0.032808 foot, 0.16667 foot, 6561.7 foot]');
  });

  it('should perform the given unit conversion on each element of a matrix', function() {
    var a = math.matrix([[unit('1cm'), unit('2cm')],[unit('3cm'),unit('4cm')]]);
    var b = math.to(a, unit('mm'));
    assert.ok(b instanceof math.type.Matrix);
    // TODO: do not use math.format here
    assert.equal(math.format(b), '[[10 mm, 20 mm], [30 mm, 40 mm]]');
  });

  it('should throw an error if converting between incompatible units', function() {
    assert.throws(function () {math.to(unit('20 kg'), unit('cm'))});
    assert.throws(function () {math.to(unit('20 celsius'), unit('litre'))});
    assert.throws(function () {math.to(unit('5 cm'), unit('2 m'))});
  });

  it('should throw an error if called with a wrong number of arguments', function() {
    assert.throws(function () {math.to(unit('20 kg'))});
    assert.throws(function () {math.to(unit('20 kg'), unit('m'), unit('cm'))});
  });

  it('should throw an error if called with a non-plain unit', function() {
    assert.throws( function () {math.unit(5000, 'cm').to('5mm'); });
  });

  it('should throw an error if called with a number', function() {
    assert.throws(function () {math.to(5, unit('m'))}, TypeError);
    assert.throws(function () {math.to(unit('5cm'), 2)}, TypeError);
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {math.to('5cm', unit('cm'))}, TypeError);
  });

});