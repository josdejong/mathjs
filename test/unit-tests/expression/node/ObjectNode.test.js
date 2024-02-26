// test ObjectNode
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const ConstantNode = math.ConstantNode
const SymbolNode = math.SymbolNode
const RangeNode = math.RangeNode
const ObjectNode = math.ObjectNode

// FIXME: a lot of tests depend on order of object keys, whilst the order is officially undeterministic

describe('ObjectNode', function () {
  it('should create an ObjectNode', function () {
    const c = new ConstantNode(1)
    const a = new ObjectNode({ c })
    const b = new ObjectNode()
    assert(a instanceof ObjectNode)
    assert(b instanceof ObjectNode)
    assert.strictEqual(a.type, 'ObjectNode')
    assert.strictEqual(b.type, 'ObjectNode')
  })

  it('should have isObjectNode', function () {
    const node = new ObjectNode({})

    assert(node.isObjectNode)
  })

  it('should throw an error when calling without new operator', function () {
    assert.throws(function () { ObjectNode() }, TypeError)
  })

  it('should throw an error on wrong constructor arguments', function () {
    assert.throws(function () { console.log(new ObjectNode(2)) }, TypeError)
    assert.throws(function () { console.log(new ObjectNode({ a: 2, b: 3 })) }, TypeError)
  })

  it('should evaluate an ObjectNode', function () {
    const c = new ConstantNode(1)
    const a = new ObjectNode({ c })
    const b = new ObjectNode()

    assert.deepStrictEqual(a.compile().evaluate(), { c: 1 })
    assert.deepStrictEqual(b.compile().evaluate(), {})
  })

  it('should compile nested ObjectNodes', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const c = new ConstantNode(3)
    const d = new ConstantNode(4)

    const n2 = new ObjectNode({ a, b })
    const n3 = new ObjectNode({ c, d })
    const n4 = new ObjectNode({ n2, n3 })

    const expr = n4.compile()
    assert.deepStrictEqual(expr.evaluate(), { n2: { a: 1, b: 2 }, n3: { c: 3, d: 4 } })
  })

  it('should filter an ObjectNode', function () {
    const a = new ConstantNode(1)
    const b = new SymbolNode('x')
    const c = new ConstantNode(2)
    const d = new ObjectNode({ a, b, c })

    assert.deepStrictEqual(d.filter(function (node) { return node instanceof ObjectNode }), [d])
    assert.deepStrictEqual(d.filter(function (node) { return node instanceof SymbolNode }), [b])
    assert.deepStrictEqual(d.filter(function (node) { return node instanceof RangeNode }), [])
    assert.deepStrictEqual(d.filter(function (node) { return node instanceof ConstantNode }), [a, c])
    assert.deepStrictEqual(d.filter(function (node) { return node instanceof ConstantNode && node.value === 2 }), [c])
  })

  it('should run forEach on an ObjectNode', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new ObjectNode({ a, b })

    const nodes = []
    const paths = []
    c.forEach(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, c)
    })

    assert.deepStrictEqual(paths, ['properties["a"]', 'properties["b"]'])
    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], a)
    assert.strictEqual(nodes[1], b)
  })

  it('should map an ObjectNode', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new ObjectNode({ a, b })

    const d = new ConstantNode(3)
    const nodes = []
    const paths = []
    const e = c.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, c)

      return (node instanceof SymbolNode) && (node.name === 'x') ? d : node
    })

    assert.deepStrictEqual(paths, ['properties["a"]', 'properties["b"]'])
    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], a)
    assert.strictEqual(nodes[1], b)

    assert.notStrictEqual(e, c)
    assert.deepStrictEqual(e.properties.a, d)
    assert.deepStrictEqual(e.properties.b, b)
  })

  it('should throw an error when the map callback does not return a node', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new ObjectNode({ a, b })

    assert.throws(function () {
      c.map(function () { return undefined })
    }, /Callback function must return a Node/)
  })

  it('should transform an ObjectNodes parameters', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new ObjectNode({ a, b })

    const d = new ConstantNode(3)
    const e = c.transform(function (node) {
      return (node instanceof SymbolNode) && (node.name === 'x') ? d : node
    })

    assert.notStrictEqual(e, c)
    assert.deepStrictEqual(e.properties.a, d)
    assert.deepStrictEqual(e.properties.b, b)
  })

  it('should transform an ObjectNode itself', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new ObjectNode({ a, b })

    const d = new ConstantNode(3)
    const e = c.transform(function (node) {
      return (node instanceof ObjectNode) ? d : node
    })

    assert.notStrictEqual(e, c)
    assert.deepStrictEqual(e, d)
  })

  it('should traverse an ObjectNode', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const c = new ConstantNode(3)
    const d = new ObjectNode({ a, b })
    const e = new ObjectNode({ c, d })

    let count = 0
    e.traverse(function (node, path, parent) {
      count++

      switch (count) {
        case 1:
          assert.strictEqual(path, null)
          assert.strictEqual(node, e)
          assert.strictEqual(parent, null)
          break

        case 2:
          assert.strictEqual(path, 'properties["c"]')
          assert.strictEqual(node, c)
          assert.strictEqual(parent, e)
          break

        case 3:
          assert.strictEqual(path, 'properties["d"]')
          assert.strictEqual(node, d)
          assert.strictEqual(parent, e)
          break

        case 4:
          assert.strictEqual(path, 'properties["a"]')
          assert.strictEqual(node, a)
          assert.strictEqual(parent, d)
          break

        case 5:
          assert.strictEqual(path, 'properties["b"]')
          assert.strictEqual(node, b)
          assert.strictEqual(parent, d)
          break
      }
    })

    assert.strictEqual(count, 5)
  })

  it('should clone an ObjectNode', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new ObjectNode({ a, b })

    const d = c.clone()
    assert(d instanceof ObjectNode)
    assert.deepStrictEqual(c, d)
    assert.notStrictEqual(c, d)
    assert.strictEqual(c.properties.a, d.properties.a)
    assert.strictEqual(c.properties.b, d.properties.b)
  })

  it('test equality another Node', function () {
    const a = new ObjectNode({ a: new SymbolNode('a'), b: new ConstantNode(2) })
    const b = new ObjectNode({ a: new SymbolNode('a'), b: new ConstantNode(2) })
    const c = new ObjectNode({ a: new SymbolNode('a'), b: new ConstantNode(2), c: new ConstantNode(3) })
    const d = new ObjectNode({ a: new SymbolNode('foo'), b: new ConstantNode(2) })
    const e = new ObjectNode({ a: new SymbolNode('a') })
    const f = new SymbolNode('x')

    assert.strictEqual(a.equals(null), false)
    assert.strictEqual(a.equals(undefined), false)
    assert.strictEqual(a.equals(b), true)
    assert.strictEqual(a.equals(c), false)
    assert.strictEqual(a.equals(d), false)
    assert.strictEqual(a.equals(e), false)
    assert.strictEqual(a.equals(f), false)
  })

  it('should stringify an ObjectNode', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const c = new ConstantNode(3)
    const n1 = new ObjectNode({ a, b })
    const n2 = new ObjectNode({ c, n1 })

    assert.strictEqual(n2.toString(), '{"c": 3, "n1": {"a": 1, "b": 2}}')
  })

  it('should stringify an ObjectNode with custom toString', function () {
    const customFunction = function (node, options) {
      if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const n = new ObjectNode({ a, b })

    assert.strictEqual(n.toString({ handler: customFunction }), '{"a": const(1, number), "b": const(2, number)}')
  })

  it('should stringify an ObjectNode with custom toHTML', function () {
    const customFunction = function (node, options) {
      if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const n = new ObjectNode({ a, b })

    assert.strictEqual(n.toHTML({ handler: customFunction }), '<span class="math-parenthesis math-curly-parenthesis">{</span><span class="math-symbol math-property">a</span><span class="math-operator math-assignment-operator math-property-assignment-operator math-binary-operator">:</span>const(1, number)<span class="math-separator">,</span><span class="math-symbol math-property">b</span><span class="math-operator math-assignment-operator math-property-assignment-operator math-binary-operator">:</span>const(2, number)<span class="math-parenthesis math-curly-parenthesis">}</span>')
  })

  it('toJSON and fromJSON', function () {
    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const node = new ObjectNode({ b, c })

    const json = node.toJSON()

    assert.deepStrictEqual(json, {
      mathjs: 'ObjectNode',
      properties: { b, c }
    })

    const parsed = ObjectNode.fromJSON(json)
    assert.deepStrictEqual(parsed, node)
  })

  it('should LaTeX an ObjectNode', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const c = new ConstantNode(3)
    const n1 = new ObjectNode({ a, b })
    const n2 = new ObjectNode({ c, n1 })

    assert.strictEqual(
      n2.toTex(),
      '\\left\\{\\begin{array}{ll}' +
        '\\mathbf{c:} & 3\\\\\n' +
        '\\mathbf{n1:} & \\left\\{\\begin{array}{ll}' +
        '\\mathbf{a:} & 1\\\\\n\\mathbf{b:} & 2\\\\\\end{array}\\right\\}\\\\' +
        '\\end{array}\\right\\}')
  })

  it('should LaTeX an ObjectNode with custom toTex', function () {
    const customFunction = function (node, options) {
      if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + math.typeOf(node.value) + '\\right)'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const n = new ObjectNode({ a, b })

    assert.strictEqual(
      n.toTex({ handler: customFunction }),
      '\\left\\{\\begin{array}{ll}' +
        '\\mathbf{a:} & const\\left(1, number\\right)\\\\\n' +
        '\\mathbf{b:} & const\\left(2, number\\right)\\\\' +
        '\\end{array}\\right\\}')
  })
})
