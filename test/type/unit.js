// test data type Unit

var assert = require('assert');
var math = require('../../math.js');


var unit1 = math.unit(5000, 'cm');
assert.equal(unit1.toString(), '50 m');
assert.equal(math.unit(5, 'kg').toString(), '5 kg');
assert.equal(math.unit('5kg').toString(), '5 kg');
assert.equal(math.unit('5 kg').toString(), '5 kg');
assert.equal(math.unit(' 5 kg ').toString(), '5 kg');
assert.equal(math.unit('5e-3kg').toString(), '5 g');
assert.equal(math.unit('5e+3kg').toString(), '5 Mg');
assert.equal(math.unit('-5kg').toString(), '-5 kg');
assert.equal(math.unit('-5mg').toString(), '-5 mg');
assert.equal(math.unit(null, 'kg').toString(), '1 kg');

assert.throws(function () { Unit(2, 'inch'); });
assert.throws(function () { new Unit('24', 'inch'); });
assert.throws(function () { new Unit(0, 'bla'); });
assert.throws(function () { new Unit(0, 3); });

assert.equal(math.type.Unit.isPlainUnit('bla'), false);
assert.equal(math.type.Unit.isPlainUnit('cm'), true);
assert.equal(math.type.Unit.isPlainUnit('inch'), true);
assert.equal(math.type.Unit.isPlainUnit('kb'), true);
assert.equal(math.type.Unit.isPlainUnit('5cm'), false);

// test unit.in and unit.as
var u = math.unit(5000, 'cm');
assert.equal(u.toString(), '50 m');
var u2 = u.in('mm');
assert.equal(u2.toString(), '50000 mm');
assert.strictEqual(u.as('mm'), 50000);
assert.throws( function () {u.in('5mm'); });
var u3 = math.unit('5.08 cm').in('inch');
assert.equal(u3.toString(), '2 inch');
assert.strictEqual(math.format(math.unit('5.08 cm').as('inch')), '2');

// test calculation of best prefix
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

// TODO: extensively test Unit
