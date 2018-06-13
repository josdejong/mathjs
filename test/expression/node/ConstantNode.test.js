// test ConstantNode
const assert = require('assert')
const math = require('../../../src/main')
const bigmath = require('../../../src/main').create({number: 'BigNumber'})
const Node = math.expression.node.Node
const ConstantNode = math.expression.node.ConstantNode
const SymbolNode = math.expression.node.SymbolNode

describe('ConstantNode', function () {
  it('should create a ConstantNode', function () {
    const a = new ConstantNode(3)
    assert(a instanceof Node)
    assert.equal(a.type, 'ConstantNode')
    // TODO: extensively test each of the supported types

    assert.strictEqual(new ConstantNode(3).value, 3)
    assert.strictEqual(new ConstantNode('hello').value, 'hello')
    assert.strictEqual(new ConstantNode(true).value, true)
    assert.strictEqual(new ConstantNode(false).value, false)
    assert.strictEqual(new ConstantNode(null).value, null)
    assert.strictEqual(new ConstantNode(undefined).value, undefined)
  })

  it('should have isConstantNode', function () {
    const node = new ConstantNode(1)
    assert(node.isConstantNode)
  })

  it('should throw an error when calling without new operator', function () {
    assert.throws(function () { ConstantNode(3) }, SyntaxError)
  })

  it('should compile a ConstantNode', function () {
    let expr = new ConstantNode(2.3).compile()
    assert.strictEqual(expr.eval(), 2.3)

    expr = new ConstantNode(2.3).compile()
    assert.strictEqual(expr.eval(), 2.3)

    expr = new ConstantNode('hello').compile()
    assert.strictEqual(expr.eval(), 'hello')

    expr = new ConstantNode(true).compile()
    assert.strictEqual(expr.eval(), true)

    expr = new ConstantNode(undefined).compile()
    assert.strictEqual(expr.eval(), undefined)

    expr = new ConstantNode(null).compile()
    assert.strictEqual(expr.eval(), null)
  })

  it('should compile a ConstantNode with bigmath', function () {
    const constantNode = bigmath.parse('2.3')
    assert.ok(constantNode.isConstantNode)
    const expr = constantNode.compile()
    assert.deepEqual(expr.eval(), new bigmath.type.BigNumber(2.3))
  })

  it('should find a ConstantNode', function () {
    const a = new ConstantNode(2)
    assert.deepEqual(a.filter(function (node) { return node instanceof ConstantNode }), [a])
    assert.deepEqual(a.filter(function (node) { return node instanceof SymbolNode }), [])
  })

  it('should leave quotes in strings as is (no escaping)', function () {
    assert.strictEqual(new ConstantNode('"+foo+"').compile().eval(), '"+foo+"')
    assert.strictEqual(new ConstantNode('\\"escaped\\"').compile().eval(), '\\"escaped\\"')
  })

  it('should find a ConstantNode', function () {
    const a = new ConstantNode(2)
    assert.deepEqual(a.filter(function (node) { return node instanceof ConstantNode }), [a])
    assert.deepEqual(a.filter(function (node) { return node instanceof SymbolNode }), [])
  })

  it('should run forEach on a ConstantNode', function () {
    const a = new ConstantNode(2)
    a.forEach(function () {
      assert.ok(false, 'should not execute, constant has no childs')
    })
  })

  it('should map a ConstantNode', function () {
    const a = new ConstantNode(2)
    const b = a.map(function () {
      assert.ok(false, 'should not execute, constant has no childs')
    })

    assert.notStrictEqual(b, a)
    assert.deepEqual(b, a)
  })

  it('should transform a ConstantNode', function () {
    const a = new ConstantNode(2)
    const b = new ConstantNode(3)
    const c = a.transform(function (node) {
      return node instanceof ConstantNode && node.value === 2 ? b : node
    })
    assert.deepEqual(c, b)

    // no match should leave the node as is
    const d = a.transform(function (node) {
      return node instanceof ConstantNode && node.value === 99 ? b : node
    })
    assert.notStrictEqual(d, a)
    assert.deepEqual(d, a)
  })

  it('should clone a ConstantNode', function () {
    const a = new ConstantNode(2)
    const b = a.clone()

    assert(b instanceof ConstantNode)
    assert.deepEqual(a, b)
    assert.notStrictEqual(a, b)
    assert.equal(a.value, b.value)
    assert.equal(a.valueType, b.valueType)
  })

  it('test equality another Node', function () {
    const a = new ConstantNode(2)

    assert.strictEqual(a.equals(null), false)
    assert.strictEqual(a.equals(undefined), false)
    assert.strictEqual(a.equals(new ConstantNode(2)), true)
    assert.strictEqual(a.equals(new ConstantNode(3)), false)
    assert.strictEqual(a.equals(new ConstantNode('2')), false)
    assert.strictEqual(a.equals(new SymbolNode('2')), false)
    assert.strictEqual(a.equals({value: 2}), false)
  })

  it('should stringify a ConstantNode', function () {
    assert.equal(new ConstantNode(3).toString(), '3')
    assert.deepEqual(new ConstantNode(3).toString(), '3')
    assert.deepEqual(new ConstantNode(math.bignumber('1e500')).toString(), '1e+500')
    assert.deepEqual(new ConstantNode(math.fraction(2, 3)).toString(), '2/3')
    assert.equal(new ConstantNode('hi').toString(), '"hi"')
    assert.equal(new ConstantNode(true).toString(), 'true')
    assert.equal(new ConstantNode(false).toString(), 'false')
    assert.equal(new ConstantNode(undefined).toString(), 'undefined')
    assert.equal(new ConstantNode(null).toString(), 'null')
  })

  it('should stringify a ConstantNode with custom toString', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node) {
      if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ')'
      }
    }

    const n = new ConstantNode(1)

    assert.equal(n.toString({handler: customFunction}), 'const(1)')
  })

  it('toJSON and fromJSON', function () {
    const a = new ConstantNode(2.3)

    const json = a.toJSON()

    assert.deepEqual(json, {
      mathjs: 'ConstantNode',
      value: 2.3
    })

    const parsed = ConstantNode.fromJSON(json)
    assert.deepEqual(parsed, a)
  })

  it('should LaTeX a ConstantNode', function () {
    assert.equal(new ConstantNode(3).toTex(), '3')
    assert.deepEqual(new ConstantNode(3).toTex(), '3')
    assert.deepEqual(new ConstantNode(math.bignumber('3')).toTex(), '3')
    assert.equal(new ConstantNode('hi').toTex(), '\\mathtt{"hi"}')
    assert.equal(new ConstantNode(true).toTex(), 'true')
    assert.equal(new ConstantNode(false).toTex(), 'false')
    assert.equal(new ConstantNode(undefined).toTex(), 'undefined')
    assert.equal(new ConstantNode(null).toTex(), 'null')
  })

  it('should LaTeX a ConstantNode in exponential notation', function () {
    const n = new ConstantNode(1e10)
    assert.equal(n.toTex(), '1\\cdot10^{+10}')
  })

  it('should LaTeX a ConstantNode with custom toTex', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + '\\right)'
      }
    }

    const n = new ConstantNode(1)

    assert.equal(n.toTex({handler: customFunction}), 'const\\left(1\\right)')
  })

  it('should LaTeX a ConstantNode with a fraction', function () {
    const positive = new ConstantNode(new math.type.Fraction(1.5))
    const negative = new ConstantNode(new math.type.Fraction(-1.5))

    assert.equal(positive.toTex(), '\\frac{3}{2}')
    assert.equal(negative.toTex(), '-\\frac{3}{2}')
  })

  it('should escape strings in toTex', function () {
    const n = new ConstantNode('space tab\tunderscore_bla$/')

    assert.equal(n.toTex(), '\\mathtt{"space~tab\\qquad{}underscore\\_bla\\$/"}')
  })
})
