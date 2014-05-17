// test FunctionNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    OperatorNode = require('../../../lib/expression/node/OperatorNode'),
    FunctionNode = require('../../../lib/expression/node/FunctionNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode');

describe('FunctionNode', function() {

  it ('should create a FunctionNode', function () {
    var n = new FunctionNode('f', ['x'], new Node());
    assert(n instanceof FunctionNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'FunctionNode');
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {FunctionNode('f', ['x'], new Node())}, SyntaxError);
  });

  it ('should throw an error on wrong constructor arguments', function () {
    assert.throws(function () {new FunctionNode()}, TypeError);
    assert.throws(function () {new FunctionNode('a')}, TypeError);
    assert.throws(function () {new FunctionNode('a', ['x'])}, TypeError);
    assert.throws(function () {new FunctionNode('a', [2], new Node())}, TypeError);
    assert.throws(function () {new FunctionNode(null, ['x'], new Node())}, TypeError);
  });

  it ('should compile a FunctionNode', function () {
    var a = new ConstantNode('number', '2');
    var x = new SymbolNode('x');
    var o = new OperatorNode('+', 'add', [a, x]);
    var n = new FunctionNode('f', ['x'], o);

    var expr = n.compile(math);
    var scope = {};
    var f = expr.eval(scope);
    assert.equal(typeof scope.f, 'function');
    assert.equal(scope.f(3), 5);
    assert.equal(scope.f(5), 7);
    assert.throws(function () {scope.f()}, SyntaxError);
    assert.throws(function () {scope.f(2, 3)}, SyntaxError);

  });

  it ('should find a FunctionNode', function () {
    var a = new ConstantNode('number', '2');
    var x = new SymbolNode('x');
    var o = new OperatorNode('+', 'add', [a, x]);
    var n = new FunctionNode('f', ['x'], o);

    assert.deepEqual(n.find({type: FunctionNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}),    [x]);
    assert.deepEqual(n.find({type: RangeNode}),     []);
    assert.deepEqual(n.find({type: ConstantNode}),  [a]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '2'}}),  [a]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '4'}}),  []);
  });

  it ('should find a FunctionNode without expression', function () {
    var e = new FunctionNode('f', ['x'], new Node());

    assert.deepEqual(e.find({type: FunctionNode}),  [e]);
    assert.deepEqual(e.find({type: SymbolNode}),    []);
  });

  it ('should match a FunctionNode', function () {
    var a = new FunctionNode('f', ['x'], new Node());
    assert.equal(a.match({type: FunctionNode}),  true);
    assert.equal(a.match({type: SymbolNode}), false);
  });

  it ('should stringify a FunctionNode', function () {
    var a = new ConstantNode('number', '2');
    var x = new SymbolNode('x');
    var o = new OperatorNode('+', 'add', [a, x]);
    var n = new FunctionNode('f', ['x'], o);

    assert.equal(n.toString(), 'function f(x) = 2 + x');
  });

  it ('should LaTeX a FunctionNode', function() {
    var a = new ConstantNode('number', '2');
    var x = new SymbolNode('x');
    var o = new OperatorNode('/', 'divide', [x, a]);
    var p = new OperatorNode('^', 'pow', [o, a]);
    var n = new FunctionNode('f', ['x'], p);

    assert.equal(n.toTex(), 'f\\left({x}\\right)={\\left({\\frac{x}{2}}\\right)^{2}}');
  });

});
