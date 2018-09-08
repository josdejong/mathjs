const assert = require('assert')

const math = require('../../src/main')
const operators = require('../../src/expression/operators')
const OperatorNode = math.expression.node.OperatorNode
const AssignmentNode = math.expression.node.AssignmentNode
const SymbolNode = math.expression.node.SymbolNode
const ConstantNode = math.expression.node.ConstantNode
const Node = math.expression.node.Node
const ParenthesisNode = math.expression.node.ParenthesisNode

describe('operators', function () {
  it('should return the precedence of a node', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n1 = new AssignmentNode(new SymbolNode('a'), a)
    const n2 = new OperatorNode('or', 'or', [a, b])

    assert.strictEqual(operators.getPrecedence(n1, 'keep'), 0)
    assert.strictEqual(operators.getPrecedence(n2, 'keep'), 2)
  })

  it('should return null if precedence is not defined for a node', function () {
    const n = new Node()

    assert.strictEqual(operators.getPrecedence(n, 'keep'), null)
  })

  it('should return the precedence of a ParenthesisNode', function () {
    const c = new ConstantNode(1)

    const op = new OperatorNode('or', 'or', [c, c])

    const p = new ParenthesisNode(op)

    assert.strictEqual(operators.getPrecedence(p, 'all'), operators.getPrecedence(op, 'all'))
    assert.strictEqual(operators.getPrecedence(p, 'auto'), operators.getPrecedence(op, 'all'))
    assert.strictEqual(operators.getPrecedence(p, 'keep'), null)
  })

  it('should return the associativity of a node', function () {
    const a = new ConstantNode(1)

    const n1 = new OperatorNode('+', 'add', [a, a])
    const n2 = new OperatorNode('^', 'pow', [a, a])
    const n3 = new OperatorNode('-', 'unaryMinus', [a])
    const n4 = new OperatorNode('!', 'factorial', [a])

    assert.strictEqual(operators.getAssociativity(n1, 'keep'), 'left')
    assert.strictEqual(operators.getAssociativity(n2, 'keep'), 'right')
    assert.strictEqual(operators.getAssociativity(n3, 'keep'), 'right')
    assert.strictEqual(operators.getAssociativity(n4, 'keep'), 'left')
  })

  it('should return the associativity of a ParenthesisNode', function () {
    const c = new ConstantNode(1)

    const op = new OperatorNode('or', 'or', [c, c])

    const p = new ParenthesisNode(op)

    assert.strictEqual(operators.getAssociativity(p, 'all'), operators.getAssociativity(op, 'keep'))
    assert.strictEqual(operators.getAssociativity(p, 'auto'), operators.getAssociativity(op, 'keep'))
    assert.strictEqual(operators.getAssociativity(p, 'keep'), null)
  })

  it('should return null if associativity is not defined for a node', function () {
    const a = new ConstantNode(1)

    const n1 = new Node()
    const n2 = new AssignmentNode(new SymbolNode('a'), a)

    assert.strictEqual(operators.getAssociativity(n1, 'keep'), null)
    assert.strictEqual(operators.getAssociativity(n2, 'keep'), null)
  })

  it('should return if a Node is associative with another Node', function () {
    const a = new ConstantNode(1)

    const n1 = new OperatorNode('+', 'add', [a, a])
    const n2 = new OperatorNode('-', 'subtract', [a, a])

    assert.strictEqual(operators.isAssociativeWith(n1, n1, 'keep'), true)
    assert.strictEqual(operators.isAssociativeWith(n1, n2, 'keep'), true)
    assert.strictEqual(operators.isAssociativeWith(n2, n2, 'keep'), false)
    assert.strictEqual(operators.isAssociativeWith(n2, n1, 'keep'), false)
  })

  it('should return null if the associativity between two Nodes is not defined', function () {
    const a = new ConstantNode(1)

    const n1 = new Node()
    const n2 = new AssignmentNode(new SymbolNode('a'), a)

    assert.strictEqual(operators.isAssociativeWith(n1, n1, 'keep'), null)
    assert.strictEqual(operators.isAssociativeWith(n1, n2, 'keep'), null)
    assert.strictEqual(operators.isAssociativeWith(n2, n2, 'keep'), null)
    assert.strictEqual(operators.isAssociativeWith(n2, n1, 'keep'), null)
  })

  it('should return if a ParenthesisNode is associative with another Node', function () {
    const a = new ConstantNode(1)

    const add = new OperatorNode('+', 'add', [a, a])
    const sub = new OperatorNode('-', 'subtract', [a, a])

    const p = new ParenthesisNode(add)

    assert.strictEqual(operators.isAssociativeWith(p, sub, 'all'), true)
    assert.strictEqual(operators.isAssociativeWith(p, sub, 'auto'), true)
    assert.strictEqual(operators.isAssociativeWith(p, sub, 'keep'), null)
  })
})
