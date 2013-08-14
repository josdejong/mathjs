// test format
var assert = require('assert');
var math = require('../../../lib/index.js');

assert.equal(math.format(2/7), '0.28571');
assert.equal(math.format(0.10400), '0.104');
assert.equal(math.format(1000), '1000');
assert.equal(math.format(2.3e-7), '2.3e-7');
assert.equal(math.format(2.3e-6), '2.3e-6');
assert.equal(math.format(2.3e-5), '2.3e-5');
assert.equal(math.format(2.3e-4), '2.3e-4');
assert.equal(math.format(2.3e-3), '0.0023');
assert.equal(math.format(2.3e-2), '0.023');
assert.equal(math.format(2.3e-1), '0.23');
assert.equal(math.format(2.3), '2.3');
assert.equal(math.format(2.3e1), '23');
assert.equal(math.format(2.3e2), '230');
assert.equal(math.format(2.3e3), '2300');
assert.equal(math.format(2.3e4), '23000');
assert.equal(math.format(2.3e5), '2.3e5');
assert.equal(math.format(2.3e6), '2.3e6');
assert.equal(math.format(math.eval('1000.000')), '1000');
assert.equal(math.format(math.eval('1000.0010')), '1000'); // rounded off at 5 digits
assert.equal(math.format('hello'), '"hello"');
assert.equal(math.format(math.pi), '3.1416');
assert.equal(math.format(math.pi * 10000), '31416');
assert.equal(math.format(math.pi / 100), '0.031416');
assert.equal(math.format(math.e), '2.7183');
assert.equal(math.format([[1,2],[3,4]]), '[[1, 2], [3, 4]]');
assert.equal(math.format([[1,2/7],['hi', math.complex(2,3)]]),
    '[[1, 0.28571], ["hi", 2 + 3i]]');
assert.equal(math.format(math.divide(math.complex(2,5),3)), '0.66667 + 1.6667i');

assert.equal(math.format('hello, $name!', {name: 'user'}), 'hello, user!');
assert.equal(math.format('hello, $name.first $name.last!',
    {name: {first: 'first', last: 'last'}}),
    'hello, first last!');
