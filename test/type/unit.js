// test data type Unit

var assert = require('assert');
var math = require('../../math.js'),
    Complex = math.Complex,
    Unit = math.Unit;


var unit1 = new Unit(5000, 'cm');
assert.equal(unit1.toString(), '50 m');
assert.equal(new Unit(5, 'kg').toString(), '5 kg');
assert.equal(new Unit('5kg').toString(), '5 kg');
assert.equal(new Unit('5 kg').toString(), '5 kg');
assert.equal(new Unit(' 5 kg ').toString(), '5 kg');
assert.equal(new Unit('5e-3kg').toString(), '5 g');
assert.equal(new Unit('5e+3kg').toString(), '5 Mg');
assert.equal(new Unit('-5kg').toString(), '-5 kg');
assert.equal(new Unit('-5mg').toString(), '-5 mg');
assert.equal(new Unit(null, 'kg').toString(), '1 kg');

assert.throws(function () {
    Unit(2, 'inch');
});

// TODO: extensively test Unit
