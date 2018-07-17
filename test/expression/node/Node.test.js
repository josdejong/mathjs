// test Node
const assert = require('assert')
const math = require('../../../src/main')
const Node = math.expression.node.Node

describe('Node', function () {
  function MyNode (value) {
    this.value = value
  }
  MyNode.prototype = new Node()
  MyNode.prototype.forEach = function () {}
  MyNode.prototype.map = function () {
    return new MyNode(this.value)
  }

  it('should create a Node', function () {
    const n = new Node()
    assert(n instanceof Node)
  })

  it('should have isNode', function () {
    const node = new Node()
    assert(node.isNode)
  })

  it('should throw an error when calling without new operator', function () {
    assert.throws(function () { Node() }, SyntaxError)
  })

  it('should filter a Node', function () {
    const n = new MyNode(2)

    assert.deepEqual(n.filter(function () { return true }), [n])
    assert.deepEqual(n.filter(function (node) { return node instanceof Node }), [n])
    assert.deepEqual(n.filter(function (node) { return node instanceof Date }), [])
  })

  it('should transform a Node', function () {
    let a = new MyNode(2)
    let b = new MyNode(3)
    let c = a.transform(function (node) {
      return b
    })
    assert.deepEqual(c, b)

    // no match
    a = new MyNode(2)
    b = new MyNode(3)
    c = a.transform(function (node) {
      return node
    })
    assert.deepEqual(c, a)
  })

  it('should transform a Node using a replacement function', function () {
    const a = new MyNode(2)
    const b = new MyNode(3)
    const c = a.transform(function (node) {
      assert.deepEqual(node, a)
      return b
    })
    assert.deepEqual(c, b)
  })

  it('should throw an error when cloning a Node interface', function () {
    assert.throws(function () {
      const a = new Node()
      a.clone()
    }, /Cannot clone a Node interface/)
  })

  it('should shallow clone the content of a Node', function () {
    const a = new math.expression.node.ConstantNode(1)
    const b = new math.expression.node.ConstantNode(2)
    const c = new math.expression.node.OperatorNode('+', 'add', [a, b])

    const clone = c.clone()

    assert.deepEqual(c, clone)
    assert.notStrictEqual(c, clone)
    assert.strictEqual(clone.args[0], c.args[0])
    assert.strictEqual(clone.args[1], c.args[1])
  })

  it('should deepClone the content of a Node', function () {
    const a = new math.expression.node.ConstantNode(1)
    const b = new math.expression.node.ConstantNode(2)
    const c = new math.expression.node.OperatorNode('+', 'add', [a, b])

    const clone = c.cloneDeep()

    assert.deepEqual(c, clone)
    assert.notStrictEqual(c, clone)
    assert.notStrictEqual(clone.args[0], c.args[0])
    assert.notStrictEqual(clone.args[1], c.args[1])
  })

  it('test equality with another Node', function () {
    assert.strictEqual(new Node().equals(new Node()), true)
    assert.strictEqual(new Node().equals(null), false)
    assert.strictEqual(new Node().equals(undefined), false)
    assert.strictEqual(new Node().equals({}), false)
  })

  it('should throw an error when stringifying a Node interface', function () {
    assert.throws(function () {
      const node = new Node()
      node.toString()
    }, /_toString not implemented for Node/)
  })

  it('should throw an error when calling toJSON on a Node interface', function () {
    assert.throws(function () {
      const a = new Node()
      a.toJSON()
    }, /Cannot serialize object: toJSON not implemented/)
  })

  it('should throw an error when calling _toTex', function () {
    assert.throws(function () {
      const node = new Node()
      node._toTex()
    }, /_toTex not implemented for Node/)
  })

  it('should ignore custom toString if it returns nothing', function () {
    const callback1 = function (node, callback) {}
    const callback2 = {
      bla: function (node, callbacks) {}
    }
    const mymath = math.create()
    mymath.expression.node.Node.prototype._toString = function () {
      return 'default'
    }
    const n1 = new mymath.expression.node.Node()
    const s = new mymath.expression.node.SymbolNode('bla')
    const n2 = new mymath.expression.node.FunctionNode(s, [])

    assert.equal(n1.toString(callback1), 'default')
    assert.equal(n2.toString(callback2), 'bla()')
  })

  it('should ignore custom toTex if it returns nothing', function () {
    const callback1 = function (node, callback) {}
    const callback2 = {
      bla: function (node, callbacks) {}
    }
    const mymath = math.create()
    mymath.expression.node.Node.prototype._toTex = function () {
      return 'default'
    }
    const n1 = new mymath.expression.node.Node()
    const s = new mymath.expression.node.SymbolNode('bla')
    const n2 = new mymath.expression.node.FunctionNode(s, [])

    assert.equal(n1.toTex(callback1), 'default')
    assert.equal(n2.toTex(callback2), '\\mathrm{bla}\\left(\\right)')
  })

  it('should throw an error when compiling an abstract node', function () {
    const node = new Node()
    assert.throws(function () {
      node.compile()
    }, /Error: Method _compile should be implemented by type Node/)
  })

  it('should have an identifier', function () {
    const node = new Node()

    assert.equal(node.getIdentifier(), 'Node')
  })

  it('should get the content of a Node', function () {
    const c = new math.expression.node.ConstantNode(1)

    assert.equal(c.getContent(), c)
    assert.deepEqual(c.getContent(), c)
  })
})
