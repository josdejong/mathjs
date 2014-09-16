// test AssignmentNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    ArrayNode = require('../../../lib/expression/node/ArrayNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode'),
    AssignmentNode = require('../../../lib/expression/node/AssignmentNode');

describe('AssignmentNode', function() {

  it ('should create a AssignmentNode', function () {
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

  it ('should compile a AssignmentNode', function () {
    var b = new ConstantNode(3);
    var n = new AssignmentNode('b', b);

    var expr = n.compile(math);

    var scope = {};
    assert.equal(expr.eval(scope), 3);
    assert.equal(scope.b, 3);
  });

  it ('should find a AssignmentNode', function () {
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

  it ('should find a AssignmentNode without expression', function () {
    var e = new AssignmentNode('a', new Node());

    assert.deepEqual(e.find({type: AssignmentNode}),[e]);
    assert.deepEqual(e.find({type: SymbolNode}),    []);
  });

  it ('should match a AssignmentNode', function () {
    var a = new AssignmentNode('a', new Node());
    assert.equal(a.match({type: AssignmentNode}),  true);
    assert.equal(a.match({type: ConstantNode}), false);
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
