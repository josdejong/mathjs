// test ParamsNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode'),
    ParamsNode = require('../../../lib/expression/node/ParamsNode');

describe('ParamsNode', function() {

  it ('should create a ParamsNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode('number', '4');
    var n = new ParamsNode(s, [c]);
    assert(n instanceof ParamsNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'ParamsNode');
  });

  it ('should throw an error when calling without new operator', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode('number', '4');
    assert.throws(function () {ParamsNode(s, [c])}, SyntaxError);
  });

  it ('should throw an error when calling with wrong arguments', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode('number', '4');
    assert.throws(function () {new ParamsNode('sqrt', [])}, TypeError);
    assert.throws(function () {new ParamsNode(s, [2, 3])}, TypeError);
    assert.throws(function () {new ParamsNode(s, [c, 3])}, TypeError);
  });

  it ('should compile a ParamsNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode('number', '4');
    var n = new ParamsNode(s, [c]);

    var scope = {};
    assert.equal(n.compile(math).eval(scope), 2);
  });

  it.skip ('should compile a ParamsNode acting on a matrix', function () {
    var s = new SymbolNode('a');
    var n = new ParamsNode(s, [
      new ConstantNode('number', '2'),
      new ConstantNode('number', '1')
    ]);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.equal(n.compile(math).eval(scope), 3);
  });

  it.skip ('should compile a ParamsNode acting on a matrix (2)', function () {
    var s = new SymbolNode('a');
    var n = new ParamsNode(s, [
      new ConstantNode('number', '2'),
      new RangeNode([
        new ConstantNode('number', '1'),
        new SymbolNode('end')
      ])
    ]);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(n.compile(math).eval(scope), [3, 4]);
  });

  it.skip ('should compile a ParamsNode acting on a matrix (3)', function () {
    var s = new SymbolNode('a');
    var n = new ParamsNode(s, [
      new ConstantNode('number', '2'),
      new RangeNode([
        new SymbolNode('end'),
        new ConstantNode('number', '1'),
        new ConstantNode('number', '-1')
      ])
    ]);

    var scope = {
      a: [[1, 2], [3, 4]]
    };
    assert.deepEqual(n.compile(math).eval(scope), [4, 3]);
  });

  it ('should find a ParamsNode', function () {
    var a = new SymbolNode('a'),
        b = new ConstantNode('number', '2'),
        c = new ConstantNode('number', '1');
    var n = new ParamsNode(a, [b, c]);

    assert.deepEqual(n.find({type: ParamsNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}),    [a]);
    assert.deepEqual(n.find({type: RangeNode}),     []);
    assert.deepEqual(n.find({type: ConstantNode}),  [b, c]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '2'}}),  [b]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '4'}}),  []);
  });

  it ('should match a ParamsNode', function () {
    var a = new ParamsNode(new Node(), []);
    assert.equal(a.match({type: ParamsNode}),  true);
    assert.equal(a.match({type: SymbolNode}), false);
  });

  it ('should stringify a ParamsNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode('number', '4');
    var n = new ParamsNode(s, [c]);

    assert.equal(n.toString(), 'sqrt(4)');
  });

  it ('should LaTeX a ParamsNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode('number', '4');
    var n = new ParamsNode(s, [c]);

    assert.equal(n.toTex(), '\\sqrt{4}');
  });

});
