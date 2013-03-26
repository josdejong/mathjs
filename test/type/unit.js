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

assert.throws(function () {
    Unit(2, 'inch');
});

// TODO: extensively test Unit
