// test cube
var assert = require('assert');
var math = require('../../../math.js');

// TODO: test cube

// parser

// number
assert.equal(math.cube(4), 64);

// complex
assert.deepEqual(math.cube(math.complex('2i')), math.complex('-8i'));

// unit

// string

// matrix, array
assert.deepEqual(math.cube([2,3,4,5]), [8,27,64,125]);
