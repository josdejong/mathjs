// test BlockNode
var assert = require('assert');
var approx = require('../../../tools/approx');
var math = require('../../../index');
var Node = require('../../../lib/expression/node/Node');
var ConstantNode = require('../../../lib/expression/node/ConstantNode');
var SymbolNode = require('../../../lib/expression/node/SymbolNode');
var RangeNode = require('../../../lib/expression/node/RangeNode');
var AssignmentNode = require('../../../lib/expression/node/AssignmentNode');
var BlockNode = require('../../../lib/expression/node/BlockNode');
var ResultSet = require('../../../lib/type/ResultSet');

describe('BlockNode', function() {

  it ('should create a BlockNode', function () {
    var n = new BlockNode();
    assert(n instanceof BlockNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'BlockNode');
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {BlockNode()}, SyntaxError);
  });

  it ('should throw an error when adding invalid nodes', function () {
    var n = new BlockNode();
    assert.throws(function () {n.add()}, TypeError);
    assert.throws(function () {n.add(2)}, TypeError);
    assert.throws(function () {n.add(new Node(), 2)}, TypeError);
  });

  it ('should compile and evaluate a BlockNode', function () {
    var n = new BlockNode();
    n.add(new ConstantNode(5), true);
    n.add(new AssignmentNode('foo', new ConstantNode(3)), false);
    n.add(new SymbolNode('foo'), true);

    var scope = {};
    assert.deepEqual(n.compile(math).eval(scope), new ResultSet([5, 3]));
    assert.deepEqual(scope, {foo: 3});
  });

  it ('expressions should be visible by default', function () {
    var n = new BlockNode();
    n.add(new ConstantNode(5));

    assert.deepEqual(n.compile(math).eval(), new ResultSet([5]));
  });

  it ('should filter a BlockNode', function () {
    var a = new ConstantNode(5);
    var b2 = new ConstantNode(3);
    var b = new AssignmentNode('foo', b2);
    var c = new SymbolNode('foo');
    var d = new BlockNode();
    d.add(a, true);
    d.add(b, false);
    d.add(c, true);

    assert.deepEqual(d.filter(function (node) {return node instanceof BlockNode}),     [d]);
    assert.deepEqual(d.filter(function (node) {return node instanceof SymbolNode}),    [c]);
    assert.deepEqual(d.filter(function (node) {return node instanceof RangeNode}),     []);
    assert.deepEqual(d.filter(function (node) {return node instanceof ConstantNode}),  [a, b2]);
    assert.deepEqual(d.filter(function (node) {return node instanceof ConstantNode && node.value == '3'}),  [b2]);
  });

  it ('should transform a BlockNodes parameters', function () {
    // [x, 2]
    var a = new BlockNode();
    var b = new SymbolNode('x');
    var c = new ConstantNode(2);
    a.add(b);
    a.add(c);

    var d = new ConstantNode(3);
    var e = a.transform(function (node) {
      return node instanceof SymbolNode && node.name == 'x' ? d : node;
    });

    assert.notStrictEqual(e, a);
    assert.deepEqual(e.nodes[0].node,  d);
    assert.deepEqual(e.nodes[1].node,  c);
  });

  it ('should transform a BlockNode itself', function () {
    // [x, 2]
    var a = new BlockNode();

    var d = new ConstantNode(3);
    var e = a.transform(function (node) {
      return node instanceof BlockNode ? d : node;
    });
    assert.strictEqual(e, d);
  });

  it ('should clone a BlockNode', function () {
    // [x, 2]
    var a = new BlockNode();
    var b = new SymbolNode('x');
    var c = new ConstantNode(2);
    a.add(b);
    a.add(c);

    var d = a.clone();
    assert(d instanceof BlockNode);
    assert.deepEqual(a, d);
    assert.notStrictEqual(a, d);
    assert.notStrictEqual(a.nodes[0], d.nodes[0]);
    assert.notStrictEqual(a.nodes[1], d.nodes[1]);
  });

  it ('should stringify a BlockNode', function () {
    var n = new BlockNode();
    n.add(new ConstantNode(5), true);
    n.add(new AssignmentNode('foo', new ConstantNode(3)), false);
    n.add(new SymbolNode('foo'), true);

    assert.equal(n.toString(), '5\nfoo = 3;\nfoo');
  });

  it ('should LaTeX a BlockNode', function () {
    var n = new BlockNode();
    n.add(new ConstantNode(5), true);
    n.add(new AssignmentNode('foo', new ConstantNode(3)), false);
    n.add(new SymbolNode('foo'), true);

    assert.equal(n.toTex(), '5\n{foo}={3};\nfoo');
  });

});
