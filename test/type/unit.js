// test data type Unit

var assert = require('assert');
var math = require('../../math.js'),
    Complex = math.type.Complex,
    Unit = math.type.Unit;


var unit1 = new Unit(5000, 'cm');
assert.equal(unit1, '50 m');

assert.throws(function () {
    Unit(2, 'inch');
});

// TODO: extensively test Unit
