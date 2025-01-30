// test IndexNode
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const Node = math.Node
const ConstantNode = math.ConstantNode
const SymbolNode = math.SymbolNode
const IndexNode = math.IndexNode
const RangeNode = math.RangeNode

describe('IndexNode', function () {
  it('should create a IndexNode', function () {
    const n = new IndexNode([])
    assert(n instanceof IndexNode)
    assert(n instanceof Node)
    assert.strictEqual(n.type, 'IndexNode')
  })

  it('should have isIndexNode', function () {
    const node = new IndexNode([])
    assert(node.isIndexNode)
  })

  it('should throw an error when calling with wrong arguments', function () {
    assert.throws(function () { console.log(new IndexNode()) }, TypeError)
    assert.throws(function () { console.log(new IndexNode('a')) }, TypeError)
    assert.throws(function () { console.log(new IndexNode(new Node())) }, TypeError)
    assert.throws(function () { console.log(new IndexNode([new Node(), 3])) }, TypeError)
  })

  it('should throw an error when calling without new operator', function () {
    assert.throws(function () { IndexNode([]) }, TypeError)
  })

  it('should filter an IndexNode', function () {
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new IndexNode([b, c])

    assert.deepStrictEqual(n.filter(function (node) { return node instanceof IndexNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof RangeNode }), [])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode }), [b, c])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode && node.value === 2 }), [b])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode && node.value === 4 }), [])
  })

  it('should filter an empty IndexNode', function () {
    const n = new IndexNode([])

    assert.deepStrictEqual(n.filter(function (node) { return node instanceof IndexNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode }), [])
  })

  it('should run forEach on an IndexNode', function () {
    const b = new ConstantNode(2n)
    const c = new ConstantNode(1n)
    const n = new IndexNode([b, c])

    const nodes = []
    const paths = []
    n.forEach(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, n)
    })

    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], b)
    assert.strictEqual(nodes[1], c)
    assert.deepStrictEqual(paths, ['dimensions[0]', 'dimensions[1]'])
  })

  it('should map an IndexNode', function () {
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new IndexNode([b, c])

    const nodes = []
    const paths = []
    const e = new ConstantNode(-1)
    const f = n.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, n)

      return node.isConstantNode && node.value === 1 ? e : node
    })

    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], b)
    assert.strictEqual(nodes[1], c)
    assert.deepStrictEqual(paths, ['dimensions[0]', 'dimensions[1]'])

    assert.notStrictEqual(f, n)
    assert.deepStrictEqual(f.dimensions[0], b)
    assert.deepStrictEqual(f.dimensions[1], e)
  })

  it('should copy dotNotation property when mapping an IndexNode', function () {
    const b = new ConstantNode('objprop')
    const n = new IndexNode([b], true)
    const f = n.map(function (node, path, parent) {
      return node
    })

    assert.strictEqual(n.dotNotation, f.dotNotation)
  })

  it('should throw an error when the map callback does not return a node', function () {
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new IndexNode([b, c])

    assert.throws(function () {
      n.map(function () { return undefined })
    }, /Callback function must return a Node/)
  })

  it('should transform an IndexNodes (nested) parameters', function () {
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new IndexNode([b, c])

    const e = new SymbolNode('c')
    const f = n.transform(function (node) {
      return node.isConstantNode && node.value === 1 ? e : node
    })

    assert.notStrictEqual(f, n)
    assert.deepStrictEqual(f.dimensions[0], b)
    assert.deepStrictEqual(f.dimensions[1], e)
  })

  it('should transform an IndexNode itself', function () {
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new IndexNode([b, c])

    const e = new ConstantNode(5)
    const f = n.transform(function (node) {
      return node.isIndexNode ? e : node
    })

    assert.notStrictEqual(f, n)
    assert.deepStrictEqual(f, e)
  })

  it('should clone an IndexNode', function () {
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new IndexNode([b, c])

    const d = n.clone()
    assert(d.isIndexNode)
    assert.deepStrictEqual(d, n)
    assert.notStrictEqual(d, n)
    assert.notStrictEqual(d.dimensions, n.dimensions)
    assert.strictEqual(d.dimensions[0], n.dimensions[0])
    assert.strictEqual(d.dimensions[1], n.dimensions[1])
  })

  it('should clone an IndexNode with dotNotation property', function () {
    const b = new ConstantNode('objprop')
    const n = new IndexNode([b], true)
    const f = n.clone()

    assert.strictEqual(n.dotNotation, f.dotNotation)
  })

  it('test equality another Node', function () {
    const a = new IndexNode([new ConstantNode(2), new ConstantNode(1)])
    const b = new IndexNode([new ConstantNode(2), new ConstantNode(1)])
    const c = new IndexNode([new ConstantNode(2)])
    const d = new IndexNode([new ConstantNode(2), new ConstantNode(1), new ConstantNode(3)])
    const e = new IndexNode([new ConstantNode(2), new ConstantNode(4)])
    const f = new SymbolNode('x')

    assert.strictEqual(a.equals(null), false)
    assert.strictEqual(a.equals(undefined), false)
    assert.strictEqual(a.equals(b), true)
    assert.strictEqual(a.equals(c), false)
    assert.strictEqual(a.equals(d), false)
    assert.strictEqual(a.equals(e), false)
    assert.strictEqual(a.equals(f), false)
  })

  it('should stringify an IndexNode', function () {
    const dimensions = [
      new ConstantNode(2),
      new ConstantNode(1)
    ]

    const n = new IndexNode(dimensions)
    assert.strictEqual(n.toString(), '[2, 1]')

    const n2 = new IndexNode([])
    assert.strictEqual(n2.toString(), '[]')
  })

  it('should stringify an IndexNode with dot notation', function () {
    const dimensions = [new ConstantNode('a')]

    const n = new IndexNode(dimensions, true)
    assert.strictEqual(n.toString(), '.a')
  })

  it('should stringify an IndexNode with custom toString', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'IndexNode') {
        return node.dimensions.map(function (range) {
          return range.toString(options)
        }).join(', ')
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const n = new IndexNode([b, c])

    assert.strictEqual(n.toString({ handler: customFunction }), 'const(1, number), const(2, number)')
  })

  it('should stringify an IndexNode with custom toHTML', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'IndexNode') {
        return node.dimensions.map(function (range) {
          return range.toHTML(options)
        }).join(', ')
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const n = new IndexNode([b, c])

    assert.strictEqual(n.toHTML({ handler: customFunction }), 'const(1, number), const(2, number)')
  })

  it('toJSON and fromJSON', function () {
    const prop = new ConstantNode('prop')
    const node = new IndexNode([prop], true)

    const json = node.toJSON()

    assert.deepStrictEqual(json, {
      mathjs: 'IndexNode',
      dimensions: [prop],
      dotNotation: true
    })

    const parsed = IndexNode.fromJSON(json)
    assert.deepStrictEqual(parsed, node)
  })

  it('should LaTeX an IndexNode', function () {
    const dimensions = [
      new ConstantNode(2),
      new ConstantNode(1)
    ]

    const n = new IndexNode(dimensions)
    assert.strictEqual(n.toTex(), '_{2,1}')

    const n2 = new IndexNode([])
    assert.strictEqual(n2.toTex(), '_{}')
  })

  it('should LaTeX an IndexNode with dot notation', function () {
    const dimensions = [new ConstantNode('a')]

    const n = new IndexNode(dimensions, true)
    assert.strictEqual(n.toString(), '.a')
  })

  it('should LaTeX an IndexNode with custom toTex', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'IndexNode') {
        return node.dimensions.map(function (range) {
          return range.toTex(options)
        }).join(', ')
      } else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + math.typeOf(node.value) + '\\right)'
      }
    }

    const b = new ConstantNode(1)
    const c = new ConstantNode(2)
    const n = new IndexNode([b, c])

    assert.strictEqual(n.toTex({ handler: customFunction }), 'const\\left(1, number\\right), const\\left(2, number\\right)')
  })
})
