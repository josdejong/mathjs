// test csc
var assert = require('assert'),
    math = require('../../../src/index.js'),
    approx = require('../../../tools/approx.js'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    csc = math.csc;

// number
approx.equal(1 / csc(0), 0);
approx.equal(1 / csc(pi*1/4), 0.707106781186548);
approx.equal(1 / csc(pi*1/8), 0.382683432365090);
approx.equal(1 / csc(pi*2/4), 1);
approx.equal(1 / csc(pi*3/4), 0.707106781186548);
approx.equal(1 / csc(pi*4/4), 0);
approx.equal(1 / csc(pi*5/4), -0.707106781186548);
approx.equal(1 / csc(pi*6/4), -1);
approx.equal(1 / csc(pi*7/4), -0.707106781186548);
approx.equal(1 / csc(pi*8/4), 0);
approx.equal(1 / csc(pi/4), math.sqrt(2)/2);

// complex
var re = 0.0904732097532074;
var im = 0.0412009862885741;
approx.deepEqual(csc(complex('2+3i')), complex(re, im));
approx.deepEqual(csc(complex('2-3i')), complex(re, -im));
approx.deepEqual(csc(complex('-2+3i')), complex(-re, im));
approx.deepEqual(csc(complex('-2-3i')), complex(-re, -im));
approx.deepEqual(csc(complex('i')), complex(0, -0.850918128239322));
approx.deepEqual(csc(complex('1')), 1.18839510577812);
approx.deepEqual(csc(complex('1+i')), complex(0.621518017170428, -0.303931001628426));

// unit
approx.equal(csc(unit('45deg')), 1.41421356237310);
approx.equal(csc(unit('-45deg')), -1.41421356237310);
assert.throws(function () {csc(unit('5 celsius'))});

// string
assert.throws(function () {csc('string')});

// array, matrix, range
var csc123 = [1.18839510577812, 1.09975017029462, 7.08616739573719];
approx.deepEqual(csc([1,2,3]), csc123);
approx.deepEqual(csc(math.range('1:4')), csc123);
approx.deepEqual(csc(matrix([1,2,3])), matrix(csc123));
