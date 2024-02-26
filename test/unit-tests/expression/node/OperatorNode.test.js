// test OperatorNode
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const Node = math.Node
const ConstantNode = math.ConstantNode
const SymbolNode = math.SymbolNode
const OperatorNode = math.OperatorNode
const ConditionalNode = math.ConditionalNode
// Set up a bunch of expression pieces that are used over and over:
const one = new ConstantNode(1)
const two = new ConstantNode(2)
const three = new ConstantNode(3)
const four = new ConstantNode(4)
const five = new ConstantNode(5)
const add23 = new OperatorNode('+', 'add', [two, three])
const sub23 = new OperatorNode('-', 'subtract', [two, three])

const asym = new SymbolNode('a')
const bsym = new SymbolNode('b')
const csym = new SymbolNode('c')
const dsym = new SymbolNode('d')
const xsym = new SymbolNode('x')
const ysym = new SymbolNode('y')

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
    assert.throws(
      function () { OperatorNode('+', 'add', [two, three]) }, TypeError)
  })

  it('should compile an OperatorNode', function () {
    assert.strictEqual(add23.compile().evaluate(), 5)
  })

  it('should test whether a unary or binary operator', function () {
    const n1 = new OperatorNode('-', 'unaryMinus', [two])
    assert.strictEqual(n1.isUnary(), true)
    assert.strictEqual(n1.isBinary(), false)

    // change the args of an operator node (bad practice, but should keep working correctly)
    n1.args.push(three)
    assert.strictEqual(n1.isUnary(), false)
    assert.strictEqual(n1.isBinary(), true)

    const n2 = new OperatorNode('+', 'add', [two, three])
    assert.strictEqual(n2.isUnary(), false)
    assert.strictEqual(n2.isBinary(), true)

    const n3 = new OperatorNode('+', 'add', [two, three, four])
    assert.strictEqual(n3.isUnary(), false)
    assert.strictEqual(n3.isBinary(), false)

    // change the args of an operator node (bad practice, but should keep working correctly)
    n3.args.splice(2, 1)
    assert.strictEqual(n3.isUnary(), false)
    assert.strictEqual(n3.isBinary(), true)
  })

  it('should throw an error in case of unresolved operator function', function () {
    const n = new OperatorNode('***', 'foo', [two, three])

    assert.throws(function () {
      n.compile()
    }, /Function foo missing in provided namespace/)
  })

  it('should filter an OperatorNode', function () {
    assert.deepStrictEqual(add23.filter(function (node) { return node instanceof OperatorNode }), [add23])
    assert.deepStrictEqual(add23.filter(function (node) { return node instanceof SymbolNode }), [])
    assert.deepStrictEqual(add23.filter(function (node) { return node instanceof ConstantNode }), [two, three])
    assert.deepStrictEqual(add23.filter(function (node) { return node instanceof ConstantNode && node.value === 2 }), [two])
    assert.deepStrictEqual(add23.filter(function (node) { return node instanceof ConstantNode && node.value === 4 }), [])
  })

  it('should filter an OperatorNode without contents', function () {
    const n = new OperatorNode('op', 'fn', [])

    assert.deepStrictEqual(n.filter(function (node) { return node instanceof OperatorNode }), [n])
    assert.deepStrictEqual(n.filter(function (node) { return node instanceof SymbolNode }), [])
  })

  it('should run forEach on an OperatorNode', function () {
    // x^2-x
    const c = new OperatorNode('^', 'pow', [xsym, two])
    const d = new SymbolNode('x') // to make sure it's different from xsym
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
    const c = new OperatorNode('^', 'pow', [xsym, two])
    const d = new SymbolNode('x') // to make sure it's different from xsym
    const e = new OperatorNode('-', 'subtract', [c, d])

    const nodes = []
    const paths = []
    const g = e.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, e)

      return node instanceof SymbolNode && node.name === 'x' ? three : node
    })

    assert.strictEqual(nodes.length, 2)
    assert.strictEqual(nodes[0], c)
    assert.strictEqual(nodes[1], d)
    assert.deepStrictEqual(paths, ['args[0]', 'args[1]'])

    assert.notStrictEqual(g, e)
    assert.strictEqual(g.args[0], e.args[0])
    assert.strictEqual(g.args[0].args[0], xsym) // nested x is not replaced
    assert.deepStrictEqual(g.args[0].args[1], two)
    assert.deepStrictEqual(g.args[1], three)
  })

  it('should map an implicit OperatorNode', function () {
    const product = new OperatorNode('*', 'multiply', [xsym, ysym], true /* implicit */)

    assert.deepStrictEqual(product.map(function (x) { return x }), product)
  })

  it('should throw an error when the map callback does not return a node', function () {
    const c = new OperatorNode('^', 'pow', [xsym, two])

    assert.throws(function () {
      c.map(function () { return undefined })
    }, /Callback function must return a Node/)
  })

  it('should transform an OperatorNodes parameters', function () {
    // x^2-x
    const c = new OperatorNode('^', 'pow', [xsym, two])
    const d = new SymbolNode('x') // to make sure it's different from xsym
    const e = new OperatorNode('-', 'subtract', [c, d])

    const g = e.transform(function (node) {
      return node instanceof SymbolNode && node.name === 'x' ? three : node
    })

    assert.deepStrictEqual(g.args[1], three)
  })

  it('should transform an OperatorNode itself', function () {
    const c = new OperatorNode('+', 'add', [xsym, two])

    const g = c.transform(function (node) {
      return node instanceof OperatorNode ? three : node
    })

    assert.notStrictEqual(g, c)
    assert.deepStrictEqual(g, three)
  })

  it('should clone an OperatorNode', function () {
    const c = new OperatorNode('+', 'add', [xsym, two])

    const d = c.clone()
    assert(d instanceof OperatorNode)
    assert.deepStrictEqual(d, c)
    assert.notStrictEqual(d, c)
    assert.notStrictEqual(d.args, c.args)
    assert.strictEqual(d.args[0], c.args[0])
    assert.strictEqual(d.args[1], c.args[1])
  })

  it('should clone implicit multiplications', function () {
    const node = new OperatorNode('*', 'multiply', [two, xsym], true)

    assert.strictEqual('2 x', node.toString())
    assert.strictEqual(true, node.clone().implicit)
    assert.strictEqual(node.toString(), node.clone().toString())
  })

  it('test equality another Node', function () {
    // not using the standard instances to make sure everything is fresh
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

  // Put a given expression through formatting paces: test its consistency,
  // and results under toString and toTex, with various options:
  // example is a object with either a key 'i' for input, or 'n' for Node
  // (in the former case the value of 'i' is parsed to get the Node to test)
  // and keys 's' and 'l' for the string and LaTex output, respectively.
  // If the output is expected to differ for paren values of 'keep' and 'auto',
  // then the keys 'skeep', 'sauto', 'lkeep', and 'lauto' can be used instead
  // Takes optional 2nd argument that gives the list of paren values to try,
  // defaults to ['keep', 'auto']
  function ex (example, parens = ['keep', 'auto']) {
    const hasi = 'i' in example
    const expr = hasi ? math.parse(example.i) : example.n
    const orig = hasi
      ? example.i
      : `${expr.getIdentifier()}${expr.args.map(arg => arg.getIdentifier())}`
    for (const paren of parens) {
      const prefix = `${orig},${paren}: ` // eases reading of failure output
      const skey = 's' in example ? 's' : 's' + paren
      const lkey = 'l' in example ? 'l' : 'l' + paren
      assert.strictEqual(
        prefix + expr.toString({ parenthesis: paren }), prefix + example[skey])
      assert.strictEqual(
        prefix + expr.toTex({ parenthesis: paren }), prefix + example[lkey])
    }
  }

  describe('toString and toTex', function () {
    it('on an OperatorNode', function () {
      ex({ n: add23, s: '2 + 3', l: '2+3' })
    })

    it('on an OperatorNode with factorial', function () {
      ex({ n: new OperatorNode('!', 'factorial', [two]), s: '2!', l: '2!' })
    })

    it('on an OperatorNode with unary minus', function () {
      ex({ n: new OperatorNode('-', 'unaryMinus', [two]), s: '-2', l: '-2' })
    })

    it('on an OperatorNode with zero arguments', function () {
      ex({ n: new OperatorNode('foo', 'foo', []), s: 'foo()', l: '\\mathrm{foo}\\left(\\right)' })
    })

    it('on an OperatorNode with more than two operators', function () {
      ex({
        n: new OperatorNode('foo', 'foo', [two, three, four]),
        s: 'foo(2, 3, 4)',
        l: '\\mathrm{foo}\\left(2,3,4\\right)'
      })
    })

    it('on addition and multiplication with more than two operands', function () {
      // This is slightly different than most of the tests, so not using `ex`
      const add = new OperatorNode('+', 'add', [asym, bsym, csym])
      const multiply = new OperatorNode('*', 'multiply', [asym, bsym, csym])
      const implicitMultiply = new OperatorNode('*', 'multiply', [asym, bsym, csym], true)
      assert.strictEqual(add.toString(), 'a + b + c')
      assert.strictEqual(multiply.toString(), 'a * b * c')
      // The first two verify that implicit: hide is indeed the default
      assert.strictEqual(implicitMultiply.toString(), 'a b c')
      assert.strictEqual(implicitMultiply.toString({ implicit: 'hide' }), 'a b c')
      assert.strictEqual(implicitMultiply.toString({ implicit: 'show' }), 'a * b * c')

      assert.strictEqual(add.toTex(), ' a+\\mathrm{b}+ c')
      assert.strictEqual(multiply.toTex(), ' a\\cdot\\mathrm{b}\\cdot c')
      // The first two verify that implicit: hide is indeed the default
      assert.strictEqual(implicitMultiply.toTex(), ' a~\\mathrm{b}~ c')
      assert.strictEqual(implicitMultiply.toTex({ implicit: 'hide' }), ' a~\\mathrm{b}~ c')
      assert.strictEqual(implicitMultiply.toTex({ implicit: 'show' }), ' a\\cdot\\mathrm{b}\\cdot c')
    })

    it('on addition and multiplication with more than two operands including OperatorNode', function () {
      const mult = new OperatorNode('*', 'multiply', [asym, bsym])
      const add = new OperatorNode('+', 'add', [asym, bsym])

      const multipleMultWithMult = new OperatorNode('*', 'multiply', [csym, mult, dsym])
      const multipleMultWithAdd = new OperatorNode('*', 'multiply', [csym, add, dsym])
      const multipleAddWithMult = new OperatorNode('+', 'add', [csym, mult, dsym])
      const multipleAddWithAdd = new OperatorNode('+', 'add', [csym, add, dsym])

      ex({ n: multipleMultWithMult, s: 'c * a * b * d', l: ' c\\cdot a\\cdot\\mathrm{b}\\cdot d' })
      ex({ n: multipleMultWithAdd, s: 'c * (a + b) * d', l: ' c\\cdot\\left( a+\\mathrm{b}\\right)\\cdot d' })
      ex({ n: multipleAddWithMult, s: 'c + a * b + d', l: ' c+ a\\cdot\\mathrm{b}+ d' })
      ex({ n: multipleAddWithAdd, s: 'c + a + b + d', l: ' c+ a+\\mathrm{b}+ d' })
    })

    it('on an OperatorNode that contains an operatornode with more than two operands', function () {
      const mult = new OperatorNode('*', 'multiply', [asym, bsym, csym])
      const add = new OperatorNode('+', 'add', [asym, bsym, csym])

      const addWithMult = new OperatorNode('+', 'add', [mult, dsym])
      const addWithAdd = new OperatorNode('+', 'add', [add, dsym])
      const multWithMult = new OperatorNode('*', 'multiply', [mult, dsym])
      const multWithAdd = new OperatorNode('*', 'multiply', [add, dsym])

      ex({ n: addWithMult, s: 'a * b * c + d', l: ' a\\cdot\\mathrm{b}\\cdot c+ d' })
      ex({ n: addWithAdd, s: 'a + b + c + d', l: ' a+\\mathrm{b}+ c+ d' })
      ex({ n: multWithMult, s: 'a * b * c * d', l: ' a\\cdot\\mathrm{b}\\cdot c\\cdot d' })
      ex({ n: multWithAdd, s: '(a + b + c) * d', l: '\\left( a+\\mathrm{b}+ c\\right)\\cdot d' })
    })

    it('on an OperatorNode with nested operator nodes', function () {
      const sub45 = new OperatorNode('-', 'subtract', [four, five])
      const prod1 = new OperatorNode('*', 'multiply', [add23, sub45])
      const prod2 = new OperatorNode('*', 'multiply', [add23, four])
      const diff1 = new OperatorNode('-', 'subtract', [prod2, five])

      ex({ n: sub45, s: '4 - 5', l: '4-5' })
      ex({ n: prod1, s: '(2 + 3) * (4 - 5)', l: '\\left(2+3\\right)\\cdot\\left(4-5\\right)' })
      ex({ n: diff1, s: '(2 + 3) * 4 - 5', l: '\\left(2+3\\right)\\cdot4-5' })
    })

    it('on left associative OperatorNodes that are associative with another Node', function () {
      ex({ i: '(a+b)+c', skeep: '(a + b) + c', sauto: 'a + b + c', lkeep: '\\left( a+\\mathrm{b}\\right)+ c', lauto: ' a+\\mathrm{b}+ c' })
      ex({ i: 'a+(b+c)', skeep: 'a + (b + c)', sauto: 'a + b + c', lkeep: ' a+\\left(\\mathrm{b}+ c\\right)', lauto: ' a+\\mathrm{b}+ c' })
      ex({ i: '(a+b)-c', skeep: '(a + b) - c', sauto: 'a + b - c', lkeep: '\\left( a+\\mathrm{b}\\right)- c', lauto: ' a+\\mathrm{b}- c' })
      ex({ i: 'a+(b-c)', skeep: 'a + (b - c)', sauto: 'a + b - c', lkeep: ' a+\\left(\\mathrm{b}- c\\right)', lauto: ' a+\\mathrm{b}- c' })

      ex({ i: '(a*b)*c', skeep: '(a * b) * c', sauto: 'a * b * c', lkeep: '\\left( a\\cdot\\mathrm{b}\\right)\\cdot c', lauto: ' a\\cdot\\mathrm{b}\\cdot c' })
      ex({ i: 'a*(b*c)', skeep: 'a * (b * c)', sauto: 'a * b * c', lkeep: ' a\\cdot\\left(\\mathrm{b}\\cdot c\\right)', lauto: ' a\\cdot\\mathrm{b}\\cdot c' })
      ex({ i: '(a*b)/c', skeep: '(a * b) / c', sauto: 'a * b / c', lkeep: '\\frac{\\left( a\\cdot\\mathrm{b}\\right)}{ c}', lauto: '\\frac{ a\\cdot\\mathrm{b}}{ c}' })
      ex({ i: 'a*(b/c)', skeep: 'a * (b / c)', sauto: 'a * b / c', lkeep: ' a\\cdot\\left(\\frac{\\mathrm{b}}{ c}\\right)', lauto: ' a\\cdot\\frac{\\mathrm{b}}{ c}' })
    })

    it('on left associative OperatorNodes that are not associative with another Node', function () {
      ex({ i: '(a-b)-c', skeep: '(a - b) - c', sauto: 'a - b - c', lkeep: '\\left( a-\\mathrm{b}\\right)- c', lauto: ' a-\\mathrm{b}- c' })
      ex({ i: 'a-(b-c)', s: 'a - (b - c)', l: ' a-\\left(\\mathrm{b}- c\\right)' })
      ex({ i: '(a-b)+c', skeep: '(a - b) + c', sauto: 'a - b + c', lkeep: '\\left( a-\\mathrm{b}\\right)+ c', lauto: ' a-\\mathrm{b}+ c' })
      ex({ i: 'a-(b+c)', s: 'a - (b + c)', l: ' a-\\left(\\mathrm{b}+ c\\right)' })

      ex({ i: '(a/b)/c', skeep: '(a / b) / c', sauto: 'a / b / c', lkeep: '\\frac{\\left(\\frac{ a}{\\mathrm{b}}\\right)}{ c}', lauto: '\\frac{\\frac{ a}{\\mathrm{b}}}{ c}' })
      ex({ i: 'a/(b/c)', s: 'a / (b / c)', lkeep: '\\frac{ a}{\\left(\\frac{\\mathrm{b}}{ c}\\right)}', lauto: '\\frac{ a}{\\frac{\\mathrm{b}}{ c}}' })
      ex({ i: '(a/b)*c', skeep: '(a / b) * c', sauto: 'a / b * c', lkeep: '\\left(\\frac{ a}{\\mathrm{b}}\\right)\\cdot c', lauto: '\\frac{ a}{\\mathrm{b}}\\cdot c' })
      ex({ i: 'a/(b*c)', s: 'a / (b * c)', lkeep: '\\frac{ a}{\\left(\\mathrm{b}\\cdot c\\right)}', lauto: '\\frac{ a}{\\mathrm{b}\\cdot c}' })
    })

    it('on right associative OperatorNodes that are not associative with another Node', function () {
      ex({ i: '(a^b)^c', s: '(a ^ b) ^ c', l: '{\\left({ a}^{\\mathrm{b}}\\right)}^{ c}' })
      ex({ i: 'a^(b^c)', skeep: 'a ^ (b ^ c)', sauto: 'a ^ b ^ c', lkeep: '{ a}^{\\left({\\mathrm{b}}^{ c}\\right)}', lauto: '{ a}^{{\\mathrm{b}}^{ c}}' })
    })

    it('on unary OperatorNodes containing a binary OperatorNode', function () {
      ex({ i: '(a*b)!', s: '(a * b)!', l: '\\left( a\\cdot\\mathrm{b}\\right)!' })
      ex({ i: '-(a*b)', s: '-(a * b)', l: '-\\left( a\\cdot\\mathrm{b}\\right)' })
      ex({ i: '-(a+b)', s: '-(a + b)', l: '-\\left( a+\\mathrm{b}\\right)' })
    })

    it('on unary OperatorNodes containing a unary OperatorNode', function () {
      ex({ i: '(-a)!', s: '(-a)!', l: '\\left(- a\\right)!' })
      ex({ i: '-(a!)', skeep: '-(a!)', sauto: '-a!', lkeep: '-\\left( a!\\right)', lauto: '- a!' })
      ex({ i: '-(-a)', s: '-(-a)', l: '-\\left(- a\\right)' })
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

    const n2 = new OperatorNode('-', 'subtract', [one, two])

    assert.strictEqual(add23.toString({ handler: customFunction }), '+add(const(2, number), const(3, number))')
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

    assert.strictEqual(add23.toString({ handler: customFunction }), 'const(2, number)+add+const(3, number)')
  })

  it('should respect the \'all\' parenthesis option', function () {
    ex({ i: '1+1+1', s: '(1 + 1) + 1', l: '\\left(1+1\\right)+1' }, ['all'])
  })

  it('should correctly format fractions in \'all\' parenthesis mode', function () {
    ex({ i: '1/2/3', s: '(1 / 2) / 3', l: '\\frac{\\left(\\frac{1}{2}\\right)}{3}' },
      ['all'])
  })

  it('should format an OperatorNode with factorial of an OperatorNode', function () {
    const mult23 = new OperatorNode('*', 'multiply', [two, three])
    const div23 = new OperatorNode('/', 'divide', [two, three])

    const n1 = new OperatorNode('!', 'factorial', [sub23])
    const n2 = new OperatorNode('!', 'factorial', [add23])
    const n3 = new OperatorNode('!', 'factorial', [mult23])
    const n4 = new OperatorNode('!', 'factorial', [div23])
    ex({ n: n1, s: '(2 - 3)!', l: '\\left(2-3\\right)!' })
    ex({ n: n2, s: '(2 + 3)!', l: '\\left(2+3\\right)!' })
    ex({ n: n3, s: '(2 * 3)!', l: '\\left(2\\cdot3\\right)!' })
    ex({ n: n4, s: '(2 / 3)!', l: '\\frac{2}{3}!' })
  })

  it('should format an OperatorNode with unary minus', function () {
    const n2 = new OperatorNode('-', 'unaryMinus', [sub23])
    const n3 = new OperatorNode('-', 'unaryMinus', [add23])

    ex({ n: n2, s: '-(2 - 3)', l: '-\\left(2-3\\right)' })
    ex({ n: n3, s: '-(2 + 3)', l: '-\\left(2+3\\right)' })
  })

  it('should format an OperatorNode that subtracts an OperatorNode', function () {
    const n1 = new OperatorNode('-', 'subtract', [one, sub23])
    const n2 = new OperatorNode('-', 'subtract', [one, add23])

    ex({ n: n1, s: '1 - (2 - 3)', l: '1-\\left(2-3\\right)' })
    ex({ n: n2, s: '1 - (2 + 3)', l: '1-\\left(2+3\\right)' })
  })

  it('should format fractions with operators that are enclosed in parenthesis', function () {
    ex({ n: new OperatorNode('/', 'divide', [add23, four]), s: '(2 + 3) / 4', l: '\\frac{2+3}{4}' })
  })

  it('should have an identifier', function () {
    assert.strictEqual(add23.getIdentifier(), 'OperatorNode:add')
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

    assert.strictEqual(add23.toTex({ handler: customFunction }), '+add(const\\left(2, number\\right), const\\left(3, number\\right))')
    assert.strictEqual(sub23.toTex({ handler: customFunction }), '-subtract(const\\left(2, number\\right), const\\left(3, number\\right))')
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

    assert.strictEqual(add23.toTex({ handler: customFunction }), 'const\\left(2, number\\right)+add+const\\left(3, number\\right)')
  })

  it('should format powers of fractions with parentheses', function () {
    const frac = new OperatorNode('/', 'divide', [one, one])
    const pow = new OperatorNode('^', 'pow', [frac, one])

    ex({ n: pow, s: '(1 / 1) ^ 1', l: '\\left({\\frac{1}{1}}\\right)^{1}' })
  })

  it('should format powers of conditions with parentheses', function () {
    const cond = new ConditionalNode(one, one, one)
    const pow = new OperatorNode('^', 'pow', [cond, one])

    ex({ n: pow, s: '(1 ? 1 : 1) ^ 1', l: '\\left({\\begin{cases} {1}, &\\quad{\\text{if }\\;1}\\\\{1}, &\\quad{\\text{otherwise}}\\end{cases}}\\right)^{1}' })
  })

  it('should format simple expressions in \'auto\' mode', function () {
    // this covers a bug that was triggered previously
    ex({ i: '1+(1+1)', skeep: '1 + (1 + 1)', sauto: '1 + 1 + 1', lkeep: '1+\\left(1+1\\right)', lauto: '1+1+1' })
  })

  // Variant of the `ex` tester that also tests implicit hide and show
  function exhs (example, parens = ['keep', 'auto']) {
    const imps = ['hide', 'show']
    const hasi = 'i' in example
    const expr = hasi ? math.parse(example.i) : example.n
    const orig = hasi
      ? example.i
      : `${expr.getIdentifier()}${expr.args.map(arg => arg.getIdentifier())}`
    for (const paren of parens) {
      const skey = 's' in example ? 's' : 's' + paren
      const lkey = 'l' in example ? 'l' : 'l' + paren
      for (const i of [0, 1]) {
        const prefix = `${orig},${paren},${imps[i]}: ` // eases reading of failure output
        assert.strictEqual(
          prefix + expr.toString({ parenthesis: paren, implicit: imps[i] }),
          prefix + example[skey][i])
        assert.strictEqual(
          prefix + expr.toTex({ parenthesis: paren, implicit: imps[i] }),
          prefix + example[lkey][i])
      }
    }
  }

  it('should format implicit multiplications', function () {
    exhs({ i: '4a', s: ['4 a', '4 * a'], l: ['4~ a', '4\\cdot a'] })
    exhs({ i: '4 a', s: ['4 a', '4 * a'], l: ['4~ a', '4\\cdot a'] })
    exhs({ i: 'a b', s: ['a b', 'a * b'], l: [' a~\\mathrm{b}', ' a\\cdot\\mathrm{b}'] })
    exhs({ i: '2a b', s: ['2 a b', '2 * a * b'], l: ['2~ a~\\mathrm{b}', '2\\cdot a\\cdot\\mathrm{b}'] })
    exhs({ i: 'a b c', s: ['a b c', 'a * b * c'], l: [' a~\\mathrm{b}~ c', ' a\\cdot\\mathrm{b}\\cdot c'] })
    exhs({ i: '(2+3)a', s: ['(2 + 3) a', '(2 + 3) * a'], l: ['\\left(2+3\\right)~ a', '\\left(2+3\\right)\\cdot a'] })
    exhs({ i: '(2+3)2', s: ['(2 + 3) 2', '(2 + 3) * 2'], l: ['\\left(2+3\\right)~2', '\\left(2+3\\right)\\cdot2'] })
    exhs({ i: '2(3+4)', s: ['2 (3 + 4)', '2 * (3 + 4)'], l: ['2~\\left(3+4\\right)', '2\\cdot\\left(3+4\\right)'] })
    exhs({ i: 'a / b c', s: ['a / b c', 'a / (b * c)'], l: ['\\frac{ a}{\\mathrm{b}~ c}', '\\frac{ a}{\\mathrm{b}\\cdot c}'] })
    exhs({ i: 'a / b c d', s: ['a / b c d', 'a / (b * c * d)'], l: ['\\frac{ a}{\\mathrm{b}~ c~ d}', '\\frac{ a}{\\mathrm{b}\\cdot c\\cdot d}'] })
    exhs({ i: '1/2 a', s: ['1 / 2 a', '1 / 2 * a'], l: ['\\frac{1}{2}~ a', '\\frac{1}{2}\\cdot a'] })
    exhs({ i: '-2/3 a', s: ['-2 / 3 a', '-2 / 3 * a'], l: ['\\frac{-2}{3}~ a', '\\frac{-2}{3}\\cdot a'] })
    exhs({ i: '2!/3 a', s: ['2! / 3 a', '2! / (3 * a)'], l: ['\\frac{2!}{3~ a}', '\\frac{2!}{3\\cdot a}'] })
    exhs({ i: '+2!/3 a', s: ['+2! / 3 a', '+2! / (3 * a)'], l: ['\\frac{+2!}{3~ a}', '\\frac{+2!}{3\\cdot a}'] })
    exhs({ i: '2/3! a', s: ['2 / 3! a', '2 / (3! * a)'], l: ['\\frac{2}{3!~ a}', '\\frac{2}{3!\\cdot a}'] })
    exhs({ i: '-2!/+3! a', s: ['-2! / +3! a', '-2! / (+3! * a)'], l: ['\\frac{-2!}{+3!~ a}', '\\frac{-2!}{+3!\\cdot a}'] })
    exhs({ i: '2/-3 a', s: ['2 / -3 a', '2 / (-3 * a)'], l: ['\\frac{2}{-3~ a}', '\\frac{2}{-3\\cdot a}'] })
    exhs({ i: '-(2+3)/3x', s: ['-(2 + 3) / 3 x', '-(2 + 3) / (3 * x)'], l: ['\\frac{-\\left(2+3\\right)}{3~ x}', '\\frac{-\\left(2+3\\right)}{3\\cdot x}'] })
    exhs({ i: '-2/(3+4)x', s: ['-2 / (3 + 4) x', '-2 / ((3 + 4) * x)'], l: ['\\frac{-2}{\\left(3+4\\right)~ x}', '\\frac{-2}{\\left(3+4\\right)\\cdot x}'] })
    exhs({
      i: '(2)/3x',
      skeep: ['(2) / 3 x', '(2) / (3 * x)'],
      sauto: ['2 / (3 x)', '2 / (3 * x)'],
      lkeep: ['\\frac{\\left(2\\right)}{3~ x}', '\\frac{\\left(2\\right)}{3\\cdot x}'],
      lauto: ['\\frac{2}{3~ x}', '\\frac{2}{3\\cdot x}']
    })
    exhs({
      i: '2/(3)x',
      skeep: ['2 / (3) x', '2 / ((3) * x)'],
      sauto: ['2 / (3 x)', '2 / (3 * x)'],
      lkeep: ['\\frac{2}{\\left(3\\right)~ x}', '\\frac{2}{\\left(3\\right)\\cdot x}'],
      lauto: ['\\frac{2}{3~ x}', '\\frac{2}{3\\cdot x}']
    })
    exhs({
      i: '(2)/(3)x',
      skeep: ['(2) / (3) x', '(2) / ((3) * x)'],
      sauto: ['2 / (3 x)', '2 / (3 * x)'],
      lkeep: ['\\frac{\\left(2\\right)}{\\left(3\\right)~ x}', '\\frac{\\left(2\\right)}{\\left(3\\right)\\cdot x}'],
      lauto: ['\\frac{2}{3~ x}', '\\frac{2}{3\\cdot x}']
    })
    exhs({
      i: '(2!)/(3)x',
      skeep: ['(2!) / (3) x', '(2!) / ((3) * x)'],
      sauto: ['2! / 3 x', '2! / (3 * x)'],
      lkeep: ['\\frac{\\left(2!\\right)}{\\left(3\\right)~ x}', '\\frac{\\left(2!\\right)}{\\left(3\\right)\\cdot x}'],
      lauto: ['\\frac{2!}{3~ x}', '\\frac{2!}{3\\cdot x}']
    })
    exhs({
      i: '(2!)/3x',
      skeep: ['(2!) / 3 x', '(2!) / (3 * x)'],
      sauto: ['2! / 3 x', '2! / (3 * x)'],
      lkeep: ['\\frac{\\left(2!\\right)}{3~ x}', '\\frac{\\left(2!\\right)}{3\\cdot x}'],
      lauto: ['\\frac{2!}{3~ x}', '\\frac{2!}{3\\cdot x}']
    })
  })

  it('toJSON and fromJSON', function () {
    // There is no such thing as an implicit add node, really, but
    // put toJSON really through its paces
    const node = new OperatorNode('+', 'add', [one, two], true)

    const json = node.toJSON()

    assert.deepStrictEqual(json, {
      mathjs: 'OperatorNode',
      op: '+',
      fn: 'add',
      args: [one, two],
      implicit: true,
      isPercentage: false
    })

    const parsed = OperatorNode.fromJSON(json)
    assert.deepStrictEqual(parsed, node)
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

  it('should HTML an OperatorNode with custom handler for a single operator', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if ((node.type === 'OperatorNode') && (node.fn === 'add')) {
        return `${node.args[0].toHTML(options)} plus ${node.args[1].toHTML(options)}`
      } else if (node.type === 'ConstantNode') {
        return '<span class="my-number">' + node.value + '</span>'
      }
    }

    assert.strictEqual(add23.toTex({ handler: customFunction }), '<span class="my-number">2</span> plus <span class="my-number">3</span>')
  })

  it('should format implicit multiplications between ConstantNodes with parentheses', function () {
    ex({ i: '(3)x', skeep: '(3) x', sauto: '3 x', lkeep: '\\left(3\\right)~ x', lauto: '3~ x' })
    ex({
      i: '(4)(4)(4)(4)',
      skeep: '(4) (4) (4) (4)',
      sauto: '4 (4) (4) (4)',
      lkeep: '\\left(4\\right)~\\left(4\\right)~\\left(4\\right)~\\left(4\\right)',
      lauto: '4~\\left(4\\right)~\\left(4\\right)~\\left(4\\right)'
    })
    ex({ i: '4b*4(4)', s: '4 b * 4 (4)', l: '4~\\mathrm{b}\\cdot4~\\left(4\\right)' })
    ex({
      i: '(4(4(4)))',
      skeep: '(4 (4 (4)))',
      sauto: '4 (4 (4))',
      lkeep: '\\left(4~\\left(4~\\left(4\\right)\\right)\\right)',
      lauto: '4~\\left(4~\\left(4\\right)\\right)'
    })
  })

  it('should stringify implicit multiplications recoverably and to preserve their values', function () {
    const m1 = new OperatorNode('-', 'unaryMinus', [one])
    const m2 = new OperatorNode('-', 'unaryMinus', [two])
    const p1 = new OperatorNode('+', 'unaryPlus', [one])
    const p2 = new OperatorNode('+', 'unaryPlus', [two])
    const onetwo = new OperatorNode('/', 'divide', [one, two])
    const m1two = new OperatorNode('/', 'divide', [m1, two])
    const p1two = new OperatorNode('/', 'divide', [p1, two])
    const onem2 = new OperatorNode('/', 'divide', [one, m2])
    const onep2 = new OperatorNode('/', 'divide', [one, p2])
    const onePlus2 = new OperatorNode('+', 'add', [one, two])
    const onePlusm2 = new OperatorNode('+', 'add', [one, m2])
    const onePlus2over2 = new OperatorNode('/', 'divide', [
      new OperatorNode('+', 'add', [one, two]), two])
    const twoOver1plus2 = new OperatorNode('/', 'divide', [
      two, new OperatorNode('+', 'add', [one, two])])
    const avar = new SymbolNode('a')
    const ascope = { a: 2 }
    const cs = [
      onetwo, m1two, p1two, onem2, onep2,
      onePlus2, onePlusm2, onePlus2over2, twoOver1plus2]
    for (const paren of ['auto', 'keep']) {
      for (const coeff of cs) {
        let expr = new math.OperatorNode('*', 'multiply', [coeff, avar], true)
        let estring = expr.toString({ parenthesis: paren, implicit: 'hide' })
        const rexpr = math.parse(estring)
        const rstring = rexpr.toString({ parenthesis: 'all' })
        // Make sure parsing the string version gives back the same grouping as the
        // original:
        assert.strictEqual(rstring, expr.toString({ parenthesis: 'all' }))
        // And make sure that it produces the same value
        assert.strictEqual(rexpr.evaluate(ascope), expr.evaluate(ascope))
        // And make sure that's the same value you get with a constant in the expression
        expr = new math.OperatorNode('*', 'multiply', [coeff, two], true)
        estring = expr.toString({ parenthesis: paren, implicit: 'hide' })
        assert.strictEqual(math.evaluate(estring, {}), expr.evaluate(ascope))
      }
    }
  })

  it('should HTML implicit multiplications between ConstantNodes with parentheses', function () {
    const z = math.parse('(3)x')
    const a = math.parse('(4)(4)(4)(4)')
    const b = math.parse('4b*4(4)')
    const c = math.parse('(4(4(4)))')

    assert.strictEqual(z.toHTML({ implicit: 'hide', parenthesis: 'auto' }), '<span class="math-number">3</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-symbol">x</span>')
    assert.strictEqual(a.toHTML({ implicit: 'hide', parenthesis: 'auto' }), '<span class="math-number">4</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-parenthesis math-round-parenthesis">)</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-parenthesis math-round-parenthesis">)</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-parenthesis math-round-parenthesis">)</span>')
    assert.strictEqual(b.toHTML({ implicit: 'hide', parenthesis: 'auto' }), '<span class="math-number">4</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-symbol">b</span><span class="math-operator math-binary-operator math-explicit-binary-operator">*</span><span class="math-number">4</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-parenthesis math-round-parenthesis">)</span>')
    assert.strictEqual(c.toHTML({ implicit: 'hide', parenthesis: 'auto' }), '<span class="math-number">4</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-operator math-binary-operator math-implicit-binary-operator"></span><span class="math-parenthesis math-round-parenthesis">(</span><span class="math-number">4</span><span class="math-parenthesis math-round-parenthesis">)</span><span class="math-parenthesis math-round-parenthesis">)</span>')
  })
})
