// test SymbolNode
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const Node = math.Node
const ConstantNode = math.ConstantNode
const ParenthesisNode = math.ParenthesisNode

describe('ParenthesisNode', function () {
  it('should create a ParenthesisNode', function () {
    const a = new ConstantNode(1)

    const n = new ParenthesisNode(a)
    assert(n instanceof ParenthesisNode)
    assert(n instanceof Node)
    assert.strictEqual(n.type, 'ParenthesisNode')
  })

  it('should throw an error when calling without new operator', function () {
    const a = new ConstantNode(1)
    assert.throws(function () { ParenthesisNode(a) }, TypeError)
  })

  it('should throw an error when calling with wrong arguments', function () {
    assert.throws(function () { console.log(new ParenthesisNode()) }, TypeError)
    assert.throws(function () { console.log(new ParenthesisNode(2)) }, TypeError)
  })

  it('should compile a ParenthesisNode', function () {
    const a = new ConstantNode(1)
    const n = new ParenthesisNode(a)

    assert.strictEqual(n.compile().evaluate.toString(), a.compile().evaluate.toString())
  })

  it('should filter a ParenthesisNode', function () {
    const a = new ConstantNode(1)
    const n = new ParenthesisNode(a)

    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ParenthesisNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node.content instanceof ConstantNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) {
      return (typeof node.content !== 'undefined') && (node.content.value === 1)
    }), [n])
    assert.deepStrictEqual(n.filter(function (node) {
      return (typeof node.content !== 'undefined') && (node.content.type === 'ConstantNode')
    }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode }), [a])
  })

  it('should run forEach on a ParenthesisNode', function () {
    let count = 0
    const a = new ConstantNode(1)

    const n = new ParenthesisNode(a)
    n.forEach(function (node, path, _parent) {
      assert.strictEqual(node.type, 'ConstantNode')
      assert.strictEqual(path, 'content')
      assert.deepStrictEqual(_parent, n)
      count++
    })

    assert.strictEqual(count, 1)
  })

  it('should map a ParenthesisNode', function () {
    const a = new ConstantNode(1)
    const b = new ParenthesisNode(a)

    let count = 0

    const c = b.map(function (node, path, _parent) {
      count++
      assert.strictEqual(node.type, 'ConstantNode')
      assert.strictEqual(node.value, 1)
      return new ConstantNode(2)
    })

    assert.strictEqual(count, 1)
    assert.strictEqual(c.content.value, 2)
  })

  it('should transform a ParenthesisNode', function () {
    const c1 = new ConstantNode(1)
    const c2 = new ConstantNode(2)

    const a = new ParenthesisNode(c1)
    const b = new ParenthesisNode(c2)

    const c = a.transform(function (node) {
      return node instanceof ParenthesisNode && node.content.value === 1 ? b : node
    })
    assert.deepStrictEqual(c, b)

    // no match should leave the constant as is
    const d = a.transform(function (node) {
      return node instanceof ParenthesisNode && node.name === 2 ? b : node
    })
    assert.deepStrictEqual(d, a)
  })

  it('should clone a ParenthesisNode', function () {
    const a = new ConstantNode(1)
    const n = new ParenthesisNode(a)
    const clone = n.clone()

    assert(clone instanceof ParenthesisNode)
    assert.deepStrictEqual(n, clone)
    assert.notStrictEqual(n, clone)
    assert.strictEqual(n.content, clone.content)
  })

  it('test equality another Node', function () {
    const a = new ParenthesisNode(new ConstantNode(1))
    const b = new ParenthesisNode(new ConstantNode(1))
    const c = new ParenthesisNode(new ConstantNode(2))
    const d = new ConstantNode(2)

    assert.strictEqual(a.equals(null), false)
    assert.strictEqual(a.equals(undefined), false)
    assert.strictEqual(a.equals(b), true)
    assert.strictEqual(a.equals(c), false)
    assert.strictEqual(a.equals(d), false)
  })

  it('should get the content of a ParenthesisNode', function () {
    const c = new math.ConstantNode(1)
    const p1 = new math.ParenthesisNode(c)
    const p2 = new math.ParenthesisNode(p1)

    assert.strictEqual(p1.content, c)
    assert.strictEqual(p1.getContent(), c)
    assert.deepStrictEqual(p1.getContent(), c)
    assert.strictEqual(p2.getContent(), c)
    assert.deepStrictEqual(p2.getContent(), c)
  })

  it('should stringify a ParenthesisNode', function () {
    const a = new ConstantNode(1)
    const n = new ParenthesisNode(a)

    assert.strictEqual(n.toString(), '(1)')
    assert.strictEqual(n.toString({}), '(1)')
  })

  it('should stringify a ParenthesisNode when not in keep mode', function () {
    const c = new math.ConstantNode(1)

    const p = new math.ParenthesisNode(c)

    assert.strictEqual(p.toString({ parenthesis: 'all' }), '1')
    assert.strictEqual(p.toString({ parenthesis: 'auto' }), '1')
  })

  it('should stringify a ParenthesisNode with custom toString', function () {
    const customFunction = function (node, options) {
      if (node.type === 'ParenthesisNode') {
        return '[' + node.content.toString(options) + ']'
      }
    }

    const c = new math.ConstantNode(1)
    const n = new math.ParenthesisNode(c)

    assert.strictEqual(n.toString({ handler: customFunction }), '[1]')
  })

  it('should stringify a ParenthesisNode with custom toHTML', function () {
    const customFunction = function (node, options) {
      if (node.type === 'ParenthesisNode') {
        return '[' + node.content.toHTML(options) + ']'
      }
    }

    const c = new math.ConstantNode(1)
    const n = new math.ParenthesisNode(c)

    assert.strictEqual(n.toHTML({ handler: customFunction }), '[<span class="math-number">1</span>]')
  })

  it('toJSON and fromJSON', function () {
    const b = new ConstantNode(2)
    const node = new ParenthesisNode(b)

    const json = node.toJSON()

    assert.deepStrictEqual(json, {
      mathjs: 'ParenthesisNode',
      content: b
    })

    const parsed = ParenthesisNode.fromJSON(json)
    assert.deepStrictEqual(parsed, node)
  })

  it('should LaTeX a ParenthesisNode', function () {
    const a = new ConstantNode(1)
    const n = new ParenthesisNode(a)

    assert.strictEqual(n.toTex(), '\\left(1\\right)')
    assert.strictEqual(n.toTex({}), '\\left(1\\right)')
  })

  it('should LaTeX a ParenthesisNode when not in keep mode', function () {
    const c = new math.ConstantNode(1)

    const p = new math.ParenthesisNode(c)

    assert.strictEqual(p.toTex({ parenthesis: 'all' }), '1')
    assert.strictEqual(p.toTex({ parenthesis: 'auto' }), '1')
  })

  it('should LaTeX a ParenthesisNode with custom toTex', function () {
    const customFunction = function (node, options) {
      if (node.type === 'ParenthesisNode') {
        return '\\left[' + node.content.toTex(options) + '\\right]'
      }
    }

    const c = new math.ConstantNode(1)
    const n = new math.ParenthesisNode(c)

    assert.strictEqual(n.toTex({ handler: customFunction }), '\\left[1\\right]')
  })
})
