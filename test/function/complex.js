// test complex functions

var assert = require('assert');
var math = require('../../math.js');

// test re
assert.equal(math.re(math.complex(2,3)), 2);
assert.equal(math.re(math.complex(-2,-3)), -2);
assert.equal(math.re(math.i), 0);
assert.equal(math.re(2), 2);
assert.equal(math.re('string'), 'string');
assert.equal(math.re(true), true);
assert.deepEqual(math.re([2, math.complex('3-6i')]), [2, 3]);
assert.deepEqual(math.re(math.matrix([2, math.complex('3-6i')])).valueOf(), [2, 3]);

// test im
assert.equal(math.im(math.complex(2,3)), 3);
assert.equal(math.im(math.complex(-2,-3)), -3);
assert.equal(math.im(math.i), 1);
assert.equal(math.im(2), 0);
assert.equal(math.im('string'), 0);
assert.equal(math.im(true), 0);
assert.deepEqual(math.im([2, math.complex('3-6i')]), [0, -6]);
assert.deepEqual(math.im(math.matrix([2, math.complex('3-6i')])).valueOf(), [0, -6]);

// test arg
assert.equal(math.arg(math.complex('0')) / math.pi, 0);
assert.equal(math.arg(math.complex('1 + 0i')) / math.pi, 0);
assert.equal(math.arg(math.complex('1 + i')) / math.pi, 0.25);
assert.equal(math.arg(math.complex('0 + i')) / math.pi, 0.5);
assert.equal(math.arg(math.complex('-1 + i')) / math.pi, 0.75);
assert.equal(math.arg(math.complex('-1 + 0i')) / math.pi, 1);
assert.equal(math.arg(math.complex('-1 - i')) / math.pi, -0.75);
assert.equal(math.arg(math.complex('0 - i')) / math.pi, -0.5);
assert.equal(math.arg(math.complex('1 - i')) / math.pi, -0.25);
assert.equal(math.arg(math.i) / math.pi, 0.5);
assert.deepEqual(math.divide(math.arg([
    math.i, math.unaryminus(math.i), math.add(1,math.i)
]), math.pi), [
    0.5, -0.5, 0.25
]);
assert.deepEqual(math.matrix(math.divide(math.arg([
    math.i, math.unaryminus(math.i), math.add(1,math.i)
]), math.pi)).valueOf(), [
    0.5, -0.5, 0.25
]);
assert.equal(math.arg(2) / math.pi, 0);
assert.equal(math.arg(-2) / math.pi, 1);
assert.throws(function () {math.arg('string')});
assert.throws(function () {math.arg(math.unit('5cm'))});

// test conj
assert.equal(math.conj(math.complex('2 + 3i')).toString(), '2 - 3i');
assert.equal(math.conj(123).toString(), '123');
assert.equal(math.conj(math.complex('2 - 3i')).toString(), '2 + 3i');
assert.equal(math.conj(math.complex('2')).toString(), '2');
assert.equal(math.conj(math.complex('-4i')).toString(), '4i');
assert.equal(math.conj(math.i).toString(), '-i');
assert.equal(math.format(math.conj([math.complex('2+3i'), math.complex('3-4i')])),
    '[2 - 3i, 3 + 4i]');
assert.equal(math.conj(math.matrix([math.complex('2+3i'), math.complex('3-4i')])).toString(),
    '[2 - 3i, 3 + 4i]');
assert.throws(function() {math.conj('string') });
assert.throws(function() {math.conj(math.unit('5cm')) });
