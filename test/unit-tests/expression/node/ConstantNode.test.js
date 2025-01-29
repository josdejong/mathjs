// test ConstantNode
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bigmath = math.create({ number: 'BigNumber' })
const Node = math.Node
const ConstantNode = math.ConstantNode
const SymbolNode = math.SymbolNode

describe('ConstantNode', function () {
  it('should create a ConstantNode', function () {
    const a = new ConstantNode(3)
    assert(a instanceof Node)
    assert.strictEqual(a.type, 'ConstantNode')
    // TODO: extensively test each of the supported types

    assert.strictEqual(new ConstantNode(3).value, 3)
    assert.strictEqual(new ConstantNode(3n).value, 3n)
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
    assert.throws(function () { ConstantNode(3) }, TypeError)
  })

  it('should compile a ConstantNode', function () {
    let expr = new ConstantNode(2.3).compile()
    assert.strictEqual(expr.evaluate(), 2.3)

    expr = new ConstantNode(2.3).compile()
    assert.strictEqual(expr.evaluate(), 2.3)

    expr = new ConstantNode(4n).compile()
    assert.strictEqual(expr.evaluate(), 4n)

    expr = new ConstantNode('hello').compile()
    assert.strictEqual(expr.evaluate(), 'hello')

    expr = new ConstantNode(true).compile()
    assert.strictEqual(expr.evaluate(), true)

    expr = new ConstantNode(undefined).compile()
    assert.strictEqual(expr.evaluate(), undefined)

    expr = new ConstantNode(null).compile()
    assert.strictEqual(expr.evaluate(), null)
  })

  it('should compile a ConstantNode with bigmath', function () {
    const constantNode = bigmath.parse('2.3')
    assert.ok(constantNode.isConstantNode)
    const expr = constantNode.compile()
    assert.deepStrictEqual(expr.evaluate(), new bigmath.BigNumber(2.3))
  })

  it('should find a ConstantNode', function () {
    const a = new ConstantNode(2)
    assert.deepStrictEqual(a.filter(function (node) { return node instanceof ConstantNode }), [a])
    assert.deepStrictEqual(a.filter(function (node) { return node instanceof SymbolNode }), [])
  })

  it('should leave quotes in strings as is (no escaping)', function () {
    assert.strictEqual(new ConstantNode('"+foo+"').compile().evaluate(), '"+foo+"')
    assert.strictEqual(new ConstantNode('\\"escaped\\"').compile().evaluate(), '\\"escaped\\"')
  })

  it('should find a ConstantNode', function () {
    const a = new ConstantNode(2)
    assert.deepStrictEqual(a.filter(function (node) { return node instanceof ConstantNode }), [a])
    assert.deepStrictEqual(a.filter(function (node) { return node instanceof SymbolNode }), [])
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
      return undefined
    })

    assert.notStrictEqual(b, a)
    assert.deepStrictEqual(b, a)
  })

  it('should transform a ConstantNode', function () {
    const a = new ConstantNode(2)
    const b = new ConstantNode(3)
    const c = a.transform(function (node) {
      return node instanceof ConstantNode && node.value === 2 ? b : node
    })
    assert.deepStrictEqual(c, b)

    // no match should leave the node as is
    const d = a.transform(function (node) {
      return node instanceof ConstantNode && node.value === 99 ? b : node
    })
    assert.notStrictEqual(d, a)
    assert.deepStrictEqual(d, a)
  })

  it('should clone a ConstantNode', function () {
    const a = new ConstantNode(2)
    const b = a.clone()

    assert(b instanceof ConstantNode)
    assert.deepStrictEqual(a, b)
    assert.notStrictEqual(a, b)
    assert.strictEqual(a.value, b.value)
    assert.strictEqual(a.valueType, b.valueType)
  })

  it('test equality another Node', function () {
    const a = new ConstantNode(2)

    assert.strictEqual(a.equals(null), false)
    assert.strictEqual(a.equals(undefined), false)
    assert.strictEqual(a.equals(new ConstantNode(2)), true)
    assert.strictEqual(a.equals(new ConstantNode(3)), false)
    assert.strictEqual(a.equals(new ConstantNode('2')), false)
    assert.strictEqual(a.equals(new SymbolNode('2')), false)
    assert.strictEqual(a.equals({ value: 2 }), false)
  })

  it('should stringify a ConstantNode', function () {
    assert.strictEqual(new ConstantNode(3).toString(), '3')
    assert.deepStrictEqual(new ConstantNode(3).toString(), '3')
    assert.deepStrictEqual(new ConstantNode(3n).toString(), '3')
    assert.deepStrictEqual(new ConstantNode(math.bignumber('1e500')).toString(), '1e+500')
    assert.deepStrictEqual(new ConstantNode(math.fraction(2, 3)).toString(), '2/3')
    assert.strictEqual(new ConstantNode('hi').toString(), '"hi"')
    assert.strictEqual(new ConstantNode('with " double quote').toString(), '"with \\" double quote"')
    assert.strictEqual(new ConstantNode(true).toString(), 'true')
    assert.strictEqual(new ConstantNode(false).toString(), 'false')
    assert.strictEqual(new ConstantNode(undefined).toString(), 'undefined')
    assert.strictEqual(new ConstantNode(null).toString(), 'null')
  })

  it('should stringify a ConstantNode with custom toString', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node) {
      if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ')'
      }
    }

    const n = new ConstantNode(1)

    assert.strictEqual(n.toString({ handler: customFunction }), 'const(1)')
  })

  it('should stringify a ConstantNode with custom toHTML', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node) {
      if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ')'
      }
    }

    const n = new ConstantNode(1)

    assert.strictEqual(n.toHTML({ handler: customFunction }), 'const(1)')
  })

  it('toJSON and fromJSON', function () {
    const a = new ConstantNode(2.3)

    const json = a.toJSON()

    assert.deepStrictEqual(json, {
      mathjs: 'ConstantNode',
      value: 2.3
    })

    const parsed = ConstantNode.fromJSON(json)
    assert.deepStrictEqual(parsed, a)
  })

  it('should LaTeX a ConstantNode', function () {
    assert.strictEqual(new ConstantNode(3).toTex(), '3')
    assert.deepStrictEqual(new ConstantNode(3).toTex(), '3')
    assert.deepStrictEqual(new ConstantNode(42n).toTex(), '42')
    assert.deepStrictEqual(new ConstantNode(math.bignumber('3')).toTex(), '3')
    assert.deepStrictEqual(new ConstantNode(math.bignumber('1.3e7')).toTex(), '1.3\\cdot10^{+7}')
    assert.deepStrictEqual(new ConstantNode(math.bignumber('1e500')).toTex(), '1\\cdot10^{+500}')
    assert.deepStrictEqual(new ConstantNode(math.bignumber('1e-500')).toTex(), '1\\cdot10^{-500}')
    assert.deepStrictEqual(new ConstantNode(math.bignumber('12345678901234567890')).toTex(),
      '1.234567890123456789\\cdot10^{+19}')
    assert.strictEqual(new ConstantNode('hi').toTex(), '\\mathtt{"hi"}')
    assert.strictEqual(new ConstantNode(true).toTex(), 'true')
    assert.strictEqual(new ConstantNode(false).toTex(), 'false')
    assert.strictEqual(new ConstantNode(undefined).toTex(), 'undefined')
    assert.strictEqual(new ConstantNode(null).toTex(), 'null')
  })

  it('should LaTeX a ConstantNode with value Infinity', function () {
    assert.strictEqual(new ConstantNode(Infinity).toTex(), '\\infty')
    assert.strictEqual(new ConstantNode(-Infinity).toTex(), '-\\infty')
    assert.strictEqual(new ConstantNode(math.bignumber('Infinity')).toTex(), '\\infty')
    assert.strictEqual(new ConstantNode(math.bignumber('-Infinity')).toTex(), '-\\infty')
  })

  it('should LaTeX a ConstantNode in exponential notation', function () {
    const n = new ConstantNode(1e10)
    assert.strictEqual(n.toTex(), '1\\cdot10^{+10}')
  })

  it('should LaTeX a ConstantNode with custom toTex', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + '\\right)'
      }
    }

    const n = new ConstantNode(1)

    assert.strictEqual(n.toTex({ handler: customFunction }), 'const\\left(1\\right)')
  })

  it('should LaTeX a ConstantNode with a fraction', function () {
    const positive = new ConstantNode(new math.Fraction(1.5))
    const negative = new ConstantNode(new math.Fraction(-1.5))

    assert.strictEqual(positive.toTex(), '\\frac{3}{2}')
    assert.strictEqual(negative.toTex(), '-\\frac{3}{2}')
  })

  it('should escape strings in toTex', function () {
    const n = new ConstantNode('space tab\tunderscore_bla$/')

    assert.strictEqual(n.toTex(), '\\mathtt{"space~tab\\textbackslash{}tunderscore\\_bla\\$/"}')
  })
})
