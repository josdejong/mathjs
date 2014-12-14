var assert = require('assert'),
    approx = require('../../tools/approx'),
    Unit = require('../../lib/type/Unit');

describe('unit', function() {

  describe('constructor', function() {

    it('should create unit correctly', function() {
      var unit1 = new Unit(5000, 'cm');
      assert.equal(unit1.value, 50);
      assert.equal(unit1.unit.name, 'm');

      unit1 = new Unit(5, 'kg');
      assert.equal(unit1.value, 5);
      assert.equal(unit1.unit.name, 'g');

      unit1 = new Unit(null, 'kg');
      assert.equal(unit1.value, null);
      assert.equal(unit1.unit.name, 'g');
    });

    it('should create square meter correctly', function() {
      var unit1 = new Unit(0.000001, 'km2');
      assert.equal(unit1.value, 1);
      assert.equal(unit1.unit.name, 'm2');
    });

    it('should create cubic meter correctly', function() {
      var unit1 = new Unit(0.000000001, 'km3');
      assert.equal(unit1.value, 1);
      assert.equal(unit1.unit.name, 'm3');
    });

    it('should ignore properties on Object.prototype', function() {
      Object.prototype.foo = Unit.UNITS['meter'];

      assert.throws(function () {new Unit(1, 'foo')}, /Unknown unit/);

      delete Object.prototype.foo;
    });

    it('should throw an error if called without new keyword', function() {
      assert.throws(function () {
        Unit(2, 'inch');
      });
    });

    it('should throw an error if called with wrong type of arguments', function() {
      assert.throws(function () { new Unit('24', 'inch'); });
      assert.throws(function () { new Unit(0, 'bla'); });
      assert.throws(function () { new Unit(4, ''); });
      assert.throws(function () { new Unit(0, 3); });
    });

  });

  describe('isValuelessUnit', function() {

    it('should return true if the string is a plain unit', function() {
      assert.equal(Unit.isValuelessUnit('cm'), true);
      assert.equal(Unit.isValuelessUnit('inch'), true);
      assert.equal(Unit.isValuelessUnit('kb'), true);
    });

    it('should return false if the unit is not a plain unit', function() {
      assert.equal(Unit.isValuelessUnit('bla'), false);
      assert.equal(Unit.isValuelessUnit('5cm'), false);
    });

  });

  describe('isUnit', function() {

    it('should test whether a variable is a unit', function() {
      assert.equal(Unit.isUnit(new Date()), false);
      assert.equal(Unit.isUnit('string'), false);
      assert.equal(Unit.isUnit(new Unit(2, 'km')), true);
      assert.equal(Unit.isUnit(new Unit(null, 'km')), true);
    });

  });

  describe('hasBase', function() {

    it('should test whether a unit has a certain base unit', function() {
      assert.equal(new Unit(5, 'cm').hasBase(Unit.BASE_UNITS.ANGLE), false);
      assert.equal(new Unit(5, 'cm').hasBase(Unit.BASE_UNITS.LENGTH), true);
    });

  });

  describe('equalBase', function() {

    it('should test whether two units have the same base unit', function() {
      assert.equal(new Unit(5, 'cm').equalBase(new Unit(10, 'm')), true);
      assert.equal(new Unit(5, 'cm').equalBase(new Unit(10, 'kg')), false);
    });

  });

  describe('equals', function() {

    it('should test whether two units are equal', function() {
      assert.equal(new Unit(100, 'cm').equals(new Unit(1, 'm')), true);
      assert.equal(new Unit(100, 'cm').equals(new Unit(2, 'm')), false);
      assert.equal(new Unit(100, 'cm').equals(new Unit(1, 'kg')), false);
    });

  });

  describe('clone', function() {

    it('should clone a unit', function() {
      var u1 = new Unit(100, 'cm');
      var u2 = u1.clone();
      assert(u1 !== u2);
      assert.deepEqual(u1, u2);

      var u3 = new Unit(100, 'cm').to('inch');
      var u4 = u3.clone();
      assert(u3 !== u4);
      assert.deepEqual(u3, u4);

      var u5 = new Unit(null, 'cm').to('inch');
      var u6 = u5.clone();
      assert(u5 !== u6);
      assert.deepEqual(u5, u6);

    });

  });

  describe('toNumber', function() {
    it ('should convert a unit to a number', function () {
      var u = new Unit(5000, 'cm');
      approx.equal(u.toNumber('mm'), 50000);

      approx.equal(new Unit(5.08, 'cm').toNumber('inch'), 2);
    });

    it ('should convert a unit with fixed prefix to a number', function () {
      var u1 = new Unit(5000, 'cm');
      var u2 = u1.to('km');
      approx.equal(u2.toNumber('mm'), 50000);
    });
  });

  describe('to', function() {

    it ('should convert a unit to a fixed unitName', function () {
      var u1 = new Unit(5000, 'cm');
      assert.equal(u1.value, 50);
      assert.equal(u1.unit.name, 'm');
      assert.equal(u1.prefix.name, 'c');
      assert.equal(u1.fixPrefix, false);

      var u2 = u1.to('inch');
      assert.notStrictEqual(u1, u2); // u2 must be a clone
      assert.equal(u2.value, 50);
      assert.equal(u2.unit.name, 'inch');
      assert.equal(u2.prefix.name, '');
      assert.equal(u2.fixPrefix, true);
    });

    it ('should convert a unit to a fixed unit', function () {
      var u1 = new Unit(5000, 'cm');
      assert.equal(u1.value, 50);
      assert.equal(u1.unit.name, 'm');
      assert.equal(u1.prefix.name, 'c');
      assert.equal(u1.fixPrefix, false);

      var u2 = u1.to(new Unit(null, 'km'));
      assert.notStrictEqual(u1, u2); // u2 must be a clone
      assert.equal(u2.value, 50);
      assert.equal(u2.unit.name, 'm');
      assert.equal(u2.prefix.name, 'k');
      assert.equal(u2.fixPrefix, true);
    });

    it ('should convert a valueless unit', function () {
      var u1 = new Unit(null, 'm');
      assert.equal(u1.value, null);
      assert.equal(u1.unit.name, 'm');
      assert.equal(u1.prefix.name, '');
      assert.equal(u1.fixPrefix, false);

      var u2 = u1.to(new Unit(null, 'cm'));
      assert.notStrictEqual(u1, u2); // u2 must be a clone
      assert.equal(u2.value, 1);     // u2 must have a value
      assert.equal(u2.unit.name, 'm');
      assert.equal(u2.prefix.name, 'c');
      assert.equal(u2.fixPrefix, true);
    });

    it ('should throw an error when converting to an incompatible unit', function () {
      var u1 = new Unit(5000, 'cm');
      assert.throws(function () {u1.to('kg')}, /Units do not match/);
    });

    it ('should throw an error when converting to a unit having a value', function () {
      var u1 = new Unit(5000, 'cm');
      assert.throws(function () {u1.to(new Unit(4, 'm'))}, /Cannot convert to a unit with a value/);
    });

    it ('should throw an error when converting to an unsupported type of argument', function () {
      var u1 = new Unit(5000, 'cm');
      assert.throws(function () {u1.to(new Date())}, /String or Unit expected as parameter/);
    });
  });

  describe('toString', function() {

    it('should convert to string properly', function() {
      assert.equal(new Unit(5000, 'cm').toString(), '50 m');
      assert.equal(new Unit(5, 'kg').toString(), '5 kg');
      assert.equal(new Unit(2/3, 'm').toString(), '0.6666666666666666 m');
    });

    it('should render with the best prefix', function() {
      assert.equal(new Unit(0.001 ,'m').toString(), '1 mm');
      assert.equal(new Unit(0.01 ,'m').toString(), '10 mm');
      assert.equal(new Unit(0.1 ,'m').toString(), '100 mm');
      assert.equal(new Unit(0.5 ,'m').toString(), '500 mm');
      assert.equal(new Unit(0.6 ,'m').toString(), '0.6 m');
      assert.equal(new Unit(1 ,'m').toString(), '1 m');
      assert.equal(new Unit(10 ,'m').toString(), '10 m');
      assert.equal(new Unit(100 ,'m').toString(), '100 m');
      assert.equal(new Unit(300 ,'m').toString(), '300 m');
      assert.equal(new Unit(500 ,'m').toString(), '500 m');
      assert.equal(new Unit(600 ,'m').toString(), '0.6 km');
      assert.equal(new Unit(1000 ,'m').toString(), '1 km');
    });

  });

  describe('valueOf', function() {

    it('should return string representation wen calling valueOf', function() {
      assert.strictEqual(new Unit(5000, 'cm').valueOf(), '50 m');
      assert.strictEqual(new Unit(5, 'kg').valueOf(), '5 kg');
      assert.strictEqual(new Unit(2/3, 'm').valueOf(), '0.6666666666666666 m');
    });

  });

  describe('format', function () {

    it('should format units with given precision', function() {
      assert.equal(new Unit(2/3, 'm').format(3), '0.667 m');
      assert.equal(new Unit(2/3, 'm').format(4), '0.6667 m');
      assert.equal(new Unit(2/3, 'm').format(), '0.6666666666666666 m');
    });

    it('should format a unit without value', function() {
      assert.equal(new Unit(null, 'cm').format(), 'cm');
      assert.equal(new Unit(null, 'm').format(), 'm');
    });

    it('should format a unit with fixed prefix and without value', function() {
      assert.equal(new Unit(null, 'km').to('cm').format(), '1e+5 cm');
      assert.equal(new Unit(null, 'inch').to('cm').format(), '2.54 cm');
    });

    it('should ignore properties in Object.prototype when finding the best prefix', function() {
      Object.prototype.foo = 'bar';

      assert.equal(new Unit(5e5, 'cm').format(), '5 km');

      delete Object.prototype.foo;
    });

  });

  describe('parse', function() {

    it('should parse units correctly', function() {
      var unit1;

      unit1 = Unit.parse('5kg');
      assert.equal(unit1.value, 5);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = Unit.parse('5 kg');
      assert.equal(unit1.value, 5);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = Unit.parse(' 5 kg ');
      assert.equal(unit1.value, 5);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = Unit.parse('5e-3kg');
      assert.equal(unit1.value, 0.005);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = Unit.parse('5e+3kg');
      assert.equal(unit1.value, 5000);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = Unit.parse('5e3kg');
      assert.equal(unit1.value, 5000);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = Unit.parse('-5kg');
      assert.equal(unit1.value, -5);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = Unit.parse('+5kg');
      assert.equal(unit1.value, 5);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = Unit.parse('.5kg');
      assert.equal(unit1.value, .5);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = Unit.parse('-5mg');
      assert.equal(unit1.value, -0.000005);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'm');

      unit1 = Unit.parse('5.2mg');
      approx.equal(unit1.value, 0.0000052);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'm');
    });

    it('should return null when parsing an invalid unit', function() {
      assert.equal(Unit.parse('.meter'), null);
      assert.equal(Unit.parse('5e'), null);
      assert.equal(Unit.parse('5e. meter'), null);
      assert.equal(Unit.parse('5e1.3 meter'), null);
      assert.equal(Unit.parse('5'), null);
      assert.equal(Unit.parse(''), null);
    });

    it('should return null when parsing an invalid type of argument', function() {
      assert.equal(Unit.parse(123), null);
    });
  });

  describe('plurals', function() {
    it('should support plurals', function () {

      var unit1 = new Unit(5, 'meters');
      assert.equal(unit1.value, 5);
      assert.equal(unit1.unit.name, 'meters');
      assert.equal(unit1.prefix.name, '');

      var unit2 = new Unit(5, 'kilometers');
      assert.equal(unit2.value, 5000);
      assert.equal(unit2.unit.name, 'meters');
      assert.equal(unit2.prefix.name, 'kilo');

      var unit3 = new Unit(5, 'inches');
      approx.equal(unit3.value, 0.127);
      assert.equal(unit3.unit.name, 'inches');
      assert.equal(unit3.prefix.name, '');

    });
  });

  describe('aliases', function() {
    it('should support aliases', function () {

      var unit1 = new Unit(5, 'lt');
      assert.equal(unit1.value, 5e-3);
      assert.equal(unit1.unit.name, 'l');
      assert.equal(unit1.prefix.name, '');

      var unit2 = new Unit(1, 'lb');
      assert.equal(unit2.value, 453.59237e-3);
      assert.equal(unit2.unit.name, 'lbm');
      assert.equal(unit2.prefix.name, '');
    });
  });

    // TODO: test the value of each of the available units...
});