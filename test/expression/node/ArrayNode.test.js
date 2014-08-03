// test ArrayNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode'),
    ArrayNode = require('../../../lib/expression/node/ArrayNode');

describe('ArrayNode', function() {

  it ('should create an ArrayNode', function () {
    var c = new ConstantNode(1);
    var a = new ArrayNode([c]);
    var b = new ArrayNode([]);
    assert(a instanceof ArrayNode);
    assert(b instanceof ArrayNode);
    assert.equal(a.type, 'ArrayNode');
    assert.equal(b.type, 'ArrayNode');
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {ArrayNode()}, SyntaxError);
  });

  it ('should throw an error on wrong constructor arguments', function () {
    assert.throws(function () {new ArrayNode(2)}, TypeError);
    assert.throws(function () {new ArrayNode([2, 3])}, TypeError);
  });

  it ('should evaluate an ArrayNode', function () {
    var c = new ConstantNode(1);
    var a = new ArrayNode([c]);
    var b = new ArrayNode();

    assert.deepEqual(a.compile(math).eval(), math.matrix([1]));
    assert.deepEqual(b.compile(math).eval(), math.matrix([]));
  });

  it ('should compile an ArrayNode', function () {
    var a = new ConstantNode(1);
    var b = new ConstantNode(2);
    var c = new ConstantNode(3);
    var d = new ConstantNode(4);
    var n = new ArrayNode([a, b, c, d]);

    var expr = n.compile(math);
    assert.deepEqual(expr.eval(), math.matrix([1,2,3,4]));

    var mathArray = math.create({matrix: 'array'});
    var expr2 = n.compile(mathArray);
    assert.deepEqual(expr2.eval(), [1,2,3,4]);
  });

  it ('should compile nested ArrayNodes', function () {
    var a = new ConstantNode(1);
    var b = new ConstantNode(2);
    var c = new ConstantNode(3);
    var d = new ConstantNode(4);

    var n2 = new ArrayNode([a, b]);
    var n3 = new ArrayNode([c, d]);
    var n4 = new ArrayNode([n2, n3]);

    var expr = n4.compile(math);
    assert.deepEqual(expr.eval(), math.matrix([[1,2],[3,4]]));
  });

  it ('should find an ArrayNode', function () {
    var a = new ConstantNode(1);
    var b = new SymbolNode('x');
    var c = new ConstantNode(2);
    var d = new ArrayNode([a, b, c]);

    assert.deepEqual(d.find({type: ArrayNode}),     [d]);
    assert.deepEqual(d.find({type: SymbolNode}),    [b]);
    assert.deepEqual(d.find({type: RangeNode}),     []);
    assert.deepEqual(d.find({type: ConstantNode}),  [a, c]);
    assert.deepEqual(d.find({type: ConstantNode, properties: {value: '2'}}),  [c]);
  });

  it ('should match an ArrayNode', function () {
    var a = new ArrayNode();
    assert.equal(a.match({type: ArrayNode}),  true);
    assert.equal(a.match({type: SymbolNode}), false);
  });

  it ('should stringify an ArrayNode', function () {
    var a = new ConstantNode(1);
    var b = new ConstantNode(2);
    var c = new ConstantNode(3);
    var d = new ConstantNode(4);
    var n = new ArrayNode([a, b, c, d]);

    assert.equal(n.toString(), '[1, 2, 3, 4]');
  });

  it ('should LaTeX an ArrayNode', function () {
    var a = new ConstantNode(1);
    var b = new ConstantNode(2);
    var c = new ConstantNode(3);
    var d = new ConstantNode(4);
    var v1 = new ArrayNode([a, b]);
    var v2 = new ArrayNode([c, d]);
    var n = new ArrayNode([v1, v2]);

    assert.equal(n.toTex(), '\\begin{bmatrix}1&2\\\\3&4\\\\\\end{bmatrix}');
  });

});
