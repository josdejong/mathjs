// test parse
var assert = require('assert'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node');

describe('parse', function() {

  it('should compile an expression', function() {
    var code = math.compile('(5+3)/4');
    assert.ok(code instanceof Object);
    assert.ok(code.eval instanceof Function);
    assert.equal(code.eval(), 2);
  });

  it('should parse multiple expressions', function() {
    var codes = math.compile(['2+3', '4+5']);
    assert.ok(Array.isArray(codes));
    assert.equal(codes.length, 2);

    assert.equal(codes[0].eval(), 5);
    assert.equal(codes[1].eval(), 9);
  });

});
