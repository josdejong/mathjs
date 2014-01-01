// test ParamsNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node'),
    Scope = require('../../../lib/expression/Scope'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    ParamsNode = require('../../../lib/expression/node/ParamsNode');

describe('ParamsNode', function() {

  it ('should create a ParamsNode', function () {
    // TODO
  });

  it ('should evaluate a ParamsNode', function () {
    // TODO
  });

  it ('should compile a ParamsNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode('number', '4');
    var n = new ParamsNode(math, s, [c]);

    var scope = {};
    assert.equal(n.compile(math).eval(scope), 2);
  });

  it ('should find a ParamsNode', function () {
    // TODO
  });

  it ('should match a ParamsNode', function () {
    // TODO
  });

  it ('should stringify a ParamsNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode('number', '4');
    var n = new ParamsNode(math, s, [c]);

    assert.equal(n.toString(), 'sqrt(4)');
  });

});
