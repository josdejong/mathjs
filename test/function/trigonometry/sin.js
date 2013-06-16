// test sin
var assert = require('assert'),
    math = require('../../../math.js'),
    approx = require('../../../tools/approx.js'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    sin = math.sin;

// number
approx.equal(sin(0), 0);
approx.equal(sin(pi*1/4), 0.707106781186548);
approx.equal(sin(pi*1/8), 0.382683432365090);
approx.equal(sin(pi*2/4), 1);
approx.equal(sin(pi*3/4), 0.707106781186548);
approx.equal(sin(pi*4/4), 0);
approx.equal(sin(pi*5/4), -0.707106781186548);
approx.equal(sin(pi*6/4), -1);
approx.equal(sin(pi*7/4), -0.707106781186548);
approx.equal(sin(pi*8/4), 0);
approx.equal(sin(pi/4), math.sqrt(2)/2);

// complex
var re = 9.15449914691143,
    im = 4.16890695996656;
approx.deepEqual(sin(complex('2+3i')), complex(re, -im));
approx.deepEqual(sin(complex('2-3i')), complex(re, im));
approx.deepEqual(sin(complex('-2+3i')), complex(-re, -im));
approx.deepEqual(sin(complex('-2-3i')), complex(-re, im));
approx.deepEqual(sin(complex('i')), complex(0, 1.175201193643801));
approx.deepEqual(sin(complex('1')), 0.841470984807897);
approx.deepEqual(sin(complex('1+i')), complex(1.298457581415977, 0.634963914784736));

// unit
approx.equal(sin(unit('45deg')), 0.707106781186548);
approx.equal(sin(unit('-45deg')), -0.707106781186548);
assert.throws(function () {sin(unit('5 celsius'))});

// string
assert.throws(function () {sin('string')});

// array, matrix, range
var sin123 = [0.84147098480789, 0.909297426825682, 0.141120008059867];
approx.deepEqual(sin([1,2,3]), sin123);
approx.deepEqual(sin(math.range('1:3')), sin123);
approx.deepEqual(sin(matrix([1,2,3])), matrix(sin123));
