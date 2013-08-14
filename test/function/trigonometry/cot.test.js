// test cot
var assert = require('assert'),
    math = require('../../../index.js'),
    approx = require('../../../tools/approx.js'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    cot = math.cot;

// number
approx.equal(cot(0), Infinity);
approx.equal(1 / cot(pi*1/4), 1);
approx.equal(1 / cot(pi*1/8), 0.414213562373095);
approx.equal(cot(pi*2/4), 0);
approx.equal(1 / cot(pi*3/4), -1);
approx.equal(1 / cot(pi*4/4), 0);
approx.equal(1 / cot(pi*5/4), 1);
approx.equal(cot(pi*6/4), 0);
approx.equal(1 / cot(pi*7/4), -1);
approx.equal(1 / cot(pi*8/4), 0);

// complex
var re = 0.00373971037633696;
var im = 0.99675779656935837;
approx.deepEqual(cot(complex('2+3i')), complex(-re, -im));
approx.deepEqual(cot(complex('2-3i')), complex(-re, im));
approx.deepEqual(cot(complex('-2+3i')), complex(re, -im));
approx.deepEqual(cot(complex('-2-3i')), complex(re, im));
approx.deepEqual(cot(complex('i')), complex(0, -1.313035285499331));
approx.deepEqual(cot(complex('1')), complex(0.642092615934331, 0));
approx.deepEqual(cot(complex('1+i')), complex(0.217621561854403, -0.868014142895925));

// unit
approx.equal(cot(unit('45deg')), 1);
approx.equal(cot(unit('-45deg')), -1);
assert.throws(function () {cot(unit('5 celsius'))});

// string
assert.throws(function () {cot('string')});

// array, matrix, range
var cot123 = [0.642092615934331, -0.457657554360286, -7.015252551434534];
approx.deepEqual(cot([1,2,3]), cot123);
approx.deepEqual(cot(math.range('1:4')), cot123);
approx.deepEqual(cot(matrix([1,2,3])), matrix(cot123));
