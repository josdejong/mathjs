// test parse
var assert = require('assert'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node');

describe('parse', function() {

  it('should parse expressions', function() {
    var node = math.parse('(5+3)/4');
    assert.ok(node instanceof Node);
    assert.equal(node.compile(math).eval(), 2);
  });

});
