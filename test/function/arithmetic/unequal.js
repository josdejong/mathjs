// test equal
var assert = require('assert'),
    math = require('../../../math.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    unequal = math.unequal;

// parser
assert.equal(math.eval('2 != 3'), true);
assert.equal(math.eval('2 != 2'), false);
assert.equal(math.eval('unequal(2, 3)'), true);
assert.equal(math.eval('unequal(2, 2)'), false);

// number
assert.equal(unequal(2, 3), true);
assert.equal(unequal(2, 2), false);
assert.equal(unequal(0, 0), false);
assert.equal(unequal(-2, 2), true);

// complex
assert.equal(unequal(complex(2,3), complex(2,4)), true);
assert.equal(unequal(complex(2,3), complex(2,3)), false);
assert.equal(unequal(complex(1,3), complex(2,3)), true);
assert.equal(unequal(complex(1,3), complex(2,4)), true);
assert.equal(unequal(complex(2,0), 2), false);
assert.equal(unequal(complex(2,1), 2), true);
assert.equal(unequal(2, complex(2, 0)), false);
assert.equal(unequal(2, complex(2, 1)), true);
assert.equal(unequal(complex(2,0), 3), true);

// unit
assert.equal(unequal(unit('100cm'), unit('10inch')), true);
assert.equal(unequal(unit('100cm'), unit('1m')), false);
//assert.equal(unequal(unit('12inch'), unit('1foot')), false); // TODO: round-off error :(
//assert.equal(unequal(unit('2.54cm'), unit('1inch')), false); // TODO: round-off error :(
assert.throws(function () {unequal(unit('100cm'), 22)});

// string
assert.equal(unequal('0', 0), false);
assert.equal(unequal('Hello', 'hello'), true);
assert.equal(unequal('hello', 'hello'), false);

// array, matrix
assert.deepEqual(unequal([1,4,5], [3,4,5]), [true, false, false]);
assert.deepEqual(unequal([1,4,5], matrix([3,4,5])), matrix([true, false, false]));
assert.throws(function () {unequal([1,4,5], [3,4])});
