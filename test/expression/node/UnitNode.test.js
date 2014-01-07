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
    // TODO
  });

  it ('should evaluate a UnitNode', function () {
    // TODO
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
    // TODO
  });

  it ('should match a UnitNode', function () {
    // TODO
  });

  it ('should stringify a UnitNode', function () {
    var c = new ConstantNode('number', '5');
    var n = new UnitNode(c, 'cm');

    assert.equal(n.toString(), '5 cm');
  });

});
