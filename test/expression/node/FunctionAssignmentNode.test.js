// test FunctionAssignmentNode
const assert = require('assert')
const math = require('../../../src/main').create()
const Node = math.expression.node.Node
const ConstantNode = math.expression.node.ConstantNode
const SymbolNode = math.expression.node.SymbolNode
const AssignmentNode = math.expression.node.AssignmentNode
const ConditionalNode = math.expression.node.ConditionalNode
const OperatorNode = math.expression.node.OperatorNode
const FunctionNode = math.expression.node.FunctionNode
const FunctionAssignmentNode = math.expression.node.FunctionAssignmentNode
const RangeNode = math.expression.node.RangeNode

describe('FunctionAssignmentNode', function () {
  it('should create a FunctionAssignmentNode', function () {
    const n = new FunctionAssignmentNode('f', ['x'], new ConstantNode(2))
    assert(n instanceof FunctionAssignmentNode)
    assert(n instanceof Node)
    assert.equal(n.type, 'FunctionAssignmentNode')
  })

  it('should have isFunctionAssignmentNode', function () {
    const node = new FunctionAssignmentNode('f', ['x'], new ConstantNode(2))
    assert(node.isFunctionAssignmentNode)
  })

  it('should throw an error when calling without new operator', function () {
    assert.throws(function () { FunctionAssignmentNode('f', ['x'], new ConstantNode(2)) }, SyntaxError)
  })

  it('should throw an error on wrong constructor arguments', function () {
    assert.throws(function () { console.log(new FunctionAssignmentNode()) }, TypeError)
    assert.throws(function () { console.log(new FunctionAssignmentNode('a')) }, TypeError)
    assert.throws(function () { console.log(new FunctionAssignmentNode('a', ['x'])) }, TypeError)
    assert.throws(function () { console.log(new FunctionAssignmentNode(null, ['x'], new ConstantNode(2))) }, TypeError)
  })

  it('should compile a FunctionAssignmentNode', function () {
    const a = new ConstantNode(2)
    const x = new SymbolNode('x')
    const o = new OperatorNode('+', 'add', [a, x])
    const n = new FunctionAssignmentNode('f', ['x'], o)

    const expr = n.compile()
    let scope = {}
    expr.eval(scope)
    assert.equal(typeof scope.f, 'function')
    assert.equal(scope.f(3), 5)
    assert.equal(scope.f(5), 7)
  })

  it('should compile a typed FunctionAssignmentNode', function () {
    const a = new ConstantNode(2)
    const x = new SymbolNode('x')
    const o = new OperatorNode('+', 'add', [a, x])
    const n = new FunctionAssignmentNode('f', [{name: 'x', type: 'number'}], o)

    const expr = n.compile()
    let scope = {}
    expr.eval(scope)
    assert.equal(typeof scope.f, 'function')
    assert.equal(scope.f(3), 5)
    assert.equal(scope.f(5), 7)
    assert.throws(function () { scope.f(new Date()) }, /Unexpected type of argument in function f/)
    assert.throws(function () { scope.f(2, 2) }, /Too many arguments in function f/)
    assert.throws(function () { scope.f() }, /Too few arguments in function f/)
  })

  it('should eval a recursive FunctionAssignmentNode', function () {
    const x = new SymbolNode('x')
    const one = new ConstantNode(1)
    const condition = new OperatorNode('<=', 'smallerEq', [x, one])
    const truePart = one
    const falsePart = new OperatorNode('*', 'multiply', [
      x,
      new FunctionNode(new SymbolNode('factorial'), [
        new OperatorNode('-', 'subtract', [
          x,
          one
        ])
      ])
    ])
    const n1 = new ConditionalNode(condition, truePart, falsePart)

    const n2 = new FunctionAssignmentNode('factorial', ['x'], n1)

    const expr = n2.compile()
    let scope = {}
    const factorial = expr.eval(scope)
    assert.equal(typeof scope.factorial, 'function')
    assert.equal(factorial(3), 6)
    assert.equal(factorial(5), 120)
  })

  it('should eval a recursive FunctionAssignmentNode with two recursive calls', function () {
    const x = new SymbolNode('x')
    const zero = new ConstantNode(0)
    const one = new ConstantNode(1)
    const two = new ConstantNode(2)

    const n1 = new ConditionalNode(
      new OperatorNode('<=', 'smallerEq', [x, zero]),
      zero,
      new ConditionalNode(
        new OperatorNode('<=', 'smallerEq', [x, two]),
        one,
        new OperatorNode('+', 'add', [
          new FunctionNode(new SymbolNode('fib'), [
            new OperatorNode('-', 'subtract', [ x, one ])
          ]),
          new FunctionNode(new SymbolNode('fib'), [
            new OperatorNode('-', 'subtract', [ x, two ])
          ])
        ])
      )
    )

    const n2 = new FunctionAssignmentNode('fib', ['x'], n1)
    // const n2 = math.parse('fib(x) = (x <= 0) ? 0 : ((x <= 2) ? 1 : (fib(x - 1) + f(fib - 2)))');

    const expr = n2.compile()
    let scope = {}
    const fib = expr.eval(scope)

    assert.equal(typeof fib, 'function')
    assert.equal(fib(0), 0)
    assert.equal(fib(1), 1)
    assert.equal(fib(2), 1)
    assert.equal(fib(3), 2)
    assert.equal(fib(4), 3)
    assert.equal(fib(5), 5)
    assert.equal(fib(6), 8)
    assert.equal(fib(7), 13)
    assert.equal(fib(8), 21)
  })

  it('should pass function arguments in scope to functions with rawArgs', function () {
    const outputScope = function (args, math, scope) {
      return scope
    }
    outputScope.rawArgs = true
    math.import({ outputScope: outputScope }, { override: true })

    // f(x) = outputScope(x)
    const x = new SymbolNode('x')
    const o = new FunctionNode('outputScope', [x])
    const n = new FunctionAssignmentNode('f', ['x'], o)

    let scope = {a: 2}
    const f = n.eval(scope)
    assert.deepEqual(f(3), {a: 2, f: f, x: 3})
  })

  it('should pass function arguments in scope to functions with rawArgs returned by another function', function () {
    const outputScope = function (args, math, scope) {
      return scope
    }

    outputScope.rawArgs = true
    const returnOutputScope = function () {
      return outputScope
    }

    math.import({
      outputScope: outputScope,
      returnOutputScope: returnOutputScope
    }, { override: true })

    // f(x, y) = returnOutputScope(x)(y)
    const a = new FunctionNode('returnOutputScope', [new SymbolNode('x')])
    const b = new FunctionNode(a, [new SymbolNode('y')])
    const n = new FunctionAssignmentNode('f', ['x', 'y'], b)

    let scope = {a: 2}
    const f = n.eval(scope)
    assert.deepEqual(f(3, 4), {a: 2, f, x: 3, y: 4})
  })

  it('should pass function arguments in scope to functions with rawArgs and transform', function () {
    const outputScope = function (x) {
      return 'should not occur'
    }
    outputScope.transform = function (args, math, scope) {
      return scope
    }
    outputScope.transform.rawArgs = true
    math.import({ outputScope: outputScope }, { override: true })

    // f(x) = outputScope(x)
    const x = new SymbolNode('x')
    const o = new FunctionNode('outputScope', [x])
    const n = new FunctionAssignmentNode('f', ['x'], o)

    let scope = {a: 2}
    const f = n.eval(scope)
    assert.deepEqual(f(3), {a: 2, f, x: 3})
  })

  it('should pass function arguments via scope to rawArgs function', function () {
    const math2 = math.create()
    const f = function (args, _math, _scope) {
      return args[0].compile().eval(_scope)
    }
    f.rawArgs = true

    math2.import({f})

    const g = math2.eval('g(arr) = f(arr)')
    assert.deepEqual(g([1, 2, 3]), [1, 2, 3])
  })

  it('should filter a FunctionAssignmentNode', function () {
    const a = new ConstantNode(2)
    const x = new SymbolNode('x')
    const o = new OperatorNode('+', 'add', [a, x])
    const n = new FunctionAssignmentNode('f', ['x'], o)

    assert.deepEqual(n.filter(function (node) { return node instanceof FunctionAssignmentNode }), [n])
    assert.deepEqual(n.filter(function (node) { return node instanceof SymbolNode }), [x])
    assert.deepEqual(n.filter(function (node) { return node instanceof RangeNode }), [])
    assert.deepEqual(n.filter(function (node) { return node instanceof ConstantNode }), [a])
    assert.deepEqual(n.filter(function (node) { return node instanceof ConstantNode && node.value === 2 }), [a])
    assert.deepEqual(n.filter(function (node) { return node instanceof ConstantNode && node.value === 4 }), [])
  })

  it('should throw an error when creating a FunctionAssignmentNode with a reserved keyword', function () {
    assert.throws(function () {
      console.log(new FunctionAssignmentNode('end', ['x'], new ConstantNode(2)))
    }, /Illegal function name/)
  })

  it('should filter a FunctionAssignmentNode without expression', function () {
    const e = new FunctionAssignmentNode('f', ['x'], new ConstantNode(2))

    assert.deepEqual(e.filter(function (node) { return node instanceof FunctionAssignmentNode }), [e])
    assert.deepEqual(e.filter(function (node) { return node instanceof SymbolNode }), [])
  })

  it('should run forEach on a FunctionAssignmentNode', function () {
    const a = new ConstantNode(2)
    const n = new FunctionAssignmentNode('f', ['x'], a)

    const nodes = []
    const paths = []
    n.forEach(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, n)
    })

    assert.equal(nodes.length, 1)
    assert.strictEqual(nodes[0], a)
    assert.deepEqual(paths, ['expr'])
  })

  it('should map a FunctionAssignmentNode', function () {
    const a = new ConstantNode(2)
    const n = new FunctionAssignmentNode('f', ['x'], a)

    const nodes = []
    const paths = []
    const e = new ConstantNode(3)
    const f = n.map(function (node, path, parent) {
      nodes.push(node)
      paths.push(path)
      assert.strictEqual(parent, n)

      return node instanceof SymbolNode && node.name === 'x' ? e : node
    })

    assert.equal(nodes.length, 1)
    assert.strictEqual(nodes[0], a)
    assert.deepEqual(paths, ['expr'])

    assert.notStrictEqual(f, n)
    assert.deepEqual(f.expr, a)
  })

  it('should throw an error when the map callback does not return a node', function () {
    const a = new ConstantNode(2)
    const n = new FunctionAssignmentNode('f', ['x'], a)

    assert.throws(function () {
      n.map(function () {})
    }, /Callback function must return a Node/)
  })

  it('should transform a FunctionAssignmentNodes (nested) parameters', function () {
    // f(x) = 2 + x
    const a = new ConstantNode(2)
    const x = new SymbolNode('x')
    const c = new OperatorNode('+', 'add', [a, x])
    const n = new FunctionAssignmentNode('f', ['x'], c)

    const e = new ConstantNode(3)
    const f = n.transform(function (node) {
      return node instanceof SymbolNode && node.name === 'x' ? e : node
    })

    assert.notStrictEqual(f, n)
    assert.deepEqual(f.expr.args[0], a)
    assert.deepEqual(f.expr.args[1], e)
  })

  it('should transform a FunctionAssignmentNode itself', function () {
    // f(x) = 2 + x
    const a = new ConstantNode(2)
    const x = new SymbolNode('x')
    const c = new OperatorNode('+', 'add', [a, x])
    const n = new FunctionAssignmentNode('f', ['x'], c)

    const e = new ConstantNode(5)
    const f = n.transform(function (node) {
      return node instanceof FunctionAssignmentNode ? e : node
    })

    assert.notStrictEqual(f, n)
    assert.deepEqual(f, e)
  })

  it('should clone a FunctionAssignmentNode', function () {
    // f(x) = 2 + x
    const a = new ConstantNode(2)
    const x = new SymbolNode('x')
    const c = new OperatorNode('+', 'add', [a, x])
    const d = new FunctionAssignmentNode('f', ['x'], c)

    const e = d.clone()
    assert(e instanceof FunctionAssignmentNode)
    assert.deepEqual(e, d)
    assert.notStrictEqual(e, d)
    assert.strictEqual(e.expr, d.expr)
  })

  it('test equality another Node', function () {
    const a = new FunctionAssignmentNode('f', ['x'],
      new OperatorNode('+', 'add', [new ConstantNode(2), new SymbolNode('x')]))
    const b = new FunctionAssignmentNode('f', ['x'],
      new OperatorNode('+', 'add', [new ConstantNode(2), new SymbolNode('x')]))
    const c = new FunctionAssignmentNode('g', ['x'],
      new OperatorNode('+', 'add', [new ConstantNode(2), new SymbolNode('x')]))
    const d = new FunctionAssignmentNode('f', ['y'],
      new OperatorNode('+', 'add', [new ConstantNode(2), new SymbolNode('x')]))
    const e = new FunctionAssignmentNode('f', ['x'],
      new OperatorNode('+', 'add', [new ConstantNode(3), new SymbolNode('x')]))
    const f = new SymbolNode('add')

    assert.strictEqual(a.equals(null), false)
    assert.strictEqual(a.equals(undefined), false)
    assert.strictEqual(a.equals(b), true)
    assert.strictEqual(a.equals(c), false)
    assert.strictEqual(a.equals(d), false)
    assert.strictEqual(a.equals(e), false)
    assert.strictEqual(a.equals(f), false)
  })

  it('should respect the \'all\' parenthesis option', function () {
    const expr = math.parse('f(x)=x+1')
    assert.equal(expr.toString({parenthesis: 'all'}), 'f(x) = (x + 1)')
    assert.equal(expr.toTex({parenthesis: 'all'}), '\\mathrm{f}\\left(x\\right):=\\left( x+1\\right)')
  })

  it('should stringify a FunctionAssignmentNode', function () {
    const a = new ConstantNode(2)
    const x = new SymbolNode('x')
    const o = new OperatorNode('+', 'add', [a, x])
    const n = new FunctionAssignmentNode('f', ['x'], o)

    assert.equal(n.toString(), 'f(x) = 2 + x')
  })

  it('should stringify a FunctionAssignmentNode containing an AssignmentNode', function () {
    const a = new ConstantNode(2)

    const n1 = new AssignmentNode(new SymbolNode('a'), a)
    const n = new FunctionAssignmentNode('f', ['x'], n1)

    assert.equal(n.toString(), 'f(x) = (a = 2)')
  })

  it('should stringify a FunctionAssignmentNode with custom toString', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'FunctionAssignmentNode') {
        let string = '[' + node.name + ']('
        node.params.forEach(function (param) {
          string += param + ', '
        })

        string += ')=' + node.expr.toString(options)
        return string
      } else if (node.type === 'ConstantNode') {
        return 'const(' + node.value + ', ' + math.typeof(node.value) + ')'
      }
    }

    const a = new ConstantNode(1)

    const n = new FunctionAssignmentNode('func', ['x'], a)

    assert.equal(n.toString({handler: customFunction}), '[func](x, )=const(1, number)')
  })

  it('toJSON and fromJSON', function () {
    const expr = new SymbolNode('add')
    const node = new FunctionAssignmentNode('f', [
      {name: 'x', type: 'number'},
      'y'
    ], expr)

    const json = node.toJSON()

    assert.deepEqual(json, {
      mathjs: 'FunctionAssignmentNode',
      name: 'f',
      params: [
        {name: 'x', type: 'number'},
        {name: 'y', type: 'any'}
      ],
      expr: expr
    })

    const parsed = FunctionAssignmentNode.fromJSON(json)
    assert.deepEqual(parsed, node)
  })

  it('should LaTeX a FunctionAssignmentNode', function () {
    const a = new ConstantNode(2)
    const x = new SymbolNode('x')
    const o = new OperatorNode('/', 'divide', [x, a])
    const p = new OperatorNode('^', 'pow', [o, a])
    const n = new FunctionAssignmentNode('f', ['x'], p)

    assert.equal(n.toTex(), '\\mathrm{f}\\left(x\\right):=\\left({\\frac{ x}{2}}\\right)^{2}')
  })

  it('should LaTeX a FunctionAssignmentNode containing an AssignmentNode', function () {
    const a = new ConstantNode(2)

    const n1 = new AssignmentNode(new SymbolNode('a'), a)
    const n = new FunctionAssignmentNode('f', ['x'], n1)

    assert.equal(n.toTex(), '\\mathrm{f}\\left(x\\right):=\\left( a:=2\\right)')
  })

  it('should LaTeX a FunctionAssignmentNode with custom toTex', function () {
    // Also checks if the custom functions get passed on to the children
    const customFunction = function (node, options) {
      if (node.type === 'FunctionAssignmentNode') {
        let latex = '\\mbox{' + node.name + '}\\left('
        node.params.forEach(function (param) {
          latex += param + ', '
        })

        latex += '\\right)=' + node.expr.toTex(options)
        return latex
      } else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + math.typeof(node.value) + '\\right)'
      }
    }

    const a = new ConstantNode(1)

    const n = new FunctionAssignmentNode('func', ['x'], a)

    assert.equal(n.toTex({handler: customFunction}), '\\mbox{func}\\left(x, \\right)=const\\left(1, number\\right)')
  })
})
