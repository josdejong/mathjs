// test OperatorNode
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const Node = math.Node
const ConstantNode = math.ConstantNode
const SymbolNode = math.SymbolNode
const OperatorNode = math.OperatorNode
const ConditionalNode = math.ConditionalNode

describe('OperatorNode', function () {
  it('should create an OperatorNode', function () {
    const n = new OperatorNode('op', 'fn', [])
    assert(n instanceof OperatorNode)
    assert(n instanceof Node)
    assert.strictEqual(n.type, 'OperatorNode')
  })

  it('should have isOperatorNode', function () {
    const node = new OperatorNode('op', 'fn', [])
    assert(node.isOperatorNode)
  })

  it('should throw an error when calling without new operator', function () {
    const a = new ConstantNode(2)
    const b = new ConstantNode(3)
    assert.throws(function () { OperatorNode('+', 'add', [a, b]) }, SyntaxError)
  })

  it('should compile an OperatorNode', function () {
    const a = new ConstantNode(2)
    const b = new ConstantNode(3)
    const n = new OperatorNode('+', 'add', [a, b])

    const expr = n.compile()

    assert.strictEqual(expr.evaluate(), 5)
  })

  it('should test whether a unary or binary operator', function () {
    const n1 = new OperatorNode('-', 'unaryMinus', [new ConstantNode(2)])
    assert.strictEqual(n1.isUnary(), true)
    assert.strictEqual(n1.isBinary(), false)

    // change the args of an operator node (bad practice, but should keep working correctly)
    n1.args.push(new ConstantNode(3))
    assert.strictEqual(n1.isUnary(), false)
    assert.strictEqual(n1.isBinary(), true)

    const n2 = new OperatorNode('+', 'add', [new ConstantNode(2), new ConstantNode(3)])
    assert.strictEqual(n2.isUnary(), false)
    assert.strictEqual(n2.isBinary(), true)

    const n3 = new OperatorNode('+', 'add', [new ConstantNode(2), new ConstantNode(3), new ConstantNode(4)])
    assert.strictEqual(n3.isUnary(), false)
    assert.strictEqual(n3.isBinary(), false)

    // change the args of an operator node (bad practice, but should keep working correctly)
    n3.args.splice(2, 1)
    assert.strictEqual(n3.isUnary(), false)
    assert.strictEqual(n3.isBinary(), true)
  })

  it('should throw an error in case of unresolved operator function', function () {
    const a = new ConstantNode(2)
    const b = new ConstantNode(3)
    const n = new OperatorNode('***', 'foo', [a, b])

    assert.throws(function () {
      n.compile()
    }, /Function foo missing in provided namespace/)
  })

  it('should filter an OperatorNode', function () {
    const a = new ConstantNode(2)
    const b = new ConstantNode(3)
    const n = new OperatorNode('+', 'add', [a, b])

    assert.deepStrictEqual(n.filter(function (node) { return node instanceof OperatorNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof SymbolNode }), [])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode }), [a, b])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode && node.value === 2 }), [a])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof ConstantNode && node.value === 4 }), [])
  })

  it('should filter an OperatorNode without contents', function () {
    const n = new OperatorNode('op', 'fn', [])

    assert.deepStrictEqual(n.filter(function (node) { return node instanceof OperatorNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof SymbolNode }), [])
  })

  it('should run forEach on an OperatorNode', function () {
    // x^2-x
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new OperatorNode('^', 'pow', [a, b])
    const d = new SymbolNode('x')
    const e = new OperatorNode('-', 'subtract', [c, d])

    const nodes = []
    const paths = []
    e.forEach(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, e)
    })

    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], c)
    assert.strictEqual(nodes[1], d)
    assert.deepStrictEqual(paths, ['args[0]', 'args[1]'])
  })

  it('should map an OperatorNode', function () {
    // x^2-x
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new OperatorNode('^', 'pow', [a, b])
    const d = new SymbolNode('x')
    const e = new OperatorNode('-', 'subtract', [c, d])

    const nodes = []
    const paths = []
    const f = new ConstantNode(3)
    const g = e.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, e)

      return node instanceof SymbolNode && node.name === 'x' ? f : node
    })

    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], c)
    assert.strictEqual(nodes[1], d)
    assert.deepStrictEqual(paths, ['args[0]', 'args[1]'])

    assert.notStrictEqual(g, e)
    assert.strictEqual(g.args[0], e.args[0])
    assert.strictEqual(g.args[0].args[0], a) // nested x is not replaced
    assert.deepStrictEqual(g.args[0].args[1], b)
    assert.deepStrictEqual(g.args[1], f)
  })

  it('should map an implicit OperatorNode', function () {
    const x = new SymbolNode('x')
    const y = new SymbolNode('y')
    const product = new OperatorNode('*', 'multiply', [x, y], true /* implicit */)

    assert.deepStrictEqual(product.map(function (x) { return x }), product)
  })

  it('should throw an error when the map callback does not return a node', function () {
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new OperatorNode('^', 'pow', [a, b])

    assert.throws(function () {
      c.map(function () { return undefined })
    }, /Callback function must return a Node/)
  })

  it('should transform an OperatorNodes parameters', function () {
    // x^2-x
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new OperatorNode('^', 'pow', [a, b])
    const d = new SymbolNode('x')
    const e = new OperatorNode('-', 'subtract', [c, d])

    const f = new ConstantNode(3)
    const g = e.transform(function (node) {
      return node instanceof SymbolNode && node.name === 'x' ? f : node
    })

    assert.deepStrictEqual(g.args[1], f)
  })

  it('should transform an OperatorNode itself', function () {
    // x^2-x
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new OperatorNode('+', 'add', [a, b])

    const f = new ConstantNode(3)
    const g = c.transform(function (node) {
      return node instanceof OperatorNode ? f : node
    })

    assert.notStrictEqual(g, c)
    assert.deepStrictEqual(g, f)
  })

  it('should clone an OperatorNode', function () {
    // x^2-x
    const a = new SymbolNode('x')
    const b = new ConstantNode(2)
    const c = new OperatorNode('+', 'add', [a, b])

    const d = c.clone()
    assert(d instanceof OperatorNode)
    assert.deepStrictEqual(d, c)
    assert.notStrictEqual(d, c)
    assert.notStrictEqual(d.args, c.args)
    assert.strictEqual(d.args[0], c.args[0])
    assert.strictEqual(d.args[1], c.args[1])
  })

  it('should clone implicit multiplications', function () {
    const two = new ConstantNode(2)
    const x = new SymbolNode('x')
    const node = new OperatorNode('*', 'multiply', [two, x], true)

    assert.strictEqual('2 x', node.toString())
    assert.strictEqual(true, node.clone().implicit)
    assert.strictEqual(node.toString(), node.clone().toString())
  })

  it('test equality another Node', function () {
    const a = new OperatorNode('+', 'add', [new SymbolNode('x'), new ConstantNode(2)])
    const b = new OperatorNode('+', 'add', [new SymbolNode('x'), new ConstantNode(2)])
    const c = new OperatorNode('*', 'multiply', [new SymbolNode('x'), new ConstantNode(2)])
    const d = new OperatorNode('*', 'add', [new SymbolNode('x'), new ConstantNode(3)])
    const e = new OperatorNode('*', 'add', [new SymbolNode('x'), new ConstantNode(2), new ConstantNode(4)])

    assert.strictEqual(a.equals(null), false)
    assert.strictEqual(a.equals(undefined), false)
    assert.strictEqual(a.equals(b), true)
    assert.strictEqual(a.equals(c), false)
    assert.strictEqual(a.equals(d), false)
    assert.strictEqual(a.equals(e), false)
  })

  describe('toString', function () {
    it('should stringify an OperatorNode', function () {
      const a = new ConstantNode(2)
      const b = new ConstantNode(3)

      const n = new OperatorNode('+', 'add', [a, b])
      assert.strictEqual(n.toString(), '2 + 3')
    })

    it('should stringify an OperatorNode with factorial', function () {
      const a = new ConstantNode(2)
      const n = new OperatorNode('!', 'factorial', [a])
      assert.strictEqual(n.toString(), '2!')
    })

    it('should stringify an OperatorNode with unary minus', function () {
      const a = new ConstantNode(2)
      const n = new OperatorNode('-', 'unaryMinus', [a])
      assert.strictEqual(n.toString(), '-2')
    })

    it('should stringify an OperatorNode with zero arguments', function () {
      const n = new OperatorNode('foo', 'foo', [])
      assert.strictEqual(n.toString(), 'foo()')
    })

    it('should stringify an OperatorNode with more than two operators', function () {
      const a = new ConstantNode(2)
      const b = new ConstantNode(3)
      const c = new ConstantNode(4)

      const n = new OperatorNode('foo', 'foo', [a, b, c])
      assert.strictEqual(n.toString(), 'foo(2, 3, 4)')
    })

    it('should stringify addition and multiplication with more than two operands', function () {
      const a = new SymbolNode('a')
      const b = new SymbolNode('b')
      const c = new SymbolNode('c')

      const add = new OperatorNode('+', 'add', [a, b, c])
      const multiply = new OperatorNode('*', 'multiply', [a, b, c])
      const implicitMultiply = new OperatorNode('*', 'multiply', [a, b, c], true)

      assert.strictEqual(add.toString(), 'a + b + c')
      assert.strictEqual(multiply.toString(), 'a * b * c')
      assert.strictEqual(implicitMultiply.toString(), 'a b c')
    })

    it('should stringify addition and multiplication with more than two operands including OperatorNode', function () {
      const a = new SymbolNode('a')
      const b = new SymbolNode('b')
      const c = new SymbolNode('c')
      const d = new SymbolNode('d')

      const mult = new OperatorNode('*', 'multiply', [a, b])
      const add = new OperatorNode('+', 'add', [a, b])

      const multipleMultWithMult = new OperatorNode('*', 'multiply', [c, mult, d])
      const multipleMultWithAdd = new OperatorNode('*', 'multiply', [c, add, d])
      const multipleAddWithMult = new OperatorNode('+', 'add', [c, mult, d])
      const multipleAddWithAdd = new OperatorNode('+', 'add', [c, add, d])

      assert.strictEqual(multipleMultWithMult.toString(), 'c * a * b * d')
      assert.strictEqual(multipleMultWithAdd.toString(), 'c * (a + b) * d')
      assert.strictEqual(multipleAddWithMult.toString(), 'c + a * b + d')
      assert.strictEqual(multipleAddWithAdd.toString(), 'c + a + b + d')
    })

    it('should stringify an OperatorNode that contains an operatornode with more than two operands', function () {
      const a = new SymbolNode('a')
      const b = new SymbolNode('b')
      const c = new SymbolNode('c')
      const d = new SymbolNode('d')

      const mult = new OperatorNode('*', 'multiply', [a, b, c])
      const add = new OperatorNode('+', 'add', [a, b, c])

      const addWithMult = new OperatorNode('+', 'add', [mult, d])
      const addWithAdd = new OperatorNode('+', 'add', [add, d])
      const multWithMult = new OperatorNode('*', 'multiply', [mult, d])
      const multWithAdd = new OperatorNode('*', 'multiply', [add, d])

      assert.strictEqual(addWithMult.toString(), 'a * b * c + d')
      assert.strictEqual(addWithAdd.toString(), 'a + b + c + d')
      assert.strictEqual(multWithMult.toString(), 'a * b * c * d')
      assert.strictEqual(multWithAdd.toString(), '(a + b + c) * d')
    })

    it('should stringify an OperatorNode with nested operator nodes', function () {
      const a = new ConstantNode(2)
      const b = new ConstantNode(3)
      const c = new ConstantNode(4)
      const d = new ConstantNode(5)

      const n1 = new OperatorNode('+', 'add', [a, b])
      const n2 = new OperatorNode('-', 'subtract', [c, d])
      const n3 = new OperatorNode('*', 'multiply', [n1, n2])

      assert.strictEqual(n1.toString(), '2 + 3')
      assert.strictEqual(n2.toString(), '4 - 5')
      assert.strictEqual(n3.toString(), '(2 + 3) * (4 - 5)')
    })

    it('should stringify left associative OperatorNodes that are associative with another Node', function () {
      assert.strictEqual(math.parse('(a+b)+c').toString({ parenthesis: 'auto' }), 'a + b + c')
      assert.strictEqual(math.parse('a+(b+c)').toString({ parenthesis: 'auto' }), 'a + b + c')
      assert.strictEqual(math.parse('(a+b)-c').toString({ parenthesis: 'auto' }), 'a + b - c')
      assert.strictEqual(math.parse('a+(b-c)').toString({ parenthesis: 'auto' }), 'a + b - c')

      assert.strictEqual(math.parse('(a*b)*c').toString({ parenthesis: 'auto' }), 'a * b * c')
      assert.strictEqual(math.parse('a*(b*c)').toString({ parenthesis: 'auto' }), 'a * b * c')
      assert.strictEqual(math.parse('(a*b)/c').toString({ parenthesis: 'auto' }), 'a * b / c')
      assert.strictEqual(math.parse('a*(b/c)').toString({ parenthesis: 'auto' }), 'a * b / c')
    })

    it('should stringify left associative OperatorNodes that are not associative with another Node', function () {
      assert.strictEqual(math.parse('(a-b)-c').toString({ parenthesis: 'auto' }), 'a - b - c')
      assert.strictEqual(math.parse('a-(b-c)').toString({ parenthesis: 'auto' }), 'a - (b - c)')
      assert.strictEqual(math.parse('(a-b)+c').toString({ parenthesis: 'auto' }), 'a - b + c')
      assert.strictEqual(math.parse('a-(b+c)').toString({ parenthesis: 'auto' }), 'a - (b + c)')

      assert.strictEqual(math.parse('(a/b)/c').toString({ parenthesis: 'auto' }), 'a / b / c')
      assert.strictEqual(math.parse('a/(b/c)').toString({ parenthesis: 'auto' }), 'a / (b / c)')
      assert.strictEqual(math.parse('(a/b)*c').toString({ parenthesis: 'auto' }), 'a / b * c')
      assert.strictEqual(math.parse('a/(b*c)').toString({ parenthesis: 'auto' }), 'a / (b * c)')
    })

    it('should stringify right associative OperatorNodes that are not associative with another Node', function () {
      assert.strictEqual(math.parse('(a^b)^c').toString({ parenthesis: 'auto' }), '(a ^ b) ^ c')
      assert.strictEqual(math.parse('a^(b^c)').toString({ parenthesis: 'auto' }), 'a ^ b ^ c')
    })

    it('should stringify unary OperatorNodes containing a binary OperatorNode', function () {
      assert.strictEqual(math.parse('(a*b)!').toString(), '(a * b)!')
      assert.strictEqual(math.parse('-(a*b)').toString(), '-(a * b)')
      assert.strictEqual(math.parse('-(a+b)').toString(), '-(a + b)')
    })

    it('should stringify unary OperatorNodes containing a unary OperatorNode', function () {
      assert.strictEqual(math.parse('(-a)!').toString({ parenthesis: 'auto' }), '(-a)!')
      assert.strictEqual(math.parse('-(a!)').toString({ parenthesis: 'auto' }), '-a!')
      assert.strictEqual(math.parse('-(-a)').toString({ parenthesis: 'auto' }), '-(-a)')
    })
  })

  it('should stringify an OperatorNode with custom toString', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'OperatorNode') {
        return node.op + node.fn + '(' +
          node.args[0].toString(options) +
          ', ' + node.args[1].toString(options) + ')'
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n1 = new OperatorNode('+', 'add', [a, b])
    const n2 = new OperatorNode('-', 'subtract', [a, b])

    assert.strictEqual(n1.toString({ handler: customFunction }), '+add(const(1, number), const(2, number))')
    assert.strictEqual(n2.toString({ handler: customFunction }), '-subtract(const(1, number), const(2, number))')
  })

  it('should stringify an OperatorNode with custom toString for a single operator', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if ((node.type === 'OperatorNode') && (node.fn === 'add')) {
        return node.args[0].toString(options) +
          node.op + node.fn + node.op +
          node.args[1].toString(options)
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeOf(node.value) + ')'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n = new OperatorNode('+', 'add', [a, b])

    assert.strictEqual(n.toString({ handler: customFunction }), 'const(1, number)+add+const(2, number)')
  })

  it('should respect the \'all\' parenthesis option', function () {
    assert.strictEqual(math.parse('1+1+1').toString({ parenthesis: 'all' }), '(1 + 1) + 1')
    assert.strictEqual(math.parse('1+1+1').toTex({ parenthesis: 'all' }), '\\left(1+1\\right)+1')
  })

  it('should correctly LaTeX fractions in \'all\' parenthesis mode', function () {
    assert.strictEqual(math.parse('1/2/3').toTex({ parenthesis: 'all' }), '\\frac{\\left(\\frac{1}{2}\\right)}{3}')
  })

  it('should LaTeX an OperatorNode', function () {
    const a = new ConstantNode(2)
    const b = new ConstantNode(3)

    const n = new OperatorNode('+', 'add', [a, b])
    assert.strictEqual(n.toTex(), '2+3')
  })

  it('should LaTeX an OperatorNode with factorial', function () {
    const a = new ConstantNode(2)
    const n = new OperatorNode('!', 'factorial', [a])
    assert.strictEqual(n.toTex(), '2!')
  })

  it('should LaTeX an OperatorNode with factorial of an OperatorNode', function () {
    const a = new ConstantNode(2)
    const b = new ConstantNode(3)

    const sub = new OperatorNode('-', 'subtract', [a, b])
    const add = new OperatorNode('+', 'add', [a, b])
    const mult = new OperatorNode('*', 'multiply', [a, b])
    const div = new OperatorNode('/', 'divide', [a, b])

    const n1 = new OperatorNode('!', 'factorial', [sub])
    const n2 = new OperatorNode('!', 'factorial', [add])
    const n3 = new OperatorNode('!', 'factorial', [mult])
    const n4 = new OperatorNode('!', 'factorial', [div])
    assert.strictEqual(n1.toTex(), '\\left(2-3\\right)!')
    assert.strictEqual(n2.toTex(), '\\left(2+3\\right)!')
    assert.strictEqual(n3.toTex(), '\\left(2\\cdot3\\right)!')
    assert.strictEqual(n4.toTex(), '\\frac{2}{3}!')
  })

  it('should LaTeX an OperatorNode with unary minus', function () {
    const a = new ConstantNode(2)
    const b = new ConstantNode(3)

    const sub = new OperatorNode('-', 'subtract', [a, b])
    const add = new OperatorNode('+', 'add', [a, b])

    const n1 = new OperatorNode('-', 'unaryMinus', [a])
    const n2 = new OperatorNode('-', 'unaryMinus', [sub])
    const n3 = new OperatorNode('-', 'unaryMinus', [add])

    assert.strictEqual(n1.toTex(), '-2')
    assert.strictEqual(n2.toTex(), '-\\left(2-3\\right)')
    assert.strictEqual(n3.toTex(), '-\\left(2+3\\right)')
  })

  it('should LaTeX an OperatorNode that subtracts an OperatorNode', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)
    const c = new ConstantNode(3)

    const sub = new OperatorNode('-', 'subtract', [b, c])
    const add = new OperatorNode('+', 'add', [b, c])

    const n1 = new OperatorNode('-', 'subtract', [a, sub])
    const n2 = new OperatorNode('-', 'subtract', [a, add])

    assert.strictEqual(n1.toTex(), '1-\\left(2-3\\right)')
    assert.strictEqual(n2.toTex(), '1-\\left(2+3\\right)')
  })

  it('should LaTeX an OperatorNode with zero arguments', function () {
    const n = new OperatorNode('foo', 'foo', [])
    assert.strictEqual(n.toTex(), '\\mathrm{foo}\\left(\\right)')
  })

  it('should LaTeX an OperatorNode with more than two operators', function () {
    const a = new ConstantNode(2)
    const b = new ConstantNode(3)
    const c = new ConstantNode(4)

    const n = new OperatorNode('foo', 'foo', [a, b, c])
    assert.strictEqual(n.toTex(), '\\mathrm{foo}\\left(2,3,4\\right)')
  })

  it('should LaTeX an OperatorNode with nested operator nodes', function () {
    const a = new ConstantNode(2)
    const b = new ConstantNode(3)
    const c = new ConstantNode(4)
    const d = new ConstantNode(5)

    const n1 = new OperatorNode('+', 'add', [a, b])
    const n2 = new OperatorNode('-', 'subtract', [c, d])
    const n3 = new OperatorNode('*', 'multiply', [n1, n2])

    const m2 = new OperatorNode('*', 'multiply', [n1, c])
    const m3 = new OperatorNode('-', 'subtract', [m2, d])

    assert.strictEqual(n1.toTex(), '2+3')
    assert.strictEqual(n2.toTex(), '4-5')
    assert.strictEqual(n3.toTex(), '\\left(2+3\\right)\\cdot\\left(4-5\\right)')
    assert.strictEqual(m3.toTex(), '\\left(2+3\\right)\\cdot4-5')
  })

  it('should LaTeX addition and multiplication with more than two operands', function () {
    const a = new SymbolNode('a')
    const b = new SymbolNode('b')
    const c = new SymbolNode('c')

    const add = new OperatorNode('+', 'add', [a, b, c])
    const multiply = new OperatorNode('*', 'multiply', [a, b, c])
    const implicitMultiply = new OperatorNode('*', 'multiply', [a, b, c], true)

    assert.strictEqual(add.toTex(), ' a+\\mathrm{b}+ c')
    assert.strictEqual(multiply.toTex(), ' a\\cdot\\mathrm{b}\\cdot c')
    assert.strictEqual(implicitMultiply.toTex(), ' a~\\mathrm{b}~ c')
  })

  it('should LaTeX addition and multiplication with more than two operands including OperatorNode', function () {
    const a = new SymbolNode('a')
    const b = new SymbolNode('b')
    const c = new SymbolNode('c')
    const d = new SymbolNode('d')

    const mult = new OperatorNode('*', 'multiply', [a, b])
    const add = new OperatorNode('+', 'add', [a, b])

    const multipleMultWithMult = new OperatorNode('*', 'multiply', [c, mult, d])
    const multipleMultWithAdd = new OperatorNode('*', 'multiply', [c, add, d])
    const multipleAddWithMult = new OperatorNode('+', 'add', [c, mult, d])
    const multipleAddWithAdd = new OperatorNode('+', 'add', [c, add, d])

    assert.strictEqual(multipleMultWithMult.toTex(), ' c\\cdot a\\cdot\\mathrm{b}\\cdot d')
    assert.strictEqual(multipleMultWithAdd.toTex(), ' c\\cdot\\left( a+\\mathrm{b}\\right)\\cdot d')
    assert.strictEqual(multipleAddWithMult.toTex(), ' c+ a\\cdot\\mathrm{b}+ d')
    assert.strictEqual(multipleAddWithAdd.toTex(), ' c+ a+\\mathrm{b}+ d')
  })

  it('should LaTeX an OperatorNode that contains an operatornode with more than two operands', function () {
    const a = new SymbolNode('a')
    const b = new SymbolNode('b')
    const c = new SymbolNode('c')
    const d = new SymbolNode('d')

    const mult = new OperatorNode('*', 'multiply', [a, b, c])
    const add = new OperatorNode('+', 'add', [a, b, c])

    const addWithMult = new OperatorNode('+', 'add', [mult, d])
    const addWithAdd = new OperatorNode('+', 'add', [add, d])
    const multWithMult = new OperatorNode('*', 'multiply', [mult, d])
    const multWithAdd = new OperatorNode('*', 'multiply', [add, d])

    assert.strictEqual(addWithMult.toTex(), ' a\\cdot\\mathrm{b}\\cdot c+ d')
    assert.strictEqual(addWithAdd.toTex(), ' a+\\mathrm{b}+ c+ d')
    assert.strictEqual(multWithMult.toTex(), ' a\\cdot\\mathrm{b}\\cdot c\\cdot d')
    assert.strictEqual(multWithAdd.toTex(), '\\left( a+\\mathrm{b}+ c\\right)\\cdot d')
  })

  it('should LaTeX fractions with operators that are enclosed in parenthesis', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const add = new OperatorNode('+', 'add', [a, a])
    const frac = new OperatorNode('/', 'divide', [add, b])
    assert.strictEqual(frac.toTex(), '\\frac{1+1}{2}')
  })

  it('should have an identifier', function () {
    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n = new OperatorNode('+', 'add', [a, b])

    assert.strictEqual(n.getIdentifier(), 'OperatorNode:add')
  })

  it('should LaTeX an OperatorNode with custom toTex', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'OperatorNode') {
        return node.op + node.fn + '(' +
          node.args[0].toTex(options) +
          ', ' + node.args[1].toTex(options) + ')'
      } else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + math.typeOf(node.value) + '\\right)'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n1 = new OperatorNode('+', 'add', [a, b])
    const n2 = new OperatorNode('-', 'subtract', [a, b])

    assert.strictEqual(n1.toTex({ handler: customFunction }), '+add(const\\left(1, number\\right), const\\left(2, number\\right))')
    assert.strictEqual(n2.toTex({ handler: customFunction }), '-subtract(const\\left(1, number\\right), const\\left(2, number\\right))')
  })

  it('should LaTeX an OperatorNode with custom toTex for a single operator', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if ((node.type === 'OperatorNode') && (node.fn === 'add')) {
        return node.args[0].toTex(options) +
          node.op + node.fn + node.op +
          node.args[1].toTex(options)
      } else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + math.typeOf(node.value) + '\\right)'
      }
    }

    const a = new ConstantNode(1)
    const b = new ConstantNode(2)

    const n = new OperatorNode('+', 'add', [a, b])

    assert.strictEqual(n.toTex({ handler: customFunction }), 'const\\left(1, number\\right)+add+const\\left(2, number\\right)')
  })

  it('should LaTeX powers of fractions with parentheses', function () {
    const a = new ConstantNode(1)
    const frac = new OperatorNode('/', 'divide', [a, a])
    const pow = new OperatorNode('^', 'pow', [frac, a])

    assert.strictEqual(pow.toTex(), '\\left({\\frac{1}{1}}\\right)^{1}')
  })

  it('should LaTeX powers of conditions with parentheses', function () {
    const a = new ConstantNode(1)
    const cond = new ConditionalNode(a, a, a)
    const pow = new OperatorNode('^', 'pow', [cond, a])

    assert.strictEqual(pow.toTex(), '\\left({\\begin{cases} {1}, &\\quad{\\text{if }\\;1}\\\\{1}, &\\quad{\\text{otherwise}}\\end{cases}}\\right)^{1}')
  })

  it('should LaTeX simple expressions in \'auto\' mode', function () {
    // this covers a bug that was triggered previously
    assert.strictEqual(math.parse('1+(1+1)').toTex({ parenthesis: 'auto' }), '1+1+1')
  })

  it('should stringify implicit multiplications', function () {
    const a = math.parse('4a')
    const b = math.parse('4 a')
    const c = math.parse('a b')
    const d = math.parse('2a b')
    const e = math.parse('a b c')
    const f = math.parse('(2+3)a')
    const g = math.parse('(2+3)2')
    const h = math.parse('2(3+4)')

    assert.strictEqual(a.toString(), a.toString({ implicit: 'hide' }))
    assert.strictEqual(a.toString({ implicit: 'hide' }), '4 a')
    assert.strictEqual(a.toString({ implicit: 'show' }), '4 * a')

    assert.strictEqual(b.toString(), b.toString({ implicit: 'hide' }))
    assert.strictEqual(b.toString({ implicit: 'hide' }), '4 a')
    assert.strictEqual(b.toString({ implicit: 'show' }), '4 * a')

    assert.strictEqual(c.toString(), c.toString({ implicit: 'hide' }))
    assert.strictEqual(c.toString({ implicit: 'hide' }), 'a b')
    assert.strictEqual(c.toString({ implicit: 'show' }), 'a * b')

    assert.strictEqual(d.toString(), d.toString({ implicit: 'hide' }))
    assert.strictEqual(d.toString({ implicit: 'hide' }), '2 a b')
    assert.strictEqual(d.toString({ implicit: 'show' }), '2 * a * b')

    assert.strictEqual(e.toString(), e.toString({ implicit: 'hide' }))
    assert.strictEqual(e.toString({ implicit: 'hide' }), 'a b c')
    assert.strictEqual(e.toString({ implicit: 'show' }), 'a * b * c')

    assert.strictEqual(f.toString(), f.toString({ implicit: 'hide' }))
    assert.strictEqual(f.toString({ implicit: 'hide' }), '(2 + 3) a')
    assert.strictEqual(f.toString({ implicit: 'show' }), '(2 + 3) * a')

    assert.strictEqual(g.toString(), g.toString({ implicit: 'hide' }))
    assert.strictEqual(g.toString({ implicit: 'hide' }), '(2 + 3) 2')
    assert.strictEqual(g.toString({ implicit: 'show' }), '(2 + 3) * 2')

    assert.strictEqual(h.toString(), h.toString({ implicit: 'hide' }))
    assert.strictEqual(h.toString({ implicit: 'hide' }), '2 (3 + 4)')
    assert.strictEqual(h.toString({ implicit: 'show' }), '2 * (3 + 4)')
  })

  it('toJSON and fromJSON', function () {
    const b = new ConstantNode(1)
    const c = new ConstantNode(2)

    const node = new OperatorNode('+', 'add', [b, c], true)

    const json = node.toJSON()

    assert.deepStrictEqual(json, {
      mathjs: 'OperatorNode',
      op: '+',
      fn: 'add',
      args: [b, c],
      implicit: true
    })

    const parsed = OperatorNode.fromJSON(json)
    assert.deepStrictEqual(parsed, node)
  })

  it('should LaTeX implicit multiplications', function () {
    const a = math.parse('4a')
    const b = math.parse('4 a')
    const c = math.parse('a b')
    const d = math.parse('2a b')
    const e = math.parse('a b c')
    const f = math.parse('(2+3)a')
    const g = math.parse('(2+3)2')
    const h = math.parse('2(3+4)')

    assert.strictEqual(a.toTex(), a.toTex({ implicit: 'hide' }))
    assert.strictEqual(a.toTex({ implicit: 'hide' }), '4~ a')
    assert.strictEqual(a.toTex({ implicit: 'show' }), '4\\cdot a')

    assert.strictEqual(b.toTex(), b.toTex({ implicit: 'hide' }))
    assert.strictEqual(b.toTex({ implicit: 'hide' }), '4~ a')
    assert.strictEqual(b.toTex({ implicit: 'show' }), '4\\cdot a')

    assert.strictEqual(c.toTex(), c.toTex({ implicit: 'hide' }))
    assert.strictEqual(c.toTex({ implicit: 'hide' }), ' a~\\mathrm{b}')
    assert.strictEqual(c.toTex({ implicit: 'show' }), ' a\\cdot\\mathrm{b}')

    assert.strictEqual(d.toTex(), d.toTex({ implicit: 'hide' }))
    assert.strictEqual(d.toTex({ implicit: 'hide' }), '2~ a~\\mathrm{b}')
    assert.strictEqual(d.toTex({ implicit: 'show' }), '2\\cdot a\\cdot\\mathrm{b}')

    assert.strictEqual(e.toTex(), e.toTex({ implicit: 'hide' }))
    assert.strictEqual(e.toTex({ implicit: 'hide' }), ' a~\\mathrm{b}~ c')
    assert.strictEqual(e.toTex({ implicit: 'show' }), ' a\\cdot\\mathrm{b}\\cdot c')

    assert.strictEqual(f.toTex(), f.toTex({ implicit: 'hide' }))
    assert.strictEqual(f.toTex({ implicit: 'hide' }), '\\left(2+3\\right)~ a')
    assert.strictEqual(f.toTex({ implicit: 'show' }), '\\left(2+3\\right)\\cdot a')

    assert.strictEqual(g.toTex(), g.toTex({ implicit: 'hide' }))
    assert.strictEqual(g.toTex({ implicit: 'hide' }), '\\left(2+3\\right)~2')
    assert.strictEqual(g.toTex({ implicit: 'show' }), '\\left(2+3\\right)\\cdot2')

    assert.strictEqual(h.toTex(), h.toTex({ implicit: 'hide' }))
    assert.strictEqual(h.toTex({ implicit: 'hide' }), '2~\\left(3+4\\right)')
    assert.strictEqual(h.toTex({ implicit: 'show' }), '2\\cdot\\left(3+4\\right)')
  })

  it('should HTML operators', function () {
    assert.strictEqual(math.parse('2 + 3').toHTML(),
      '<span class="math-number">2</span>' +
      '<span class="math-operator math-binary-operator math-explicit-binary-operator">+</span>' +
      '<span class="math-number">3</span>'
    )

    assert.strictEqual(math.parse('not 5').toHTML(),
      '<span class="math-operator math-unary-operator math-lefthand-unary-operator">not</span>' +
      '<span class="math-number">5</span>'
    )

    assert.strictEqual(math.parse('5!').toHTML(),
      '<span class="math-number">5</span>' +
      '<span class="math-operator math-unary-operator math-righthand-unary-operator">!</span>'
    )

    assert.strictEqual(math.parse('5\'').toHTML(),
      '<span class="math-number">5</span>' +
      '<span class="math-operator math-unary-operator math-righthand-unary-operator">&#39;</span>'
    )
  })

  it('should stringify implicit multiplications between ConstantNodes with parentheses', function () {
    const a = math.parse('(4)(4)(4)(4)')
    const b = math.parse('4b*4(4)')
    const c = math.parse('(4(4(4)))')

    assert.strictEqual(a.toString({ implicit: 'hide', parenthesis: 'auto' }), '(4) (4) (4) (4)')
    assert.strictEqual(b.toString({ implicit: 'hide', parenthesis: 'auto' }), '4 b * 4 (4)')
    assert.strictEqual(c.toString({ implicit: 'hide', parenthesis: 'auto' }), '4 (4 (4))')
  })

  it('should LaTeX implicit multiplications between ConstantNodes with parentheses', function () {
    const a = math.parse('(4)(4)(4)(4)')
    const b = math.parse('4b*4(4)')
    const c = math.parse('(4(4(4)))')

    assert.strictEqual(a.toTex({ implicit: 'hide', parenthesis: 'auto' }), '\\left(4\\right)~\\left(4\\right)~\\left(4\\right)~\\left(4\\right)')
    assert.strictEqual(b.toTex({ implicit: 'hide', parenthesis: 'auto' }), '4~\\mathrm{b}\\cdot4~\\left(4\\right)')
    assert.strictEqual(c.toTex({ implicit: 'hide', parenthesis: 'auto' }), '4~\\left(4~\\left(4\\right)\\right)')
  })

  it('should HTML implicit multiplications between ConstantNodes with parentheses', function () {
    const a = math.parse('(4)(4)(4)(4)')
    const b = math.parse('4b*4(4)')
    const c = math.parse('(4(4(4)))')

    assert.strictEqual(a.toHTML({ implicit: 'hide', parenthesis: 'auto' }), '<span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-parenthesis math-round-parenthesis">)</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-parenthesis math-round-parenthesis">)</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-parenthesis math-round-parenthesis">)</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-parenthesis math-round-parenthesis">)</span>')
    assert.strictEqual(b.toHTML({ implicit: 'hide', parenthesis: 'auto' }), '<span class="math-number">4</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-symbol">b</span><span class="math-operator math-binary-operator math-explicit-binary-operator">*</span><span class="math-number">4</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-parenthesis math-round-parenthesis">)</span>')
    assert.strictEqual(c.toHTML({ implicit: 'hide', parenthesis: 'auto' }), '<span class="math-number">4</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-parenthesis math-round-parenthesis">)</span><span class="math-parenthesis math-round-parenthesis">)</span>')
  })
})
