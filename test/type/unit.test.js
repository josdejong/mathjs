var assert = require('assert');
var math = require('../../index.js');

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
      assert.strictEqual(u.toNumber('mm'), 50000);

      assert.strictEqual(math.format(math.unit('5.08 cm').toNumber('inch')), '2');
    });
  });

  describe('toString', function() {

    it('should convert to string properly', function() {
      assert.equal(math.unit(5000, 'cm').toString(), '50 m');
      assert.equal(math.unit(5, 'kg').toString(), '5 kg');
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

    // TODO: extensively test Unit
});