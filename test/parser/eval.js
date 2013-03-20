// test Parser's eval function

var assert = require('assert'),
    math = require('../../math.js'),
    parser = new math.parser.Parser();

// pow
assert.equal(parser.eval('2^3'), 8);
assert.equal(parser.eval('(2^3)^2'), 64);
assert.equal(parser.eval('2^(3^2)'), 512);
assert.equal(parser.eval('2^3^2'), 512);
