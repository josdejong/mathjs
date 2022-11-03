// test simplifyConstant
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('simplifyConstant', function () {
  const testSimplifyConstant = function (expr, expected, opts = {}, simpOpts = {}) {
    let actual = math.simplifyConstant(math.parse(expr), simpOpts).toString(opts)
    assert.strictEqual(actual, expected)
    actual = math.simplifyConstant(expr, simpOpts).toString(opts)
    assert.strictEqual(actual, expected)
  }

  it('should evaluate constant subexpressions', function () {
    testSimplifyConstant('2+2', '4')
    testSimplifyConstant('x+3*5', 'x + 15')
    testSimplifyConstant('f(sin(0))', 'f(0)')
    testSimplifyConstant('[10/2, y, 8-4]', '[5, y, 4]')
  })

  it('should by default convert decimals into fractions', function () {
    testSimplifyConstant('0.5 x', '1 / 2 x')
  })

  describe('should coalesce constants in a multi-argument expression', function () {
    it('in the default context', function () {
      testSimplifyConstant('3 + x + 7 + y', '10 + x + y')
      testSimplifyConstant('3 * x * 7 * y', '21 * x * y')

      // including an 'unevaluable' constant
      // todo?: output here not currently as expected; instead outputting as '9 + "foo" + 11'.
      // testSimplifyConstant('2 + 7 + "foo" + 3 + 8', '20 + "foo"')
    })

    it('in non-commutative contexts', function () {
      const context = {
        add: { commutative: false },
        multiply: { commutative: false }
      }
      const opts = { context }

      // leading consts.
      testSimplifyConstant('2 + 2 + a', '4 + a', undefined, opts)
      testSimplifyConstant('2 * 2 * b', '4 * b', undefined, opts)
      // trailing consts.
      testSimplifyConstant('a + 3 + 2', 'a + 5', undefined, opts)
      testSimplifyConstant('a * 3 * 2', 'a * 6', undefined, opts)
      // 'wedged' constants
      testSimplifyConstant('a + 3 + 2 + a + 4 + 4 + b', 'a + 5 + a + 8 + b', undefined, opts)
      testSimplifyConstant('c * 3 * 2 * d * 4 * 1 * d', 'c * 6 * d * 4 * d', undefined, opts)

      // including an 'unevaluable' constant
      testSimplifyConstant('2 + 7 + "foo" + 3 + 8', '9 + "foo" + 11', undefined, opts)
      // collapsing of constants with a 'falsy' value (e.g. '0')
      testSimplifyConstant('a + 0 + 7 + b', 'a + 7 + b', undefined, opts)

      // note:
      // - tests with inverses of commutative operations. will not be as expected (i.e. 'fully
      // simplified') if passed directly to simplifyConstant, and further they should not be needed.
      // In the absence of prior application of standard rules which flatten substraction and division
      // ops. (such as rule 'n / n1 -> n * n1 ^ (-1)' for div. and 'n - n1 -> n + -n1' for
      // subtraction), constant args are not 'flattened' and consequently included in 'multi-arg
      // expressions', therefore prohibiting evaluation of adjacent constants (in a non-commutative
      // context) here.
    })
  })

  it('should respect simplify options', function () {
    testSimplifyConstant('0.5 x', '0.5 * x', { implicit: 'show' },
      { exactFractions: false })
    testSimplifyConstant('0.001 x', '0.001 * x', { implicit: 'show' },
      { fractionsLimit: 999 })
    testSimplifyConstant('3 * x * 7 * y', '3 * x * 7 * y', {},
      { context: { multiply: { commutative: false } } })
  })
})
