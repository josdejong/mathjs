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


// test multiply
assert.equal(math.multiply(2, 3), 6);
assert.equal(math.multiply(-2, 3), -6);
assert.equal(math.multiply(-2, -3), 6);
assert.equal(math.multiply(5, 0), 0);
assert.equal(math.multiply(0, 5), 0);
assert.equal(math.multiply(2, math.unit('5 mm')).toString(), '10 mm');
assert.equal(math.multiply(2, math.unit('5 mm')).toString(), '10 mm');
assert.equal(math.multiply(math.unit('5 mm'), 2).toString(), '10 mm');
assert.equal(math.multiply(math.unit('5 mm'), 0).toString(), '0 m');
var a = math.matrix([[1,2],[3,4]]);
var b = math.matrix([[5,6],[7,8]]);
var c = math.matrix([[5],[6]]);
var d = math.matrix([[5,6]]);
assert.deepEqual(math.multiply(a, 3).valueOf(), [[3,6],[9,12]]);
assert.deepEqual(math.multiply(3, a).valueOf(), [[3,6],[9,12]]);
assert.deepEqual(math.multiply(a, b).valueOf(), [[19,22],[43,50]]);
assert.deepEqual(math.multiply(a, c).valueOf(), [[17],[39]]);
assert.deepEqual(math.multiply(d, a).valueOf(), [[23,34]]);
assert.deepEqual(math.multiply(d, b).valueOf(), [[67,78]]);
assert.deepEqual(math.multiply(d, c).valueOf(), [[61]]);
assert.throws(function () {math.multiply(c, b)});

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
