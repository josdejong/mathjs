// test parser

var assert = require('assert');
var math = require('../../math.js'),
    Parser = math.parser.Parser;

var parser = new Parser();

// test power operator
assert.equal(parser.eval('2^3'), 8);
assert.equal(parser.eval('1.5^1.5^1.5'), parser.eval('1.5^(1.5^1.5)'));
assert.equal(parser.eval('1.5^1.5^1.5^1.5'), parser.eval('1.5^(1.5^(1.5^1.5))'));

// TODO: extensively test the Parser
