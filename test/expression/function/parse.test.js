// test parse
const assert = require('assert')
const math = require('../../../src/main')
const Node = math.expression.node.Node

describe('parse', function () {
  it('should parse an expression', function () {
    const node = math.parse('(5+3)/4')
    assert.ok(node instanceof Node)
    assert.equal(node.compile().eval(), 2)
  })

  it('should parse multiple expressions', function () {
    const nodes = math.parse(['2+3', '4+5'])
    assert.ok(Array.isArray(nodes))
    assert.equal(nodes.length, 2)

    assert.ok(nodes[0] instanceof Node)
    assert.ok(nodes[1] instanceof Node)
    assert.equal(nodes[0].compile().eval(), 5)
    assert.equal(nodes[1].compile().eval(), 9)
  })

  it('should LaTeX parse', function () {
    const expression = math.parse('parse(expr,options)')
    assert.equal(expression.toTex(), '\\mathrm{parse}\\left( expr, options\\right)')
  })
})
