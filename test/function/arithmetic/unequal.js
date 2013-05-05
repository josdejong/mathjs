// test unequal
var assert = require('assert');
var math = require('../../../math.js');

// parser
assert.equal(math.eval('2 != 3'), true);
assert.equal(math.eval('2 != 2'), false);
assert.equal(math.eval('unequal(2, 3)'), true);
assert.equal(math.eval('unequal(2, 2)'), false);

// number
assert.equal(math.unequal(2, 3), true);
assert.equal(math.unequal(2, 2), false);
assert.equal(math.unequal(0, 0), false);
assert.equal(math.unequal(-2, 2), true);

// complex
assert.equal(math.unequal(math.complex(2,3), math.complex(2,4)), true);
assert.equal(math.unequal(math.complex(2,3), math.complex(2,3)), false);
assert.equal(math.unequal(math.complex(1,3), math.complex(2,3)), true);
assert.equal(math.unequal(math.complex(1,3), math.complex(2,4)), true);
assert.equal(math.unequal(math.complex(2,0), 2), false);
assert.equal(math.unequal(math.complex(2,0), 3), true);

// unit
assert.equal(math.unequal(math.unit('100cm'), math.unit('10inch')), true);
assert.equal(math.unequal(math.unit('100cm'), math.unit('1m')), false);
//assert.equal(math.unequal(math.unit('12inch'), math.unit('1foot')), false); // TODO: round-off error :(
//assert.equal(math.unequal(math.unit('2.54cm'), math.unit('1inch')), false); // TODO: round-off error :(
assert.throws(function () {math.unequal(math.unit('100cm'), 22)});

// string
assert.equal(math.unequal('0', 0), false);
assert.equal(math.unequal('Hello', 'hello'), true);
assert.equal(math.unequal('hello', 'hello'), false);

// array, matrix
assert.deepEqual(math.unequal([1,4,5], [3,4,5]), [true, false, false]);
assert.deepEqual(math.unequal([1,4,5], math.matrix([3,4,5])), math.matrix([true, false, false]));
assert.throws(function () {math.unequal([1,4,5], [3,4])});
