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
      new RangeNode(
        new ConstantNode(1),
        new SymbolNode('end')
      )
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
      new RangeNode(
        new SymbolNode('end'),
        new ConstantNode(1),
        new ConstantNode(-1)
      )
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
      new RangeNode(
        new ConstantNode(1),
        new SymbolNode('end')
      )
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
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var n = new IndexNode(a, [b, c]);
    var expr = n.compile(bigmath);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(expr.eval(scope), 3);
  });

  it ('should filter an IndexNode', function () {
    var a = new SymbolNode('a'),
        b = new ConstantNode(2),
        c = new ConstantNode(1);
    var n = new IndexNode(a, [b, c]);

    assert.deepEqual(n.filter(function (node) {return node instanceof IndexNode}),  [n]);
    assert.deepEqual(n.filter(function (node) {return node instanceof SymbolNode}),    [a]);
    assert.deepEqual(n.filter(function (node) {return node instanceof RangeNode}),     []);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode}),  [b, c]);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode && node.value == '2'}),  [b]);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode && node.value == '4'}),  []);
  });

  it ('should filter an empty IndexNode', function () {
    var n = new IndexNode(new SymbolNode('a'), []);

    assert.deepEqual(n.filter(function (node) {return node instanceof IndexNode}),  [n]);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode}), []);
  });

  it ('should run forEach on an IndexNode', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var n = new IndexNode(a, [b, c]);

    var nodes = [];
    var paths = [];
    n.forEach(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, n);
    });

    assert.equal(nodes.length, 3);
    assert.strictEqual(nodes[0], a);
    assert.strictEqual(nodes[1], b);
    assert.strictEqual(nodes[2], c);
    assert.deepEqual(paths, ['object', 'ranges[0]', 'ranges[1]']);
  });

  it ('should map an IndexNode', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var n = new IndexNode(a, [b, c]);

    var nodes = [];
    var paths = [];
    var e = new SymbolNode('c');
    var f = n.map(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, n);

      return node instanceof SymbolNode ? e : node;
    });

    assert.equal(nodes.length, 3);
    assert.strictEqual(nodes[0], a);
    assert.strictEqual(nodes[1], b);
    assert.strictEqual(nodes[2], c);
    assert.deepEqual(paths, ['object', 'ranges[0]', 'ranges[1]']);

    assert.notStrictEqual(f, n);
    assert.deepEqual(f.object, e);
    assert.deepEqual(f.ranges[0], b);
    assert.deepEqual(f.ranges[1], c);
  });

  it ('should throw an error when the map callback does not return a node', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var n = new IndexNode(a, [b, c]);

    assert.throws(function () {
      n.map(function () {});
    }, /Callback function must return a Node/)
  });

  it ('should transform an IndexNodes object', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var n = new IndexNode(a, [b, c]);

    var e = new SymbolNode('c');
    var f = n.transform(function (node) {
      return node instanceof SymbolNode ? e : node;
    });

    assert.notStrictEqual(f, n);
    assert.deepEqual(f.object, e);
    assert.deepEqual(f.ranges[0], b);
    assert.deepEqual(f.ranges[1], c);
  });

  it ('should transform an IndexNodes (nested) parameters', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var n = new IndexNode(a, [b, c]);

    var e = new SymbolNode('c');
    var f = n.transform(function (node) {
      return node instanceof ConstantNode && node.value == '1' ? e : node;
    });

    assert.notStrictEqual(f, n);
    assert.deepEqual(f.object, a);
    assert.deepEqual(f.ranges[0], b);
    assert.deepEqual(f.ranges[1], e);
  });

  it ('should transform an IndexNode itself', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var n = new IndexNode(a, [b, c]);

    var e = new ConstantNode(5);
    var f = n.transform(function (node) {
      return node instanceof IndexNode ? e : node;
    });

    assert.strictEqual(f, e);
  });

  it ('should clone an IndexNode', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var n = new IndexNode(a, [b, c]);

    var d = n.clone();
    assert(d instanceof IndexNode);
    assert.deepEqual(d, n);
    assert.notStrictEqual(d, n);
    assert.strictEqual(d.object, n.object);
    assert.notStrictEqual(d.ranges, n.ranges);
    assert.strictEqual(d.ranges[0], n.ranges[0]);
    assert.strictEqual(d.ranges[1], n.ranges[1]);
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

  it ('should LaTeX an IndexNode with custom toTex', function () {
    //Also checks if the custom functions get passed on to the children
    var customFunction = function (node, callback) {
      if (node.type === 'IndexNode') {
        var latex = node.object.toTex(callback) + ' at ';
        node.ranges.forEach(function (range) {
          latex += range.toTex(callback) + ', ';
        });

        return latex;
      }
      else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + node.valueType + '\\right)'
      }
    };

    var a = new SymbolNode('a');
    var b = new ConstantNode(1);
    var c = new ConstantNode(2);

    var n = new IndexNode(a, [b, c]);

    assert.equal(n.toTex(customFunction), 'a at const\\left(1, number\\right), const\\left(2, number\\right), ');
  });

});
