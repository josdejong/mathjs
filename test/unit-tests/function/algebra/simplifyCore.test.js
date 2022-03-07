// test simplifyCore
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('simplifyCore', function () {
  const testSimplifyCore = function (expr, expected, opts = {}) {
    const actual = math.simplifyCore(math.parse(expr)).toString(opts)
    assert.strictEqual(actual, expected)
  }

  it('should handle different node types', function () {
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
    testSimplifyCore('[x+0,1*y,z*0]', '[x, y, 0]')
    testSimplifyCore('(a+b+0)[n*0+1,-(n)]', '(a + b)[1, -n]')
    testSimplifyCore('{a:x*1, b:y-0}', '{"a": x, "b": y}')
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

  it('folds constants', function () {
    testSimplifyCore('1+2', '3')
    testSimplifyCore('2*3', '6')
    testSimplifyCore('2-3', '-1')
    testSimplifyCore('3/2', '1.5')
    testSimplifyCore('3^2', '9')
  })

  it('should convert +unaryMinus to subtract', function () {
    const result = math.simplify(
      'x + y + a', [math.simplifyCore], { a: -1 }
    ).toString()
    assert.strictEqual(result, 'x + y - 1')
  })

  it('should recurse through arbitrary binary operators', () => {
    testSimplifyCore('x+0==5', 'x == 5')
    testSimplifyCore('(x*1) % (y^1)', 'x % y')
  })
})
