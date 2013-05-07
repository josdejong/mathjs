// test cube
var assert = require('assert'),
    math = require('../../../math.js'),
    unit = math.unit,
    matrix = math.matrix,
    range = math.range,
    cube = math.cube;

// parser
assert.equal(math.eval('cube(4)'), 64);

// number
assert.equal(cube(4), 64);
assert.equal(cube(-2), -8);
assert.equal(cube(0), 0);
assert.throws(function () {cube()}, SyntaxError, 'Wrong number of arguments in function cube (0 provided, 1 expected)');
assert.throws(function () {cube(1, 2)}, SyntaxError, 'Wrong number of arguments in function cube (2 provided, 1 expected)');

// complex
assert.deepEqual(cube(math.complex('2i')), math.complex('-8i'));
assert.deepEqual(cube(math.complex('2+3i')), math.complex('-46+9i'));
assert.deepEqual(cube(math.complex('2')), math.complex('8'));

// unit
assert.throws(function () {cube(unit('5cm'))});

// string
assert.throws(function () {cube('text')});

// array, matrix, range
// arrays are evaluated element wise
assert.deepEqual(cube([2,3,4,5]), [8,27,64,125]);
assert.deepEqual(cube(range(2,5)), [8,27,64,125]);
assert.deepEqual(cube(matrix([2,3,4,5])), matrix([8,27,64,125]));
assert.deepEqual(cube(matrix([[1,2],[3,4]])), matrix([[1,8],[27,64]]));
