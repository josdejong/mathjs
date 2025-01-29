// test simplifyCore
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('simplifyCore', function () {
  const testSimplifyCore = function (expr, expected, opts = {}, simpOpts = {}) {
    let actual = math.simplifyCore(math.parse(expr), simpOpts).toString(opts)
    assert.strictEqual(actual, expected)
    actual = math.simplifyCore(expr, simpOpts).toString(opts)
    assert.strictEqual(actual, expected)
  }

  it('should handle different node types', function () {
    testSimplifyCore('5*x*3', '3 * 5 * x')
    testSimplifyCore('5*x*3*x', '3 * 5 * x * x')

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
    testSimplifyCore('~~(a | b)', 'a | b')
    testSimplifyCore('not (not (p and q))', 'p and q')
    testSimplifyCore('1 and not done', 'not done')
    testSimplifyCore('false and you(know, it)', 'false')
    testSimplifyCore('you(know, it) and false', 'false')
    testSimplifyCore('(p or q) and "you"', 'p or q')
    testSimplifyCore('something and ""', 'false')
    testSimplifyCore('false or not(way)', 'not way')
    testSimplifyCore('6 or dozen/2', 'true')
    testSimplifyCore('(a and b) or 0', 'a and b')
    testSimplifyCore('consequences or true', 'true')
    testSimplifyCore('true or true', 'true')
    testSimplifyCore('1 or 2', 'true')
    testSimplifyCore('0 or 2', 'true')
    testSimplifyCore('2 or 0', 'true')
    testSimplifyCore('true and true', 'true')
    testSimplifyCore('2 and 2', 'true')
    testSimplifyCore('0 and 2', 'false')
    testSimplifyCore('2 and 0', 'false')
    testSimplifyCore('(1*x + y*0)*1+0', 'x')
    testSimplifyCore('sin(x+0)*1', 'sin(x)')
    testSimplifyCore('((x+0)*1)', 'x')
    testSimplifyCore('sin((x-0)*1+y*0)', 'sin(x)')
    testSimplifyCore('[x+0,1*y,z*0]', '[x, y, 0]')
    testSimplifyCore('(a+b+0)[n*0+1,-(n)]', '(a + b)[1, -n]')
    testSimplifyCore('{a:x*1, b:y-0}', '{"a": x, "b": y}')
  })

  it('should not alter order of multiplication when noncommutative', function () {
    testSimplifyCore('5*x*3', '5 * x * 3', {}, { context: { multiply: { commutative: false } } })
  })

  it('should remove any trivial function', function () {
    testSimplifyCore('foo(y)', 'y', {}, { context: { foo: { trivial: true } } })
  })

  it('strips ParenthesisNodes (implicit in tree)', function () {
    testSimplifyCore('((x)*(y))', 'x * y')
    testSimplifyCore('((x)*(y))^1', 'x * y')
    testSimplifyCore('x*(y+z)', 'x * (y + z)')
    testSimplifyCore('x+(y+z)+w', 'x + y + z + w')
    // But it doesn't actually change the association internally:
    testSimplifyCore('x+ y+z +w', '((x + y) + z) + w', { parenthesis: 'all' })
    testSimplifyCore('x+(y+z)+w', '(x + (y + z)) + w', { parenthesis: 'all' })
  })

  it('should convert +unaryMinus to subtract', function () {
    testSimplifyCore('x + -1', 'x - 1')
    const result = math.simplify(
      'x + y + a', [math.simplifyCore], { a: -1 }
    ).toString()
    assert.strictEqual(result, 'x + y - 1')
  })

  it('should recurse through arbitrary binary operators', function () {
    testSimplifyCore('x+0==5', 'x == 5')
    testSimplifyCore('(x*1) % (y^1)', 'x % y')
  })

  it('converts functions to their corresponding infix operators', function () {
    testSimplifyCore('add(x, y)', 'x + y')
    testSimplifyCore('mod(x, 5)', 'x mod 5')
    testSimplifyCore('to(5 cm, in)', '5 cm to in')
    testSimplifyCore('ctranspose(M)', "M'")
  })

  it('continues to simplify after function -> operator conversion', function () {
    testSimplifyCore('add(multiply(x, 0), y)', 'y')
    testSimplifyCore('and(multiply(1, x), true)', 'x and true')
    testSimplifyCore('add(x, 0 ,y)', 'x + y')
  })

  it('can perform sequential distinct core simplifications', function () {
    testSimplifyCore('0 - -x', 'x')
    testSimplifyCore('0 - (x - y)', 'y - x')
    testSimplifyCore('a + -0', 'a')
    testSimplifyCore('-(-x - y)', 'y + x')
  })
})
