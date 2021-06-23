// test simplify
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('simplify', function () {
  function simplifyAndCompare (left, right, rules, scope, opt) {
    try {
      if (Array.isArray(rules)) {
        if (opt) {
          assert.strictEqual(math.simplify(left, rules, scope, opt).toString(), math.parse(right).toString())
        } else if (scope) {
          assert.strictEqual(math.simplify(left, rules, scope).toString(), math.parse(right).toString())
        } else {
          assert.strictEqual(math.simplify(left, rules).toString(), math.parse(right).toString())
        }
      } else {
        if (scope) opt = scope
        if (rules) scope = rules
        if (opt) {
          assert.strictEqual(math.simplify(left, scope, opt).toString(), math.parse(right).toString())
        } else if (scope) {
          assert.strictEqual(math.simplify(left, scope).toString(), math.parse(right).toString())
        } else {
          assert.strictEqual(math.simplify(left).toString(), math.parse(right).toString())
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.stack)
      } else {
        console.log(new Error(err))
      }
      throw err
    }
  }

  function simplifyAndCompareEval (left, right, scope) {
    scope = scope || {}
    assert.strictEqual(math.simplify(left).evaluate(scope), math.parse(right).evaluate(scope))
  }

  it('should not change the value of the function', function () {
    simplifyAndCompareEval('3+2/4+2*8', '39/2')
    simplifyAndCompareEval('x+1+x', '2x+1', { x: 7 })
    simplifyAndCompareEval('x+1+2x', '3x+1', { x: 7 })
    simplifyAndCompareEval('x^2+x-3+x^2', '2x^2+x-3', { x: 7 })
  })

  it('should simplify exponents', function () {
    // power rule
    simplifyAndCompare('(x^2)^3', 'x^6')
    simplifyAndCompare('2*(x^2)^3', '2*x^6')

    // simplify exponent
    simplifyAndCompare('x^(2+3)', 'x^5')

    // right associative
    simplifyAndCompare('x^2^3', 'x^8')
  })

  it('should simplify rational expressions with no symbols to fraction', function () {
    simplifyAndCompare('3*4', '12')
    simplifyAndCompare('3+2/4', '7/2')
  })

  it('should simplify equations with different variables', function () {
    simplifyAndCompare('-(x+y)', '-(x + y)')
    simplifyAndCompare('-(x*y)', '-(x * y)')
    simplifyAndCompare('-(x+y+x+y)', '-(2 * (y + x))')
    simplifyAndCompare('(x-y)', 'x - y')
    simplifyAndCompare('0+(x-y)', 'x - y')
    simplifyAndCompare('-(x-y)', 'y - x')
    simplifyAndCompare('-1 * (x-y)', 'y - x')
    simplifyAndCompare('x + y + x + 2y', '3 * y + 2 * x')
  })

  it('should simplify (-1)*n', function () {
    simplifyAndCompare('(-1)*4', '-4')
    simplifyAndCompare('(-1)*x', '-x')
  })

  it('should handle function assignments', function () {
    const f = new math.FunctionAssignmentNode('sigma', ['x'], math.parse('1 / (1 + exp(-x))'))
    assert.strictEqual(f.toString(), 'sigma(x) = 1 / (1 + exp(-x))')
    assert.strictEqual(f.evaluate()(5), 0.9933071490757153)
    const fsimplified = math.simplify.simplifyCore(f)
    assert.strictEqual(fsimplified.toString(), 'sigma(x) = 1 / (1 + exp(-x))')
    assert.strictEqual(fsimplified.evaluate()(5), 0.9933071490757153)
  })

  it('simplifyCore should handle different node types', function () {
    const testSimplifyCore = function (expr, expected) {
      const actual = math.simplify.simplifyCore(math.parse(expr)).toString()
      assert.strictEqual(actual, expected)
    }
    testSimplifyCore('5*x*3', '15 * x')
    testSimplifyCore('5*x*3*x', '15 * x * x')

    testSimplifyCore('x-0', 'x')
    testSimplifyCore('0-x', '-x')
    testSimplifyCore('0-3', '-3')
    testSimplifyCore('x+0', 'x')
    testSimplifyCore('0+x', 'x')
    testSimplifyCore('0*x', '0')
    testSimplifyCore('x*0', '0')
    testSimplifyCore('x*1', 'x')
    testSimplifyCore('1*x', 'x')
    testSimplifyCore('-(x)', '-x')
    testSimplifyCore('0/x', '0')
    testSimplifyCore('(1*x + y*0)*1+0', 'x')
    testSimplifyCore('sin(x+0)*1', 'sin(x)')
    testSimplifyCore('((x+0)*1)', 'x')
    testSimplifyCore('sin((x-0)*1+y*0)', 'sin(x)')
    testSimplifyCore('((x)*(y))', '(x * y)')
    testSimplifyCore('((x)*(y))^1', '(x * y)')

    // constant folding
    testSimplifyCore('1+2', '3')
    testSimplifyCore('2*3', '6')
    testSimplifyCore('2-3', '-1')
    testSimplifyCore('3/2', '1.5')
    testSimplifyCore('3^2', '9')
  })

  it('should simplifyCore convert +unaryMinus to subtract', function () {
    simplifyAndCompareEval('--2', '2')
    const result = math.simplify('x + y + a', [math.simplify.simplifyCore], { a: -1 }).toString()
    assert.strictEqual(result, 'x + y - 1')
  })

  it('should simplify convert minus and unary minus', function () {
    // see https://github.com/josdejong/mathjs/issues/1013
    assert.strictEqual(math.simplify('0 - -1', {}).toString(), '1')
    assert.strictEqual(math.simplify('0 - -x', {}).toString(), 'x')
    assert.strictEqual(math.simplify('0----x', {}).toString(), 'x')
    assert.strictEqual(math.simplify('1 - -x', {}).toString(), 'x + 1')
    assert.strictEqual(math.simplify('0 - (-x)', {}).toString(), 'x')
    assert.strictEqual(math.simplify('-(-x)', {}).toString(), 'x')
    assert.strictEqual(math.simplify('0 - (x - y)', {}).toString(), 'y - x')
  })

  it('should handle custom functions', function () {
    function doubleIt (x) { return x + x }
    const f = new math.FunctionNode(new math.SymbolNode('doubleIt'), [new math.SymbolNode('value')])
    assert.strictEqual(f.toString(), 'doubleIt(value)')
    assert.strictEqual(f.evaluate({ doubleIt: doubleIt, value: 4 }), 8)
    const fsimplified = math.simplify.simplifyCore(f)
    assert.strictEqual(fsimplified.toString(), 'doubleIt(value)')
    assert.strictEqual(fsimplified.evaluate({ doubleIt: doubleIt, value: 4 }), 8)
  })

  it('should handle immediately invoked function assignments', function () {
    const s = new math.FunctionAssignmentNode('sigma', ['x'], math.parse('1 / (1 + exp(-x))'))
    const f = new math.FunctionNode(s, [new math.SymbolNode('x')])
    assert.strictEqual(f.toString(), '(sigma(x) = 1 / (1 + exp(-x)))(x)')
    assert.strictEqual(f.evaluate({ x: 5 }), 0.9933071490757153)
    const fsimplified = math.simplify.simplifyCore(f)
    assert.strictEqual(fsimplified.toString(), '(sigma(x) = 1 / (1 + exp(-x)))(x)')
    assert.strictEqual(fsimplified.evaluate({ x: 5 }), 0.9933071490757153)
  })

  it('should simplify (n- -n1)', function () {
    simplifyAndCompare('2 + -3', '-1')
    simplifyAndCompare('2 - 3', '-1')
    simplifyAndCompare('2 - -3', '5')
    let e = math.parse('2 - -3')
    e = math.simplify.simplifyCore(e)
    assert.strictEqual(e.toString(), '5') // simplifyCore
    simplifyAndCompare('x - -x', '2*x')
    e = math.parse('x - -x')
    e = math.simplify.simplifyCore(e)
    assert.strictEqual(e.toString(), 'x + x') // not a core simplification since + is cheaper than *
  })

  it('should preserve the value of BigNumbers', function () {
    const bigmath = math.create({ number: 'BigNumber', precision: 64 })
    assert.deepStrictEqual(bigmath.simplify('111111111111111111 + 111111111111111111').evaluate(), bigmath.evaluate('222222222222222222'))
    assert.deepStrictEqual(bigmath.simplify('1 + 111111111111111111').evaluate(), bigmath.evaluate('111111111111111112'))
    assert.deepStrictEqual(bigmath.simplify('1/2 + 11111111111111111111').evaluate(), bigmath.evaluate('11111111111111111111.5'))
    assert.deepStrictEqual(bigmath.simplify('1/3 + 11111111111111111111').evaluate(), bigmath.evaluate('11111111111111111111.33333333333333333333333333333333333333333333'))
    assert.deepStrictEqual(bigmath.simplify('3 + 1 / 11111111111111111111').evaluate(), bigmath.evaluate('3 + 1 / 11111111111111111111'))
  })

  it('should not change the value of numbers when converting to fractions (1)', function () {
    simplifyAndCompareEval('1e-10', '1e-10')
  })

  it('should not change the value of numbers when converting to fractions (2)', function () {
    simplifyAndCompareEval('0.2 * 1e-14', '2e-15')
  })

  it.skip('should not change the value of numbers when converting to fractions (3)', function () {
    // TODO this requires that all operators and functions have the correct logic in their 'Fraction' typed-functions.
    //      Ideally they should convert parameters to Fractions if they can all be expressed exactly,
    //      otherwise convert all parameters to the 'number' type.
    simplifyAndCompareEval('1 - 1e-10', '1 - 1e-10')
    simplifyAndCompareEval('1 + 1e-10', '1 + 1e-10')
    simplifyAndCompareEval('1e-10 / 2', '1e-10 / 2')
    simplifyAndCompareEval('(1e-5)^2', '(1e-5)^2')
    simplifyAndCompareEval('min(1, -1e-10)', '-1e-10')
    simplifyAndCompareEval('max(1e-10, -1)', '1e-10')
  })

  it('should simplify non-rational expressions with no symbols to number', function () {
    simplifyAndCompare('3+sin(4)', '2.2431975046920716')
  })

  it('should collect like terms', function () {
    simplifyAndCompare('x+x', '2*x')
    simplifyAndCompare('2x+x', '3*x')
    simplifyAndCompare('2(x+1)+(x+1)', '3*(x + 1)')
    simplifyAndCompare('y*x^2+2*x^2', '(y+2)*x^2')
  })

  it('should collect separated like terms', function () {
    simplifyAndCompare('x+1+x', '2*x+1')
    simplifyAndCompare('x^2+x+3+x^2', '2*x^2+x+3')
    simplifyAndCompare('x+1+2x', '3*x+1')
    simplifyAndCompare('x-1+x', '2*x-1')
    simplifyAndCompare('x-1-2x+2', '1-x')
  })

  it('should collect like terms that are embedded in other terms', function () {
    simplifyAndCompare('10 - (x - 2)', '12 - x')
    simplifyAndCompare('x - (y + x)', '-y')
    simplifyAndCompare('x - (y - (y - x))', '0')
  })

  it('should collect separated like factors', function () {
    simplifyAndCompare('x*y*-x/(x^2)', '-y')
    simplifyAndCompare('x/2*x', 'x^2/2')
    simplifyAndCompare('x*2*x', '2*x^2')
  })

  it('should handle nested exponentiation', function () {
    simplifyAndCompare('(x^2)^3', 'x^6')
    simplifyAndCompare('(x^y)^z', 'x^(y*z)')
    simplifyAndCompare('8 * x ^ 9 + 2 * (x ^ 3) ^ 3', '10 * x ^ 9')
  })

  it('should not run into an infinite recursive loop', function () {
    simplifyAndCompare('2n - 1', '2 n - 1')
    simplifyAndCompare('16n - 1', '16 n - 1')
    simplifyAndCompare('16n / 1', '16 * n')
    simplifyAndCompare('8 / 5n', 'n * 8 / 5')
    simplifyAndCompare('8n - 4n', '4 * n')
    simplifyAndCompare('8 - 4n', '8 - 4 * n')
    simplifyAndCompare('8 - n', '8 - n')
  })

  it('should handle non-existing functions like a pro', function () {
    simplifyAndCompare('foo(x)', 'foo(x)')
    simplifyAndCompare('foo(1)', 'foo(1)')
    simplifyAndCompare('myMultiArg(x, y, z, w)', 'myMultiArg(x, y, z, w)')
  })

  it('should simplify a/(b/c)', function () {
    simplifyAndCompare('x/(x/y)', 'y')
    simplifyAndCompare('x/(y/z)', 'x * z/y')
    simplifyAndCompare('(x + 1)/((x + 1)/(z + 3))', 'z + 3')
    simplifyAndCompare('(x + 1)/((y + 2)/(z + 3))', '(x + 1) * (z + 3)/(y + 2)')
  })

  it('should support custom rules', function () {
    const node = math.simplify('y+x', [{ l: 'n1-n2', r: '-n2+n1' }], { x: 5 })
    assert.strictEqual(node.toString(), 'y + 5')
  })

  it('should handle valid built-in constant symbols in rules', function () {
    assert.strictEqual(math.simplify('true', ['true -> 1']).toString(), '1')
    assert.strictEqual(math.simplify('false', ['false -> 0']).toString(), '0')
    assert.strictEqual(math.simplify('log(e)', ['log(e) -> 1']).toString(), '1')
    assert.strictEqual(math.simplify('sin(pi * x)', ['sin(pi * n) -> 0']).toString(), '0')
    assert.strictEqual(math.simplify('i', ['i -> 1']).toString(), '1')
    assert.strictEqual(math.simplify('Infinity', ['Infinity -> 1']).toString(), '1')
    assert.strictEqual(math.simplify('LN2', ['LN2 -> 1']).toString(), '1')
    assert.strictEqual(math.simplify('LN10', ['LN10 -> 1']).toString(), '1')
    assert.strictEqual(math.simplify('LOG2E', ['LOG2E -> 1']).toString(), '1')
    assert.strictEqual(math.simplify('LOG10E', ['LOG10E -> 1']).toString(), '1')
    assert.strictEqual(math.simplify('null', ['null -> 1']).toString(), '1')
    assert.strictEqual(math.simplify('phi', ['phi -> 1']).toString(), '1')
    assert.strictEqual(math.simplify('SQRT1_2', ['SQRT1_2 -> 1']).toString(), '1')
    assert.strictEqual(math.simplify('SQRT2', ['SQRT2 -> 1']).toString(), '1')
    assert.strictEqual(math.simplify('tau', ['tau -> 1']).toString(), '1')

    // note that NaN is a special case, we can't compare two values both NaN.
  })

  it('should remove addition of 0', function () {
    simplifyAndCompare('x+0', 'x')
    simplifyAndCompare('x-0', 'x')
  })

  it('options parameters', function () {
    simplifyAndCompare('0.1*x', 'x/10')
    simplifyAndCompare('0.1*x', 'x/10', math.simplify.rules, {}, { exactFractions: true })
    simplifyAndCompare('0.1*x', '0.1*x', math.simplify.rules, {}, { exactFractions: false })
    simplifyAndCompare('y+0.1*x', 'x/10+1', { y: 1 })
    simplifyAndCompare('y+0.1*x', 'x/10+1', { y: 1 }, { exactFractions: true })
    simplifyAndCompare('y+0.1*x', '0.1*x+1', { y: 1 }, { exactFractions: false })

    simplifyAndCompare('0.00125', '1 / 800', math.simplify.rules, {}, { exactFractions: true })
    simplifyAndCompare('0.00125', '0.00125', math.simplify.rules, {}, { exactFractions: true, fractionsLimit: 100 })
    simplifyAndCompare('0.4', '2 / 5', math.simplify.rules, {}, { exactFractions: true, fractionsLimit: 100 })
    simplifyAndCompare('100.8', '504 / 5', math.simplify.rules, {}, { exactFractions: true })
    simplifyAndCompare('100.8', '100.8', math.simplify.rules, {}, { exactFractions: true, fractionsLimit: 100 })
  })

  it('resolve() should substitute scoped constants', function () {
    assert.strictEqual(
      math.simplify.resolve(math.parse('x+y'), { x: 1 }).toString(),
      '1 + y'
    ) // direct
    simplifyAndCompare('x+y', 'x+y', {}) // operator
    simplifyAndCompare('x+y', 'y+1', { x: 1 })
    simplifyAndCompare('x+y', 'y+1', { x: math.parse('1') })
    simplifyAndCompare('x+y', '3', { x: 1, y: 2 })
    simplifyAndCompare('x+x+x', '3*x')
    simplifyAndCompare('y', 'x+1', { y: math.parse('1+x') })
    simplifyAndCompare('y', '3', { x: 2, y: math.parse('1+x') })
    simplifyAndCompare('x+y', '3*x', { y: math.parse('x+x') })
    simplifyAndCompare('x+y', '6', { x: 2, y: math.parse('x+x') })
    simplifyAndCompare('x+(y+2-1-1)', '6', { x: 2, y: math.parse('x+x') }) // parentheses
    simplifyAndCompare('log(x+y)', String(Math.log(6)), { x: 2, y: math.parse('x+x') }) // function
    simplifyAndCompare('combinations( ceil(abs(sin(x)) * y), abs(x) )',
      'combinations(ceil(0.9092974268256817 * y ), 2)', { x: -2 })

    // TODO(deal with accessor nodes) simplifyAndCompare('size(text)[1]', '11', {text: "hello world"})
  })

  it('resolve() should substitute scoped constants from Map like scopes', function () {
    assert.strictEqual(
      math.simplify.resolve(math.parse('x+y'), new Map([['x', 1]])).toString(),
      '1 + y'
    ) // direct
    simplifyAndCompare('x+y', 'x+y', new Map()) // operator
    simplifyAndCompare('x+y', 'y+1', new Map([['x', 1]]))
    simplifyAndCompare('x+y', 'y+1', new Map([['x', math.parse('1')]]))
  })

  it('should keep implicit multiplication implicit', function () {
    const f = math.parse('2x')
    assert.strictEqual(f.toString({ implicit: 'hide' }), '2 x')
    const simplified = math.simplify(f)
    assert.strictEqual(simplified.toString({ implicit: 'hide' }), '2 x')
  })

  describe('expression parser', function () {
    it('should evaluate simplify containing string value', function () {
      const res = math.evaluate('simplify("2x + 3x")')
      assert.ok(res && res.isNode)
      assert.strictEqual(res.toString(), '5 * x')
    })

    it('should evaluate simplify containing nodes', function () {
      const res = math.evaluate('simplify(parse("2x + 3x"))')
      assert.ok(res && res.isNode)
      assert.strictEqual(res.toString(), '5 * x')
    })

    it('should compute and simplify derivatives', function () {
      const res = math.evaluate('derivative("5x*3x", "x")')
      assert.ok(res && res.isNode)
      assert.strictEqual(res.toString(), '30 * x')
    })

    it('should compute and simplify derivatives (2)', function () {
      const scope = {}
      math.evaluate('a = derivative("5x*3x", "x")', scope)
      const res = math.evaluate('simplify(a)', scope)
      assert.ok(res && res.isNode)
      assert.strictEqual(res.toString(), '30 * x')
    })

    it.skip('should compute and simplify derivatives (3)', function () {
      // TODO: this requires the + operator to support Nodes,
      //       i.e.   math.add(5, math.parse('2')) => return an OperatorNode
      const res = math.evaluate('simplify(5+derivative(5/(3x), x))')
      assert.ok(res && res.isNode)
      assert.strictEqual(res.toString(), '5 - 15 / (3 * x) ^ 2')
    })
  })

  it('should respect log arguments', function () {
    simplifyAndCompareEval('log(e)', '1')
    simplifyAndCompareEval('log(e,e)', '1')
    simplifyAndCompareEval('log(3,5)', 'log(3,5)')
    simplifyAndCompareEval('log(e,9)', 'log(e,9)')
  })
})
