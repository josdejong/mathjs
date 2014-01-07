// test OperatorNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    OperatorNode = require('../../../lib/expression/node/OperatorNode');

describe('OperatorNode', function() {

  it ('should compile an OperatorNode', function () {
    var a = new ConstantNode('number', '2');
    var b = new ConstantNode('number', '3');
    var n = new OperatorNode('+', 'add', [a, b]);

    var expr = n.compile(math);

    assert.equal(expr.eval(), 5);
  });

  it ('should find a OperatorNode', function () {
    // TODO
  });

  it ('should match a OperatorNode', function () {
    // TODO
  });

  it ('should stringify a OperatorNode', function () {
    var a = new ConstantNode('number', '2');
    var b = new ConstantNode('number', '3');
    var n = new OperatorNode('+', 'add', [a, b]);
    assert.equal(n.toString(), '2 + 3');

    var n2 = new OperatorNode('!', 'factorial', [b]);
    assert.equal(n2.toString(), '3!');

    var n3 = new OperatorNode('-', 'unary', [b]);
    assert.equal(n3.toString(), '-3');
  });

});
