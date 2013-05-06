// test larger
var assert = require('assert'),
    math = require('../../../math.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    larger = math.larger;

// parser
assert.equal(math.eval('2 > 3'), false);
assert.equal(math.eval('2 > 2'), false);
assert.equal(math.eval('2 > 1'), true);
assert.equal(math.eval('larger(2, 3)'), false);
assert.equal(math.eval('larger(2, 2)'), false);
assert.equal(math.eval('larger(2, 1)'), true);

// number
assert.equal(larger(2, 3), false);
assert.equal(larger(2, 2), false);
assert.equal(larger(2, 1), true);
assert.equal(larger(0, 0), false);
assert.equal(larger(-2, 2), false);
assert.equal(larger(-2, -3), true);
assert.equal(larger(-3, -2), false);

// complex
assert.equal(larger(complex(1,1), complex(1,2)), false);
assert.equal(larger(complex(1,1), complex(1,1)), false);
assert.equal(larger(complex(1,1), complex(2,1)), false);
assert.equal(larger(complex(1,6), complex(7,1)), false);
assert.equal(larger(complex(4,1), complex(2,2)), true);
assert.equal(larger(complex(2,0), 3), false);
assert.equal(larger(complex(2,0), 2), false);
assert.equal(larger(complex(2,0), 1), true);
assert.equal(larger(3, complex(2,0)), true);
assert.equal(larger(2, complex(2,0)), false);
assert.equal(larger(1, complex(2,0)), false);

// unit
assert.equal(larger(unit('100cm'), unit('10inch')), true);
assert.equal(larger(unit('99cm'), unit('1m')), false);
//assert.equal(larger(unit('100cm'), unit('1m')), false); // dangerous, round-off errors
assert.equal(larger(unit('101cm'), unit('1m')), true);
assert.throws(function () {larger(unit('100cm'), 22)});

// string
assert.equal(larger('0', 0), false);
assert.equal(larger('abd', 'abc'), true);
assert.equal(larger('abc', 'abc'), false);
assert.equal(larger('abc', 'abd'), false);

// array, matrix
assert.deepEqual(larger([1,4,6], [3,4,5]), [false, false, true]);
assert.deepEqual(larger([1,4,6], matrix([3,4,5])), matrix([false, false, true]));
assert.throws(function () {larger([1,4,6], [3,4])});
