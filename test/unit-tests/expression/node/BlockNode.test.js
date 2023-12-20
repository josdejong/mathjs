// test BlockNode
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const Node = math.Node
const ConstantNode = math.ConstantNode
const SymbolNode = math.SymbolNode
const RangeNode = math.RangeNode
const AssignmentNode = math.AssignmentNode
const OperatorNode = math.OperatorNode
const BlockNode = math.BlockNode
const ResultSet = math.ResultSet

describe('BlockNode', function () {
  it('should create a BlockNode', function () {
    const n = new BlockNode([])
    assert(n instanceof BlockNode)
    assert(n instanceof Node)
    assert.strictEqual(n.type, 'BlockNode')
  })

  it('should have isBlockNode', function () {
    const node = new BlockNode([])
    assert(node.isBlockNode)
  })

  it('should throw an error when calling without new operator', function () {
    assert.throws(function () { BlockNode() }, TypeError)
  })

  it('should throw an error when adding invalid blocks', function () {
    assert.throws(function () { console.log(new BlockNode()) }, /Array expected/)
    assert.throws(function () { console.log(new BlockNode([2])) }, /Property "node" must be a Node/)
    assert.throws(function () { console.log(new BlockNode([{ node: 2, visible: true }])) }, /Property "node" must be a Node/)
    assert.throws(function () { console.log(new BlockNode([{ node: new Node(), visible: 2 }])) }, /Property "visible" must be a boolean/)
  })

  it('should compile and evaluate a BlockNode', function () {
    const n = new BlockNode([
      {
        node: new ConstantNode(5),
        visible: true
      },
      {
        node: new AssignmentNode(new SymbolNode('foo'), new ConstantNode(3)),
        visible: false
      },
      {
        node: new SymbolNode('foo'),
        visible: true
      }
    ])

    const scope = {}
    assert.deepStrictEqual(n.compile().evaluate(scope), new ResultSet([5, 3]))
    assert.deepStrictEqual(scope, { foo: 3 })
  })

  it('expressions should be visible by default', function () {
    const n = new BlockNode([
      { node: new ConstantNode(5) }
    ])

    assert.deepStrictEqual(n.compile().evaluate(), new ResultSet([5]))
  })

  it('should filter a BlockNode', function () {
    const a = new ConstantNode(5)
    const b2 = new ConstantNode(3)
    const foo = new SymbolNode('foo')
    const b = new AssignmentNode(foo, b2)
    const c = new SymbolNode('foo')
    const d = new BlockNode([
      { node: a, visible: true },
      { node: b, visible: false },
      { node: c, visible: true }
    ])

    assert.deepStrictEqual(d.filter(function (node) { return node instanceof BlockNode }), [d])
    assert.deepStrictEqual(d.filter(function (node) { return node instanceof SymbolNode }), [foo, c])
    assert.deepStrictEqual(d.filter(function (node) { return node instanceof RangeNode }), [])
    assert.deepStrictEqual(d.filter(function (node) { return node instanceof ConstantNode }), [a, b2])
    assert.deepStrictEqual(d.filter(function (node) { return node instanceof ConstantNode && node.value === 3 }), [b2])
  })

  it('should run forEach on a BlockNode', function () {
    // [x, 2]
    const x = new SymbolNode('x')
    const two = new ConstantNode(2)
    const c = new OperatorNode('+', 'add', [two, x])
    const a = new BlockNode([
      { node: x },
      { node: c }
    ])

    const nodes = []
    const paths = []
    a.forEach(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, a)
    })

    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], x)
    assert.strictEqual(nodes[1], c)
    assert.deepStrictEqual(paths, ['blocks[0].node', 'blocks[1].node'])
  })

  it('should map a BlockNode', function () {
    // [x, 2]
    const x = new SymbolNode('x')
    const two = new ConstantNode(2)
    const c = new OperatorNode('+', 'add', [two, x])
    const a = new BlockNode([
      { node: x },
      { node: c }
    ])

    const nodes = []
    const paths = []
    const d = new ConstantNode(3)
    const e = a.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, a)
      return node instanceof SymbolNode && node.name === 'x' ? d : node
    })

    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], x)
    assert.strictEqual(nodes[1], c)
    assert.deepStrictEqual(paths, ['blocks[0].node', 'blocks[1].node'])

    assert.notStrictEqual(e, a)
    assert.strictEqual(e.blocks[0].node, d)
    assert.strictEqual(e.blocks[1].node, c)

    // should not touch nested nodes
    assert.strictEqual(e.blocks[1].node.args[0], two)
    assert.strictEqual(e.blocks[1].node.args[1], x)
  })

  it('should throw an error when the map callback does not return a node', function () {
    const x = new SymbolNode('x')
    const two = new ConstantNode(2)
    const c = new OperatorNode('+', 'add', [two, x])
    const a = new BlockNode([
      { node: x },
      { node: c }
    ])

    assert.throws(function () {
      a.map(function () { return undefined })
    }, /Callback function must return a Node/)
  })

  it('should transform a BlockNodes parameters', function () {
    // [x, 2]
    const b = new SymbolNode('x')
    const c = new ConstantNode(2)
    const a = new BlockNode([
      { node: b },
      { node: c }
    ])

    const d = new ConstantNode(3)
    const e = a.transform(function (node) {
      return node instanceof SymbolNode && node.name === 'x' ? d : node
    })

    assert.notStrictEqual(e, a)
    assert.deepStrictEqual(e.blocks[0].node, d)
    assert.deepStrictEqual(e.blocks[1].node, c)
  })

  it('should transform a BlockNode itself', function () {
    // [x, 2]
    const a = new BlockNode([])

    const d = new ConstantNode(3)
    const e = a.transform(function (node) {
      return node instanceof BlockNode ? d : node
    })

    assert.notStrictEqual(e, a)
    assert.deepStrictEqual(e, d)
  })

  it('should traverse a BlockNode', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const c = new BlockNode([
      { node: a, visible: true },
      { node: b, visible: true }
    ])

    let count = 0
    c.traverse(function (node, index, parent) {
      count++

      switch (count) {
        case 1:
          assert.strictEqual(node, c)
          assert.strictEqual(index, null)
          assert.strictEqual(parent, null)
          break

        case 2:
          assert.strictEqual(node, a)
          assert.strictEqual(index, 'blocks[0].node')
          assert.strictEqual(parent, c)
          break

        case 3:
          assert.strictEqual(node, b)
          assert.strictEqual(index, 'blocks[1].node')
          assert.strictEqual(parent, c)
          break
      }
    })

    assert.strictEqual(count, 3)
  })

  it('should clone a BlockNode', function () {
    // [x, 2]
    const b = new SymbolNode('x')
    const c = new ConstantNode(2)
    const a = new BlockNode([
      { node: b },
      { node: c }
    ])

    const d = a.clone()
    assert(d instanceof BlockNode)
    assert.deepStrictEqual(a, d)
    assert.notStrictEqual(a, d)
    assert.notStrictEqual(a.blocks, d.blocks)
    assert.notStrictEqual(a.blocks[0], d.blocks[0])
    assert.notStrictEqual(a.blocks[1], d.blocks[1])
    assert.strictEqual(a.blocks[0].node, d.blocks[0].node)
    assert.strictEqual(a.blocks[1].node, d.blocks[1].node)
  })

  it('test equality another Node', function () {
    const a = new BlockNode([{ node: new SymbolNode('x') }, { node: new ConstantNode(2) }])
    const b = new BlockNode([{ node: new SymbolNode('x') }, { node: new ConstantNode(2) }])
    const c = new BlockNode([{ node: new SymbolNode('x') }, { node: new ConstantNode(4) }])
    const d = new BlockNode([{ node: new SymbolNode('x') }, { node: new ConstantNode(2), visible: false }])
    const e = new BlockNode([{ node: new SymbolNode('x') }, { node: new ConstantNode(2) }, { node: new ConstantNode(5) }])

    assert.strictEqual(a.equals(null), false)
    assert.strictEqual(a.equals(undefined), false)
    assert.strictEqual(a.equals(b), true)
    assert.strictEqual(a.equals(c), false)
    assert.strictEqual(a.equals(d), false)
    assert.strictEqual(a.equals(e), false)
  })

  it('should stringify a BlockNode', function () {
    const n = new BlockNode([
      { node: new ConstantNode(5), visible: true },
      { node: new AssignmentNode(new SymbolNode('foo'), new ConstantNode(3)), visible: false },
      { node: new SymbolNode('foo'), visible: true }
    ])

    assert.strictEqual(n.toString(), '5\nfoo = 3;\nfoo')
  })

  it('should stringify a BlockNode with custom toString', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'BlockNode') {
        let string = ''
        node.blocks.forEach(function (block) {
          string += block.node.toString(options) + '; '
        })

        return string
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n = new BlockNode([{ node: a }, { node: b }])

    assert.strictEqual(n.toString({ handler: customFunction }), 'const(1, number); const(2, number); ')
  })

  it('should stringify a BlockNode with custom toHML', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'BlockNode') {
        let string = ''
        node.blocks.forEach(function (block) {
          string += block.node.toHTML(options) + '; '
        })

        return string
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n = new BlockNode([{ node: a }, { node: b }])

    assert.strictEqual(n.toHTML({ handler: customFunction }), 'const(1, number); const(2, number); ')
  })

  it('toJSON and fromJSON', function () {
    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const bBlock = { node: b, visible: false }
    const cBlock = { node: c, visible: true }

    const node = new BlockNode([bBlock, cBlock])

    const json = node.toJSON()

    assert.deepStrictEqual(json, {
      mathjs: 'BlockNode',
      blocks: [bBlock, cBlock]
    })

    const parsed = BlockNode.fromJSON(json)
    assert.deepStrictEqual(parsed, node)
  })

  it('should LaTeX a BlockNode', function () {
    const n = new BlockNode([
      { node: new ConstantNode(5), visible: true },
      { node: new AssignmentNode(new SymbolNode('foo'), new ConstantNode(3)), visible: false },
      { node: new SymbolNode('foo'), visible: true }
    ])

    assert.strictEqual(n.toTex(), '5\\;\\;\n foo=3;\\;\\;\n foo')
  })

  it('should LaTeX a BlockNode with custom toTex', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'BlockNode') {
        let latex = ''
        node.blocks.forEach(function (block) {
          latex += block.node.toTex(options) + '; '
        })

        return latex
      } else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + math.typeOf(node.value) + '\\right)'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n = new BlockNode([{ node: a }, { node: b }])

    assert.strictEqual(n.toTex({ handler: customFunction }), 'const\\left(1, number\\right); const\\left(2, number\\right); ')
  })
})
