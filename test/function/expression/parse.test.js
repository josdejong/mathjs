// test parse
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    Node = require('../../../lib/expression/node/Node');

describe('parse', function() {

  it('should parse an expression', function() {
    var node = math.parse('(5+3)/4');
    assert.ok(node instanceof Node);
    assert.equal(node.compile(math).eval(), 2);
  });

  it('should parse multiple expressions', function() {
    var nodes = math.parse(['2+3', '4+5']);
    assert.ok(Array.isArray(nodes));
    assert.equal(nodes.length, 2);

    assert.ok(nodes[0] instanceof Node);
    assert.ok(nodes[1] instanceof Node);
    assert.equal(nodes[0].compile(math).eval(), 5);
    assert.equal(nodes[1].compile(math).eval(), 9);
  });

});
