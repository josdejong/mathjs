// test arithmetic functions

var assert = require('assert');
var math = require('../../math.js');

// test abs
assert.equal(math.abs(-4.2), 4.2);
assert.equal(math.abs(-3.5), 3.5);
assert.equal(math.abs(100), 100);
assert.equal(math.abs(0), 0);
assert.equal(math.abs(math.complex(3, -4)), 5);
assert.throws(function () {
    math.abs(math.unit(5, 'km'));
});
assert.throws(function () {
    math.abs('a string');
});

// test add
assert.equal(math.add(2, 3), 5);
assert.equal(math.add(-2, 3), 1);
assert.equal(math.add(2, -3), -1);
assert.equal(math.add(-5, -3), -8);
assert.equal(math.add(math.complex(3, -4), math.complex(8, 2)), '11 - 2i');
assert.equal(math.add(math.complex(3, -4), 10), '13 - 4i');
assert.equal(math.add(10, math.complex(3, -4)), '13 - 4i');
assert.equal(math.add(math.unit(5, 'km'), math.unit(100, 'mile')).toString(), '165.9344 km');
assert.throws(function () {
    math.add(math.unit(5, 'km'), math.unit(100, 'gram'));
});
assert.equal(math.add('hello ', 'world'), 'hello world');
assert.equal(math.add('str', 123), 'str123');
assert.equal(math.add(123, 'str'), '123str');


// TODO: test ceil
// TODO: test cube
// TODO: test divide
// TODO: test equal
// TODO: test exp
// TODO: test fix
// TODO: test floor
// TODO: test larger
// TODO: test largereq
// TODO: test log
// TODO: test log10
// TODO: test mod
// TODO: test multiply
// TODO: test pow
// TODO: test round
// TODO: test sign
// TODO: test smaller
// TODO: test smallereq


// test sqrt
assert.equal(math.sqrt(25), 5);
assert.equal(math.sqrt(-4), '2i');
assert.equal(math.sqrt(0), '');
assert.equal(math.sqrt(math.complex(3, -4)), '2 - i');
assert.throws(function () {
    math.sqrt(math.unit(5, 'km'));
});
assert.throws(function () {
    math.sqrt('a string');
});

// TODO: test square
// TODO: test subtract
// TODO: test unaryminus
// TODO: test unequal
