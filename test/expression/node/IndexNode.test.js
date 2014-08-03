// test IndexNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    bigmath = require('../../../index').create({number: 'bignumber'}),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode'),
    IndexNode = require('../../../lib/expression/node/IndexNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode');

describe('IndexNode', function() {

  it ('should create a IndexNode', function () {
    var n = new IndexNode(new Node(), []);
    assert(n instanceof IndexNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'IndexNode');
  });

  it ('should throw an error when calling with wrong arguments', function () {
    assert.throws(function () {new IndexNode()}, TypeError);
    assert.throws(function () {new IndexNode('a', [])}, TypeError);
    assert.throws(function () {new IndexNode(new Node, [2, 3])}, TypeError);
    assert.throws(function () {new IndexNode(new Node, [new Node(), 3])}, TypeError);
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {IndexNode(new Node(), [])}, SyntaxError);
  });

  it ('should compile a IndexNode', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode(2),
      new ConstantNode(1)
    ];
    var n = new IndexNode(a, ranges);
    var expr = n.compile(bigmath);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.equal(expr.eval(scope), 3);
  });

  it ('should compile a IndexNode with range and context parameters', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode(2),
      new RangeNode([
        new ConstantNode(1),
        new SymbolNode('end')
      ])
    ];
    var n = new IndexNode(a, ranges);
    var expr = n.compile(bigmath);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(expr.eval(scope), [[3, 4]]);
  });

  it ('should compile a IndexNode with negative step range and context parameters', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode(2),
      new RangeNode([
        new SymbolNode('end'),
        new ConstantNode(1),
        new ConstantNode(-1)
      ])
    ];
    var n = new IndexNode(a, ranges);
    var expr = n.compile(bigmath);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(expr.eval(scope), [[4, 3]]);
  });

  it ('should compile a IndexNode with "end" both as value and in a range', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new SymbolNode('end'),
      new RangeNode([
        new ConstantNode(1),
        new SymbolNode('end')
      ])
    ];
    var n = new IndexNode(a, ranges);
    var expr = n.compile(bigmath);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(expr.eval(scope), [[3, 4]]);
  });

  it ('should compile a IndexNode with bignumber setting', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode(2),
      new ConstantNode(1)
    ];
    var n = new IndexNode(a, ranges);
    var expr = n.compile(bigmath);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(expr.eval(scope), 3);
  });

  it ('should find an IndexNode', function () {
    var a = new SymbolNode('a'),
        b = new ConstantNode(2),
        c = new ConstantNode(1);
    var n = new IndexNode(a, [b, c]);

    assert.deepEqual(n.find({type: IndexNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}),    [a]);
    assert.deepEqual(n.find({type: RangeNode}),     []);
    assert.deepEqual(n.find({type: ConstantNode}),  [b, c]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '2'}}),  [b]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '4'}}),  []);
  });

  it ('should find an empty Indexnode', function () {
    var n = new IndexNode(new Node(), []);

    assert.deepEqual(n.find({type: IndexNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}), []);
  });

  it ('should match an IndexNode', function () {
    var a = new IndexNode(new Node(), []);
    assert.equal(a.match({type: IndexNode}),  true);
    assert.equal(a.match({type: SymbolNode}), false);
  });

  it ('should stringify an IndexNode', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode(2),
      new ConstantNode(1)
    ];

    var n = new IndexNode(a, ranges);
    assert.equal(n.toString(), 'a[2, 1]');

    var n2 = new IndexNode(a, []);
    assert.equal(n2.toString(), 'a[]')
  });

  it ('should LaTeX an IndexNode', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode(2),
      new ConstantNode(1)
    ];

    var n = new IndexNode(a, ranges);
    assert.equal(n.toTex(), 'a[2, 1]');

    var n2 = new IndexNode(a, []);
    assert.equal(n2.toTex(), 'a[]')
  });

});
