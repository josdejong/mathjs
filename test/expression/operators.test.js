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

  it('should return null if precedence is not defined for a node', function () {
    var n = new Node();

    assert.equal(operators.getPrecedence(n), null);
  });

  it('should return the associativity of a node', function () {
    var a = new ConstantNode(1);

    var n1 = new OperatorNode('+', 'add', [a, a]);
    var n2 = new OperatorNode('^', 'pow', [a, a]);
    var n3 = new OperatorNode('-', 'unaryMinus', [a]);
    var n4 = new OperatorNode('!', 'factorial', [a]);

    assert.equal(operators.getAssociativity(n1), 'left');
    assert.equal(operators.getAssociativity(n2), 'right');
    assert.equal(operators.getAssociativity(n3), 'right');
    assert.equal(operators.getAssociativity(n4), 'left');
  });

  it('should return null if associativity is not defined for a node', function () {
    var a = new ConstantNode(1);

    var n1 = new Node();
    var n2 = new AssignmentNode('a', a);

    assert.equal(operators.getAssociativity(n1), null);
    assert.equal(operators.getAssociativity(n2), null);
  });

  it('should return if a Node is associative with another Node', function () {
    var a = new ConstantNode(1);

    var n1 = new OperatorNode('+', 'add', [a, a]);
    var n2 = new OperatorNode('-', 'subtract', [a, a]);

    assert.equal(operators.isAssociativeWith(n1, n1), true);
    assert.equal(operators.isAssociativeWith(n1, n2), true);
    assert.equal(operators.isAssociativeWith(n2, n2), false);
    assert.equal(operators.isAssociativeWith(n2, n1), false);
  });

  it('should return null if the associativity between two Nodes is not defined', function () {
    var a = new ConstantNode(1);

    var n1 = new Node();
    var n2 = new AssignmentNode('a', a);

    assert.equal(operators.isAssociativeWith(n1, n1), null);
    assert.equal(operators.isAssociativeWith(n1, n2), null);
    assert.equal(operators.isAssociativeWith(n2, n2), null);
    assert.equal(operators.isAssociativeWith(n2, n1), null);
  });
});
