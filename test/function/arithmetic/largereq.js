// test largereq
var assert = require('assert'),
    math = require('../../../math.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    largereq = math.largereq;

// parser
assert.equal(math.eval('2 >= 3'), false);
assert.equal(math.eval('2 >= 2'), true);
assert.equal(math.eval('2 >= 1'), true);
assert.equal(math.eval('largereq(2, 3)'), false);
assert.equal(math.eval('largereq(2, 2)'), true);
assert.equal(math.eval('largereq(2, 1)'), true);

// number
assert.equal(largereq(2, 3), false);
assert.equal(largereq(2, 2), true);
assert.equal(largereq(2, 1), true);
assert.equal(largereq(0, 0), true);
assert.equal(largereq(-2, 2), false);
assert.equal(largereq(-2, -3), true);
assert.equal(largereq(-3, -2), false);

// complex
assert.equal(largereq(complex(1,1), complex(1,2)), false);
assert.equal(largereq(complex(1,1), complex(1,1)), true);
assert.equal(largereq(complex(1,1), complex(2,1)), false);
assert.equal(largereq(complex(1,6), complex(7,1)), false);
assert.equal(largereq(complex(4,1), complex(2,2)), true);
assert.equal(largereq(complex(2,0), 3), false);
assert.equal(largereq(complex(2,0), 2), true);
assert.equal(largereq(complex(2,0), 1), true);
assert.equal(largereq(3, complex(2,0)), true);
assert.equal(largereq(2, complex(2,0)), true);
assert.equal(largereq(1, complex(2,0)), false);

// unit
assert.equal(largereq(unit('100cm'), unit('10inch')), true);
assert.equal(largereq(unit('99cm'), unit('1m')), false);
//assert.equal(largereq(unit('100cm'), unit('1m')), true); // dangerous, round-off errors
assert.equal(largereq(unit('101cm'), unit('1m')), true);
assert.throws(function () {largereq(unit('100cm'), 22)});

// string
assert.equal(largereq('0', 0), true);
assert.equal(largereq('abd', 'abc'), true);
assert.equal(largereq('abc', 'abc'), true);
assert.equal(largereq('abc', 'abd'), false);

// array, matrix
assert.deepEqual(largereq([1,4,6], [3,4,5]), [false, true, true]);
assert.deepEqual(largereq([1,4,6], matrix([3,4,5])), matrix([false, true, true]));
assert.throws(function () {largereq([1,4,6], [3,4])});
