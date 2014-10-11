// test UpdateNode
var assert = require('assert');
var approx = require('../../../tools/approx');
var math = require('../../../index');
var bigmath = math.create({number: 'bignumber'});
var Node = require('../../../lib/expression/node/Node');
var ConstantNode = require('../../../lib/expression/node/ConstantNode');
var RangeNode = require('../../../lib/expression/node/RangeNode');
var IndexNode = require('../../../lib/expression/node/IndexNode');
var UpdateNode = require('../../../lib/expression/node/UpdateNode');
var SymbolNode = require('../../../lib/expression/node/SymbolNode');

describe('UpdateNode', function() {

  it ('should create an UpdateNode', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(5);
    var n = new UpdateNode(i, v);

    assert(n instanceof UpdateNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'UpdateNode');
  });

  it ('should throw an error when calling without new operator', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(5);

    assert.throws(function () {UpdateNode(i, v)}, SyntaxError);
  });

  it ('should throw an error when calling with wrong arguments', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(5);

    assert.throws(function () {new UpdateNode([2, 3], v)}, TypeError);
    assert.throws(function () {new UpdateNode(i, 5)}, TypeError);
    assert.throws(function () {new UpdateNode()}, TypeError);
  });

  it ('should compile an UpdateNode', function () {
    var a = new SymbolNode('a');
    var ranges = [
        new ConstantNode(2),
        new ConstantNode(1)
    ];
    var v = new ConstantNode(5);
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

  it ('should compile an UpdateNode with range and context parameters', function () {
    var a = new SymbolNode('a');
    var ranges = [
        new ConstantNode(2),
        new RangeNode([
          new ConstantNode(1),
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

  it ('should compile an UpdateNode with negative step range and context parameters', function () {
    var a = new SymbolNode('a');
    var ranges = [
        new ConstantNode(2),
        new RangeNode([
          new SymbolNode('end'),
          new ConstantNode(1),
          new ConstantNode(-1)
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

  it ('should compile an UpdateNode with bignumber setting', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode(2),
      new ConstantNode(1)
    ];
    var v = new ConstantNode(5);
    var n = new UpdateNode(new IndexNode(a, ranges), v);
    var expr = n.compile(bigmath);

    var scope = {
      a: [[0, 0], [0, 0]]
    };
    assert.deepEqual(expr.eval(scope), [[0, 0], [bigmath.bignumber(5), 0]]);
    assert.deepEqual(scope, {
      a: [[0, 0], [bigmath.bignumber(5), 0]]
    });
  });

  it ('should find an UpdateNode', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(2);
    var n = new UpdateNode(i, v);

    assert.deepEqual(n.find({type: UpdateNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}),  [a]);
    assert.deepEqual(n.find({type: ConstantNode}),  [b, c, v]);
    assert.deepEqual(n.find({properties: {value: '1'}}),  [c]);
    assert.deepEqual(n.find({properties: {value: '2'}}),  [b, v]);
    assert.deepEqual(n.find({properties: {name: 'q'}}),  []);
  });

  it ('should match an UpdateNode', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(5);
    var n = new UpdateNode(i, v);

    assert.equal(n.match({type: UpdateNode}), true);
    assert.equal(n.match({type: ConstantNode}), false);
  });

  it ('should replace an UpdateNodes (nested) parameters', function () {
    // A[1, x] = 3
    var a = new SymbolNode('A');
    var b = new ConstantNode(2);
    var c = new SymbolNode('x');
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(3);
    var n = new UpdateNode(i, v);

    var e = new ConstantNode(4);
    var f = n.replace({
      type: SymbolNode,
      properties: {name: 'x'},
      replacement: e
    });

    assert.strictEqual(f, n);
    assert.strictEqual(n.index,  i);
    assert.strictEqual(n.index.object,  a);
    assert.strictEqual(n.index.ranges[0],  b);
    assert.strictEqual(n.index.ranges[1],  e);
    assert.strictEqual(n.expr, v);
  });

  it ('should replace an UpdateNodes replacement expr', function () {
    // A[1, x] = 3
    var a = new SymbolNode('A');
    var b = new ConstantNode(2);
    var c = new SymbolNode('x');
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(3);
    var n = new UpdateNode(i, v);

    var e = new ConstantNode(4);
    var g = n.replace({
      type: ConstantNode,
      properties: {value: '3'},
      replacement: e
    });

    assert.strictEqual(g, n);
    assert.strictEqual(n.index,  i);
    assert.strictEqual(n.index.object,  a);
    assert.strictEqual(n.index.ranges[0],  b);
    assert.strictEqual(n.index.ranges[1],  c);
    assert.strictEqual(n.expr, e);

  });

  it ('should replace an UpdateNode itself', function () {
    // A[1, x] = 3
    var a = new SymbolNode('A');
    var b = new ConstantNode(2);
    var c = new SymbolNode('x');
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(3);
    var n = new UpdateNode(i, v);

    var e = new ConstantNode(5);
    var f = n.replace({
      type: UpdateNode,
      replacement: e
    });

    assert.strictEqual(f, e);
  });

  it ('should stringify an UpdateNode', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode(2),
      new ConstantNode(1)
    ];
    var v = new ConstantNode(5);

    var n = new UpdateNode(new IndexNode(a, ranges), v);
    assert.equal(n.toString(), 'a[2, 1] = 5');
  });

  it ('should LaTeX an UpdateNode', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode(2),
      new ConstantNode(1)
    ];
    var v = new ConstantNode(5);

    var n = new UpdateNode(new IndexNode(a, ranges), v);
    assert.equal(n.toString(), 'a[2, 1] = 5');
  });

});
