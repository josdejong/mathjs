// test ParamsNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode'),
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
    var n = new ParamsNode(s, [c]);

    var scope = {};
    assert.equal(n.compile(math).eval(scope), 2);
  });

  it.skip ('should compile a ParamsNode acting on a matrix', function () {
    var s = new SymbolNode('a');
    var n = new ParamsNode(s, [
      new ConstantNode('number', '2'),
      new ConstantNode('number', '1')
    ]);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.equal(n.compile(math).eval(scope), 3);
  });

  it.skip ('should compile a ParamsNode acting on a matrix (2)', function () {
    var s = new SymbolNode('a');
    var n = new ParamsNode(s, [
      new ConstantNode('number', '2'),
      new RangeNode([
        new ConstantNode('number', '1'),
        new SymbolNode('end')
      ])
    ]);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(n.compile(math).eval(scope), [3, 4]);
  });

  it.skip ('should compile a ParamsNode acting on a matrix (3)', function () {
    var s = new SymbolNode('a');
    var n = new ParamsNode(s, [
      new ConstantNode('number', '2'),
      new RangeNode([
        new SymbolNode('end'),
        new ConstantNode('number', '1'),
        new ConstantNode('number', '-1')
      ])
    ]);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(n.compile(math).eval(scope), [4, 3]);
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
    var n = new ParamsNode(s, [c]);

    assert.equal(n.toString(), 'sqrt(4)');
  });

});
