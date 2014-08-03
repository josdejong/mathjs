// test SymbolNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode');

describe('SymbolNode', function() {

  it ('should create a SymbolNode', function () {
    var n = new SymbolNode('sqrt');
    assert(n instanceof SymbolNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'SymbolNode');
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {SymbolNode('sqrt')}, SyntaxError);
  });

  it ('should throw an error when calling with wrong arguments', function () {
    assert.throws(function () {new SymbolNode()}, TypeError);
    assert.throws(function () {new SymbolNode(2)}, TypeError);
  });

  it ('should throw an error when evaluating an undefined symbol', function () {
    var scope = {};
    var s = new SymbolNode('foo');
    assert.throws(function () {s.compile(math).eval(scope)}, Error);
  });

  it ('should compile a SymbolNode', function () {
    var s = new SymbolNode('a');

    var expr = s.compile(math);
    var scope = {a: 5};
    assert.equal(expr.eval(scope), 5);
    assert.throws(function () {expr.eval({})}, Error);

    var s2 = new SymbolNode('sqrt');
    var expr2 = s2.compile(math);
    var scope2 = {};
    assert.strictEqual(expr2.eval(scope2), math.sqrt);
  });

  it ('should find a SymbolNode', function () {
    var n = new SymbolNode('x');
    assert.deepEqual(n.find({type: SymbolNode}),  [n]);
    assert.deepEqual(n.find({properties: {name: 'x'}}),  [n]);
    assert.deepEqual(n.find({properties: {name: 'q'}}),  []);
    assert.deepEqual(n.find({type: ConstantNode}),  []);
  });

  it ('should match a SymbolNode', function () {
    var n = new SymbolNode('x');

    assert.equal(n.match({type: SymbolNode}),  true);
    assert.equal(n.match({properties: {name: 'x'}}),  true);
    assert.equal(n.match({properties: {name: 'q'}}),  false);
    assert.equal(n.match({type: ConstantNode}), false);
  });

  it ('should stringify a SymbolNode', function () {
    var s = new SymbolNode('foo');

    assert.equal(s.toString(), 'foo');
  });

  it ('should LaTeX a SymbolNode', function () {
    var s = new SymbolNode('foo');

    assert.equal(s.toTex(), 'foo');
  });

});
