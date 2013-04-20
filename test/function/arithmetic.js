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
assert.equal(math.add(math.unit(5, 'km'), math.unit(100, 'mile')).toString(), '165.93 km');
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

// test cube
assert.equal(math.cube(4), 64);
assert.deepEqual(math.cube(math.complex('2i')), math.complex('-8i'));
assert.deepEqual(math.cube([2,3,4,5]), [8,27,64,125]);
// TODO: test cube

// test divide
assert.equal(math.divide(4, 2), 2);
assert.equal(math.divide(-4, 2), -2);
assert.equal(math.divide(4, -2), -2);
assert.equal(math.divide(-4, -2), 2);
assert.equal(math.divide(4, 0), Infinity);
assert.equal(math.divide(0, -5), 0);
assert.ok(isNaN(math.divide(0, 0)));
assert.throws(function () {math.divide(2,3,4); });
assert.throws(function () {math.divide(2); });

assert.deepEqual(math.divide(math.complex('2+3i'), 2), math.complex('1+1.5i'));
assert.deepEqual(math.divide(math.complex('2+3i'), math.complex('4i')), math.complex('0.75 - 0.5i'));
assert.deepEqual(math.divide(math.complex('2i'), math.complex('4i')), math.complex('0.5'));
assert.deepEqual(math.divide(4, math.complex('1+2i')), math.complex('0.8 - 1.6i'));

assert.equal(math.divide(math.unit('5 m'), 10).toString(), '500 mm');
assert.throws(function () {math.divide(10, math.unit('5 m')).toString()});

assert.deepEqual(math.divide(math.range(2,2,6), 2), [1,2,3]);
a  = math.matrix([[1,2],[3,4]]);
assert.deepEqual(math.divide(a, 2), math.matrix([[0.5,1],[1.5,2]]));
assert.deepEqual(math.divide(a.valueOf(), 2), [[0.5,1],[1.5,2]]);
assert.deepEqual(math.divide([], 2), []);
assert.deepEqual(math.divide([], 2), []);
assert.deepEqual(math.format(math.divide(1, [
    [ 1, 4,  7],
    [ 3, 0,  5],
    [-1, 9, 11]
])), math.format([
    [ 5.625, -2.375, -2.5],
    [ 4.75,  -2.25,  -2],
    [-3.375,  1.625,  1.5]
]));
a = math.matrix([[1,2],[3,4]]);
b = math.matrix([[5,6],[7,8]]);
assert.deepEqual(math.divide(a, b), math.matrix([[3,-2], [2,-1]]));
assert.throws(function () {math.divide(a, [[1]])});


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

// test round
assert.equal(math.round(math.pi), 3);
assert.equal(math.round(math.pi * 1000), 3142);
assert.equal(math.round(math.pi, 3), 3.142);
assert.equal(math.round(math.pi, 6), 3.141593);
assert.equal(math.round(1234.5678, 2), 1234.57);
assert.deepEqual(math.round(math.range(0,1/3,2), 2), [0,0.33,0.67,1,1.33,1.67,2]);
assert.deepEqual(math.round(math.range(0,1/3,2)), [0,0,1,1,1,2,2]);
assert.deepEqual(math.round([1.7,2.3]), [2,2]);
assert.deepEqual(math.round(math.matrix([1.7,2.3])).valueOf(), [2, 2]);
assert.throws(function () { math.round("hello world"); });
assert.throws(function () { math.round(math.unit('5cm')); });

// test sign
assert.equal(math.sign(3), 1);
assert.equal(math.sign(-3), -1);
assert.equal(math.sign(0), 0);
assert.equal(math.sign(math.complex(2,-3)).toString(), '0.5547 - 0.83205i');
assert.deepEqual(math.sign(math.range(-2,2)), [-1,-1,0,1,1]);
assert.deepEqual(math.sign(math.matrix(math.range(-2,2))).valueOf(), [-1,-1,0,1,1]);
assert.throws(function () { math.sign("hello world"); });
assert.throws(function () { math.sign(math.unit('5cm')); });


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


// test square
assert.equal(math.square(4), 16);
assert.equal(math.square(math.complex('2i')), -4);
assert.deepEqual(math.square([2,3,4,5]), [4,9,16,25]);
assert.deepEqual(math.square([[2,3],[4,5]]), [[4,9],[16,25]]);
// TODO: test square

// test subtract
assert.deepEqual(math.subtract(4, 2), 2);
assert.deepEqual(math.subtract(2, 4), -2);
assert.deepEqual(math.subtract(3, 0), 3);
assert.deepEqual(math.subtract(0, 3), -3);
assert.deepEqual(math.subtract(0, 3), -3);
assert.deepEqual(math.subtract(0, 3), -3);
// TODO: test subtract


// TODO: test unaryminus
// TODO: test unequal

// test xgcd

// xgcd(36163, 21199) = 1247 => -7(36163) + 12(21199) = 1247
assert.deepEqual([1247, -7, 12], math.xgcd(36163, 21199));

// xgcd(120, 23) = 1 => -9(120) + 47(23) = 1
assert.deepEqual([1, -9, 47], math.xgcd(120, 23));

// some unit tests from: https://github.com/sjkaliski/numbers.js/blob/master/test/basic.test.js
assert.deepEqual([5, -3, 5], math.xgcd(65, 40));
assert.deepEqual([5, 5, -3], math.xgcd(40, 65));
assert.deepEqual([21, -16, 27], math.xgcd(1239, 735));
assert.deepEqual([21, 5, -2], math.xgcd(105, 252));
assert.deepEqual([21, -2, 5], math.xgcd(252, 105));

// check if gcd and xgcd give the same result
assert.equal(math.gcd(1239, 735), math.xgcd(1239, 735)[0]);
assert.equal(math.gcd(105, 252),  math.xgcd(105, 252)[0]);
assert.equal(math.gcd(7, 13),     math.xgcd(7, 13)[0]);

// invalid input (only 2 params are permitted!)
assert.throws(function () {math.xgcd(1)});
assert.throws(function () {math.xgcd(1, 2, 3)});
