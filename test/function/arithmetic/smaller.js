// test smaller
var assert = require('assert'),
    math = require('../../../dist/math.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    smaller = math.smaller;

// parser
assert.equal(math.eval('2 < 3'), true);
assert.equal(math.eval('2 < 2'), false);
assert.equal(math.eval('2 < 1'), false);
assert.equal(math.eval('smaller(2, 3)'), true);
assert.equal(math.eval('smaller(2, 2)'), false);
assert.equal(math.eval('smaller(2, 1)'), false);

// number
assert.equal(smaller(2, 3), true);
assert.equal(smaller(2, 2), false);
assert.equal(smaller(2, 1), false);
assert.equal(smaller(0, 0), false);
assert.equal(smaller(-2, 2), true);
assert.equal(smaller(-2, -3), false);
assert.equal(smaller(-3, -2), true);

// complex
assert.equal(smaller(complex(1,1), complex(1,2)), true);
assert.equal(smaller(complex(1,1), complex(1,1)), false);
assert.equal(smaller(complex(1,1), complex(2,1)), true);
assert.equal(smaller(complex(1,6), complex(7,1)), true);
assert.equal(smaller(complex(4,1), complex(2,2)), false);
assert.equal(smaller(complex(2,0), 3), true);
assert.equal(smaller(complex(2,0), 2), false);
assert.equal(smaller(complex(2,0), 1), false);
assert.equal(smaller(3, complex(2,0)), false);
assert.equal(smaller(2, complex(2,0)), false);
assert.equal(smaller(1, complex(2,0)), true);

// unit
assert.equal(smaller(unit('100cm'), unit('10inch')), false);
assert.equal(smaller(unit('99cm'), unit('1m')), true);
//assert.equal(smaller(unit('100cm'), unit('1m')), false); // dangerous, round-off errors
assert.equal(smaller(unit('101cm'), unit('1m')), false);
assert.throws(function () {smaller(unit('100cm'), 22)});

// string
assert.equal(smaller('0', 0), false);
assert.equal(smaller('abd', 'abc'), false);
assert.equal(smaller('abc', 'abc'), false);
assert.equal(smaller('abc', 'abd'), true);

// array, matrix
assert.deepEqual(smaller([1,4,6], [3,4,5]), [true, false, false]);
assert.deepEqual(smaller([1,4,6], matrix([3,4,5])), matrix([true, false, false]));
assert.throws(function () {smaller([1,4,6], [3,4])});
