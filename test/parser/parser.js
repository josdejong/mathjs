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

// TODO: extensively test the Parser
