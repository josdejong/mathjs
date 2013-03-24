// test parser

var assert = require('assert');
var math = require('../../math.js'),
    Parser = math.parser.Parser;

var parser = new Parser();

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

// test range
assert.ok(parser.eval('2:5') instanceof math.Range);
assert.deepEqual(parser.eval('2:5').toArray(), [2,3,4,5]);
assert.deepEqual(parser.eval('10:-2:2').toArray(), [10,8,6,4,2]);

// test matrix
assert.ok(parser.eval('[1,2;3,4]') instanceof math.Matrix);
var m = parser.eval('[1,2,3;4,5,6]');
assert.deepEqual(m.size(), [2,3]);
assert.deepEqual(m.valueOf(), [[1,2,3],[4,5,6]]);

// TODO: extensively test the Parser
