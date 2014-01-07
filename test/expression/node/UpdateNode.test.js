// test UpdateNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    mathjs = require('../../../index'),
    math = mathjs(),
    bigmath = mathjs({number: 'bignumber'}),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode'),
    IndexNode = require('../../../lib/expression/node/IndexNode'),
    UpdateNode = require('../../../lib/expression/node/UpdateNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode');

describe('UpdateNode', function() {

  it ('should create a UpdateNode', function () {
    // TODO
  });

  it ('should evaluate a UpdateNode', function () {
    // TODO
  });

  it ('should compile a UpdateNode', function () {
    var a = new SymbolNode('a');
    var ranges = [
        new ConstantNode('number', '2'),
        new ConstantNode('number', '1')
    ];
    var v = new ConstantNode('number', '5');
    var n = new UpdateNode(new IndexNode(a, ranges), v);
    var expr = n.compile(math);

    var scope = {
      a: [[0, 0], [0, 0]]
    };
    assert.deepEqual(expr.eval(scope), [[0, 0], [5, 0]]);
    assert.deepEqual(scope, {
      a: [[0, 0], [5, 0]]
    });
  });

  it ('should compile a UpdateNode with range and context parameters', function () {
    var a = new SymbolNode('a');
    var ranges = [
        new ConstantNode('number', '2'),
        new RangeNode([
          new ConstantNode('number', '1'),
          new SymbolNode('end')
        ])
    ];
    var b = new SymbolNode('b');
    var n = new UpdateNode(new IndexNode(a, ranges), b);
    var expr = n.compile(math);

    var scope = {
      a: [[0, 0], [0, 0]],
      b: [5, 6]
    };
    assert.deepEqual(expr.eval(scope), [[0, 0], [5, 6]]);
    assert.deepEqual(scope, {
      a: [[0, 0], [5, 6]],
      b: [5, 6]
    });
  });

  it ('should compile a UpdateNode with negative step range and context parameters', function () {
    var a = new SymbolNode('a');
    var ranges = [
        new ConstantNode('number', '2'),
        new RangeNode([
          new SymbolNode('end'),
          new ConstantNode('number', '1'),
          new ConstantNode('number', '-1')
        ])
    ];
    var b = new SymbolNode('b');
    var n = new UpdateNode(new IndexNode(a, ranges), b);
    var expr = n.compile(math);

    var scope = {
      a: [[0, 0], [0, 0]],
      b: [5, 6]
    };
    assert.deepEqual(expr.eval(scope), [[0, 0], [6, 5]]);
    assert.deepEqual(scope, {
      a: [[0, 0], [6, 5]],
      b: [5, 6]
    });
  });

  it ('should compile a UpdateNode with bignumber setting', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode('number', '2'),
      new ConstantNode('number', '1')
    ];
    var v = new ConstantNode('number', '5');
    var n = new UpdateNode(new IndexNode(a, ranges), v);
    var expr = n.compile(bigmath);

    var scope = {
      a: [[0, 0], [0, 0]]
    };
    assert.deepEqual(expr.eval(scope), [[0, 0], [math.bignumber(5), 0]]);
    assert.deepEqual(scope, {
      a: [[0, 0], [math.bignumber(5), 0]]
    });
  });

  it ('should find a UpdateNode', function () {
    // TODO
  });

  it ('should match a UpdateNode', function () {
    // TODO
  });

  it ('should stringify a UpdateNode', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode('number', '2'),
      new ConstantNode('number', '1')
    ];
    var v = new ConstantNode('number', '5');

    var n = new UpdateNode(new IndexNode(a, ranges), v);
    assert.equal(n.toString(), 'a[2, 1] = 5');
  });

});
