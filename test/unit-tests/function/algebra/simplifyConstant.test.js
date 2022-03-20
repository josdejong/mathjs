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

  it('should evaluate constant subexpressions', () => {
    testSimplifyConstant('2+2', '4')
    testSimplifyConstant('x+3*5', 'x + 15')
    testSimplifyConstant('f(sin(0))', 'f(0)')
    testSimplifyConstant('[10/2, y, 8-4]', '[5, y, 4]')
  })

  it('should by default convert decimals into fractions', () => {
    testSimplifyConstant('0.5 x', '1 / 2 x')
  })

  it('should coalesce constants in a multi-argument expression', () => {
    testSimplifyConstant('3 + x + 7 + y', '10 + x + y')
    testSimplifyConstant('3 * x * 7 * y', '21 * x * y')
  })

  it('should respect simplify options', () => {
    testSimplifyConstant('0.5 x', '0.5 * x', { implicit: 'show' },
      { exactFractions: false })
    testSimplifyConstant('0.001 x', '0.001 * x', { implicit: 'show' },
      { fractionsLimit: 999 })
    testSimplifyConstant('3 * x * 7 * y', '3 * x * 7 * y', {},
      { context: { multiply: { commutative: false } } })
  })
})
