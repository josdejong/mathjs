// test AssignmentNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    AssignmentNode = require('../../../lib/expression/node/AssignmentNode');

describe('AssignmentNode', function() {

  it ('should create a AssignmentNode', function () {

  });

  it ('should evaluate a AssignmentNode', function () {
    // TODO
  });

  it ('should compile a AssignmentNode', function () {
    var b = new ConstantNode('number', '3');
    var n = new AssignmentNode('b', b);

    var expr = n.compile(math);

    var scope = {};
    assert.equal(expr.eval(scope), 3);
    assert.equal(scope.b, 3);
  });

  it ('should find a AssignmentNode', function () {
    // TODO
  });

  it ('should match a AssignmentNode', function () {
    // TODO
  });

  it ('should stringify a AssignmentNode', function () {
    var b = new ConstantNode('number', '3');
    var n = new AssignmentNode('b', b);

    assert.equal(n.toString(), 'b = 3');
  });

});
