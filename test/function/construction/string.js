// test string construction
var assert = require('assert'),
    math = require('../../../math.js'),
    string = math.string;

// 0 arguments
assert.equal(string(), '');

// boolean
assert.equal(string(true), 'true');
assert.equal(string(false), 'false');

// string
assert.equal(string('hello'), 'hello');
assert.equal(string(''), '');
assert.equal(string(' '), ' ');

// number
assert.equal(string(1/8), '0.125');
assert.equal(string(2.1e-3), '0.0021');
assert.equal(string(123456789), '1.23456789e8');
assert.equal(string(2000000), '2e6');

// complex
assert.equal(string(math.complex(2,3)), '2 + 3i');

// unit
assert.equal(string(math.unit('5cm')), '50 mm');

// array, matrix, range
assert.equal(string([[1,2],[3,4]]), '[[1, 2], [3, 4]]');
assert.equal(string(math.matrix([[1,2],[3,4]])), '[[1, 2], [3, 4]]');
assert.equal(string(math.range(1,5)), '[1, 2, 3, 4, 5]');

// wrong number of arguments
assert.throws(function () {string(1,2)}, SyntaxError);
assert.throws(function () {string(1,2,3)}, SyntaxError);

