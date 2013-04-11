// test util functions

var assert = require('assert');
var math = require('../../math.js');

// test chain
assert.ok(math.chain(45) instanceof math.type.Chain);
assert.equal(math.chain(3).add(4).subtract(2).done(), 5);
assert.deepEqual(math.chain(math.matrix([[1,2],[3,4]]))
    .set([1,1], 8)
    .multiply(3).done(), math.matrix([[24, 6], [9, 12]]));
assert.deepEqual(math.chain([[1,2],[3,4]])
    .set([1,1], 8)
    .multiply(3).done(), [[24, 6], [9, 12]]);
assert.deepEqual(math.chain().i.multiply(2).add(3).done(), math.complex(3, 2));
assert.deepEqual(math.chain().pi.divide(4).sin().pow(2).format().done(), 0.5);

// test clone
var a = 1;
var b = math.clone(a);
a = 2;
assert.strictEqual(b, 1);

a = 'hello world';
b = math.clone(a);
a = 'bye!';
assert.strictEqual(b, 'hello world');

a = math.complex(2, 3);
b = math.clone(a);
assert.notEqual(a, b);
a.re = 5;
assert.strictEqual(a.toString(), '5 + 3i');
assert.strictEqual(b.toString(), '2 + 3i');

a = math.unit('5mm');
b = math.clone(a);
a.value = 10;
assert.equal(a.toString(), '10 m');
assert.equal(b.toString(), '5 mm');

a = [1,2,[3,4]];
b = math.clone(a);
a[2][1] = 5;
assert.equal(b[2][1], 4);

a = math.matrix([[1, 2], [3, 4]]);
b = math.clone(a);
a.valueOf()[0][0] = 5;
assert.equal(b.valueOf()[0][0], 1);

a = math.matrix([1, 2, new math.complex(2, 3), 4]);
b = math.clone(a);
a.valueOf()[2].re = 5;
assert.equal(b.valueOf()[2].re, 2);


// test format
assert.equal(math.format(2/7), '0.2857142857');
assert.equal(math.format([[1,2],[3,4]]), '[[1, 2], [3, 4]]');
assert.equal(math.format([[1,2/7],['hi', math.complex(2,3)]]),
    '[[1, 0.2857142857], ["hi", 2 + 3i]]');


assert.equal(math.format('hello, $name!', {name: 'user'}), 'hello, user!');
assert.equal(math.format('hello, $name.first $name.last!',
    {name: {first: 'first', last: 'last'}}),
    'hello, first last!');

// TODO: test format extensively

// TODO: test help
// TODO: test import
// TODO: test typeof
