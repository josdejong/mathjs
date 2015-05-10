var assert = require('assert');

var math = require('../../index');
var operators = require('../../lib/expression/operators');
var OperatorNode = math.expression.node.OperatorNode;
var AssignmentNode = math.expression.node.AssignmentNode;
var ConstantNode = math.expression.node.ConstantNode;
var Node = math.expression.node.Node;
var ParenthesisNode = math.expression.node.ParenthesisNode;

var config = {parenthesis: 'keep'};

describe('operators', function () {
  it('should return the precedence of a node', function () {
    var a = new ConstantNode(1);
    var b = new ConstantNode(2);

    var n1 = new AssignmentNode('a', a);
    var n2 = new OperatorNode('or', 'or', [a, b]);

    assert.equal(operators.getPrecedence(n1, config), 0);
    assert.equal(operators.getPrecedence(n2, config), 2);
  });

  it('should return null if precedence is not defined for a node', function () {
    var n = new Node();

    assert.equal(operators.getPrecedence(n, config), null);
  });

  it ('should return the precedence of a ParenthesisNode', function () {
    var c = new ConstantNode(1);

    var op = new OperatorNode('or', 'or', [c, c]);

    var p = new ParenthesisNode(op);

    assert.equal(operators.getPrecedence(p, {parenthesis: 'all'}), operators.getPrecedence(op, config));
    assert.equal(operators.getPrecedence(p, {parenthesis: 'auto'}), operators.getPrecedence(op, config));
    assert.equal(operators.getPrecedence(p, config), null);
  });

  it('should return the associativity of a node', function () {
    var a = new ConstantNode(1);

    var n1 = new OperatorNode('+', 'add', [a, a]);
    var n2 = new OperatorNode('^', 'pow', [a, a]);
    var n3 = new OperatorNode('-', 'unaryMinus', [a]);
    var n4 = new OperatorNode('!', 'factorial', [a]);

    assert.equal(operators.getAssociativity(n1, config), 'left');
    assert.equal(operators.getAssociativity(n2, config), 'right');
    assert.equal(operators.getAssociativity(n3, config), 'right');
    assert.equal(operators.getAssociativity(n4, config), 'left');
  });

  it ('should return the associativity of a ParenthesisNode', function () {
    var c = new ConstantNode(1);

    var op = new OperatorNode('or', 'or', [c, c]);

    var p = new ParenthesisNode(op);

    assert.equal(operators.getAssociativity(p, {parenthesis: 'all'}), operators.getAssociativity(op, config));
    assert.equal(operators.getAssociativity(p, {parenthesis: 'auto'}), operators.getAssociativity(op, config));
    assert.equal(operators.getAssociativity(p, config), null);
  });

  it('should return null if associativity is not defined for a node', function () {
    var a = new ConstantNode(1);

    var n1 = new Node();
    var n2 = new AssignmentNode('a', a);

    assert.equal(operators.getAssociativity(n1, config), null);
    assert.equal(operators.getAssociativity(n2, config), null);
  });

  it('should return if a Node is associative with another Node', function () {
    var a = new ConstantNode(1);

    var n1 = new OperatorNode('+', 'add', [a, a]);
    var n2 = new OperatorNode('-', 'subtract', [a, a]);

    assert.equal(operators.isAssociativeWith(n1, n1, config), true);
    assert.equal(operators.isAssociativeWith(n1, n2, config), true);
    assert.equal(operators.isAssociativeWith(n2, n2, config), false);
    assert.equal(operators.isAssociativeWith(n2, n1, config), false);
  });

  it('should return null if the associativity between two Nodes is not defined', function () {
    var a = new ConstantNode(1);

    var n1 = new Node();
    var n2 = new AssignmentNode('a', a);

    assert.equal(operators.isAssociativeWith(n1, n1, config), null);
    assert.equal(operators.isAssociativeWith(n1, n2, config), null);
    assert.equal(operators.isAssociativeWith(n2, n2, config), null);
    assert.equal(operators.isAssociativeWith(n2, n1, config), null);
  });

  it ('should return if a ParenthesisNode is associative with another Node', function () {
    var a = new ConstantNode(1);

    var add = new OperatorNode('+', 'add', [a, a]);
    var sub = new OperatorNode('-', 'subtract', [a, a]);

    var p = new ParenthesisNode(add);

    assert.equal(operators.isAssociativeWith(p, sub, {parenthesis: 'all'}), true);
    assert.equal(operators.isAssociativeWith(p, sub, {parenthesis: 'auto'}), true);
    assert.equal(operators.isAssociativeWith(p, sub, config), null);
  });
});
