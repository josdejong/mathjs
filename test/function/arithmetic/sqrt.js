// test sqrt
var assert = require('assert');
var math = require('../../../math.js');

// parser
assert.equal(math.eval('sqrt(25)'), 5);

// number
assert.equal(math.sqrt(25), 5);
assert.equal(math.sqrt(-4), '2i');
assert.equal(math.sqrt(0), '');

// complex
assert.equal(math.sqrt(math.complex(3, -4)), '2 - i');

// unit
assert.throws(function () {
    math.sqrt(math.unit(5, 'km'));
});

// string
assert.throws(function () {
    math.sqrt('a string');
});

// array
assert.deepEqual(math.sqrt([4,9,16,25]), [2,3,4,5]);
assert.deepEqual(math.sqrt([[4,9],[16,25]]), [[2,3],[4,5]]);
// TODO: matrix, range
