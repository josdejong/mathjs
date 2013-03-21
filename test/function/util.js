// test util functions

var assert = require('assert');
var math = require('../../math.js');

// test clone
var a = 1;
var b = math.clone(a);
a = 2;
assert.strictEqual(b, 1);

a = 'hello world';
b = math.clone(a);
a = 'bye!';
assert.strictEqual(b, 'hello world');

a = new math.Complex(2, 3);
b = math.clone(a);
assert.notEqual(a, b);
a.re = 5;
assert.strictEqual(a.toString(), '5 + 3i');
assert.strictEqual(b.toString(), '2 + 3i');

a = new math.Unit('5mm');
b = math.clone(a);
a.value = 10;
assert.equal(a.toString(), '10 m');
assert.equal(b.toString(), '5 mm');

a = [1,2,[3,4]];
b = math.clone(a);
a[2][1] = 5;
assert.equal(b[2][1], 4);

a = new math.Matrix([[1, 2], [3, 4]]);
b = math.clone(a);
a.valueOf()[0][0] = 5;
assert.equal(b.valueOf()[0][0], 1);

a = new math.Vector([1, 2, 3, 4]);
b = math.clone(a);
a.valueOf()[1] = 5;
assert.equal(b.valueOf()[1], 2);


// TODO: test format
// TODO: test help
// TODO: test import
// TODO: test typeof
