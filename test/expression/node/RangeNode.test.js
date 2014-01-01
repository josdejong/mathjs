// test RangeNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    mathjs = require('../../../index'),
    math = mathjs(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode');

describe('RangeNode', function() {

  it ('should create a RangeNode', function () {
    // TODO
  });

  it ('should evaluate a RangeNode', function () {
    // TODO
  });

  it ('should compile a RangeNode', function () {
    var start = new ConstantNode('number', '0');
    var step = new ConstantNode('number', '2');
    var end = new ConstantNode('number', '10');
    var n = new RangeNode(math, [start, step, end]);

    var expr = n.compile(math);
    assert.deepEqual(expr.eval(), math.matrix([0, 2, 4, 6, 8, 10]));
  });

  it ('should find a RangeNode', function () {
    // TODO
  });

  it ('should match a RangeNode', function () {
    // TODO
  });

  it ('should stringify a RangeNode', function () {
    var start = new ConstantNode('number', '0');
    var step = new ConstantNode('number', '2');
    var end = new ConstantNode('number', '10');
    var n = new RangeNode(math, [start, step, end]);

    assert.equal(n.toString(), '0:2:10');
  });

});
