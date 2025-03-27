// test FunctionNode
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
import { toObject } from '../../../../src/utils/map.js'
const Node = math.Node
const ConstantNode = math.ConstantNode
const SymbolNode = math.SymbolNode
const FunctionNode = math.FunctionNode
const OperatorNode = math.OperatorNode
const RangeNode = math.RangeNode
const IndexNode = math.IndexNode
const AccessorNode = math.AccessorNode
const FunctionAssignmentNode = math.FunctionAssignmentNode

describe('FunctionNode', function () {
  it('should create a FunctionNode', function () {
    const c = new ConstantNode(4)
    const n = new FunctionNode(new SymbolNode('sqrt'), [c])
    assert(n instanceof FunctionNode)
    assert(n instanceof Node)
    assert.strictEqual(n.type, 'FunctionNode')
  })

  it('should have isFunctionNode', function () {
    const c = new ConstantNode(1)
    const node = new FunctionNode(new SymbolNode('square'), [c])
    assert(node.isFunctionNode)
  })

  it('should throw an error when calling without new operator', function () {
    const s = new SymbolNode('sqrt')
    const c = new ConstantNode(4)
    assert.throws(function () { FunctionNode(s, [c]) }, TypeError)
  })

  it('should throw an error when calling with wrong arguments', function () {
    const s = new SymbolNode('sqrt')
    const c = new ConstantNode(4)
    assert.throws(function () { console.log(new FunctionNode(new Date(), [])) }, TypeError)
    assert.throws(function () { console.log(new FunctionNode(s, [2, 3])) }, TypeError)
    assert.throws(function () { console.log(new FunctionNode(s, [c, 3])) }, TypeError)
  })

  it('should get the name of a FunctionNode', function () {
    const n1 = new FunctionNode(new SymbolNode('sqrt'), [new ConstantNode(4)])
    assert.strictEqual(n1.name, 'sqrt')

    const n = new AccessorNode(new SymbolNode('a'), new IndexNode([new ConstantNode('toString')]))
    const n2 = new FunctionNode(n, [new ConstantNode(4)])
    assert.strictEqual(n2.name, 'toString')

    const n3 = new FunctionNode(new OperatorNode('+', 'add', []), [new ConstantNode(4)])
    assert.strictEqual(n3.name, '')
  })

  it('should throw an error when evaluating an undefined function', function () {
    const scope = {}
    const s = new FunctionNode('foo', [])
    assert.throws(function () { s.compile().evaluate(scope) }, /Error: Undefined function foo/)
  })

  it('should compile a FunctionNode', function () {
    const s = new SymbolNode('sqrt')
    const c = new ConstantNode(4)
    const n = new FunctionNode(s, [c])

    const scope = {}
    assert.strictEqual(n.compile().evaluate(scope), 2)
  })

  it('should compile a FunctionNode containing an index', function () {
    const s = new SymbolNode('foo')
    const range = [new ConstantNode('bar')]
    const i = new IndexNode(range)
    const a = new AccessorNode(s, i)
    const c = new ConstantNode(4)
    const n = new FunctionNode(a, [c])

    const scope = {
      foo: {
        bar: function (x) {
          return x * x
        }
      }
    }
    assert.strictEqual(n.compile().evaluate(scope), 16)
  })

  it('should execute a FunctionNode with the right context', function () {
    const s = new SymbolNode('foo')
    const i = new IndexNode([new ConstantNode('getCount')])
    const a = new AccessorNode(s, i)
    const c = new ConstantNode(4)
    const n = new FunctionNode(a, [c])

    const scope = {
      foo: {
        count: 42,
        getCount: function () {
          return this.count
        }
      }
    }
    assert.strictEqual(n.compile().evaluate(scope), 42)
  })

  it('should compile a FunctionNode with a raw function', function () {
    const mymath = math.create()
    function myFunction (args, _math, _scope) {
      assert.strictEqual(args.length, 2)
      assert(args[0] instanceof mymath.Node)
      assert(args[1] instanceof mymath.Node)
      assert.deepStrictEqual(toObject(_scope), scope)
      return 'myFunction(' + args.join(', ') + ')'
    }
    myFunction.rawArgs = true
    mymath.import({ myFunction })

    const s = new SymbolNode('myFunction')
    const a = new mymath.ConstantNode(4)
    const b = new mymath.ConstantNode(5)
    const n = new mymath.FunctionNode(s, [a, b])

    const scope = {
      foo: 'bar'
    }
    assert.strictEqual(n.compile().evaluate(scope), 'myFunction(4, 5)')
  })

  it('should compile a FunctionNode containing an index resolving to a function with rawArgs', function () {
    const scope = {
      obj: {}
    }

    const mymath = math.create()
    function myFunction (args, _math, _scope) {
      assert.strictEqual(args.length, 2)
      assert(args[0] instanceof mymath.Node)
      assert(args[1] instanceof mymath.Node)
      assert.deepStrictEqual(toObject(_scope), scope)
      return 'myFunction(' + args.join(', ') + ')'
    }
    myFunction.rawArgs = true

    const obj = new SymbolNode('obj')
    const prop = new ConstantNode('myFunction')
    const i = new IndexNode([prop])
    const a = new AccessorNode(obj, i)
    const b = new mymath.ConstantNode(4)
    const c = new mymath.ConstantNode(5)
    const n = new mymath.FunctionNode(a, [b, c])

    scope.obj.myFunction = myFunction

    assert.strictEqual(n.compile().evaluate(scope), 'myFunction(4, 5)')
  })

  it('should compile a FunctionNode with overloaded a raw function', function () {
    const mymath = math.create()
    function myFunction (args, _math, _scope) {
      assert.ok(false, 'should not be executed')
    }
    myFunction.rawArgs = true
    mymath.import({ myFunction })

    const s = new mymath.SymbolNode('myFunction')
    const a = new mymath.ConstantNode(4)
    const b = new mymath.ConstantNode(5)
    const n = new mymath.FunctionNode(s, [a, b])

    let actualArgs
    const scope = {
      myFunction: function (...args) {
        actualArgs = args
        return 42
      }
    }

    assert.strictEqual(n.compile().evaluate(scope), 42)
    assert.strictEqual(actualArgs[0], a.value)
    assert.strictEqual(actualArgs[1], b.value)
    assert.deepStrictEqual(actualArgs.length, 2)
  })

  it('should filter a FunctionNode', function () {
    const s = new SymbolNode('a')
    const b = new ConstantNode(2)
    const c = new ConstantNode(1)
    const n = new FunctionNode(s, [b, c])

    assert.deepStrictEqual(n.filter(function (node) { return node instanceof FunctionNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof RangeNode }), [])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode }), [b, c])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode && node.value === 2 }), [b])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode && node.value === 4 }), [])
  })

  it('should run forEach on a FunctionNode', function () {
    // multiply(x + 2, x)
    const s = new SymbolNode('multiply')
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new OperatorNode('+', 'add', [a, b])
    const d = new SymbolNode('x')
    const f = new FunctionNode(s, [c, d])

    const nodes = []
    const paths = []
    f.forEach(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, f)
    })

    assert.strictEqual(nodes.length, 3)
    assert.strictEqual(nodes[0], s)
    assert.strictEqual(nodes[1], c)
    assert.strictEqual(nodes[2], d)
    assert.deepStrictEqual(paths, ['fn', 'args[0]', 'args[1]'])
  })

  it('should map a FunctionNode', function () {
    // multiply(x + 2, x)
    const s = new SymbolNode('multiply')
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new OperatorNode('+', 'add', [a, b])
    const d = new SymbolNode('x')
    const f = new FunctionNode(s, [c, d])

    const nodes = []
    const paths = []
    const g = new ConstantNode(3)
    const h = f.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, f)

      return node instanceof SymbolNode && node.name === 'x' ? g : node
    })

    assert.strictEqual(nodes.length, 3)
    assert.strictEqual(nodes[0], s)
    assert.strictEqual(nodes[1], c)
    assert.strictEqual(nodes[2], d)
    assert.deepStrictEqual(paths, ['fn', 'args[0]', 'args[1]'])

    assert.notStrictEqual(h, f)
    assert.strictEqual(h.fn.name, 'multiply')
    assert.strictEqual(h.args[0], c)
    assert.strictEqual(h.args[0].args[0], a)
    assert.strictEqual(h.args[0].args[1], b)
    assert.strictEqual(h.args[1], g)
  })

  it('should throw an error when the map callback does not return a node', function () {
    const s = new SymbolNode('factorial')
    const b = new ConstantNode(2)
    const f = new FunctionNode(s, [b])

    assert.throws(function () {
      f.map(function () { return undefined })
    }, /Callback function must return a Node/)
  })

  it('should transform a FunctionNodes (nested) parameters', function () {
    // multiply(x + 2, x)
    const s = new SymbolNode('multiply')
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new OperatorNode('+', 'add', [a, b])
    const d = new SymbolNode('x')
    const f = new FunctionNode(s, [c, d])

    const g = new ConstantNode(3)
    const h = f.transform(function (node) {
      return node instanceof SymbolNode && node.name === 'x' ? g : node
    })

    assert.notStrictEqual(h, f)
    assert.deepStrictEqual(h.args[0].args[0], g)
    assert.deepStrictEqual(h.args[0].args[1], b)
    assert.deepStrictEqual(h.name, 'multiply')
    assert.deepStrictEqual(h.args[1], g)
  })

  it('should transform a FunctionNodes name', function () {
    // add(2, 3)
    const s = new SymbolNode('add')
    const b = new ConstantNode(2)
    const c = new ConstantNode(3)
    const d = new FunctionNode(s, [b, c])

    const f = d.transform(function (node) {
      if (node instanceof FunctionNode) {
        node.fn = new SymbolNode('subtract')
      }
      return node
    })

    assert.notStrictEqual(f, d)
    assert.deepStrictEqual(f.name, 'subtract')
  })

  it('should transform a FunctionNode itself', function () {
    // add(2, 3)
    const s = new SymbolNode('add')
    const b = new ConstantNode(2)
    const c = new ConstantNode(3)
    const d = new FunctionNode(s, [b, c])

    const e = new ConstantNode(5)
    const f = d.transform(function (node) {
      return node instanceof FunctionNode ? e : node
    })

    assert.deepStrictEqual(f, e)
  })

  it('should traverse a FunctionNode', function () {
    // add(2, 3)
    const s = new SymbolNode('add')
    const b = new ConstantNode(2)
    const c = new ConstantNode(3)
    const d = new FunctionNode(s, [b, c])

    let count = 0
    d.traverse(function (node, path, parent) {
      count++

      switch (count) {
        case 1:
          assert.strictEqual(node, d)
          assert.strictEqual(path, null)
          assert.strictEqual(parent, null)
          break

        case 2:
          assert.strictEqual(node, s)
          assert.strictEqual(path, 'fn')
          assert.strictEqual(parent, d)
          break

        case 3:
          assert.strictEqual(node, b)
          assert.strictEqual(path, 'args[0]')
          assert.strictEqual(parent, d)
          break

        case 4:
          assert.strictEqual(node, c)
          assert.strictEqual(path, 'args[1]')
          assert.strictEqual(parent, d)
          break
      }
    })

    assert.strictEqual(count, 4)
  })

  it('should clone a FunctionNode', function () {
    // add(2, 3)
    const s = new SymbolNode('add')
    const b = new ConstantNode(2)
    const c = new ConstantNode(3)
    const d = new FunctionNode(s, [b, c])

    const e = d.clone()
    assert(e instanceof FunctionNode)
    assert.deepStrictEqual(e, d)
    assert.notStrictEqual(e, d)
    assert.strictEqual(e.name, d.name)
    assert.notStrictEqual(e.args, d.args)
    assert.strictEqual(e.args[0], d.args[0])
    assert.strictEqual(e.args[1], d.args[1])
  })

  it('test equality another Node', function () {
    const a = new FunctionNode(new SymbolNode('add'), [new ConstantNode(2), new ConstantNode(3)])
    const b = new FunctionNode(new SymbolNode('add'), [new ConstantNode(2), new ConstantNode(3)])
    const c = new FunctionNode(new SymbolNode('subtract'), [new ConstantNode(2), new ConstantNode(3)])
    const d = new FunctionNode(new SymbolNode('add'), [new ConstantNode(4), new ConstantNode(3)])
    const e = new SymbolNode('add')

    assert.strictEqual(a.equals(null), false)
    assert.strictEqual(a.equals(undefined), false)
    assert.strictEqual(a.equals(b), true)
    assert.strictEqual(a.equals(c), false)
    assert.strictEqual(a.equals(d), false)
    assert.strictEqual(a.equals(e), false)
  })

  it('should stringify a FunctionNode', function () {
    const s = new SymbolNode('sqrt')
    const c = new ConstantNode(4)
    const n = new FunctionNode(s, [c])

    assert.strictEqual(n.toString(), 'sqrt(4)')
  })

  it('should stringify a FunctionNode with an immediately invoked function assignment', function () {
    const f = new FunctionAssignmentNode('f', ['x'], new SymbolNode('x')) // f(x) = x
    const c = new ConstantNode(4)
    const n = new FunctionNode(f, [c])

    assert.strictEqual(n.toString(), '(f(x) = x)(4)')
  })

  it('should pass options when stringifying a FunctionNode', function () {
    const s = new SymbolNode('sqrt')
    const a = new ConstantNode(2)
    const b = new SymbolNode('x')
    const c = new OperatorNode('*', 'multiply', [a, b], true) // implicit
    const n = new FunctionNode(s, [c])

    assert.strictEqual(n.toString(), 'sqrt(2 x)')
    const options = { implicit: 'show' }
    assert.strictEqual(n.toString(options), 'sqrt(2 * x)')
  })

  it('should stringify a FunctionNode with custom toString', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'FunctionNode') {
        let string = '[' + node.name + ']('
        node.args.forEach(function (arg) {
          string += arg.toString(options) + ', '
        })
        string += ')'
        return string
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n1 = new FunctionNode(new SymbolNode('add'), [a, b])
    const n2 = new FunctionNode(new SymbolNode('subtract'), [a, b])

    assert.strictEqual(n1.toString({ handler: customFunction }), '[add](const(1, number), const(2, number), )')
    assert.strictEqual(n2.toString({ handler: customFunction }), '[subtract](const(1, number), const(2, number), )')
  })

  it('should stringify a FunctionNode with custom toHTML', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'FunctionNode') {
        let string = '[' + node.name + ']('
        node.args.forEach(function (arg) {
          string += arg.toHTML(options) + ', '
        })
        string += ')'
        return string
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n1 = new FunctionNode(new SymbolNode('add'), [a, b])
    const n2 = new FunctionNode(new SymbolNode('subtract'), [a, b])

    assert.strictEqual(n1.toHTML({ handler: customFunction }), '[add](const(1, number), const(2, number), )')
    assert.strictEqual(n2.toHTML({ handler: customFunction }), '[subtract](const(1, number), const(2, number), )')
  })

  it('should stringify a FunctionNode with custom toString for a single function', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = {
      add: function (node, options) {
        return node.args[0].toString(options) +
          ' ' + node.name + ' ' +
          node.args[1].toString(options)
      }
    }

    const s = new SymbolNode('add')
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const n = new FunctionNode(s, [a, b])

    assert.strictEqual(n.toString({ handler: customFunction }), '1 add 2')
  })

  it('toJSON and fromJSON', function () {
    const a = new SymbolNode('add')
    const b = new ConstantNode(2)
    const c = new ConstantNode(4)
    const node = new FunctionNode(a, [b, c])

    const json = node.toJSON()

    assert.deepStrictEqual(json, {
      mathjs: 'FunctionNode',
      fn: a,
      args: [b, c]
    })

    const parsed = FunctionNode.fromJSON(json)
    assert.deepStrictEqual(parsed, node)
  })

  it('should LaTeX a FunctionNode', function () {
    const s = new SymbolNode('sqrt')
    const c1 = new ConstantNode(4)
    const c2 = new ConstantNode(5)
    const n = new FunctionNode(s, [c1])
    assert.strictEqual(n.toTex(), '\\sqrt{4}')

    // test permutations
    const n2 = new FunctionNode(new SymbolNode('permutations'), [c1])
    assert.strictEqual(n2.toTex(), '\\mathrm{permutations}\\left(4\\right)')

    const o = new OperatorNode('+', 'add', [c1, c2])
    const n3 = new FunctionNode(new SymbolNode('permutations'), [o])
    assert.strictEqual(n3.toTex(), '\\mathrm{permutations}\\left(4+5\\right)')

    const n4 = new FunctionNode(new SymbolNode('nthRoots'), [c1, c2])
    assert.strictEqual(n4.toTex(), '\\{y : y^5 = {4}\\}')
  })

  it('should have an identifier', function () {
    const s = new SymbolNode('factorial')
    const a = new ConstantNode(2)
    const n = new FunctionNode(s, [a])

    assert.strictEqual(n.getIdentifier(), 'FunctionNode:factorial')
  })

  it('should LaTeX a FunctionNode with custom toTex', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'FunctionNode') {
        let latex = '\\mbox{' + node.name + '}\\left('
        node.args.forEach(function (arg) {
          latex += arg.toTex(options) + ', '
        })
        latex += '\\right)'
        return latex
      } else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + math.typeOf(node.value) + '\\right)'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n1 = new FunctionNode(new SymbolNode('add'), [a, b])
    const n2 = new FunctionNode(new SymbolNode('subtract'), [a, b])

    assert.strictEqual(n1.toTex({ handler: customFunction }), '\\mbox{add}\\left(const\\left(1, number\\right), const\\left(2, number\\right), \\right)')
    assert.strictEqual(n2.toTex({ handler: customFunction }), '\\mbox{subtract}\\left(const\\left(1, number\\right), const\\left(2, number\\right), \\right)')
  })

  it('should LaTeX a FunctionNode with custom toTex for a single function', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = {
      add: function (node, options) {
        return node.args[0].toTex(options) +
          ' ' + node.name + ' ' +
          node.args[1].toTex(options)
      }
    }

    const s = new SymbolNode('add')
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const n = new FunctionNode(s, [a, b])

    assert.strictEqual(n.toTex({ handler: customFunction }), '1 add 2')
  })

  it('should LaTeX a FunctionNode with callback attached to the function', function () {
    const customMath = math.create()
    customMath.add.toTex = function (node, options) {
      return node.args[0].toTex(options) + ' plus ' + node.args[1].toTex(options)
    }

    assert.strictEqual(customMath.parse('add(1,2)').toTex(), '1 plus 2')
  })

  it('should LaTeX a FunctionNode with template string attached to the function', function () {
    const customMath = math.create()
    customMath.add.toTex = '${args[0]} plus ${args[1]}' /* eslint-disable-line no-template-curly-in-string */

    assert.strictEqual(customMath.parse('add(1,2)').toTex(), '1 plus 2')
  })

  it('should LaTeX a FunctionNode with object of callbacks attached to the function', function () {
    const customMath = math.create()
    customMath.sum.toTex = {
      2: '${args[0]}+${args[1]}', /* eslint-disable-line no-template-curly-in-string */
      3: function (node, options) {
        return node.args[0] + '+' + node.args[1] + '+' + node.args[2]
      }
    }

    assert.strictEqual(customMath.parse('sum(1,2)').toTex(), '1+2')
    assert.strictEqual(customMath.parse('sum(1,2,3)').toTex(), '1+2+3')
  })

  it('should LaTeX templates with string properties', function () {
    const customMath = math.create()
    customMath.add.toTex = '${name}' /* eslint-disable-line no-template-curly-in-string */

    assert.strictEqual(customMath.parse('add(1,2)').toTex(), 'add')
  })

  it('should LaTeX templates with node properties', function () {
    const customMath = math.create()
    customMath.add.toTex = '${args[0]} plus ${args[1]}' /* eslint-disable-line no-template-curly-in-string */

    assert.strictEqual(customMath.parse('add(1,2)').toTex(), '1 plus 2')
  })

  it('should LaTeX templates with properties that are arrays of Nodes', function () {
    const customMath = math.create()
    customMath.add.toTex = '${args}' /* eslint-disable-line no-template-curly-in-string */

    assert.strictEqual(customMath.parse('add(1,2)').toTex(), '1,2')
  })

  it('should throw an Error for templates with properties that don\'t exist', function () {
    const customMath = math.create()
    customMath.add.toTex = '${some_property}' /* eslint-disable-line no-template-curly-in-string */

    assert.throws(function () { customMath.parse('add(1,2)').toTex() }, ReferenceError)
  })

  it('should throw an Error for templates with properties that aren\'t Nodes or Strings or Arrays of Nodes', function () {
    const customMath = math.create()
    customMath.add.toTex = '${some_property}' /* eslint-disable-line no-template-curly-in-string */
    const tree = customMath.parse('add(1,2)')

    tree.some_property = {}
    assert.throws(function () { tree.toTex() }, TypeError)

    customMath.add.prototype.some_property = 1
    tree.some_property = 1
    assert.throws(function () { tree.toTex() }, TypeError)
  })

  it('should throw an Error for templates with properties that are arrays of non Nodes', function () {
    const customMath = math.create()
    customMath.add.toTex = '${some_property}' /* eslint-disable-line no-template-curly-in-string */
    const tree = customMath.parse('add(1,2)')
    tree.some_property = [1, 2]

    assert.throws(function () { tree.toTex() }, TypeError)
  })

  it('evaluates different sorts of function calls', function () {
    const examples = [
      ['1; square(3)', 9],
      ['f(x) = x*x; f(3)', 9],
      ['a={n:7, f: lambda(x) = x*x}; a.f(3)', 9],
      ['a=[7, f(x)=x*x]; a[2](3)', 9],
      ['twiceOn(f,x) = f(f(x)); twiceOn(square, 3)', 81],
      ['twice(f) = lambda(x) = f(f(x)); fourth = twice(square); fourth(3)', 81],
      ['twice(f) = lambda(x) = f(f(x)); [twice(square)][1](3)', 81]
    ]
    for (const example of examples) {
      const answer = math.evaluate(example[0]).valueOf()[0]
      assert.strictEqual(answer, example[1])
    }
  })

  it('produces clear error messages when the callee is not a function', function () {
    const throwers = [
      ['tau(3)', TypeError, /tau.*value[\s\S]*6.28/],
      ['f = 7; f(3)', TypeError, /f.*value[\s\S]*7/],
      ['a={f: 7}; a.f(3)', Error, /method.*f/],
      ['a=[1,2]; a[2](3)', TypeError, /a\[2\].*value[\s\S]*2/],
      ['twiceOn(f, x) = f(f(x)); twiceOn(7, 3)',
        TypeError,
        /f.*received[\s\S]*7/],
      ['twice(f) = lambda(x) = f(f(x)); weird = twice(7); weird(3)',
        TypeError,
        /f.*received[\s\S]*7/],
      ['twice(f) = lambda(x) = f(f(x)); [twice(7)][1](3)',
        TypeError,
        /f.*received[\s\S]*7/],
      ['[square(7)][1](3)', TypeError, /square\(7\).*evaluate[\s\S]*49/]
    ]
    for (const problem of throwers) {
      assert.throws(() => math.evaluate(problem[0]), problem[1])
      assert.throws(() => math.evaluate(problem[0]), problem[2])
    }
  })

  // FIXME: custom instances should have there own function, not return the same function?
  after(function () {
    const customMath = math.create()
    delete customMath.add.toTex
    delete customMath.sum.toTex
  })
})
