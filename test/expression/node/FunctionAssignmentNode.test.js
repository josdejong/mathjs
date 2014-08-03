// test FunctionAssignmentNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    OperatorNode = require('../../../lib/expression/node/OperatorNode'),
    FunctionAssignmentNode = require('../../../lib/expression/node/FunctionAssignmentNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode');

describe('FunctionAssignmentNode', function() {

  it ('should create a FunctionAssignmentNode', function () {
    var n = new FunctionAssignmentNode('f', ['x'], new Node());
    assert(n instanceof FunctionAssignmentNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'FunctionAssignmentNode');
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {FunctionAssignmentNode('f', ['x'], new Node())}, SyntaxError);
  });

  it ('should throw an error on wrong constructor arguments', function () {
    assert.throws(function () {new FunctionAssignmentNode()}, TypeError);
    assert.throws(function () {new FunctionAssignmentNode('a')}, TypeError);
    assert.throws(function () {new FunctionAssignmentNode('a', ['x'])}, TypeError);
    assert.throws(function () {new FunctionAssignmentNode('a', [2], new Node())}, TypeError);
    assert.throws(function () {new FunctionAssignmentNode(null, ['x'], new Node())}, TypeError);
  });

  it ('should compile a FunctionAssignmentNode', function () {
    var a = new ConstantNode(2);
    var x = new SymbolNode('x');
    var o = new OperatorNode('+', 'add', [a, x]);
    var n = new FunctionAssignmentNode('f', ['x'], o);

    var expr = n.compile(math);
    var scope = {};
    var f = expr.eval(scope);
    assert.equal(typeof scope.f, 'function');
    assert.equal(scope.f(3), 5);
    assert.equal(scope.f(5), 7);
    assert.throws(function () {scope.f()}, SyntaxError);
    assert.throws(function () {scope.f(2, 3)}, SyntaxError);

  });

  it ('should find a FunctionAssignmentNode', function () {
    var a = new ConstantNode(2);
    var x = new SymbolNode('x');
    var o = new OperatorNode('+', 'add', [a, x]);
    var n = new FunctionAssignmentNode('f', ['x'], o);

    assert.deepEqual(n.find({type: FunctionAssignmentNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}),    [x]);
    assert.deepEqual(n.find({type: RangeNode}),     []);
    assert.deepEqual(n.find({type: ConstantNode}),  [a]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '2'}}),  [a]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '4'}}),  []);
  });

  it ('should throw an error when creating a FunctionAssignmentNode with a reserved keyword', function () {
    assert.throws(function () {
      new FunctionAssignmentNode('end', ['x'], new Node());
    }, /Illegal function name/)
  });

  it ('should find a FunctionAssignmentNode without expression', function () {
    var e = new FunctionAssignmentNode('f', ['x'], new Node());

    assert.deepEqual(e.find({type: FunctionAssignmentNode}),  [e]);
    assert.deepEqual(e.find({type: SymbolNode}),    []);
  });

  it ('should match a FunctionAssignmentNode', function () {
    var a = new FunctionAssignmentNode('f', ['x'], new Node());
    assert.equal(a.match({type: FunctionAssignmentNode}),  true);
    assert.equal(a.match({type: SymbolNode}), false);
  });

  it ('should stringify a FunctionAssignmentNode', function () {
    var a = new ConstantNode(2);
    var x = new SymbolNode('x');
    var o = new OperatorNode('+', 'add', [a, x]);
    var n = new FunctionAssignmentNode('f', ['x'], o);

    assert.equal(n.toString(), 'function f(x) = 2 + x');
  });

  it ('should LaTeX a FunctionAssignmentNode', function() {
    var a = new ConstantNode(2);
    var x = new SymbolNode('x');
    var o = new OperatorNode('/', 'divide', [x, a]);
    var p = new OperatorNode('^', 'pow', [o, a]);
    var n = new FunctionAssignmentNode('f', ['x'], p);

    assert.equal(n.toTex(), 'f\\left({x}\\right)={\\left({\\frac{x}{2}}\\right)^{2}}');
  });

});
