var assert = require('assert');
var operators = require('../../lib/expression/operators');
var OperatorNode = require('../../lib/expression/node/OperatorNode');
var AssignmentNode = require('../../lib/expression/node/AssignmentNode');
var ConstantNode = require('../../lib/expression/node/ConstantNode');
var Node = require('../../lib/expression/node/Node');

describe('operators', function () {
  it('should return the precedence of a node', function () {
    var a = new ConstantNode(1);
    var b = new ConstantNode(2);

    var n1 = new AssignmentNode('a', a);
    var n2 = new OperatorNode('or', 'or', [a, b]);

    assert.equal(operators.getPrecedence(n1), 0);
    assert.equal(operators.getPrecedence(n2), 2);
  });

  it('should return null if precedence is not defined', function () {
    var n = new Node();

    assert.equal(operators.getPrecedence(n), null);
  });
});
