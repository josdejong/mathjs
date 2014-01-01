// test BlockNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    AssignmentNode = require('../../../lib/expression/node/AssignmentNode'),
    BlockNode = require('../../../lib/expression/node/BlockNode');

describe('BlockNode', function() {

  it ('should create a BlockNode', function () {
    // TODO
    // create and add
  });

  it ('should evaluate a BlockNode', function () {
    // TODO
  });

  it ('should compile a BlockNode', function () {
    var n = new BlockNode();
    n.add(new ConstantNode('number', '5'), true);
    n.add(new AssignmentNode('foo', new ConstantNode('number', '3')), false);
    n.add(new SymbolNode('foo'), true);

    var scope = {};
    assert.deepEqual(n.compile(math).eval(scope), [5, 3]);
    assert.deepEqual(scope, {foo: 3});
  });

  it ('should find a BlockNode', function () {
    // TODO
  });

  it ('should match a BlockNode', function () {
    // TODO
  });

  it ('should stringify a BlockNode', function () {
    var n = new BlockNode();
    n.add(new ConstantNode('number', '5'), true);
    n.add(new AssignmentNode('foo', new ConstantNode('number', '3')), false);
    n.add(new SymbolNode('foo'), true);

    assert.equal(n.toString(), '5\nfoo = 3;\nfoo');
  });

});
