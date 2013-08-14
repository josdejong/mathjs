// test clone
var assert = require('assert');
var math = require('../../../lib/index.js');

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
