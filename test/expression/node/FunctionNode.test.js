// test FunctionNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    OperatorNode = require('../../../lib/expression/node/OperatorNode'),
    FunctionNode = require('../../../lib/expression/node/FunctionNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode');

describe('FunctionNode', function() {

  it ('should create a FunctionNode', function () {
    // TODO
  });

  it ('should evaluate a FunctionNode', function () {
    // TODO
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
    // TODO
  });

  it ('should match a FunctionNode', function () {
    // TODO
  });

  it ('should stringify a FunctionNode', function () {
    var a = new ConstantNode('number', '2');
    var x = new SymbolNode('x');
    var o = new OperatorNode('+', 'add', [a, x]);
    var n = new FunctionNode('f', ['x'], o);

    assert.equal(n.toString(), 'function f(x) = 2 + x');
  });

});
