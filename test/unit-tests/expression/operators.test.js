import assert from 'assert'
import math from '../../../src/defaultInstance.js'
import { getAssociativity, getPrecedence, isAssociativeWith, getOperator } from '../../../src/expression/operators.js'
const OperatorNode = math.OperatorNode
const AssignmentNode = math.AssignmentNode
const SymbolNode = math.SymbolNode
const ConstantNode = math.ConstantNode
const Node = math.Node
const ParenthesisNode = math.ParenthesisNode

describe('operators', function () {
  it('should return the precedence of a node', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n1 = new AssignmentNode(new SymbolNode('a'), a)
    const n2 = new OperatorNode('??', 'nullish', [a, b])
    const n3 = new OperatorNode('or', 'or', [a, b])
    const n4 = math.parse("M'")

    assert.strictEqual(getPrecedence(n1, 'keep'), 0)
    assert.strictEqual(getPrecedence(n2, 'keep'), 17) // nullish coalescing
    assert.strictEqual(getPrecedence(n3, 'keep'), 2) // logical or
    assert.strictEqual(getPrecedence(n4, 'keep'), 19)
  })

  it('should return null if precedence is not defined for a node', function () {
    const n = new Node()

    assert.strictEqual(getPrecedence(n, 'keep'), null)
  })

  it('should return the precedence of a ParenthesisNode', function () {
    const c = new ConstantNode(1)

    const op = new OperatorNode('or', 'or', [c, c])

    const p = new ParenthesisNode(op)

    assert.strictEqual(getPrecedence(p, 'all'), getPrecedence(op, 'all'))
    assert.strictEqual(getPrecedence(p, 'auto'), getPrecedence(op, 'all'))
    assert.strictEqual(getPrecedence(p, 'keep'), null)
  })

  it('should return the associativity of a node', function () {
    const a = new ConstantNode(1)

    const n1 = new OperatorNode('+', 'add', [a, a])
    const n2 = new OperatorNode('^', 'pow', [a, a])
    const n3 = new OperatorNode('-', 'unaryMinus', [a])
    const n4 = new OperatorNode('!', 'factorial', [a])
    const n6 = new OperatorNode('??', 'nullish', [a, a])
    const n5 = math.parse("M'")

    assert.strictEqual(getAssociativity(n1, 'keep'), 'left')
    assert.strictEqual(getAssociativity(n2, 'keep'), 'right')
    assert.strictEqual(getAssociativity(n3, 'keep'), 'right')
    assert.strictEqual(getAssociativity(n4, 'keep'), 'left')
    assert.strictEqual(getAssociativity(n6, 'keep'), 'left')
    assert.strictEqual(getAssociativity(n5, 'keep'), 'left')
  })

  it('should return the associativity of a ParenthesisNode', function () {
    const c = new ConstantNode(1)

    const op = new OperatorNode('or', 'or', [c, c])

    const p = new ParenthesisNode(op)

    assert.strictEqual(getAssociativity(p, 'all'), getAssociativity(op, 'keep'))
    assert.strictEqual(getAssociativity(p, 'auto'), getAssociativity(op, 'keep'))
    assert.strictEqual(getAssociativity(p, 'keep'), null)
  })

  it('should return null if associativity is not defined for a node', function () {
    const a = new ConstantNode(1)

    const n1 = new Node()
    const n2 = new AssignmentNode(new SymbolNode('a'), a)

    assert.strictEqual(getAssociativity(n1, 'keep'), null)
    assert.strictEqual(getAssociativity(n2, 'keep'), null)
  })

  it('should return if a Node is associative with another Node', function () {
    const a = new ConstantNode(1)

    const n1 = new OperatorNode('+', 'add', [a, a])
    const n2 = new OperatorNode('-', 'subtract', [a, a])

    assert.strictEqual(isAssociativeWith(n1, n1, 'keep'), true)
    assert.strictEqual(isAssociativeWith(n1, n2, 'keep'), true)
    assert.strictEqual(isAssociativeWith(n2, n2, 'keep'), false)
    assert.strictEqual(isAssociativeWith(n2, n1, 'keep'), false)
  })

  it('should return null if the associativity between two Nodes is not defined', function () {
    const a = new ConstantNode(1)

    const n1 = new Node()
    const n2 = new AssignmentNode(new SymbolNode('a'), a)

    assert.strictEqual(isAssociativeWith(n1, n1, 'keep'), null)
    assert.strictEqual(isAssociativeWith(n1, n2, 'keep'), null)
    assert.strictEqual(isAssociativeWith(n2, n2, 'keep'), null)
    assert.strictEqual(isAssociativeWith(n2, n1, 'keep'), null)
  })

  it('should return if a ParenthesisNode is associative with another Node', function () {
    const a = new ConstantNode(1)

    const add = new OperatorNode('+', 'add', [a, a])
    const sub = new OperatorNode('-', 'subtract', [a, a])

    const p = new ParenthesisNode(add)

    assert.strictEqual(isAssociativeWith(p, sub, 'all'), true)
    assert.strictEqual(isAssociativeWith(p, sub, 'auto'), true)
    assert.strictEqual(isAssociativeWith(p, sub, 'keep'), null)
  })

  it('should get the operator of a function name', function () {
    assert.strictEqual(getOperator('multiply'), '*')
    assert.strictEqual(getOperator('ctranspose'), "'")
    assert.strictEqual(getOperator('mod'), 'mod')
    assert.strictEqual(getOperator('nullish'), '??')
    assert.strictEqual(getOperator('square'), null)
  })
})
