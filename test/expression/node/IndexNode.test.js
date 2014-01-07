// test IndexNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    mathjs = require('../../../index'),
    math = mathjs(),
    bigmath = mathjs({number: 'bignumber'}),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode'),
    IndexNode = require('../../../lib/expression/node/IndexNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode');

describe('IndexNode', function() {

  it ('should create a IndexNode', function () {
    // TODO
  });

  it ('should evaluate a IndexNode', function () {
    // TODO
  });

  it ('should compile a IndexNode', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode('number', '2'),
      new ConstantNode('number', '1')
    ];
    var n = new IndexNode(a, ranges);
    var expr = n.compile(math);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.equal(expr.eval(scope), 3);
  });

  it ('should compile a IndexNode with range and context parameters', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode('number', '2'),
      new RangeNode([
        new ConstantNode('number', '1'),
        new SymbolNode('end')
      ])
    ];
    var n = new IndexNode(a, ranges);
    var expr = n.compile(math);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(expr.eval(scope), [3, 4]);
  });

  it ('should compile a IndexNode with negative step range and context parameters', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode('number', '2'),
      new RangeNode([
        new SymbolNode('end'),
        new ConstantNode('number', '1'),
        new ConstantNode('number', '-1')
      ])
    ];
    var n = new IndexNode(a, ranges);
    var expr = n.compile(math);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(expr.eval(scope), [4, 3]);
  });

  it ('should compile a IndexNode with bignumber setting', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode('number', '2'),
      new ConstantNode('number', '1')
    ];
    var n = new IndexNode(a, ranges);
    var expr = n.compile(bigmath);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(expr.eval(scope), 3);
  });

  it ('should find a IndexNode', function () {
    // TODO
  });

  it ('should match a IndexNode', function () {
    // TODO
  });

  it ('should stringify a IndexNode', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode('number', '2'),
      new ConstantNode('number', '1')
    ];

    var n = new IndexNode('a', ranges);
    assert.equal(n.toString(), 'a[2, 1]');
  });

});
