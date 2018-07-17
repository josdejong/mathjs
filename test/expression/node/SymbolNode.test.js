// test SymbolNode
const assert = require('assert')
const math = require('../../../src/main')
const Node = math.expression.node.Node
const ConstantNode = math.expression.node.ConstantNode
const SymbolNode = math.expression.node.SymbolNode
const OperatorNode = math.expression.node.OperatorNode

describe('SymbolNode', function () {
  it('should create a SymbolNode', function () {
    const n = new SymbolNode('sqrt')
    assert(n instanceof SymbolNode)
    assert(n instanceof Node)
    assert.equal(n.type, 'SymbolNode')
  })

  it('should have isSymbolNode', function () {
    const node = new SymbolNode('a')
    assert(node.isSymbolNode)
  })

  it('should throw an error when calling without new operator', function () {
    assert.throws(function () { SymbolNode('sqrt') }, SyntaxError)
  })

  it('should throw an error when calling with wrong arguments', function () {
    assert.throws(function () { console.log(new SymbolNode()) }, TypeError)
    assert.throws(function () { console.log(new SymbolNode(2)) }, TypeError)
  })

  it('should throw an error when evaluating an undefined symbol', function () {
    let scope = {}
    const s = new SymbolNode('foo')
    assert.throws(function () { s.compile().eval(scope) }, Error)
  })

  it('should compile a SymbolNode', function () {
    const s = new SymbolNode('a')

    const expr = s.compile()
    let scope = {a: 5}
    assert.equal(expr.eval(scope), 5)
    assert.throws(function () { expr.eval({}) }, Error)

    const s2 = new SymbolNode('sqrt')
    const expr2 = s2.compile()
    let scope2 = {}
    assert.strictEqual(expr2.eval(scope2), math.sqrt)
  })

  it('should filter a SymbolNode', function () {
    const n = new SymbolNode('x')
    assert.deepEqual(n.filter(function (node) { return node instanceof SymbolNode }), [n])
    assert.deepEqual(n.filter(function (node) { return node.name === 'x' }), [n])
    assert.deepEqual(n.filter(function (node) { return node.name === 'q' }), [])
    assert.deepEqual(n.filter(function (node) { return node instanceof ConstantNode }), [])
  })

  it('should run forEach on a SymbolNode', function () {
    const a = new SymbolNode('a')
    a.forEach(function () {
      assert.ok(false, 'should not execute, symbol has no childs')
    })
  })

  it('should map a SymbolNode', function () {
    const a = new SymbolNode('a')
    const b = a.map(function () {
      assert.ok(false, 'should not execute, symbol has no childs')
    })

    assert.notStrictEqual(b, a)
    assert.deepEqual(b, a)
  })

  it('should transform a SymbolNode', function () {
    const a = new SymbolNode('x')
    const b = new SymbolNode('y')
    const c = a.transform(function (node) {
      return node instanceof SymbolNode && node.name === 'x' ? b : node
    })
    assert.deepEqual(c, b)

    // no match should leave the symbol as is
    const d = a.transform(function (node) {
      return node instanceof SymbolNode && node.name === 'q' ? b : node
    })
    assert.deepEqual(d, a)
  })

  it('should clone a SymbolNode', function () {
    const a = new SymbolNode('x')
    const b = a.clone()

    assert(b instanceof SymbolNode)
    assert.deepEqual(a, b)
    assert.notStrictEqual(a, b)
    assert.equal(a.name, b.name)
  })

  it('test equality another Node', function () {
    const a = new SymbolNode('a')
    const b = new SymbolNode('b')
    const aEqual = new SymbolNode('a')
    const aFake = {
      name: 'a'
    }

    assert.strictEqual(a.equals(null), false)
    assert.strictEqual(a.equals(undefined), false)
    assert.strictEqual(a.equals(aEqual), true)
    assert.strictEqual(a.equals(b), false)
    assert.strictEqual(a.equals(aFake), false)
    assert.strictEqual(a.equals(new ConstantNode(2)), false)
  })

  it('should stringify a SymbolNode', function () {
    const s = new SymbolNode('foo')

    assert.equal(s.toString(), 'foo')
  })

  it('should stringigy a SymbolNode with custom toString', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'SymbolNode') {
        return 'symbol(' + node.name + ')'
      }
    }

    const n = new SymbolNode('a')

    assert.equal(n.toString({handler: customFunction}), 'symbol(a)')
  })

  it('toJSON and fromJSON', function () {
    const a = new SymbolNode('a')

    const json = a.toJSON()

    assert.deepEqual(json, {
      mathjs: 'SymbolNode',
      name: 'a'
    })

    const parsed = SymbolNode.fromJSON(json)
    assert.deepEqual(parsed, a)
  })

  it('should LaTeX a SymbolNode', function () {
    const s = new SymbolNode('foo')

    assert.equal(s.toTex(), ' foo')
  })

  it('should LaTeX a SymbolNode with custom toTex', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'SymbolNode') {
        return 'symbol(' + node.name + ')'
      }
    }

    const n = new SymbolNode('a')

    assert.equal(n.toTex({handler: customFunction}), 'symbol(a)')
  })

  it('should LaTeX a SymbolNode without breaking \\cdot', function () {
    const a = new ConstantNode(1)
    const b = new SymbolNode('Epsilon')

    const mult = new OperatorNode('*', 'multiply', [a, b])

    assert.equal(mult.toTex(), '1\\cdot E')
  })
})
