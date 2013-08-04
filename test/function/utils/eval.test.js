// test eval
var assert = require('assert');
var math = require('../../../dist/math.js');

// test some expressions
assert.equal(math.eval('pi'), Math.PI);
assert.equal(math.eval('(2+3)/4'), 1.25);
assert.equal(math.eval('sqrt(-4)').toString(), '2i');

// test multiple expressions
assert.deepEqual(math.eval(['1+2', '3+4', '5+6']), [3, 7, 11]);
assert.deepEqual(math.eval(['a=3', 'b=4', 'a*b']), [3, 4, 12]);
assert.deepEqual(math.eval(math.matrix(['a=3', 'b=4', 'a*b'])), math.matrix([3, 4, 12]));
assert.deepEqual(math.eval(['a=3', 'b=4', 'a*b']), [3, 4, 12]);

// test block expression
assert.deepEqual(math.eval('a=3\nb=4\na*b'), [3, 4, 12]);
assert.deepEqual(math.eval('function f(x) = a * x; a=2; f(4)'), [8]);
assert.deepEqual(math.eval('b = 43; b * 4'), [172]);

// test wrong number of arguments
assert.throws(function () {math.eval()}, SyntaxError);
assert.throws(function () {math.eval(1,2,3)}, SyntaxError);

// test wrong type of arguments
assert.throws(function () {math.eval(23)}, TypeError);
assert.throws(function () {math.eval(math.unit('5cm'))}, TypeError);
assert.throws(function () {math.eval(math.complex(2,3))}, TypeError);
assert.throws(function () {math.eval(math.range(1,5))}, TypeError);
assert.throws(function () {math.eval(true)}, TypeError);

// test providing a scope
var scope = {
  a: 3,
  b: 4
};
assert.deepEqual(math.eval('a*b', scope), 12);
assert.deepEqual(math.eval('c=5', scope), 5);
assert.deepEqual(math.eval('function f(x) = x^a', scope), 'f(x)');
assert.deepEqual(scope, {
  a: 3,
  b: 4,
  c: 5,
  f: 'f(x)',
  ans: 'f(x)'
});
assert.equal(scope.f(3), 27);
scope.a = 2;
assert.equal(scope.f(3), 9);
scope.hello = function (name) {
  return 'hello, ' + name + '!';
};
assert.deepEqual(math.eval('hello("jos")', scope), 'hello, jos!');
