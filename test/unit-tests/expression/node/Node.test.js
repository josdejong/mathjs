// test Node
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const Node = math.Node

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
    assert.throws(function () { Node() }, TypeError)
  })

  it('should filter a Node', function () {
    const n = new MyNode(2)

    assert.deepStrictEqual(n.filter(function () { return true }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof Node }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof Date }), [])
  })

  it('should transform a Node', function () {
    let a = new MyNode(2)
    let b = new MyNode(3)
    let c = a.transform(function (node) {
      return b
    })
    assert.deepStrictEqual(c, b)

    // no match
    a = new MyNode(2)
    b = new MyNode(3)
    c = a.transform(function (node) {
      return node
    })
    assert.deepStrictEqual(c, a)
  })

  it('should transform a Node using a replacement function', function () {
    const a = new MyNode(2)
    const b = new MyNode(3)
    const c = a.transform(function (node) {
      assert.deepStrictEqual(node, a)
      return b
    })
    assert.deepStrictEqual(c, b)
  })

  it('transform should iterate over unchanged nodes', function () {
    const logs = []

    function TestNode (value) {
      this.value = value
    }
    TestNode.prototype = new Node()
    TestNode.prototype.map = function () {
      logs.push('map ' + this.value)
      return new TestNode(this.value)
    }

    const a = new TestNode('a')
    const t = a.transform(function (node) {
      logs.push('transform ' + node.value)
      return node
    })
    assert.deepStrictEqual(t, a)
    assert.deepStrictEqual(logs, [
      'transform a',
      'map a'
    ])
  })

  it('transform should not iterate over replaced nodes', function () {
    const logs = []

    function TestNode (value) {
      this.value = value
    }
    TestNode.prototype = new Node()
    TestNode.prototype.map = function () {
      logs.push('map ' + this.value)
      return new TestNode(this.value)
    }

    const a = new TestNode('a')
    const b = new TestNode('b')

    const t = a.transform(function (node) {
      logs.push('transform ' + node.value)
      return b
    })
    assert.deepStrictEqual(t, b)
    assert.deepStrictEqual(logs, [
      'transform a'
      // NO 'map b' here!
    ])
  })

  it('should throw an error when cloning a Node interface', function () {
    assert.throws(function () {
      const a = new Node()
      a.clone()
    }, /Cannot clone a Node interface/)
  })

  it('should shallow clone the content of a Node', function () {
    const a = new math.ConstantNode(1)
    const b = new math.ConstantNode(2)
    const c = new math.OperatorNode('+', 'add', [a, b])

    const clone = c.clone()

    assert.deepStrictEqual(c, clone)
    assert.notStrictEqual(c, clone)
    assert.strictEqual(clone.args[0], c.args[0])
    assert.strictEqual(clone.args[1], c.args[1])
  })

  it('should deepClone the content of a Node', function () {
    const a = new math.ConstantNode(1)
    const b = new math.ConstantNode(2)
    const c = new math.OperatorNode('+', 'add', [a, b])

    const clone = c.cloneDeep()

    assert.deepStrictEqual(c, clone)
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
    mymath.Node.prototype._toString = function () {
      return 'default'
    }
    const n1 = new mymath.Node()
    const s = new mymath.SymbolNode('bla')
    const n2 = new mymath.FunctionNode(s, [])

    assert.strictEqual(n1.toString(callback1), 'default')
    assert.strictEqual(n2.toString(callback2), 'bla()')
  })

  it('should ignore custom toTex if it returns nothing', function () {
    const callback1 = function (node, callback) {}
    const callback2 = {
      bla: function (node, callbacks) {}
    }
    const mymath = math.create()
    mymath.Node.prototype._toTex = function () {
      return 'default'
    }
    const n1 = new mymath.Node()
    const s = new mymath.SymbolNode('bla')
    const n2 = new mymath.FunctionNode(s, [])

    assert.strictEqual(n1.toTex(callback1), 'default')
    assert.strictEqual(n2.toTex(callback2), '\\mathrm{bla}\\left(\\right)')
  })

  it('should throw an error when compiling an abstract node', function () {
    const node = new Node()
    assert.throws(function () {
      node.compile()
    }, /Error: Method _compile must be implemented by type Node/)
  })

  it('should have an identifier', function () {
    const node = new Node()

    assert.strictEqual(node.getIdentifier(), 'Node')
  })

  it('should get the content of a Node', function () {
    const c = new math.ConstantNode(1)

    assert.strictEqual(c.getContent(), c)
    assert.deepStrictEqual(c.getContent(), c)
  })
})
