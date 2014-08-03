// test FunctionNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode'),
    FunctionNode = require('../../../lib/expression/node/FunctionNode');

describe('FunctionNode', function() {

  it ('should create a FunctionNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode(4);
    var n = new FunctionNode(s, [c]);
    assert(n instanceof FunctionNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'FunctionNode');
  });

  it ('should throw an error when calling without new operator', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode(4);
    assert.throws(function () {FunctionNode(s, [c])}, SyntaxError);
  });

  it ('should throw an error when calling with wrong arguments', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode(4);
    assert.throws(function () {new FunctionNode('sqrt', [])}, TypeError);
    assert.throws(function () {new FunctionNode(s, [2, 3])}, TypeError);
    assert.throws(function () {new FunctionNode(s, [c, 3])}, TypeError);
  });

  it ('should compile a FunctionNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode(4);
    var n = new FunctionNode(s, [c]);

    var scope = {};
    assert.equal(n.compile(math).eval(scope), 2);
  });

  it.skip ('should compile a FunctionNode acting on a matrix', function () {
    var s = new SymbolNode('a');
    var n = new FunctionNode(s, [
      new ConstantNode(2),
      new ConstantNode(1)
    ]);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.equal(n.compile(math).eval(scope), 3);
  });

  it.skip ('should compile a FunctionNode acting on a matrix (2)', function () {
    var s = new SymbolNode('a');
    var n = new FunctionNode(s, [
      new ConstantNode(2),
      new RangeNode([
        new ConstantNode(1),
        new SymbolNode('end')
      ])
    ]);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(n.compile(math).eval(scope), [3, 4]);
  });

  it.skip ('should compile a FunctionNode acting on a matrix (3)', function () {
    var s = new SymbolNode('a');
    var n = new FunctionNode(s, [
      new ConstantNode(2),
      new RangeNode([
        new SymbolNode('end'),
        new ConstantNode(1),
        new ConstantNode(-1)
      ])
    ]);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(n.compile(math).eval(scope), [4, 3]);
  });

  it ('should find a FunctionNode', function () {
    var a = new SymbolNode('a'),
        b = new ConstantNode(2),
        c = new ConstantNode(1);
    var n = new FunctionNode(a, [b, c]);

    assert.deepEqual(n.find({type: FunctionNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}),    [a]);
    assert.deepEqual(n.find({type: RangeNode}),     []);
    assert.deepEqual(n.find({type: ConstantNode}),  [b, c]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '2'}}),  [b]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '4'}}),  []);
  });

  it ('should match a FunctionNode', function () {
    var a = new FunctionNode(new Node(), []);
    assert.equal(a.match({type: FunctionNode}),  true);
    assert.equal(a.match({type: SymbolNode}), false);
  });

  it ('should stringify a FunctionNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode(4);
    var n = new FunctionNode(s, [c]);

    assert.equal(n.toString(), 'sqrt(4)');
  });

  it ('should LaTeX a FunctionNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode(4);
    var n = new FunctionNode(s, [c]);

    assert.equal(n.toTex(), '\\sqrt{4}');
  });

});
