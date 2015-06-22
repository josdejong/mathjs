// test AssignmentNode
var assert = require('assert');
var approx = require('../../../tools/approx');
var math = require('../../../index');
var Node = math.expression.node.Node;
var ConstantNode = math.expression.node.ConstantNode;
var SymbolNode = math.expression.node.SymbolNode;
var RangeNode = math.expression.node.RangeNode;
var ArrayNode = math.expression.node.ArrayNode;
var AssignmentNode = math.expression.node.AssignmentNode;
var OperatorNode = math.expression.node.OperatorNode;

describe('AssignmentNode', function() {

  it ('should create an AssignmentNode', function () {
    var n = new AssignmentNode('a', new Node());
    assert(n instanceof AssignmentNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'AssignmentNode');
  });

  it ('should have isAssignmentNode', function () {
    var node = new AssignmentNode('a', new Node());
    assert(node.isAssignmentNode);
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {AssignmentNode('a', new Node())}, SyntaxError);
  });

  it ('should throw an error when creating an AssignmentNode with a reserved keyword', function () {
    assert.throws(function () {
      new AssignmentNode('end', new Node());
    }, /Illegal symbol name/)
  });

  it ('should throw an error on wrong constructor arguments', function () {
    assert.throws(function () {new AssignmentNode()}, TypeError );
    assert.throws(function () {new AssignmentNode(new Node())}, TypeError );
    assert.throws(function () {new AssignmentNode('a')}, TypeError );
    assert.throws(function () {new AssignmentNode(2, new Node())}, TypeError );
    assert.throws(function () {new AssignmentNode(new Node(), new Node())}, TypeError );
  });

  it ('should compile an AssignmentNode', function () {
    var b = new ConstantNode(3);
    var n = new AssignmentNode('b', b);

    var expr = n.compile();

    var scope = {};
    assert.equal(expr.eval(scope), 3);
    assert.equal(scope.b, 3);
  });

  it ('should filter an AssignmentNode', function () {
    var a = new ConstantNode(1);
    var b = new SymbolNode('x');
    var c = new ConstantNode(2);
    var d = new ArrayNode([a, b, c]);
    var e = new AssignmentNode('array', d);

    assert.deepEqual(e.filter(function (node) {return node instanceof AssignmentNode}),[e]);
    assert.deepEqual(e.filter(function (node) {return node instanceof SymbolNode}),    [b]);
    assert.deepEqual(e.filter(function (node) {return node instanceof RangeNode}),     []);
    assert.deepEqual(e.filter(function (node) {return node instanceof ConstantNode}),  [a, c]);
    assert.deepEqual(e.filter(function (node) {return node instanceof ConstantNode && node.value == '2'}),  [c]);
  });

  it ('should filter an AssignmentNode without expression', function () {
    var e = new AssignmentNode('a', new ConstantNode(2));

    assert.deepEqual(e.filter(function (node) {return node instanceof AssignmentNode}),[e]);
    assert.deepEqual(e.filter(function (node) {return node instanceof SymbolNode}),    []);
  });

  it ('should run forEach on an AssignmentNode', function () {
    // a = x + 2
    var x = new SymbolNode('x');
    var d = new AssignmentNode('a', x);

    var nodes = [];
    var paths = [];
    d.forEach(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, d);
    });

    assert.equal(nodes.length, 1);
    assert.strictEqual(nodes[0], x);
    assert.deepEqual(paths, ['expr']);
  });

  it ('should map an AssignmentNode', function () {
    // a = x + 2
    var x = new SymbolNode('x');
    var d = new AssignmentNode('a', x);

    var e = new ConstantNode(3);
    var nodes = [];
    var paths = [];
    var f = d.map(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, d);
      return node instanceof SymbolNode && node.name == 'x' ? e : node;
    });

    assert.equal(nodes.length, 1);
    assert.strictEqual(nodes[0], x);
    assert.deepEqual(paths, ['expr']);

    assert.notStrictEqual(f, d);
    assert.strictEqual(d.expr,  x);
    assert.strictEqual(f.expr,  e);
  });

  it ('should throw an error when the map callback does not return a node', function () {
    var x = new SymbolNode('x');
    var d = new AssignmentNode('a', x);

    assert.throws(function () {
      d.map(function () {});
    }, /Callback function must return a Node/)
  });

  it ('should transform an AssignmentNodes (nested) parameters', function () {
    // a = x + 2
    var a = new SymbolNode('x');
    var b = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [a, b]);
    var d = new AssignmentNode('a', c);

    var e = new ConstantNode(3);
    var f = d.transform(function (node) {
      return node instanceof SymbolNode && node.name == 'x' ? e : node;
    });

    assert.notStrictEqual(f, d);
    assert.deepEqual(f.expr.args[0],  e);
    assert.deepEqual(f.expr.args[1],  b);
  });

  it ('should transform an AssignmentNode itself', function () {
    // a = x + 2
    var a = new SymbolNode('add');
    var b = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [a, b]);
    var d = new AssignmentNode('a', c);

    var e = new ConstantNode(5);
    var f = d.transform(function (node) {
      return node instanceof AssignmentNode ? e : node;
    });

    assert.notStrictEqual(f, d);
    assert.deepEqual(f, e);
  });

  it ('should traverse an AssignmentNode', function () {
    // a = x + 2
    var b = new ConstantNode(2);
    var a = new AssignmentNode('a', b);

    var count = 0;
    a.traverse(function (node, index, parent) {
      count++;

      switch(count) {
        case 1:
          assert.strictEqual(node, a);
          assert.strictEqual(index, null);
          assert.strictEqual(parent, null);
          break;

        case 2:
          assert.strictEqual(node, b);
          assert.strictEqual(index, 'expr');
          assert.strictEqual(parent, a);
          break;
      }
    });

    assert.equal(count, 2);
  });

  it ('should clone an AssignmentNode', function () {
    // a = x + 2
    var a = new SymbolNode('add');
    var b = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [a, b]);
    var d = new AssignmentNode('a', c);

    var e = d.clone();
    assert(e instanceof AssignmentNode);
    assert.deepEqual(e, d);
    assert.notStrictEqual(e, d);
    assert.strictEqual(e.expr, d.expr);
  });

  it ('should respect the \'all\' parenthesis option', function () {
    var expr = math.parse('a=1');
    assert.equal(expr.toString({parenthesis: 'all'}), 'a = (1)');
    assert.equal(expr.toTex({parenthesis: 'all'}), 'a:=\\left(1\\right)');
  });

  it ('should stringify a AssignmentNode', function () {
    var b = new ConstantNode(3);
    var n = new AssignmentNode('b', b);

    assert.equal(n.toString(), 'b = 3');
  });

  it ('should stringify an AssignmentNode containing and AssignmentNode', function () {
    var a = new ConstantNode(2);
    var b = new AssignmentNode('a', a);

    var n = new AssignmentNode('b', b);

    assert.equal(n.toString(), 'b = (a = 2)');
  });

  it ('should stringify an AssignmentNode with custom toString', function () {
    //Also checks if custom funcions get passed to the children
    var customFunction = function (node, options) {
      if (node.type === 'AssignmentNode') {
        return node.name + ' equals ' + node.expr.toString(options);
      }
      else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + node.valueType + ')'
      }
    };

    var a = new ConstantNode(1);

    var n = new AssignmentNode('a', a);

    assert.equal(n.toString({handler: customFunction}), 'a equals const(1, number)');
  });

  it ('should LaTeX a AssignmentNode', function () {
    var b = new ConstantNode(3);
    var n = new AssignmentNode('b', b);

    assert.equal(n.toTex(), 'b:=3');
  });

  it ('should LaTeX an AssignmentNode containing an AssignmentNode', function () {
    var a = new ConstantNode(2);
    var b = new AssignmentNode('a', a);

    var n = new AssignmentNode('b', b);

    assert.equal(n.toTex(), 'b:=\\left(a:=2\\right)');
  });

  it ('should LaTeX an AssignmentNode with custom toTex', function () {
    //Also checks if custom funcions get passed to the children
    var customFunction = function (node, options) {
      if (node.type === 'AssignmentNode') {
        return node.name + '\\mbox{equals}' + node.expr.toTex(options);
      }
      else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + node.valueType + '\\right)'
      }
    };

    var a = new ConstantNode(1);

    var n = new AssignmentNode('a', a);

    assert.equal(n.toTex({handler: customFunction}), 'a\\mbox{equals}const\\left(1, number\\right)');
  });

});
