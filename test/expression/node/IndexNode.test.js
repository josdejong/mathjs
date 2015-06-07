// test IndexNode
var assert = require('assert');
var approx = require('../../../tools/approx');
var math = require('../../../index');
var bigmath = require('../../../index').create({number: 'bignumber'});
var Node = math.expression.node.Node;
var ConstantNode = math.expression.node.ConstantNode;
var SymbolNode = math.expression.node.SymbolNode;
var IndexNode = math.expression.node.IndexNode;
var RangeNode = math.expression.node.RangeNode;

describe('IndexNode', function() {

  it ('should create a IndexNode', function () {
    var n = new IndexNode(new Node(), []);
    assert(n instanceof IndexNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'IndexNode');
  });

  it ('should have isIndexNode', function () {
    var node = new IndexNode(new Node(), []);
    assert(node.isIndexNode);
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
    var a = new bigmath.expression.node.SymbolNode('a');
    var ranges = [
      new bigmath.expression.node.ConstantNode(2),
      new bigmath.expression.node.ConstantNode(1)
    ];
    var n = new bigmath.expression.node.IndexNode(a, ranges);
    var expr = n.compile();

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
    var expr = n.compile();

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
    var expr = n.compile();

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
    var expr = n.compile();

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(expr.eval(scope), [[3, 4]]);
  });

  it ('should compile a IndexNode with bignumber setting', function () {
    var a = new bigmath.expression.node.SymbolNode('a');
    var b = new bigmath.expression.node.ConstantNode(2);
    var c = new bigmath.expression.node.ConstantNode(1);
    var n = new bigmath.expression.node.IndexNode(a, [b, c]);
    var expr = n.compile();

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

    assert.notStrictEqual(f, n);
    assert.deepEqual(f, e);
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

  it ('should stringigy an IndexNode with custom toString', function () {
    //Also checks if the custom functions get passed on to the children
    var customFunction = function (node, options) {
      if (node.type === 'IndexNode') {
        var string = node.object.toString(options) + ' at ';
        node.ranges.forEach(function (range) {
          string += range.toString(options) + ', ';
        });

        return string;
      }
      else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + node.valueType + ')'
      }
    };

    var a = new SymbolNode('a');
    var b = new ConstantNode(1);
    var c = new ConstantNode(2);

    var n = new IndexNode(a, [b, c]);

    assert.equal(n.toString({handler: customFunction}), 'a at const(1, number), const(2, number), ');
  });

  it ('should LaTeX an IndexNode', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode(2),
      new ConstantNode(1)
    ];

    var n = new IndexNode(a, ranges);
    assert.equal(n.toTex(), ' a_{2,1}');

    var n2 = new IndexNode(a, []);
    assert.equal(n2.toTex(), ' a_{}')
  });

  it ('should LaTeX an IndexNode with custom toTex', function () {
    //Also checks if the custom functions get passed on to the children
    var customFunction = function (node, options) {
      if (node.type === 'IndexNode') {
        var latex = node.object.toTex(options) + ' at ';
        node.ranges.forEach(function (range) {
          latex += range.toTex(options) + ', ';
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

    assert.equal(n.toTex({handler: customFunction}), ' a at const\\left(1, number\\right), const\\left(2, number\\right), ');
  });

});
