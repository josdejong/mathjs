// test divide
var assert = require('assert');
var math = require('../../../math.js');

// TODO: test parser

// number
assert.equal(math.divide(4, 2), 2);
assert.equal(math.divide(-4, 2), -2);
assert.equal(math.divide(4, -2), -2);
assert.equal(math.divide(-4, -2), 2);
assert.equal(math.divide(4, 0), Infinity);
assert.equal(math.divide(0, -5), 0);
assert.ok(isNaN(math.divide(0, 0)));

// wrong arguments
assert.throws(function () {math.divide(2,3,4); });
assert.throws(function () {math.divide(2); });

// complex
assert.deepEqual(math.divide(math.complex('2+3i'), 2), math.complex('1+1.5i'));
assert.deepEqual(math.divide(math.complex('2+3i'), math.complex('4i')), math.complex('0.75 - 0.5i'));
assert.deepEqual(math.divide(math.complex('2i'), math.complex('4i')), math.complex('0.5'));
assert.deepEqual(math.divide(4, math.complex('1+2i')), math.complex('0.8 - 1.6i'));

// unit
assert.equal(math.divide(math.unit('5 m'), 10).toString(), '500 mm');
assert.throws(function () {math.divide(10, math.unit('5 m')).toString()});

// matrix, array, range
assert.deepEqual(math.divide(math.range(2,2,6), 2), [1,2,3]);
a  = math.matrix([[1,2],[3,4]]);
assert.deepEqual(math.divide(a, 2), math.matrix([[0.5,1],[1.5,2]]));
assert.deepEqual(math.divide(a.valueOf(), 2), [[0.5,1],[1.5,2]]);
assert.deepEqual(math.divide([], 2), []);
assert.deepEqual(math.divide([], 2), []);
assert.deepEqual(math.format(math.divide(1, [
    [ 1, 4,  7],
    [ 3, 0,  5],
    [-1, 9, 11]
])), math.format([
    [ 5.625, -2.375, -2.5],
    [ 4.75,  -2.25,  -2],
    [-3.375,  1.625,  1.5]
]));
a = math.matrix([[1,2],[3,4]]);
b = math.matrix([[5,6],[7,8]]);
assert.deepEqual(math.divide(a, b), math.matrix([[3,-2], [2,-1]]));
assert.throws(function () {math.divide(a, [[1]])});

