// TODO: test subset
var assert = require('assert'),
    math = require('../../../math.js'),
    subset = math.subset,
    matrix = math.matrix,
    range = math.range;

// 1. GETTING A SUBSET

// array
var a = [[1,2], [3,4]];
assert.deepEqual(subset(a, [[1,2], 2]), [[2],[4]]);
assert.deepEqual(subset(a, [[1,2], [2]]), [[2],[4]]);
assert.deepEqual(subset(a, [2, 1]), 3);

assert.throws(function () {subset(a, [7, 1])}, RangeError);
assert.throws(function () {subset(a, [2])}, RangeError);
assert.throws(function () {subset(a, [2,1,1])}, RangeError);
assert.throws(function () {subset(a, [2.3, 1])}, TypeError);

// matrix
var b = math.matrix(a);
assert.deepEqual(subset(b, [[1,2], 2]), matrix([[2],[4]]));
assert.deepEqual(subset(b, [range(1,2), [2]]), matrix([[2],[4]]));
assert.deepEqual(subset(b, [matrix([1,2]), [2]]), matrix([[2],[4]]));
assert.deepEqual(subset(b, [2, 1]), 3);
assert.deepEqual(subset(b, matrix([2, 1])), 3);

assert.throws(function () {subset(b, [7, 1])}, RangeError);
assert.throws(function () {subset(b, [2])}, RangeError);
assert.throws(function () {subset(b, [2,1,1])}, RangeError);
assert.throws(function () {subset(b, [2.3, 1])}, TypeError);

// range
var c = math.diag(math.range(1,5));
assert.deepEqual(subset(c, [2, range('1:5')]), matrix([[0,2,0,0,0]]));
assert.deepEqual(subset(c, [range('2:3'), range('1:5')]), matrix([[0,2,0,0,0],[0,0,3,0,0]]));

assert.throws(function () {subset(c, [2, range('3:6')])}, RangeError);
assert.throws(function () {subset(c, [2.3, 1])}, TypeError);

// string
assert.deepEqual(subset('hello', [2]), 'e');
assert.deepEqual(subset('hello', [[2]]), 'e');
assert.deepEqual(subset('hello', [range('5:-1:1')]), 'olleh');
assert.deepEqual(subset('hello', [[1,5]]), 'ho');

assert.throws(function () {subset('hello', 2)}, RangeError);
assert.throws(function () {subset('hello', [[7]])}, RangeError);
assert.throws(function () {subset('hello', [[-1]])}, RangeError);
assert.throws(function () {subset('hello', [[2.3]])}, TypeError);

// scalar
assert.deepEqual(subset(123, [1]), 123);
assert.deepEqual(subset(math.complex('2+3i'), [1]), math.complex(2,3));
assert.deepEqual(subset(123, [[1,1]]), [123, 123]);

assert.throws(function () {subset(123, [2])}, RangeError);
assert.throws(function () {subset(123, [0])}, RangeError);
assert.throws(function () {subset(123, [-1])}, RangeError);
assert.throws(function () {subset(123, [2,3])}, RangeError);
assert.throws(function () {subset(123, [1,1])}, RangeError); // TODO: this should be supported
assert.throws(function () {subset(123, [3.4])}, TypeError);



// 2. SETTING A SUBSET

// array
var d = [[1,2], [3,4]];
var e = subset(d, [[1,2], 2], [[-2],[-4]]);
assert.deepEqual(d, [[1,2], [3,4]]);
assert.deepEqual(e, [[1,-2], [3,-4]]);
var f = subset(d, [3, [1,2]], [[5,6]]);
assert.deepEqual(d, [[1,2], [3,4]]);
assert.deepEqual(f, [[1,2], [3,4], [5,6]]);
var f2 = subset(d, [1,1], 123);
assert.deepEqual(d, [[1,2], [3,4]]);
assert.deepEqual(f2, [[123,2], [3,4]]);

assert.throws(function () {subset(d, [2], 123)}, RangeError);
assert.throws(function () {subset(d, [2.3,1], 123)}, TypeError);

// matrix
var g  = matrix([[1,2], [3,4]]);
var h = subset(g, [[1,2], 2], [[-2],[-4]]);
assert.deepEqual(g, matrix([[1,2], [3,4]]));
assert.deepEqual(h, matrix([[1,-2], [3,-4]]));
var i = subset(g, [3, [1,2]], [[5,6]]);
assert.deepEqual(g, matrix([[1,2], [3,4]]));
assert.deepEqual(i, matrix([[1,2], [3,4], [5,6]]));

assert.throws(function () {subset(d, [2], 123)}, RangeError);
assert.throws(function () {subset(d, [2.3,1], 123)}, TypeError);

// range
assert.deepEqual(subset(range('1:5'), [range('2:4')], range('4:-1:2')), [1,4,3,2,5]);

// string
var j = 'hello';
assert.deepEqual(subset(j, [[1,6]], 'H!'), 'Hello!');
assert.deepEqual(j, 'hello');
assert.deepEqual(subset(j, [1], 'H'), 'Hello');
assert.deepEqual(j, 'hello');
assert.deepEqual(subset(j, [range(6,11)], ' world'), 'hello world');
assert.deepEqual(j, 'hello');

assert.throws(function () {subset('hello', [[2,3]], '1234')}, RangeError);
assert.throws(function () {subset('hello', [2,3], 'a')}, RangeError);

// scalar
assert.deepEqual(subset(123, [1], 456), 456);
assert.deepEqual(subset(123, [1,1], 456), 456);
assert.deepEqual(subset(math.complex('2+3i'), [1], 123), 123);
assert.deepEqual(subset(123, [2], 456), [123, 456]);

assert.throws(function () {subset(123, [0], 456)}, RangeError);
assert.throws(function () {subset(123, [-1], 456)}, RangeError);
assert.throws(function () {subset(123, [3.4], 456)}, TypeError);



// 3. WITH PARSER
var parser = math.parser();
assert.deepEqual(parser.eval('a = [1,2;3,4]'), matrix([[1,2],[3,4]]));
assert.deepEqual(parser.eval('a(2,2)'), 4);
assert.deepEqual(parser.eval('a(:,2)'), matrix([[2],[4]]));
assert.deepEqual(parser.eval('a(:,2) = [-2;-4]'), matrix([[1,-2],[3,-4]]));
assert.deepEqual(parser.eval('b=123'), 123);
assert.deepEqual(parser.eval('b(1)'), 123);
// assert.deepEqual(parser.eval('b(1,1)'), 123); // TODO: should be supported
assert.deepEqual(parser.eval('b(1)=456'), 456);
assert.deepEqual(parser.eval('b'), 456);
assert.deepEqual(parser.eval('c="hello"'), "hello");
assert.deepEqual(parser.eval('c(2:4)'), "ell");
assert.deepEqual(parser.eval('c(2:4)'), "ell");
assert.deepEqual(parser.eval('c(1) = "H"'), "Hello");
assert.deepEqual(parser.eval('c'), "Hello");
assert.deepEqual(parser.eval('c(6:11) = " world"'), "Hello world");
assert.deepEqual(parser.eval('c(5:-1:1)'), "olleH");
//assert.deepEqual(parser.eval('c(end:-1:1)'), "olleH"); // TODO: implement context symbol end for strings
