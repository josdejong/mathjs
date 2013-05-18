// test range construction
var assert = require('assert'),
    math = require('../../../math.js'),
    range = math.range;


// 1 argument
assert.deepEqual(range('1:5').valueOf(), [1,2,3,4,5]);
assert.deepEqual(range('0:2:8').valueOf(), [0,2,4,6,8]);
assert.deepEqual(range('5:-1:1').valueOf(), [5,4,3,2,1]);
assert.deepEqual(range('2:-2:-2').valueOf(), [2,0,-2]);

var a = range(1,5);
var b = range(a);
a.start = 3;
assert.deepEqual(a.valueOf(), [3,4,5]);
assert.deepEqual(b.valueOf(), [1,2,3,4,5]);

assert.throws(function () {range('invalid range')}, SyntaxError);

assert.throws(function () {range(2)}, TypeError);
assert.throws(function () {range(math.unit('5cm'))}, TypeError);
assert.throws(function () {range(math.complex(2,3))}, TypeError);

// 2 arguments
assert.deepEqual(range(1,5).valueOf(), [1,2,3,4,5]);
assert.deepEqual(range(5,1).valueOf(), []);

assert.throws(function () {range(2, 'string')}, TypeError);
assert.throws(function () {range(math.unit('5cm'), 2)}, TypeError);
assert.throws(function () {range(2, math.complex(2,3))}, TypeError);

// 3 arguments
assert.deepEqual(range(0,2,8).valueOf(), [0,2,4,6,8]);
assert.deepEqual(range(5,-1,1).valueOf(), [5,4,3,2,1]);
assert.deepEqual(range(2,-2,-2).valueOf(), [2,0,-2]);

assert.throws(function () {range(2, 'string', 3)}, TypeError);
assert.throws(function () {range(2, 1, math.unit('5cm'))}, TypeError);
assert.throws(function () {range(math.complex(2,3), 1, 3)}, TypeError);

// 0 or 4+ arguments
assert.throws(function () {range()}, SyntaxError);
assert.throws(function () {range(1,2,3,4)}, SyntaxError);
