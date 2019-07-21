// test AssignmentNode
import assert from 'assert'

import math from '../../../../src/bundleAny'
const Node = math.Node
const AccessorNode = math.AccessorNode
const ArrayNode = math.ArrayNode
const ConstantNode = math.ConstantNode
const SymbolNode = math.SymbolNode
const RangeNode = math.RangeNode
const AssignmentNode = math.AssignmentNode
const OperatorNode = math.OperatorNode
const IndexNode = math.IndexNode

describe('AssignmentNode', function () {
  it('should create an AssignmentNode', function () {
    const n = new AssignmentNode(new SymbolNode('a'), new Node())
    assert(n instanceof AssignmentNode)
    assert(n instanceof Node)
    assert.strictEqual(n.type, 'AssignmentNode')
  })

  it('should create an AssignmentNode with matrix assignment', function () {
    const n = new AssignmentNode(new ArrayNode([new SymbolNode('a'), new SymbolNode('b')]), new ArrayNode([new ConstantNode(1), new ConstantNode(2)]))
    assert(n instanceof AssignmentNode)
    assert(n instanceof Node)
    assert.strictEqual(n.type, 'AssignmentNode')
  })

  it('should have property isAssignmentNode', function () {
    const node = new AssignmentNode(new SymbolNode('a'), new Node())
    assert(node.isAssignmentNode)
  })

  it('should throw an error when calling without new operator', function () {
    assert.throws(function () { AssignmentNode(new SymbolNode('a'), new Node()) }, SyntaxError)
  })

  it('should throw an error when creating an AssignmentNode with a reserved keyword', function () {
    assert.throws(function () {
      console.log(new AssignmentNode(new SymbolNode('end'), new Node()))
    }, /Cannot assign to symbol "end"/)
  })

  it('should throw an error on wrong constructor arguments', function () {
    assert.throws(function () { console.log(new AssignmentNode()) }, TypeError)
    assert.throws(function () { console.log(new AssignmentNode(new Node(), new Node())) }, TypeError)
    assert.throws(function () { console.log(new AssignmentNode('a', new Node())) }, TypeError)
    assert.throws(function () { console.log(new AssignmentNode(2, new Node())) }, TypeError)
    assert.throws(function () { console.log(new AssignmentNode(new Node(), new Node(), new Node())) }, TypeError)
    assert.throws(function () { console.log(new AssignmentNode(new SymbolNode('a'), new Node(), new ConstantNode(1))) }, TypeError)
    assert.throws(function () {
      console.log(new AssignmentNode(
        new ArrayNode([new SymbolNode('a')]),
        new IndexNode([new ConstantNode(1), new ConstantNode(1)]),
        new ArrayNode([new ConstantNode(1)])
      ))
    }, TypeError)
    assert.throws(function () { console.log(new AssignmentNode(new SymbolNode('a'), 1)) }, TypeError)
  })

  it('should get the name of an AssignmentNode', function () {
    const n = new AssignmentNode(new SymbolNode('a'), new ConstantNode(1))
    assert.strictEqual(n.name, 'a')

    const n2 = new AccessorNode(new SymbolNode('a'), new IndexNode([new ConstantNode('b')]))
    const n3 = new AssignmentNode(n2, new ConstantNode(1))
    assert.strictEqual(n3.name, 'b')

    const n4 = new AssignmentNode(new SymbolNode('a'), new IndexNode([new ConstantNode('b')]), new ConstantNode(1))
    assert.strictEqual(n4.name, 'b')

    const n5 = new AssignmentNode(new SymbolNode('a'), new IndexNode([new ConstantNode(1)]), new ConstantNode(1))
    assert.strictEqual(n5.name, '')
  })

  it('should get the name of an AssignmentNode with matrix assignment', function () {
    const A = new AssignmentNode(
      new ArrayNode([new SymbolNode('a'), new SymbolNode('b'), new SymbolNode('c')]),
      new ArrayNode([new ConstantNode(1), new ConstantNode(2), new ConstantNode(3)])
    )
    assert.deepStrictEqual(A.name, ['a', 'b', 'c'])
  })

  it('should throw an error on setting the name of an AssignmentNode', function () {
    const A = new AssignmentNode(new SymbolNode('a'), new ConstantNode(1))
    assert.throws(function () { console.log(A.name = 'a') })
  })

  it('should compile an AssignmentNode without index', function () {
    const n = new AssignmentNode(new SymbolNode('b'), new ConstantNode(3))

    const expr = n.compile()

    const scope = {}
    assert.strictEqual(expr.evaluate(scope), 3)
    assert.strictEqual(scope.b, 3)
  })

  it('should compile an AssignmentNode with matrix assignment', function () {
    const n = new AssignmentNode(
      new ArrayNode([new SymbolNode('x'), new SymbolNode('y')]),
      new ArrayNode([new ConstantNode(1), new ConstantNode(2)])
    )
    const expr = n.compile()
    const scope = {}
    assert.strictEqual(expr.evaluate(scope), 2)
    assert.strictEqual(scope.x, 1)
    assert.strictEqual(scope.y, 2)
  })

  it('should throw an error on matrix assignment when "object" and "value" evaluate to different sizes', function () {
    const n = new AssignmentNode(new ArrayNode([new SymbolNode('x')]), new ArrayNode([new ConstantNode(1), new ConstantNode(2)]))
    assert.throws(function () { console.log(n.evaluate()) }, TypeError)
  })

  it('should compile an AssignmentNode with property index', function () {
    const object = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode('b')])
    const value = new ConstantNode(3)
    const n = new AssignmentNode(object, index, value)

    const expr = n.compile()

    const scope = {
      a: {}
    }
    assert.strictEqual(expr.evaluate(scope), 3)
    assert.deepStrictEqual(scope, { a: { b: 3 } })
  })

  it('should compile an AssignmentNode with nested property index', function () {
    const a = new SymbolNode('a')
    const object = new AccessorNode(a, new IndexNode([new ConstantNode('b')]))
    const index = new IndexNode([new ConstantNode('c')])
    const value = new ConstantNode(3)
    const n = new AssignmentNode(object, index, value)

    const expr = n.compile()

    const scope = {
      a: {
        b: {}
      }
    }
    assert.strictEqual(expr.evaluate(scope), 3)
    assert.deepStrictEqual(scope, { a: { b: { c: 3 } } })
  })

  it('should compile an AssignmentNode with matrix index', function () {
    const object = new SymbolNode('a')
    const index = new IndexNode([
      new ConstantNode(2),
      new ConstantNode(1)
    ])
    const value = new ConstantNode(5)
    const n = new AssignmentNode(object, index, value)
    const expr = n.compile()

    const scope = {
      a: [[0, 0], [0, 0]]
    }
    assert.strictEqual(expr.evaluate(scope), 5)
    assert.deepStrictEqual(scope, {
      a: [[0, 0], [5, 0]]
    })
  })

  it('should compile an AssignmentNode with range and context parameters', function () {
    const object = new SymbolNode('a')
    const index = new IndexNode([
      new ConstantNode(2),
      new RangeNode(
        new ConstantNode(1),
        new SymbolNode('end')
      )
    ])
    const value = new SymbolNode('b')
    const n = new AssignmentNode(object, index, value)
    const expr = n.compile()

    const scope = {
      a: [[0, 0], [0, 0]],
      b: [5, 6]
    }
    assert.deepStrictEqual(expr.evaluate(scope), [5, 6])
    assert.deepStrictEqual(scope, {
      a: [[0, 0], [5, 6]],
      b: [5, 6]
    })
  })

  it('should compile an AssignmentNode with bignumber setting', function () {
    const bigmath = math.create({ number: 'BigNumber' })

    const object = new bigmath.SymbolNode('a')
    const index = new bigmath.IndexNode([
      new bigmath.ConstantNode(2),
      new bigmath.ConstantNode(1)
    ])
    const value = new bigmath.ConstantNode(bigmath.bignumber(5))
    const n = new bigmath.AssignmentNode(object, index, value)
    const expr = n.compile()

    const scope = {
      a: [[0, 0], [0, 0]]
    }
    assert.deepStrictEqual(expr.evaluate(scope), bigmath.bignumber(5))
    assert.deepStrictEqual(scope, {
      a: [[0, 0], [bigmath.bignumber(5), 0]]
    })
  })

  it('should throw an error when applying an index onto a scalar', function () {
    const a = new SymbolNode('a')
    const index = new IndexNode([new ConstantNode(4)])
    const value = new ConstantNode(2)
    const n = new AssignmentNode(a, index, value)
    const expr = n.compile()

    const scope = {
      a: 42
    }
    assert.throws(function () { expr.evaluate(scope) }, /Cannot apply index: unsupported type of object/)
  })

  it('should throw an error on invalid matrix assignment', function () {
    assert.throws(function () {
      console.log(new AssignmentNode(new ArrayNode([new ConstantNode(1)]), new ArrayNode([new ConstantNode(1)])))
    }, TypeError)
  })

  it('should filter an AssignmentNode', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const i = new IndexNode([b, c])
    const v = new ConstantNode(2)
    const n = new AssignmentNode(a, i, v)

    assert.deepStrictEqual(n.filter(function (node) { return node.isAssignmentNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node.isSymbolNode }), [a])
    assert.deepStrictEqual(n.filter(function (node) { return node.isConstantNode }), [b, c, v])
    assert.deepStrictEqual(n.filter(function (node) { return node.value === 1 }), [c])
    assert.deepStrictEqual(n.filter(function (node) { return node.value === 2 }), [b, v])
    assert.deepStrictEqual(n.filter(function (node) { return node.name === 'q' }), [])
  })

  it('should filter an AssignmentNode without index', function () {
    const a = new SymbolNode('a')
    const v = new ConstantNode(2)
    const n = new AssignmentNode(a, v)

    assert.deepStrictEqual(n.filter(function (node) { return node.isAssignmentNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node.isSymbolNode }), [a])
    assert.deepStrictEqual(n.filter(function (node) { return node.isConstantNode }), [v])
    assert.deepStrictEqual(n.filter(function (node) { return node.value === 2 }), [v])
    assert.deepStrictEqual(n.filter(function (node) { return node.name === 'q' }), [])
  })

  it('should filter an AssignmentNode with matrix assignment', function () {
    const x = new SymbolNode('x')
    const y = new SymbolNode('y')
    const S = new ArrayNode([x, y])
    const c1 = new ConstantNode(1)
    const c2 = new ConstantNode(2)
    const C = new ArrayNode([c1, c2])
    const A = new AssignmentNode(S, C)

    assert.deepStrictEqual(A.filter(function (node) { return node.isAssignmentNode }), [A])
    assert.deepStrictEqual(A.filter(function (node) { return node.isArrayNode }), [S, C])
    assert.deepStrictEqual(A.filter(function (node) { return node.isSymbolNode }), [x, y])
    assert.deepStrictEqual(A.filter(function (node) { return node.isConstantNode }), [c1, c2])
    assert.deepStrictEqual(A.filter(function (node) { return node.name === 'y' }), [y])
    assert.deepStrictEqual(A.filter(function (node) { return node.name === 'q' }), [])
    assert.deepStrictEqual(A.filter(function (node) { return node.value === 2 }), [c2])
    assert.deepStrictEqual(A.filter(function (node) { return node.value === 3 }), [])
  })

  it('should run forEach on an AssignmentNode', function () {
    // A[1, x] = 3
    const a = new SymbolNode('A')
    const b = new ConstantNode(2)
    const c = new SymbolNode('x')
    const i = new IndexNode([b, c])
    const v = new ConstantNode(3)
    const n = new AssignmentNode(a, i, v)

    const nodes = []
    const paths = []
    n.forEach(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, n)
    })

    assert.strictEqual(nodes.length, 3)
    assert.strictEqual(nodes[0], a)
    assert.strictEqual(nodes[1], i)
    assert.strictEqual(nodes[2], v)
    assert.deepStrictEqual(paths, ['object', 'index', 'value'])
  })

  it('should run forEach on an AssignmentNode without index', function () {
    // A = 3
    const a = new SymbolNode('A')
    const v = new ConstantNode(3)
    const n = new AssignmentNode(a, v)

    const nodes = []
    const paths = []
    n.forEach(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, n)
    })

    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], a)
    assert.strictEqual(nodes[1], v)
    assert.deepStrictEqual(paths, ['object', 'value'])
  })

  it('should run forEach on an AssignmentNode with matrix assignment', function () {
    // [x, y] = [1, 2]
    const x = new SymbolNode('x')
    const y = new SymbolNode('y')
    const S = new ArrayNode([x, y])
    const c1 = new ConstantNode(1)
    const c2 = new ConstantNode(2)
    const C = new ArrayNode([c1, c2])
    const n = new AssignmentNode(S, C)

    const nodes = []
    const paths = []
    n.forEach(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.deepStrictEqual(parent, n)
    })

    assert.strictEqual(nodes.length, 2)
    assert.deepStrictEqual(nodes[0], S)
    assert.deepStrictEqual(nodes[1], C)
    assert.deepStrictEqual(paths, ['object', 'value'])
  })

  it('should map an AssignmentNode', function () {
    // A[1, x] = 3
    const a = new SymbolNode('A')
    const b = new ConstantNode(2)
    const c = new SymbolNode('x')
    const i = new IndexNode([b, c])
    const v = new ConstantNode(3)
    const n = new AssignmentNode(a, i, v)

    const nodes = []
    const paths = []
    const e = new ConstantNode(4)
    const f = n.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, n)

      return node instanceof SymbolNode && node.name === 'x' ? e : node
    })

    assert.strictEqual(nodes.length, 3)
    assert.strictEqual(nodes[0], a)
    assert.strictEqual(nodes[1], i)
    assert.strictEqual(nodes[2], v)
    assert.deepStrictEqual(paths, ['object', 'index', 'value'])

    assert.notStrictEqual(f, n)
    assert.deepStrictEqual(f.object, a)
    assert.deepStrictEqual(f.index.dimensions[0], b)
    assert.deepStrictEqual(f.index.dimensions[1], c) // not replaced, is nested
    assert.deepStrictEqual(f.value, v)
  })

  it('should map an AssignmentNode without index', function () {
    // a = x + 2
    const a = new SymbolNode('a')
    const x = new SymbolNode('x')
    const d = new AssignmentNode(a, x)

    const e = new ConstantNode(3)
    let nodes = []
    let paths = []
    const f = d.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, d)
      return node instanceof SymbolNode && node.name === 'x' ? e : node
    })

    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], a)
    assert.strictEqual(nodes[1], x)
    assert.deepStrictEqual(paths, ['object', 'value'])

    assert.notStrictEqual(f, d)
    assert.strictEqual(d.value, x)
    assert.strictEqual(f.value, e)
  })

  it('should map an AssignmentNode with matrix assignment', function () {
    // [m, n] = [1, 2]
    const m = new SymbolNode('m')
    const n = new SymbolNode('n')
    const S = new ArrayNode([m, n])

    const c1 = new ConstantNode(1)
    const c2 = new ConstantNode(2)
    const C = new ArrayNode([c1, c2])

    const A = new AssignmentNode(S, C)

    const s = new SymbolNode('s')

    const nodes = []
    const paths = []
    const R = A.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, A)
      return node instanceof ArrayNode ? s : node
    })

    assert.strictEqual(nodes.length, 2)
    assert.deepStrictEqual(nodes[0], S)
    assert.deepStrictEqual(nodes[1], C)
    assert.deepStrictEqual(paths, ['object', 'value'])

    assert.notStrictEqual(R, A)
    assert.deepStrictEqual(A.object, S)
    assert.deepStrictEqual(A.value, C)
    assert.deepStrictEqual(R.value, s)
  })

  it('should throw an error when the map callback does not return a node', function () {
    // A[1, x] = 3
    const a = new SymbolNode('A')
    const b = new ConstantNode(2)
    const c = new SymbolNode('x')
    const i = new IndexNode([b, c])
    const v = new ConstantNode(3)
    const n = new AssignmentNode(a, i, v)

    assert.throws(function () {
      n.map(function () {})
    }, /Callback function must return a Node/)
  })

  it('should transform an AssignmentNode\'s (nested) parameters', function () {
    // a = x + 2
    const object = new SymbolNode('a')
    const x = new SymbolNode('x')
    const index = new IndexNode([x])
    const b = new ConstantNode(2)
    const value = new OperatorNode('+', 'add', [x, b])
    const d = new AssignmentNode(object, index, value)

    const e = new ConstantNode(3)
    const f = d.transform(function (node) {
      return node.isSymbolNode && node.name === 'x' ? e : node
    })

    assert.notStrictEqual(f, d)
    assert.deepStrictEqual(f.index.dimensions[0], e)
    assert.deepStrictEqual(f.value.args[0], e)
    assert.deepStrictEqual(f.value.args[1], b)
  })

  it('should transform an AssignmentNode itself', function () {
    // a = x + 2
    const object = new SymbolNode('a')
    const x = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new OperatorNode('+', 'add', [x, b])
    const d = new AssignmentNode(object, c)

    const e = new ConstantNode(5)
    const f = d.transform(function (node) {
      return node instanceof AssignmentNode ? e : node
    })

    assert.notStrictEqual(f, d)
    assert.deepStrictEqual(f, e)
  })

  it('should traverse an AssignmentNode', function () {
    const object = new SymbolNode('a')
    const i = new IndexNode([])
    const value = new ConstantNode(2)
    const a = new AssignmentNode(object, i, value)

    let count = 0
    a.traverse(function (node, index, parent) {
      count++

      switch (count) {
        case 1:
          assert.strictEqual(node, a)
          assert.strictEqual(index, null)
          assert.strictEqual(parent, null)
          break

        case 2:
          assert.strictEqual(node, object)
          assert.strictEqual(index, 'object')
          assert.strictEqual(parent, a)
          break

        case 3:
          assert.strictEqual(node, i)
          assert.strictEqual(index, 'index')
          assert.strictEqual(parent, a)
          break

        case 4:
          assert.strictEqual(node, value)
          assert.strictEqual(index, 'value')
          assert.strictEqual(parent, a)
          break
      }
    })

    assert.strictEqual(count, 4)
  })

  it('should clone an AssignmentNode without index', function () {
    const object = new SymbolNode('a')
    const value = new ConstantNode(2)
    const a = new AssignmentNode(object, value)

    const b = a.clone()
    assert(b instanceof AssignmentNode)
    assert.deepStrictEqual(b, a)
    assert.notStrictEqual(b, a)
    assert.strictEqual(b.object, a.object)
    assert.strictEqual(b.index, a.index)
    assert.strictEqual(b.value, a.value)
  })

  it('should clone an AssignmentNode with matrix assignment', function () {
    const object = new ArrayNode([new SymbolNode('a')])
    const value = new ArrayNode([new ConstantNode(2)])
    const A = new AssignmentNode(object, value)

    const B = A.clone()
    assert(B instanceof AssignmentNode)
    assert.deepStrictEqual(B, A)
    assert.notStrictEqual(B, A)
    assert.deepStrictEqual(B.object, A.object)
    assert.deepStrictEqual(B.index, A.index)
    assert.deepStrictEqual(B.value, A.value)
  })

  it('should clone an AssignmentNode', function () {
    // A[1, x] = 3
    const a = new SymbolNode('A')
    const b = new ConstantNode(2)
    const c = new SymbolNode('x')
    const i = new IndexNode([b, c])
    const v = new ConstantNode(3)
    const d = new AssignmentNode(a, i, v)

    const e = d.clone()

    assert(e instanceof AssignmentNode)
    assert.deepStrictEqual(e, d)
    assert.notStrictEqual(e, d)
    assert.strictEqual(e.object, d.object)
    assert.strictEqual(e.index, d.index)
    assert.strictEqual(e.value, d.value)
  })

  it('test equality another Node', function () {
    const a = new AssignmentNode(
      new SymbolNode('A'),
      new IndexNode([new ConstantNode(2), new SymbolNode('x')]),
      new ConstantNode(3))
    const b = new AssignmentNode(
      new SymbolNode('A'),
      new IndexNode([new ConstantNode(2), new SymbolNode('x')]),
      new ConstantNode(3))
    const c = new AssignmentNode(
      new SymbolNode('B'),
      new IndexNode([new ConstantNode(2), new SymbolNode('x')]),
      new ConstantNode(3))
    const d = new AssignmentNode(
      new SymbolNode('A'),
      new IndexNode([new ConstantNode(2)]),
      new ConstantNode(3))
    const e = new AssignmentNode(
      new SymbolNode('A'),
      new IndexNode([new ConstantNode(2), new SymbolNode('x')]),
      new ConstantNode(4))

    assert.strictEqual(a.equals(null), false)
    assert.strictEqual(a.equals(undefined), false)
    assert.strictEqual(a.equals(b), true)
    assert.strictEqual(a.equals(c), false)
    assert.strictEqual(a.equals(d), false)
    assert.strictEqual(a.equals(e), false)
  })

  it('should respect the \'all\' parenthesis option', function () {
    const object = new SymbolNode('a')
    const value = new ConstantNode(1)
    const n = new AssignmentNode(object, value)

    assert.strictEqual(n.toString({ parenthesis: 'all' }), 'a = (1)')
    assert.strictEqual(n.toTex({ parenthesis: 'all' }), ' a:=\\left(1\\right)')
  })

  it('should stringify a AssignmentNode', function () {
    const object = new SymbolNode('b')
    const value = new ConstantNode(3)
    const n = new AssignmentNode(object, value)

    assert.strictEqual(n.toString(), 'b = 3')
  })

  it('should stringify an AssignmentNode containing an AssignmentNode', function () {
    const value = new ConstantNode(2)
    const a = new AssignmentNode(new SymbolNode('a'), value)
    const n = new AssignmentNode(new SymbolNode('b'), a)

    assert.strictEqual(n.toString(), 'b = (a = 2)')
  })

  it('should stringify an AssignmentNode containing nested ArrayNodes', function () {
    const x = new SymbolNode('x')
    const y = new SymbolNode('y')
    const z = new SymbolNode('z')
    const S = new ArrayNode([x, new ArrayNode([y, new ArrayNode([z])])])
    const c1 = new ConstantNode(1)
    const c2 = new ConstantNode(2)
    const c3 = new ConstantNode(3)
    const C = new ArrayNode([c1, new ArrayNode([c2, new ArrayNode([c3])])])
    const A = new AssignmentNode(S, C)

    const expected = '[x, [y, [z]]] = [1, [2, [3]]]'

    assert.strictEqual(A.toString(), expected)
  })

  it('should stringify an AssignmentNode with custom toString', function () {
    // Also checks if custom funcions get passed to the children
    const customFunction = function (node, options) {
      if (node.type === 'AssignmentNode') {
        return node.object.toString(options) +
            (node.index ? node.index.toString(options) : '') +
            ' equals ' + node.value.toString(options)
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const object = new SymbolNode('a')
    const value = new ConstantNode(1)
    const n = new AssignmentNode(object, value)

    assert.strictEqual(n.toString({ handler: customFunction }), 'a equals const(1, number)')
  })

  it('toJSON and fromJSON', function () {
    const a = new SymbolNode('a')
    const b = new ConstantNode(1)
    const c = new ConstantNode(2)
    const d = new ConstantNode(3)

    const node = new AssignmentNode(a, new IndexNode([b, c]), d)

    const json = node.toJSON()

    assert.deepStrictEqual(json, {
      mathjs: 'AssignmentNode',
      index: node.index,
      object: a,
      value: d
    })

    const parsed = AssignmentNode.fromJSON(json)
    assert.deepStrictEqual(parsed, node)
  })

  it('should LaTeX an AssignmentNode', function () {
    const value = new ConstantNode(2)
    const a = new AssignmentNode(new SymbolNode('a'), value)

    assert.strictEqual(a.toTex(), ' a:=2')
  })

  it('should LaTeX an AssignmentNode containing an AssignmentNode', function () {
    const value = new ConstantNode(2)
    const a = new AssignmentNode(new SymbolNode('a'), value)
    const q = new AssignmentNode(new SymbolNode('q'), a)

    assert.strictEqual(q.toTex(), ' q:=\\left( a:=2\\right)')
  })

  it('should LaTeX an AssignmentNode containing horizontally nested ArrayNodes', function () {
    const x = new SymbolNode('x')
    const y = new SymbolNode('y')
    const z = new SymbolNode('z')
    const S = new ArrayNode([
      x,
      new ArrayNode([
        y,
        new ArrayNode([z])
      ])
    ])
    const c1 = new ConstantNode(1)
    const c2 = new ConstantNode(2)
    const c3 = new ConstantNode(3)
    const C = new ArrayNode([
      c1,
      new ArrayNode([
        c2,
        new ArrayNode([c3])
      ])
    ])
    const A = new AssignmentNode(S, C)

    const expected = '\\begin{bmatrix} x&\\begin{bmatrix} y&\\begin{bmatrix} z\\end{bmatrix}\\end{bmatrix}\\end{bmatrix}:=\\begin{bmatrix}1&\\begin{bmatrix}2&\\begin{bmatrix}3\\end{bmatrix}\\end{bmatrix}\\end{bmatrix}'

    assert.strictEqual(A.toTex(), expected)
  })

  it('should LaTeX an AssignmentNode containing vertically nested ArrayNodes', function () {
    const x = new SymbolNode('x')
    const y = new SymbolNode('y')
    const z = new SymbolNode('z')
    const S = new ArrayNode([ // 'rows' ArrayNode, matrix level 0
      new ArrayNode([x]), //       'cols' ArrayNode, matrix level 0
      new ArrayNode([ //           'cols' ArrayNode, matrix level 0
        new ArrayNode([ //           'rows' ArrayNode, matrix level 1
          new ArrayNode([y]), //       'cols' ArrayNode, matrix level 1
          new ArrayNode([ //           'cols' ArrayNode, matrix level 1
            new ArrayNode([z]) //        'rows' ArrayNode, matrix level 2, should be nested in another 'cols' ArrayNode like:
          ]) // new ArrayNode([z])         'cols' ArrayNode, matrix level 2
        ])
      ])
    ])
    const c1 = new ConstantNode(1)
    const c2 = new ConstantNode(2)
    const c3 = new ConstantNode(3)
    const C = new ArrayNode([
      new ArrayNode([c1]),
      new ArrayNode([
        new ArrayNode([
          new ArrayNode([c2]),
          new ArrayNode([
            new ArrayNode([c3])
          ])
        ])
      ])
    ])
    const A = new AssignmentNode(S, C)

    const expected = '\\begin{bmatrix} x\\\\\\begin{bmatrix} y\\\\\\begin{bmatrix} z\\end{bmatrix}\\end{bmatrix}\\end{bmatrix}:=\\begin{bmatrix}1\\\\\\begin{bmatrix}2\\\\\\begin{bmatrix}3\\end{bmatrix}\\end{bmatrix}\\end{bmatrix}'

    assert.strictEqual(A.toTex(), expected)
  })

  it('should LaTeX an AssignmentNode with custom toTex', function () {
    // Also checks if custom funcions get passed to the children
    const customFunction = function (node, options) {
      if (node.isAssignmentNode) {
        return node.object.toTex(options) +
            (node.index ? node.index.toTex(options) : '') +
            '\\mbox{equals}' + node.value.toTex(options)
      } else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + math.typeOf(node.value) + '\\right)'
      }
    }

    const object = new SymbolNode('a')
    const value = new ConstantNode(1)
    const n = new AssignmentNode(object, value)

    assert.strictEqual(n.toTex({ handler: customFunction }), ' a\\mbox{equals}const\\left(1, number\\right)')
  })
})
