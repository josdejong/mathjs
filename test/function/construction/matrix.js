// test matrix construction
var assert = require('assert'),
    math = require('../../../math.js'),
    matrix = math.matrix;

// 0 arguments
var a = matrix();
assert.ok(a instanceof math.type.Matrix);
assert.deepEqual(math.size(a), [0]); // TODO: wouldn't it be nicer if an empty matrix has zero dimensions?


// 1 argument
var b = matrix([[1,2],[3,4]]);
assert.ok(b instanceof math.type.Matrix);
assert.deepEqual(b, new math.type.Matrix([[1,2],[3,4]]));
assert.deepEqual(math.size(b), [2,2]);

var c = matrix(b);
assert.ok(c._data != b._data); // data should be cloned
assert.deepEqual(c, new math.type.Matrix([[1,2],[3,4]]));
assert.deepEqual(math.size(c), [2,2]);

var d = matrix(math.range(1,5));
assert.ok(d instanceof math.type.Matrix);
assert.deepEqual(d, new math.type.Matrix([1,2,3,4,5]));
assert.deepEqual(math.size(d), [5]);

assert.throws(function () {matrix(123)}, TypeError);
assert.throws(function () {matrix(math.unit('5cm'))}, TypeError);

// more than 1 argument
assert.throws(function () {matrix(2, 3)}, SyntaxError);
