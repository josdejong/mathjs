// test simplify
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

const expLibrary = []
// eslint-disable-next-line mocha/no-exports
export function simplifyAndCompare (left, right, rules, scope, opt, stringOpt) {
  expLibrary.push(left)
  let simpLeft
  try {
    if (Array.isArray(rules)) {
      if (opt) {
        simpLeft = math.simplify(left, rules, scope, opt)
      } else if (scope) {
        simpLeft = math.simplify(left, rules, scope)
      } else {
        simpLeft = math.simplify(left, rules)
      }
    } else {
      if (opt) stringOpt = opt
      if (scope) opt = scope
      if (rules) scope = rules
      if (opt) {
        simpLeft = math.simplify(left, scope, opt)
      } else if (scope) {
        simpLeft = math.simplify(left, scope)
      } else {
        simpLeft = math.simplify(left)
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
  assert.strictEqual(
    simpLeft.toString(stringOpt), math.parse(right).toString(stringOpt))
}

describe('simplify', function () {
  function simplifyAndCompareEval (left, right, scope) {
    expLibrary.push(left)
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

  it('handles string constants', function () {
    simplifyAndCompare('"a"', '"a"')
    simplifyAndCompare('foo("0xffff")', 'foo("0xffff")')
    simplifyAndCompare('"1234"', '"1234"')
    simplifyAndCompare('concat("a","b")', '"ab"')
    simplifyAndCompare('size(concat("A","4/2"))', '[4]')
    simplifyAndCompare('string(4/2)', '"2"')
    simplifyAndCompare('2+number("2")', '4')
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
    const fsimplified = math.simplifyCore(f)
    assert.strictEqual(fsimplified.toString(), 'sigma(x) = 1 / (1 + exp(-x))')
    assert.strictEqual(fsimplified.evaluate()(5), 0.9933071490757153)
  })

  it('should simplify convert minus and unary minus', function () {
    simplifyAndCompareEval('--2', '2')
    // see https://github.com/josdejong/mathjs/issues/1013
    assert.strictEqual(math.simplify('0 - -1', {}).toString(), '1')
    assert.strictEqual(math.simplify('0 - -x', {}).toString(), 'x')
    assert.strictEqual(math.simplify('0----x', {}).toString(), 'x')
    assert.strictEqual(math.simplify('1 - -x', {}).toString(), 'x + 1')
    assert.strictEqual(math.simplify('0 - (-x)', {}).toString(), 'x')
    assert.strictEqual(math.simplify('-(-x)', {}).toString(), 'x')
    assert.strictEqual(math.simplify('0 - (x - y)', {}).toString(), 'y - x')
  })

  it('should simplify inside arrays and indexing', function () {
    simplifyAndCompare('[3x+0]', '[3x]')
    simplifyAndCompare('[3x+5x]', '[8*x]')
    simplifyAndCompare('[2*3,6+2]', '[6,8]')
    simplifyAndCompare('[x^0,y*0,z*1,w-0][2+n*1]', '[1,0,z,w][n+2]')
    simplifyAndCompare('[x,y-2y,z,w+w][(3-2)*n+2]', '[x,-y,z,2*w][n+2]')
  })

  it('should simplify inside objects', function () {
    simplifyAndCompare('{a:(x^2+x*x), b:2+6, c:n+0}', '{a:2*x^2, b:8, c:n}')
  })

  it('should index an array or object with a constant', function () {
    simplifyAndCompare('[x,y,z][2]', 'y')
    simplifyAndCompare('5+[6*2,3-3][2-1]', '17')
    simplifyAndCompare('[1,2,1,2;3,4,3,4][2,y+2]', '[3,4,3,4][y+2]')
    simplifyAndCompare('[1,2;3,4;5,6;7,8][y+2,2]', '[2,4,6,8][y+2]')
    simplifyAndCompare('{a:3,b:2}.b', '2')
    simplifyAndCompare('{a:3,b:2}.c', 'undefined')
  })

  it('should compute with literal constant matrices', function () {
    simplifyAndCompare('[1,2]+[3,4]', '[4,6]')
    simplifyAndCompare('[0,1;2,3]*[3,2;1,0]', '[1,0;9,4]')
    simplifyAndCompare('3*[0,1,2;3,4,5]', '[0,3,6;9,12,15]')
    simplifyAndCompare('zeros(2,1)', '[0;0]')
    simplifyAndCompare('ones(3)', '[1,1,1]')
    simplifyAndCompare('identity(2)', '[1,0;0,1]')
    simplifyAndCompare('sqrt([1,4,9])', '[1,2,3]')
    simplifyAndCompare('det([2,1;-1,3])', '7')
    simplifyAndCompare("[1,2;3,4]'", '[1,3;2,4]')
  })

  it('should recognize array size does not depend on entries', function () {
    simplifyAndCompare('size([x,y;z,w])', '[2,2]')
  })

  it('should handle custom functions', function () {
    function doubleIt (x) { return x + x }
    const f = new math.FunctionNode(new math.SymbolNode('doubleIt'), [new math.SymbolNode('value')])
    assert.strictEqual(f.toString(), 'doubleIt(value)')
    assert.strictEqual(f.evaluate({ doubleIt, value: 4 }), 8)
    const fsimplified = math.simplifyCore(f)
    assert.strictEqual(fsimplified.toString(), 'doubleIt(value)')
    assert.strictEqual(fsimplified.evaluate({ doubleIt, value: 4 }), 8)
  })

  it('should handle immediately invoked function assignments', function () {
    const s = new math.FunctionAssignmentNode('sigma', ['x'], math.parse('1 / (1 + exp(-x))'))
    const f = new math.FunctionNode(s, [new math.SymbolNode('x')])
    assert.strictEqual(f.toString(), '(sigma(x) = 1 / (1 + exp(-x)))(x)')
    assert.strictEqual(f.evaluate({ x: 5 }), 0.9933071490757153)
    const fsimplified = math.simplifyCore(f)
    assert.strictEqual(fsimplified.toString(), '(sigma(x) = 1 / (1 + exp(-x)))(x)')
    assert.strictEqual(fsimplified.evaluate({ x: 5 }), 0.9933071490757153)
  })

  it('should simplify (n- -n1)', function () {
    simplifyAndCompare('2 + -3', '-1')
    simplifyAndCompare('2 - 3', '-1')
    simplifyAndCompare('2 - -3', '5')
    let e = math.parse('2 - -3')
    e = math.simplifyCore(e)
    assert.strictEqual(e.toString(), '5') // simplifyCore
    simplifyAndCompare('x - -x', '2*x')
    e = math.parse('x - -x')
    e = math.simplifyCore(e)
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

  it('should not change the value of numbers when converting to fractions (3)', function () {
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
    simplifyAndCompare('2(x+1)+x+1', '3*(x + 1)')
    simplifyAndCompare('y*x^2+2*x^2', 'x^2*(y+2)')
    simplifyAndCompare('x*y + y*x', '2*x*y')
    simplifyAndCompare('x*y - y*x', '0')
    simplifyAndCompare('x^2*y^3*z - y*z*y*x^2*y', '0')
    simplifyAndCompare('x^2*y^3*z - y*z*x^2*y', 'x^2*z*(y^3-y^2)')
  })

  it('can simplify with functions as well as operators', () => {
    simplifyAndCompare('add(x,x)', '2*x')
    simplifyAndCompare('multiply(x,2)+x', '3*x')
    simplifyAndCompare('add(2*add(x,1), x+1)', '3*(x + 1)')
    simplifyAndCompare('multiply(2, x+1) + add(x,1)', '3*(x + 1)')
    simplifyAndCompare('add(y*pow(x,2), multiply(2,x^2))', 'x^2*(y+2)')
    simplifyAndCompare('add(x*y, multiply(y,x))', '2*x*y')
    simplifyAndCompare('subtract(multiply(x,y), multiply(y,x))', '0')
    simplifyAndCompare('pow(x,2)*multiply(y^3, z) - multiply(y,z,y,x^2,y)', '0')
    simplifyAndCompare('subtract(multiply(x^2, pow(y,3))*z, y*multiply(z,x^2)*y)',
      'x^2*z*(y^3-y^2)')
  })

  it('should collect separated like terms', function () {
    simplifyAndCompare('x+1+x', '2*x+1')
    simplifyAndCompare('x^2+x+3+x^2', '2*x^2+x+3')
    simplifyAndCompare('x+1+2x', '3*x+1')
    simplifyAndCompare('x-1+x', '2*x-1')
    simplifyAndCompare('2-(x+1)', '1-x') // #2393
    simplifyAndCompare('x-1-2x+2', '1-x')
  })

  it('should collect like terms that are embedded in other terms', function () {
    simplifyAndCompare('10 - (x - 2)', '12 - x')
    simplifyAndCompare('x - (y + x)', '-y')
    simplifyAndCompare('x - (y - y + x)', '0')
    simplifyAndCompare('x - (y - (y - x))', '0')
    simplifyAndCompare('5 + (5 * x) - (3 * x) + 2', '2*x+7')
    simplifyAndCompare('x^2*y^2 - (x*y)^2', '0')
    simplifyAndCompare('(x*z^2 + y*z)/z^4', '(y + z*x)/z^3') // #1423
    simplifyAndCompare('(x^2*y + z*y)/y^4', '(x^2 + z)/y^3')
    simplifyAndCompare('6x/3x', '2') // Additional cases from PR review
    simplifyAndCompare('-28y/-4y', '7')
    simplifyAndCompare('-28*(z/-4z)', '7')
    simplifyAndCompare('(x^2 + 2x)*x', '2*x^2 + x^3')
    simplifyAndCompare('x + y/z', 'x + y/z') // avoid overzealous '(x+y*z)/z'
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

  it('should respect context changes to operator properties', function () {
    const optsNCM = { context: { multiply: { commutative: false } } }
    simplifyAndCompare('x*y+y*x', 'x*y+y*x', {}, optsNCM)
    simplifyAndCompare('x*y-y*x', 'x*y-y*x', {}, optsNCM)
    simplifyAndCompare('x*5', 'x*5', {}, optsNCM)
    simplifyAndCompare('x*y*x^(-1)', 'x*y*x^(-1)', {}, optsNCM)
    simplifyAndCompare('x*y/x', 'x*y*x^(-1)', {}, optsNCM)
    simplifyAndCompare('x*y*(1/x)', 'x*y*x^(-1)', {}, optsNCM)

    const optsNAA = { context: { add: { associative: false } } }
    simplifyAndCompare(
      'x + (-x+y)', 'x + (y-x)', {}, optsNAA, { parenthesis: 'all' })
  })

  it('performs other simplifications in unrelated contexts', function () {
    const optsNCM = { context: { multiply: { commutative: false } } }
    simplifyAndCompare('x-(y-y+x)', '0', {}, optsNCM)

    const optsNAA = { context: { add: { associative: false } } }
    simplifyAndCompare('3+x', 'x+3', {}, optsNAA)
    simplifyAndCompare('x*y - y*x', '0', {}, optsNAA)
    simplifyAndCompare('x-(y-y+x)', '0', {}, optsNAA)

    const optsNAANCM = {
      context: {
        add: { associative: false },
        multiply: { commutative: false }
      }
    }
    simplifyAndCompare('x-(y-y+x)', '0', {}, optsNAANCM)
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

    // eslint-disable-next-line mocha/no-skipped-tests
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

  describe('should simplify fraction where denominator has a minus', function () {
    it('unary numerator and unary denominator', function () {
      simplifyAndCompare('1/(-y)', '-(1/y)')
      simplifyAndCompare('x/(-y)', '-(x/y)')
      simplifyAndCompare('(-1)/(-y)', '1/y')
      simplifyAndCompare('(-x)/(-y)', 'x/y')
    })

    it('binary numerator and unary denominator', function () {
      simplifyAndCompare('(1+x)/(-y)', '-((x+1)/y)')
      simplifyAndCompare('(w+x)/(-y)', '-((w+x)/y)')
      simplifyAndCompare('(1-x)/(-y)', '(x-1)/y')
      simplifyAndCompare('(w-x)/(-y)', '(x-w)/y')
    })

    it('unary numerator and binary denominator', function () {
      simplifyAndCompare('1/(-(y+z))', '-(1/(y+z))')
      simplifyAndCompare('x/(-(y+z))', '-(x/(y+z))')
      simplifyAndCompare('(-1)/(-(y+z))', '1/(y+z)')
      simplifyAndCompare('(-x)/(-(y+z))', 'x/(y+z)')

      simplifyAndCompare('1/(-(y-z))', '1/(z-y)')
      simplifyAndCompare('x/(-(y-z))', 'x/(z-y)')
      simplifyAndCompare('(-1)/(-(y-z))', '-(1/(z-y))')
      simplifyAndCompare('(-x)/(-(y-z))', '-(x/(z-y))')
    })

    it('binary numerator and binary denominator', function () {
      simplifyAndCompare('(1+x)/(-(y+z))', '-((x+1)/(y+z))')
      simplifyAndCompare('(w+x)/(-(y+z))', '-((w+x)/(y+z))')
      simplifyAndCompare('(1-x)/(-(y+z))', '(x-1)/(y+z)')
      simplifyAndCompare('(w-x)/(-(y+z))', '(x-w)/(y+z)')

      simplifyAndCompare('(1+x)/(-(y-z))', '(x+1)/(z-y)')
      simplifyAndCompare('(w+x)/(-(y-z))', '(w+x)/(z-y)')
      simplifyAndCompare('(1-x)/(-(y-z))', '(1-x)/(z-y)')
      simplifyAndCompare('(w-x)/(-(y-z))', '(w-x)/(z-y)')
    })
  })

  function assertAlike (a, b) { // OK if both NaN or deepEqual
    if (isNaN(a)) {
      assert(isNaN(b))
    } else {
      assert.deepEqual(a, b)
    }
  }

  it('should preserve values according to context', function () {
    const realContext = { context: math.simplify.realContext }
    const positiveContext = { context: math.simplify.positiveContext }
    simplifyAndCompare('x/x', 'x/x', {}, realContext)
    simplifyAndCompare('x/x', '1', {}, positiveContext)
    simplifyAndCompare('x-x', '0', {}, positiveContext)
    simplifyAndCompare('x-2*x', 'x-2*x', {}, positiveContext)
    simplifyAndCompare('+x+abs(x)', '2*x', {}, positiveContext)

    const id = x => x
    const sel = (x, y, z, w) => z
    const zeroes = { x: 0, y: 0, z: 0, w: 0, n: 0, foo: id, myMultiArg: sel }
    const negones = {}
    const ones = {}
    const twos = {}
    for (const vr in zeroes) {
      if (typeof zeroes[vr] === 'number') {
        negones[vr] = -1
        ones[vr] = 1
        twos[vr] = 2
      } else {
        negones[vr] = zeroes[vr]
        ones[vr] = zeroes[vr]
        twos[vr] = zeroes[vr]
      }
    }

    for (const textExpr of expLibrary) {
      const expr = math.parse(textExpr)
      const realex = math.simplify(expr, {}, realContext)
      const posex = math.simplify(expr, {}, positiveContext)
      assertAlike(expr.evaluate(zeroes), realex.evaluate(zeroes))
      assertAlike(expr.evaluate(negones), realex.evaluate(negones))
      assertAlike(expr.evaluate(ones), realex.evaluate(ones))
      assertAlike(expr.evaluate(twos), realex.evaluate(twos))
      assertAlike(expr.evaluate(ones), posex.evaluate(ones))
      assertAlike(expr.evaluate(twos), posex.evaluate(twos))
    }
    // Make sure at least something is not equal
    const expr = math.parse('x/x')
    const posex = math.simplify(expr, {}, positiveContext)
    assert(!isNaN(posex.evaluate(zeroes)))
    assert.notEqual(expr.evaluate(zeroes), posex.evaluate(zeroes))
  })
})
