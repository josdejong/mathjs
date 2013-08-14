// test subset
var assert = require('assert'),
    math = require('../../../index.js'),
    subset = math.subset,
    matrix = math.matrix,
    range = math.range;

// 1. GETTING A SUBSET

// array
var a = [[1,2], [3,4]];
assert.deepEqual(subset(a, [[0,1], 1]), [[2],[4]]);
assert.deepEqual(subset(a, [[0,1], [1]]), [[2],[4]]);
assert.deepEqual(subset(a, [1,0]), 3);

assert.throws(function () {subset(a, [6, 0])}, RangeError);
assert.throws(function () {subset(a, [1])}, RangeError);
assert.throws(function () {subset(a, [1,0,0])}, RangeError);
assert.throws(function () {subset(a, [1.3, 0])}, TypeError);

// matrix
var b = math.matrix(a);
assert.deepEqual(subset(b, [[0,1], 1]), matrix([[2],[4]]));
assert.deepEqual(subset(b, [range(0,2), [1]]), matrix([[2],[4]]));
assert.deepEqual(subset(b, [matrix([0,1]), [1]]), matrix([[2],[4]]));
assert.deepEqual(subset(b, [1, 0]), 3);
assert.deepEqual(subset(b, matrix([1, 0])), 3);

assert.throws(function () {subset(b, [6, 0])}, RangeError);
assert.throws(function () {subset(b, [1])}, RangeError);
assert.throws(function () {subset(b, [1,0,0])}, RangeError);
assert.throws(function () {subset(b, [1.3, 0])}, TypeError);

// range
var c = math.diag(math.range(1,6));
assert.deepEqual(subset(c, [1, range('0:5')]), matrix([[0,2,0,0,0]]));
assert.deepEqual(subset(c, [range('1:3'), range('0:5')]), matrix([[0,2,0,0,0],[0,0,3,0,0]]));

assert.throws(function () {subset(c, [1, range('2:6')])}, RangeError);
assert.throws(function () {subset(c, [1.3, 0])}, TypeError);

// string
assert.deepEqual(subset('hello', [1]), 'e');
assert.deepEqual(subset('hello', [[1]]), 'e');
assert.deepEqual(subset('hello', [range('4:-1:-1')]), 'olleh');
assert.deepEqual(subset('hello', [[0,4]]), 'ho');

assert.throws(function () {subset('hello', 1)}, RangeError);
assert.throws(function () {subset('hello', [[6]])}, RangeError);
assert.throws(function () {subset('hello', [[-2]])}, RangeError);
assert.throws(function () {subset('hello', [[1.3]])}, TypeError);

// scalar
assert.deepEqual(subset(123, [0]), 123);
assert.deepEqual(subset(math.complex('2+3i'), [0]), math.complex(2,3));
assert.deepEqual(subset(123, [[0,0]]), [123, 123]);

assert.throws(function () {subset(123, [1])}, RangeError);
assert.throws(function () {subset(123, [-1])}, RangeError);
assert.throws(function () {subset(123, [-2])}, RangeError);
assert.throws(function () {subset(123, [1,2])}, RangeError);
assert.throws(function () {subset(123, [0,0])}, RangeError); // TODO: this should be supported
assert.throws(function () {subset(123, [2.4])}, TypeError);



// 2. SETTING A SUBSET

// array
var d = [[1,2], [3,4]];
var e = subset(d, [[0,1], 1], [[-2],[-4]]);
assert.deepEqual(d, [[1,2], [3,4]]);
assert.deepEqual(e, [[1,-2], [3,-4]]);
var f = subset(d, [2, [0,1]], [[5,6]]);
assert.deepEqual(d, [[1,2], [3,4]]);
assert.deepEqual(f, [[1,2], [3,4], [5,6]]);
var f2 = subset(d, [0,0], 123);
assert.deepEqual(d, [[1,2], [3,4]]);
assert.deepEqual(f2, [[123,2], [3,4]]);

assert.throws(function () {subset(d, [1], 123)}, RangeError);
assert.throws(function () {subset(d, [1.3,0], 123)}, TypeError);

// matrix
var g  = matrix([[1,2], [3,4]]);
var h = subset(g, [[0,1], 1], [[-2],[-4]]);
assert.deepEqual(g, matrix([[1,2], [3,4]]));
assert.deepEqual(h, matrix([[1,-2], [3,-4]]));
var i = subset(g, [2, [0,1]], [[5,6]]);
assert.deepEqual(g, matrix([[1,2], [3,4]]));
assert.deepEqual(i, matrix([[1,2], [3,4], [5,6]]));

assert.throws(function () {subset(d, [1], 123)}, RangeError);
assert.throws(function () {subset(d, [1.3,0], 123)}, TypeError);

// range
assert.deepEqual(subset(range('1:6'), [range('1:4')], range('4:-1:1')), [1,4,3,2,5]);

// string
var j = 'hello';
assert.deepEqual(subset(j, [[0,5]], 'H!'), 'Hello!');
assert.deepEqual(j, 'hello');
assert.deepEqual(subset(j, [0], 'H'), 'Hello');
assert.deepEqual(j, 'hello');
assert.deepEqual(subset(j, [range(5,11)], ' world'), 'hello world');
assert.deepEqual(j, 'hello');

assert.throws(function () {subset('hello', [[1,2]], '1234')}, RangeError);
assert.throws(function () {subset('hello', [1,2], 'a')}, RangeError);

// scalar
assert.deepEqual(subset(123, [0], 456), 456);
assert.deepEqual(subset(123, [0,0], 456), 456);
assert.deepEqual(subset(math.complex('2+3i'), [0], 123), 123);
assert.deepEqual(subset(123, [1], 456), [123, 456]);

assert.throws(function () {subset(123, [-1], 456)}, RangeError);
assert.throws(function () {subset(123, [-2], 456)}, RangeError);
assert.throws(function () {subset(123, [2.4], 456)}, TypeError);



// 3. WITH PARSER
var parser = math.parser();
assert.deepEqual(parser.eval('a = [1,2;3,4]'), matrix([[1,2],[3,4]]));
assert.deepEqual(parser.eval('a(1,1)'), 4);
assert.deepEqual(parser.eval('a(:,1)'), matrix([[2],[4]]));
assert.deepEqual(parser.eval('a(:,1) = [-2;-4]'), matrix([[1,-2],[3,-4]]));
assert.deepEqual(parser.eval('b=123'), 123);
assert.deepEqual(parser.eval('b(0)'), 123);
// assert.deepEqual(parser.eval('b(0,0)'), 123); // TODO: should be supported?
assert.deepEqual(parser.eval('b(0)=456'), 456);
assert.deepEqual(parser.eval('b'), 456);
assert.deepEqual(parser.eval('c="hello"'), "hello");
assert.deepEqual(parser.eval('c(1:4)'), "ell");
assert.deepEqual(parser.eval('c(0) = "H"'), "Hello");
assert.deepEqual(parser.eval('c'), "Hello");
assert.deepEqual(parser.eval('c(5:11) = " world"'), "Hello world");
assert.deepEqual(parser.eval('c(4:-1:-1)'), "olleH");
assert.deepEqual(parser.eval('c(end-1:-1:-1)'), "dlrow olleH");
