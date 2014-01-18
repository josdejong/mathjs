var assert = require('assert'),
    approx = require('../../tools/approx'),
    math = require('../../index')();

describe('unit', function() {

  describe('constructor', function() {

    it('should create unit correctly', function() {
      var unit1 = math.unit(5000, 'cm');
      assert.equal(unit1.value, 50);
      assert.equal(unit1.unit.name, 'm');

      unit1 = math.unit(5, 'kg');
      assert.equal(unit1.value, 5);
      assert.equal(unit1.unit.name, 'g');

      unit1 = math.unit(null, 'kg');
      assert.equal(unit1.value, null);
      assert.equal(unit1.unit.name, 'g');
    });

    it('should create square meter correctly', function() {
      var unit1 = math.unit(0.000001, 'km2');
      assert.equal(unit1.value, 1);
      assert.equal(unit1.unit.name, 'm2');
    });

    it('should create cubic meter correctly', function() {
      var unit1 = math.unit(0.000000001, 'km3');
      assert.equal(unit1.value, 1);
      assert.equal(unit1.unit.name, 'm3');
    });

    it('should throw an error if called with wrong arguments', function() {
      assert.throws(function () { Unit(2, 'inch'); });
      assert.throws(function () { new Unit('24', 'inch'); });
      assert.throws(function () { new Unit(0, 'bla'); });
      assert.throws(function () { new Unit(0, 3); });
    });

  });

  describe('isPlainUnit', function() {

    it('should return true if the string is a plain unit', function() {
      assert.equal(math.type.Unit.isPlainUnit('cm'), true);
      assert.equal(math.type.Unit.isPlainUnit('inch'), true);
      assert.equal(math.type.Unit.isPlainUnit('kb'), true);
    });

    it('should return false if the unit is not a plain unit', function() {
      assert.equal(math.type.Unit.isPlainUnit('bla'), false);
      assert.equal(math.type.Unit.isPlainUnit('5cm'), false);  
    });

  });

  describe('toNumber', function() {
    it ('convert a unit to a number', function () {
      var u = math.unit(5000, 'cm');
      approx.equal(u.toNumber('mm'), 50000);

      approx.equal(math.unit('5.08 cm').toNumber('inch'), 2);
    });
  });

  describe('toString', function() {

    it('should convert to string properly', function() {
      assert.equal(math.unit(5000, 'cm').toString(), '50 m');
      assert.equal(math.unit(5, 'kg').toString(), '5 kg');
      assert.equal(math.unit(2/3, 'm').toString(), '0.6666666666666666 m');
    });

    it('should render with the best prefix', function() {
      assert.equal(math.unit('0.001m').toString(), '1 mm');
      assert.equal(math.unit('0.01m').toString(), '10 mm');
      assert.equal(math.unit('0.1m').toString(), '100 mm');
      assert.equal(math.unit('0.5m').toString(), '500 mm');
      assert.equal(math.unit('0.6m').toString(), '0.6 m');
      assert.equal(math.unit('1m').toString(), '1 m');
      assert.equal(math.unit('10m').toString(), '10 m');
      assert.equal(math.unit('100m').toString(), '100 m');
      assert.equal(math.unit('300m').toString(), '300 m');
      assert.equal(math.unit('500m').toString(), '500 m');
      assert.equal(math.unit('600m').toString(), '0.6 km');
      assert.equal(math.unit('1000m').toString(), '1 km');
    });

  });

  describe('format', function () {

    it('should format units with given precision', function() {
      assert.equal(math.unit(2/3, 'm').format(3), '0.667 m');
      assert.equal(math.unit(2/3, 'm').format(4), '0.6667 m');
      assert.equal(math.unit(2/3, 'm').format(), '0.6666666666666666 m');
    });

  });

  describe('parse', function() {

    it('should parse units correctly', function() {
      var unit1;

      unit1 = math.unit('5kg');
      assert.equal(unit1.value, 5);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = math.unit('5 kg');
      assert.equal(unit1.value, 5);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = math.unit(' 5 kg ');
      assert.equal(unit1.value, 5);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = math.unit('5e-3kg');
      assert.equal(unit1.value, 0.005);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = math.unit('5e+3kg');
      assert.equal(unit1.value, 5000);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = math.unit('-5kg');
      assert.equal(unit1.value, -5);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'k');

      unit1 = math.unit('-5mg');
      assert.equal(unit1.value, -0.000005);
      assert.equal(unit1.unit.name, 'g');
      assert.equal(unit1.prefix.name, 'm');

    });

  });

  describe('plurals', function() {
    it('should support plurals', function () {

      var unit1 = math.unit('5 meters');
      assert.equal(unit1.value, 5);
      assert.equal(unit1.unit.name, 'meters');
      assert.equal(unit1.prefix.name, '');

      var unit2 = math.unit('5 kilometers');
      assert.equal(unit2.value, 5000);
      assert.equal(unit2.unit.name, 'meters');
      assert.equal(unit2.prefix.name, 'kilo');

      var unit3 = math.unit('5 inches');
      approx.equal(unit3.value, 0.127);
      assert.equal(unit3.unit.name, 'inches');
      assert.equal(unit3.prefix.name, '');

    });
  });

  describe('aliases', function() {
    it('should support aliases', function () {

      var unit1 = math.unit('5 lt');
      assert.equal(unit1.value, 5e-3);
      assert.equal(unit1.unit.name, 'l');
      assert.equal(unit1.prefix.name, '');

      var unit2 = math.unit('1 lb');
      assert.equal(unit2.value, 453.59237e-3);
      assert.equal(unit2.unit.name, 'lbm');
      assert.equal(unit2.prefix.name, '');
    });
  });

    // TODO: extensively test Unit
});