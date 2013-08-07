// test conj
var assert = require('assert');
var math = require('../../../src/index.js');

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

assert.equal(math.conj('string'), 'string');
assert.deepEqual(math.conj(math.unit('5cm')), math.unit('5cm'));
