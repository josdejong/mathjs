// test RelationalNode
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const Node = math.Node
const ConstantNode = math.ConstantNode
const SymbolNode = math.SymbolNode
const RelationalNode = math.RelationalNode

describe('RelationalNode', function () {
  const one = new ConstantNode(1)
  const two = new ConstantNode(2)
  const three = new ConstantNode(3)
  const four = new ConstantNode(4)

  it('should create a RelationalNode', function () {
    const n = new RelationalNode(['smaller', 'smaller'], [one, two, three])
    assert(n instanceof RelationalNode)
    assert(n instanceof Node)
    assert.strictEqual(n.type, 'RelationalNode')
  })

  it('should have isRelationalNode', function () {
    const node = new RelationalNode(['smaller', 'smaller'], [one, two, three])
    assert(node.isRelationalNode)
  })

  it('should throw an error when calling without new operator', function () {
    assert.throws(function () { RelationalNode() }, TypeError)
  })

  it('should throw an error when creating without arguments', function () {
    assert.throws(function () { console.log(new RelationalNode()) }, TypeError)
    assert.throws(function () { console.log(new RelationalNode('smaller')) }, TypeError)
    assert.throws(function () { console.log(new RelationalNode(['smaller'])) }, TypeError)
    assert.throws(function () { console.log(new RelationalNode(['smaller'], one)) }, TypeError)
    assert.throws(function () { console.log(new RelationalNode(['smaller'], [one])) }, TypeError)
  })

  it('should evaluate a RelationalNode', function () {
    let n = new RelationalNode(['smaller', 'smaller'], [one, two, three])
    let expr = n.compile()
    const scope = {}
    assert.strictEqual(expr.evaluate(scope), true)

    n = new RelationalNode(['smaller', 'smaller'], [three, two, one])
    expr = n.compile()
    assert.strictEqual(expr.evaluate(scope), false)
  })

  it('should use scoped functions for each comparison in a chain', function () {
    const calls = []
    const scope = {
      smaller: (a, b) => {
        calls.push(['smaller', a, b])
        return a > b
      },
      largerEq: (a, b) => {
        calls.push(['largerEq', a, b])
        return a <= b
      }
    }

    assert.strictEqual(math.evaluate('3 < 2 >= 4', scope), true)
    assert.deepStrictEqual(calls, [['smaller', 3, 2], ['largerEq', 2, 4]])
  })

  it('should resolve comparison functions on each evaluation', function () {
    const expr = math.compile('1 < 2 < 3')
    const scope = new Map()

    assert.strictEqual(expr.evaluate(scope), true)
    scope.set('smaller', (a, b) => a > b)
    assert.strictEqual(expr.evaluate(scope), false)
    scope.set('smaller', (a, b) => a < b)
    assert.strictEqual(expr.evaluate(scope), true)
    scope.delete('smaller')
    assert.strictEqual(expr.evaluate(scope), true)
  })

  it('should use function parameters before scoped comparison functions', function () {
    const scope = { smaller: () => false }
    const f = math.evaluate('f(smaller) = 3 < 2 < 1', scope)

    assert.strictEqual(f((a, b) => a > b), true)
    assert.strictEqual(f((a, b) => a < b), false)
  })

  it('should evaluate shared operands once with scoped comparison functions', function () {
    let calls = 0
    const scope = {
      next: () => 3 - calls++,
      smaller: (a, b) => a > b
    }

    assert.strictEqual(math.evaluate('next() < next() < next()', scope), true)
    assert.strictEqual(calls, 3)
  })

  it('should short-circuit overridden comparisons and their remaining operands', function () {
    let calls = 0
    const scope = {
      next: () => ++calls,
      smaller: () => false,
      larger: () => assert.fail('The later comparison should not run')
    }

    assert.strictEqual(math.evaluate('next() < next() > next()', scope), false)
    assert.strictEqual(calls, 2)
  })

  it('should reject non-function comparison overrides', function () {
    for (const value of [undefined, null, 0, false]) {
      assert.throws(
        () => math.evaluate('1 < 2 < 3', new Map([['smaller', value]])),
        /TypeError: 'smaller' is not a function/
      )
    }
  })

  it('should not allow unsafe comparison functions supplied through a scope', function () {
    for (const name of ['constructor', '__proto__', '__lookupGetter__']) {
      const node = new RelationalNode([name], [one, two])
      const scope = new Map([[name, () => true]])

      assert.throws(() => node.evaluate(scope), /No access to property/)
    }
  })

  it('should filter a RelationalNode', function () {
    const n = new RelationalNode(['smaller', 'smaller'], [one, two, three])

    assert.deepStrictEqual(n.filter(function (node) { return node instanceof RelationalNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode }), [one, two, three])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode && node.value === 2 }), [two])
  })

  it('should run forEach on a RelationalNode', function () {
    const n = new RelationalNode(['smaller', 'smaller'], [one, two, three])

    const nodes = []
    const paths = []
    n.forEach(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, n)
    })

    assert.strictEqual(nodes.length, 3)
    assert.strictEqual(nodes[0], one)
    assert.strictEqual(nodes[1], two)
    assert.strictEqual(nodes[2], three)
    assert.deepStrictEqual(paths, ['params[0]', 'params[1]', 'params[2]'])
  })

  it('should map a RelationalNode', function () {
    const n = new RelationalNode(['smaller', 'smaller'], [one, two, three])

    const nodes = []
    const paths = []
    const f = n.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, n)

      return node instanceof ConstantNode && node.value === 1 ? four : node
    })

    assert.strictEqual(nodes.length, 3)
    assert.strictEqual(nodes[0], one)
    assert.strictEqual(nodes[1], two)
    assert.strictEqual(nodes[2], three)
    assert.deepStrictEqual(paths, ['params[0]', 'params[1]', 'params[2]'])

    assert.notStrictEqual(f, n)
    assert.strictEqual(f.params[0], four)
    assert.strictEqual(f.params[1], two)
    assert.strictEqual(f.params[2], three)
  })

  it('should throw an error when the map callback does not return a node', function () {
    const n = new RelationalNode(['smaller', 'smaller'], [one, two, three])

    assert.throws(function () {
      n.map(function () { return undefined })
    }, /Callback function must return a Node/)
  })

  it('should transform a RelationalNodes param', function () {
    const n = new RelationalNode(['smaller', 'smaller'], [one, two, three])

    const f = n.transform(function (node) {
      return node instanceof ConstantNode && node.value === 1 ? four : node
    })

    assert.notStrictEqual(f, n)
    assert.deepStrictEqual(f.params[0], four)
    assert.deepStrictEqual(f.params[1], two)
    assert.deepStrictEqual(f.params[2], three)
  })

  it('should transform a RelationalNode itself', function () {
    const n = new RelationalNode(['smaller', 'smaller'], [one, two, three])

    const f = n.transform(function (node) {
      return node instanceof RelationalNode ? four : node
    })

    assert.notStrictEqual(f, n)
    assert.deepStrictEqual(f, four)
  })

  it('should clone a RelationalNode itself', function () {
    const n = new RelationalNode(['smaller', 'smaller'], [one, two, three])

    const m = n.clone()

    assert(m instanceof RelationalNode)
    assert.deepStrictEqual(m, n)
    assert.notStrictEqual(m, n)
    assert.strictEqual(m.params[0], n.params[0])
    assert.strictEqual(m.params[1], n.params[1])
    assert.strictEqual(m.params[2], n.params[2])
    assert.strictEqual(m.conditionals[0], n.conditionals[0])
    assert.strictEqual(m.conditionals[1], n.conditionals[1])
  })

  it('test equality another Node', function () {
    const n1 = new RelationalNode(['smaller', 'smaller'], [one, two, three])
    const n2 = new RelationalNode(['smaller', 'smaller'], [one, two, three])
    const m = new RelationalNode(['smaller', 'larger'], [one, two, three])
    const p = new RelationalNode(['smaller', 'smaller', 'larger'], [one, two, three, four])
    const q = new RelationalNode(['smaller', 'smaller'], [two, two, two])

    assert.strictEqual(n1.equals(null), false)
    assert.strictEqual(n1.equals(undefined), false)
    assert.strictEqual(n1.equals(n2), true)
    assert.strictEqual(n1.equals(m), false)
    assert.strictEqual(n1.equals(p), false)
    assert.strictEqual(n1.equals(q), false)
  })

  it('should perform short-circuit evaluation', function () {
    const n = math.parse('(a = a+1) > (b = b+1) > (c = c+1) > (d = d+1)')
    const scope = { a: 0, b: 0, c: 0, d: 0 }
    const result = n.evaluate(scope)
    assert.strictEqual(scope.a, 1)
    assert.strictEqual(scope.b, 1)
    assert.strictEqual(scope.c, 0)
    assert.strictEqual(scope.d, 0)
    assert.strictEqual(result, false)
  })

  it('should not evaluate params more than once', function () {
    const n = math.parse('(a = a+1) >= (b = b+1) >= (c = c+1) >= (d = d+1)')
    const scope = { a: 0, b: 0, c: 0, d: 0 }
    const result = n.evaluate(scope)
    assert.strictEqual(scope.a, 1)
    assert.strictEqual(scope.b, 1)
    assert.strictEqual(scope.c, 1)
    assert.strictEqual(scope.d, 1)
    assert.strictEqual(result, true)
  })

  it('should respect the \'all\' parenthesis option', function () {
    assert.strictEqual(math.parse('a<b<c').toString({ parenthesis: 'all' }), '(a) < (b) < (c)')
  })

  it('should stringify a RelationalNode', function () {
    const n1 = new RelationalNode(['smaller', 'smaller'], [one, two, three])
    const n2 = new RelationalNode(['smaller', 'larger', 'smallerEq', 'largerEq', 'equal', 'unequal'], [one, three, two, three, two, two, one])
    const n3 = math.parse('(1 < 2 < 3) == (6 > 5 > 4) != (1 > 2 > 3)')

    assert.strictEqual(n1.toString(), '1 < 2 < 3')
    assert.strictEqual(n2.toString(), '1 < 3 > 2 <= 3 >= 2 == 2 != 1')
    assert.strictEqual(n3.toString(), '(1 < 2 < 3) == (6 > 5 > 4) != (1 > 2 > 3)')
  })

  it('should stringify a RelationalNode with custom toString', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'RelationalNode') {
        let ret = node.params[0].toString(options)
        for (let i = 0; i < node.conditionals.length; i++) {
          ret += ' ' + node.conditionals[i] + ' ' + node.params[i + 1].toString(options)
        }
        return ret
      } else if (node.type === 'ConstantNode') {
        switch (node.value) {
          case 1: return 'one'
          case 2: return 'two'
          case 3: return 'three'
          default: return 'NaN'
        }
      }
    }

    const n = new RelationalNode(['smaller', 'larger', 'smallerEq', 'largerEq', 'equal', 'unequal'], [one, three, two, three, two, two, one])

    assert.strictEqual(n.toString({ handler: customFunction }), 'one smaller three larger two smallerEq three largerEq two equal two unequal one')
  })

  it('should stringify a RelationalNode with custom toHTML', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'RelationalNode') {
        let ret = node.params[0].toHTML(options)
        for (let i = 0; i < node.conditionals.length; i++) {
          ret += ' ' + node.conditionals[i] + ' ' + node.params[i + 1].toHTML(options)
        }
        return ret
      } else if (node.type === 'ConstantNode') {
        switch (node.value) {
          case 1: return 'one'
          case 2: return 'two'
          case 3: return 'three'
          default: return 'NaN'
        }
      }
    }

    const n = new RelationalNode(['smaller', 'larger', 'smallerEq', 'largerEq', 'equal', 'unequal'], [one, three, two, three, two, two, one])

    assert.strictEqual(n.toHTML({ handler: customFunction }), 'one smaller three larger two smallerEq three largerEq two equal two unequal one')
  })

  it('toJSON and fromJSON', function () {
    const x = new SymbolNode('x')
    const n = new RelationalNode(['smaller', 'smaller'], [one, x, three])

    const json = n.toJSON()

    assert.deepStrictEqual(json, {
      mathjs: 'RelationalNode',
      conditionals: ['smaller', 'smaller'],
      params: [one, x, three]
    })

    const parsed = RelationalNode.fromJSON(json)
    assert.deepStrictEqual(parsed, n)
  })

  it('should LaTeX a RelationalNode', function () {
    const x = new SymbolNode('x')
    const n = new RelationalNode(['smaller', 'smaller'], [one, x, three])

    assert.strictEqual(n.toTex(), '1< x<3')
    assert.strictEqual(math.parse('1<x<sqrt(1+2)').toTex(), '1< x<\\sqrt{1+2}')
    assert.strictEqual(math.parse('(-1 < 4/2 < 3) == (3! > 2+3 > 4) != (1 > 2 > 1*3)').toTex(), '\\left(-1<\\frac{4}{2}<3\\right)=\\left(3!>2+3>4\\right)\\neq\\left(1>2>1\\cdot3\\right)')
  })

  it('should HTML a RelationalNode', function () {
    const x = new SymbolNode('x')
    const n = new RelationalNode(['smaller', 'smaller'], [one, x, three])

    assert.strictEqual(n.toHTML(), '<span class="math-number">1</span><span class="math-operator math-binary-operator math-explicit-binary-operator">&lt;</span><span class="math-symbol">x</span><span class="math-operator math-binary-operator math-explicit-binary-operator">&lt;</span><span class="math-number">3</span>')
  })
})
