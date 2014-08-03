// test OperatorNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    OperatorNode = require('../../../lib/expression/node/OperatorNode');

describe('OperatorNode', function() {

  it ('should create an OperatorNode', function () {
    var n = new OperatorNode();
    assert(n instanceof OperatorNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'OperatorNode');
  });

  it ('should throw an error when calling without new operator', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    assert.throws(function () {OperatorNode('+', 'add', [a, b])}, SyntaxError);
  });

  it ('should compile an OperatorNode', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var n = new OperatorNode('+', 'add', [a, b]);

    var expr = n.compile(math);

    assert.equal(expr.eval(), 5);
  });

  it ('should throw an error in case of unresolved operator function', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var n = new OperatorNode('+', 'add', [a, b]);

    var emptyNamespace = {};

    assert.throws(function () {
      n.compile(emptyNamespace);
    }, /Function add missing in provided namespace/);
  });

  it ('should find a OperatorNode', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var n = new OperatorNode('+', 'add', [a, b]);

    assert.deepEqual(n.find({type: OperatorNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}),    []);
    assert.deepEqual(n.find({type: ConstantNode}),  [a, b]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '2'}}),  [a]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '4'}}),  []);
  });

  it ('should find an OperatorNode without contents', function () {
    var n = new OperatorNode();

    assert.deepEqual(n.find({type: OperatorNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}),    []);
  });

  it ('should match a OperatorNode', function () {
    var a = new OperatorNode();
    assert.equal(a.match({type: OperatorNode}),  true);
    assert.equal(a.match({type: ConstantNode}), false);
  });

  it ('should stringify a OperatorNode', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var c = new ConstantNode(4);

    var n = new OperatorNode('+', 'add', [a, b]);
    assert.equal(n.toString(), '2 + 3');
  });

  it ('should stringify a OperatorNode with factorial', function () {
    var a = new ConstantNode(2);
    var n = new OperatorNode('!', 'factorial', [a]);
    assert.equal(n.toString(), '2!');
  });

  it ('should stringify a OperatorNode with unary minus', function () {
    var a = new ConstantNode(2);
    var n = new OperatorNode('-', 'unaryMinus', [a]);
    assert.equal(n.toString(), '-2');
  });

  it ('should stringify a OperatorNode with zero arguments', function () {
    var n = new OperatorNode('foo', 'foo', []);
    assert.equal(n.toString(), 'foo()');
  });

  it ('should stringify a OperatorNode with more than two operators', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var c = new ConstantNode(4);

    var n = new OperatorNode('foo', 'foo', [a, b, c]);
    assert.equal(n.toString(), 'foo(2, 3, 4)');

  });

  it ('should stringify a OperatorNode with nested operator nodes', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var c = new ConstantNode(4);
    var d = new ConstantNode(5);

    var n1 = new OperatorNode('+', 'add', [a, b]);
    var n2 = new OperatorNode('-', 'subtract', [c, d]);
    var n3 = new OperatorNode('*', 'multiply', [n1, n2]);

    assert.equal(n1.toString(), '2 + 3');
    assert.equal(n2.toString(), '4 - 5');
    assert.equal(n3.toString(), '(2 + 3) * (4 - 5)');
  });

  it ('should LaTeX a OperatorNode', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var c = new ConstantNode(4);

    var n = new OperatorNode('+', 'add', [a, b]);
    assert.equal(n.toTex(), '{2}+{3}');
  });

  it ('should LaTeX a OperatorNode with factorial', function () {
    var a = new ConstantNode(2);
    var n = new OperatorNode('!', 'factorial', [a]);
    assert.equal(n.toTex(), '2!');
  });

  it ('should LaTeX a OperatorNode with unary minus', function () {
    var a = new ConstantNode(2);
    var n = new OperatorNode('-', 'unaryMinus', [a]);
    assert.equal(n.toTex(), '-2');
  });

  it ('should LaTeX a OperatorNode with zero arguments', function () {
    var n = new OperatorNode('foo', 'foo', []);
    assert.equal(n.toTex(), 'foo()');
  });

  it ('should LaTeX a OperatorNode with more than two operators', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var c = new ConstantNode(4);

    var n = new OperatorNode('foo', 'foo', [a, b, c]);
    assert.equal(n.toTex(), 'foo(2, 3, 4)');

  });

  it ('should LaTeX a OperatorNode with nested operator nodes', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var c = new ConstantNode(4);
    var d = new ConstantNode(5);

    var n1 = new OperatorNode('+', 'add', [a, b]);
    var n2 = new OperatorNode('-', 'subtract', [c, d]);
    var n3 = new OperatorNode('*', 'multiply', [n1, n2]);

    var m2 = new OperatorNode('*', 'multiply', [n1, c]);
    var m3 = new OperatorNode('-', 'subtract', [m2, d]);

    assert.equal(n1.toTex(), '{2}+{3}');
    assert.equal(n2.toTex(), '{4}-{5}');
    assert.equal(n3.toTex(), '\\left({{2}+{3}}\\right) \\cdot \\left({{4}-{5}}\\right)');
    assert.equal(m3.toTex(), '{\\left({{2}+{3}}\\right) \\cdot {4}}-{5}');
  });

});
