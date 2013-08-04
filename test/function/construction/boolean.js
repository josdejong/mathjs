// test bool construction
var assert = require('assert'),
    math = require('../../../dist/math.js'),
    bool = math.boolean;

// parser
assert.equal(math.eval('boolean("true")'), true);
assert.equal(math.eval('boolean("false")'), false);
assert.equal(math.eval('boolean(true)'), true);
assert.equal(math.eval('boolean(false)'), false);
assert.equal(math.eval('boolean(1)'), true);
assert.equal(math.eval('boolean(2)'), true);
assert.equal(math.eval('boolean(0)'), false);

// bool input
assert.equal(bool(true), true);
assert.equal(bool(false), false);

// bool input
assert.equal(bool(-2), true);
assert.equal(bool(-1), true);
assert.equal(bool(0), false);
assert.equal(bool(1), true);
assert.equal(bool(2), true);

// string input
assert.equal(bool('2'), true);
assert.equal(bool(' 4e2 '), true);
assert.equal(bool(' -4e2 '), true);
assert.equal(bool('0'), false);
assert.equal(bool(' 0 '), false);
assert.throws(function () {bool('')}, SyntaxError);
assert.throws(function () {bool('23a')}, SyntaxError);

// wrong bool of arguments
assert.throws(function () {bool(1,2)}, SyntaxError);
assert.throws(function () {bool(1,2,3)}, SyntaxError);

// wrong type of arguments
assert.throws(function () {bool(math.complex(2,3))}, SyntaxError);
assert.throws(function () {bool(math.unit('5cm'))}, SyntaxError);
assert.throws(function () {bool(math.range(1,3))}, SyntaxError);
assert.throws(function () {bool(math.matrix([1,3]))}, SyntaxError);
assert.throws(function () {bool([1,3])}, SyntaxError);
