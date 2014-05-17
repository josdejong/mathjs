// test UnitNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    UnitNode = require('../../../lib/expression/node/UnitNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode');

describe('UnitNode', function() {

  it ('should create a UnitNode', function () {
    var c = new ConstantNode('number', '5');
    var n = new UnitNode(c, 'cm');
    assert(n instanceof UnitNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'UnitNode');
  });

  it ('should throw an error when calling without new operator', function () {
    var c = new ConstantNode('number', '5');
    assert.throws(function () {UnitNode(c, 'cm')}, SyntaxError);
  });

  it ('should throw an error when calling with wrong arguments', function () {
    var c = new ConstantNode('number', '5');
    assert.throws(function () {new UnitNode()}, TypeError);
    assert.throws(function () {new UnitNode(2, 'cm')}, TypeError);
    assert.throws(function () {new UnitNode(c, new Node())}, TypeError);
    assert.throws(function () {new UnitNode(c, 2)}, TypeError);
  });

  it ('should compile a UnitNode', function () {
    var c = new ConstantNode('number', '5');
    var n = new UnitNode(c, 'cm');
    assert.deepEqual(n.compile(math).eval(), new math.type.Unit(5, 'cm'));

    var s = new SymbolNode('foo');
    var n2 = new UnitNode(s, 'inch');
    var scope = {foo: 8};
    assert.deepEqual(n2.compile(math).eval(scope), new math.type.Unit(8, 'inch'));
  });

  it ('should find a UnitNode', function () {
    var c = new ConstantNode('number', '5');
    var n = new UnitNode(c, 'cm');

    assert.deepEqual(n.find({type: UnitNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}),  []);
    assert.deepEqual(n.find({type: ConstantNode}),  [c]);
    assert.deepEqual(n.find({properties: {value: '5'}}),  [c]);
    assert.deepEqual(n.find({properties: {name: 'q'}}),  []);
  });

  it ('should match a UnitNode', function () {
    var c = new ConstantNode('number', '5');
    var n = new UnitNode(c, 'cm');

    assert.equal(n.match({type: UnitNode}),  true);
    assert.equal(n.match({properties: {unit: 'cm'}}),  true);
    assert.equal(n.match({properties: {unit: 'km'}}),  false);
    assert.equal(n.match({properties: {value: '5'}}),  false);
    assert.equal(n.match({type: ConstantNode}), false);
  });

  it ('should stringify a UnitNode', function () {
    var c = new ConstantNode('number', '5');
    var n = new UnitNode(c, 'cm');

    assert.equal(n.toString(), '5 cm');
  });

  it ('should LaTeX a UnitNode', function () {
    var c = new ConstantNode('number', '5');
    var n = new UnitNode(c, 'cm');
    var d = new UnitNode(c, 'deg');

    assert.equal(n.toTex(), '5\\,\\mathrm{cm}');
    assert.equal(d.toTex(), '5^{\\circ}');
  });

});
