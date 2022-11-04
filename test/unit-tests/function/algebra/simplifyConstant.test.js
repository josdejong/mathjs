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
      // note: output here not currently as expected/desired  ( '20 + "foo"' )
      testSimplifyConstant('2 + 7 + "foo" + 3 + 8', '9 + "foo" + 11')

      // (^ todo (FIX): constant evaluation (in the default context) should be able to simplify all
      // evaluable constants in a multi-arg expression containing a non evaluable/collapsable
      // constant such as 'foo')
    })

    it('in non-commutative contexts', function () {
      const context = {
        add: { commutative: false },
        multiply: { commutative: false }
      }
      const opts = { context }

      /*
       * Exprs. with non-constants/symbols
      */
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

      // TODO: implement support for simplification of constant sub-expressions for inverses of
      // commutative ops. (i.e. addition/subtraction), in cases for expressions with leading
      // symbols, and with 'wedged' constants. Expected behaviour is illustrated with todo-tests
      // below.
      // - note that these tests are only apt for this block (multi arg expressions) if
      // simplifyConstant is later able to flatten inverse commutative binary ops
      // - for all of the following tests, output remains unchanged
      // testSimplifyConstant('a + 2 - 2', 'a', undefined, opts)
      // testSimplifyConstant('b + 4 - 2 - 1 + b', 'b + 1 + b', undefined, opts)
      // testSimplifyConstant('c * 6 / 3', 'c * 2', undefined, opts)
      // testSimplifyConstant('c * 1 / 1 * 3 * d', 'c * 3 * d', undefined, opts)
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
