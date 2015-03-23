var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    Unit = math.type.Unit,
    Matrix = math.type.Matrix,
    unit = math.unit;

describe('to', function() {

  it('should perform the given unit conversion', function() {
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
    approx.deepEqual(math.to([
      unit('1cm'),
      unit('2 inch'),
      unit('2km')
    ], unit('foot')), [
      new Unit(0.032808, 'foot').to('foot'),
      new Unit(0.16667, 'foot').to('foot'),
      new Unit(6561.7, 'foot').to('foot')
    ]);
  });

  it('should perform the given unit conversion on each element of a matrix', function() {
    var a = math.matrix([
      [unit('1cm'), unit('2cm')],
      [unit('3cm'),unit('4cm')]
    ]);

    var b = math.to(a, unit('mm'));

    assert.ok(b instanceof math.type.Matrix);
    approx.deepEqual(b, math.matrix([
      [new Unit(10, 'mm').to('mm'), new Unit(20, 'mm').to('mm')],
      [new Unit(30, 'mm').to('mm'), new Unit(40, 'mm').to('mm')]
    ]));
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