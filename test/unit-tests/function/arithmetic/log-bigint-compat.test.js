// Regression tests for bigint + high-precision floating point arithmetic (#3539)
import assert from 'assert'

import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'

describe('log-bigint-compat', function () {
  it('log10(0n) returns -Infinity (no crash)', function () {
    assert.strictEqual(math.log10(0n), -Infinity)
  })

  describe('with number: bigint and numberFallback: BigNumber', function () {
    const m = math.create({
      number: 'bigint',
      numberFallback: 'BigNumber',
      precision: 80
    })

    it('log returns BigNumber for positive bigint', function () {
      const r = m.log(123n)
      assert.strictEqual(m.typeOf(r), 'BigNumber')
      // sanity: compare to double for closeness (not equality)
      approxDeepEqual(Number(r.toString()), Math.log(123))
    })

    it('log10(10n) -> BigNumber(1)', function () {
      const r = m.log10(10n)
      assert.strictEqual(m.typeOf(r), 'BigNumber')
      assert.deepStrictEqual(r, m.bignumber(1))
    })

    it('log2(1024n) -> BigNumber(10)', function () {
      const r = m.log2(1024n)
      assert.strictEqual(m.typeOf(r), 'BigNumber')
      assert.deepStrictEqual(r, m.bignumber(10))
    })

    it('floor(log10(1n)) -> BigNumber(0) without round error', function () {
      const r = m.floor(m.log10(1n))
      assert.strictEqual(m.typeOf(r), 'BigNumber')
      assert.deepStrictEqual(r, m.bignumber(0))
    })

    it('negative bigint: predictable true -> NaN', function () {
      const mp = m.create({ predictable: true })
      const r = mp.log(-5n)
      assert.strictEqual(typeof r, 'number')
      assert.ok(Number.isNaN(r))
    })

    it('negative bigint: predictable false -> Complex (downgraded)', function () {
      const r = m.log(-5n)
      assert.strictEqual(m.typeOf(r), 'Complex')
    })
  })

  describe('with number: bigint and numberFallback: number', function () {
    const m = math.create({
      number: 'bigint',
      numberFallback: 'number'
    })

    it('promoteLogarithm path returns JS numbers', function () {
      // log2 of a big power should be exact
      assert.strictEqual(m.log2(2n ** 70n), 70)
      // log10 of 10^16
      assert.strictEqual(m.log10(10n ** 16n), 16)
    })
  })
})
