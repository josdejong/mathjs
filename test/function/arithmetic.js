// test arithmetic functions

var assert = require('assert');
var math = require('../../math.js'),
    Complex = math.type.Complex,
    Unit = math.type.Unit;

// test abs
assert.equal(math.abs(-4.2), 4.2);
assert.equal(math.abs(-3.5), 3.5);
assert.equal(math.abs(100), 100);
assert.equal(math.abs(0), 0);
assert.equal(math.abs(new Complex(3, -4)), 5);
assert.throws(function () {
    math.abs(new Unit(5, 'km'));
});
assert.throws(function () {
    math.abs('a string');
});

// test add
assert.equal(math.add(2, 3), 5);
assert.equal(math.add(-2, 3), 1);
assert.equal(math.add(2, -3), -1);
assert.equal(math.add(-5, -3), -8);
assert.equal(math.add(new Complex(3, -4), new Complex(8, 2)), '11 - 2i');
assert.equal(math.add(new Complex(3, -4), 10), '13 - 4i');
assert.equal(math.add(10, new Complex(3, -4)), '13 - 4i');
assert.equal(math.add(new Unit(5, 'km'), new Unit(100, 'mile')).toString(), '165.9344 km');
assert.throws(function () {
    math.add(new Unit(5, 'km'), new Unit(100, 'gram'));
});
assert.equal(math.add('hello ', 'world'), 'hello world');
assert.equal(math.add('str', 123), 'str123');
assert.equal(math.add(123, 'str'), '123str');


// TODO: test ceil
// TODO: test divide
// TODO: test exp
// TODO: test fix
// TODO: test floor
// TODO: test larger
// TODO: test log
// TODO: test multiply
// TODO: test pow
// TODO: test round
// TODO: test smaller


// test sqrt
assert.equal(math.sqrt(25), 5);
assert.equal(math.sqrt(-4), '2i');
assert.equal(math.sqrt(0), '');
assert.equal(math.sqrt(new Complex(3, -4)), '2 - i');
assert.throws(function () {
    math.sqrt(new Unit(5, 'km'));
});
assert.throws(function () {
    math.sqrt('a string');
});

// TODO: test subtract
// TODO: test unaryminus
