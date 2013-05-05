// test equal
var assert = require('assert');
var math = require('../../../math.js');

// parser
assert.equal(math.eval('2 == 3'), false);
assert.equal(math.eval('2 == 2'), true);
assert.equal(math.eval('equal(2, 3)'), false);
assert.equal(math.eval('equal(2, 2)'), true);

// number
assert.equal(math.equal(2, 3), false);
assert.equal(math.equal(2, 2), true);
assert.equal(math.equal(0, 0), true);
assert.equal(math.equal(-2, 2), false);

// complex
assert.equal(math.equal(math.complex(2,3), math.complex(2,4)), false);
assert.equal(math.equal(math.complex(2,3), math.complex(2,3)), true);
assert.equal(math.equal(math.complex(1,3), math.complex(2,3)), false);
assert.equal(math.equal(math.complex(1,3), math.complex(2,4)), false);
assert.equal(math.equal(math.complex(2,0), 2), true);
assert.equal(math.equal(math.complex(2,0), 3), false);

// unit
assert.equal(math.equal(math.unit('100cm'), math.unit('10inch')), false);
assert.equal(math.equal(math.unit('100cm'), math.unit('1m')), true);
//assert.equal(math.equal(math.unit('12inch'), math.unit('1foot')), true); // TODO: round-off error :(
//assert.equal(math.equal(math.unit('2.54cm'), math.unit('1inch')), true); // TODO: round-off error :(
assert.throws(function () {math.equal(math.unit('100cm'), 22)});

// string
assert.equal(math.equal('0', 0), true);
assert.equal(math.equal('Hello', 'hello'), false);
assert.equal(math.equal('hello', 'hello'), true);

// array, matrix
assert.deepEqual(math.equal([1,4,5], [3,4,5]), [false, true, true]);
assert.deepEqual(math.equal([1,4,5], math.matrix([3,4,5])), math.matrix([false, true, true]));
assert.throws(function () {math.equal([1,4,5], [3,4])});
