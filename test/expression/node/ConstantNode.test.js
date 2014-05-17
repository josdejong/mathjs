// test ConstantNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    bigmath = require('../../../index')({number: 'bignumber'}),
    Complex = require('../../../lib/type/Complex'),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode');

describe('ConstantNode', function() {

  it ('should create a ConstantNode', function () {
    var a = new ConstantNode('number', '3');
    assert(a instanceof Node);
    assert.equal(a.type, 'ConstantNode');
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {ConstantNode('number', '3')}, SyntaxError);
  });

  it ('should throw an error in case of wrong construction arguments', function () {
    assert.throws(function () {new ConstantNode('number', 3);}, TypeError);
    assert.throws(function () {new ConstantNode(3);}, TypeError);
    assert.throws(function () {new ConstantNode(Number, '3');}, TypeError);
  });

  it ('should throw an error in case of unknown type of constant', function () {
    assert.throws(function () {new ConstantNode('bla', '3').compile(math);}, TypeError);
  });

  it ('should compile a ConstantNode', function () {
    var expr = new ConstantNode('number', '2.3').compile(math);
    assert.strictEqual(expr.eval(), 2.3);

    expr = new ConstantNode('number', '002.3').compile(math);
    assert.strictEqual(expr.eval(), 2.3);

    expr = new ConstantNode('complex', '3').compile(math);
    assert.deepEqual(expr.eval(), math.complex(0, 3));

    expr = new ConstantNode('string', 'hello').compile(math);
    assert.strictEqual(expr.eval(), 'hello');

    expr = new ConstantNode('boolean', 'true').compile(math);
    assert.strictEqual(expr.eval(), true);

    expr = new ConstantNode('undefined', 'undefined').compile(math);
    assert.strictEqual(expr.eval(), undefined);

    expr = new ConstantNode('null', 'null').compile(math);
    assert.strictEqual(expr.eval(), null);

  });

  it ('should compile a ConstantNode with bigmath', function () {
    var expr = new ConstantNode('number', '2.3').compile(bigmath);
    assert.deepEqual(expr.eval(), new bigmath.type.BigNumber(2.3));
  });

  it ('should find a ConstantNode', function () {
    var a = new ConstantNode('number', '2');
    assert.deepEqual(a.find({type: ConstantNode}),  [a]);
    assert.deepEqual(a.find({type: SymbolNode}), []);
  });

  it ('should match a ConstantNode', function () {
    var a = new ConstantNode('number', '2');
    assert.equal(a.match({type: ConstantNode}),  true);
    assert.equal(a.match({properties: {value: '2'}}), true);
    assert.equal(a.match({properties: {value: '4'}}), false);
    assert.equal(a.match({type: SymbolNode}), false);
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

  it ('should LaTeX a ConstantNode', function () {
    assert.equal(new ConstantNode('number', '3').toTex(), '3');
    assert.deepEqual(new ConstantNode('number', '3', bigmath).toTex(), '3');
    assert.equal(new ConstantNode('string', 'hi').toTex(), '\\text{hi}');
    assert.deepEqual(new ConstantNode('complex', '3').toTex(), '3i');
    assert.equal(new ConstantNode('boolean', 'true').toTex(), 'true');
    assert.equal(new ConstantNode('boolean', 'false').toTex(), 'false');
    assert.equal(new ConstantNode('undefined', 'undefined').toTex(), 'undefined');
    assert.equal(new ConstantNode('null', 'null').toTex(), 'null');
  });

});
