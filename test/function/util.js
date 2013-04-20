// test util functions

var assert = require('assert');
var math = require('../../math.js');

/**
 * Test whether two numbers are equal when rounded to 5 decimals
 * @param {Number} a
 * @param {Number} b
 */
function approxEqual(a, b) {
    assert.equal(math.round(a, 5), math.round(b, 5));
}

// test select
assert.ok(math.select(45) instanceof math.type.Selector);
assert.equal(math.select(3).add(4).subtract(2).done(), 5);
assert.deepEqual(math.select(math.matrix([[1,2],[3,4]]))
    .set([1,1], 8)
    .multiply(3).done(), math.matrix([[24, 6], [9, 12]]));
assert.deepEqual(math.select([[1,2],[3,4]])
    .set([1,1], 8)
    .multiply(3).done(), [[24, 6], [9, 12]]);
assert.deepEqual(math.select().i.multiply(2).add(3).done(), math.complex(3, 2));
assert.deepEqual(math.select().pi.divide(4).sin().pow(2).format().done(), 0.5);

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


// test eval
assert.equal(math.eval('pi'), Math.PI);
assert.equal(math.eval('(2+3)/4'), 1.25);
assert.equal(math.eval('sqrt(-4)').toString(), '2i');
assert.deepEqual(math.eval(['1+2', '3+4', '5+6']), [3, 7, 11]);
assert.throws(function () {math.eval('b = 43');});
assert.throws(function () {math.eval('function f(x) = a * x');});
assert.throws(function () {math.eval('a([1,1])= [4]');});
assert.throws(function () {math.set('a', 3)});

// test format
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

// test import
math.import({
    myvalue: 42,
    hello: function (name) {
        return 'hello, ' + name + '!';
    }
});
assert.equal(math.myvalue * 2, 84);
assert.equal(math.hello('user'), 'hello, user!');

// test whether not overwriting existing functions by default
math.import({pi: 3});
approxEqual(math.pi, 3.14159);
// test whether overwritten when forced
math.import({pi: 3}, {override: true});
approxEqual(math.pi, 3);
// restore pi
math.import({pi: Math.pi}, {override: true});


var parser = math.parser();
parser.eval('myvalue + 10');    // 52
parser.eval('hello("user")');   // 'hello, user!'

// test typeof
assert.equal(math.typeof(2), 'number');
assert.equal(math.typeof(new Number(2)), 'number');
assert.equal(math.typeof(2 + 3), 'number');
assert.equal(math.typeof(2 + ''), 'string');
assert.equal(math.typeof('hello there'), 'string');
assert.equal(math.typeof(math.format(3)), 'string');
assert.equal(math.typeof(math.complex(2,3)), 'complex');
assert.equal(math.typeof([1,2,3]), 'array');
assert.equal(math.typeof(math.matrix()), 'matrix');
assert.equal(math.typeof(math.unit('5cm')), 'unit');
assert.equal(math.typeof(true), 'boolean');
assert.equal(math.typeof(false), 'boolean');
assert.equal(math.typeof(null), 'null');
assert.equal(math.typeof(undefined), 'undefined');
assert.equal(math.typeof(new Date()), 'date');
assert.equal(math.typeof(function () {}), 'function');
assert.equal(math.typeof(math.sin), 'function');
assert.equal(math.typeof({}), 'object');
assert.equal(math.typeof(math), 'object');
assert.throws(function() {math.typeof(); });
assert.throws(function() {math.typeof(1,2); });
