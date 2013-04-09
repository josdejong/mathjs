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
var a1 = math.abs(math.matrix([1,-2,3]));
assert.ok(a1 instanceof math.type.Matrix);
assert.deepEqual(a1.size(), [3]);
assert.deepEqual(a1.valueOf(), [1,2,3]);
a1 = math.abs(math.range(-2,2));
assert.ok(a1 instanceof Array);
assert.deepEqual(a1.length, 5);
assert.deepEqual(a1, [2,1,0,1,2]);

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

var a2 = math.matrix([[1,2],[3,4]]);
var a3 = math.matrix([[5,6],[7,8]]);
var a4 = math.add(a2, a3);
assert.ok(a4 instanceof math.type.Matrix);
assert.deepEqual(a4.size(), [2,2]);
assert.deepEqual(a4.valueOf(), [[6,8],[10,12]]);
var a5 = math.pow(a2, 2);
assert.ok(a5 instanceof math.type.Matrix);
assert.deepEqual(a5.size(), [2,2]);
assert.deepEqual(a5.valueOf(), [[7,10],[15,22]]);

// TODO: test ceil
// TODO: test cube
// TODO: test divide
// TODO: test equal
// TODO: test exp
// TODO: test fix
// TODO: test floor

// test gcd
assert.equal(math.gcd(12, 8), 4);
assert.equal(math.gcd(8, 12), 4);
assert.equal(math.gcd(8, -12), 4);
assert.equal(math.gcd(-12, 8), 4);
assert.equal(math.gcd(12, -8), 4);
assert.equal(math.gcd(15, 3), 3);
assert.equal(math.gcd(3, 0), 3);
assert.equal(math.gcd(-3, 0), 3);
assert.equal(math.gcd(0, 3), 3);
assert.equal(math.gcd(0, -3), 3);
assert.equal(math.gcd(0, 0), 0);
assert.equal(math.gcd(25, 15, -10, 30), 5);
assert.throws(function () {math.gcd(1); });
assert.throws(function () {math.gcd(math.complex(1,3),2); });

// TODO: test larger
// TODO: test largereq

// test lcm
assert.equal(math.lcm(4, 6), 12);
assert.equal(math.lcm(4, -6), 12);
assert.equal(math.lcm(6, 4), 12);
assert.equal(math.lcm(-6, 4), 12);
assert.equal(math.lcm(-6, -4), 12);
assert.equal(math.lcm(21, 6), 42);
assert.equal(math.lcm(3, -4, 24), 24);


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
assert.deepEqual(math.sqrt([4,9,16,25]), [2,3,4,5]);
assert.deepEqual(math.sqrt([[4,9],[16,25]]), [[2,3],[4,5]]);


// TODO: test square
// TODO: test subtract
// TODO: test unaryminus
// TODO: test unequal