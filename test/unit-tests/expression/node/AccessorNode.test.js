// test AccessorNode
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bigmath = math.create({ number: 'BigNumber' })
const Node = math.Node
const ConstantNode = math.ConstantNode
const OperatorNode = math.OperatorNode
const SymbolNode = math.SymbolNode
const AccessorNode = math.AccessorNode
const IndexNode = math.IndexNode
const RangeNode = math.RangeNode
const ConditionalNode = math.ConditionalNode

describe('AccessorNode', function () {
  it('should create a AccessorNode', function () {
    const n = new AccessorNode(new Node(), new IndexNode([]))
    assert(n instanceof AccessorNode)
    assert(n instanceof Node)
    assert.strictEqual(n.type, 'AccessorNode')
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
    assert.throws(() => AccessorNode(new Node(), new IndexNode([])), TypeError)
  })

  it('should get the name of an AccessorNode', function () {
    const n1 = new AccessorNode(new SymbolNode('a'), new IndexNode([new ConstantNode('toString')]))
    assert.strictEqual(n1.name, 'toString')

    const n2 = new AccessorNode(new SymbolNode('a'), new IndexNode([new ConstantNode(1)]))
    assert.strictEqual(n2.name, '')
  })

  it('should compile a AccessorNode', function () {
    const a = new bigmath.SymbolNode('a')
    const index = new bigmath.IndexNode([
      new bigmath.ConstantNode(2),
      new bigmath.ConstantNode(1)
    ])
    const n = new bigmath.AccessorNode(a, index)
    const expr = n.compile()

    const scope = {
      a: [[1, 2], [3, 4]]
    }
    assert.strictEqual(expr.evaluate(scope), 3)
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

    const scope = {
      a: [[1, 2], [3, 4]]
    }
    assert.deepStrictEqual(expr.evaluate(scope), [3, 4])
  })

  it('should compile a AccessorNode with "end" in an expression', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([
      new OperatorNode(
        '-',
        'subtract',
        [
          new SymbolNode('end'),
          new ConstantNode(2)
        ]
      )
    ])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    const scope = {
      a: [1, 2, 3, 4]
    }
    assert.deepStrictEqual(expr.evaluate(scope), 2)
  })

  it('should compile a AccessorNode with a property', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode('b')])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    const scope = {
      a: { b: 42 }
    }
    assert.deepStrictEqual(expr.evaluate(scope), 42)
  })

  it('should compile a AccessorNode with an not existing property and optional chaining', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode('b')])
    const n = new AccessorNode(a, index, true)
    const expr = n.compile()

    const scope = {
      a: undefined
    }
    assert.deepStrictEqual(expr.evaluate(scope), undefined)
  })

  it('should compile a nested AccessorNode with an not existing property and optional chaining', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode('b')])
    const n = new AccessorNode(a, index, true)
    const index2 = new IndexNode([new ConstantNode('c')])
    const n2 = new AccessorNode(n, index2, true)
    const expr = n2.compile()

    const scope = {
      a: undefined
    }
    assert.deepStrictEqual(expr.evaluate(scope), undefined)
  })

  it('should throw a one-based index error when out of range (Array)', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode(4)])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    const scope = {
      a: [1, 2, 3]
    }
    assert.throws(function () { expr.evaluate(scope) }, /Index out of range \(4 > 3\)/)
  })

  it('should throw a one-based index error when out of range (Matrix)', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode(4)])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    const scope = {
      a: math.matrix([1, 2, 3])
    }
    assert.throws(function () { expr.evaluate(scope) }, /Index out of range \(4 > 3\)/)
  })

  it('should throw a one-based index error when out of range (string)', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode(4)])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    const scope = {
      a: 'hey'
    }
    assert.throws(function () { expr.evaluate(scope) }, /Index out of range \(4 > 3\)/)
  })

  it('should throw an error when applying a matrix index onto an object', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode(4)])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    const scope = {
      a: {}
    }
    assert.throws(function () { expr.evaluate(scope) }, /Cannot apply a numeric index as object property/)
  })

  it('should throw an error when applying an index onto a scalar', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode(4)])
    const n = new AccessorNode(a, index)
    const expr = n.compile()

    const scope = {
      a: 42
    }
    assert.throws(function () { expr.evaluate(scope) }, /Cannot apply index: unsupported type of object/)
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

    const scope = {
      a: [[1, 2], [3, 4]]
    }
    assert.deepStrictEqual(expr.evaluate(scope), [4, 3])
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

    const scope = {
      a: [[1, 2], [3, 4]]
    }
    assert.deepStrictEqual(expr.evaluate(scope), [3, 4])
  })

  it('should use the inner context when using "end" in a nested index', function () {
    // A[B[end]]
    const node = new AccessorNode(
      new SymbolNode('A'),
      new IndexNode([
        new AccessorNode(
          new SymbolNode('B'),
          new IndexNode([
            new SymbolNode('end')
          ])
        )
      ])
    )

    // here, end should resolve to the end of B, which is 3 (whilst the end of A is 6)
    const expr = node.compile()
    const scope = {
      A: [4, 5, 6, 7, 8, 9],
      B: [1, 2, 3]
    }
    assert.deepStrictEqual(expr.evaluate(scope), 6)
  })

  it('should give a proper error message when using "end" inside the index of an object', function () {
    const obj = new SymbolNode('value')
    const index = new IndexNode([
      new SymbolNode('end')
    ])
    const n = new AccessorNode(obj, index)
    const expr = n.compile()

    assert.throws(function () {
      expr.evaluate({ value: { end: true } })
    }, /TypeError: Cannot resolve "end": context must be a Matrix, Array, or string but is Object/)

    assert.throws(function () {
      expr.evaluate({ value: 42 })
    }, /TypeError: Cannot resolve "end": context must be a Matrix, Array, or string but is number/)
  })

  it('should compile a AccessorNode with bignumber setting', function () {
    const a = new bigmath.SymbolNode('a')
    const b = new bigmath.ConstantNode(2)
    const c = new bigmath.ConstantNode(1)
    const n = new bigmath.AccessorNode(a,
      new bigmath.IndexNode([b, c]))
    const expr = n.compile()

    const scope = {
      a: [[1, 2], [3, 4]]
    }
    assert.deepStrictEqual(expr.evaluate(scope), 3)
  })

  it('should filter an AccessorNode', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const index = new IndexNode([b, c])
    const n = new AccessorNode(a, index)

    assert.deepStrictEqual(n.filter(function (node) { return node.isAccessorNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node.isSymbolNode }), [a])
    assert.deepStrictEqual(n.filter(function (node) { return node.isRangeNode }), [])
    assert.deepStrictEqual(n.filter(function (node) { return node.isConstantNode }), [b, c])
    assert.deepStrictEqual(n.filter(function (node) { return node.isConstantNode && node.value === 2 }), [b])
    assert.deepStrictEqual(n.filter(function (node) { return node.isConstantNode && node.value === 4 }), [])
  })

  it('should filter an empty AccessorNode', function () {
    const n = new AccessorNode(new SymbolNode('a'), new IndexNode([]))

    assert.deepStrictEqual(n.filter(function (node) { return node.isAccessorNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node.isConstantNode }), [])
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

    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], a)
    assert.strictEqual(nodes[1], index)
    assert.deepStrictEqual(paths, ['object', 'index'])
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

    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], a)
    assert.strictEqual(nodes[1], index)
    assert.deepStrictEqual(paths, ['object', 'index'])

    assert.notStrictEqual(f, n)
    assert.deepStrictEqual(f.object, e)
    assert.deepStrictEqual(f.index.dimensions[0], b)
    assert.deepStrictEqual(f.index.dimensions[1], c)
  })

  it('should throw an error when the map callback does not return a node', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new AccessorNode(a, new IndexNode([b, c]))

    assert.throws(function () {
      n.map(function () { return undefined })
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
    assert.deepStrictEqual(f.object, e)
    assert.deepStrictEqual(f.index.dimensions[0], b)
    assert.deepStrictEqual(f.index.dimensions[1], c)
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
    assert.deepStrictEqual(f.object, a)
    assert.deepStrictEqual(f.index.dimensions[0], b)
    assert.deepStrictEqual(f.index.dimensions[1], e)
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
    assert.deepStrictEqual(f, e)
  })

  it('should clone an AccessorNode', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new AccessorNode(a, new IndexNode([b, c]))

    const d = n.clone()
    assert(d instanceof AccessorNode)
    assert.deepStrictEqual(d, n)
    assert.notStrictEqual(d, n)
    assert.strictEqual(d.object, n.object)
    assert.strictEqual(d.index, n.index)
    assert.strictEqual(d.index.dimensions[0], n.index.dimensions[0])
    assert.strictEqual(d.index.dimensions[1], n.index.dimensions[1])
  })

  it('should clone an AccessorNode with optional chaining', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new AccessorNode(a, new IndexNode([b, c]), true)

    const d = n.clone()
    assert.strictEqual(n.dotNotation, d.dotNotation)
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
    assert.strictEqual(n.toString(), 'a[2, 1]')

    const n2 = new AccessorNode(a, new IndexNode([]))
    assert.strictEqual(n2.toString(), 'a[]')

    const n3 = new AccessorNode(a, new IndexNode([]), true)
    assert.strictEqual(n3.toString(), 'a?.[]')
  })

  it('should stringify an AccessorNode with parentheses', function () {
    const a = new SymbolNode('a')
    const b = new SymbolNode('b')
    const add = new OperatorNode('+', 'add', [a, b])
    const bar = new AccessorNode(add, new IndexNode([new ConstantNode('bar')]))
    assert.strictEqual(bar.toString(), '(a + b)["bar"]')
  })

  it('should stringify an AccessorNode with parentheses and optional chaining', function () {
    const condition = new ConstantNode(1)
    const obj1 = new SymbolNode('obj1')
    const obj2 = new SymbolNode('obj2')
    const add = new ConditionalNode(condition, obj1, obj2)
    const bar = new AccessorNode(add, new IndexNode([new ConstantNode('bar')]), true)
    assert.strictEqual(bar.toString(), '(1 ? obj1 : obj2)?.["bar"]')
  })

  it('should stringify nested AccessorNode', function () {
    const a = new SymbolNode('a')
    const foo = new AccessorNode(a, new IndexNode([new ConstantNode('foo')]))
    const bar = new AccessorNode(foo, new IndexNode([new ConstantNode('bar')]))
    assert.strictEqual(bar.toString(), 'a["foo"]["bar"]')
  })

  it('should stringify nested AccessorNode using optional chaining', function () {
    const a = new SymbolNode('a')
    const foo = new AccessorNode(a, new IndexNode([new ConstantNode('foo')]), true)
    const bar = new AccessorNode(foo, new IndexNode([new ConstantNode('bar')]), true)
    assert.strictEqual(bar.toString(), 'a?.["foo"]?.["bar"]')
  })

  it('should stringify nested AccessorNode with dot-notation', function () {
    const a = new SymbolNode('a')
    const foo = new AccessorNode(a, new IndexNode([new ConstantNode('foo')], true))
    const bar = new AccessorNode(foo, new IndexNode([new ConstantNode('bar')], true))
    assert.strictEqual(bar.toString(), 'a.foo.bar')
  })

  it('should stringify nested AccessorNode with dot-notation using optional chaining', function () {
    const a = new SymbolNode('a')
    const foo = new AccessorNode(a, new IndexNode([new ConstantNode('foo')], true), true)
    const bar = new AccessorNode(foo, new IndexNode([new ConstantNode('bar')], true), true)
    assert.strictEqual(bar.toString(), 'a?.foo?.bar')
  })

  it('should stringify an AccessorNode with custom toString', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'AccessorNode') {
        let string = node.object.toString(options) + ' at '
        node.index.dimensions.forEach(function (range) {
          string += range.toString(options) + ', '
        })

        return string
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const a = new SymbolNode('a')
    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const n = new AccessorNode(a, new IndexNode([b, c]))

    assert.strictEqual(n.toString({ handler: customFunction }), 'a at const(1, number), const(2, number), ')
  })

  it('should LaTeX an AccessorNode', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([
      new ConstantNode(2),
      new ConstantNode(1)
    ])

    const n = new AccessorNode(a, index)
    assert.strictEqual(n.toTex(), ' a_{2,1}')

    const n2 = new AccessorNode(a, new IndexNode([]))
    assert.strictEqual(n2.toTex(), ' a_{}')
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
        return 'const\\left(' + node.value + ', ' + math.typeOf(node.value) + '\\right)'
      }
    }

    const a = new SymbolNode('a')
    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const n = new AccessorNode(a, new IndexNode([b, c]))

    assert.strictEqual(n.toTex({ handler: customFunction }), ' a at const\\left(1, number\\right), const\\left(2, number\\right), ')
  })

  it('should stringify an AccessorNode with custom toHTML', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'AccessorNode') {
        let latex = node.object.toHTML(options) + ' at '
        node.index.dimensions.forEach(function (range) {
          latex += range.toHTML(options) + ', '
        })

        return latex
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const a = new SymbolNode('a')
    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const n = new AccessorNode(a, new IndexNode([b, c]))

    assert.strictEqual(n.toHTML({ handler: customFunction }), '<span class="math-symbol">a</span> at const(1, number), const(2, number), ')
  })

  it('toJSON and fromJSON', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const node = new AccessorNode(a, new IndexNode([b, c]))

    const json = node.toJSON()

    assert.deepStrictEqual(json, {
      mathjs: 'AccessorNode',
      index: node.index,
      object: a,
      optionalChaining: false
    })

    const parsed = AccessorNode.fromJSON(json)
    assert.deepStrictEqual(parsed, node)
  })
})
