// test parser

var assert = require('assert');
var math = require('../../math.js');

var parser = math.parser();

// test precedence
assert.equal(parser.eval('4-2+3'), 5);
assert.equal(parser.eval('4-(2+3)'), -1);
assert.equal(parser.eval('4-2-3'), -1);
assert.equal(parser.eval('4-(2-3)'), 5);

assert.equal(parser.eval('2+3*4'), 14);
assert.equal(parser.eval('2*3+4'), 10);
assert.equal(parser.eval('2*3^2'), 18);

assert.equal(parser.eval('2^3'), 8);
assert.equal(parser.eval('2^3^4'), Math.pow(2, Math.pow(3, 4)));
assert.equal(parser.eval('1.5^1.5^1.5'), parser.eval('1.5^(1.5^1.5)'));
assert.equal(parser.eval('1.5^1.5^1.5^1.5'), parser.eval('1.5^(1.5^(1.5^1.5))'));

assert.equal(parser.eval('-3^2'), -9);
assert.equal(parser.eval('(-3)^2'), 9);

assert.equal(parser.eval('2^3!'), 64);
assert.equal(parser.eval('2^(3!)'), 64);

// test function calls
assert.equal(parser.eval('sqrt(4)'), 2);
assert.equal(parser.eval('sqrt(6+3)'), 3);
assert.equal(parser.eval('atan2(2,2)'), 0.7853981633974483);

// test variables
assert.equal(parser.eval('a = 0.75'), 0.75);
assert.equal(parser.eval('a + 2'), 2.75);
assert.equal(parser.eval('a = 2'), 2);
assert.equal(parser.eval('a + 2'), 4);

// test range
assert.ok(parser.eval('2:5') instanceof math.type.Range);
assert.deepEqual(parser.eval('2:5').toArray(), [2,3,4,5]);
assert.deepEqual(parser.eval('10:-2:2').toArray(), [10,8,6,4,2]);

// test matrix
assert.ok(parser.eval('[1,2;3,4]') instanceof math.type.Matrix);
var m = parser.eval('[1,2,3;4,5,6]');
assert.deepEqual(m.size(), [2,3]);
assert.deepEqual(m.valueOf(), [[1,2,3],[4,5,6]]);
var b = parser.eval('[5, 6; 1, 1]');
assert.deepEqual(b.size(), [2,2]);
assert.deepEqual(b.valueOf(), [[5,6],[1,1]]);
b.set([2, [1, 2]], [[7, 8]]);
assert.deepEqual(b.size(), [2,2]);
assert.deepEqual(b.valueOf(), [[5,6],[7,8]]);

parser.eval('a=[1,2;3,4]');
parser.eval('a(1,1) = 100');
assert.deepEqual(parser.get('a').size(), [2,2]);
assert.deepEqual(parser.get('a').valueOf(), [[100,2],[3,4]]);
parser.eval('a(2:3,2:3) = [10,11;12,13]');
assert.deepEqual(parser.get('a').size(), [3,3]);
assert.deepEqual(parser.get('a').valueOf(), [[100,2,0],[3,10,11],[0,12,13]]);
var a = parser.get('a');
assert.deepEqual(a.get([math.range('1:3'), math.range('1:2')]).valueOf(), [[100,2],[3,10],[0,12]]);
assert.deepEqual(parser.eval('a(1:3,1:2)').valueOf(), [[100,2],[3,10],[0,12]]);

// TODO: extensively test the Parser
