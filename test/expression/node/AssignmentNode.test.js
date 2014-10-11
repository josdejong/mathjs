// test AssignmentNode
var assert = require('assert');
var approx = require('../../../tools/approx');
var math = require('../../../index');
var Node = require('../../../lib/expression/node/Node');
var ConstantNode = require('../../../lib/expression/node/ConstantNode');
var SymbolNode = require('../../../lib/expression/node/SymbolNode');
var ArrayNode = require('../../../lib/expression/node/ArrayNode');
var RangeNode = require('../../../lib/expression/node/RangeNode');
var AssignmentNode = require('../../../lib/expression/node/AssignmentNode');
var OperatorNode = require('../../../lib/expression/node/OperatorNode');

describe('AssignmentNode', function() {

  it ('should create an AssignmentNode', function () {
    var n = new AssignmentNode('a', new Node());
    assert(n instanceof AssignmentNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'AssignmentNode');
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

    var expr = n.compile(math);

    var scope = {};
    assert.equal(expr.eval(scope), 3);
    assert.equal(scope.b, 3);
  });

  it ('should find an AssignmentNode', function () {
    var a = new ConstantNode(1);
    var b = new SymbolNode('x');
    var c = new ConstantNode(2);
    var d = new ArrayNode([a, b, c]);
    var e = new AssignmentNode('array', d);

    assert.deepEqual(e.find({type: AssignmentNode}),[e]);
    assert.deepEqual(e.find({type: SymbolNode}),    [b]);
    assert.deepEqual(e.find({type: RangeNode}),     []);
    assert.deepEqual(e.find({type: ConstantNode}),  [a, c]);
    assert.deepEqual(e.find({type: ConstantNode, properties: {value: '2'}}),  [c]);
  });

  it ('should find an AssignmentNode without expression', function () {
    var e = new AssignmentNode('a', new Node());

    assert.deepEqual(e.find({type: AssignmentNode}),[e]);
    assert.deepEqual(e.find({type: SymbolNode}),    []);
  });

  it ('should match an AssignmentNode', function () {
    var a = new AssignmentNode('a', new Node());
    assert.equal(a.match({type: AssignmentNode}),  true);
    assert.equal(a.match({type: ConstantNode}), false);
  });

  it ('should replace an AssignmentNodes (nested) parameters', function () {
    // a = x + 2
    var a = new SymbolNode('x');
    var b = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [a, b]);
    var d = new AssignmentNode('a', c);

    var e = new ConstantNode(3);
    var f = d.replace({
      type: SymbolNode,
      properties: {name: 'x'},
      replacement: e
    });

    assert.strictEqual(f, d);
    assert.strictEqual(d.expr,  c);
    assert.strictEqual(d.expr.params[0],  e);
    assert.strictEqual(d.expr.params[1],  b);
  });

  it ('should replace an AssignmentNode itself', function () {
    // a = x + 2
    var a = new SymbolNode('add');
    var b = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [a, b]);
    var d = new AssignmentNode('a', c);

    var e = new ConstantNode(5);
    var f = d.replace({
      type: AssignmentNode,
      replacement: e
    });

    assert.strictEqual(f, e);
  });

  it ('should stringify a AssignmentNode', function () {
    var b = new ConstantNode(3);
    var n = new AssignmentNode('b', b);

    assert.equal(n.toString(), 'b = 3');
  });

  it ('should LaTeX a AssignmentNode', function () {
    var b = new ConstantNode(3);
    var n = new AssignmentNode('b', b);

    assert.equal(n.toTex(), '{b}={3}');
  });

});
