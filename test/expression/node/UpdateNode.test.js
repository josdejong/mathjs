// test UpdateNode
var assert = require('assert');
var approx = require('../../../tools/approx');
var math = require('../../../index');
var bigmath = math.create({number: 'bignumber'});
var Node = math.expression.node.Node;
var ConstantNode = math.expression.node.ConstantNode;
var SymbolNode = math.expression.node.SymbolNode;
var RangeNode = math.expression.node.RangeNode;
var IndexNode = math.expression.node.IndexNode;
var UpdateNode = math.expression.node.UpdateNode;

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

  it ('should have isUpdateNode', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(5);
    var node = new UpdateNode(i, v);

    assert(node.isUpdateNode);
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
    var expr = n.compile();

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
        new RangeNode(
          new ConstantNode(1),
          new SymbolNode('end')
        )
    ];
    var b = new SymbolNode('b');
    var n = new UpdateNode(new IndexNode(a, ranges), b);
    var expr = n.compile();

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
        new RangeNode(
          new SymbolNode('end'),
          new ConstantNode(1),
          new ConstantNode(-1)
        )
    ];
    var b = new SymbolNode('b');
    var n = new UpdateNode(new IndexNode(a, ranges), b);
    var expr = n.compile();

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
      new bigmath.expression.node.ConstantNode(2),
      new bigmath.expression.node.ConstantNode(1)
    ];
    var v = new bigmath.expression.node.ConstantNode(5);
    var n = new bigmath.expression.node.UpdateNode(new bigmath.expression.node.IndexNode(a, ranges), v);
    var expr = n.compile();

    var scope = {
      a: [[0, 0], [0, 0]]
    };
    assert.deepEqual(expr.eval(scope), [[0, 0], [bigmath.bignumber(5), 0]]);
    assert.deepEqual(scope, {
      a: [[0, 0], [bigmath.bignumber(5), 0]]
    });
  });

  it ('should filter an UpdateNode', function () {
    var a = new SymbolNode('a');
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(2);
    var n = new UpdateNode(i, v);

    assert.deepEqual(n.filter(function (node) {return node instanceof UpdateNode}),  [n]);
    assert.deepEqual(n.filter(function (node) {return node instanceof SymbolNode}),  [a]);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode}),  [b, c, v]);
    assert.deepEqual(n.filter(function (node) {return node.value ==  '1'}),  [c]);
    assert.deepEqual(n.filter(function (node) {return node.value == '2'}),  [b, v]);
    assert.deepEqual(n.filter(function (node) {return node.name == 'q'}),  []);
  });

  it ('should run forEach on an UpdateNode', function () {
    // A[1, x] = 3
    var a = new SymbolNode('A');
    var b = new ConstantNode(2);
    var c = new SymbolNode('x');
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(3);
    var n = new UpdateNode(i, v);

    var nodes = [];
    var paths = [];
    n.forEach(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, n);
    });

    assert.equal(nodes.length, 2);
    assert.strictEqual(nodes[0], i);
    assert.strictEqual(nodes[1], v);
    assert.deepEqual(paths, ['index', 'expr']);
  });

  it ('should map an UpdateNode', function () {
    // A[1, x] = 3
    var a = new SymbolNode('A');
    var b = new ConstantNode(2);
    var c = new SymbolNode('x');
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(3);
    var n = new UpdateNode(i, v);

    var nodes = [];
    var paths = [];
    var e = new ConstantNode(4);
    var f = n.map(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, n);

      return node instanceof SymbolNode && node.name == 'x' ? e : node;
    });

    assert.equal(nodes.length, 2);
    assert.strictEqual(nodes[0], i);
    assert.strictEqual(nodes[1], v);
    assert.deepEqual(paths, ['index', 'expr']);

    assert.notStrictEqual(f, n);
    assert.deepEqual(f.index.object,  a);
    assert.deepEqual(f.index.ranges[0],  b);
    assert.deepEqual(f.index.ranges[1],  c); // not replaced, is nested
    assert.deepEqual(f.expr, v);
  });

  it ('should throw an error when the map callback does not return a node', function () {
    // A[1, x] = 3
    var a = new SymbolNode('A');
    var b = new ConstantNode(2);
    var c = new SymbolNode('x');
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(3);
    var n = new UpdateNode(i, v);

    assert.throws(function () {
      n.map(function () {});
    }, /Callback function must return a Node/)
  });

  it ('should transform an UpdateNodes (nested) parameters', function () {
    // A[1, x] = 3
    var a = new SymbolNode('A');
    var b = new ConstantNode(2);
    var c = new SymbolNode('x');
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(3);
    var n = new UpdateNode(i, v);

    var e = new ConstantNode(4);
    var f = n.transform(function (node) {
      return node instanceof SymbolNode && node.name == 'x' ? e : node;
    });

    assert.notStrictEqual(f, n);
    assert.deepEqual(f.index.object,  a);
    assert.deepEqual(f.index.ranges[0],  b);
    assert.deepEqual(f.index.ranges[1],  e);
    assert.deepEqual(f.expr, v);
  });

  it ('should transform an UpdateNodes replacement expr', function () {
    // A[1, x] = 3
    var a = new SymbolNode('A');
    var b = new ConstantNode(2);
    var c = new SymbolNode('x');
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(3);
    var n = new UpdateNode(i, v);

    var e = new ConstantNode(4);
    var g = n.transform(function (node) {
      return node instanceof ConstantNode && node.value == '3' ? e : node;
    });

    assert.notStrictEqual(g, n);
    assert.deepEqual(g.index,  i);
    assert.deepEqual(g.index.object,  a);
    assert.deepEqual(g.index.ranges[0],  b);
    assert.deepEqual(g.index.ranges[1],  c);
    assert.deepEqual(g.expr, e);

  });

  it ('should transform an UpdateNode itself', function () {
    // A[1, x] = 3
    var a = new SymbolNode('A');
    var b = new ConstantNode(2);
    var c = new SymbolNode('x');
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(3);
    var n = new UpdateNode(i, v);

    var e = new ConstantNode(5);
    var f = n.transform(function (node) {
      return node instanceof UpdateNode ? e : node;
    });

    assert.deepEqual(f, e);
  });

  it ('should clone an UpdateNode', function () {
    // A[1, x] = 3
    var a = new SymbolNode('A');
    var b = new ConstantNode(2);
    var c = new SymbolNode('x');
    var i = new IndexNode(a, [b, c]);
    var v = new ConstantNode(3);
    var d = new UpdateNode(i, v);

    var e = d.clone();

    assert(e instanceof UpdateNode);
    assert.deepEqual(e, d);
    assert.notStrictEqual(e, d);
    assert.strictEqual(e.index, d.index);
    assert.strictEqual(e.expr, d.expr);
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

  it ('should respect the \'all\' parenthesis option', function () {
    assert.equal(math.parse('a[1]=2').toString({parenthesis: 'all'}), 'a[1] = (2)' );
    assert.equal(math.parse('a[1]=2').toTex({parenthesis: 'all'}), ' a_{1}:=\\left(2\\right)' );
  });

  it ('should LaTeX an UpdateNode', function () {
    var a = new SymbolNode('a');
    var ranges = [
      new ConstantNode(2),
      new ConstantNode(1)
    ];
    var v = new ConstantNode(5);

    var n = new UpdateNode(new IndexNode(a, ranges), v);
    assert.equal(n.toTex(), ' a_{2,1}:=5');
  });

  it ('should stringify an UpdateNode with custom toString', function () {
    //Also checks if the custom functions get passed on to the children
    var customFunction = function (node, options) {
      if (node.type === 'UpdateNode') {
        return node.index.toString(options) + ' equals ' + node.expr.toString(options);
      }
      else if (node.type === 'IndexNode') {
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
    var ranges = [
      new ConstantNode(2),
      new ConstantNode(1)
    ];
    var v = new ConstantNode(5);

    var n = new UpdateNode(new IndexNode(a, ranges), v);

    assert.equal(n.toString({handler: customFunction}), 'a at const(2, number), const(1, number),  equals const(5, number)');
  });

  it ('should LaTeX an UpdateNode with custom toTex', function () {
    //Also checks if the custom functions get passed on to the children
    var customFunction = function (node, options) {
      if (node.type === 'UpdateNode') {
        return node.index.toTex(options) + ' equals ' + node.expr.toTex(options);
      }
      else if (node.type === 'IndexNode') {
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
    var ranges = [
      new ConstantNode(2),
      new ConstantNode(1)
    ];
    var v = new ConstantNode(5);

    var n = new UpdateNode(new IndexNode(a, ranges), v);

    assert.equal(n.toTex({handler: customFunction}), ' a at const\\left(2, number\\right), const\\left(1, number\\right),  equals const\\left(5, number\\right)');
  });

});
