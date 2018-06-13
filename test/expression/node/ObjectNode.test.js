// test ObjectNode
const assert = require('assert')
const math = require('../../../src/main')
const ConstantNode = math.expression.node.ConstantNode
const SymbolNode = math.expression.node.SymbolNode
const RangeNode = math.expression.node.RangeNode
const ObjectNode = math.expression.node.ObjectNode

// FIXME: a lot of tests depend on order of object keys, whilst the order is officially undeterministic

describe('ObjectNode', function () {
  it('should create an ObjectNode', function () {
    const c = new ConstantNode(1)
    const a = new ObjectNode({c: c})
    const b = new ObjectNode()
    assert(a instanceof ObjectNode)
    assert(b instanceof ObjectNode)
    assert.equal(a.type, 'ObjectNode')
    assert.equal(b.type, 'ObjectNode')
  })

  it('should have isObjectNode', function () {
    const node = new ObjectNode({})

    assert(node.isObjectNode)
  })

  it('should throw an error when calling without new operator', function () {
    assert.throws(function () { ObjectNode() }, SyntaxError)
  })

  it('should throw an error on wrong constructor arguments', function () {
    assert.throws(function () { console.log(new ObjectNode(2)) }, TypeError)
    assert.throws(function () { console.log(new ObjectNode({a: 2, b: 3})) }, TypeError)
  })

  it('should evaluate an ObjectNode', function () {
    const c = new ConstantNode(1)
    const a = new ObjectNode({c: c})
    const b = new ObjectNode()

    assert.deepEqual(a.compile().eval(), {c: 1})
    assert.deepEqual(b.compile().eval(), {})
  })

  it('should compile nested ObjectNodes', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const c = new ConstantNode(3)
    const d = new ConstantNode(4)

    const n2 = new ObjectNode({a: a, b: b})
    const n3 = new ObjectNode({c: c, d: d})
    const n4 = new ObjectNode({n2: n2, n3: n3})

    const expr = n4.compile()
    assert.deepEqual(expr.eval(), {n2: {a: 1, b: 2}, n3: {c: 3, d: 4}})
  })

  it('should filter an ObjectNode', function () {
    const a = new ConstantNode(1)
    const b = new SymbolNode('x')
    const c = new ConstantNode(2)
    const d = new ObjectNode({a: a, b: b, c: c})

    assert.deepEqual(d.filter(function (node) { return node instanceof ObjectNode }), [d])
    assert.deepEqual(d.filter(function (node) { return node instanceof SymbolNode }), [b])
    assert.deepEqual(d.filter(function (node) { return node instanceof RangeNode }), [])
    assert.deepEqual(d.filter(function (node) { return node instanceof ConstantNode }), [a, c])
    assert.deepEqual(d.filter(function (node) { return node instanceof ConstantNode && node.value === 2 }), [c])
  })

  it('should run forEach on an ObjectNode', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new ObjectNode({a: a, b: b})

    const nodes = []
    const paths = []
    c.forEach(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, c)
    })

    assert.deepEqual(paths, ['properties["a"]', 'properties["b"]'])
    assert.equal(nodes.length, 2)
    assert.strictEqual(nodes[0], a)
    assert.strictEqual(nodes[1], b)
  })

  it('should map an ObjectNode', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new ObjectNode({a: a, b: b})

    const d = new ConstantNode(3)
    const nodes = []
    const paths = []
    const e = c.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, c)

      return (node instanceof SymbolNode) && (node.name === 'x') ? d : node
    })

    assert.deepEqual(paths, ['properties["a"]', 'properties["b"]'])
    assert.equal(nodes.length, 2)
    assert.strictEqual(nodes[0], a)
    assert.strictEqual(nodes[1], b)

    assert.notStrictEqual(e, c)
    assert.deepEqual(e.properties['a'], d)
    assert.deepEqual(e.properties['b'], b)
  })

  it('should throw an error when the map callback does not return a node', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new ObjectNode({a: a, b: b})

    assert.throws(function () {
      c.map(function () {})
    }, /Callback function must return a Node/)
  })

  it('should transform an ObjectNodes parameters', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new ObjectNode({a: a, b: b})

    const d = new ConstantNode(3)
    const e = c.transform(function (node) {
      return (node instanceof SymbolNode) && (node.name === 'x') ? d : node
    })

    assert.notStrictEqual(e, c)
    assert.deepEqual(e.properties['a'], d)
    assert.deepEqual(e.properties['b'], b)
  })

  it('should transform an ObjectNode itself', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new ObjectNode({a: a, b: b})

    const d = new ConstantNode(3)
    const e = c.transform(function (node) {
      return (node instanceof ObjectNode) ? d : node
    })

    assert.notStrictEqual(e, c)
    assert.deepEqual(e, d)
  })

  it('should traverse an ObjectNode', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const c = new ConstantNode(3)
    const d = new ObjectNode({a: a, b: b})
    const e = new ObjectNode({c: c, d: d})

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

    assert.equal(count, 5)
  })

  it('should clone an ObjectNode', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new ObjectNode({a: a, b: b})

    const d = c.clone()
    assert(d instanceof ObjectNode)
    assert.deepEqual(c, d)
    assert.notStrictEqual(c, d)
    assert.strictEqual(c.properties['a'], d.properties['a'])
    assert.strictEqual(c.properties['b'], d.properties['b'])
  })

  it('test equality another Node', function () {
    const a = new ObjectNode({a: new SymbolNode('a'), b: new ConstantNode(2)})
    const b = new ObjectNode({a: new SymbolNode('a'), b: new ConstantNode(2)})
    const c = new ObjectNode({a: new SymbolNode('a'), b: new ConstantNode(2), c: new ConstantNode(3)})
    const d = new ObjectNode({a: new SymbolNode('foo'), b: new ConstantNode(2)})
    const e = new ObjectNode({a: new SymbolNode('a')})
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
    const n1 = new ObjectNode({a: a, b: b})
    const n2 = new ObjectNode({c: c, n1: n1})

    assert.equal(n2.toString(), '{"c": 3, "n1": {"a": 1, "b": 2}}')
  })

  it('should stringify an ObjectNode with custom toString', function () {
    const customFunction = function (node, options) {
      if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeof(node.value) + ')'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const n = new ObjectNode({a: a, b: b})

    assert.equal(n.toString({handler: customFunction}), '{"a": const(1, number), "b": const(2, number)}')
  })

  it('toJSON and fromJSON', function () {
    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const node = new ObjectNode({b: b, c: c})

    const json = node.toJSON()

    assert.deepEqual(json, {
      mathjs: 'ObjectNode',
      properties: {b: b, c: c}
    })

    const parsed = ObjectNode.fromJSON(json)
    assert.deepEqual(parsed, node)
  })

  it('should LaTeX an ObjectNode', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const c = new ConstantNode(3)
    const n1 = new ObjectNode({a: a, b: b})
    const n2 = new ObjectNode({c: c, n1: n1})

    assert.equal(n2.toTex(), '\\left\\{\\begin{array}{ll}\\mathbf{c:} & 3\\\\\n\\mathbf{n1:} & \\left\\{\\begin{array}{ll}\\mathbf{a:} & 1\\\\\n\\mathbf{b:} & 2\\\\\\end{array}\\right\\}\\\\\\end{array}\\right\\}')
  })

  it('should LaTeX an ObjectNode with custom toTex', function () {
    const customFunction = function (node, options) {
      if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + math.typeof(node.value) + '\\right)'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const n = new ObjectNode({a: a, b: b})

    assert.equal(n.toTex({handler: customFunction}), '\\left\\{\\begin{array}{ll}\\mathbf{a:} & const\\left(1, number\\right)\\\\\n\\mathbf{b:} & const\\left(2, number\\right)\\\\\\end{array}\\right\\}')
  })
})
