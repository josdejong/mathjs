// test ConstantNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    bigmath = require('../../../index')({number: 'bignumber'}),
    Complex = require('../../../lib/type/Complex'),
    BigNumber = require('bignumber.js'),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode');

describe('ConstantNode', function() {

  it ('should create a ConstantNode', function () {
    var n = new ConstantNode('number', '3', math);
    assert.ok(n instanceof Node);
  });

  it ('should throw an error in case of wrong construction arguments', function () {
    assert.throws(function () {new ConstantNode('number', 3);}, TypeError);
    assert.throws(function () {new ConstantNode(3);}, TypeError);
    assert.throws(function () {new ConstantNode(Number, '3');}, TypeError);
  });

  it ('should evaluate a ConstantNode', function () {
    assert.equal(new ConstantNode('number', '3', math).eval(), 3);
    assert.deepEqual(new ConstantNode('number', '3', bigmath).eval(), new BigNumber(3));
    assert.equal(new ConstantNode('string', 'hi').eval(), 'hi');
    assert.deepEqual(new ConstantNode('complex', '3').eval(), new Complex(0, 3));
    assert.equal(new ConstantNode('boolean', 'true').eval(), true);
    assert.equal(new ConstantNode('boolean', 'false').eval(), false);
    assert.equal(new ConstantNode('undefined', 'undefined').eval(), undefined);
    assert.equal(new ConstantNode('null', 'null').eval(), null);
  });

  it ('should throw an error in case of unknown type of constant', function () {
    assert.throws(function () {new ConstantNode('bla', '3').eval();}, TypeError);
  });

  it ('should compile a ConstantNode', function () {
    var expr = new ConstantNode('number', '2.3').compile(math);
    assert.equal(expr.eval(), 2.3);
  });

  it ('should find a ConstantNode', function () {
    // TODO
  });

  it ('should match a ConstantNode', function () {
    // TODO
  });

  it ('should stringify a ConstantNode', function () {
    assert.equal(new ConstantNode('number', '3').toString(), '3');
    assert.deepEqual(new ConstantNode('number', '3', bigmath).toString(), '3');
    assert.equal(new ConstantNode('string', 'hi').toString(), '"hi"');
    assert.deepEqual(new ConstantNode('complex', '3').toString(), '3i');
    assert.equal(new ConstantNode('boolean', 'true').toString(), 'true');
    assert.equal(new ConstantNode('boolean', 'false').toString(), 'false');
    assert.equal(new ConstantNode('undefined', 'undefined').toString(), 'undefined');
    assert.equal(new ConstantNode('null', 'null').toString(), 'null');
  });

});
