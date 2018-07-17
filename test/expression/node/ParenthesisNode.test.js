// test SymbolNode
const assert = require('assert')
const math = require('../../../src/main')
const Node = math.expression.node.Node
const ConstantNode = math.expression.node.ConstantNode
const ParenthesisNode = math.expression.node.ParenthesisNode

describe('ParenthesisNode', function () {
  it('should create a ParenthesisNode', function () {
    const a = new ConstantNode(1)

    const n = new ParenthesisNode(a)
    assert(n instanceof ParenthesisNode)
    assert(n instanceof Node)
    assert.equal(n.type, 'ParenthesisNode')
  })

  it('should throw an error when calling without new operator', function () {
    const a = new ConstantNode(1)
    assert.throws(function () { ParenthesisNode(a) }, SyntaxError)
  })

  it('should throw an error when calling with wrong arguments', function () {
    assert.throws(function () { console.log(new ParenthesisNode()) }, TypeError)
    assert.throws(function () { console.log(new ParenthesisNode(2)) }, TypeError)
  })

  it('should compile a ParenthesisNode', function () {
    const a = new ConstantNode(1)
    const n = new ParenthesisNode(a)

    assert.equal(n.compile().eval.toString(), a.compile().eval.toString())
  })

  it('should filter a ParenthesisNode', function () {
    const a = new ConstantNode(1)
    const n = new ParenthesisNode(a)

    assert.deepEqual(n.filter(function (node) { return node instanceof ParenthesisNode }), [n])
    assert.deepEqual(n.filter(function (node) { return node.content instanceof ConstantNode }), [n])
    assert.deepEqual(n.filter(function (node) {
      return (typeof node.content !== 'undefined') && (node.content.value === 1)
    }), [n])
    assert.deepEqual(n.filter(function (node) {
      return (typeof node.content !== 'undefined') && (node.content.type === 'ConstantNode')
    }), [n])
    assert.deepEqual(n.filter(function (node) { return node instanceof ConstantNode }), [a])
  })

  it('should run forEach on a ParenthesisNode', function () {
    let count = 0
    const a = new ConstantNode(1)

    const n = new ParenthesisNode(a)
    n.forEach(function (node, path, _parent) {
      assert.equal(node.type, 'ConstantNode')
      assert.equal(path, 'content')
      assert.deepEqual(_parent, n)
      count++
    })

    assert.equal(count, 1)
  })

  it('should map a ParenthesisNode', function () {
    const a = new ConstantNode(1)
    const b = new ParenthesisNode(a)

    let count = 0

    const c = b.map(function (node, path, _parent) {
      count++
      assert.equal(node.type, 'ConstantNode')
      assert.equal(node.value, 1)
      return new ConstantNode(2)
    })

    assert.equal(count, 1)
    assert.equal(c.content.value, 2)
  })

  it('should transform a ParenthesisNode', function () {
    const c1 = new ConstantNode(1)
    const c2 = new ConstantNode(2)

    const a = new ParenthesisNode(c1)
    const b = new ParenthesisNode(c2)

    const c = a.transform(function (node) {
      return node instanceof ParenthesisNode && node.content.value === 1 ? b : node
    })
    assert.deepEqual(c, b)

    // no match should leave the constant as is
    const d = a.transform(function (node) {
      return node instanceof ParenthesisNode && node.name === 2 ? b : node
    })
    assert.deepEqual(d, a)
  })

  it('should clone a ParenthesisNode', function () {
    const a = new ConstantNode(1)
    const n = new ParenthesisNode(a)
    const clone = n.clone()

    assert(clone instanceof ParenthesisNode)
    assert.deepEqual(n, clone)
    assert.notStrictEqual(n, clone)
    assert.equal(n.content, clone.content)
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
    const c = new math.expression.node.ConstantNode(1)
    const p1 = new math.expression.node.ParenthesisNode(c)
    const p2 = new math.expression.node.ParenthesisNode(p1)

    assert.equal(p1.content, c)
    assert.equal(p1.getContent(), c)
    assert.deepEqual(p1.getContent(), c)
    assert.equal(p2.getContent(), c)
    assert.deepEqual(p2.getContent(), c)
  })

  it('should stringify a ParenthesisNode', function () {
    const a = new ConstantNode(1)
    const n = new ParenthesisNode(a)

    assert.equal(n.toString(), '(1)')
    assert.equal(n.toString({}), '(1)')
  })

  it('should stringify a ParenthesisNode when not in keep mode', function () {
    const c = new math.expression.node.ConstantNode(1)

    const p = new math.expression.node.ParenthesisNode(c)

    assert.equal(p.toString({parenthesis: 'all'}), '1')
    assert.equal(p.toString({parenthesis: 'auto'}), '1')
  })

  it('should stringify a ParenthesisNode with custom toString', function () {
    const customFunction = function (node, options) {
      if (node.type === 'ParenthesisNode') {
        return '[' + node.content.toString(options) + ']'
      }
    }

    const c = new math.expression.node.ConstantNode(1)
    const n = new math.expression.node.ParenthesisNode(c)

    assert.equal(n.toString({handler: customFunction}), '[1]')
  })

  it('toJSON and fromJSON', function () {
    const b = new ConstantNode(2)
    const node = new ParenthesisNode(b)

    const json = node.toJSON()

    assert.deepEqual(json, {
      mathjs: 'ParenthesisNode',
      content: b
    })

    const parsed = ParenthesisNode.fromJSON(json)
    assert.deepEqual(parsed, node)
  })

  it('should LaTeX a ParenthesisNode', function () {
    const a = new ConstantNode(1)
    const n = new ParenthesisNode(a)

    assert.equal(n.toTex(), '\\left(1\\right)')
    assert.equal(n.toTex({}), '\\left(1\\right)')
  })

  it('should LaTeX a ParenthesisNode when not in keep mode', function () {
    const c = new math.expression.node.ConstantNode(1)

    const p = new math.expression.node.ParenthesisNode(c)

    assert.equal(p.toTex({parenthesis: 'all'}), '1')
    assert.equal(p.toTex({parenthesis: 'auto'}), '1')
  })

  it('should LaTeX a ParenthesisNode with custom toTex', function () {
    const customFunction = function (node, options) {
      if (node.type === 'ParenthesisNode') {
        return '\\left[' + node.content.toTex(options) + '\\right]'
      }
    }

    const c = new math.expression.node.ConstantNode(1)
    const n = new math.expression.node.ParenthesisNode(c)

    assert.equal(n.toTex({handler: customFunction}), '\\left[1\\right]')
  })
})
