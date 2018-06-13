// test AccessorNode
const assert = require('assert')
const math = require('../../../src/main')
const bigmath = require('../../../src/main').create({number: 'BigNumber'})
const Node = math.expression.node.Node
const ConstantNode = math.expression.node.ConstantNode
const OperatorNode = math.expression.node.OperatorNode
const SymbolNode = math.expression.node.SymbolNode
const AccessorNode = math.expression.node.AccessorNode
const IndexNode = math.expression.node.IndexNode
const RangeNode = math.expression.node.RangeNode

describe('AccessorNode', function () {
  it('should create a AccessorNode', function () {
    const n = new AccessorNode(new Node(), new IndexNode([]))
    assert(n instanceof AccessorNode)
    assert(n instanceof Node)
    assert.equal(n.type, 'AccessorNode')
  })

  it('should have isAccessorNode', function () {
    const node = new AccessorNode(new Node(), new IndexNode([]))
    assert(node.isAccessorNode)
  })

  it('should throw an error when calling with wrong arguments', function () {
    assert.throws(function () { console.log(new AccessorNode()) }, TypeError)
    assert.throws(function () { console.log(new AccessorNode('a', new IndexNode([]))) }, TypeError)
    assert.throws(function () { console.log(new AccessorNode(new Node(), new IndexNode([2, 3]))) }, TypeError)
    assert.throws(function () { console.log(new AccessorNode(new Node(), new IndexNode([new Node(), 3]))) }, TypeError)
  })

  it('should throw an error when calling without new operator', function () {
    assert.throws(function () { AccessorNode(new Node(), new IndexNode([])) }, SyntaxError)
  })

  it('should get the name of an AccessorNode', function () {
    const n1 = new AccessorNode(new SymbolNode('a'), new IndexNode([new ConstantNode('toString')]))
    assert.equal(n1.name, 'toString')

    const n2 = new AccessorNode(new SymbolNode('a'), new IndexNode([new ConstantNode(1)]))
    assert.equal(n2.name, '')
  })

  it('should compile a AccessorNode', function () {
    const a = new bigmath.expression.node.SymbolNode('a')
    const index = new bigmath.expression.node.IndexNode([
      new bigmath.expression.node.ConstantNode(2),
      new bigmath.expression.node.ConstantNode(1)
    ])
    const n = new bigmath.expression.node.AccessorNode(a, index)
    const expr = n.compile()

    let scope = {
      a: [[1, 2], [3, 4]]
    }
    assert.equal(expr.eval(scope), 3)
  })

  it('should compile a AccessorNode with range and context parameters', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([
      new ConstantNode(2),
      new RangeNode(
        new ConstantNode(1),
        new SymbolNode('end')
      )
    ])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    let scope = {
      a: [[1, 2], [3, 4]]
    }
    assert.deepEqual(expr.eval(scope), [[3, 4]])
  })

  it('should compile a AccessorNode with a property', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode('b')])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    let scope = {
      a: { b: 42 }
    }
    assert.deepEqual(expr.eval(scope), 42)
  })

  it('should throw a one-based index error when out of range (Array)', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode(4)])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    let scope = {
      a: [1, 2, 3]
    }
    assert.throws(function () { expr.eval(scope) }, /Index out of range \(4 > 3\)/)
  })

  it('should throw a one-based index error when out of range (Matrix)', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode(4)])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    let scope = {
      a: math.matrix([1, 2, 3])
    }
    assert.throws(function () { expr.eval(scope) }, /Index out of range \(4 > 3\)/)
  })

  it('should throw a one-based index error when out of range (string)', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode(4)])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    let scope = {
      a: 'hey'
    }
    assert.throws(function () { expr.eval(scope) }, /Index out of range \(4 > 3\)/)
  })

  it('should throw an error when applying a matrix index onto an object', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode(4)])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    let scope = {
      a: {}
    }
    assert.throws(function () { expr.eval(scope) }, /Cannot apply a numeric index as object property/)
  })

  it('should throw an error when applying an index onto a scalar', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode(4)])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    let scope = {
      a: 42
    }
    assert.throws(function () { expr.eval(scope) }, /Cannot apply index: unsupported type of object/)
  })

  it('should compile a AccessorNode with negative step range and context parameters', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([
      new ConstantNode(2),
      new RangeNode(
        new SymbolNode('end'),
        new ConstantNode(1),
        new ConstantNode(-1)
      )
    ])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    let scope = {
      a: [[1, 2], [3, 4]]
    }
    assert.deepEqual(expr.eval(scope), [[4, 3]])
  })

  it('should compile a AccessorNode with "end" both as value and in a range', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([
      new SymbolNode('end'),
      new RangeNode(
        new ConstantNode(1),
        new SymbolNode('end')
      )
    ])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    let scope = {
      a: [[1, 2], [3, 4]]
    }
    assert.deepEqual(expr.eval(scope), [[3, 4]])
  })

  it('should compile a AccessorNode with bignumber setting', function () {
    const a = new bigmath.expression.node.SymbolNode('a')
    const b = new bigmath.expression.node.ConstantNode(2)
    const c = new bigmath.expression.node.ConstantNode(1)
    const n = new bigmath.expression.node.AccessorNode(a,
      new bigmath.expression.node.IndexNode([b, c]))
    const expr = n.compile()

    let scope = {
      a: [[1, 2], [3, 4]]
    }
    assert.deepEqual(expr.eval(scope), 3)
  })

  it('should filter an AccessorNode', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const index = new IndexNode([b, c])
    const n = new AccessorNode(a, index)

    assert.deepEqual(n.filter(function (node) { return node.isAccessorNode }), [n])
    assert.deepEqual(n.filter(function (node) { return node.isSymbolNode }), [a])
    assert.deepEqual(n.filter(function (node) { return node.isRangeNode }), [])
    assert.deepEqual(n.filter(function (node) { return node.isConstantNode }), [b, c])
    assert.deepEqual(n.filter(function (node) { return node.isConstantNode && node.value === 2 }), [b])
    assert.deepEqual(n.filter(function (node) { return node.isConstantNode && node.value === 4 }), [])
  })

  it('should filter an empty AccessorNode', function () {
    const n = new AccessorNode(new SymbolNode('a'), new IndexNode([]))

    assert.deepEqual(n.filter(function (node) { return node.isAccessorNode }), [n])
    assert.deepEqual(n.filter(function (node) { return node.isConstantNode }), [])
  })

  it('should run forEach on an AccessorNode', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const index = new IndexNode([b, c])
    const n = new AccessorNode(a, index)

    const nodes = []
    const paths = []
    n.forEach(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, n)
    })

    assert.equal(nodes.length, 2)
    assert.strictEqual(nodes[0], a)
    assert.strictEqual(nodes[1], index)
    assert.deepEqual(paths, ['object', 'index'])
  })

  it('should map an AccessorNode', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const index = new IndexNode([b, c])
    const n = new AccessorNode(a, index)

    const nodes = []
    const paths = []
    const e = new SymbolNode('c')
    const f = n.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, n)

      return node instanceof SymbolNode ? e : node
    })

    assert.equal(nodes.length, 2)
    assert.strictEqual(nodes[0], a)
    assert.strictEqual(nodes[1], index)
    assert.deepEqual(paths, ['object', 'index'])

    assert.notStrictEqual(f, n)
    assert.deepEqual(f.object, e)
    assert.deepEqual(f.index.dimensions[0], b)
    assert.deepEqual(f.index.dimensions[1], c)
  })

  it('should throw an error when the map callback does not return a node', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new AccessorNode(a, new IndexNode([b, c]))

    assert.throws(function () {
      n.map(function () {})
    }, /Callback function must return a Node/)
  })

  it('should transform an IndexNodes object', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new AccessorNode(a, new IndexNode([b, c]))

    const e = new SymbolNode('c')
    const f = n.transform(function (node) {
      return node instanceof SymbolNode ? e : node
    })

    assert.notStrictEqual(f, n)
    assert.deepEqual(f.object, e)
    assert.deepEqual(f.index.dimensions[0], b)
    assert.deepEqual(f.index.dimensions[1], c)
  })

  it('should transform an IndexNodes (nested) parameters', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new AccessorNode(a, new IndexNode([b, c]))

    const e = new SymbolNode('c')
    const f = n.transform(function (node) {
      return node instanceof ConstantNode && node.value === 1 ? e : node
    })

    assert.notStrictEqual(f, n)
    assert.deepEqual(f.object, a)
    assert.deepEqual(f.index.dimensions[0], b)
    assert.deepEqual(f.index.dimensions[1], e)
  })

  it('should transform an AccessorNode itself', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new AccessorNode(a, new IndexNode([b, c]))

    const e = new ConstantNode(5)
    const f = n.transform(function (node) {
      return node instanceof AccessorNode ? e : node
    })

    assert.notStrictEqual(f, n)
    assert.deepEqual(f, e)
  })

  it('should clone an AccessorNode', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new AccessorNode(a, new IndexNode([b, c]))

    const d = n.clone()
    assert(d instanceof AccessorNode)
    assert.deepEqual(d, n)
    assert.notStrictEqual(d, n)
    assert.strictEqual(d.object, n.object)
    assert.strictEqual(d.index, n.index)
    assert.strictEqual(d.index.dimensions[0], n.index.dimensions[0])
    assert.strictEqual(d.index.dimensions[1], n.index.dimensions[1])
  })

  it('should test equality of an Node', function () {
    const a = new SymbolNode('a')
    const b = new SymbolNode('b')
    const two = new ConstantNode(2)
    const one = new ConstantNode(1)

    const node1 = new AccessorNode(a, new IndexNode([two, one]))
    const node2 = new AccessorNode(a, new IndexNode([b, one]))
    const node3 = new AccessorNode(a, new IndexNode([two, one]))

    assert.strictEqual(node1.equals(null), false)
    assert.strictEqual(node1.equals(undefined), false)
    assert.strictEqual(node1.equals(node2), false)
    assert.strictEqual(node1.equals(node3), true)
  })

  it('should stringify an AccessorNode', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([
      new ConstantNode(2),
      new ConstantNode(1)
    ])

    const n = new AccessorNode(a, index)
    assert.equal(n.toString(), 'a[2, 1]')

    const n2 = new AccessorNode(a, new IndexNode([]))
    assert.equal(n2.toString(), 'a[]')
  })

  it('should stringify an AccessorNode with parentheses', function () {
    const a = new SymbolNode('a')
    const b = new SymbolNode('b')
    const add = new OperatorNode('+', 'add', [a, b])
    const bar = new AccessorNode(add, new IndexNode([new ConstantNode('bar')]))
    assert.equal(bar.toString(), '(a + b)["bar"]')
  })

  it('should stringify nested AccessorNode', function () {
    const a = new SymbolNode('a')
    const foo = new AccessorNode(a, new IndexNode([new ConstantNode('foo')]))
    const bar = new AccessorNode(foo, new IndexNode([new ConstantNode('bar')]))
    assert.equal(bar.toString(), 'a["foo"]["bar"]')
  })

  it('should stringigy an AccessorNode with custom toString', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'AccessorNode') {
        let string = node.object.toString(options) + ' at '
        node.index.dimensions.forEach(function (range) {
          string += range.toString(options) + ', '
        })

        return string
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeof(node.value) + ')'
      }
    }

    const a = new SymbolNode('a')
    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const n = new AccessorNode(a, new IndexNode([b, c]))

    assert.equal(n.toString({handler: customFunction}), 'a at const(1, number), const(2, number), ')
  })

  it('should LaTeX an AccessorNode', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([
      new ConstantNode(2),
      new ConstantNode(1)
    ])

    const n = new AccessorNode(a, index)
    assert.equal(n.toTex(), ' a_{2,1}')

    const n2 = new AccessorNode(a, new IndexNode([]))
    assert.equal(n2.toTex(), ' a_{}')
  })

  it('should LaTeX an AccessorNode with custom toTex', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'AccessorNode') {
        let latex = node.object.toTex(options) + ' at '
        node.index.dimensions.forEach(function (range) {
          latex += range.toTex(options) + ', '
        })

        return latex
      } else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + math.typeof(node.value) + '\\right)'
      }
    }

    const a = new SymbolNode('a')
    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const n = new AccessorNode(a, new IndexNode([b, c]))

    assert.equal(n.toTex({handler: customFunction}), ' a at const\\left(1, number\\right), const\\left(2, number\\right), ')
  })

  it('toJSON and fromJSON', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const node = new AccessorNode(a, new IndexNode([b, c]))

    const json = node.toJSON()

    assert.deepEqual(json, {
      mathjs: 'AccessorNode',
      index: {
        dimensions: [ b, c ],
        dotNotation: false
      },
      object: a
    })

    const parsed = AccessorNode.fromJSON(json)
    assert.deepEqual(parsed, node)
  })
})
