// test square
var assert = require('assert'),
    math = require('../../../dist/math.js'),
    unit = math.unit,
    matrix = math.matrix,
    range = math.range,
    square = math.square;

// parser
assert.equal(math.eval('square(4)'), 16);

// number
assert.equal(square(4), 16);
assert.equal(square(-2), 4);
assert.equal(square(0), 0);
assert.throws(function () {square()}, SyntaxError, 'Wrong number of arguments in function square (0 provided, 1 expected)');
assert.throws(function () {square(1, 2)}, SyntaxError, 'Wrong number of arguments in function square (2 provided, 1 expected)');

// complex
assert.deepEqual(square(math.complex('2i')), -4);
assert.deepEqual(square(math.complex('2+3i')), math.complex('-5+12i'));
assert.deepEqual(square(math.complex('2')), 4);

// unit
assert.throws(function () {square(unit('5cm'))});

// string
assert.throws(function () {square('text')});

// array, matrix, range
// arrays are evaluated element wise
assert.deepEqual(square([2,3,4,5]), [4,9,16,25]);
assert.deepEqual(square(range(2,5)), [4,9,16,25]);
assert.deepEqual(square(matrix([2,3,4,5])), matrix([4,9,16,25]));
assert.deepEqual(square(matrix([[1,2],[3,4]])), matrix([[1,4],[9,16]]));
